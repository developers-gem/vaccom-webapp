// vacuum-app (1)\vacuum-app\src\app\product-category\[slug]

"use client";

import ProductCard from "@/app/components/ProductCard";
import ProductToolbar from "@/app/components/ProductToolbar";
import { useState, useEffect } from "react";
import { generateSlug } from "@/utils/slug";

interface Props {
  params: { slug: string };
}

// ✅ make a "pretty label" from slug
function toTitleCase(slug: string) {
  return slug
    .replace(/-/g, " ") // dashes → spaces
    .replace(/\b\w/g, (c) => c.toUpperCase()); // capitalize
}

export default function CategoryPage({ params }: Props) {
  const rawSlug = decodeURIComponent(params.slug); // always decode
  const normalizedSlug = rawSlug.toLowerCase();

  const [sort, setSort] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [products, setProducts] = useState<any[]>([]);

  // ✅ fetch products using slug (not category name)
  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
    const apiUrl =
      normalizedSlug === "today-deals"
        ? `${baseUrl}/api/products?isTodayDeal=true`
        : `${baseUrl}/api/products?category=${encodeURIComponent(
            normalizedSlug
          )}`;

    console.log("Fetching products from:", apiUrl);

    fetch(apiUrl, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        const arr = Array.isArray(data) ? data : data.products || [];
        const productsWithBadges = arr.map((p: any) => ({
          ...p,
          badge: p.salePrice ? "sale" : p.badge || undefined,
        }));
        setProducts(productsWithBadges);
      })
      .catch((err) => console.error("❌ Fetch failed", err));
  }, [normalizedSlug]);

  return (
    <div>
      {/* Banner */}
      <div className="bg-[url('/banner-img/VACCUM-banner.webp')] bg-cover bg-center h-64 md:h-72 flex items-center">
        <div className="flex flex-col justify-center ml-6 md:ml-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            {normalizedSlug === "today-deals"
              ? "Today's Deals"
              : toTitleCase(normalizedSlug)}
          </h1>
          <span className="text-white text-xl md:text-2xl">
            {normalizedSlug === "today-deals"
              ? "Products on Today's Deals"
              : `Category: ${toTitleCase(normalizedSlug)}`}
          </span>
        </div>
      </div>

      {/* Today Deals paragraph */}
      {normalizedSlug === "today-deals" && (
        <div className="max-w-6xl mx-auto p-6 text-lg text-gray-700">
          <h5 className="mt-10">
            <b>Vacuum Cleaners, Parts & Repairs — All in One Place</b>
          </h5>
          <p className="mt-5 mb-3">
            Whether you’re shopping for a new vacuum, replacing parts, or
            booking a repair, you can do it all right here. We offer fast
            Australia-wide shipping and expert support from our experienced
            vacuum technicians.
          </p>
          <p>
            Not sure which model suits your home? Contact us or visit one of our
            Melbourne stores — we’ll help you find the right fit.
          </p>
        </div>
      )}

      {/* Products */}
      <div className="max-w-6xl mx-auto p-6">
        {/* <h1 className="text-3xl font-bold mb-6">
          {normalizedSlug === "today-deals"
            ? "Today's Deals"
            : toTitleCase(normalizedSlug)}
        </h1> */}

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
          <p>
            No products found{" "}
            {normalizedSlug === "today-deals"
              ? "in Today's Deals."
              : "in this category."}
          </p>
        )}
      </div>
    </div>
  );
}
