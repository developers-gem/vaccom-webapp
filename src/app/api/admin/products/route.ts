// src\app\api\admin\products\route.ts

import { NextResponse } from "next/server";       // ✅ Next.js Response helper
import { connectToDatabase } from "@/app/lib/mongodb";
import Product from "@/models/Product";           // ✅ Your Product model
import { generateSlug } from "@/utils/slug";     // ✅ Utility to generate slug


// GET: fetch all products
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

// POST: add new product
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

    // ⭐ FIX: Generate categorySlug
    const categorySlug = generateSlug(category);

    // Save images
    const files = formData.getAll("images") as File[];
    const imagePaths: string[] = [];
    const fs = require("fs");
    const path = require("path");
    const uploadDir = "/var/www/vaccom-webapp/public/uploads";

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = `${Date.now()}-${file.name}`;
      const filepath = path.join(uploadDir, filename);

      await fs.promises.writeFile(filepath, buffer);
      imagePaths.push(`/uploads/${filename}`);
    }

    const slug = generateSlug(name);

    const newProduct = await Product.create({
      name,
      slug,
      categorySlug,   // ⭐ Now it works correctly
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





