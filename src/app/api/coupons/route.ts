import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Coupon from "@/models/Coupon";

export async function GET() {
  try {
    await connectToDatabase();

    const today = new Date();

    // Fetch all coupons (ignore expiry for now)
    const coupons = await Coupon.find().sort({ createdAt: -1 });

    return NextResponse.json(coupons);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
