import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-08-27.basil",
});

export async function POST(req: Request) {
  try {
    const { totalAmount } = await req.json();

    // ✅ Convert dollars → cents (ONLY ONCE)
    const amountInCents = Math.round(Number(totalAmount) * 100);

    if (!amountInCents || amountInCents <= 0) {
      return NextResponse.json(
        { error: "Invalid payment amount" },
        { status: 400 }
      );
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,   // ✅ cents
      currency: "aud",         // ✅ FORCE AUD (CRITICAL)
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err: any) {
    console.error("Stripe error:", err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
