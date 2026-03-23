import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";
import Transaction from "@/models/Transaction";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

function getToken(req: Request, body?: any) {
  return (
    req.headers.get("authorization")?.replace("Bearer ", "") ||
    body?.token ||
    null
  );
}

// GET orders for logged-in user
export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const token = getToken(req);
    if (!token)
      return NextResponse.json({ error: "No token provided" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      email?: string;
    };
    const orders = await Order.find({ user: decoded.id }).sort({
      createdAt: -1,
    });
    return NextResponse.json({ success: true, orders });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// POST: create new order + create transaction + set correct status
// POST: create new order + create transaction + set correct status
export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const token = getToken(req, body);
    if (!token)
      return NextResponse.json({ error: "No token provided" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      email?: string;
    };

    const userEmail = decoded.email || body.email;
    if (!userEmail)
      return NextResponse.json({ error: "Email is required" }, { status: 400 });

    // ✅ Normalize items safely
    const normalizedItems = (body.items || []).map((item: any) => ({
      productId: item._id || item.productId,
      name: item.name,
      price: Number(item.price),
      qty: Number(item.qty) || 1,
      image: item.image || "/placeholder.png",
    }));

    // ✅ Default statuses
    let orderStatus: "pending" | "failed" = "pending";
    let transactionStatus: "completed" | "failed" | "pending" = "pending";

    // ✅ Stripe verification (only if real paymentId)
    if (body.paymentId && body.paymentId !== "test_payment") {
      try {
        const paymentIntent = await stripe.paymentIntents.retrieve(body.paymentId);

        if (paymentIntent.status === "succeeded") {
          orderStatus = "pending"; // order still needs processing
          transactionStatus = "completed";
        } else {
          orderStatus = "failed";
          transactionStatus = "failed";
        }
      } catch (err) {
        console.error("Stripe retrieval error:", err);
        orderStatus = "failed";
        transactionStatus = "failed";
      }
    }

    // ✅ Create order
    const order = await Order.create({
      user: decoded.id,
      userEmail,
      products: normalizedItems,
      amount: Number(body.amount),
      currency: "aud",
      paymentId: body.paymentId || null,
      status: orderStatus,

      // ✅ VERY IMPORTANT (safe address)
      address: {
        fullName: body.address?.fullName || "",
        phone: body.address?.phone || "",
        street: body.address?.street || "",
        city: body.address?.city || "",
        state: body.address?.state || "",
        postalCode: body.address?.postalCode || "",
        country: body.address?.country || "",
      },
    });

    // ✅ Create transaction
    await Transaction.create({
      user: decoded.id,
      amount: Number(body.amount),
      currency: "aud",
      status: transactionStatus,
      paymentMethod: "stripe",
      stripePaymentIntentId: body.paymentId || null,
    });

    // ✅ Send confirmation email (with address)
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/confirmation`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: order._id,
            email: userEmail,
            items: order.products,
            amount: order.amount,
            address: order.address, // ✅ INCLUDED
          }),
        }
      );
    } catch (emailErr) {
      console.error("Failed to send confirmation email:", emailErr);
    }

    return NextResponse.json({ success: true, order }, { status: 201 });

  } catch (err: any) {
    console.error("Order POST error:", err);
    return NextResponse.json(
      { error: "Unexpected error while saving order" },
      { status: 500 }
    );
  }
}
