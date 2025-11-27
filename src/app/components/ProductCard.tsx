"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useCart, Product as CartProduct } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { FiHeart } from "react-icons/fi";

interface Product {
  _id: string;
  name: string;
  price: number;
  salePrice?: number | null;
  images: string[];
  slug: string;
  brand?: string;
  badge?: "sale" | "new";
}

interface Props {
  product: Product;
  view?: "grid" | "list";
}

export default function ProductCard({ product, view = "grid" }: Props) {
  const { cart, addToCart, increaseQuantity, decreaseQuantity } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  // 👇 NEW: toast type (cart / wishlist)
  const [toastType, setToastType] = useState<"cart" | "wishlist">("cart");

  const [currentImage, setCurrentImage] = useState(
    product.images?.[0] || "/placeholder.png"
  );

  const normalizedSalePrice =
    product.salePrice !== undefined && product.salePrice !== null
      ? Number(product.salePrice)
      : 0;

  const hasSale = normalizedSalePrice > 0 && normalizedSalePrice < product.price;

  const productForCart: CartProduct = {
    id: product._id,
    name: product.name,
    price: hasSale ? normalizedSalePrice : product.price,
    imageUrl: product.images?.[0] || "/placeholder.png",
    slug: product.slug,
    brand: product.brand || "Unknown",
  };

  const cartItem = cart.find((item) => item.id === productForCart.id);
  const inWishlist = isInWishlist(productForCart.id);

  // ⭐ Wishlist Handler
  const handleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(productForCart.id);
      setToastType("wishlist");
      showAlert("Removed from wishlist");
    } else {
      addToWishlist(productForCart);
      setToastType("wishlist");
      showAlert("Added to wishlist");
    }
  };

  // Toast
  const showAlert = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1500);
  };

  return (
    <>
      {/* Toast */}
   {showToast && (
  <div
    className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[9999] 
               transition-all duration-500"
    style={{
      opacity: showToast ? 1 : 0,
      transform: showToast ? "translate(-50%, 0)" : "translate(-50%, 20px)",
    }}
  >
    <div className="bg-red-600 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-4 w-[320px] relative">

      {/* Close Button */}
      <button
        onClick={() => setShowToast(false)}
        className="absolute top-1 right-2 text-white text-xl font-bold"
      >
        ×
      </button>

      {/* Icon */}
      {toastType === "wishlist" ? (
        <FiHeart className="text-white w-7 h-7" />
      ) : (
        <span className="text-2xl">🛒</span>
      )}

      {/* Text */}
      <span className="font-medium text-sm flex-1">
        {toastMessage}
      </span>

      {/* CTA Button */}
      <a
        href={toastType === "wishlist" ? "/wishlist" : "/cart"}
        className="bg-white text-red-600 px-3 py-1.5 rounded-md text-xs font-semibold"
      >
        {toastType === "wishlist" ? "See Wishlist" : "View Cart"}
      </a>
    </div>
  </div>
)}



      <div
        className={`relative bg-white border rounded-2xl shadow-sm hover:shadow-xl transition transform hover:-translate-y-1 p-4
        ${view === "list" ? "flex gap-6 items-center" : ""}`}
      >
        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className="absolute top-5 right-3 p-2 rounded-full bg-white z-50 shadow hover:scale-110 transition"
        >
          <FiHeart
            className={`w-6 h-6 ${
              inWishlist ? "fill-red-500 text-red-500" : "text-gray-500"
            }`}
          />
        </button>

        {/* Sale / New badge */}
        <div className="absolute -top-2 -left-2 z-10 flex flex-col gap-2">
          {hasSale && (
            <span className="text-xs font-bold px-6 py-3 rounded-full shadow-md bg-red-600 text-white">
              ON SALE
            </span>
          )}
          {product.badge === "new" && (
            <span className="text-xs font-bold px-6 py-3 rounded-full shadow-md bg-green-500 text-white">
              NEW
            </span>
          )}
        </div>

        {/* Image */}
        <Link href={`/products/${product.slug}`} className="flex-shrink-0 relative">
          <img
            src={currentImage}
            alt={product.name}
            className={`rounded-xl object-cover transition-all duration-500 ${
              view === "list"
                ? "w-40 h-40"
                : "w-full h-52 md:h-56 mx-auto mb-3"
            }`}
            onMouseEnter={() => product.images?.[1] && setCurrentImage(product.images[1])}
            onMouseLeave={() => setCurrentImage(product.images?.[0] || "/placeholder.png")}
          />
        </Link>

        {/* Info */}
        <div className={view === "list" ? "flex-1" : ""}>
          <Link href={`/products/${product.slug}`}>
            <h2
              className={`font-semibold hover:text-red-600 ${
                view === "list"
                  ? "text-lg md:text-xl mb-2"
                  : "text-base md:text-lg line-clamp-2"
              }`}
            >
              {product.name}
            </h2>
          </Link>

          {/* Pricing */}
          <div className="mt-2">
            {hasSale ? (
              <>
                <span className="text-gray-400 line-through mr-2 text-sm">
                  ${product.price}
                </span>
                <span className="text-red-600 font-bold text-lg">
                  ${normalizedSalePrice}
                </span>
              </>
            ) : (
              <span className="text-red-600 font-bold text-lg">
                ${product.price}
              </span>
            )}
          </div>

          {/* Cart & View Product */}
          <div className="flex flex-wrap gap-3 mt-4">
            {cartItem ? (
              <div className="flex items-center gap-2 border rounded-full px-6 py-1 bg-gray-50">
                <button
                  onClick={() => decreaseQuantity(cartItem.id, 1)}
                  className="bg-gray-200 px-2 py-1 rounded-full hover:bg-gray-300"
                >
                  -
                </button>
                <span className="font-medium">{cartItem.quantity}</span>
                <button
                  onClick={() => increaseQuantity(cartItem.id, 1)}
                  className="bg-gray-200 px-2 py-1 rounded-full hover:bg-gray-300"
                >
                  +
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  addToCart(productForCart, 1);
                  setToastType("cart");
                  showAlert("Item added to cart");
                }}
                className={`flex justify-center gap-2 bg-gradient-to-r from-red-500 to-red-500 text-white px-3 py-2 rounded-full hover:opacity-90 transition
                ${view === "list" ? "mt-2" : ""}`}
              >
                Add To Cart
              </button>
            )}

            <Link
              href={`/products/${product.slug}`}
              className="flex justify-center items-center gap-2 border border-gray-300 text-gray-700 px-3 py-2 rounded-full hover:bg-gray-100 transition"
            >
              View Product
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
