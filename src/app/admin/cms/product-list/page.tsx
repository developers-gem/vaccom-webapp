"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Papa from "papaparse";
interface Product {
  _id: string;
  slug: string;
  name: string;
  price: number;
  salePrice?: number;
  brand: string;
  category: string;
  images: string[];
  isTodayDeal?: boolean;
  stock: number;
  createdAt?: string;
  isActive: boolean;
}

export default function ProductListPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [query, setQuery] = useState(""); // search box
  const [searchIn, setSearchIn] = useState<"name" | "name_brand" | "name_brand_category">("name_brand_category");
  const [filterBrand, setFilterBrand] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterStock, setFilterStock] = useState<"all" | "in" | "out">("all");
  const [filterDeal, setFilterDeal] = useState<"all" | "yes" | "no">("all");
  const [filterActive, setFilterActive] = useState<"all" | "active" | "inactive">("all");

  const [sortBy, setSortBy] = useState<"priceAsc" | "priceDesc" | "nameAsc" | "nameDesc" | "newest">("newest");

  const [pageSize, setPageSize] = useState<number>(10);
  const [page, setPage] = useState<number>(1);

  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [savingIds, setSavingIds] = useState<Record<string, boolean>>({});
  const [deletingIds, setDeletingIds] = useState<Record<string, boolean>>({});

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => setPage(1), 250);
    return () => clearTimeout(t);
  }, [query, searchIn, filterBrand, filterCategory, filterStock, filterDeal, filterActive, sortBy, pageSize]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data);
    } catch (err: any) {
      console.error(err);
      setError("Unable to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // derived lists for filters
  const brands = useMemo(() => Array.from(new Set(products.map((p) => p.brand).filter(Boolean))), [products]);
  const categories = useMemo(() => Array.from(new Set(products.map((p) => p.category).filter(Boolean))), [products]);

  // filtered + searched + sorted
  const filtered = useMemo(() => {
    let arr = [...products];

    // filters
    if (filterBrand) arr = arr.filter((p) => p.brand === filterBrand);
    if (filterCategory) arr = arr.filter((p) => p.category === filterCategory);
    if (filterStock === "in") arr = arr.filter((p) => p.stock > 0);
    if (filterStock === "out") arr = arr.filter((p) => p.stock <= 0);
    if (filterDeal === "yes") arr = arr.filter((p) => p.isTodayDeal);
    if (filterDeal === "no") arr = arr.filter((p) => !p.isTodayDeal);
    if (filterActive === "active") arr = arr.filter((p) => p.isActive);
    if (filterActive === "inactive") arr = arr.filter((p) => !p.isActive);

    // search
    const q = query.trim().toLowerCase();
    if (q) {
      arr = arr.filter((p) => {
        const name = p.name?.toLowerCase() || "";
        const brand = p.brand?.toLowerCase() || "";
        const category = p.category?.toLowerCase() || "";
        if (searchIn === "name") return name.includes(q);
        if (searchIn === "name_brand") return name.includes(q) || brand.includes(q);
        return name.includes(q) || brand.includes(q) || category.includes(q);
      });
    }

    // sort
    switch (sortBy) {
      case "priceAsc":
        arr.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
        break;
      case "priceDesc":
        arr.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
        break;
      case "nameAsc":
        arr.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "nameDesc":
        arr.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "newest":
      default:
        arr.sort((a, b) => {
          const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return db - da;
        });
    }

    return arr;
  }, [products, query, searchIn, filterBrand, filterCategory, filterStock, filterDeal, filterActive, sortBy]);

  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  const toggleSelect = (id: string) => {
    setSelected((s) => ({ ...s, [id]: !s[id] }));
  };
  const selectAllOnPage = (val: boolean) => {
    const newSel = { ...selected };
    paged.forEach((p) => (newSel[p._id] = val));
    setSelected(newSel);
  };

  const anySelected = Object.values(selected).some(Boolean);
  const selectedIds = Object.entries(selected).filter(([, v]) => v).map(([k]) => k);

  // single actions
  const handleToggleActive = async (product: Product) => {
    setSavingIds((s) => ({ ...s, [product._id]: true }));
    // optimistic
    setProducts((ps) => ps.map((p) => (p._id === product._id ? { ...p, isActive: !p.isActive } : p)));
    try {
      const res = await fetch(`/api/products/${product.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !product.isActive }),
      });
      if (!res.ok) throw new Error("Failed");
      const updated = await res.json();
      setProducts((ps) => ps.map((p) => (p.slug === updated.slug ? { ...p, isActive: updated.isActive } : p)));
    } catch (err) {
      console.error(err);
      setError("Failed to toggle active.");
      // rollback
      setProducts((ps) => ps.map((p) => (p._id === product._id ? { ...p, isActive: product.isActive } : p)));
    } finally {
      setSavingIds((s) => {
        const c = { ...s };
        delete c[product._id];
        return c;
      });
    }
  };

  const handleDelete = async (product: Product) => {
    if (!confirm(`Delete "${product.name}"?`)) return;
    setDeletingIds((s) => ({ ...s, [product._id]: true }));
    try {
      const res = await fetch(`/api/products/${product.slug}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      setProducts((ps) => ps.filter((p) => p._id !== product._id));
      setSelected((s) => {
        const n = { ...s };
        delete n[product._id];
        return n;
      });
    } catch (err) {
      console.error(err);
      setError("Failed to delete product.");
    } finally {
      setDeletingIds((s) => {
        const c = { ...s };
        delete c[product._id];
        return c;
      });
    }
  };

  // bulk actions
  const bulkDelete = async () => {
    if (!selectedIds.length) return;
    if (!confirm(`Delete ${selectedIds.length} selected products?`)) return;
    const ids = [...selectedIds];
    // optimistic remove
    setProducts((ps) => ps.filter((p) => !ids.includes(p._id)));
    setSelected({});

    await Promise.all(
      ids.map(async (id) => {
        try {
          const p = products.find((x) => x._id === id);
          if (!p) return;
          await fetch(`/api/products/${p.slug}`, { method: "DELETE" });
        } catch (e) {
          console.error("bulk delete error", e);
        }
      })
    );
  };

  const bulkToggleActive = async () => {
    if (!selectedIds.length) return;
    const ids = [...selectedIds];
    // toggle locally
    setProducts((ps) => ps.map((p) => (ids.includes(p._id) ? { ...p, isActive: !p.isActive } : p)));
    setSelected({});
    await Promise.all(
      ids.map(async (id) => {
        try {
          const p = products.find((x) => x._id === id);
          if (!p) return;
          await fetch(`/api/products/${p.slug}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isActive: !p.isActive }),
          });
        } catch (e) {
          console.error("bulk toggle error", e);
        }
      })
    );
  };

  const bulkToggleDeal = async () => {
    if (!selectedIds.length) return;
    const ids = [...selectedIds];
    setProducts((ps) => ps.map((p) => (ids.includes(p._id) ? { ...p, isTodayDeal: !p.isTodayDeal } : p)));
    setSelected({});
    await Promise.all(
      ids.map(async (id) => {
        try {
          const p = products.find((x) => x._id === id);
          if (!p) return;
          await fetch(`/api/products/${p.slug}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isTodayDeal: !p.isTodayDeal }),
          });
        } catch (e) {
          console.error("bulk deal toggle error", e);
        }
      })
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <h1 className="text-2xl font-bold">Product List</h1>
        <div className="flex gap-2">
          <button
            className="bg-green-600 text-white px-4 py-2 rounded"
            onClick={() => router.push("/admin/cms/add-product")}
          >
            + Add Product
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white p-4 rounded shadow mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="flex items-center gap-2">
            <input
              aria-label="Search products"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search products...`}
              className="w-full border rounded px-3 py-2"
            />
            <select
              value={searchIn}
              onChange={(e) => setSearchIn(e.target.value as any)}
              className="border rounded px-2 py-2"
              aria-label="Search in"
            >
              <option value="name">Name</option>
              <option value="name_brand">Name + Brand</option>
              <option value="name_brand_category">Name + Brand + Category</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterBrand ?? ""}
              onChange={(e) => setFilterBrand(e.target.value || null)}
              className="border rounded px-2 py-2"
            >
              <option value="">All Brands</option>
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>

            <select
              value={filterCategory ?? ""}
              onChange={(e) => setFilterCategory(e.target.value || null)}
              className="border rounded px-2 py-2"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 justify-end">
            <select value={filterStock} onChange={(e) => setFilterStock(e.target.value as any)} className="border rounded px-2 py-2">
              <option value="all">All Stock</option>
              <option value="in">In Stock</option>
              <option value="out">Out of Stock</option>
            </select>

            <select value={filterDeal} onChange={(e) => setFilterDeal(e.target.value as any)} className="border rounded px-2 py-2">
              <option value="all">All Deals</option>
              <option value="yes">Today's Deal</option>
              <option value="no">Not Deal</option>
            </select>

            <select value={filterActive} onChange={(e) => setFilterActive(e.target.value as any)} className="border rounded px-2 py-2">
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 gap-2">
          <div className="flex items-center gap-2">
            <label className="text-sm">Sort:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="border rounded px-2 py-1">
              <option value="newest">Newest</option>
              <option value="priceAsc">Price: Low → High</option>
              <option value="priceDesc">Price: High → Low</option>
              <option value="nameAsc">Name A → Z</option>
              <option value="nameDesc">Name Z → A</option>
            </select>

            <label className="text-sm">Show:</label>
            <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }} className="border rounded px-2 py-1">
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>

            <div className="text-sm text-gray-600">{total} results</div>
          </div>

          <div className="flex items-center gap-2">
            <button className="bg-red-500 text-white px-3 py-1 rounded disabled:opacity-50" onClick={bulkDelete} disabled={!anySelected}>
              Bulk Delete
            </button>
            <button className="bg-yellow-500 text-white px-3 py-1 rounded disabled:opacity-50" onClick={bulkToggleActive} disabled={!anySelected}>
              Toggle Active
            </button>
            <button className="bg-indigo-600 text-white px-3 py-1 rounded disabled:opacity-50" onClick={bulkToggleDeal} disabled={!anySelected}>
              Toggle Deal
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-3">
                <input type="checkbox" aria-label="select all" checked={paged.every((p) => selected[p._id]) && paged.length > 0} onChange={(e) => selectAllOnPage(e.target.checked)} />
              </th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Brand</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Deal</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              // table-row skeletons
              Array.from({ length: pageSize }).map((_, i) => (
                <tr key={`skeleton-${i}`} className="animate-pulse">
                  <td className="px-4 py-3">
                    <div className="w-4 h-4 bg-gray-200 rounded" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 bg-gray-200 rounded w-40" />
                  </td>
                  <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-20" /></td>
                  <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-24" /></td>
                  <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-24" /></td>
                  <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-10" /></td>
                  <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-6" /></td>
                  <td className="px-4 py-3"><div className="h-4 bg-gray-200 rounded w-6" /></td>
                  <td className="px-4 py-3"><div className="h-8 bg-gray-200 rounded w-24" /></td>
                </tr>
              ))
            )}

            {!loading && paged.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-6 text-center text-gray-600">No products found.</td>
              </tr>
            )}

            {!loading && paged.map((p) => (
              <tr key={p._id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 align-top">
                  <input type="checkbox" checked={!!selected[p._id]} onChange={() => toggleSelect(p._id)} />
                </td>
                <td className="px-4 py-3 align-top">
                  <div className="flex items-center gap-3">
                    <img src={p.images?.[0] || '/placeholder.png'} alt={p.name} className="w-14 h-14 object-cover rounded" />
                    <div>
                      <div className="font-semibold">{p.name}</div>
                      <div className="text-xs text-gray-500">{p.slug}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 align-top">
                  {p.salePrice ? (
                    <div>
                      <div className="line-through text-sm text-gray-400">${p.price}</div>
                      <div className="text-green-600 font-semibold">${p.salePrice}</div>
                    </div>
                  ) : (
                    <div className="font-semibold">${p.price}</div>
                  )}
                </td>
                <td className="px-4 py-3 align-top">{p.brand}</td>
                <td className="px-4 py-3 align-top">{p.category}</td>
                <td className="px-4 py-3 align-top">{p.stock > 0 ? p.stock : <span className="text-red-600">Out</span>}</td>
                <td className="px-4 py-3 align-top">{p.isTodayDeal ? '✅' : '—'}</td>
                <td className="px-4 py-3 align-top">
                  <button className="px-2 py-1 rounded border" onClick={() => handleToggleActive(p)} disabled={!!savingIds[p._id]}>
                    {p.isActive ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="px-4 py-3 align-top">
                  <div className="flex gap-2">
                    <button className="px-2 py-1 bg-blue-500 text-white rounded" onClick={() => router.push(`/products/${p.slug}`)}>View</button>
                    <button className="px-2 py-1 bg-green-500 text-white rounded" onClick={() => router.push(`/admin/cms/edit-product/${p.slug}`)} disabled={p.stock === 0}>Edit</button>
                    <button className="px-2 py-1 bg-red-500 text-white rounded" onClick={() => handleDelete(p)} disabled={!!deletingIds[p._id]}>{deletingIds[p._id] ? 'Deleting...' : 'Delete'}</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-600">Showing {(page - 1) * pageSize + 1} – {Math.min(page * pageSize, total)} of {total}</div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 border rounded" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
          <div className="flex gap-1">{Array.from({ length: pages }).map((_, i) => (
            <button key={i} className={`px-3 py-1 rounded ${page === i + 1 ? 'bg-gray-800 text-white' : 'border'}`} onClick={() => setPage(i + 1)}>{i + 1}</button>
          ))}</div>
          <button className="px-3 py-1 border rounded" onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page === pages}>Next</button>
        </div>
      </div>

      {error && <div className="mt-4 text-red-600">{error}</div>}
    </div>
  );
}
