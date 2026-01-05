// components/RecentOrders.tsx
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
  status: string;
  createdAt: string;
}
// ✅ Currency formatter (AUD)
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
  }).format(amount);
};

export default function RecentOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      if (data.success) setOrders(data.orders.slice(0, 20)); // 👈 show only 5 latest
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
    processing: "bg-blue-100 text-blue-700",
  };

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Recent Orders</h2>
        {/* <a
          href="/admin/orders"
          className="text-sm text-indigo-600 hover:underline"
        >
          View All
        </a> */}
      </div>

      {loading ? (
        <p className="text-center py-6">Loading orders...</p>
      ) : !orders.length ? (
        <p className="text-center py-6 text-gray-500">No recent orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase">
                <th className="px-4 py-2 text-left">Order ID</th>
                <th className="px-4 py-2 text-left">Customer</th>
                <th className="px-4 py-2 text-left">Amount</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const normalizedStatus = order.status?.toLowerCase();
                return (
                  <tr
                    key={order._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-2">
                      {order.orderId || order._id.slice(0, 6)}
                    </td>
                    <td className="px-4 py-2">{order.user?.name || "Unknown"}</td>
                    <td className="px-4 py-2 font-medium text-gray-700">
                     {formatCurrency(order.amount)}

                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          statusColors[normalizedStatus] ||
                          "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
