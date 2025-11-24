export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import fsp from "fs/promises";
import path from "path";

// Permanent VPS path
const SERVER_UPLOAD_PATH = "/var/www/vaccom-webapp/public/uploads";

export async function POST(req: NextRequest, context: { params: { slug: string } }) {
  const { slug } = context.params; // ⭐ Correct & async-safe

  if (!slug) {
    return NextResponse.json({ error: "Slug required" }, { status: 400 });
  }

  try {
    const formData = await req.formData();
    const files = formData.getAll("images") as File[];

    const savedImagePaths: string[] = [];

    // Ensure folder exists
    if (!fs.existsSync(SERVER_UPLOAD_PATH)) {
      await fsp.mkdir(SERVER_UPLOAD_PATH, { recursive: true });
    }

    // Save files
    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = `${Date.now()}-${file.name}`;
      const destPath = path.join(SERVER_UPLOAD_PATH, filename);

      await fsp.writeFile(destPath, buffer);

      // Browser-accessible URL
      savedImagePaths.push(`/uploads/${filename}`);
    }

    return NextResponse.json({ filePaths: savedImagePaths });
  } catch (err) {
    console.error("❌ Upload error:", err);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
