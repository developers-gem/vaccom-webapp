import "../globals.css";

export const metadata = {
  title: "Admin Dashboard",
  description: "Admin Panel",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* optional sidebar */}
      <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </div>
  );
}
