import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Transaction from "@/models/Transaction";

interface User {
  name: string;
  email: string;
}

interface SafeTransaction {
  _id: string;
  amount: number;
  status: "pending" | "completed" | "failed";
  paymentMethod: string;
  createdAt: string;
  user: User;
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const transactions = await Transaction.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .lean(); // plain objects, faster than Mongoose docs

   const safeTransactions: SafeTransaction[] = transactions.map((t: any) => ({
  _id: t._id.toString(),
  amount: t.amount,
  status: t.status,
  paymentMethod: t.paymentMethod,
  stripePaymentIntentId: t.stripePaymentIntentId || null, // ✅ include Stripe ID
  createdAt: t.createdAt.toISOString(),
  user: t.user
    ? { name: t.user.name, email: t.user.email }
    : { name: "Unknown User", email: "N/A" },
}));
    return NextResponse.json({ success: true, transactions: safeTransactions });
  } catch (error: any) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
