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

    const normalizedItems = body.items.map((item: any) => ({
      productId: item._id || item.productId,
      name: item.name,
      price: item.price,
      qty: item.qty,
      image: item.image || "/placeholder.png",
    }));

let orderStatus: "pending" | "failed" = "pending"; // default
let transactionStatus: "completed" | "failed" | "pending" = "pending"; // <-- declare first


    // ✅ If paymentId is provided, check Stripe payment status
   if (body.paymentId) {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(body.paymentId);
    if (paymentIntent.status === "succeeded") {
      orderStatus = "pending"; // Not completed
      transactionStatus = "completed"; // Transaction is completed
    } else {
      orderStatus = "failed";
      transactionStatus = "failed";
    }
  } catch (err) {
    console.error("Stripe retrieval error:", err);
  }
}
    // 1️⃣ Create the order
    const order = await Order.create({
  user: decoded.id,
  userEmail,
  products: normalizedItems,
  amount: body.amount,
currency: "aud",
  paymentId: body.paymentId || null,
  status: orderStatus, // <-- pending if payment succeeded
});

    // 2️⃣ Create a corresponding transaction
   const transaction = await Transaction.create({
  user: decoded.id,
  amount: body.amount,
  currency: "aud",
  status: transactionStatus,
  paymentMethod: "stripe",
  stripePaymentIntentId: body.paymentId || null,
});

    // 3️⃣ Send confirmation email
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
