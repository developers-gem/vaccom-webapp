"use client";

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

interface RelatedProduct {
  _id: string;
  name: string;
  slug: string;
  price: number;
  salePrice?: number;
  images: string[];
}

export default function RelatedProductsSlider({
  products,
}: {
  products: RelatedProduct[];
}) {
  if (!products.length) return null;

  return (
    <section className="mt-20">
      <h2 className="text-2xl font-bold mb-6">Related Products</h2>

      <Swiper
        modules={[Navigation]}
        navigation
        spaceBetween={20}
        breakpoints={{
          320: { slidesPerView: 1.2 },
          640: { slidesPerView: 2.2 },
          1024: { slidesPerView: 4 },
        }}
      >
        {products.map((item) => {
          const hasSale =
            item.salePrice && item.salePrice < item.price;

          return (
            <SwiperSlide key={item._id}>
              <Link
                href={`/products/${item.slug}`}
                className="block border rounded-lg p-4 hover:shadow-lg transition"
              >
                <Image
                  src={item.images?.[0] || "/placeholder.png"}
                  alt={item.name}
                  width={300}
                  height={300}
                  className="w-full h-48 object-contain mb-3"
                />

                <h3 className="font-semibold text-sm line-clamp-2">
                  {item.name}
                </h3>

                <div className="mt-2">
                  {hasSale ? (
                    <>
                      <span className="text-sm line-through text-gray-400 mr-2">
                        ${item.price}
                      </span>
                      <span className="text-red-600 font-bold">
                        ${item.salePrice}
                      </span>
                    </>
                  ) : (
                    <span className="text-red-600 font-bold">
                      ${item.price}
                    </span>
                  )}
                </div>
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
}
