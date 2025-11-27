import ClientPage from "./ClientPage";
import { categorySEO } from "./seoData";

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const rawSlug = decodeURIComponent(slug);
  const normalizedSlug = rawSlug.toLowerCase();

  const seo = categorySEO[normalizedSlug] || {
    title: "Vaccom AU",
    description:
      "Best vacuum cleaners, accessories and cleaning equipment in Australia. Fast delivery and expert support.",
          canonical: "https://vaccom.com.au",

  };

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: seo.canonical, // use canonical from seoData
    },
  };
}

export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;      // ⬅ FIX
  return <ClientPage params={{ slug }} />;  // ⬅ PASS slug
}
