"use client"

import { Search } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface SearchEmptyStateProps {
  query: string
}

export function SearchEmptyState({ query }: SearchEmptyStateProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-16 px-4">
        <div className="rounded-lg bg-slate-100 p-4 mb-4">
          <Search className="h-12 w-12 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mt-4">
          No patients found
        </h3>
        <p className="text-sm text-slate-600 mt-2 text-center max-w-xs">
          No patients match &quot;{query}&quot;. Try searching by a different
          name or patient ID.
        </p>
      </CardContent>
    </Card>
  )
}
