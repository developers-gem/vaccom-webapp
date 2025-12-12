import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Coupon, { ICoupon } from "@/models/Coupon";

// 🔐 Middleware check (pseudo, replace with real auth later)
async function checkAdminAuth() {
  // Example: validate JWT/session with role=admin
  return true; // change this with actual auth logic
}

// ✅ GET all coupons (Admin only)
export async function GET() {
  if (!(await checkAdminAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const coupons: ICoupon[] = await Coupon.find().sort({ createdAt: -1 });
    return NextResponse.json(coupons);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ POST - create new coupon (Admin only)
export async function POST(req: Request) {
  if (!(await checkAdminAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const body = await req.json();

    const coupon: ICoupon = await Coupon.create(body);
    return NextResponse.json({ success: true, coupon });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// ✅ DELETE - remove coupon by ID (Admin only)
export async function DELETE(req: Request) {
  if (!(await checkAdminAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const { id }: { id: string } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Coupon ID is required" }, { status: 400 });
    }

    await Coupon.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ PUT - update coupon by ID (Admin only)
export async function PUT(req: Request) {
  if (!(await checkAdminAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, code, discountType, discountValue, minPurchase, expiryDate, usageLimit } =
      await req.json();

    if (!id) {
      return NextResponse.json({ error: "Coupon ID is required" }, { status: 400 });
    }

    await connectToDatabase();

    const updated = await Coupon.findByIdAndUpdate(
      id,
      {
        code,
        discountType,
        discountValue,
        minPurchase,
        expiryDate: expiryDate ? new Date(expiryDate) : undefined,
        usageLimit,
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, coupon: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
