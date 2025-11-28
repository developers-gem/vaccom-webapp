"use client";

import ProductCard from "@/app/components/ProductCard";
import ProductToolbar from "@/app/components/ProductToolbar";
import { useState, useEffect } from "react";

interface Props {
  params: { slug: string };
}

// Map slug → DB category
const CATEGORY_MAP: Record<string, string> = {
  "accessories-and-parts": "Accessories and Parts",
  "vacuum-bags-and-filters": "Vacuum Bags and Filters",
  "corded-vacuums": "Corded Vacuums",
  "cordless-vacuums": "Cordless Vacuums",
  robots: "Robots",
  "carpet-washers": "Carpet Washers",
  "hard-floor-cleaners": "Hard Floor Cleaners",
  steamers: "Steamers",
  commercial: "Commercial",
  "cleaning-chemicals": "Cleaning Chemicals",
};

// Category descriptions
const CATEGORY_DESCRIPTION: Record<string, string> = {
  "Accessories and Parts":
    "Accessories & Parts Vaccom  essential additions and replacements to keep your cleaning machines operating at peak performance. From brushes, filters, and nozzles to hoses, pads, and spare components, our selection ensures your vacuums, steamers, and floor cleaners stay efficient and reliable. Ideal for those wanting to replace worn parts or enhance functionality, these accessories help extend the life of your equipment. Choose from quality-tested parts and accessories that make maintenance simple and ensure long-lasting cleaning performance.",

  "Vacuum Bags and Filters":
    "Ensure peak performance and air quality with Vaccom’s Vacuum Bags & Filters collection a range of high-quality bags and filters designed to capture dust, allergens, and debris effectively. Whether you use upright vacuums, canisters, or industrial machines, our bags and filters help maintain suction power while protecting your motor and improving filtration. Easy to replace and compatible with various models, they make upkeep hassle-free. Choose Vaccom’s vacuum bags and filters for cleaner air, stronger cleaning performance, and longer-lasting equipment.",

  "Corded Vacuums":
    "Discover powerful and reliable corded vacuums at Vaccom, designed to deliver consistent suction for deep cleaning every corner of your home or workspace. Ideal for long cleaning sessions, corded vacuum cleaners provide uninterrupted power, superior performance, and durability you can trust. Whether you need a high-capacity model for commercial use or a lightweight design for daily cleaning, our range offers exceptional efficiency on carpets, hard floors, and upholstery. Explore Vaccom’s corded vacuum solutions and enjoy advanced filtration, strong airflow, and long-lasting reliability to keep your environment spotless. ",

  "Cordless Vacuums":
    "Explore our premium range of cordless vacuums designed for powerful, hassle-free cleaning. With no cords to restrict movement, these lightweight and efficient vacuums make it easy to clean carpets, hard floors, and tight spaces. Enjoy strong suction, long battery life, and easy handling for everyday use. Whether you need quick clean-ups or full home cleaning, our cordless vacuum collection offers the perfect balance of performance and convenience. Shop now and upgrade your cleaning experience. ",

  Robots:
    "Explore our Robots collection at Vaccom, featuring smart and powerful robot vacuums designed to clean your home with ease. These advanced cleaners offer automatic navigation, strong suction, and multi-surface performance, making daily cleaning effortless. Whether you need a robot for pet hair, carpets, or hard floors, our range provides reliable and hands-free solutions. Enjoy cleaner spaces, smart home compatibility, and time-saving technology with Vaccom’s high-quality robot vacuums. Find the perfect robotic cleaner to keep your home fresh and tidy every day. ",

  "Carpet Washers":
    "Vaccom Carpet Washers — powerful cleaning machines designed to deep-clean carpets, rugs, and upholstery with ease. Whether you’re tackling stubborn stains, grime, or embedded dirt, these carpet washers deliver strong suction and thorough cleaning for a refreshed, like-new look. Ideal for homes, offices, or rental spaces, they save time and effort compared with manual scrubbing. Choose from a range of reliable, easy-to-use models that make carpet maintenance simple and efficient. Keep your floors and fabrics spotless with Vaccom’s carpet washing solutions.",

  "Hard Floor Cleaners":
    "Transform how you clean your hard floors with Vaccom’s Hard Floor Cleaners — powerful machines built for tile, wood, laminate, vinyl and more. These cleaners combine smart suction, gentle scrubbing or wiping, and water-management to lift dust, grime and spills without damaging your floor surface. Many models offer self-cleaning rollers, easy-to-empty tanks, and quick-dry finish so you can walk on floors soon after cleaning. Whether you need daily maintenance or deep cleaning, Vaccom’s hard floor cleaners make chores faster, easier and far more effective. ",

  Steamers:
    "Discover the power of Vaccom Steamers — high-performance machines designed to sanitize and deep-clean floors, tiles, grout, and hard surfaces using the natural power of steam. Perfect for removing stubborn dirt, grease, and bacteria without harsh chemicals, these steamers deliver a hygienic, streak-free finish. Lightweight, easy to handle, and suitable for a variety of surfaces, they make regular cleaning quick and eco-friendly. Choose from versatile steamer models that bring efficient, chemical-free cleaning to your home — ideal for busy households and those seeking a deeper clean.",

  Commercial:
    "Explore Commercial Vaccom cleaning solutions durable, high-performance machines built for heavy-duty cleaning tasks in workplaces, offices, retail spaces, and large facilities. Whether you need powerful vacuums, floor scrubbers, carpet washers, or steam cleaners, our commercial-grade equipment is engineered for efficiency, reliability, and long-lasting performance. Designed for frequent use and larger areas, these machines help maintain cleanliness and hygiene standards with minimal effort. Choose Vaccom’s commercial cleaning range for dependable, robust solutions that keep your business environment spotless and professional. ",

  "Cleaning Chemicals":
    "Cleaning Chemicals Vaccom  effective and safe solutions for sanitising and maintaining floors, carpets, tiles, and more. From powerful degreasers and spot removers to gentle everyday cleaners, our range helps keep your home or workplace spotless and hygienic. Formulated for performance and compatibility with a variety of surfaces, these cleaning agents make it easy to tackle dirt, stains, and odors. Choose Vaccom’s cleaning chemicals for a deep, thorough clean that leaves your space fresh, healthy, and sparkling. ",
};

