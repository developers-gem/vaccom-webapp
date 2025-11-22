"use client";
import { useState, ChangeEvent, FormEvent } from "react";

interface ProductForm {
  name: string;
  price: string;         
  salePrice?: string;    
  shortDesc?: string;    
  longDesc?: string;     
  brand: string;
  category?: string;     
  images: File[];
  isTodayDeal?: boolean; 
  stock: string;         
}

export default function AddProductPage() {
  const brands = [
    "Akitas","Bissell","Black Decker","Bosch","Dreame","Dyson",
    "Ecovacs","Enzyme Wizard","Hoover","i-Vac","Kobold","Nilfisk",
    "Numatic","Midea","Miele","Panasonic","Pullman","Roborock",
    "Sauber","Sebo","Shark","Tineco","Vax","Wertheim"
  ];

  const categories = [
    "Corded Vacuums","Cordless Vacuums","Robots","Carpet Washers",
    "Hard Floor Cleaners","Steamers","Commercial","Cleaning Chemicals",
    "Accessories & Parts","Vacuum Bags & Filters"
  ];

  const [product, setProduct] = useState<ProductForm>({
    name: "",
    price: "",
    salePrice: "",
    shortDesc: "",
    longDesc: "",
    brand: "",
    category: "",
    images: [],
    isTodayDeal: false,
    stock: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = e.target;

    if (target instanceof HTMLInputElement) {
      const { name, type, checked, files, value } = target;

      if (type === "checkbox") {
        setProduct(prev => ({ ...prev, isTodayDeal: checked }));
      } else if (type === "file" && files) {
        setProduct(prev => ({ ...prev, images: [...prev.images, ...Array.from(files)] }));
      } else {
        setProduct(prev => ({ ...prev, [name]: value }));
      }
    } else {
      // textarea or select
      const { name, value } = target as HTMLTextAreaElement | HTMLSelectElement;
      setProduct(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("price", String(Number(product.price)));

      if (product.salePrice?.trim()) formData.append("salePrice", String(Number(product.salePrice)));
      if (product.shortDesc?.trim()) formData.append("shortDesc", product.shortDesc);
      if (product.longDesc?.trim()) formData.append("longDesc", product.longDesc);
      formData.append("brand", product.brand);
      if (product.category?.trim()) formData.append("category", product.category);
      formData.append("isTodayDeal", product.isTodayDeal ? "true" : "false");
      formData.append("stock", String(Number(product.stock)));

      product.images.forEach((img) => formData.append("images", img));

      const res = await fetch("/api/admin/products", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        alert("Product added successfully!");
        setProduct({
          name: "",
          price: "",
          salePrice: "",
          shortDesc: "",
          longDesc: "",
          brand: "",
          category: "",
          images: [],
          isTodayDeal: false,
          stock: "",
        });
      } else {
        const data = await res.json();
        alert("Failed: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Add Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={product.name}
          onChange={handleChange}
          placeholder="Product Name"
          required
          className="w-full border p-2 rounded"
        />

        <input
          name="price"
          type="number"
          value={product.price}
          onChange={handleChange}
          placeholder="Retail Price"
          required
          className="w-full border p-2 rounded"
        />

        <input
          name="salePrice"
          type="number"
          value={product.salePrice || ""}
          onChange={handleChange}
          placeholder="Sale Price (optional)"
          className="w-full border p-2 rounded"
        />

        <input
          name="stock"
          type="number"
          value={product.stock}
          onChange={handleChange}
          placeholder="Number of Stocks"
          required
          className="w-full border p-2 rounded"
        />

        <input
          name="shortDesc"
          value={product.shortDesc || ""}
          onChange={handleChange}
          placeholder="Short Description (optional)"
          className="w-full border p-2 rounded"
        />

        <textarea
          name="longDesc"
          value={product.longDesc || ""}
          onChange={handleChange}
          placeholder="Long Description (optional)"
          className="w-full border p-2 rounded"
        />

        <select
          name="brand"
          value={product.brand}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        >
          <option value="">Select Brand</option>
          {brands.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>

        <select
          name="category"
          value={product.category || ""}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="">Select Category</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isTodayDeal"
            checked={product.isTodayDeal}
            onChange={handleChange}
          />
          <span>Show on Today's Deal page</span>
        </label>

        <input
          name="images"
          type="file"
          multiple
          onChange={handleChange}
          className="w-full"
        />

        {product.images.length > 0 && (
          <div className="flex gap-2 mt-2 flex-wrap">
            {product.images.map((img, i) => (
              <img
                key={i}
                src={URL.createObjectURL(img)}
                alt={`Preview ${i}`}
                className="w-20 h-20 object-cover rounded border"
              />
            ))}
          </div>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Product
        </button>
      </form>
    </div>
  );
}
