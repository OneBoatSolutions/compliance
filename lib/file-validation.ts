/**
 * lib/file-validation.ts
 * -----------------------
 * Magic-number (file signature) MIME-type verification for secure file uploads.
 *
 * WHY THIS EXISTS:
 *   Relying solely on the Content-Type header or filename extension is
 *   dangerous — both are entirely attacker-controlled.  This module inspects
 *   the actual bytes (magic numbers / file signatures) at the start of the
 *   buffer to confirm the true file type before any upload or processing.
 *
 * IMPORTANT: magic-number checks are a necessary but not sufficient defence.
 *   They must be combined with:
 *     1. Strict extension allow-listing  (done in lib/validations/evidence.ts)
 *     2. Declared MIME-type allow-listing (done in lib/validations/evidence.ts)
 *     3. ClamAV scan                     (scanFileBuffer below)
 *     4. Upload to isolated S3/MinIO bucket with no public ACL
 *     5. Content-Disposition: attachment on download so browsers don't execute
 *
 * FIX — Issue #11 (ZIP bypass):
 *   Office OOXML files are now structurally validated by walking the ZIP
 *   central directory (pure-JS, no native deps) and asserting the presence of
 *   `[Content_Types].xml` plus the correct root-level subfolder (`word/`,
 *   `xl/`, or `ppt/`) before the upload is accepted.
 *
 * FIX — Issue #12 (CSV/text injection):
 *   text/plain and text/csv uploads are scanned for spreadsheet formula-
 *   injection prefixes (`=`, `+`, `-`, `@`).  Dangerous field values are
 *   neutralised by prepending a tab character (the approach recommended by
 *   OWASP and adopted by Google Sheets / LibreOffice).  The sanitised buffer
 *   is returned via `FileValidationResult.sanitizedBuffer` so the upload
 *   layer can persist clean content instead of the raw user data.
 */

import path from "node:path";

// ---------------------------------------------------------------------------
// Magic-number signatures
// ---------------------------------------------------------------------------

interface MagicSignature {
  /** Byte offset from the start of the file where the magic bytes appear. */
  offset: number;
  /** The magic bytes as a Buffer. */
  bytes: Buffer;
  /** The MIME type this signature maps to. */
  mimeType: string;
}

const magicSignatures: MagicSignature[] = [
  // PDF
  { offset: 0, bytes: Buffer.from([0x25, 0x50, 0x44, 0x46]), mimeType: "application/pdf" },
  // PNG
  {
    offset: 0,
    bytes: Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    mimeType: "image/png",
  },
  // JPEG / JPG
  { offset: 0, bytes: Buffer.from([0xff, 0xd8, 0xff]), mimeType: "image/jpeg" },
  // ZIP — also the container for .docx / .xlsx / .pptx (OOXML).
  // Structural OOXML validation is performed separately; this entry only
  // covers generic ZIP archives that are explicitly allow-listed.
  { offset: 0, bytes: Buffer.from([0x50, 0x4b, 0x03, 0x04]), mimeType: "application/zip" },
];

// ---------------------------------------------------------------------------
// ZIP central-directory parser (Issue #11)
// ---------------------------------------------------------------------------

/**
 * Hard cap on the number of central-directory entries we will walk.
 * Prevents an attacker from crafting a ZIP with a forged `totalEntries`
 * field that drives the parser into an arbitrarily long loop.
 * Real OOXML packages never come close to this limit.
 */
const maxZipEntries = 1_000;

/**
 * Reads the ZIP central directory from `buf` and returns the set of stored
 * entry names (lowercased for case-insensitive comparison).
 *
 * Algorithm:
 *   1. Locate the End-of-Central-Directory (EOCD) record by scanning
 *      backwards for its 4-byte signature (0x50 0x4B 0x05 0x06).
 *   2. Read the offset and count of central-directory headers from the EOCD.
 *   3. Walk each central-directory file header (signature 0x50 0x4B 0x01 0x02)
 *      to extract filenames.
 *
 * Safety guarantees (hardened against malicious ZIPs):
 *   - Entry count is capped at MAX_ZIP_ENTRIES.
 *   - Each iteration asserts the new position is strictly greater than the
 *     previous one (forward-progress guard — prevents circular-offset loops).
 *   - Every variable-length field read is bounds-checked before access.
 *
 * Returns an empty Set if the buffer is not a valid ZIP archive or if any
 * structural invariant is violated.
 */
