"use client";

import { Bell, User } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white px-8 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        {/* Breadcrumb and Welcome */}
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Dashboard
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Welcome back, Dr. Sarah Johnson
          </p>
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button
            className="rounded-lg p-2 hover:bg-slate-100 transition-colors dark:hover:bg-slate-800"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5 text-slate-600 dark:text-slate-300" />
          </button>
          <button
            className="rounded-lg p-2 hover:bg-slate-100 transition-colors dark:hover:bg-slate-800"
            aria-label="Profile"
          >
            <User className="h-5 w-5 text-slate-600 dark:text-slate-300" />
          </button>
        </div>
      </div>
    </header>
  );
}
