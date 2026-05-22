import { Readable } from "node:stream";
import { ServerResponse, type IncomingHttpHeaders, type IncomingMessage } from "node:http";
import type { ReadableStream as NodeReadableStream } from "node:stream/web";
import multer from "multer";
import { errorResponse } from "@/lib/api-helpers";
import {
  isAllowedEvidenceExtension,
  isAllowedEvidenceMimeType,
  maxEvidenceFileSizeBytes,
  maxEvidenceFilesPerItem,
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
    fileSize: maxEvidenceFileSizeBytes,
    files: maxEvidenceFilesPerItem,
  },
  fileFilter: (
    req: IncomingMessage,
    file: { mimetype: string; originalname: string },
    cb: (error: Error | null, acceptFile?: boolean) => void,
  ) => {
    if (
      !isAllowedEvidenceMimeType(file.mimetype) ||
      !isAllowedEvidenceExtension(file.originalname)
    ) {
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

  const stream = Readable.fromWeb(req.body as NodeReadableStream<Uint8Array>) as IncomingMessage;
  (stream as IncomingMessage & { headers: IncomingHttpHeaders }).headers =
    requestHeadersToNodeHeaders(req.headers);
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
