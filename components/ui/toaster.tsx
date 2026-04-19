"use client"

import { createContext, useContext, ReactNode } from "react"
import { Toast as ToastComponent } from "./toast"
import { useToast } from "@/hooks/use-toast"

interface ToasterContextType {
  toasts: any[]
  dismiss: (id: string) => void
}

const ToasterContext = createContext<ToasterContextType | undefined>(undefined)

export function ToasterProvider({ children }: { children: ReactNode }) {
  const { toasts, dismiss } = useToast()

  return (
    <ToasterContext.Provider value={{ toasts, dismiss }}>
      {children}
      <div className="fixed bottom-0 right-0 z-50 flex max-h-screen w-full flex-col-reverse pointer-events-none p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
        {toasts.map((toast) => (
          <ToastComponent
            key={toast.id}
            title={toast.title}
            description={toast.description}
            type={toast.type}
            open={toast.open}
            onClose={() => dismiss(toast.id)}
            className="pointer-events-auto"
          />
        ))}
      </div>
    </ToasterContext.Provider>
  )
}

export function useToasterContext() {
  const context = useContext(ToasterContext)
  if (!context) {
    throw new Error("useToasterContext must be used within ToasterProvider")
  }
  return context
}
