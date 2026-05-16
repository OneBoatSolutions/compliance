import { randomUUID } from "node:crypto";
import path from "node:path";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { signedDownloadUrlExpiresInSeconds } from "@/lib/validations/evidence";

interface UploadInput {
  buffer: Buffer;
  mimeType: string;
  originalName: string;
}

interface UploadOptions {
  keyPrefix?: string;
}

interface UploadResult {
  key: string;
  url: string;
}

function normalizeMinioEndpoint(endpoint?: string) {
  const trimmed = endpoint?.trim();
  if (!trimmed) {
    return "http://localhost:9000";
  }

  try {
    const url = new URL(trimmed);
    if (url.hostname === "localhost" && url.port === "9001") {
      url.port = "9000";
      return url.toString().replace(/\/$/, "");
    }

    if (!url.port) {
      url.port = "9000";
    }

    return url.toString().replace(/\/$/, "");
  } catch {
    return trimmed.replace(/:9001(?=\/|$)/, ":9000").replace(/\/$/, "");
  }
}

const isMinioConfigured = Boolean(process.env.MINIO_ENDPOINT || process.env.MINIO_BUCKET);

const region = process.env.AWS_REGION || "us-east-1";
const minioEndpoint = normalizeMinioEndpoint(process.env.MINIO_ENDPOINT);
const bucketName = isMinioConfigured
  ? process.env.MINIO_BUCKET || process.env.S3_BUCKET_NAME
  : process.env.S3_BUCKET_NAME;

if (!bucketName) {
  throw new Error("S3_BUCKET_NAME (or MINIO_BUCKET) environment variable is not set");
}

const s3Client = new S3Client({
  region,
  endpoint: isMinioConfigured ? minioEndpoint : undefined,
  forcePathStyle: isMinioConfigured,
  credentials: isMinioConfigured
    ? {
        accessKeyId: process.env.MINIO_ACCESS_KEY || "",
        secretAccessKey: process.env.MINIO_SECRET_KEY || "",
      }
    : process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
      ? {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        }
      : undefined,
});

function normalizeFilename(input: string) {
  return input.replace(/[^a-zA-Z0-9._-]/g, "_");
}

function buildObjectKey(originalName: string, keyPrefix: string) {
  const ext = path.extname(originalName);
  const base = path.basename(originalName, ext);
  const normalizedBase = normalizeFilename(base) || "file";
  const normalizedPrefix = keyPrefix.replace(/\/+$/g, "").replace(/^\/+/, "");
  return `${normalizedPrefix}/${Date.now()}-${randomUUID()}-${normalizedBase}${ext.toLowerCase()}`;
}

function buildCanonicalUrl(key: string) {
  if (isMinioConfigured) {
    return `${minioEndpoint}/${bucketName}/${key}`;
  }

  return `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
}

export async function uploadFileToStorage(
  input: UploadInput,
  options: UploadOptions = {},
): Promise<UploadResult> {
  const keyPrefix = options.keyPrefix ?? "evidence";
  const key = buildObjectKey(input.originalName, keyPrefix);
  const startedAt = Date.now();

  const abortController = new AbortController();
  const timeoutMs = 15000;
  const timeoutHandle = setTimeout(() => {
    abortController.abort(new Error(`S3 upload timed out after ${timeoutMs}ms`));
  }, timeoutMs);

  try {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: input.buffer,
        ContentType: input.mimeType,
      }),
      { abortSignal: abortController.signal },
    );
  } catch (error) {
    console.error("[storage] PutObjectCommand send failed", error);
    throw error;
  } finally {
    clearTimeout(timeoutHandle);
  }

  return {
    key,
    url: buildCanonicalUrl(key),
  };
}

export async function generateSignedDownloadUrl(key: string) {
  return await getSignedUrl(
    s3Client,
    new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    }),
    { expiresIn: signedDownloadUrlExpiresInSeconds },
  );
}

export async function deleteFileFromStorage(key: string) {
  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    }),
  );
}

export function extractStorageKeyFromUrl(fileUrl: string): string | null {
  try {
    const url = new URL(fileUrl);
    const normalizedPath = url.pathname.replace(/^\/+/, "");

    if (!normalizedPath) {
      return null;
    }

    if (isMinioConfigured) {
      const bucketPrefix = `${bucketName}/`;
      if (normalizedPath.startsWith(bucketPrefix)) {
        return normalizedPath.slice(bucketPrefix.length);
      }
    }

    const segments = normalizedPath.split("/").filter(Boolean);
    if (segments.length === 0) {
      return null;
    }

    if (segments.length >= 2 && segments[0] === bucketName) {
      return segments.slice(1).join("/");
    }

    return segments.join("/");
  } catch {
    return null;
  }
}
