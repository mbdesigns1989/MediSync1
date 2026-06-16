"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react"

export type Theme = "light" | "dark" | "system"

interface ThemeContextValue {
  /** The user's selected preference (may be "system"). */
  theme: Theme
  /** The actually-applied theme after resolving "system". */
  resolvedTheme: "light" | "dark"
  setTheme: (theme: Theme) => void
}

const STORAGE_KEY = "medisync-theme"

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light"
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"
}

function applyTheme(theme: Theme) {
  const resolved = theme === "system" ? getSystemTheme() : theme
  const root = document.documentElement
  root.classList.toggle("dark", resolved === "dark")
  return resolved
}

/**
 * Theme via React Context (light/dark/system).
 *
 * This is the textbook case for plain Context rather than Zustand: a single
 * cross-cutting value many components read but rarely write. Persists the choice
 * to localStorage and re-resolves "system" when the OS preference changes.
 */
function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "system"
  return (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? "system"
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Lazy initializers read the stored preference on the first client render
  // (the layout's pre-paint script already set the .dark class). Reading here
  // rather than in an effect avoids a post-mount setState (no cascading render).
  const [theme, setThemeState] = useState<Theme>(getStoredTheme)
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">(() =>
    theme === "system" ? getSystemTheme() : theme
  )

  // When "system" is selected, react to OS preference changes live.
  useEffect(() => {
    if (theme !== "system") return
    const mql = window.matchMedia("(prefers-color-scheme: dark)")
    const onChange = () => setResolvedTheme(applyTheme("system"))
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [theme])

  const setTheme = useCallback((next: Theme) => {
    localStorage.setItem(STORAGE_KEY, next)
    setThemeState(next)
    setResolvedTheme(applyTheme(next))
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider")
  }
  return ctx
}
