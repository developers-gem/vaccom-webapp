// /app/api/auth/forgot-password/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";
import nodemailer from "nodemailer";
import User from "@/models/User";
import { connectToDatabase } from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findOne({ email });

    const responseMessage = {
      message: "If that email exists, a reset link has been sent.",
    };

    if (!user) return NextResponse.json(responseMessage, { status: 200 });

    // Generate raw token & expiry
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetExpiry = new Date(Date.now() + 3600000); // 1 hour

    // ✅ Use `set()` to ensure Mongoose updates the fields properly
    user.set({
      resetPasswordToken: resetToken,
      resetPasswordExpiry: resetExpiry,
    });

    await user.save();

    // 🔹 DEBUG: Log the user after saving to verify fields
    const savedUser = await User.findOne({ email });
    console.log("User after saving token:", {
      email: savedUser?.email,
      resetPasswordToken: savedUser?.resetPasswordToken,
      resetPasswordExpiry: savedUser?.resetPasswordExpiry,
    });

    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password?token=${resetToken}`;

    await transporter.sendMail({
      from: `"Vaccom Support" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Reset Your Password",
      html: `
        <p>Hello ${user.name || "user"},</p>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetLink}" style="background: #f87171; color: white; padding: 8px 12px; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, ignore this email.</p>
      `,
    });

    if (process.env.NODE_ENV === "development") {
      console.log("Password reset link:", resetLink);
    }

    return NextResponse.json(responseMessage);
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
