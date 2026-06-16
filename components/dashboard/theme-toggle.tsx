"use client"

import { Sun, Moon, Monitor } from "lucide-react"
import { useTheme, type Theme } from "@/components/providers/theme-provider"

// Cycle order and the icon/label for each theme.
const ORDER: Theme[] = ["light", "dark", "system"]
const META: Record<Theme, { icon: typeof Sun; label: string }> = {
  light: { icon: Sun, label: "Light" },
  dark: { icon: Moon, label: "Dark" },
  system: { icon: Monitor, label: "System" },
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const { icon: Icon, label } = META[theme]

  function cycle() {
    const next = ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length]
    setTheme(next)
  }

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={`Theme: ${label}. Click to change.`}
      title={`Theme: ${label}`}
      className="rounded-lg p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
    >
      <Icon className="h-5 w-5 text-slate-600 dark:text-slate-300" />
    </button>
  )
}
