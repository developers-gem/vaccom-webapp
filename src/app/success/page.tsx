"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Order = {
  _id?: string;
  email?: string;
  userEmail?: string;
};

export default function SuccessPage() {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    try {
      const storedOrder = localStorage.getItem("latestOrder");
      if (storedOrder) {
        setOrder(JSON.parse(storedOrder));
      }
    } catch (err) {
      console.error("Failed to read order from storage");
    }
  }, []);

  return (
    <div className="p-10 text-center max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-green-600">
        ✅ Payment Successful!
      </h1>

      {order ? (
        <p className="mb-6 text-gray-700">
          Your order{" "}
          {order._id && (
            <span className="font-semibold">#{order._id}</span>
          )}{" "}
          has been placed successfully.
          <br />
          A confirmation email has been sent to{" "}
          <span className="font-semibold">
            {order.userEmail || order.email}
          </span>
          .
        </p>
      ) : (
        <p className="mb-6 text-gray-700">
          Your order has been placed successfully.
          <br />
          A confirmation email has been sent to your email address.
        </p>
      )}

      <div className="flex justify-center gap-4">
        <button
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
          onClick={() => router.push("/orders")}
        >
          View My Orders
        </button>

        <button
          className="bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300 transition"
          onClick={() => router.push("/")}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
