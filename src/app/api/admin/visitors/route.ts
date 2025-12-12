// /app/api/admin/visitors/route.ts
import { NextResponse } from "next/server";
import Order from "@/models/Order";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET() {
  try {
    await connectToDatabase();

    // Aggregate orders per day for last 10 days as visitors proxy
    const today = new Date();
    const past10Days = new Date();
    past10Days.setDate(today.getDate() - 9);

    const visitorsData = await Order.aggregate([
      { $match: { createdAt: { $gte: past10Days } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          visitors: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Format response as { time: "YYYY-MM-DD", visitors: number }
    const result = visitorsData.map((item) => ({
      time: item._id,
      visitors: item.visitors,
    }));

    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch visitors data" }, { status: 500 });
  }
}
