import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Transaction from "@/models/Transaction";
import Order from "@/models/Order";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { paymentId, status } = await req.json();

    if (!paymentId || !status) {
      return NextResponse.json(
        { success: false, message: "Missing paymentId or status" },
        { status: 400 }
      );
    }

    // Determine transaction status based on payment outcome
    const transactionStatus = status === "succeeded" ? "completed" : "failed";
    const orderStatus = status === "succeeded" ? "pending" : "failed"; // pending for admin review

    // 1️⃣ Update transaction
    const transaction = await Transaction.findOneAndUpdate(
      { stripePaymentIntentId: paymentId },
      { status: transactionStatus },
      { new: true }
    );

    if (!transaction) {
      return NextResponse.json(
        { success: false, message: "Transaction not found" },
        { status: 404 }
      );
    }

    // 2️⃣ Update order
    const order = await Order.findOneAndUpdate(
      { paymentId },
      { status: orderStatus },
      { new: true }
    );

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    // 3️⃣ Send email notification to customer
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/confirmation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order._id,
          email: order.userEmail,
          items: order.products,
          amount: order.amount,
          status: order.status,
        }),
      });
    } catch (emailErr) {
      console.error("Failed to send email:", emailErr);
    }

    return NextResponse.json({ success: true, transaction, order });
  } catch (err: any) {
    console.error("❌ Error completing order:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
