"use client";

import ProductCard from "@/app/components/ProductCard";
import ProductToolbar from "@/app/components/ProductToolbar";
import { useState, useEffect } from "react";

interface Props {
  params: { slug: string };
}

// Map slug → DB category
const CATEGORY_MAP: Record<string, string> = {
  "accessories-%26-parts": "Accessories & Parts",
  "vacuum-bags-%26-filters": "Vacuum Bags & Filters",
  "corded-vacuums": "Corded Vacuums",
  "cordless-vacuums": "Cordless Vacuums",
  "robots": "Robots",
  "carpet-washers": "Carpet Washers",
  "hard-floor-cleaners": "Hard Floor Cleaners",
  "steamers": "Steamers",
  "commercial": "Commercial",
  "cleaning-chemicals": "Cleaning Chemicals",
};

// Convert slug → readable category (fallback if not in map)
function formatCategoryFromSlug(slug: string) {
  return CATEGORY_MAP[slug] || decodeURIComponent(slug)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function CategoryPage({ params }: Props) {
  const rawSlug = params.slug;
  const categoryName = formatCategoryFromSlug(rawSlug); // ✅ exact DB match

  const [sort, setSort] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

    const apiUrl =
      rawSlug === "today-deals"
        ? `${baseUrl}/api/products?isTodayDeal=true`
        : `${baseUrl}/api/products?category=${encodeURIComponent(categoryName)}`;

    console.log("FETCH URL:", apiUrl);
    console.log("CATEGORY SENT:", categoryName);

    fetch(apiUrl, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        const arr = Array.isArray(data) ? data : data.products || [];
        setProducts(arr);
      })
      .catch((err) => console.error("❌ Fetch failed", err));
  }, [rawSlug, categoryName]);

  return (
    <div>
      {/* Banner */}
      <div className="bg-[url('/banner-img/banner-image5.webp')] bg-cover bg-center h-64 md:h-72 flex items-center">
        <div className="flex flex-col justify-center ml-6 md:ml-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            {categoryName}
          </h1>
          <span className="text-white text-xl md:text-2xl">
            Category: {categoryName}
          </span>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-6xl mx-auto p-6">
        <ProductToolbar
          results={products.length}
          sort={sort}
          setSort={setSort}
          view={view}
          setView={setView}
        />

        {products.length > 0 ? (
          <div
            className={`${
              view === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
                : "flex flex-col gap-4"
            }`}
          >
            {products.map((product: any) => (
              <ProductCard key={product._id} product={product} view={view} />
            ))}
          </div>
        ) : (
          <p>No products found in this category.</p>
        )}
      </div>
    </div>
  );
}
