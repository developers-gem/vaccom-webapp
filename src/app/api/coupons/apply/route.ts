// /api/coupons/apply/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import mongoose from "mongoose";
import Coupon from "@/models/Coupon";
import jwt from "jsonwebtoken";

interface ApplyCouponRequest {
  code: string;
  totalAmount: number;
}

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { error: "No token provided in Authorization header" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return NextResponse.json(
        { error: "Malformed Authorization header" },
        { status: 401 }
      );
    }

    // Decode token
    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const userId = decoded.id;
    if (!userId) {
      return NextResponse.json(
        { error: "No userId found in token payload" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { error: `Invalid userId format: ${userId}` },
        { status: 400 }
      );
    }

    // Parse request body
    const body: ApplyCouponRequest = await req.json();
    console.log("➡️ Apply coupon request body:", body);

    const { code, totalAmount } = body;

    if (!code || totalAmount === undefined) {
      return NextResponse.json(
        { error: "Missing required fields (code or totalAmount)" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Find coupon
    const coupon = await Coupon.findOne({ code });
    if (!coupon) {
      return NextResponse.json(
        { error: `Coupon not found with code: ${code}` },
        { status: 400 }
      );
    }

    // Expiry check
    if (coupon.expiryDate && coupon.expiryDate < new Date()) {
      return NextResponse.json(
        { error: "Coupon has expired" },
        { status: 400 }
      );
    }

    // Min purchase check
    if (totalAmount < coupon.minPurchase) {
      return NextResponse.json(
        { error: `Minimum purchase ₹${coupon.minPurchase} required` },
        { status: 400 }
      );
    }

    // Usage limit check
    if (coupon.usedBy.length >= coupon.usageLimit) {
      return NextResponse.json(
        { error: "Coupon usage limit reached" },
        { status: 400 }
      );
    }

    // Already used check
    const userObjectId = new mongoose.Types.ObjectId(userId);
    if (coupon.usedBy.some((id) => id.equals(userObjectId))) {
      return NextResponse.json(
        { error: "Coupon already used by this user" },
        { status: 400 }
      );
    }

    // Discount calculation
    const discount =
      coupon.discountType === "percentage"
        ? (totalAmount * coupon.discountValue) / 100
        : coupon.discountValue;

    const finalAmount = Math.max(totalAmount - discount, 0);

    // Save usage
    coupon.usedBy.push(userObjectId);
    await coupon.save();

    return NextResponse.json({
      success: true,
      discount,
      finalAmount,
      message: "Coupon applied successfully",
    });
  } catch (err: any) {
    console.error("❌ Error in apply coupon route:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
