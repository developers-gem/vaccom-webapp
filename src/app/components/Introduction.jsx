"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Introduction() {
  return (
    <section
      className="w-full min-h-[500px] sm:min-h-[600px] md:h-[700px] bg-cover bg-center flex items-center justify-start text-left px-4 sm:px-6 md:px-10 py-10 md:py-0"
      style={{
        backgroundImage: `url('/banner-img/vac 2.webp')`,
      }}
    >
      <div className="max-w-[1240px] mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12">
        {/* Left Section */}
        <div className="w-full md:w-[50%] bg-white/80 md:bg-transparent backdrop-blur-sm md:backdrop-blur-0 p-4 sm:p-6 md:p-0 rounded-lg md:rounded-none">
          <h2 className="text-3xl sm:text-4xl md:text-5xl text-[#DC1515] font-bold leading-snug sm:leading-tight mb-4 sm:mb-5">
            Find the Perfect Vaccom for you at Vaccom!
          </h2>

          <p className="text-sm sm:text-base md:text-[17px] text-[#0A0A0A] mb-4 sm:mb-5 leading-relaxed">
            At Vaccom, we know every home is different. That’s why we offer a
            wide range of top-brand Vaccom cleaners — from powerful upright
            models and versatile stick Vaccoms to handy handheld options.
          </p>

          <p className="text-sm sm:text-base md:text-[17px] text-[#0A0A0A] mb-4 sm:mb-5 leading-relaxed">
            Whether it’s pet hair, busy family spaces, or hassle-free cleaning
            you need, we have the perfect Vaccom for you.
          </p>

          <p className="text-sm sm:text-base md:text-[17px] text-[#0A0A0A] mb-4 sm:mb-5 leading-relaxed">
            Our friendly team is here to offer expert advice and help you find
            the right fit for your lifestyle and budget. Visit one of our
            Melbourne stores for sales, servicing, and repairs. Experience the
            Vaccom difference today!
          </p>

          <Link
            href="/products"
            className="inline-block bg-[#DC1515] hover:bg-[#b80000] text-white text-sm sm:text-base font-medium px-5 sm:px-7 py-2.5 sm:py-3 rounded-md transition-all mt-2"
          >
            Explore Our Range
          </Link>
        </div>

        {/* Right Section (for image or future content) */}
        <div className="hidden md:block w-full md:w-[50%] text-left"></div>
      </div>
    </section>
  );
}
