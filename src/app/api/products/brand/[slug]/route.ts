import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";

// GET /api/products/brand/[slug]
export async function GET(
  req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug: rawSlug } = await context.params;

    if (!rawSlug) {
      return NextResponse.json({ error: "Slug required" }, { status: 400 });
    }

    await connectToDatabase();

    // Decode, replace dashes with spaces, handle special chars like & and trim
    const decodedSlug = decodeURIComponent(rawSlug)
      .replace(/-/g, " ")
      .replace(/%26/g, "&")
      .replace(/\s+/g, " ")
      .trim();

    console.log("🔎 Brand filter (slug):", decodedSlug);

    // Case-insensitive, loose regex (no ^ or $ anchors)
    const products = await Product.find({
      brand: { $regex: new RegExp(decodedSlug, "i") },
    }).lean();

    if (!products || products.length === 0) {
      return NextResponse.json(
        { message: "No products found for this brand" },
        { status: 404 }
      );
    }

    return NextResponse.json(products);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
