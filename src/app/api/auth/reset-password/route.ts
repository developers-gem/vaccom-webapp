// /app/api/auth/reset-password/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcrypt";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { token, newPassword } = await req.json();

    console.log("Incoming token:", token);
    console.log("Incoming password:", newPassword);

    if (!token || !newPassword) {
      return NextResponse.json({ message: "Invalid request" }, { status: 400 });
    }

    // Hash incoming token before lookup
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find user by hashed token & not expired
    const user = await User.findOne({
  resetPasswordToken: token, // raw token
      resetPasswordExpiry: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Clear reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;

    await user.save();

    return NextResponse.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Reset password error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
