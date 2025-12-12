import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Notification } from "@/models/Notification";

// CREATE notification
export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { userId, title, message, type } = body;

    const notification = await Notification.create({
      userId: userId || null,
      title,
      message,
      type,
      createdAt: new Date(),
      read: false,
    });

    return NextResponse.json(notification, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// GET all notifications
export async function GET() {
  try {
    await connectToDatabase();
    const notifications = await Notification.find({})
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ notifications }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
