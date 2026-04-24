import { Readable } from "node:stream";
import { ServerResponse, type IncomingHttpHeaders, type IncomingMessage } from "node:http";
import multer from "multer";
import { errorResponse } from "@/lib/api-helpers";
import {
  isAllowedEvidenceExtension,
  isAllowedEvidenceMimeType,
  MAX_EVIDENCE_FILE_SIZE_BYTES,
  MAX_EVIDENCE_FILES_PER_ITEM,
} from "@/lib/validations/evidence";

export interface ParsedMultipartFile {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

interface ParseResult {
  files: ParsedMultipartFile[];
  fields: Record<string, string>;
  response?: Response;
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_EVIDENCE_FILE_SIZE_BYTES,
    files: MAX_EVIDENCE_FILES_PER_ITEM,
  },
  fileFilter: (_req, file, cb) => {
    if (!isAllowedEvidenceMimeType(file.mimetype) || !isAllowedEvidenceExtension(file.originalname)) {
      cb(new Error("Unsupported file type"));
      return;
    }
    cb(null, true);
  },
}).any();

function requestHeadersToNodeHeaders(headers: Headers): IncomingHttpHeaders {
  const output: IncomingHttpHeaders = {};
  for (const [key, value] of headers.entries()) {
    output[key.toLowerCase()] = value;
  }
  return output;
}

function toNodeRequest(req: Request): IncomingMessage {
  if (!req.body) {
    throw new Error("Request body is required for multipart parsing");
  }

  const stream = Readable.fromWeb(req.body as ReadableStream) as IncomingMessage;
  (stream as IncomingMessage & { headers: IncomingHttpHeaders }).headers = requestHeadersToNodeHeaders(
    req.headers,
  );
  (stream as IncomingMessage & { method?: string }).method = req.method;
  (stream as IncomingMessage & { url?: string }).url = req.url;
  return stream;
}

export async function parseMultipartRequest(req: Request): Promise<ParseResult> {
  try {
    const nodeReq = toNodeRequest(req) as IncomingMessage & {
      files?: ParsedMultipartFile[];
      body?: Record<string, unknown>;
    };
    const nodeRes = new ServerResponse(nodeReq);

    await new Promise<void>((resolve, reject) => {
      upload(nodeReq as never, nodeRes as never, (err?: unknown) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });

    const fields: Record<string, string> = {};
    for (const [key, value] of Object.entries(nodeReq.body || {})) {
      fields[key] = value === null || value === undefined ? "" : String(value);
    }

    return {
      files: nodeReq.files ?? [],
      fields,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid multipart upload payload";
    const status = message.includes("File too large") ? 413 : 400;
    return { files: [], fields: {}, response: errorResponse(message, status) };
  }
}
