import { categorySEO } from "./seoData";

export default function Head({ params }: { params: { slug: string } }) {
  const rawSlug = decodeURIComponent(params.slug);
  const normalizedSlug = rawSlug.toLowerCase();

  const seo = categorySEO[normalizedSlug] || {
    title: "Vaccom AU",
    description:
      "Best vacuum cleaners, parts and accessories in Australia. Fast delivery and expert support.",
  };

  return (
    <>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <link
        rel="canonical"
        href={`https://vaccom.com.au/product-category/${normalizedSlug}`}
      />
    </>
  );
}