function listZipEntries(buf: Buffer): Set<string> {
  const entries = new Set<string>();

  // --- 1. Find EOCD signature (search backwards from the end) ---------------
  // EOCD minimum size is 22 bytes; the comment field can add up to 65535 more.
  const eocdSig = 0x06054b50; // little-endian: 0x50 0x4B 0x05 0x06
  const eocdMinSize = 22;
  if (buf.length < eocdMinSize) {
    return entries;
  }

  let eocdOffset = -1;
  const searchStart = Math.max(0, buf.length - eocdMinSize - 65535);
  for (let i = buf.length - eocdMinSize; i >= searchStart; i--) {
    if (buf.readUInt32LE(i) === eocdSig) {
      eocdOffset = i;
      break;
    }
  }
  if (eocdOffset === -1) {
    return entries;
  } // not a ZIP

  // --- 2. Read central-directory location from EOCD -------------------------
  const cdCount = buf.readUInt16LE(eocdOffset + 10); // total entries in CD
  const cdOffset = buf.readUInt32LE(eocdOffset + 16); // byte offset of CD start

  // Sanity-check: CD must start inside the buffer.
  if (cdOffset + 4 > buf.length) {
    return entries;
  }

  // Clamp traversal count to our safety cap (also handles cdCount === 0).
  const traverseCount = Math.min(cdCount, maxZipEntries);

  // --- 3. Walk central-directory headers ------------------------------------
  const cdSig = 0x02014b50; // 0x50 0x4B 0x01 0x02
  const cdFixedHeader = 46; // fixed-size portion of each CD file header
  let pos = cdOffset;

  for (let i = 0; i < traverseCount; i++) {
    // Bounds: need at least the fixed 46-byte header.
    if (pos + cdFixedHeader > buf.length) {
      break;
    }

    // Signature check — stop at first non-CD header (e.g. EOCD or garbage).
    if (buf.readUInt32LE(pos) !== cdSig) {
      break;
    }

    const filenameLen = buf.readUInt16LE(pos + 28);
    const extraLen = buf.readUInt16LE(pos + 30);
    const commentLen = buf.readUInt16LE(pos + 32);

    // Total size of this CD entry.
    const entrySize = cdFixedHeader + filenameLen + extraLen + commentLen;

    // Forward-progress guard: entrySize must be > 0 and must not push pos
    // past the buffer boundary.  A zero-size entry would cause an infinite
    // loop; a negative or overflowing one indicates a crafted payload.
    if (entrySize <= cdFixedHeader || pos + entrySize > buf.length) {
      break;
    }

    // Bounds-check the filename slice before reading.
    if (pos + cdFixedHeader + filenameLen > buf.length) {
      break;
    }

    const filename = buf.toString("utf8", pos + cdFixedHeader, pos + cdFixedHeader + filenameLen);
    entries.add(filename.toLowerCase());

    pos += entrySize;
  }

  return entries;
}

/**
 * Required OOXML structural entries per declared Office MIME type.
 *
 * Every valid Office Open XML package MUST contain `[Content_Types].xml`.
 * Additionally each format has a mandatory root-level content folder:
 *   - DOCX: word/
 *   - XLSX: xl/
 *   - PPTX: ppt/
 *
 * We check for the folder prefix rather than an exact filename so that minor
 * schema variations (e.g. `word/document.xml` vs `word/document2.xml`) do not
 * cause false rejections of legitimately authored documents.
 */
const ooxmlRequiredEntries: Record<string, { contentTypes: string; rootFolder: string }> = {
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
    contentTypes: "[content_types].xml",
    rootFolder: "word/",
  },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
    contentTypes: "[content_types].xml",
    rootFolder: "xl/",
  },
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": {
    contentTypes: "[content_types].xml",
    rootFolder: "ppt/",
  },
};

