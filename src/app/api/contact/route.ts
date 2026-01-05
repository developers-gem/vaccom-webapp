import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  location: string;
  message: string;
}

export async function POST(req: Request) {
  try {
    const { name, email, phone, location, message }: ContactFormData =
      await req.json();

    // ✅ Validation
    if (!name || !email || !phone || !location || !message) {
      return NextResponse.json(
        { success: false, error: "All fields are required." },
        { status: 400 }
      );
    }

    // ✅ CORRECT SMTP CONFIG (matches your env)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Vaccom Website" <${process.env.SMTP_USER}>`,
      to: process.env.RECEIVE_EMAIL, // support@vaccom.com.au
      subject: "New Contact Form Submission - Vaccom",
      html: `
        <h3>New Contact Enquiry</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Location:</strong> ${location}</p>
        <p><strong>Message:</strong><br/>${message}</p>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "✅ Email sent successfully!",
    });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send email." },
      { status: 500 }
    );
  }
}
