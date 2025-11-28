"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { FiMenu, FiX, FiShoppingCart } from "react-icons/fi";
import { FaHeart, FaUser, FaAngleDown } from "react-icons/fa";
import DesktopSearch from "./DesktopSearch";
import { useCart } from "@/context/CartContext";
import CartDrawer from "./CartDrawer";
import { useRouter } from "next/navigation";

const brandLinks = [
  { img: "/brand-logo/akitas-logo.webp", slug: "akitas" },
  { img: "/brand-logo/bissell-logo.webp", slug: "bissell" },
  { img: "/brand-logo/black-decker.png", slug: "black-decker" },
  { img: "/brand-logo/Bosch-logo.webp", slug: "bosch" },
  { img: "/brand-image/brand-dreame.png", slug: "dreame" },
  { img: "/brand-image/Dyson.webp", slug: "dyson" },
  { img: "/brand-image/brand-ecovacs.png", slug: "ecovacs" },
  { img: "/brand-image/brand-enzyme-wizard.png", slug: "enzyme wizard" },
  { img: "/brand-image/brand-hoover.png", slug: "hoover" },
  { img: "/brand-image/i-Vac.webp", slug: "i-Vac" },
  { img: "/brand-image/brand-kobold.png", slug: "kobold" },
  { img: "/brand-image/brand-nilfisk.png", slug: "nilfisk" },
  { img: "/brand-image/brand-numatic.png", slug: "numatic" },
  { img: "/brand-image/Midea_Logo.png", slug: "midea" },
  { img: "/brand-image/brand-miele.png", slug: "miele" },
  { img: "/brand-image/panasonic.webp", slug: "panasonic" },
  { img: "/brand-image/brand-pullman.png", slug: "pullman" },
  { img: "/brand-image/brand-roborock.png", slug: "roborock" },
  { img: "/brand-image/brand-sauber.png", slug: "sauber" },
  { img: "/brand-image/sebo.webp", slug: "sebo" },
  { img: "/brand-image/brand-shark.png", slug: "shark" },
  { img: "/brand-image/brand-tineco.png", slug: "tineco" },
  { img: "/brand-image/brand-vax.png", slug: "vax" },
  { img: "/brand-image/brand-wertheim.png", slug: "wertheim" },
];

const productLinks = [
  { name: "Corded Vacuums", img: "/category-image/Corded Vacuums.webp", slug: "corded vacuums" },
  { name: "Cordless Vacuums", img: "/category-image/Cordless-Vacuums.webp", slug: "cordless vacuums" },
  { name: "Robots", img: "/category-image/Robots.webp", slug: "robots" },
  { name: "Carpet Washers", img: "/category-image/Carpet Washers.webp", slug: "carpet washers" },
  { name: "Hard Floor Cleaners", img: "/category-image/Hard Floor Cleaners.webp", slug: "hard floor cleaners" },
  { name: "Steamers", img: "/category-image/steamer.png", slug: "steamers" },
  { name: "Commercial", img: "/category-image/commercial.webp", slug: "commercial" },
  { name: "Cleaning Chemicals", img: "/category-image/Cleaning-Chemicals.webp", slug: "cleaning chemicals" },
  { name: "Accessories & Parts", img: "/category-image/Accessories.webp", slug: "accessories and parts" },
  { name: "Vacuum Bags & Filters", img: "/category-image/Vacuum-Bags.webp", slug: "vacuum bags and filters" },
];

const storeLinks = ["Cheltenham", "Geelong", "Sunbury"];

