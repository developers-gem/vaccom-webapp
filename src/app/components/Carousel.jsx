'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default function Carousel() {
  const slides = [
    "/banner-img/black friday web banner .webp",
    "/banner-img/banner-img2.webp",
    "/banner-img/banner-img3.webp",
  ];

  return (
    <div className="w-full">
      <Swiper
        loop={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
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
                className="
                  w-full object-cover
                  h-[250px]   /* small mobile */
                  sm:h-[350px]  /* larger mobile */
                  md:h-[450px]  /* tablets */
                  lg:h-[550px]  /* laptops */
                  xl:h-[600px]  /* desktops */
                  2xl:h-[500px] /* very large screens (16” MacBook / 4K) */
                "
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