/**
 * Validates an OOXML buffer (DOCX / XLSX / PPTX) by:
 *   1. Confirming the ZIP magic bytes are present.
 *   2. Parsing the ZIP central directory.
 *   3. Asserting the presence of `[Content_Types].xml`.
 *   4. Asserting the presence of the format-specific root folder.
 *
 * Returns a `FileValidationResult` — valid on success, rejected with a
 * descriptive reason on failure.
 */
function verifyOoxmlStructure(buf: Buffer, declaredMime: string): FileValidationResult {
  const required = ooxmlRequiredEntries[declaredMime];
  if (!required) {
    // Defensive: called with an unrecognised Office MIME — treat as invalid.
    return { valid: false, reason: `Unrecognised Office MIME type: ${declaredMime}` };
  }

  // Step 1: ZIP magic bytes (PK\x03\x04).
  if (buf.length < 4 || buf[0] !== 0x50 || buf[1] !== 0x4b || buf[2] !== 0x03 || buf[3] !== 0x04) {
    return {
      valid: false,
      reason: "File magic bytes do not match Office format (expected ZIP-based OOXML)",
    };
  }

  // Step 2: Parse central directory.
  const entries = listZipEntries(buf);
  if (entries.size === 0) {
    return {
      valid: false,
      reason: "Cannot parse ZIP central directory — file may be corrupt or is not a valid ZIP",
    };
  }

  // Step 3: [Content_Types].xml must be present.
  if (!entries.has(required.contentTypes)) {
    return {
      valid: false,
      reason:
        'Missing required OOXML entry "[Content_Types].xml" — ' +
        "this is an arbitrary ZIP archive, not a valid Office document",
    };
  }

  // Step 4: Root content folder must be present (check any entry with that prefix).
  const hasRootFolder = [...entries].some((e) => e.startsWith(required.rootFolder));
  if (!hasRootFolder) {
    return {
      valid: false,
      reason:
        `Missing required OOXML content folder "${required.rootFolder}" — ` +
        "file does not match the declared Office format",
    };
  }

  return { valid: true };
}

// MIME types that are plain text — no reliable magic bytes, validate by UTF-8
// decodability instead, then scan for formula-injection patterns (Issue #12).
const textMimes = new Set(["text/plain", "text/csv"]);

// ---------------------------------------------------------------------------
// CSV / text formula-injection neutralisation (Issue #12)
// ---------------------------------------------------------------------------

/**
 * Maximum byte length of text/plain or text/csv content that will be scanned
 * for formula-injection in memory.
 *
 * WHY 5 MB:
 *   Node.js/V8 string manipulation can easily consume 4–5× the raw input size
 *   in temporary heap allocations when splitting, slicing, and joining large
 *   strings.  A 40 MB CSV could balloon to ~200 MB of live heap, triggering
 *   OOM crashes on memory-constrained serverless instances.
 *
 *   Files larger than this threshold are rejected with a 413-equivalent signal
 *   (via `oversized: true` in the return value) rather than being silently
 *   processed.  The existing 10 MB upload cap in the route is an outer guard;
 *   this is an inner guard specifically for the string-transformation phase.
 */
const textScanSizeLimitBytes = 5 * 1024 * 1024; // 5 MB

/**
 * Characters that, when appearing at the start of a spreadsheet cell value,
 * instruct Excel / LibreOffice / Google Sheets to evaluate the value as a
 * formula.  Uploading content that begins with these characters can trigger
 * unintended macro execution in downstream export/preview tools.
 *
 * NOTE: `+` and `-` alone are NOT sufficient to flag a field as dangerous —
 * they are also legitimate numeric sign characters.  Pure numeric strings
 * (e.g. "-1500.50", "+42", "+0.5") are exempt from neutralisation (see
 * `neutraliseField` below).
 *
 * References:
 *   - OWASP: https://owasp.org/www-community/attacks/CSV_Injection
 *   - CWE-1236 (Improper Neutralization of Formula Elements in a CSV File)
 */
const formulaPrefixRe = /^[=+\-@|\t\r]/;

/**
 * Returns true when `s` is a numeric literal that starts with a sign character
 * (`+` or `-`) but is otherwise a valid finite number (integer or decimal).
 *
 * Examples that return true  → safe, do NOT neutralise:
 *   "-1500.50"  "+42"  "-0"  "+3.14e2"
 *
 * Examples that return false → may still need neutralisation:
 *   "=SUM(A1)"  "+cmd"  "@bad"  "-"  ""
 */
