"use client";

import { useEffect, useState } from "react";

interface User {
  _id: string;
  name: string;
  email?: string;
}

interface Order {
  _id: string;
  orderId?: string;
  user: User;
  amount: number;
    currency?: string;

  status: string;
  createdAt: string;
}
const formatMoney = (amount: number, currency = "aud") => {
  const locale = currency.toLowerCase() === "aud" ? "en-AU" : "en-US";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount);
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Time filter state
  const [timeFilter, setTimeFilter] = useState<"week" | "month" | "year" | "older" | "custom" | "all">("all");
  const [customDate, setCustomDate] = useState<{ from: string; to: string }>({ from: "", to: "" });

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      if (data.success) setOrders(data.orders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-500 text-white",
    completed: "bg-green-500 text-white",
    cancelled: "bg-red-500 text-white",
    processing: "bg-blue-500 text-white",
  };

  if (loading) return <p className="text-center py-10">Loading orders...</p>;
  if (!orders.length)
    return <p className="text-center py-10 text-gray-600">No orders found.</p>;

  // ✅ Filter orders by time
  const filteredOrders = orders.filter((order) => {
    if (timeFilter === "all") return true; // show all orders

    const orderDate = new Date(order.createdAt);
    const now = new Date();

    if (timeFilter === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);
      return orderDate >= weekAgo;
    } else if (timeFilter === "month") {
      const monthAgo = new Date();
      monthAgo.setMonth(now.getMonth() - 1);
      return orderDate >= monthAgo;
    } else if (timeFilter === "year") {
      const yearAgo = new Date();
      yearAgo.setFullYear(now.getFullYear() - 1);
      return orderDate >= yearAgo;
    } else if (timeFilter === "older") {
      return orderDate.getFullYear() < now.getFullYear() - 1;
    } else if (timeFilter === "custom" && customDate.from && customDate.to) {
      const fromDate = new Date(customDate.from);
      const toDate = new Date(customDate.to);
      toDate.setHours(23, 59, 59);
      return orderDate >= fromDate && orderDate <= toDate;
    }

    return true;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">All Orders</h1>

      {/* Time Filter Dropdown + Reset */}
      <div className="mb-4 flex items-center gap-4">
        <label className="font-medium">Filter by Time:</label>
        <select
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value as any)}
          className="border px-2 py-1 rounded"
        >
          <option value="all">All Orders</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
          <option value="older">Older</option>
          <option value="custom">Custom</option>
        </select>

        {timeFilter === "custom" && (
          <div className="flex gap-2">
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

        <button
          onClick={() => {
            setTimeFilter("all"); // show all orders
            setCustomDate({ from: "", to: "" });
          }}
          className="px-3 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
        >
          Reset Filter
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm">
              <th className="px-6 py-3 text-left">Order ID</th>
              <th className="px-6 py-3 text-left">User</th>
              <th className="px-6 py-3 text-left">Amount</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => {
              const normalizedStatus = order.status?.toLowerCase();
              return (
                <tr
                  key={order._id}
                  className="border-b hover:bg-gray-50 transition duration-200"
                >
                  <td className="px-6 py-4 font-medium">{order.orderId || order._id}</td>
                  <td className="px-6 py-4">
                    {order.user?.name || "Unknown"}{" "}
                    <span className="text-gray-400 text-sm">({order.user?._id})</span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-700">
  {formatMoney(order.amount, order.currency || "aud")}

                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        statusColors[normalizedStatus] || "bg-gray-300 text-gray-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
