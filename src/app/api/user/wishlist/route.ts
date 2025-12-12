// src/app/api/user/wishlist/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Wishlist from "@/models/Wishlist";
import { getServerSession } from "next-auth";

export async function GET() {
  try {
    await connectToDatabase();
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const wishlist = await Wishlist.find({ userEmail: session.user.email }).lean();
    return NextResponse.json({ wishlist });
  } catch (err) {
    console.error("Wishlist fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch wishlist" }, { status: 500 });
  }
}
