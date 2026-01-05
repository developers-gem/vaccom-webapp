"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

interface OrderDetail {
  _id: string;
  user: { name: string; email: string };
  products: {
    productId: string;
    name: string;
    price: number;
    qty: number;
    image: string;
  }[];
  amount: number;
  status: string;
  createdAt: string;
  currency: string;
}

export default function AdminOrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  // ✅ Fetch order details and normalize products
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/admin/orders/${id}`);
        if (!res.ok) throw new Error("Failed to fetch order");
        const data = await res.json();

        if (data.success) {
          const normalizedOrder: OrderDetail = {
            ...data.order,
            products: (data.order.products || []).map((p: any) => ({
              productId: p._id || p.productId,
              name: p.name || "Unnamed product",
              price: Number(p.price) || 0,
              qty: Number(p.qty) || 1,
              image: p.image || "/placeholder.png",
            })),
            amount: Number(data.order.amount) || 0,
            status: data.order.status || "Pending",
            currency: data.order.currency || "AUD",
          };

          setOrder(normalizedOrder);
          setSelectedStatus(normalizedOrder.status);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <p className="p-6">Loading order details...</p>;
  if (!order) {
    router.push("/admin/orders");
    return null;
  }

  // ✅ Currency formatter
  const formatCurrency = (amount: number, currency: string) => {
  const normalized = (currency || "AUD").toUpperCase();

  const locale = normalized === "AUD" ? "en-AU" : "en-US";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: normalized,
  }).format(amount);
};


  // ✅ Status badge
  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded text-white text-sm font-semibold";
    switch (status.toLowerCase()) {
      case "pending":
        return <span className={`${baseClasses} bg-yellow-500`}>{status}</span>;
      case "processing":
        return <span className={`${baseClasses} bg-blue-500`}>{status}</span>;
      case "completed":
        return <span className={`${baseClasses} bg-green-500`}>{status}</span>;
      case "cancelled":
        return <span className={`${baseClasses} bg-red-500`}>{status}</span>;
      default:
        return <span className={`${baseClasses} bg-gray-500`}>{status}</span>;
    }
  };

  // ✅ Update order status
  const handleStatusUpdate = async () => {
    if (!order) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: selectedStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setOrder({
          ...order,
          status: data.order.status || selectedStatus,
        });
        alert("Order status updated!");
      } else {
        alert(data.error || "Failed to update order status");
      }
    } catch (err) {
      console.error(err);
      alert("Unexpected error while updating order status");
    } finally {
      setUpdating(false);
    }
  };

  // ✅ Delete order
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    try {
      const res = await fetch(`/api/admin/orders/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        alert("Order deleted successfully!");
        router.push("/admin/orders");
      } else {
        alert(data.error || "Failed to delete order");
      }
    } catch (err) {
      console.error(err);
      alert("Unexpected error while deleting order");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Order Details</h1>

      <p>
        <strong>User:</strong> {order.user?.name} ({order.user?.email})
      </p>
      <p>
        <strong>Status:</strong> {getStatusBadge(order.status)}
      </p>
      <p>
        <strong>Amount:</strong>{" "}
        {formatCurrency(Number(order.amount), order.currency)}
      </p>
      <p>
        <strong>Created At:</strong> {new Date(order.createdAt).toLocaleString()}
      </p>

      {/* ✅ Update Status */}
      <div className="mt-4 flex items-center gap-2">
        <label className="font-semibold">Update Status: </label>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          disabled={updating}
          className="border px-3 py-1 rounded"
        >
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <button
          onClick={handleStatusUpdate}
          disabled={updating}
          className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {updating ? "Updating..." : "Update"}
        </button>
      </div>

      {/* ✅ Delete Order */}
      <button
        onClick={handleDelete}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Delete Order
      </button>

      <h2 className="text-xl font-semibold mt-6 mb-2">Products</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Image</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Price</th>
              <th className="border px-4 py-2">Quantity</th>
              <th className="border px-4 py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.products.map((p, index) => {
              const price = Number(p.price) || 0;
              const qty = Number(p.qty) || 1;
              const total = price * qty;

              return (
                <tr key={p.productId || index} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">
                    {p.image ? (
                      <Image
                        src={p.image}
                        alt={p.name || "Product image"}
                        width={50}
                        height={50}
                        className="object-contain rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                        No Image
                      </div>
                    )}
                  </td>
                  <td className="border px-4 py-2">{p.name}</td>
                  <td className="border px-4 py-2">{formatCurrency(price, order.currency)}</td>
                  <td className="border px-4 py-2">{qty}</td>
                  <td className="border px-4 py-2 font-semibold">{formatCurrency(total, order.currency)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
