import { NextResponse } from "next/server"; 
import { connectToDatabase } from "@/app/lib/mongodb";
import Product from "@/models/Product";

// ✅ GET product by slug
export async function GET(
  req: Request,
  context: { params: { slug: string } }
) {
  try {
const { slug } = await context.params;   // ✅ required by Next.js to avoid warning
    if (!slug) {
      return NextResponse.json({ error: "Slug required" }, { status: 400 });
    }

    await connectToDatabase();

    const product = await Product.findOne({ slug }).lean();

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });
  } catch (err: any) {
    console.error("❌ Error fetching product:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ✅ Update product by slug
export async function PUT(
  req: Request,
  context: { params: { slug: string } }
) {
  try {
    const { slug } = context.params;
    if (!slug) {
      return NextResponse.json({ error: "Slug required" }, { status: 400 });
    }

    const body = await req.json();
    await connectToDatabase();

    if (body.isActive === undefined) {
      body.isActive = true;
    }

    const updatedProduct = await Product.findOneAndUpdate(
      { slug },
      { $set: body },
      { new: true, lean: true }
    );

    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (err: any) {
    console.error("❌ Error updating product:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ✅ Delete product by slug
export async function DELETE(
  req: Request,
  context: { params: { slug: string } }
) {
  try {
    const { slug } = context.params;
    if (!slug) {
      return NextResponse.json({ error: "Slug required" }, { status: 400 });
    }

    await connectToDatabase();

    const deletedProduct = await Product.findOneAndDelete({ slug });

    if (!deletedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Product deleted successfully", slug },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("❌ Error deleting product:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
