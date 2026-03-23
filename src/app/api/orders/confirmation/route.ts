import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

type OrderItem = {
  name: string;
  qty: number;
  price: number;
};

export async function POST(req: Request) {
  try {
    const { orderId, email, items, amount, address } = await req.json();

    console.log("📩 Confirmation request received:", {
      orderId,
      email,
      itemsCount: items?.length,
      amount,
    });

    // ✅ Validate input
    if (
      !orderId ||
      !email ||
      !Array.isArray(items) ||
      items.length === 0 ||
      typeof amount !== "number"
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid request data" },
        { status: 400 }
      );
    }


    const addressHtml = `
  <p><strong>Shipping Address:</strong></p>
  <p>
    ${address?.fullName || ""}<br/>
    ${address?.phone || ""}<br/>
    ${[
      address?.street,
      address?.city,
      address?.state,
      address?.postalCode,
      address?.country,
    ]
      .filter(Boolean)
      .join(", ")}
  </p>
`;

    // ✅ Mail transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // ✅ Build items HTML
    const itemsHtml = items
      .map(
        (item: OrderItem) =>
          `<li>${item.name} × ${item.qty} — $${(
            item.price * item.qty
          ).toFixed(2)}</li>`
      )
      .join("");

    /* ===============================
       1️⃣ CUSTOMER CONFIRMATION EMAIL
    ================================ */
    await transporter.sendMail({
      from: `"Vaccom Support" <${process.env.SMTP_USER}>`,
      to: email, // ✅ CUSTOMER ONLY
      subject: `Order Confirmation - ${orderId}`,
      html: `
        <p>Hi,</p>

        <p>Thank you for your order! Your payment was successful.</p>

        <p><strong>Order ID:</strong> ${orderId}</p>

          ${addressHtml}  

        <p><strong>Items:</strong></p>
        <ul>${itemsHtml}</ul>

        <p><strong>Total:</strong> $${amount.toFixed(2)}</p>

        <p>We’ll notify you when your order is shipped.</p>

        <p>Thanks for shopping with <strong>Vaccom</strong>!</p>
      `,
    });

    /* ===============================
       2️⃣ ADMIN NOTIFICATION EMAIL
    ================================ */
    await transporter.sendMail({
      from: `"Vaccom Website" <${process.env.SMTP_USER}>`,
      to: process.env.RECEIVE_EMAIL, // ✅ ADMIN ONLY
      subject: `🛒 New Order Received - ${orderId}`,
      html: `
        <h3>New Order Received</h3>

        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Customer Email:</strong> ${email}</p>
        
${addressHtml}

        <p><strong>Items:</strong></p>
        <ul>${itemsHtml}</ul>

        <p><strong>Total Amount:</strong> $${amount.toFixed(2)}</p>
      `,
    });

    console.log("✅ Customer & admin emails sent successfully");

    return NextResponse.json({
      success: true,
      message: "Order confirmation emails sent",
    });
  } catch (err: any) {
    console.error("❌ Error sending confirmation email:", err);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to send email",
        error: err.message,
      },
      { status: 500 }
    );
  }
}
