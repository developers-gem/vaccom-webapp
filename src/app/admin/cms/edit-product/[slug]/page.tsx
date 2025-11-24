"use client";
import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";

interface Product {
  _id: string;
  slug: string;
  name: string;
  price: number;
  salePrice?: number;
  shortDesc?: string;
  longDesc?: string;
  brand: string;
  category?: string;
  images: string[];
  isTodayDeal?: boolean;
  stock: number;
  isOutOfStock: boolean;
}

export default function EditProductPage() {
  const { slug } = useParams();
  const router = useRouter();

  const brands = ["Akitas","Bissell","Black Decker","Bosch","Dreame","Dyson","Ecovacs","Enzyme Wizard","Hoover","i-Vac","Kobold","Nilfisk","Numatic","Midea","Miele","Panasonic","Pullman","Roborock","Sauber","Sebo","Shark","Tineco","Vax","Wertheim"];
  const categories = ["Corded Vacuums","Cordless Vacuums","Robots","Carpet Washers","Hard Floor Cleaners","Steamers","Commercial","Cleaning Chemicals","Accessories & Parts","Vacuum Bags & Filters"];

  const [product, setProduct] = useState<Product>({
    _id: "",
    slug: "",
    name: "",
    price: 0,
    salePrice: undefined,
    shortDesc: "",
    longDesc: "",
    brand: "",
    category: "",
    images: [],
    isTodayDeal: false,
    stock: 0,
    isOutOfStock: false,
  });

  const [loading, setLoading] = useState(true);
  const [newImages, setNewImages] = useState<File[]>([]);

  // Fetch product
  useEffect(() => {
    if (!slug) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${slug}`);
        const data = await res.json();
        setProduct(prev => ({ ...prev, ...data }));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  // Handle input
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target;
    const { name, type, checked, files, value } = target as HTMLInputElement;

    if (type === "checkbox") {
      setProduct(prev => ({ ...prev, isTodayDeal: checked }));
    } else if (type === "file" && files) {
      setNewImages(prev => [...prev, ...Array.from(files)]);
    } else if (name === "stock") {
      const stockValue = Number(value);
      setProduct(prev => ({ ...prev, stock: stockValue, isOutOfStock: stockValue <= 0 }));
    } else if (name === "salePrice") {
      setProduct(prev => ({ ...prev, salePrice: value ? Number(value) : undefined }));
    } else if (name === "price") {
      setProduct(prev => ({ ...prev, price: Number(value) }));
    } else {
      setProduct(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleRemoveExistingImage = (imgUrl: string) => {
    setProduct(prev => ({ ...prev, images: prev.images.filter(i => i !== imgUrl) }));
  };

  const handleRemoveNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleUploadLocalImages = async () => {
    if (!slug || newImages.length === 0) return;

    const formData = new FormData();
    newImages.forEach(file => formData.append("images", file));

    try {
      const res = await fetch(`/api/admin/products/${slug}/upload-image`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setProduct(prev => ({ ...prev, images: [...prev.images, ...data.urls] }));
        setNewImages([]);
      } else {
        const data = await res.json();
        alert("Upload failed: " + data.error);
      }
    } catch (err) {
      alert("Upload error");
      console.error(err);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/admin/products/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });

      if (res.ok) {
        alert("Product updated successfully");
        router.push("/admin/cms/product-list");
      } else {
        const data = await res.json();
        alert("Failed: " + data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!slug || !confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`/api/admin/products/${slug}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Product deleted successfully");
        router.push("/admin/cms/product-list");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input name="name" value={product.name} onChange={handleChange} placeholder="Name" className="w-full border px-3 py-2"/>

        <input name="price" type="number" value={product.price} onChange={handleChange} placeholder="Price" className="w-full border px-3 py-2"/>

        <input name="salePrice" type="number" value={product.salePrice ?? ""} onChange={handleChange} placeholder="Sale Price" className="w-full border px-3 py-2"/>

        <input name="stock" type="number" value={product.stock} onChange={handleChange} placeholder="Number of Stocks" className="w-full border px-3 py-2"/>

        <input name="shortDesc" value={product.shortDesc ?? ""} onChange={handleChange} placeholder="Short Description" className="w-full border px-3 py-2"/>

        <textarea name="longDesc" value={product.longDesc ?? ""} onChange={handleChange} placeholder="Long Description" className="w-full border px-3 py-2"/>

        <select name="brand" value={product.brand} onChange={handleChange} className="w-full border px-3 py-2">
          <option value="">Select Brand</option>
          {brands.map(b => <option key={b} value={b}>{b}</option>)}
        </select>

        <select name="category" value={product.category ?? ""} onChange={handleChange} className="w-full border px-3 py-2">
          <option value="">Select Category</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <label className="flex items-center gap-2">
          <input type="checkbox" name="isTodayDeal" checked={product.isTodayDeal} onChange={handleChange} />
          <span>Show on Today's Deal page</span>
        </label>

        {/* Existing Images */}
        {product.images.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-2">
            {product.images.map((img, i) => (
              <div key={i} className="relative w-24 h-24">
                <img src={img} alt="Product" className="w-full h-full object-cover rounded border"/>
                <button
                  type="button"
                  onClick={() => handleRemoveExistingImage(img)}
                  className="absolute top-0 right-0 bg-red-500 text-white px-1 rounded"
                >
                  x
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Upload New Images */}
        <input type="file" multiple onChange={handleChange} className="border px-3 py-2"/>

        {newImages.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-2">
            {newImages.map((file, i) => (
              <div key={i} className="relative w-24 h-24">
                <img src={URL.createObjectURL(file)} alt="New" className="w-full h-full object-cover rounded border"/>
                <button
                  type="button"
                  onClick={() => handleRemoveNewImage(i)}
                  className="absolute top-0 right-0 bg-red-500 text-white px-1 rounded"
                >
                  x
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={handleUploadLocalImages}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Upload Selected Images
        </button>

        {/* ACTION BUTTONS */}
        <div className="flex gap-4 mt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Update Product
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Delete Product
          </button>
        </div>

      </form>
    </div>
  );
}
