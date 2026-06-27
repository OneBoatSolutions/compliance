import { describe, expect, it } from "vitest";

import { verifyFileMagic } from "@/lib/file-validation";

const docxMime = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const xlsxMime = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

function makeZip(entries: string[]): Buffer {
  const localParts: Buffer[] = [];
  const centralParts: Buffer[] = [];
  let offset = 0;

  for (const entry of entries) {
    const name = Buffer.from(entry, "utf8");

    const local = Buffer.alloc(30 + name.length);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0, 6);
    local.writeUInt16LE(0, 8);
    local.writeUInt32LE(0, 10);
    local.writeUInt32LE(0, 14);
    local.writeUInt32LE(0, 18);
    local.writeUInt32LE(0, 22);
    local.writeUInt16LE(name.length, 26);
    local.writeUInt16LE(0, 28);
    name.copy(local, 30);
    localParts.push(local);

    const central = Buffer.alloc(46 + name.length);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0, 8);
    central.writeUInt16LE(0, 10);
    central.writeUInt32LE(0, 12);
    central.writeUInt32LE(0, 16);
    central.writeUInt32LE(0, 20);
    central.writeUInt32LE(0, 24);
    central.writeUInt16LE(name.length, 28);
    central.writeUInt16LE(0, 30);
    central.writeUInt16LE(0, 32);
    central.writeUInt16LE(0, 34);
    central.writeUInt16LE(0, 36);
    central.writeUInt32LE(0, 38);
    central.writeUInt32LE(offset, 42);
    name.copy(central, 46);
    centralParts.push(central);

    offset += local.length;
  }

  const centralDirectory = Buffer.concat(centralParts);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(0, 4);
  eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(entries.length, 8);
  eocd.writeUInt16LE(entries.length, 10);
  eocd.writeUInt32LE(centralDirectory.length, 12);
  eocd.writeUInt32LE(offset, 16);
  eocd.writeUInt16LE(0, 20);

  return Buffer.concat([...localParts, centralDirectory, eocd]);
}

describe("verifyFileMagic OOXML validation", () => {
  it("accepts a DOCX package with required OOXML roots", () => {
    const result = verifyFileMagic(
      makeZip(["[Content_Types].xml", "_rels/.rels", "word/document.xml"]),
      docxMime,
    );

    expect(result.valid).toBe(true);
  });

  it("rejects a renamed ZIP that only contains a DOCX-looking folder", () => {
    const result = verifyFileMagic(
      makeZip(["[Content_Types].xml", "_rels/.rels", "word/not-document.xml"]),
      docxMime,
    );

    expect(result.valid).toBe(false);
    expect(result.reason).toContain("word/document.xml");
  });

  it("rejects OOXML packages missing root relationships", () => {
    const result = verifyFileMagic(makeZip(["[Content_Types].xml", "xl/workbook.xml"]), xlsxMime);

    expect(result.valid).toBe(false);
    expect(result.reason).toContain("_rels/.rels");
  });
});
