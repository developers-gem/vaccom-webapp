'use client';
import React from 'react';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="bg-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1240px] mx-auto flex flex-col md:flex-row items-center gap-10 lg:gap-16">
        
        {/* Left: Video */}
        <div className="w-full md:w-[55%] rounded-xl overflow-hidden shadow-lg">
          <div className="relative w-full pb-[56.25%]"> {/* 16:9 ratio */}
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src="https://www.youtube.com/embed/frQCsRwgqj0"
              title="Introducing the PURE ONE STATION 5"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        {/* Right: Text */}
        <div className="w-full md:w-[45%] text-left md:text-left">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#DC1515] font-bold leading-snug sm:leading-tight md:leading-[1.2] mb-4 sm:mb-6">
            Redefine Cleanliness <br className="hidden sm:block" />
            with Cutting-Edge <br className="hidden sm:block" />
            Technology! – Tineco
          </h2>

          <p className="text-sm sm:text-base md:text-[17px] text-gray-800 mb-6 leading-relaxed">
            Think your home is clean? Think again! Meet the <span className="font-semibold">PURE ONE STATION 5</span>, 
            the ultimate solution for a spotless home. Lightweight and innovative, 
            it makes cleaning effortless and thorough.
          </p>

          <Link
            href="/all-products"
            className="inline-block bg-[#C80000] text-white text-sm sm:text-base font-medium px-5 sm:px-6 py-2.5 sm:py-3 rounded-md hover:bg-[#b80000] transition-all"
          >
            Explore Products
          </Link>
        </div>
      </div>
    </section>
  );
}
