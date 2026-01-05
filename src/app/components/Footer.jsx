"use client";
import React, { useState } from "react";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaPinterest, FaYoutube, FaEnvelope,  } from "react-icons/fa";
import {  FiPhone } from 'react-icons/fi';


export default function Footer() {
  const [email, setEmail] = useState("");
const [loading, setLoading] = useState(false);
const [success, setSuccess] = useState(false);

const handleNewsletterSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setSuccess(false);

  try {
    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (data.success) {
      setSuccess(true);
      setEmail("");
    }
  } catch (error) {
    alert("Failed to subscribe. Please try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <footer className="bg-black text-white pt-16 pb-8 text-sm">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Company Info */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p className="text-gray-300 leading-relaxed text-[16px]">
            For 15 years, we’ve led the way in providing top-tier vacuum and steam cleaners. Our focus is on reliable performance, modern designs, and exceptional customer service.
          </p>
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-1">Santhanam Engineering Pty. Ltd.</h3>
            <p className="text-gray-400 text-[15px]">ABN: 15154670532</p>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-1">Head Office</h3>
            <p className="text-gray-400 text-[15px]">158 Centre Dandenong Rd. Victoria 3192 </p>
          </div>
          <div className="flex mt-5 items-center gap-2 text-[15px] text-gray-400">
  <FaEnvelope className="text-lg" />
  support@vaccom.com.au
</div>
<div className="flex mt-5 items-center gap-2 text-[15px] text-gray-400">
  <FiPhone className="text-lg" />
  0397 409 390
</div>
           <div className="flex space-x-4 text-xl mt-4">
            <Link href="https://www.facebook.com/profile.php?id=61583798215993" target="blank" className="hover:text-red-500 transition">
              <FaFacebookF />
            </Link>
            <Link href="https://www.instagram.com/vaccom.com.au/" target="blank" className="hover:text-red-500 transition">
              <FaInstagram />
            </Link>
             <Link href="https://au.pinterest.com/vaccomr/" target="blank" className="hover:text-red-500 transition">
              <FaPinterest />
            </Link>
            
          </div>
        </div>

        {/* Locations */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Our Locations</h2>
          <div className="space-y-3 text-[15px] text-gray-300">
            <div>
              <h4 className="font-medium text-white">Cheltenham</h4>
              <p>Shop 1020 Westfield Shopping Centre, 1156 Nepean Hwy, VIC 3192</p>
            </div>
            <div>
              <h4 className="font-medium text-white">Sunbury</h4>
              <p>93 Evans St, Sunbury VIC 3429</p>
            </div>
            <div>
              <h4 className="font-medium text-white">Geelong</h4>
              <p>162 Malop St, Geelong VIC 3220</p>
            </div>
          </div>

          <div className="mt-5">
            <h4 className="text-white font-medium mb-1">Open Hours</h4>
            <p className="text-gray-400 text-[15px] leading-relaxed">
              Mon – Sun: 9:00 AM – 5:30 PM <br />
              (All Locations)
            </p>
          </div>
        </div>

        {/* Useful Links */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Quick Links</h2>
          <ul className="space-y-2 text-gray-300 text-[15px]">
            <li>
              <Link href="/" className="hover:text-red-500 transition">Home</Link>
            </li>
            <li>
              <Link href="/about-us" className="hover:text-red-500 transition">About Us</Link>
            </li>
            <li>
              <Link href="/repair-and-services" className="hover:text-red-500 transition">Repair and Services</Link>
            </li>
            <li>
              <Link href="/product-category/today-deals" className="hover:text-red-500 transition">Today’s Deals</Link>
            </li>
             
             <li>
              <Link href="/privacy-policy" className="hover:text-red-500 transition">Privacy Policy</Link>
            </li>
             <li>
              <Link href="/refund_returns" className="hover:text-red-500 transition">Refund & Returns</Link>
            </li>
            <li>
              <Link href="/terms-of-service" className="hover:text-red-500 transition">Terms of service</Link>
            </li>
             <li>
              <Link href="/contact-us" className="hover:text-red-500 transition">
Contact Us</Link>
            </li>
          </ul>
        </div>

        {/* Contact & Social */}
       <div>
  <h2 className="text-2xl font-semibold mb-4">
    Sign Up for Our Newsletter
  </h2>

  <p className="text-gray-300 text-[15px] mb-2">
    Leave your email to get all hot deals & news
  </p>
  <p className="text-gray-300 text-[15px] mb-5">
    which benefit you most!
  </p>

  {/* Newsletter Input */}
<form onSubmit={handleNewsletterSubmit} className="relative max-w-md">
  {/* Input */}
  <input
  type="email"
  placeholder="Your email address..."
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  required
  className="
    w-full h-12 rounded-full
    bg-[#FFF8ED]
    border border-red-600
    pl-5 pr-14
    text-sm text-gray-800
    placeholder-gray-500
    outline-none
    focus:ring-2 focus:ring-red-500
  "
/>


  {/* Send Button (Always visible) */}
 <button
  type="submit"
  disabled={loading}
  className="
    absolute top-0 right-0
    h-12 w-12 rounded-full
    bg-red-600
    flex items-center justify-center
    hover:bg-red-700
    transition
    disabled:opacity-60
  "
>
   {loading ? "…" : (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="white"
    className="w-5 h-5"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M22 2L15 22L11 13L2 9L22 2Z" />
  </svg>
)}

    
  </button>
  
</form>

{success && (
  <p className="text-green-500 text-sm mt-3">
    Thanks for subscribing 🎉
  </p>
)}

</div>

      </div>

      {/* Footer Bottom */}
         {/* Footer Bottom */}
<div className="border-t border-white/10 mt-12 pt-6">
  <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-2 text-center">
    <span>© {new Date().getFullYear()} All rights reserved.</span>

    <span className="flex items-center gap-2">
      Developed by
      <a
        href="https://gemwebservices.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 font-semibold text-white hover:text-red-500 transition"
      >
        <img
          src="/gem-logo.webp"
          alt="Gem Web Services"
          className="h-5 w-auto"
        />
      </a>
    </span>
  </div>
</div>

    </footer>
  );
}
