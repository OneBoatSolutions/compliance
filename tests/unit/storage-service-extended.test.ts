import fs from "node:fs";
import path from "node:path";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// Mock AWS SDK before importing the service
vi.mock("@aws-sdk/client-s3", () => {
  const S3ClientMock = vi.fn().mockImplementation(function () {
    return { send: vi.fn() };
  });
  return {
    S3Client: S3ClientMock,
    PutObjectCommand: vi.fn(),
    GetObjectCommand: vi.fn(),
    DeleteObjectCommand: vi.fn(),
  };
});

vi.mock("@aws-sdk/s3-request-presigner", () => ({
  getSignedUrl: vi.fn(),
}));

const localDir = path.join(process.cwd(), ".local-storage");

describe("storage-service S3 paths (mocked)", () => {
  beforeEach(() => {
    vi.resetModules();
    if (fs.existsSync(localDir)) {
      fs.rmSync(localDir, { recursive: true, force: true });
    }
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("falls back to local disk when S3 is not configured (no bucket)", async () => {
    delete process.env.S3_BUCKET_NAME;
    delete process.env.MINIO_BUCKET;
    delete process.env.MINIO_ENDPOINT;
    delete process.env.AWS_ACCESS_KEY_ID;

    const { uploadFileToStorage } = await import("@/services/storage-service");
    const result = await uploadFileToStorage(
      { buffer: Buffer.from("data"), mimeType: "text/plain", originalName: "file.txt" },
      { keyPrefix: "uploads" },
    );

    expect(result.url).toMatch(/\/api\/storage\//);
  });

  it("deleteFileFromStorage removes local file when no S3 client", async () => {
    delete process.env.S3_BUCKET_NAME;
    delete process.env.MINIO_BUCKET;
    delete process.env.MINIO_ENDPOINT;

    const { deleteFileFromStorage } = await import("@/services/storage-service");

    const key = "tests/delete-test.txt";
    const filePath = path.join(localDir, key);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, "data");

    await deleteFileFromStorage(key);
    expect(fs.existsSync(filePath)).toBe(false);
  });

  it("deleteFileFromStorage noop when file does not exist and no S3 client", async () => {
    delete process.env.S3_BUCKET_NAME;
    delete process.env.MINIO_BUCKET;
    delete process.env.MINIO_ENDPOINT;

    const { deleteFileFromStorage } = await import("@/services/storage-service");

    await expect(deleteFileFromStorage("missing/key.pdf")).resolves.toBeUndefined();
  });

  it("extractStorageKeyFromUrl handles api/storage URL", async () => {
    const { extractStorageKeyFromUrl } = await import("@/services/storage-service");

    expect(extractStorageKeyFromUrl("/api/storage/foo/bar.pdf")).toBe("foo/bar.pdf");
    expect(extractStorageKeyFromUrl("https://example.com/bucket/key.pdf")).toBe("bucket/key.pdf");
    expect(extractStorageKeyFromUrl("not-a-url")).toBeNull();
  });

  it("generateSignedDownloadUrl returns local API URL for local file", async () => {
    delete process.env.S3_BUCKET_NAME;
    delete process.env.MINIO_BUCKET;

    const { generateSignedDownloadUrl } = await import("@/services/storage-service");

    const key = "tests/signed-test.txt";
    const filePath = path.join(localDir, key);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, "data");

    const url = await generateSignedDownloadUrl(key);
    expect(url).toBe(`/api/storage/${key}`);

    fs.unlinkSync(filePath);
  });
});
