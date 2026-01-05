"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "@/app/components/CheckoutForm";
import Image from "next/image";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPage() {
  const router = useRouter(); // 👈 ADD THIS
  const { cart } = useCart();
  const [countries, setCountries] = useState<string[]>([]);
  const [countryLoading, setCountryLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState("Australia");
  const [states, setStates] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState("");
  const [email, setEmail] = useState("");
  const [postcode, setPostcode] = useState("");
  const [postcodeError, setPostcodeError] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    router.replace("/auth?redirect=/checkout");
  }
}, [router]);

  // Coupon states
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
    finalAmount: number;
  } | null>(null);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
// useEffect(() => {
//   const token = localStorage.getItem("token");

//   if (!token) {
//     router.replace("/login?redirect=/checkout");
//   }
// }, [router]);

  // Subtotal
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // ✅ Shipping logic
  const shipping = (() => {
    const totalAmount = appliedCoupon ? appliedCoupon.finalAmount : subtotal;
    if (selectedCountry === "Australia" || selectedCountry === "New Zealand") {
      return totalAmount >= 149 ? 0 : 11.95;
    }
    return 15; // fallback
  })();

  const total = (appliedCoupon ? appliedCoupon.finalAmount : subtotal) + shipping;

  // ✅ Apply coupon
  const handleApplyCoupon = async () => {
    if (!couponCode) return setCouponError("⚠️ Enter a coupon code");

    const token = localStorage.getItem("token");
    if (!token) return setCouponError("⚠️ Please login first to use a coupon");

    try {
      const res = await fetch("/api/coupons/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          code: couponCode,
          totalAmount: subtotal,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to apply coupon");

      setAppliedCoupon({
        code: couponCode,
        discount: data.discount,
        finalAmount: data.finalAmount,
      });
      setCouponMessage(`✅ Coupon applied! You saved $${data.discount.toFixed(2)}`);
      setCouponError(null);
    } catch (err: any) {
      setAppliedCoupon(null);
      setCouponError(err.message);
      setCouponMessage(null);
    }
  };

  // ✅ Only allow Australia & New Zealand
  useEffect(() => {
    setCountries(["Australia", "New Zealand"]);
    setCountryLoading(false);
  }, []);

  // ✅ States per country
  const stateList: Record<string, string[]> = {
    Australia: [
      "New South Wales",
      "Victoria",
      "Queensland",
      "Western Australia",
      "South Australia",
      "Tasmania",
      "Australian Capital Territory",
      "Northern Territory",
    ],
    "New Zealand": [
      "Auckland",
      "Wellington",
      "Canterbury",
      "Otago",
      "Waikato",
      "Bay of Plenty",
      "Hawke’s Bay",
      "Manawatu-Wanganui",
    ],
  };

  // ✅ Auto-update states
  useEffect(() => {
    const nextStates = stateList[selectedCountry] || [];
    setStates(nextStates);
    setSelectedState("");
    setPostcode("");
    setPostcodeError(null);
  }, [selectedCountry]);

  // ✅ Validate postcode
  useEffect(() => {
    if (!postcode) return setPostcodeError(null);
    const regex = /^[0-9]{4}$/; // 4-digit check
    if (!regex.test(postcode)) {
      setPostcodeError("❌ Postcode must be exactly 4 digits");
      return;
    }
    setPostcodeError(null);
  }, [postcode, selectedCountry]);

  // ✅ Validate all required fields
  const allFieldsFilled =
    firstName &&
    lastName &&
    email &&
    phone &&
    selectedState &&
    postcode &&
    !postcodeError;

  return (
    <Elements stripe={stripePromise}>
      <div className="container mx-auto p-6 grid md:grid-cols-2 gap-8">
        {/* LEFT: Contact + Payment */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold mb-4">Contact & Payment</h2>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="border p-3 rounded-md w-full"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="border p-3 rounded-md w-full"
            />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-3 rounded-md w-full md:col-span-2"
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border p-3 rounded-md w-full md:col-span-2"
            />

            {/* Country */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Country/Region</label>
              <select
                className="border p-3 rounded-md w-full"
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                disabled={countryLoading}
              >
                {countries.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* State */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">State / Province</label>
              <select
                className="border p-3 rounded-md w-full"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
              >
                <option value="">Select State</option>
                {states.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Postcode */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Postcode</label>
              <input
                type="text"
                placeholder="Enter 4-digit postcode"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                className={`border p-3 rounded-md w-full ${postcodeError ? "border-red-500" : ""
                  }`}
              />
              {postcodeError && <p className="text-sm text-red-600 mt-1">{postcodeError}</p>}
            </div>
          </form>

          {/* Coupon */}
          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">Have a coupon?</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="border p-2 rounded w-full"
              />
              <button
                onClick={handleApplyCoupon}
                type="button"
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Apply
              </button>
            </div>
            {couponMessage && <p className="text-sm mt-1 text-green-600">{couponMessage}</p>}
            {couponError && <p className="text-sm mt-1 text-red-600">{couponError}</p>}
          </div>

          {/* Checkout Button / Form */}
          {!allFieldsFilled && (
            <p className="text-red-600 font-medium mt-4">
              ⚠️ Please fill in all required details before checkout.
            </p>
          )}

          <div className={`${!allFieldsFilled ? "opacity-50 pointer-events-none" : ""}`}>
            <CheckoutForm
              email={email}
              totalAmount={total}
              cart={cart}
              shipping={shipping}
              appliedCoupon={appliedCoupon}
              selectedCountry={selectedCountry}
            />
          </div>
        </div>

        {/* RIGHT: Order Summary */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-4 border-b pb-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 bg-white p-3 rounded-md shadow-sm"
              >
                <div className="relative w-16 h-16">
                  <Image
                    src={item.imageUrl || "/placeholder.png"}
                    alt={item.name}
                    fill
                    className="object-contain rounded"
                    unoptimized
                  />
                  {item.quantity > 1 && (
                    <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {item.quantity}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                </div>
                <span className="font-semibold text-sm">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-green-600 font-semibold">
                {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
              </span>
            </div>
            {appliedCoupon && (
              <div className="flex justify-between text-green-700 font-semibold">
                <span>Coupon ({appliedCoupon.code})</span>
                <span>- ${appliedCoupon.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </Elements>
  );
}
