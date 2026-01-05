import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";
import Transaction from "@/models/Transaction";

function getToken(req: Request, body?: any) {
  return (
    req.headers.get("authorization")?.replace("Bearer ", "") ||
    body?.token ||
    null
  );
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const token = getToken(req, body);
    if (!token)
      return NextResponse.json({ error: "No token provided" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; email?: string };

    const userEmail = decoded.email || body.email;
    if (!userEmail)
      return NextResponse.json({ error: "Email is required" }, { status: 400 });

    const normalizedItems = body.cart.map((item: any) => ({
      productId: item.id || item.productId,
      name: item.name,
      price: item.price,
      qty: item.quantity || item.qty,
      image: item.imageUrl || item.image || "/placeholder.png",
    }));

    // 1️⃣ Create the failed order
    const order = await Order.create({
      user: decoded.id,
      userEmail,
      products: normalizedItems,
      amount: body.amount,
currency: "aud",
      paymentId: body.paymentId || null,
      status: "failed",
      shipping: body.shipping || 0,
      coupon: body.coupon || null,
      selectedCountry: body.selectedCountry || null,
    });

    // 2️⃣ Create failed transaction
    await Transaction.create({
  user: decoded.id,
  amount: body.amount,
  currency: "aud",
  status: "failed",
  paymentMethod: "stripe",
  stripePaymentIntentId: body.paymentId || null,
});


    // 3️⃣ Send failed order email
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/failed-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order._id,
          email: userEmail,
          items: order.products,
          amount: order.amount,
        }),
      });
    } catch (emailErr) {
      console.error("Failed to send failed order email:", emailErr);
    }

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (err: any) {
    console.error("Failed order POST error:", err);
    return NextResponse.json(
      { error: "Unexpected error while saving failed order" },
      { status: 500 }
    );
  }
}