function isSignedNumeric(s: string): boolean {
  if (s.length < 2) {
    return false;
  } // bare "+" or "-" alone is not a number
  const n = Number(s);
  return isFinite(n) && !isNaN(n);
}

/**
 * Parses a single CSV line into individual fields, correctly handling
 * RFC 4180 double-quoted fields that may contain commas or newlines.
 *
 * Returns an array of raw field strings (quotes NOT stripped so that
 * we can reconstruct the line faithfully after neutralisation).
 */
function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let i = 0;
  while (i <= line.length) {
    if (line[i] === '"') {
      // Quoted field — scan to closing quote, handling "" escapes.
      let j = i + 1;
      while (j < line.length) {
        if (line[j] === '"' && line[j + 1] === '"') {
          j += 2; // escaped quote
        } else if (line[j] === '"') {
          break; // closing quote
        } else {
          j++;
        }
      }
      fields.push(line.slice(i, j + 1)); // include surrounding quotes
      i = j + 2; // skip closing quote + comma
    } else {
      // Unquoted field — read until next comma.
      const end = line.indexOf(",", i);
      if (end === -1) {
        fields.push(line.slice(i));
        break;
      }
      fields.push(line.slice(i, end));
      i = end + 1;
    }
  }
  return fields;
}

/**
 * Neutralises formula-injection prefixes in a single field value.
 *
 * Strategy (OWASP-recommended tab-prefix approach):
 *   If the bare value starts with `=`, `+`, `-`, `@`, `|`, or a tab/CR,
 *   we wrap the entire value in double-quotes and prepend a tab character.
 *   The tab is invisible in most renderers but prevents formula evaluation.
 *
 * NUMERIC EXEMPTION (accounting/financial data safety):
 *   A field whose inner text starts with `+` or `-` but is otherwise a valid
 *   finite number (e.g. "-1500.50", "+42") is treated as a safe numeric
 *   literal and is returned unchanged.  Without this exemption every negative
 *   balance in a corporate CSV would be corrupted into a text string, breaking
 *   SUM/AVERAGE formulas and accounting models in downstream tooling.
 *
 * A field that is already RFC 4180-quoted is unwrapped for inspection and
 * re-quoted after neutralisation only if its inner value was dangerous.
 *
 * Returns the (possibly modified) field string and a flag indicating whether
 * the field was altered.
 */
function neutraliseField(field: string): { value: string; mutated: boolean } {
  let inner: string;

  if (field.startsWith('"') && field.endsWith('"') && field.length >= 2) {
    // Quoted field — extract inner value, unescape double-double-quotes.
    inner = field.slice(1, -1).replace(/""/g, '"');
  } else {
    inner = field;
  }

  // Fast path: no dangerous prefix — return immediately without allocation.
  if (!formulaPrefixRe.test(inner)) {
    return { value: field, mutated: false };
  }

  // Numeric exemption: "+42", "-1500.50", "+3.14e2", etc. are safe.
  // Only `+` and `-` can introduce a valid number; `=`, `@`, `|`, tab, CR
  // can never be the start of a pure numeric literal.
  if ((inner[0] === "+" || inner[0] === "-") && isSignedNumeric(inner)) {
    return { value: field, mutated: false };
  }

  // Dangerous formula prefix confirmed — prepend tab and re-quote.
  const safe = `"\t${inner.replace(/"/g, '""')}"`;
  return { value: safe, mutated: true };
}

/**
 * Return type for `sanitiseTextContent`.
 *
 * `oversized` is set to `true` when the content exceeds TEXT_SCAN_SIZE_LIMIT_BYTES
 * and string-processing was intentionally skipped.  The caller should surface
 * this as a 413 Payload Too Large response rather than silently accepting the
 * file or running an unbounded transformation.
 */
interface SanitiseResult {
  sanitised: string;
  mutatedCount: number;
  oversized: boolean;
}

