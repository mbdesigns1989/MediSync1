"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Clock,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { useUIStore } from "@/store";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const pathname = usePathname();

  const navItems = [
    {
      name: "Overview",
      href: "/dashboard",
      icon: LayoutDashboard,
      exact: true,
    },
    { name: "Patients", href: "/dashboard/patients", icon: Users },
    { name: "Appointments", href: "/dashboard/appointments", icon: Clock },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const isActive = (href: string, exact?: boolean) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-white shadow-lg transition-all duration-300 ease-in-out z-50 md:z-auto",
        sidebarOpen ? "w-64" : "w-20"
      )}
    >
      {/* Header with Logo and Toggle */}
      <div className="flex h-20 items-center justify-between border-b border-slate-200 px-4">
        {sidebarOpen && (
          <div className="text-xl font-bold text-blue-600">MediSync</div>
        )}
        <button
          onClick={toggleSidebar}
          className="rounded-lg p-2 hover:bg-slate-100"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? (
            <X className="h-5 w-5 text-slate-600" />
          ) : (
            <Menu className="h-5 w-5 text-slate-600" />
          )}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="space-y-2 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href, item.exact);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 transition-all duration-200",
                active
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-600 hover:bg-slate-50"
              )}
              title={!sidebarOpen ? item.name : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {sidebarOpen && <span className="text-sm font-medium">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      {sidebarOpen && (
        <div className="absolute bottom-0 left-0 right-0 border-t border-slate-200 p-4">
          <p className="text-xs text-slate-500">© 2026 MediSync AI</p>
        </div>
      )}
    </aside>
  );
}
