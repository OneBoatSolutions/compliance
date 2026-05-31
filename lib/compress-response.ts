import { gzipSync } from "node:zlib";

import { NextResponse } from "next/server";

const defaultMinBytes = 1024;

function parseMinBytes(): number {
  const raw = process.env.API_COMPRESS_MIN_BYTES;
  if (!raw) {
    return defaultMinBytes;
  }

  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : defaultMinBytes;
}

/** Gzip JSON API payloads when the client accepts gzip and the body is large enough. */
export async function maybeCompressJsonResponse(req: Request, response: Response): Promise<Response> {
  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    return response;
  }

  const acceptEncoding = req.headers.get("accept-encoding") ?? "";
  if (!acceptEncoding.includes("gzip")) {
    return response;
  }

  const body = await response.text();
  const byteLength = Buffer.byteLength(body, "utf8");

  if (byteLength < parseMinBytes()) {
    return new NextResponse(body, {
      status: response.status,
      headers: response.headers,
    });
  }

  const compressed = gzipSync(body);
  const headers = new Headers(response.headers);
  headers.set("Content-Encoding", "gzip");
  headers.set("Vary", "Accept-Encoding");
  headers.delete("content-length");

  return new NextResponse(compressed, {
    status: response.status,
    headers,
  });
}
