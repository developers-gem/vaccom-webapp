import { NextResponse } from "next/server";
import Admin from "@/models/Admin";
import crypto from "crypto";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { connectToDatabase } from "@/lib/mongodb";

// Helper: send email
async function sendResetEmail(email: string, token: string) {
  const transporter = nodemailer.createTransport({
    service: "Gmail", // or any SMTP
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/reset-password?token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Admin Password Reset",
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link expires in 1 hour.</p>`,
  });
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { email } = await req.json();

    const admin = await Admin.findOne({ email });
    if (!admin) return NextResponse.json({ error: "Admin not found" }, { status: 404 });

    // Generate token
    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = await bcrypt.hash(token, 10);

    // Save token + expiry
    admin.resetPasswordToken = hashedToken;
    admin.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await admin.save();

    // Send email
    await sendResetEmail(email, token);

    return NextResponse.json({ message: "Reset link sent to your email" });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
