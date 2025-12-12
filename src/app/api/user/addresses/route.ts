import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/mongodb";
import Address from "@/models/Address";

// ✅ Helper to verify token (async)
async function verifyToken() {
  const cookieStore = await cookies(); // ✅ now awaited
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch (err) {
    console.error("JWT verify error:", err);
    return null;
  }
}

// 🟢 GET all addresses
export async function GET() {
  try {
    await connectToDatabase();

    const decoded = await verifyToken(); // ✅ await here
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = (decoded as any).email;
    const addresses = await Address.find({ userEmail }).lean();

    return NextResponse.json({ addresses });
  } catch (err) {
    console.error("GET /addresses error:", err);
    return NextResponse.json({ error: "Failed to fetch addresses" }, { status: 500 });
  }
}

// 🟢 POST - Add new structured address
export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const decoded = await verifyToken(); // ✅ await here
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = (decoded as any).email;
    const { line1, city, state, zip, country } = await req.json();

    // ✅ check all fields
    if (!line1 || !city || !state || !zip || !country) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const newAddress = new Address({
      userEmail,
      line1,
      city,
      state,
      zip,
      country,
    });

    await newAddress.save();

    return NextResponse.json(
      { message: "Address added successfully", address: newAddress },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /addresses error:", err);
    return NextResponse.json({ error: "Failed to save address" }, { status: 500 });
  }
}
