// src/app/api/admin/products/route.ts

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import Product from "@/models/Product";
import { generateSlug } from "@/utils/slug";
import fs from "fs";
import fsp from "fs/promises";
import path from "path";

// VPS upload path (SAME as your upload-image route)
const SERVER_UPLOAD_PATH = "/var/www/vaccom-webapp/public/uploads";

// ---------------------------
// GET ALL PRODUCTS
// ---------------------------
export async function GET() {
  try {
    await connectToDatabase();
    const products = await Product.find().lean();
    return NextResponse.json(products);
  } catch (err) {
    console.error("GET products error:", err);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// ---------------------------
// ADD NEW PRODUCT
// ---------------------------
export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const formData = await req.formData();

    const name = formData.get("name") as string;
    const price = Number(formData.get("price"));
    const salePrice = formData.get("salePrice")
      ? Number(formData.get("salePrice"))
      : null;
    const shortDesc = formData.get("shortDesc") as string;
    const longDesc = formData.get("longDesc") as string;
    const brand = formData.get("brand") as string;
    const category = formData.get("category") as string;
    const stock = Number(formData.get("stock") || 0);
    const isTodayDeal = formData.get("isTodayDeal") === "true";

    // ---------------------------
    // SAVE IMAGES TO VPS
    // ---------------------------
    const files = formData.getAll("images") as File[];
    const imagePaths: string[] = [];

    // Create uploads directory if missing
    if (!fs.existsSync(SERVER_UPLOAD_PATH)) {
      await fsp.mkdir(SERVER_UPLOAD_PATH, { recursive: true });
    }

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = `${Date.now()}-${file.name}`;
      const filepath = path.join(SERVER_UPLOAD_PATH, filename);

      await fsp.writeFile(filepath, buffer);

      // Browser-accessible path
      imagePaths.push(`/uploads/${filename}`);
    }

    // ---------------------------
    // CREATE PRODUCT
    // ---------------------------
    const slug = generateSlug(name);

    const newProduct = await Product.create({
      name,
      slug,
      price,
      salePrice,
      shortDesc,
      longDesc,
      brand,
      category,
      images: imagePaths,
      stock,
      isOutOfStock: stock <= 0,
      isTodayDeal,
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (err) {
    console.error("POST product error:", err);
    return NextResponse.json({ error: "Failed to add product" }, { status: 500 });
  }
}
