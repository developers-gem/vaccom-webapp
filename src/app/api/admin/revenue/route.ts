// /app/api/admin/revenue/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";

export async function GET(req: Request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter") || "week"; // default = week
    const earningsRate = parseFloat(searchParams.get("earningsRate") || "0.3"); // default 30%
    const now = new Date();

    let start: Date;

    // Determine start date based on filter
    if (filter === "week") {
      start = new Date();
      start.setDate(now.getDate() - 7);
    } else if (filter === "month") {
      start = new Date(now.getFullYear(), now.getMonth(), 1); // first day of month
    } else {
      start = new Date(now.getFullYear(), 0, 1); // first day of year
    }

    // Match completed orders within the period
    const matchStage = { status: "completed", createdAt: { $gte: start, $lte: now } };

    // Define group stage based on filter
    let groupId: any = {};
    if (filter === "week") {
      groupId = {
        year: { $year: "$createdAt" },
        month: { $month: "$createdAt" },
        day: { $dayOfMonth: "$createdAt" },
      };
    } else if (filter === "month") {
      groupId = {
        year: { $year: "$createdAt" },
        month: { $month: "$createdAt" },
        day: { $dayOfMonth: "$createdAt" },
      };
    } else {
      groupId = {
        year: { $year: "$createdAt" },
        month: { $month: "$createdAt" },
      };
    }

    // Sort stage (TypeScript-safe)
    let sortStage: Record<string, 1 | -1> = { "_id.year": 1, "_id.month": 1 };
    if (filter !== "year") sortStage["_id.day"] = 1;

    // Aggregate orders
    const result = await Order.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: groupId,
          revenue: { $sum: "$amount" },
          earnings: { $sum: { $multiply: ["$amount", earningsRate] } },
        },
      },
      { $sort: sortStage },
    ]);

    // Format output for charts
    const formatted = result.map((r) => ({
      time:
        filter === "year"
          ? `Month ${r._id.month.toString().padStart(2, "0")}`
          : `${r._id.day.toString().padStart(2, "0")}/${r._id.month.toString().padStart(2, "0")}`,
      revenue: r.revenue,
      earnings: r.earnings,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Revenue API error:", { filter: req.url, error });
    return NextResponse.json({ error: "Failed to fetch revenue" }, { status: 500 });
  }
}
