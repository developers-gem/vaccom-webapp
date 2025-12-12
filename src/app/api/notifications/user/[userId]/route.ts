import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Notification } from "@/models/Notification";

export async function GET(
  req: Request,
  context: { params: { userId: string } }
) {
  try {
    await connectToDatabase();

    // For App Router dynamic APIs, params must be awaited
    const { userId } = await context.params;

    const notifications = await Notification.find({
      $or: [{ userId }, { userId: null }],
    }).sort({ createdAt: -1 });

    return NextResponse.json({ notifications }, { status: 200 });
  } catch (error: any) {
    console.error("❌ Error fetching user notifications:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
