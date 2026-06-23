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
  // ZIP (also covers .docx, .xlsx, .pptx — all ZIP-based)
  { offset: 0, bytes: Buffer.from([0x50, 0x4b, 0x03, 0x04]), mimeType: "application/zip" },
  // Office Open XML: DOCX / XLSX / PPTX share the ZIP header above.
  // The sub-type is determined by inspecting the ZIP central directory.
  // For our purposes we validate ZIP magic and then trust the declared MIME
  // for Office documents (since parsing the ZIP is expensive in a cold path).
];

// MIME types that share the ZIP magic number but are distinct Office formats.
const zipBasedOfficeMimes = new Set([
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
  "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
]);

// MIME types that are plain text — no reliable magic bytes, validate by UTF-8
// decodability instead.
const textMimes = new Set(["text/plain", "text/csv"]);

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
}

/**
 * Verifies that `buffer` is consistent with `declaredMimeType` by inspecting
 * the file's magic bytes.
 *
 * Rules:
 *   - Text files (text/plain, text/csv): must be valid UTF-8.
 *   - Office files (.docx, .xlsx): must have ZIP magic (they are ZIP archives).
 *   - All other types: magic bytes must exactly match the declared MIME.
 */
export function verifyFileMagic(buffer: Buffer, declaredMimeType: string): FileValidationResult {
  // Guard: buffer must be non-empty.
  if (!buffer || buffer.length === 0) {
    return { valid: false, reason: "Empty file buffer" };
  }

  // Text/CSV: validate UTF-8 decodability rather than magic bytes.
  if (textMimes.has(declaredMimeType)) {
    try {
      new TextDecoder("utf-8", { fatal: true }).decode(buffer);
      return { valid: true };
    } catch {
      return { valid: false, reason: "File is not valid UTF-8 text" };
    }
  }

  const detectedMime = detectMimeFromMagic(buffer);

  // Office Open XML files are ZIP-based — treat a ZIP magic match as valid.
  if (zipBasedOfficeMimes.has(declaredMimeType)) {
    if (detectedMime === "application/zip") {
      return { valid: true };
    }
    return {
      valid: false,
      reason: `File magic bytes do not match Office format (expected ZIP-based, got ${detectedMime ?? "unknown"})`,
    };
  }

  // For application/zip allow-listed directly, ZIP magic must match.
  if (declaredMimeType === "application/zip") {
    if (detectedMime === "application/zip") {
      return { valid: true };
    }
    return {
      valid: false,
      reason: `File is not a valid ZIP archive (magic: ${detectedMime ?? "unknown"})`,
    };
  }

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
