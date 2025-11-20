// vacuum-app (1)\vacuum-app\src\app\product-brand\[slug]
"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/app/components/ProductCard";
import ProductToolbar from "@/app/components/ProductToolbar";

interface Props {
  params: Promise<{ slug: string }>;
}

export default function BrandPage({ params }: Props) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState("");
  const [brandName, setBrandName] = useState<string>("");

  useEffect(() => {
    async function fetchProducts() {
      const { slug: rawSlug } = await params;
      if (!rawSlug) return;

      const normalizedSlug = decodeURIComponent(rawSlug).replace(/-/g, " ").trim();

      try {
        // Fetch all products from API and filter on frontend to match brand ignoring case & hyphen/space
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
        const res = await fetch(`${baseUrl}/api/products`, { cache: "no-store" });
        const data = await res.json();
        const allProducts = Array.isArray(data) ? data : data.products || [];

        // Filter products where brand matches normalizedSlug ignoring case and hyphen/space
        const prods = allProducts.filter((p: any) =>
          p.brand.replace(/[-\s]/g, "").toLowerCase() === normalizedSlug.replace(/\s/g, "").toLowerCase()
        );

        setProducts(prods);

        // Display brand as in DB (first product) or fallback
        if (prods.length > 0) setBrandName(prods[0].brand);
        else setBrandName(normalizedSlug);
      } catch (e) {
        console.error("❌ Failed to fetch products:", e);
        setProducts([]);
        setBrandName(normalizedSlug);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [params]);

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div>
      {/* Banner */}
      <div
  style={{
    backgroundImage: "url('/banner-img/VACCUM-banner.webp')",
  }}
  className="bg-cover bg-center h-64 md:h-72 flex items-center"
>
  <div className="flex flex-col justify-center ml-6 md:ml-12">
    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{brandName || "Brand"}</h1>
    <span className="text-white text-xl md:text-2xl">Brand: {brandName}</span>
  </div>
</div>


      {/* Toolbar */}
      <div className="max-w-6xl mx-auto p-6">
        <ProductToolbar
          results={products.length}
          sort={sort}
          setSort={setSort}
          view={view}
          setView={setView}
        />

        {/* Products */}
        {products.length > 0 ? (
          <div className={`grid gap-6 ${view === "grid" ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3" : "grid-cols-1"}`}>
            {products.map((product: any) => (
              <ProductCard key={product._id} product={product} view={view} />
            ))}
          </div>
        ) : (
          <p>No products found for this brand.</p>
        )}
      </div>
    </div>
  );
}
