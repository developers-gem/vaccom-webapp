"use client";

import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import Image from "next/image";

// ✅ Currency formatter
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export default function CartPage() {
  const router = useRouter();
  const { cart, removeFromCart, clearCart, increaseQuantity, decreaseQuantity } =
    useCart();

  if (cart.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-5 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">🛒 Your Cart is Empty</h1>
        <p className="text-gray-600">Browse products and add them to your cart.</p>
        <button
          onClick={() => router.push("/")}
          className="mt-6 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="max-w-5xl mx-auto px-5 py-10">
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>

      <div className="bg-white shadow-md rounded-xl overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {cart.map((item) => (
            <li
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-5 hover:bg-gray-50"
            >
              <div className="flex items-center gap-5">
                <div className="w-24 h-24 relative flex-shrink-0">
                  <Image
                    src={item.imageUrl || "/placeholder.png"}
                    alt={item.name}
                    fill
                    className="object-contain rounded-md"
                    unoptimized
                  />
                </div>

                <div>
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <p className="text-gray-600">
                    Price: {formatCurrency(item.price)}
                  </p>
                  <p className="text-red-600 font-bold">
                    Subtotal: {formatCurrency(item.price * item.quantity)}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span className="px-3 font-medium">{item.quantity}</span>
                    <button
                      onClick={() => increaseQuantity(item.id)}
                      className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-4 sm:mt-0 flex sm:flex-col gap-2">
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Cart summary */}
      <div className="mt-10 flex flex-col sm:flex-row justify-between items-center gap-5">
        <button
          onClick={clearCart}
          className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg shadow"
        >
          Clear Cart
        </button>

        <div className="text-right">
          <p className="text-lg font-semibold">
            Total: <span className="text-green-600">{formatCurrency(total)}</span>
          </p>
          <button
            onClick={() => router.push("/checkout")}
            className="mt-3 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg shadow-lg text-lg font-medium"
          >
            Proceed to Checkout →
          </button>
        </div>
      </div>
    </div>
  );
}
