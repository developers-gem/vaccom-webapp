// /app/api/admin/create-admin/route.ts
import { NextResponse } from "next/server";
import { verifyAdminToken } from "@/utils/jwt";
import bcrypt from "bcrypt";
import { connectToDatabase } from "@/lib/mongodb";
import Admin from "@/models/Admin";

// Helper to get logged-in admin from cookie/session
async function getAdminFromSession(cookieHeader: string) {
  // This depends on how you store the session
  // For example, if you store JWT in cookie "adminToken":
  const tokenMatch = cookieHeader.match(/adminToken=([^;]+)/);
  if (!tokenMatch) return null;
  const token = tokenMatch[1];

  // Verify token and extract admin info
  try {
    const payload = await verifyAdminToken(token); // implement your JWT verification
    const admin = await Admin.findById(payload.id);
    return admin;
  } catch (err) {
    return null;
  }
}

// POST /api/admin/create-admin
export async function POST(req: Request) {
  try {
    await connectToDatabase();

    // 1️⃣ Get currently logged-in admin from cookie/session
    const cookieHeader = req.headers.get("cookie") || "";
    const sessionAdmin = await getAdminFromSession(cookieHeader);

    if (!sessionAdmin || sessionAdmin.role !== "superadmin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2️⃣ Parse request body
    const { name, email, password, role } = await req.json();

    // 3️⃣ Check if email already exists
    const existing = await Admin.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: "Admin with this email already exists" }, { status: 400 });
    }

    // 4️⃣ Hash password and create admin
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({ name, email, password: hashedPassword, role });
    await admin.save();

    return NextResponse.json({ message: "Admin created successfully" });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
