import "../globals.css";
import Script from "next/script";

export const metadata = {
  title: "Admin Dashboard",
  description: "Admin Panel",

  // ✅ Google Site Verification
  verification: {
    google: "ij_JShEYQdtkzQln9bIYAsQgPnaHa4QqfDrkuCYMjtU",
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* ✅ Google Analytics */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-9X6NTHTDFK"
        />

        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-9X6NTHTDFK');
          `}
        </Script>

        {/* Your existing layout */}
        <div className="flex min-h-screen bg-gray-50">
          <main className="flex-1 p-6 overflow-y-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}
