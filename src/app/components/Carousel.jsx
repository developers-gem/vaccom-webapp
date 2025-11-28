"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import Image from "next/image";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function Carousel() {
  const slides = [
    "/banner-img/axa copy.webp",
    "/banner-img/vaccomweb1.webp",
    "/banner-img/vaccomweb2.webp",
  ];

  return (
    <div className="w-full relative">
      <Swiper
        loop={true}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation={true}   // ✅ ENABLE ARROWS
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper"
      >
        {slides.map((src, idx) => (
          <SwiperSlide key={idx}>
            <div className="relative w-full">

              <Image
                src={src}
                alt={`Slide ${idx + 1}`}
                width={1920}
                height={800}
                priority
                quality={100}
                className="
                  w-full object-cover
                  h-[180px]      /* small mobile */
                  sm:h-[260px]   /* mobile large */
                  md:h-[380px]   /* tablets */
                  lg:h-[400px]   /* laptops */
                  xl:h-[400px]   /* desktop */
                  2xl:h-[600px]  /* MacBook / 4K */
                "
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