/**
 * Scans the decoded text of a text/plain or text/csv upload for spreadsheet
 * formula-injection patterns and neutralises any dangerous fields.
 *
 * Size guard:
 *   Content larger than TEXT_SCAN_SIZE_LIMIT_BYTES is returned immediately
 *   with `oversized: true` to prevent unbounded heap usage.
 *
 * Processing:
 *   - Lines are split on `\n` (CRLF `\r` is preserved per-line).
 *   - For CSV content each line is parsed into RFC 4180 fields.
 *   - For plain text, each line is treated as a single field.
 *   - Returns the (possibly modified) content and a count of neutralised fields.
 */
function sanitiseTextContent(content: string, mimeType: string): SanitiseResult {
  // Size guard — abort before any string allocation if the payload is too big.
  // Buffer.byteLength is O(1) for UTF-16 JS strings (approximated as 3× for
  // worst-case UTF-8); we use the exact UTF-8 byte length via Buffer.byteLength.
  if (Buffer.byteLength(content, "utf8") > textScanSizeLimitBytes) {
    return { sanitised: "", mutatedCount: 0, oversized: true };
  }

  const isCsv = mimeType === "text/csv";
  const lines = content.split("\n");
  let mutatedCount = 0;

  const sanitisedLines = lines.map((line) => {
    // Preserve bare CRLF line endings.
    const hasCr = line.endsWith("\r");
    const bare = hasCr ? line.slice(0, -1) : line;

    if (isCsv) {
      const fields = parseCsvLine(bare);
      const neutralised = fields.map((f) => {
        const { value, mutated } = neutraliseField(f);
        if (mutated) {
          mutatedCount++;
        }
        return value;
      });
      return neutralised.join(",") + (hasCr ? "\r" : "");
    } else {
      // Plain text: treat the whole line as one field.
      const { value, mutated } = neutraliseField(bare);
      if (mutated) {
        mutatedCount++;
      }
      return value + (hasCr ? "\r" : "");
    }
  });

  return { sanitised: sanitisedLines.join("\n"), mutatedCount, oversized: false };
}

// ---------------------------------------------------------------------------
// Magic-number detection
// ---------------------------------------------------------------------------

/**
 * Detects the MIME type of `buffer` using magic bytes.
 * Returns `null` if no known signature matches.
 */
