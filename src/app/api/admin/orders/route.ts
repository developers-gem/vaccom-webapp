import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";

interface Product {
  productId: string;
  name: string;
  price: number | string;
  qty?: number | string;
  image?: string;
  imageUrl?: string;
}

interface OrderDetail {
  _id: string;
  user: { name: string; email: string };
  products: Product[];
  amount: number | string;
  status: string;
  createdAt: string;
  currency: string;
}

export async function GET(req: Request) {
  try {
    await connectToDatabase();

    // ✅ Populate user + product details (fetching name, price, image fields)
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("products.productId", "name price image imageUrl") // 👈 add this
      .sort({ createdAt: -1 })
      .lean();

    const sanitizedOrders: OrderDetail[] = orders.map((order: any) => ({
      _id: order._id,
      user: order.user,
      status: order.status,
      createdAt: order.createdAt,
      currency: order.currency,
      amount: Number(order.amount),
      products: order.products.map((p: any) => ({
        productId: p.productId?._id || p.productId,
        name: p.productId?.name || p.name,
        price: Number(p.productId?.price || p.price),
        qty: Number(p.qty) || 1,
        image: p.productId?.image || p.image || null,       // ✅ include image
        imageUrl: p.productId?.imageUrl || p.imageUrl || null, // ✅ include imageUrl
      })),
    }));

    return NextResponse.json({ success: true, orders: sanitizedOrders }, { status: 200 });
  } catch (err: any) {
    console.error("❌ Error fetching admin orders:", err.message || err);
    return NextResponse.json(
      { success: false, error: "Unexpected error while fetching orders" },
      { status: 500 }
    );
  }
}
