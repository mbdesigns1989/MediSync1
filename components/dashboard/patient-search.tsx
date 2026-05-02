"use client"

import { useState } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"

interface PatientSearchProps {
  onSearchChange: (query: string) => void
  placeholder?: string
}

export function PatientSearch({
  onSearchChange,
  placeholder = "Search by name or patient ID...",
}: PatientSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    onSearchChange(value)
  }

  const handleClear = () => {
    setSearchQuery("")
    onSearchChange("")
  }

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={handleChange}
          className="pl-10 pr-10"
          autoComplete="off"
        />
        {searchQuery && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}
