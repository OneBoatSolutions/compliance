import { randomUUID } from "node:crypto";
import path from "node:path";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { SIGNED_DOWNLOAD_URL_EXPIRES_IN_SECONDS } from "@/lib/validations/evidence";

interface UploadInput {
  buffer: Buffer;
  mimeType: string;
  originalName: string;
}

interface UploadResult {
  key: string;
  url: string;
}

const isMinioConfigured = Boolean(process.env.MINIO_ENDPOINT);

const region = process.env.AWS_REGION || "us-east-1";
const bucketName = isMinioConfigured
  ? process.env.MINIO_BUCKET || process.env.S3_BUCKET_NAME
  : process.env.S3_BUCKET_NAME;

if (!bucketName) {
  throw new Error("S3_BUCKET_NAME (or MINIO_BUCKET) environment variable is not set");
}

const s3Client = new S3Client({
  region,
  endpoint: isMinioConfigured ? process.env.MINIO_ENDPOINT : undefined,
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

function buildObjectKey(originalName: string) {
  const ext = path.extname(originalName);
  const base = path.basename(originalName, ext);
  const normalizedBase = normalizeFilename(base) || "file";
  return `evidence/${Date.now()}-${randomUUID()}-${normalizedBase}${ext.toLowerCase()}`;
}

function buildCanonicalUrl(key: string) {
  if (isMinioConfigured && process.env.MINIO_ENDPOINT) {
    return `${process.env.MINIO_ENDPOINT.replace(/\/$/, "")}/${bucketName}/${key}`;
  }

  return `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
}

export async function uploadFileToStorage(input: UploadInput): Promise<UploadResult> {
  const key = buildObjectKey(input.originalName);

  await s3Client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: input.buffer,
      ContentType: input.mimeType,
    }),
  );

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
    { expiresIn: SIGNED_DOWNLOAD_URL_EXPIRES_IN_SECONDS },
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
