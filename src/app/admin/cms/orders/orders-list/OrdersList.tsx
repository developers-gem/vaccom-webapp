"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Order {
  _id: string;
  user: { name: string; email: string };
  amount: number | string;
  status: string;
  createdAt: string;
  currency: string;
   address?: {
    fullName: string;
    phone: string;
    state: string;
    postalCode: string;
    country: string;
  };
  products: {
    productId: string;
    name: string;
    price: number | string;
    qty?: number | string;
    image?: string;
    imageUrl?: string;
    
  }[];
}

export default function OrdersList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedStatuses, setSelectedStatuses] = useState<Record<string, string>>({});
  const [timeFilter, setTimeFilter] = useState<"week" | "month" | "year" | "custom">("week");
  const [customDate, setCustomDate] = useState<{ from: string; to: string }>({ from: "", to: "" });

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/orders");
        const data = await res.json();
        if (data.success) {
          setOrders(data.orders);
          // initialize selectedStatuses
          const initialStatuses: Record<string, string> = {};
          data.orders.forEach((o: Order) => {
            initialStatuses[o._id] = o.status;
          });
          setSelectedStatuses(initialStatuses);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p>Loading orders...</p>;
  if (!orders.length) return <p>No orders found.</p>;

  // ✅ Currency formatter
  const formatCurrency = (amount: number, currency: string) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: currency.toUpperCase() }).format(amount);

  // ✅ Helper to render status badge
  const getStatusBadge = (status: string) => {
    const base = "px-2 py-1 rounded text-white text-xs font-semibold";
    switch (status.toLowerCase()) {
      case "pending":
        return <span className={`${base} bg-yellow-500`}>{status}</span>;
      case "completed":
        return <span className={`${base} bg-green-500`}>{status}</span>;
      case "cancelled":
        return <span className={`${base} bg-red-500`}>{status}</span>;
      case "processing":
        return <span className={`${base} bg-blue-500`}>{status}</span>;
      default:
        return <span className={`${base} bg-gray-500`}>{status}</span>;
    }
  };

  // ✅ Handle status update
  const handleStatusUpdate = async (orderId: string) => {
  const newStatus = selectedStatuses[orderId];
  if (!newStatus) return;

  setUpdatingId(orderId);
  try {
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    const data = await res.json();

    if (data.success && data.order) {
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? data.order : o))
      );
      alert("Order status updated!");
    } else {
      alert(data.message || "Failed to update order status");
    }
  } catch (err) {
    console.error(err);
    alert("Unexpected error while updating order status");
  } finally {
    setUpdatingId(null);
  }
};


  // ✅ Filter orders by time
  const filteredOrders = orders.filter((order) => {
    const orderDate = new Date(order.createdAt);
    const now = new Date();

    if (timeFilter === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);
      return orderDate >= weekAgo;
    }

    if (timeFilter === "month") {
      const monthAgo = new Date();
      monthAgo.setMonth(now.getMonth() - 1);
      return orderDate >= monthAgo;
    }

    if (timeFilter === "year") {
      const yearAgo = new Date();
      yearAgo.setFullYear(now.getFullYear() - 1);
      return orderDate >= yearAgo;
    }

    if (timeFilter === "custom" && customDate.from && customDate.to) {
      const fromDate = new Date(customDate.from);
      const toDate = new Date(customDate.to);
      toDate.setHours(23, 59, 59); // include entire day
      return orderDate >= fromDate && orderDate <= toDate;
    }

    return true;
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Orders List</h1>

      {/* 🔹 Filter Dropdown */}
      <div className="mb-4 flex items-center gap-4">
        <label className="font-semibold">Filter by:</label>
        <select
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value as any)}
          className="border px-2 py-1 rounded"
        >
          <option value="week"> Week</option>
          <option value="month"> Month</option>
          <option value="year"> Year</option>
          <option value="custom">Custom</option>
        </select>

        {timeFilter === "custom" && (
          <div className="flex gap-2">
            <input
              type="date"
              value={customDate.from}
              onChange={(e) => setCustomDate({ ...customDate, from: e.target.value })}
              className="border px-2 py-1 rounded"
            />
            <input
              type="date"
              value={customDate.to}
              onChange={(e) => setCustomDate({ ...customDate, to: e.target.value })}
              className="border px-2 py-1 rounded"
            />
          </div>
        )}
      </div>

      {/* 🔹 Orders List */}
      <div className="space-y-6">
        {filteredOrders.length === 0 && <p>No orders found for this period.</p>}

        {filteredOrders.map((order) => (
          <div key={order._id} className="border rounded-lg shadow-sm p-4 bg-white">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-semibold text-lg">Order #{order._id.slice(-6)}</h2>
            </div>

            <p>
              <strong>User:</strong> {order.user?.name} ({order.user?.email})
            </p>
            <p>
              <strong>Status:</strong> {getStatusBadge(order.status)}
            </p>
            <p>
              <strong>Amount:</strong> {formatCurrency(Number(order.amount), order.currency)}
            </p>
            <p>
              <strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}
            </p>

            <div className="mt-2 text-sm bg-gray-50 p-3 rounded border">
  <p><strong>Name:</strong> {order.address?.fullName || "-"}</p>
  <p><strong>Phone:</strong> {order.address?.phone || "-"}</p>
  <p><strong>State:</strong> {order.address?.state || "-"}</p>
  <p><strong>Postcode:</strong> {order.address?.postalCode || "-"}</p>
  <p><strong>Country:</strong> {order.address?.country || "-"}</p>
</div>

            {/* Status Update Dropdown + Button */}
            <div className="mt-2 flex items-center gap-2">
              <label className="text-sm font-semibold">Update Status:</label>
              <select
                value={selectedStatuses[order._id] || order.status}
                onChange={(e) =>
                  setSelectedStatuses((prev) => ({ ...prev, [order._id]: e.target.value }))
                }
                disabled={updatingId === order._id}
                className="border px-2 py-1 rounded text-sm"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button
                onClick={() => handleStatusUpdate(order._id)}
                disabled={updatingId === order._id}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                {updatingId === order._id ? "Updating..." : "Update"}
              </button>
            </div>

            {/* Mini Products Table */}
            <div className="mt-4 overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-2 py-1">Image</th>
                    <th className="border px-2 py-1">Name</th>
                    <th className="border px-2 py-1">Qty</th>
                    <th className="border px-2 py-1">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {order.products.map((p, i) => {
                    const price = Number(p.price) || 0;
                    const imageSrc = p.imageUrl || p.image || "/placeholder.png";
                    return (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="border px-2 py-1">
                          <div className="relative w-12 h-12">
                            <Image src={imageSrc} alt={p.name || "Product"} fill className="object-contain rounded" unoptimized />
                          </div>
                        </td>
                        <td className="border px-2 py-1">{p.name}</td>
                        <td className="border px-2 py-1">{p.qty || 1}</td>
                        <td className="border px-2 py-1">{formatCurrency(price, order.currency)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
