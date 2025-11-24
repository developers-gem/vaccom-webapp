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

const SERVER_UPLOAD_PATH = "/var/www/vaccom-webapp/public/uploads";

// ---------------------------------------
// GET PRODUCT BY SLUG
// ---------------------------------------
export async function GET(req: Request, { params }: any) {
  try {
    await connectToDatabase();
    const { slug } = params;

    const product = await Product.findOne({ slug }).lean();
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (err) {
    console.error("GET product by slug error:", err);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// ---------------------------------------
// UPDATE PRODUCT BY SLUG
// ---------------------------------------
export async function PUT(req: Request, { params }: any) {
  try {
    await connectToDatabase();
    const { slug } = params;

    const body = await req.json();

    const updated = await Product.findOneAndUpdate(
      { slug },
      {
        name: body.name,
        price: body.price,
        salePrice: body.salePrice || null,
        shortDesc: body.shortDesc,
        longDesc: body.longDesc,
        brand: body.brand,
        category: body.category,
        images: body.images,
        stock: body.stock,
        isOutOfStock: body.stock <= 0,
        isTodayDeal: body.isTodayDeal,
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (err) {
    console.error("PUT update product error:", err);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// ---------------------------------------
// DELETE PRODUCT BY SLUG
// ---------------------------------------
export async function DELETE(req: Request, { params }: any) {
  try {
    await connectToDatabase();
    const { slug } = params;

    const deleted = await Product.findOneAndDelete({ slug });

    if (!deleted) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE product error:", err);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}

// ---------------------------------------
// IMPORTANT: Add Product should be in /api/admin/products (not here)
// Keeping it because you already have it
// ---------------------------------------
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

    const files = formData.getAll("images") as File[];
    const imagePaths: string[] = [];

    if (!fs.existsSync(SERVER_UPLOAD_PATH)) {
      await fsp.mkdir(SERVER_UPLOAD_PATH, { recursive: true });
    }

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = `${Date.now()}-${file.name}`;
      const filepath = path.join(SERVER_UPLOAD_PATH, filename);

      await fsp.writeFile(filepath, buffer);

      imagePaths.push(`/uploads/${filename}`);
    }

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
    return NextResponse.json(
      { error: "Failed to add product" },
      { status: 500 }
    );
  }
}
