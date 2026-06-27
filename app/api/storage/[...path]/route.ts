import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

const localStorageDir = path.join(process.cwd(), ".local-storage");

interface RouteContext {
  params: Promise<{ path: string[] }>;
}

export async function GET(request: Request, { params }: RouteContext) {
  const { path: routePath } = await params;
  const filePath = path.join(localStorageDir, ...routePath);

  // Security: ensure the resolved path is within localStorageDir
  const resolved = path.resolve(filePath);
  if (!resolved.startsWith(path.resolve(localStorageDir))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!fs.existsSync(resolved)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const buffer = fs.readFileSync(resolved);
  const ext = path.extname(resolved).toLowerCase();
  const mimeMap: Record<string, string> = {
    ".pdf": "application/pdf",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
  };

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": mimeMap[ext] || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${path.basename(resolved)}"`,
    },
  });
}
