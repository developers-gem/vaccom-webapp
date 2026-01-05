"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Allorder from "./cms/orders/page";
import AddProductPage from "./cms/add-product/page";
import ProductListPage from "./cms/product-list/page";
import AddCoupon from "./cms/add-coupon/page";
import ViewCoupons from "./cms/view-coupons/page";
import BlogListPage from "./cms/blogs/page";
import CreateBlogPage from "./cms/blogs/create/page";
import TransactionPage from "./cms/transaction/page";
import TopCleaningBrands from "../components/TopCleaningBrands";
import OrdersList from "./cms/orders/orders-list/OrdersList";
import AllUsersPage from "./cms/all-users/page";
import CreateAdminPage from "./create-admin/page";
import RecentOrders from "../components/RecentOrders";
import NotificationsAdminPage from "./cms/notifications/page";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

import {
  ArrowLeftRight,
  ChevronDown,
  LayoutDashboard,
  Package,
  Users,
  Tags,
  Bell,
  Menu,
  ChevronLeft,
  Ticket,
  LogOut,
  Search,
  UserPlus,
} from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [visitorsData, setVisitorsData] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [filter, setFilter] = useState<"week" | "month" | "year">("week");

  // Fetch session and role
  useEffect(() => {
    const verifySession = async () => {
      try {
        const res = await fetch("/api/admin/me", { credentials: "include" });
        if (!res.ok) throw new Error("Not authenticated");
        const data = await res.json();
        setRole(data.role || "admin");
      } catch (err) {
        console.error("Auth check failed:", err);
        router.push("/admin/login");
      } finally {
        setLoading(false);
      }
    };
    verifySession();
  }, [router]);

  // Fetch dashboard data
  useEffect(() => {
    if (!role) return;
    const fetchData = async () => {
      try {
        const [revenueRes, visitorsRes, productsRes] = await Promise.all([
          fetch("/api/admin/revenue", { credentials: "include" }),
          fetch("/api/admin/visitors", { credentials: "include" }),
          fetch("/api/admin/top-products", { credentials: "include" }),
        ]);
        setRevenueData(await revenueRes.json());
        setVisitorsData(await visitorsRes.json());
        setTopProducts(await productsRes.json());
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };
    fetchData();
  }, [role]);

  const toggleMenu = (menu: string) =>
    setOpenMenu(openMenu === menu ? null : menu);

  const totalRevenue = revenueData.reduce(
    (sum, item) => sum + (item.revenue || 0),
    0
  );
  const totalEarnings = revenueData.reduce(
    (sum, item) => sum + (item.earnings || 0),
    0
  );
  const totalVisitors = visitorsData.reduce(
    (sum, item) => sum + (item.visitors || 0),
    0
  );
  const topProductName = topProducts[0]?.name || "-";

  // ----------------- Role-based access -----------------
  const hasAccess = (module: string) => {
    if (!role) return false;

    const accessMatrix: Record<string, string[]> = {
      dashboard: [
        "superadmin",
        "product_manager",
        "order_manager",
        "marketing_manager",
      ],
      products: ["superadmin", "product_manager"],
      "add-product": ["superadmin", "product_manager"],
      "product-list": ["superadmin", "product_manager"],
      orders: ["superadmin", "order_manager"],
      "orders-list": ["superadmin", "order_manager"],
      transactions: ["superadmin", "order_manager"],
      coupons: ["superadmin", "marketing_manager"],
      "add-coupon": ["superadmin", "marketing_manager"],
      "view-coupons": ["superadmin", "marketing_manager"],
      blogs: ["superadmin", "marketing_manager"],
      "admin/cms/blogs/create": ["superadmin", "marketing_manager"],
      users: ["superadmin"],
      "create-admin": ["superadmin"],
      TopCleaningBrands: [
        "superadmin",
        "product_manager",
        "order_manager",
        "marketing_manager",
      ],
      notifications : [
         "superadmin",

      ]
    };

    return accessMatrix[module]?.includes(role);
  };
  // ------------------------------------------------------

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <aside
        className={`bg-white/90 backdrop-blur-md border-r shadow-md hidden md:flex flex-col transition-all duration-300 ${
          collapsed ? "w-20" : "w-48"
        } fixed top-0 left-0 h-screen z-50`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          {!collapsed && (
            <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
              Vaccom
            </h2>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded hover:bg-gray-100"
          >
            {collapsed ? (
              <Menu className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <NavLink
            onClick={() => setActiveTab("dashboard")}
            label="Dashboard"
            icon={<LayoutDashboard />}
            active={activeTab === "dashboard"}
            collapsed={collapsed}
          />

          {hasAccess("products") && (
            <Dropdown
              label="Products"
              menu="products"
              openMenu={openMenu}
              toggleMenu={toggleMenu}
              items={[
                { label: "Add Product", value: "add-product" },
                { label: "Product List", value: "product-list" },
              ]}
              onSelect={(val: string) => setActiveTab(val)}
              collapsed={collapsed}
            />
          )}

          {hasAccess("orders") && (
            <Dropdown
              label="Orders"
              menu="orders"
              openMenu={openMenu}
              toggleMenu={toggleMenu}
              items={[
                { label: "Orders", value: "orders" },
                { label: "Orders List", value: "orders-list" },
              ]}
              onSelect={(val: string) => setActiveTab(val)}
              collapsed={collapsed}
            />
          )}

          {hasAccess("blogs") && (
            <Dropdown
              label="Blogs"
              menu="blogs"
              openMenu={openMenu}
              toggleMenu={toggleMenu}
              items={[
                { label: "Add Blog", value: "admin/cms/blogs/create" },
                { label: "View Blogs", value: "blogs" },
              ]}
              onSelect={(val: string) => setActiveTab(val)}
              collapsed={collapsed}
            />
          )}

          {hasAccess("transactions") && (
            <NavLink
              onClick={() => setActiveTab("transactions")}
              label="Transactions"
              icon={<ArrowLeftRight />}
              active={activeTab === "transactions"}
              collapsed={collapsed}
            />
          )}

          {hasAccess("coupons") && (
            <Dropdown
              label="Coupons"
              icon={<Ticket />}
              menu="coupons"
              openMenu={openMenu}
              toggleMenu={toggleMenu}
              items={[
                { label: "Add Coupon", value: "add-coupon" },
                { label: "View Coupons", value: "view-coupons" },
              ]}
              onSelect={(val: string) => setActiveTab(val)}
              collapsed={collapsed}
            />
          )}

          <NavLink
            onClick={() => setActiveTab("TopCleaningBrands")}
            label="Brands"
            icon={<Tags />}
            active={activeTab === "TopCleaningBrands"}
            collapsed={collapsed}
          />

          <NavLink
            onClick={() => setActiveTab("notifications")}
            label="Notifications"
            icon={<Tags />}
            active={activeTab === "notifications"}
            collapsed={collapsed}
          />

          {hasAccess("users") && (
            <NavLink
              onClick={() => setActiveTab("users")}
              label="Users"
              icon={<Users />}
              active={activeTab === "users"}
              collapsed={collapsed}
            />
          )}

          {hasAccess("create-admin") && (
            <NavLink
              onClick={() => setActiveTab("create-admin")}
              label="Create Admin"
              icon={<UserPlus />}
              active={activeTab === "create-admin"}
              collapsed={collapsed}
            />
          )}

          <NavLink
            onClick={async () => {
              try {
                await fetch("/api/admin/logout", { method: "POST" });
                router.push("/admin/login");
              } catch (err) {
                console.error("Logout failed:", err);
              }
            }}
            label="Logout"
            icon={<LogOut />}
            active={activeTab === "logout"}
            collapsed={collapsed}
          />
        </nav>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 p-6 transition-all duration-300 ${
          collapsed ? "ml-20" : "ml-48"
        }`}
      >
        <Header activeTab={activeTab} role={role} collapsed={collapsed} />

        {/* --------------------- Main Pages --------------------- */}
        {!hasAccess(activeTab) && activeTab !== "dashboard" && (
          <div className="text-center mt-20 text-xl font-semibold text-red-500">
            You are not authorized to view this page.
          </div>
        )}

        {activeTab === "dashboard" && (
          <DashboardContent
            revenueData={revenueData}
            visitorsData={visitorsData}
            topProducts={topProducts}
            totalRevenue={totalRevenue}
            totalEarnings={totalEarnings}
            totalVisitors={totalVisitors}
            topProductName={topProductName}
            filter={filter}
            setFilter={setFilter}
          />
        )}

        {activeTab === "add-product" && hasAccess("add-product") && (
          <AddProductPage />
        )}
        {activeTab === "product-list" && hasAccess("product-list") && (
          <ProductListPage />
        )}
        {activeTab === "orders" && hasAccess("orders") && <Allorder />}
        {activeTab === "orders-list" && hasAccess("orders-list") && (
          <OrdersList />
        )}
        {activeTab === "admin/cms/blogs/create" &&
          hasAccess("admin/cms/blogs/create") && <CreateBlogPage />}
        {activeTab === "blogs" && hasAccess("blogs") && <BlogListPage />}
        {activeTab === "transactions" && hasAccess("transactions") && (
          <TransactionPage />
        )}

        {activeTab === "TopCleaningBrands" &&
          hasAccess("TopCleaningBrands") && <TopCleaningBrands />}
        {activeTab === "add-coupon" && hasAccess("add-coupon") && <AddCoupon />}
        {activeTab === "view-coupons" && hasAccess("view-coupons") && (
          <ViewCoupons />
        )}
        {activeTab === "notifications" && hasAccess("notifications") &&     <NotificationsAdminPage /> }

        {activeTab === "users" && hasAccess("users") && <AllUsersPage />}
        {activeTab === "create-admin" && hasAccess("create-admin") && (
          <CreateAdminPage />
        )}
      </main>
    </div>
  );
}

/* ------------------- Supporting Components ------------------- */
function Header({
  activeTab,
  role,
  collapsed,
}: {
  activeTab: string;
  role: string | null;
  collapsed: boolean;
}) {
  return (
    <header className="flex justify-between items-center mb-6 bg-white/70 backdrop-blur-md rounded-xl shadow-sm px-4 py-3">
      <div>
        <p className="text-sm text-gray-400">Dashboard / {activeTab}</p>
        <h1 className="text-2xl font-bold text-gray-800 capitalize">
          {activeTab}
        </h1>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="pl-8 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-2 top-2.5" />
        </div>
        <Bell className="w-5 h-5 text-gray-600 cursor-pointer" />
        <div className="flex items-center gap-2">
          <img
            src="/images/admin-png.svg"
            alt="User"
            className="w-10 h-10 rounded-full border"
          />
          {!collapsed && (
            <span className="text-gray-700 font-medium">{role || "Admin"}</span>
          )}
        </div>
      </div>
    </header>
  );
}

/* ------------------- NavLink, Dropdown, DashboardContent, KPI, ChartCard, TabContent remain the same ------------------- */

/* ------------------- Other Components (NavLink, Dropdown, DashboardContent etc.) remain the same ------------------- */

function TabContent({ title }: { title: string }) {
  return (
    <div className="text-center mt-20 text-xl font-semibold text-gray-700">
      {title} Page Content
    </div>
  );
}

function NavLink({ onClick, label, icon, active = false, collapsed }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all w-full text-left ${
        active
          ? "bg-gradient-to-r from-red-900 to-red-500 text-white font-medium shadow"
          : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
      } ${collapsed ? "justify-center" : ""}`}
      title={collapsed ? label : ""}
    >
      {icon} {!collapsed && <span>{label}</span>}
    </button>
  );
}

function Dropdown({
  label,
  menu,
  openMenu,
  toggleMenu,
  items,
  onSelect,
  collapsed,
  icon,
}: any) {
  const isOpen = openMenu === menu;
  return (
    <div>
      <button
        onClick={() => toggleMenu(menu)}
        className={`flex justify-between w-full px-3 py-2 rounded-xl transition-all ${
          isOpen
            ? "bg-gradient-to-r from-red-800 to-red-500 text-white shadow font-medium"
            : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
        } ${collapsed ? "justify-center" : ""}`}
        title={collapsed ? label : ""}
      >
        <span className="flex items-center gap-2">
          {icon || <Package className="w-4 h-4" />} {!collapsed && label}
        </span>
        {!collapsed && (
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        )}
      </button>

      {!collapsed && isOpen && (
        <div className="ml-6 mt-2 space-y-1 animate-fadeIn">
          {items.map((item: any) => (
            <button
              key={item.value}
              onClick={() => onSelect(item.value)}
              className="flex items-center gap-2 px-3 py-2 text-[15px] font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all w-full text-left"
            >
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function DashboardContent({
  revenueData,
  visitorsData,
  topProducts,
  totalRevenue,
  totalEarnings,
  totalVisitors,
  topProductName,
  filter,
  setFilter,
}: any) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPI
          title="Revenue"
          value={`$${totalRevenue}`}
          color="from-blue-500 to-blue-600"
        />
        <KPI
          title="Earnings"
          value={`$${totalEarnings}`}
          color="from-green-500 to-green-600"
        />
        <KPI
          title="Visitors"
          value={`${totalVisitors}`}
          color="from-yellow-500 to-yellow-600"
        />
        <KPI
          title="Top Product"
          value={topProductName}
          color="from-purple-500 to-purple-600"
        />
      </div>
      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4">
        {["week", "month", "year"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded ${
              filter === f
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Charts */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCard title="Revenue & Earnings">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                strokeWidth={3}
              />
              <Line
                type="monotone"
                dataKey="earnings"
                stroke="#10b981"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Visitors">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={visitorsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="visitors"
                stroke="#f59e0b"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  {/* Top Products */}
  <ChartCard title="Top Products">
    <div className="space-y-5">
      {topProducts.map((p: any, idx: number) => {
        const maxSales = Math.max(
          ...topProducts.map((t: any) => t.sales || 0),
          1
        );
        const maxRevenue = Math.max(
          ...topProducts.map((t: any) => t.revenue || 0),
          1
        );

        const salesPercent = Math.min((p.sales / maxSales) * 100, 100);
        const revenuePercent = Math.min((p.revenue / maxRevenue) * 100, 100);

        return (
          <div
            key={p.name}
            className="bg-white shadow rounded-xl p-5 flex flex-col gap-3 hover:shadow-md transition-all"
          >
            {/* Header */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-gray-800 font-semibold">{idx + 1}.</span>
                <span className="text-gray-700 font-medium truncate max-w-[150px]">
                  {p.name}
                </span>
              </div>
              <div className="flex gap-2 text-xs sm:text-sm">
                <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium">
                  {p.sales} Sales
                </span>
                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                  ${p.revenue}
                </span>
              </div>
            </div>

            {/* Bars with percentage labels */}
            <div className="space-y-2">
              {/* Sales */}
              <div className="flex items-center gap-3">
                <span className="w-14 text-xs text-gray-500">Sales</span>
                <div className="flex-1 bg-gray-100 h-3 rounded-full overflow-hidden">
                  <div
                    className="h-3 bg-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${salesPercent}%` }}
                  ></div>
                </div>
                <span className="text-xs font-bold text-indigo-600 w-10 text-right">
                  {salesPercent.toFixed(0)}%
                </span>
              </div>

              {/* Revenue */}
              <div className="flex items-center gap-3">
                <span className="w-14 text-xs text-gray-500">Revenue</span>
                <div className="flex-1 bg-gray-100 h-3 rounded-full overflow-hidden">
                  <div
                    className="h-3 bg-green-500 rounded-full transition-all duration-500"
                    style={{ width: `${revenuePercent}%` }}
                  ></div>
                </div>
                <span className="text-xs font-bold text-green-600 w-10 text-right">
                  {revenuePercent.toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </ChartCard>

  {/* Recent Orders */}
  <RecentOrders />
</div>

    </>
  );
}

function KPI({
  title,
  value,
  color,
}: {
  title: string;
  value: string;
  color: string;
}) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition transform hover:-translate-y-1 border border-gray-100">
      <h2
        className={`text-sm font-medium bg-gradient-to-r ${color} bg-clip-text text-transparent mb-1`}
      >
        {title}
      </h2>
      <p className="text-xl font-bold text-gray-800">{value}</p>
    </div>
  );
}

function ChartCard({ title, children }: any) {
  return (
    <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-md border border-gray-100 mb-6">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
}
