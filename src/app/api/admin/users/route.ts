// /app/api/admin/users/route.ts
import { NextResponse } from "next/server";
import User from "@/models/User"; // your user model
import { connectToDatabase } from "@/lib/mongodb";

export async function GET() {
  await connectToDatabase();
  const users = await User.find().select("name email createdAt"); // only necessary fields
  return NextResponse.json({ users });
}
