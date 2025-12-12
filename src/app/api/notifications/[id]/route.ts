import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Notification } from "@/models/Notification";
import { Types } from "mongoose";

/**
 * DELETE /api/notifications/:id
 * -> Delete a notification
 */
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const { id } = params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid notification ID" }, { status: 400 });
    }

    await Notification.findByIdAndDelete(new Types.ObjectId(id));

    return NextResponse.json(
      { message: "Notification deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Error deleting notification:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * PATCH /api/notifications/:id
 * -> Update a notification (e.g. mark as read)
 */
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const { id } = params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid notification ID" }, { status: 400 });
    }

    const body = await req.json();

    const updatedNotification = await Notification.findByIdAndUpdate(
      new Types.ObjectId(id),
      body, // e.g. { isRead: true }
      { new: true }
    );

    if (!updatedNotification) {
      return NextResponse.json({ error: "Notification not found" }, { status: 404 });
    }

    return NextResponse.json(updatedNotification, { status: 200 });
  } catch (error: any) {
    console.error("❌ Error updating notification:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
