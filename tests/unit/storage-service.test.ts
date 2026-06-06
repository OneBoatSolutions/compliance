import fs from "node:fs";
import path from "node:path";
import { describe, it, expect } from "vitest";

import {
  uploadFileToStorage,
  generateSignedDownloadUrl,
  deleteFileFromStorage,
  extractStorageKeyFromUrl,
} from "@/services/storage-service";

const localDir = path.join(process.cwd(), ".local-storage");

describe("storage-service local fallback", () => {
  it("uploads a file to local disk and returns url/key", async () => {
    const buf = Buffer.from("hello");
    const res = await uploadFileToStorage(
      { buffer: buf, mimeType: "text/plain", originalName: "test.txt" },
      { keyPrefix: "tests" },
    );
    expect(res.key).toBeTruthy();
    expect(res.url).toMatch(/\/api\/storage\//);

    const filePath = path.join(localDir, res.key);
    expect(fs.existsSync(filePath)).toBe(true);

    // cleanup
    fs.unlinkSync(filePath);
  });

  it("generateSignedDownloadUrl returns local api url when file exists", async () => {
    const key = "tests/signed-test.txt";
    const filePath = path.join(localDir, key);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, "data");

    const url = await generateSignedDownloadUrl(key);
    expect(url).toBe(`/api/storage/${key}`);

    fs.unlinkSync(filePath);
  });

  it("deleteFileFromStorage removes local file", async () => {
    const key = "tests/delete-test.txt";
    const filePath = path.join(localDir, key);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, "data");

    await deleteFileFromStorage(key);
    expect(fs.existsSync(filePath)).toBe(false);
  });

  it("extractStorageKeyFromUrl handles urls and api paths", () => {
    expect(extractStorageKeyFromUrl("/api/storage/foo/bar.pdf")).toBe("foo/bar.pdf");
    expect(extractStorageKeyFromUrl("https://example.com/bucket/key.pdf")).toBe("bucket/key.pdf");
    expect(extractStorageKeyFromUrl("not-a-url")).toBeNull();
  });
});
