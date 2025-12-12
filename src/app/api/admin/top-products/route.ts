import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";

export async function GET() {
  try {
    await connectToDatabase();

    const orders = await Order.find({}).lean();
    if (!orders.length) return NextResponse.json([], { status: 200 });

    const sampleProduct = orders[0].products?.[0];
    if (!sampleProduct) return NextResponse.json([], { status: 200 });

    let topProducts: any[] = [];

    if (sampleProduct.productId) {
      topProducts = await Order.aggregate([
        { $unwind: "$products" },
        {
          $group: {
            _id: "$products.productId",
            totalSold: { $sum: "$products.qty" },
          },
        },
        { $sort: { totalSold: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "_id",
            as: "product",
          },
        },
        { $unwind: "$product" },
        {
          $project: {
            _id: 0,
            name: "$product.name",
            price: "$product.price",
            image: "$product.image",
            sales: "$totalSold",
            revenue: { $multiply: ["$totalSold", "$product.price"] },
          },
        },
      ]);
    } else if (sampleProduct.name) {
      topProducts = await Order.aggregate([
        { $unwind: "$products" },
        {
          $group: {
            _id: "$products.name",
            totalSold: { $sum: "$products.qty" },
            price: { $first: "$products.price" },
            image: { $first: "$products.image" },
          },
        },
        { $sort: { totalSold: -1 } },
        { $limit: 5 },
        {
          $project: {
            _id: 0,
            name: "$_id",
            price: 1,
            image: 1,
            sales: "$totalSold",
            revenue: { $multiply: ["$totalSold", "$price"] },
          },
        },
        
      ]);
    }

    return NextResponse.json(topProducts);
  } catch (error) {
    console.error("Error fetching top products:", error);
    return NextResponse.json({ error: "Failed to fetch top products" }, { status: 500 });
  }
}
