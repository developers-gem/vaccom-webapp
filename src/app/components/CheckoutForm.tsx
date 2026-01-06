"use client";

import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
};

type CheckoutFormProps = {
  email: string;
  cart: CartItem[];
  totalAmount: number;
  shipping: number;
  appliedCoupon?: { code: string; discount: number; finalAmount: number } | null;
  selectedCountry?: string;
};

export default function CheckoutForm({
  email,
  cart,
  appliedCoupon,
  selectedCountry,
  shipping,
}: CheckoutFormProps) {
  const { clearCart } = useCart();
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [processing, setProcessing] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalAmount = (appliedCoupon ? appliedCoupon.finalAmount : subtotal) + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);

    const card = elements.getElement(CardElement);
    if (!card) return;

    try {
      // 1️⃣ Create PaymentIntent
      const checkoutRes = await fetch("/api/create-payment-intent", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    totalAmount: totalAmount, // ✅ NO *100
  }),
});
      if (!checkoutRes.ok) throw new Error("Failed to create PaymentIntent");

      const { clientSecret }: { clientSecret: string } = await checkoutRes.json();

      // Store details locally in case of failure
      localStorage.setItem("latestPaymentId", clientSecret);
      localStorage.setItem("userEmail", email);
      localStorage.setItem("selectedCountry", selectedCountry || "");
      localStorage.setItem("appliedCoupon", JSON.stringify(appliedCoupon));
      localStorage.setItem("shipping", shipping.toString());
      localStorage.setItem("cartItems", JSON.stringify(cart));

      // 2️⃣ Confirm payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: { email: email || "guest@example.com" },
        },
      });

      if (error || paymentIntent?.status !== "succeeded") {
        router.push("/cancel"); // failure handled there
        return;
      }

      // 3️⃣ Payment succeeded → create order as pending
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          items: cart.map((item) => ({
            productId: item.id,
            name: item.name,
            price: item.price,
            qty: item.quantity,
            image: item.imageUrl || "/placeholder.png",
          })),
          amount: totalAmount,
          currency: "aud",
          paymentId: paymentIntent.id,
          email,
          shipping,
          coupon: appliedCoupon?.code || null,
          selectedCountry,
        }),
      });

      if (!orderRes.ok) throw new Error("Failed to save order");
      const data = await orderRes.json();

      if (data.success) {
        clearCart();
        router.push("/success");
      }
    } catch (err: any) {
      console.error("❌ Checkout error:", err.message);
      router.push("/cancel");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium mb-1">Card Details</label>
        <div className="border p-3 rounded-md">
          <CardElement />
        </div>
      </div>
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
      >
        {processing ? "Processing..." : `Pay $${totalAmount.toFixed(2)}`}
      </button>
    </form>
  );
}