function toSlug(str: string) {
  return encodeURIComponent(str.toLowerCase().replace(/\s+/g, "-"));
}

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<"brands" | "products" | "stores" | null>(null);
  const [user, setUser] = useState<any>(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { cart } = useCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const getStoredUser = () => {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("user");
        return stored ? JSON.parse(stored) : null;
      }
      return null;
    };

    const updateUser = () => setUser(getStoredUser());
    updateUser();
    window.addEventListener("storage", updateUser);
    window.addEventListener("userUpdated", updateUser);

    return () => {
      window.removeEventListener("storage", updateUser);
      window.removeEventListener("userUpdated", updateUser);
    };
  }, []);

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      localStorage.removeItem("user");
      setUser(null);
      router.push("/auth");
      window.dispatchEvent(new Event("userUpdated"));
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="w-full font-sans text-[15px]">
      <nav className="bg-red-600 text-white">
        {/* ===== Desktop Navbar ===== */}
        <div className="max-w-7xl mx-auto hidden md:flex justify-between items-center px-4">
          <ul className="flex gap-6 items-center text-[17px] relative">
            <li className="hover:text-white px-3 py-4 hover:bg-black">
              <Link href="/">Home</Link>
            </li>

            {/* Brands Dropdown */}
            <li
              onMouseEnter={() => setOpenDropdown("brands")}
              onMouseLeave={() => setOpenDropdown(null)}
              className="relative cursor-pointer hover:text-white px-3 py-4 hover:bg-black"
            >
              <div className="flex items-center gap-1">
                Brands <FaAngleDown className="text-xs" />
              </div>
              {openDropdown === "brands" && (
                <div className="absolute left-0 top-14 bg-white text-black shadow-lg z-10 w-[420px] rounded-b-lg px-4 py-4 flex flex-wrap gap-3">
                  {brandLinks.map((brand, i) => (
                    <Link key={i} href={`/product-brand/${toSlug(brand.slug)}`}>
                      <img
                        src={brand.img}
                        alt={brand.slug}
                        className="w-28 h-12 object-contain hover:scale-105 transition"
                      />
                    </Link>
                  ))}
                </div>
              )}
            </li>

            {/* Products Dropdown */}
            <li
              onMouseEnter={() => setOpenDropdown("products")}
              onMouseLeave={() => setOpenDropdown(null)}
              className="relative cursor-pointer hover:text-white px-3 py-4 hover:bg-black"
            >
              <div className="flex items-center gap-1">
                Products <FaAngleDown className="text-xs" />
              </div>
              {openDropdown === "products" && (
                <div className="absolute left-0 top-14 bg-white text-black shadow-lg z-10 w-[300px] rounded-b-lg px-4 py-4 flex flex-col gap-2">
                  {productLinks.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/product-category/${toSlug(p.slug)}`}
                      className="flex items-center gap-2 hover:text-red-600"
                    >
                      <img src={p.img} alt={p.name} className="w-10 h-6 object-contain" />
                      <span>{p.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </li>

            <li className="hover:text-white px-3 py-4 hover:bg-black">
              <Link href="/product-category/today-deals">Black Friday Sale</Link>
            </li>
            <li className="hover:text-white px-3 py-4 hover:bg-black">
              <Link href="/repair-and-services">Repair & Services</Link>
            </li>

            {/* Stores */}
            <li
              onMouseEnter={() => setOpenDropdown("stores")}
              onMouseLeave={() => setOpenDropdown(null)}
              className="relative cursor-pointer hover:text-white px-3 py-4 hover:bg-black"
            >
              <div className="flex items-center gap-1">
                Stores <FaAngleDown className="text-xs" />
              </div>
              {openDropdown === "stores" && (
                <div className="absolute top-full left-0 bg-white text-black shadow-xl z-10 py-2 px-4 w-48 space-y-2">
                  {storeLinks.map((city) => (
                    <Link
                      key={city}
                      href={`/our-stores/${toSlug(city)}-store`}
                      className="block hover:text-red-600 transition"
                    >
                      {city}
                    </Link>
                  ))}
                </div>
              )}
            </li>

            <li className="hover:text-white px-3 py-4 hover:bg-black">
              <Link href="/contact-us">Contact Us</Link>
            </li>
          </ul>
          <DesktopSearch />
        </div>

        {/* ===== Mobile Navbar ===== */}
        <div className="md:hidden">
          {/* Top Red Bar */}
          <div className="flex items-center justify-between bg-red-600 px-4 py-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-2xl text-white"
            >
              {mobileMenuOpen ? <FiX /> : <FiMenu />}
            </button>

            {/* Right icons */}
            <div className="flex items-center gap-5 text-2xl">
              <Link href="/wishlist" className="hover:text-gray-200">
                <FaHeart />
              </Link>

              {/* Profile */}
              <div ref={profileRef} className="relative">
                <button onClick={() => setProfileDropdownOpen(!profileDropdownOpen)} className="hover:text-gray-200">
                  <FaUser />
                </button>
                {profileDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 bg-white text-black rounded shadow-md w-48 text-sm z-20">
                    {user ? (
                      <>
                        <p className="px-4 py-2 border-b text-gray-700">
                          Hello, <b>{user.name}</b>
                        </p>
                        <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
                        <Link href="/orders" className="block px-4 py-2 hover:bg-gray-100">Orders</Link>
                        <button onClick={logout} className="w-full text-left px-4 py-2 hover:bg-gray-100">Logout</button>
                      </>
                    ) : (
                      <Link href="/auth" className="block px-4 py-2 hover:bg-gray-100">
                        Login / Signup
                      </Link>
                    )}
                  </div>
                )}
              </div>

              {/* Cart */}
              <button className="relative hover:text-gray-200" onClick={() => setIsCartOpen(true)}>
                <FiShoppingCart />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-white text-red-600 text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>

{/* Mobile Dropdown Menu */}
{mobileMenuOpen && (
  <div className="bg-white text-black px-5 py-4 space-y-3 text-[15px] shadow-md">
    <Link
      href="/"
      onClick={() => setMobileMenuOpen(false)}
      className="block hover:text-red-600"
    >
      Home
    </Link>

    

    {/* Brands */}
    <div>
      <p className="font-semibold mb-2">Brands</p>
      <div className="flex flex-wrap gap-2">
        {brandLinks.map((brand, i) => (
          <Link
            key={i}
            href={`/product-brand/${toSlug(brand.slug)}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <img
              src={brand.img}
              alt={brand.slug}
              className="w-20 h-12 object-contain border rounded p-1"
            />
          </Link>
        ))}
      </div>
    </div>

    {/* Products */}
    <div>
      <p className="font-semibold mb-2">Products</p>
      <div className="flex flex-col gap-2">
        {productLinks.map((p) => (
          <Link
            key={p.slug}
            href={`/product-category/${toSlug(p.slug)}`}
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3"
          >
            <img src={p.img} alt={p.name} className="w-10 h-6 object-contain" />
            <span>{p.name}</span>
          </Link>
        ))}
      </div>
    </div>

    <Link
      href="/product-category/today-deals"
      onClick={() => setMobileMenuOpen(false)}
      className="block hover:text-red-600"
    >
      Black Friday Sale
    </Link>

    <Link
      href="/repair-and-services"
      onClick={() => setMobileMenuOpen(false)}
      className="block hover:text-red-600"
    >
      Repair & Services
    </Link>

    <Link
      href="/contact-us"
      onClick={() => setMobileMenuOpen(false)}
      className="block hover:text-red-600"
    >
      Contact Us
    </Link>
  </div>
)}

        </div>
      </nav>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
}
