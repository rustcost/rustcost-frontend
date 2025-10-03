import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  Bars3Icon,
  HomeIcon,
  CpuChipIcon,
  CubeIcon,
} from "@heroicons/react/24/outline";
import ThemeToggle from "../components/etc/ThemeToggle";

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen font-sans dark:antialiased bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 transform bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 z-30
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 md:flex md:flex-col`}
      >
        {/* Brand */}
        <div className="h-16 flex items-center gap-3 px-6 font-semibold text-2xl tracking-tight border-b border-gray-200 dark:border-gray-800">
          <img
            className="w-10 h-10 object-contain relative top-[4px]"
            src="/logo.webp"
            alt="RustCost Logo"
          />
          <span className="text-gray-900 dark:text-gray-100">RustCost</span>
        </div>
        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          <SideNavLink to="/" icon={<HomeIcon className="w-5 h-5" />}>
            Home
          </SideNavLink>

          {/* Nodes */}
          <div className="space-y-1">
            <SideNavLink to="/nodes" icon={<CpuChipIcon className="w-5 h-5" />}>
              Nodes
            </SideNavLink>
            <div className="ml-9 space-y-1">
              <SideNavLink
                to="/nodes/metrics"
                icon={
                  <span className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-600" />
                }
              >
                Metrics
              </SideNavLink>
            </div>
          </div>

          {/* Pods */}
          <div className="space-y-1">
            <SideNavLink to="/pods" icon={<CubeIcon className="w-5 h-5" />}>
              Pods
            </SideNavLink>
            <div className="ml-9 space-y-1">
              <SideNavLink
                to="/pods/namespaces"
                icon={
                  <span className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-600" />
                }
              >
                Namespaces
              </SideNavLink>
              <SideNavLink
                to="/pods/metrics"
                icon={
                  <span className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-600" />
                }
              >
                Metrics
              </SideNavLink>
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800">
          © 2025 RustCost
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 flex items-center justify-between bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 px-6">
          <div className="flex items-center gap-2">
            <button
              className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle sidebar"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
            <div className="text-xl font-semibold">Dashboard</div>
          </div>
          <ThemeToggle />
        </header>

        <main className="flex-1 overflow-y-auto p-6 transition-colors duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function SideNavLink({
  to,
  icon,
  children,
}: {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium transition-colors ${
          isActive
            ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        }`
      }
    >
      {icon}
      <span>{children}</span>
    </NavLink>
  );
}