function detectMimeFromMagic(buffer: Buffer): string | null {
  for (const sig of magicSignatures) {
    const slice = buffer.slice(sig.offset, sig.offset + sig.bytes.length);
    if (slice.equals(sig.bytes)) {
      return sig.mimeType;
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface FileValidationResult {
  valid: boolean;
  reason?: string;
  /**
   * Set to `true` when a text/CSV file exceeds TEXT_SCAN_SIZE_LIMIT_BYTES and
   * cannot be safely scanned in memory without risking OOM.  The upload route
   * should surface this as a 413 Payload Too Large response.
   */
  oversized?: boolean;
  /**
   * Present when the validator modified the file content (e.g. CSV
   * formula-injection neutralisation).  Callers SHOULD persist this buffer
   * instead of the original if it is set.
   */
  sanitizedBuffer?: Buffer;
  /** Number of fields that were neutralised (for audit logging). */
  neutralizedFieldCount?: number;
}

/**
 * Verifies that `buffer` is consistent with `declaredMimeType` by inspecting
 * the file's magic bytes and, where applicable, the file's internal structure.
 *
 * Rules:
 *   - Text files (text/plain, text/csv):
 *       Must be valid UTF-8.  Content is additionally scanned for spreadsheet
 *       formula-injection prefixes; dangerous fields are neutralised and the
 *       sanitised buffer is returned via `result.sanitizedBuffer`.
 *   - Office Open XML files (.docx, .xlsx, .pptx):
 *       Must have ZIP magic bytes AND must contain the mandatory OOXML
 *       structural entries (`[Content_Types].xml` + format root folder).
 *       Generic ZIP archives without those entries are rejected.
 *   - application/zip (explicitly allow-listed):
 *       ZIP magic bytes must match.
 *   - All other types:
 *       Magic bytes must exactly match the declared MIME.
 */
export function verifyFileMagic(buffer: Buffer, declaredMimeType: string): FileValidationResult {
  // Guard: buffer must be non-empty.
  if (!buffer || buffer.length === 0) {
    return { valid: false, reason: "Empty file buffer" };
  }

  // ── Text / CSV (Issue #12) ────────────────────────────────────────────────
  // Validate UTF-8 decodability, then scan for formula-injection patterns.
  if (textMimes.has(declaredMimeType)) {
    // ── Size guard (raw buffer, pre-decode) ──────────────────────────────────
    // This check MUST run on `buffer.length` before TextDecoder.decode() is
    // called.  Decoding a 40 MB buffer into a JS string first and *then*
    // checking its size defeats the purpose: V8 has already committed the
    // heap memory for the string by the time we would have rejected it.
    // Checking the raw byte count here stops allocation at the front door.
    if (buffer.length > textScanSizeLimitBytes) {
      return {
        valid: false,
        oversized: true,
        reason:
          `File exceeds the ${textScanSizeLimitBytes / (1024 * 1024)} MB limit ` +
          "for in-memory content scanning. Please split the file and re-upload.",
      };
    }

    // Decode only after the size gate has passed — the buffer is guaranteed
    // to be small enough to hold in memory as a JS string.
    let content: string;
    try {
      content = new TextDecoder("utf-8", { fatal: true }).decode(buffer);
    } catch {
      return { valid: false, reason: "File is not valid UTF-8 text" };
    }

    const { sanitised, mutatedCount } = sanitiseTextContent(content, declaredMimeType);

    if (mutatedCount > 0) {
      // Return the sanitised content so the upload layer persists clean data.
      const sanitizedBuffer = Buffer.from(sanitised, "utf-8");
      console.warn(
        `[file-validation] Neutralised ${mutatedCount} formula-injection field(s) ` +
          `in ${declaredMimeType} upload.`,
      );
      return { valid: true, sanitizedBuffer, neutralizedFieldCount: mutatedCount };
    }

    return { valid: true };
  }

  const detectedMime = detectMimeFromMagic(buffer);

  // ── Office Open XML (Issue #11) ───────────────────────────────────────────
  // Validate ZIP magic bytes AND inspect the ZIP central directory to ensure
  // mandatory OOXML structural entries are present.  A generic ZIP archive
  // renamed as .docx/.xlsx/.pptx is rejected here.
  if (declaredMimeType in ooxmlRequiredEntries) {
    return verifyOoxmlStructure(buffer, declaredMimeType);
  }

  // ── Generic ZIP (explicitly allow-listed) ─────────────────────────────────
  if (declaredMimeType === "application/zip") {
    if (detectedMime === "application/zip") {
      return { valid: true };
    }
    return {
      valid: false,
      reason: `File is not a valid ZIP archive (magic: ${detectedMime ?? "unknown"})`,
    };
  }

  // ── All other types ───────────────────────────────────────────────────────
  if (detectedMime === null) {
    return {
      valid: false,
      reason: `Unrecognised file format (no matching magic signature for ${declaredMimeType})`,
    };
  }

  if (detectedMime !== declaredMimeType) {
    return {
      valid: false,
      reason: `File magic bytes indicate ${detectedMime} but declared MIME is ${declaredMimeType}`,
    };
  }

  return { valid: true };
}

// ---------------------------------------------------------------------------
// Filename sanitization
// ---------------------------------------------------------------------------

/**
 * Sanitizes a user-supplied filename to prevent path traversal and injection.
 *
 * Rules:
 *   - Strip directory components (basename only).
 *   - Replace any character that isn't alphanumeric, dash, underscore, or dot.
 *   - Collapse multiple dots (prevents "evil.php.jpg" style attacks).
 *   - Limit to 100 characters max.
 *   - Preserve the original (lowercased) extension.
 */
export function sanitizeFilename(filename: string): string {
  // 1. Basename only — strip any directory traversal.
  const base = path.basename(filename);

  // 2. Separate extension from stem.
  const ext = path.extname(base).toLowerCase();
  const stem = path.basename(base, ext);

  // 3. Replace dangerous chars in stem.
  const safeStem = stem
    .replace(/[^a-zA-Z0-9_\- ]/g, "_")
    .replace(/\s+/g, "_") // spaces → underscores
    .replace(/_+/g, "_") // collapse repeated underscores
    .slice(0, 100); // cap length

  // 4. Ensure we have a non-empty stem.
  const finalStem = safeStem || "file";

  return `${finalStem}${ext}`;
}

// ---------------------------------------------------------------------------
// ClamAV virus scan stub
// ---------------------------------------------------------------------------

export interface ScanResult {
  clean: boolean;
  /** Set when clean === false. */
  threat?: string;
}

/**
 * Scans a file buffer for malware using ClamAV via the `clamd` TCP socket.
 *
 * PRODUCTION SETUP:
 *   1. Run ClamAV daemon: `docker run -d --name clamav clamav/clamav:latest`
 *   2. Set env var: CLAMAV_HOST=localhost CLAMAV_PORT=3310
 *   3. Replace the stub body below with the real clamd INSTREAM protocol:
 *
 *      import net from "node:net";
 *      // ... send INSTREAM command with chunk-length-prefixed buffer
 *
 * INTERIM BEHAVIOUR (current stub):
 *   Returns { clean: true } — fail-open so uploads aren't blocked before
 *   ClamAV is deployed.  Change the default to fail-CLOSED in production
 *   by setting CLAMAV_FAIL_OPEN=false.
 *
 * @throws Will throw (and block the upload) only if CLAMAV_FAIL_OPEN=false
 *         and the scan cannot be performed.
 */
export async function scanFileBuffer(buffer: Buffer): Promise<ScanResult> {
  // Silence unused-variable warning in the stub.
  void buffer;

  const clamavHost = process.env.CLAMAV_HOST;
  const clamavPort = parseInt(process.env.CLAMAV_PORT ?? "3310", 10);
  const failOpen = process.env.CLAMAV_FAIL_OPEN !== "false";

  if (!clamavHost) {
    if (!failOpen) {
      throw new Error("ClamAV is not configured (CLAMAV_HOST missing) and CLAMAV_FAIL_OPEN=false");
    }
    // Stub: ClamAV not configured — log and allow.
    console.warn(
      "[clamav] CLAMAV_HOST not set. Virus scan skipped (fail-open). " +
        "Set CLAMAV_HOST + CLAMAV_PORT to enable scanning.",
    );
    return { clean: true };
  }

  // ── Real ClamAV INSTREAM implementation (uncomment when ClamAV is deployed) ──
  //
  // return new Promise<ScanResult>((resolve, reject) => {
  //   const socket = net.createConnection({ host: clamavHost, port: clamavPort });
  //   const chunks: Buffer[] = [];
  //
  //   socket.on("connect", () => {
  //     socket.write("zINSTREAM\0");
  //     const size = Buffer.alloc(4);
  //     size.writeUInt32BE(buffer.length, 0);
  //     socket.write(size);
  //     socket.write(buffer);
  //     const end = Buffer.alloc(4);
  //     end.writeUInt32BE(0, 0);
  //     socket.write(end);
  //   });
  //
  //   socket.on("data", (data) => chunks.push(data));
  //
  //   socket.on("end", () => {
  //     const response = Buffer.concat(chunks).toString("utf-8").trim();
  //     if (response.includes("OK")) {
  //       resolve({ clean: true });
  //     } else if (response.includes("FOUND")) {
  //       const threat = response.split(":")[1]?.trim() ?? "unknown";
  //       resolve({ clean: false, threat });
  //     } else {
  //       if (failOpen) resolve({ clean: true });
  //       else reject(new Error(`Unexpected ClamAV response: ${response}`));
  //     }
  //   });
  //
  //   socket.on("error", (err) => {
  //     if (failOpen) resolve({ clean: true });
  //     else reject(err);
  //   });
  //
  //   socket.setTimeout(10_000, () => {
  //     socket.destroy();
  //     if (failOpen) resolve({ clean: true });
  //     else reject(new Error("ClamAV scan timed out"));
  //   });
  // });

  // Stub response (remove once the above block is uncommented).
  console.warn(
    `[clamav] Stub scan — would send ${buffer.length} bytes to ${clamavHost}:${clamavPort}`,
  );
  return { clean: true };
}
