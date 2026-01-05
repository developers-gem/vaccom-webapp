"use client";
import { useCart } from "@/context/CartContext";
import { FiX } from "react-icons/fi";
import { useRouter } from "next/navigation";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
  }).format(amount);
};

export default function CartDrawer({ isOpen, onClose }) {
  const router = useRouter();
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity } = useCart();

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div
      className={`fixed inset-0 z-[9999] transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      ></div>

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } z-[10000]`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b bg-white sticky top-0 z-10">
          <h2 className="text-xl font-bold">Your Cart</h2>
          <button onClick={onClose}>
            <FiX size={24} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <p className="text-gray-600 text-center mt-10">
              Your cart is empty
            </p>
          ) : (
            <ul className="space-y-4">
              {cart.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between bg-gray-100 p-3 rounded"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.imageUrl || "/placeholder.png"}
                      alt={item.name}
                      className="w-16 h-16 object-contain rounded"
                    />
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-red-600 font-bold">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          onClick={() => decreaseQuantity(item.id)}
                          className="px-2 py-1 bg-gray-300 rounded"
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => increaseQuantity(item.id)}
                          className="px-2 py-1 bg-gray-300 rounded"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="bg-red-600 text-white px-2 py-1 rounded"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-4 border-t bg-white sticky bottom-0 z-10">
            <div className="flex justify-between items-center mb-3">
              <span className="font-semibold text-lg">Total:</span>
              <span className="text-green-600 font-bold text-lg">
                {formatCurrency(total)}
              </span>
            </div>

            <div className="flex justify-between gap-3">
              <button
                onClick={onClose}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded w-1/2"
              >
                Continue Shopping
              </button>
              <button
                onClick={() => {
                  onClose();
                  router.push("/checkout");
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded w-1/2"
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