// Convert slug → readable category (fallback if not in map)
function formatCategoryFromSlug(slug: string) {
  return (
    CATEGORY_MAP[slug] ||
    decodeURIComponent(slug)
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

export default function CategoryPage({ params }: Props) {
  const rawSlug = params.slug;
  const categoryName = formatCategoryFromSlug(rawSlug);

  const [sort, setSort] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");

  const [products, setProducts] = useState<any[]>([]);
  const [sortedProducts, setSortedProducts] = useState<any[]>([]);

  // Pagination State
  const [page, setPage] = useState(1);
  const perPage = 10;

  // ===========================
  // FETCH PRODUCTS
  // ===========================
  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

    const apiUrl =
      rawSlug === "today-deals"
        ? `${baseUrl}/api/products?isTodayDeal=true`
        : `${baseUrl}/api/products?category=${encodeURIComponent(categoryName)}`;

    fetch(apiUrl, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        const arr = Array.isArray(data) ? data : data.products || [];

        setProducts(arr);
        setSortedProducts(arr);
        setPage(1); // reset pagination on new category
      })
      .catch((err) => console.error("❌ Fetch failed", err));
  }, [rawSlug, categoryName]);

  // ===========================
  // SORTING LOGIC
  // ===========================
  useEffect(() => {
    if (!products.length) return;

    let sorted = [...products];

    if (sort === "low") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sort === "high") {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sort === "newest") {
      sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    setSortedProducts(sorted);
    setPage(1);
  }, [sort, products]);

  // ===========================
  // PAGINATION
  // ===========================
  const start = (page - 1) * perPage;
  const paginatedProducts = sortedProducts.slice(start, start + perPage);
  const totalPages = Math.ceil(sortedProducts.length / perPage);

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

      {/* Category Description */}
      <div className="max-w-7xl mx-auto p-10 text-gray-700 leading-relaxed text-lg">
        {CATEGORY_DESCRIPTION[categoryName]}
      </div>

      {/* Products */}
      <div className="max-w-6xl mx-auto p-6">
        <ProductToolbar
          results={sortedProducts.length}
          sort={sort}
          setSort={setSort}
          view={view}
          setView={setView}
        />

        {sortedProducts.length > 0 ? (
          <>
            <div
              className={`${
                view === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
                  : "flex flex-col gap-4"
              }`}
            >
              {paginatedProducts.map((product: any) => (
                <ProductCard key={product._id} product={product} view={view} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-10">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="px-4 py-2 border rounded disabled:opacity-40"
                >
                  Previous
                </button>

                <span className="font-semibold">
                  Page {page} of {totalPages}
                </span>

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className="px-4 py-2 border rounded disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="mt-6 text-center text-gray-600">
            No products found in this category.
          </p>
        )}
      </div>
    </div>
  );
}
