import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import Product from "@/models/Product";

export async function GET(
  req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;

    if (!slug) {
      return NextResponse.json({ error: "Slug required" }, { status: 400 });
    }

    await connectToDatabase();

    // Slug stays exactly as it is
    const cleanSlug = decodeURIComponent(slug).toLowerCase();

    console.log("🔎 Using slug:", cleanSlug);

    let filter: any = {};

    if (cleanSlug === "today-deals") {
      filter.isTodayDeal = true;
    } else {
      filter.categorySlug = cleanSlug; // 🔥 categorySlug in DB
    }

    const products = await Product.find(filter).lean();

    if (!products.length) {
      return NextResponse.json(
        { message: "No products found" },
        { status: 404 }
      );
    }

    return NextResponse.json(products);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
