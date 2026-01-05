"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "@/app/components/ProductCard";

const categories = [
  { slug: "all", name: "Our All Products" },
  { slug: "corded-vacuums", name: "Corded Vacuums" },
  { slug: "cordless-vacuums", name: "Cordless Vacuums" },
  { slug: "robots", name: "Robots" },
  { slug: "carpet-washers", name: "Carpet Washers" },
  { slug: "hard-floor-cleaners", name: "Hard Floor Cleaners" },
  { slug: "steamers", name: "Steamers" },
  { slug: "commercial", name: "Commercial" },
  { slug: "cleaning-chemicals", name: "Cleaning Chemicals" },
  { slug: "accessories and parts", name: "Accessories & Parts" },
];

export default function HomeProductsSection() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const url =
          activeCategory === "all"
            ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/products`
            : `${process.env.NEXT_PUBLIC_BASE_URL}/api/products?category=${activeCategory}`;

        const res = await fetch(url, { cache: "no-store" });
        const data = await res.json();
        const allProducts = Array.isArray(data) ? data : data.products || [];
        setProducts(allProducts.slice(0, 8)); // ✅ only 8 products visible
      } catch (err) {
        console.error("Error fetching products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeCategory]);

  return (
    <section className="py-12 bg-red-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Heading */}
        <h2 className="text-3xl md:text-[44px] font-bold text-center text-red-600">
          Our Products
        </h2>
        <p className="text-center text-gray-700 text-[18px] mt-2">
          Smart designs for effortless cleaning — from powerful cordless vacuums
          to lightweight models built for everyday use.
        </p>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setActiveCategory(cat.slug)}
              className={`px-4 py-3 text-[18px] rounded-md font-medium transition ${
                activeCategory === cat.slug
                  ? "bg-black text-white"
                  : "bg-red-600 text-white hover:bg-black"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Products */}
        <div className="mt-8">
          {loading ? (
            <p className="text-center">Loading products...</p>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* ✅ View More button — dynamic links */}
              <div className="flex justify-center mt-8">
                <Link
                  href={
                    activeCategory === "all"
                      ? "/all-products" // 👉 goes to All Products page
                      : `/product-category/${activeCategory}` // 👉 goes to Category page
                  }
                  className="px-6 py-3 bg-black text-white rounded-md hover:bg-red-600 transition"
                >
                  View More
                </Link>
              </div>
            </>
          ) : (
            <p className="text-center">No products found.</p>
          )}
        </div>
      </div>
    </section>
  );
}
