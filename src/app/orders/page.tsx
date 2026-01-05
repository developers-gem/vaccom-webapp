"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface OrderItem {
  id: string | number;
  name: string;
  price: number;
  qty: number;
  image: string;
  hoverImage?: string;
}

interface Order {
  _id: string;
  orderId: string;
  products: OrderItem[];
  amount: number;
  currency: string;
  createdAt: string;
  status?: string;
}

interface OrdersApiResponse {
  success?: boolean;
  orders?: any[];
  error?: string;
}
// ✅ Currency formatter (AUD)
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
  }).format(amount);
};

const getUserToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

// ✅ Status colors
const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  processing: "bg-blue-100 text-blue-800",
};

// ✅ Badge renderer
const getStatusBadge = (status?: string) => {
  const normalized = status?.toLowerCase() || "pending";
  const color = statusColors[normalized] || "bg-gray-100 text-gray-800";
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${color}`}>
      {status || "Pending"}
    </span>
  );
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilters, setStatusFilters] = useState<string[]>(["all"]);
  const [timeFilter, setTimeFilter] = useState<"week" | "month" | "year" | "custom">("week");
  const [customDate, setCustomDate] = useState<{ from: string; to: string }>({ from: "", to: "" });

  const router = useRouter();

  async function fetchOrders() {
    const token = getUserToken();
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch("/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }
        throw new Error(`Failed to fetch orders (${res.status})`);
      }

      const data: OrdersApiResponse = await res.json();

      if (!data.success || !data.orders) {
        setOrders([]);
        setError(data.error || "No orders found.");
        return;
      }

      const mappedOrders: Order[] = data.orders.map((o, idx) => ({
        _id: o._id,
        orderId: o.orderId || o._id || `order-${idx}`,
        products: (o.products || []).map((p: any, i: number) => ({
          id: p._id || p.id || i,
          name: p.name || "Unnamed product",
          price: Number(p.price) || 0,
          qty: Number(p.qty) || 1,
          image: p.image || "/placeholder.png",
          hoverImage: p.hoverImage || p.image || "/placeholder.png",
        })),
        amount: Number(o.amount) || 0,
currency: o.currency || "AUD",
        createdAt: o.createdAt,
        status: o.status || "Pending",
      }));

      setOrders(mappedOrders);
    } catch (err: any) {
      setError(err.message || "Something went wrong while fetching orders.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = (status: string) => {
    if (status === "all") {
      setStatusFilters(["all"]);
    } else {
      setStatusFilters((prev) => {
        const newFilters = prev.includes(status)
          ? prev.filter((f) => f !== status)
          : [...prev.filter((f) => f !== "all"), status];
        return newFilters.length ? newFilters : ["all"];
      });
    }
  };

  // ✅ Filter orders
  const filteredOrders = orders.filter((order) => {
    const orderStatus = (order.status || "Pending").toLowerCase();

    // Status filter
    if (!statusFilters.includes("all") &&
        !statusFilters.map((s) => s.toLowerCase()).includes(orderStatus)) {
      return false;
    }

    // Time filter
    const orderDate = new Date(order.createdAt);
    const now = new Date();

    if (timeFilter === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);
      if (orderDate < weekAgo) return false;
    } else if (timeFilter === "month") {
      const monthAgo = new Date();
      monthAgo.setMonth(now.getMonth() - 1);
      if (orderDate < monthAgo) return false;
    } else if (timeFilter === "year") {
      const yearAgo = new Date();
      yearAgo.setFullYear(now.getFullYear() - 1);
      if (orderDate < yearAgo) return false;
    } else if (timeFilter === "custom" && customDate.from && customDate.to) {
      const fromDate = new Date(customDate.from);
      const toDate = new Date(customDate.to);
      toDate.setHours(23, 59, 59);
      if (orderDate < fromDate || orderDate > toDate) return false;
    }

    return true;
  });

  if (loading) return <p className="p-6">Loading orders...</p>;
  if (error)
    return (
      <p className="p-6 text-center text-red-600">
        {error} <br />
        <a href="/shop" className="text-blue-600 underline">
          Shop now
        </a>.
      </p>
    );
  if (!orders.length)
    return (
      <p className="p-6 text-center">
        No orders found yet.{" "}
        <a href="/shop" className="text-blue-600 underline">
          Shop now
        </a>.
      </p>
    );

  return (
    <div className="flex p-6 gap-6 bg-pink-100">
      {/* Sidebar Filters */}
      <aside className="w-1/6 border rounded-lg p-4 shadow bg-blue-50 h-fit">
        <h2 className="text-lg font-semibold mb-3">Filters</h2>

        {/* Status Filter */}
        <div className="mb-4">
          <p className="font-medium mb-2">Order Status</p>
          {["all", "Pending", "Processing", "Completed", "Cancelled"].map(
            (status) => (
              <label key={status} className="flex items-center gap-2 mb-1">
                <input
                  type="checkbox"
                  checked={statusFilters.includes(status)}
                  onChange={() => handleStatusChange(status)}
                />
                {status === "all" ? "All Orders" : status}
              </label>
            )
          )}
        </div>

        {/* Time Filter Dropdown */}
        <div>
          <p className="font-medium mb-2">Order Time</p>
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value as any)}
            className="border px-2 py-1 rounded w-full"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
            <option value="custom">Custom</option>
          </select>

          {timeFilter === "custom" && (
            <div className="flex flex-col gap-2 mt-2">
              <input
                type="date"
                value={customDate.from}
                onChange={(e) =>
                  setCustomDate({ ...customDate, from: e.target.value })
                }
                className="border px-2 py-1 rounded"
              />
              <input
                type="date"
                value={customDate.to}
                onChange={(e) =>
                  setCustomDate({ ...customDate, to: e.target.value })
                }
                className="border px-2 py-1 rounded"
              />
            </div>
          )}
        </div>
      </aside>

      {/* Orders Section */}
      <main className="flex-1 space-y-4 bg-pink-100">
        {filteredOrders.map((order) => (
          <div
            key={order._id}
            className="border rounded-lg bg-blue-50 shadow p-4"
          >
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="font-semibold">Order ID: {order.orderId}</p>
                <p className="text-sm text-gray-600">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
                <p className="text-sm mt-1 flex items-center gap-1">
                  Status: {getStatusBadge(order.status)}
                </p>
              </div>

              {/* Cancel Order button */}
              {["pending", "processing"].includes(
                order.status?.toLowerCase() || ""
              ) && (
                <button
                  className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={async () => {
                    if (
                      !confirm("Are you sure you want to cancel this order?")
                    )
                      return;

                    try {
                      const res = await fetch(`/api/admin/orders/${order._id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ status: "cancelled" }),
                      });

                      const data = await res.json();

                      if (data.success) {
                        setOrders((prev) =>
                          prev.map((o) =>
                            o._id === order._id
                              ? { ...o, status: "cancelled" }
                              : o
                          )
                        );
                        alert("Order cancelled successfully!");
                      } else {
                        alert(data.error || "Failed to cancel order");
                      }
                    } catch (err) {
                      console.error(err);
                      alert("Unexpected error while cancelling order");
                    }
                  }}
                >
                  Cancel Order
                </button>
              )}
            </div>

            {/* Products */}
            {order.products.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 border-t py-2"
              >
                <div className="relative w-[150px] h-[200px]">
                  <Image
                    src={item.image || "/placeholder.png"}
                    alt={item.name}
                    fill
                    className="object-contain rounded"
                    unoptimized
                  />
                  {item.hoverImage && item.hoverImage !== item.image && (
                    <Image
                      src={item.hoverImage}
                      alt={item.name + " hover"}
                      fill
                      className="rounded object-cover border absolute top-0 left-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
                      unoptimized
                    />
                  )}
                </div>

                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    Qty: {item.qty} ×{" "}
{formatCurrency(item.price)}

                  </p>
                </div>
                <p className="font-semibold">
                  {formatCurrency(item.price * item.qty)}

                </p>
              </div>
            ))}

            {/* Total */}
            <div className="border-t pt-3 flex justify-between items-center mt-2">
              <span className="font-medium">Total Amount:</span>
              <span className="font-bold text-lg">
                {formatCurrency(order.amount)}

              </span>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
