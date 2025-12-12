import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Transaction from "@/models/Transaction";

// ✅ PATCH: update transaction status
export async function PATCH(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const { id } = context.params;
    const body = await req.json();

    const allowedStatuses = ["pending", "completed", "failed"];
    if (!body.status || !allowedStatuses.includes(body.status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status value" },
        { status: 400 }
      );
    }

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      id,
      { status: body.status },
      { new: true }
    ).lean();

    if (!updatedTransaction) {
      return NextResponse.json(
        { success: false, message: "Transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, transaction: updatedTransaction });
  } catch (error: any) {
    console.error("❌ Error updating transaction:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// ✅ GET: fetch a single transaction
export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const { id } = context.params;
    const transaction = await Transaction.findById(id)
      .populate("user", "name email")
      .lean();

    if (!transaction) {
      return NextResponse.json(
        { success: false, message: "Transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, transaction });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// ✅ DELETE: delete a transaction
export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    await connectToDatabase();

    const { id } = context.params;
    const transaction = await Transaction.findByIdAndDelete(id).lean();

    if (!transaction) {
      return NextResponse.json(
        { success: false, message: "Transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Transaction deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
