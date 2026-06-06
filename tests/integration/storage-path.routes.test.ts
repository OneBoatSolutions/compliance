import fs from "node:fs";
import path from "node:path";
import { beforeEach, describe, expect, it, afterEach } from "vitest";

import { GET } from "@/app/api/storage/[...path]/route";

const localDir = path.join(process.cwd(), ".local-storage");

describe("Storage path API route", () => {
  beforeEach(() => {
    if (!fs.existsSync(localDir)) {
      fs.mkdirSync(localDir, { recursive: true });
    }
  });

  afterEach(() => {
    // Cleanup any test files we created
    for (const f of ["tests/sample.pdf", "doc.pdf"]) {
      const testFile = path.join(localDir, f);
      if (fs.existsSync(testFile)) {
        fs.unlinkSync(testFile);
      }
    }
  });

  it("returns 200 and file content for a valid path (pdf)", async () => {
    const testFile = path.join(localDir, "tests", "sample.pdf");
    fs.mkdirSync(path.dirname(testFile), { recursive: true });
    fs.writeFileSync(testFile, "%PDF-1.4 sample");

    const req = new Request("http://localhost/api/storage/tests/sample.pdf");
    const res = (await GET(req, { params: { path: ["tests", "sample.pdf"] } })) as Response;

    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toBe("application/pdf");
    const content = await res.text();
    expect(content).toBe("%PDF-1.4 sample");
  });

  it("returns 404 for a non-existent file", async () => {
    const req = new Request("http://localhost/api/storage/missing/file.pdf");
    const res = (await GET(req, { params: { path: ["missing", "file.pdf"] } })) as Response;
    expect(res.status).toBe(404);
  });

  it("returns 403 when path traversal is attempted", async () => {
    const req = new Request("http://localhost/api/storage/../etc/passwd");
    const res = (await GET(req, { params: { path: ["..", "etc", "passwd"] } })) as Response;
    expect(res.status).toBe(403);
  });

  it("returns application/pdf content-type for .pdf files", async () => {
    const testFile = path.join(localDir, "doc.pdf");
    fs.writeFileSync(testFile, "%PDF-1.4");

    try {
      const req = new Request("http://localhost/api/storage/doc.pdf");
      const res = (await GET(req, { params: { path: ["doc.pdf"] } })) as Response;
      expect(res.status).toBe(200);
      expect(res.headers.get("Content-Type")).toBe("application/pdf");
    } finally {
      if (fs.existsSync(testFile)) {
        fs.unlinkSync(testFile);
      }
    }
  });
});
