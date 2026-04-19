"use client";

import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { useUIStore } from "@/store";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sidebarOpen } = useUIStore();

  return (
    <div
      className="flex min-h-screen bg-slate-50"
      style={
        {
          "--sidebar-width": "16rem",
          "--sidebar-collapsed-width": "5rem",
        } as React.CSSProperties
      }
    >
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Area - Adjusts based on sidebar state using CSS variables */}
      <div
        className={`flex flex-1 flex-col transition-all duration-300 ${
          sidebarOpen ? "md:pl-[var(--sidebar-width)]" : "md:pl-[var(--sidebar-collapsed-width)]"
        }`}
      >
        <Header />
        <main className="flex-1 overflow-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
