import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Invalid email" },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Vaccom Website" <${process.env.SMTP_USER}>`,
      to: process.env.RECEIVE_EMAIL,
      subject: "New Newsletter Subscription - Vaccom",
      html: `
        <h3>New Newsletter Subscription</h3>
        <p><strong>Email:</strong> ${email}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Newsletter Error:", error);
    return NextResponse.json(
      { success: false, error: "Email failed" },
      { status: 500 }
    );
  }
}
