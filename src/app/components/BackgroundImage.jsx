'use client';
import React from 'react';
import Image from 'next/image';
import Link from "next/link";


export default function BackgroundImage() {
  return (
    <>
      {/* First Background Section */}
      <section
        className="w-full h-[500px] bg-cover bg-center flex items-center justify-start text-left px-4"
        style={{
          backgroundImage: `url('/banner-img/vac 1.webp')`,
        }}
      >
        <div className="bg-opacity-70 p-6 rounded-lg max-w-3xl">
          <Image
            src="/brand-image/brand-dreame.png"
            alt="Dreame Logo"
            width={100}
            height={100}
            className="h-auto object-contain mb-4"
          />
          <h1 className="text-black text-xl md:text-4xl font-semibold">
            The Dreame H14 takes wet & dry cleaning to the next level. Try it in person at one of our Melbourne stores before you buy!
          </h1>
          <p className="mt-3 text-black text-base font-medium">
            Save up to $500.00 on vacuum!
          </p>
          <Link
            href="/all-products"
            className="inline-block bg-[#DC1515] hover:bg-[#b80000] text-white text-sm sm:text-base font-medium px-5 sm:px-7 py-2.5 sm:py-3 rounded-md transition-all mt-2"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Second Black Section with Product Image on Right */}
      <section className="w-full h-[400px] bg-black flex items-center justify-between px-8 py-12">
      
        <div className="max-w-xl">
          <p className="text-white text-lg mb-2">Welcome to Our Shop</p>
          <h2 className="text-white text-3xl md:text-5xl font-bold leading-tight">
            Explore Our Wide Range of Quality Products
          </h2>
          {/* <button className="mt-6 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-md transition duration-200">
            Shop Now
          </button> */}
          <Link
            href="/all-products"
            className="inline-block bg-[#DC1515] hover:bg-[#b80000] text-white text-sm sm:text-base font-medium px-5 sm:px-7 py-2.5 sm:py-3 rounded-md transition-all mt-2"
          >
            Shop Now
          </Link>
        </div>
<div className="hidden md:flex items-center gap-8 ">
          <Image
            src="/banner-img/banner-img4.jpg"
            alt="Vacuum 1"
            width={900}
            height={400}
            className="object-contain"
          />
      
        </div>
       
      </section>
    </>
  );
}
