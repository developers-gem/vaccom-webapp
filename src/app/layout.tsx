import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "./components/ClientLayout";
import Providers from "./components/Providers";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Vaccom Australia | Premium Vacuum & Cleaning Solutions",
  description: "Vaccom Australia provides high-quality vacuum systems, cleaning equipment, and reliable maintenance services. Trusted solutions for homes and businesses across Australia.",
  verification: {
    google: "ij_JShEYQdtkzQln9bIYAsQgPnaHa4QqfDrkuCYMjtU",
  },
  alternates: {
    canonical: "https://vaccom.com.au/",
  },
};

export default function RootLayout({
  children,
  session,
}: {
  children: React.ReactNode;
  session?: any;
}) {
  return (
    <html lang="en">
      <head>
        {/* ✅ Canonical Tag */}
        <link rel="canonical" href="https://vaccom.com.au/" />

        {/* ✅ Google Analytics */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-9X6NTHTDFK"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-9X6NTHTDFK');
          `}
        </Script>
      </head>

      <body className="antialiased" suppressHydrationWarning>
        <Providers session={session}>
          <ClientLayout>{children}</ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
