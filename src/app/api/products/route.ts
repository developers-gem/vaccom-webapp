import { NextResponse } from "next/server";
import Product from "@/models/Product";
import { connectToDatabase } from "@/app/lib/mongodb";

// FULLY WORKING SLUG DECODER
function decodeCategorySlug(slug: string): string {
  return decodeURIComponent(slug)     // handles %26 → &
    .replace(/-/g, " ")               // "-" → " "
    .replace(/\s+/g, " ")             
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());  
}

export async function GET(req: Request) {
  try {
    await connectToDatabase();

    const url = new URL(req.url);
    const brand = url.searchParams.get("brand");
    const category = url.searchParams.get("category");
    const isTodayDeal = url.searchParams.get("isTodayDeal");

    let filter: any = {};

    // BRAND
    if (brand) {
      const normalizedBrand = decodeURIComponent(brand)
        .replace(/-/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      filter.brand = { $regex: new RegExp(`^${normalizedBrand}$`, "i") };
    }

    // CATEGORY (FIXED)
    if (category) {
      const realCategory = decodeCategorySlug(category);
      filter.category = { $regex: new RegExp(`^${realCategory}$`, "i") };
    }

    // TODAY DEALS
    if (isTodayDeal === "true") {
      filter.isTodayDeal = true;
    }

    // FETCH
    const products = await Product.find(filter).lean();

    return NextResponse.json(products);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
