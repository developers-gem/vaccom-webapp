"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";
import { useCart, Product as CartProduct } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { motion, AnimatePresence } from "framer-motion";

interface Product {
  _id: string;
  name: string;
  slug: string;
  shortDesc?: string;
  longDesc?: string;
  price: number;
  salePrice?: number;
  images: string[];
  features?: string[];
  rating?: number;
  sold?: number;
  badge?: "new" | "sale";
}

export default function ProductDetail() {
  const { slug } = useParams<{ slug?: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [inWishlist, setInWishlist] = useState(false);
  const [notify, setNotify] = useState("");
  const [notifyColor, setNotifyColor] = useState("green");
  const [mainImage, setMainImage] = useState<string>("");
  const [showModal, setShowModal] = useState(false);

  // 👇 added new toast states
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const { cart, addToCart, increaseQuantity, decreaseQuantity } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();

  // Fetch product
  useEffect(() => {
    if (!slug) return;
    const fetchProduct = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
        const res = await fetch(`${baseUrl}/api/products/${encodeURIComponent(slug)}`);
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();
        setProduct(data);
        setMainImage(data.images?.[0] || "/placeholder.png");
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  // Sync wishlist
  useEffect(() => {
    if (!product) return;
    const exists = wishlist.some((item) => item.id === product._id);
    setInWishlist(exists);
  }, [wishlist, product]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!product) return <p className="text-center mt-10">Product not found</p>;

  const normalizedSalePrice =
    product.salePrice && product.salePrice < product.price ? product.salePrice : 0;
  const hasSale = normalizedSalePrice > 0 && normalizedSalePrice < product.price;

  const productForCart: CartProduct = {
    id: product._id,
    name: product.name,
    price: hasSale ? normalizedSalePrice : product.price,
    imageUrl: mainImage,
    slug: product.slug,
    brand: "Unknown",
  };

  const cartItem = cart.find((item) => item.id === productForCart.id);

 const toggleWishlist = () => {
  if (!inWishlist) {
    addToWishlist(productForCart);
    setNotify("Added to wishlist!");
    setNotifyColor("green");
  } else {
    removeFromWishlist(product._id);
    setNotify("Removed from wishlist!");
    setNotifyColor("red");
  }

  setInWishlist((prev) => !prev);

  // Auto-hide toast
  setTimeout(() => setNotify(""), 8000);
};


  // 👇 handle add to cart + toast
  const handleAddToCart = () => {
    addToCart(productForCart, quantity);
    setToastMessage(`${product.name} added to cart!`);
    setShowToast(true);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto relative">
      {/* Wishlist small toast */}
      <AnimatePresence>
       {notify && (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
    className={`fixed top-56 left-1/2 text-white px-4 py-3 rounded shadow-lg z-50 
      ${notifyColor === "red" ? "bg-red-600" : "bg-red-600"}`}
  >
    <div className="flex items-center gap-3">
      {/* Text */}
      <span>{notify}</span>

      {/* See Wishlist button */}
      <a
        href="/wishlist"
        className="bg-white text-black px-3 py-1 rounded text-sm font-medium hover:bg-gray-200 transition"
      >
        See Wishlist
      </a>
    </div>
  </motion.div>
)}

      </AnimatePresence>

    {/* 👇 Animated Top Toast (fixed below header) */}
<AnimatePresence>
  {showToast && (
    <motion.div
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="fixed top-52 left-1/2 transform -translate-x-1/2 z-50 w-[90vw] sm:w-auto max-w-2xl"
    >
      <div className="relative bg-red-600 text-white px-8 py-4 rounded-lg shadow-lg text-base flex flex-col sm:flex-row items-center gap-4 pointer-events-auto">
        {/* Close (X) icon */}
        <button
          onClick={() => setShowToast(false)}
          className="absolute top-2 right-3 text-white text-xl font-bold hover:text-gray-200 transition"
          aria-label="Close"
        >
          ×
        </button>

        {/* Toast message */}
        <span className="text-center">{toastMessage}</span>

        {/* View Cart button */}
        <a
          href="/cart"
          className="bg-white text-red-600 px-4 py-2 rounded-md font-semibold hover:bg-gray-100 transition"
        >
          View Cart
        </a>
      </div>
    </motion.div>
  )}
</AnimatePresence>



      {/* Breadcrumbs */}
      {/* <nav className="text-sm mb-4 text-gray-600">
        <span className="hover:underline cursor-pointer">Home</span> &gt;{" "}
        <span className="hover:underline cursor-pointer">Category</span>
      </nav> */}

      {/* Product layout */}
      <div className="flex flex-col md:flex-row gap-8 relative mt-20">
        {/* Left: Image */}
        <div className="md:w-1/2 flex flex-col items-center gap-2 relative">
          <div className="absolute -top-2 -left-2 z-10 flex flex-col gap-2">
            {hasSale && (
              <span className="text-xs font-bold px-6 py-3 rounded-full shadow-md bg-red-600 text-white">
                ON SALE
              </span>
            )}
            {product.badge === "new" && !hasSale && (
              <span className="text-xs font-bold px-6 py-3 rounded-full shadow-md bg-green-500 text-white">
                NEW
              </span>
            )}
          </div>

          <img
            src={mainImage}
            alt={product.name}
            className="w-full max-w-md rounded-lg cursor-pointer"
            onClick={() => setShowModal(true)}
          />
          <div className="flex gap-2 mt-2">
            {product.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`${product.name} - ${idx}`}
                className="w-16 h-16 object-cover rounded-lg border cursor-pointer hover:border-blue-500"
                onMouseEnter={() => setMainImage(img)}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="md:w-1/2 flex flex-col gap-3">
          <h1 className="text-3xl font-bold">{product.name}</h1>

          {product.shortDesc && <p className="text-gray-700">{product.shortDesc}</p>}

          {/* Rating */}
          <div className="flex items-center gap-2 text-yellow-500">
            {Array.from({ length: 5 }, (_, i) => (
              <FaStar
                key={i}
                className={i < (product.rating || 0) ? "text-yellow-400" : "text-gray-300"}
              />
            ))}
            <span className="text-gray-600 ml-2">{product.sold || 0} sold</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mt-2">
            {hasSale ? (
              <>
                <span className="text-gray-500 line-through text-lg">${product.price}</span>
                <span className="text-2xl font-bold text-red-600">${normalizedSalePrice}</span>
              </>
            ) : (
              <span className="text-2xl font-bold text-red-600">${product.price}</span>
            )}
          </div>

          {/* Features */}
          {product.features && (
            <ul className="list-disc list-inside text-red-700 mt-2">
              {product.features.map((feature, idx) => (
                <li key={idx}>{feature}</li>
              ))}
            </ul>
          )}

          {/* Add to Cart & Wishlist */}
          <div className="flex gap-2 mt-4">
            {cartItem ? (
              <div className="flex items-center gap-2 border rounded-full px-6 py-1 bg-gray-50">
                <button
                  onClick={() => decreaseQuantity(cartItem.id, 1)}
                  className="bg-gray-200 px-3 py-1 rounded-full hover:bg-gray-300"
                >
                  -
                </button>
                <span className="font-medium">{cartItem.quantity}</span>
                <button
                  onClick={() => increaseQuantity(cartItem.id, 1)}
                  className="bg-gray-200 px-3 py-1 rounded-full hover:bg-gray-300"
                >
                  +
                </button>
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 bg-black text-white px-6 py-2 rounded hover:opacity-90 transition"
              >
                Add To Cart
              </button>
            )}

          <button
  onClick={toggleWishlist}
  className="flex items-center justify-center px-4 py-2 border rounded hover:bg-red-50 transition"
>
  <FiHeart
    className={`w-6 h-6 ${
      inWishlist ? "fill-red-500 text-red-500" : "text-gray-500"
    }`}
  />
</button>

          </div>
        </div>
      </div>

      {/* Long Description */}
      {product.longDesc && (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-3">Product Details</h2>
          <p className="text-gray-700 leading-relaxed">{product.longDesc}</p>
        </div>
      )}

      {/* Modal for images */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white p-4 rounded-lg max-w-3xl max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {product.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${product.name} - ${idx}`}
                  className="mb-2 w-full object-contain rounded"
                />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
