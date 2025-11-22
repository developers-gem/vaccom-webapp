export const runtime = "nodejs";            // ⬅ REQUIRED (file writes allowed)
export const dynamic = "force-dynamic";     // ⬅ REQUIRED (no static cache)
export const revalidate = 0;
export const fetchCache = "force-no-store";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import fsp from "fs/promises";
import path from "path";

// 🔥 Absolute VPS upload path (permanent storage)
const SERVER_UPLOAD_PATH = "/var/www/vaccom-webapp/public/uploads";

export async function POST(req: NextRequest, { params }: any) {
  const slug = params?.slug;

  if (!slug) {
    return NextResponse.json({ error: "Slug required" }, { status: 400 });
  }

  try {
    const formData = await req.formData();
    const files: File[] = formData.getAll("images") as File[];

    const savedImagePaths: string[] = [];

    // Ensure upload directory exists
    if (!fs.existsSync(SERVER_UPLOAD_PATH)) {
      await fsp.mkdir(SERVER_UPLOAD_PATH, { recursive: true });
    }

    // Save each file
    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = `${Date.now()}-${file.name}`;
      const fullFilePath = path.join(SERVER_UPLOAD_PATH, filename);

      await fsp.writeFile(fullFilePath, buffer);

      // Public URL returned to frontend
      savedImagePaths.push(`/uploads/${filename}`);
    }

    return NextResponse.json({ filePaths: savedImagePaths });
  } catch (error) {
    console.error("❌ Image Upload Error:", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
