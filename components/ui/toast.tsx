import * as React from "react"
import { X, Check, AlertCircle, Info } from "lucide-react"
import { cn } from "@/lib/utils"

interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  type?: "success" | "error" | "default" | "info"
  open?: boolean
  onClose?: () => void
}

export const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  (
    { title, description, type = "default", open = true, onClose, className, ...props },
    ref
  ) => {
    const baseStyles =
      "fixed bottom-4 right-4 z-50 w-full max-w-md rounded-lg shadow-lg p-4 flex gap-4 items-start transition-all duration-300"

    const typeStyles = {
      success: "bg-green-50 border border-green-200",
      error: "bg-red-50 border border-red-200",
      info: "bg-blue-50 border border-blue-200",
      default: "bg-slate-50 border border-slate-200",
    }

    const iconStyles = {
      success: "text-green-600",
      error: "text-red-600",
      info: "text-blue-600",
      default: "text-slate-600",
    }

    const titleStyles = {
      success: "text-green-900",
      error: "text-red-900",
      info: "text-blue-900",
      default: "text-slate-900",
    }

    const descriptionStyles = {
      success: "text-green-700",
      error: "text-red-700",
      info: "text-blue-700",
      default: "text-slate-700",
    }

    const getIcon = () => {
      switch (type) {
        case "success":
          return <Check className={cn("h-5 w-5 shrink-0 mt-0.5", iconStyles[type])} />
        case "error":
          return <AlertCircle className={cn("h-5 w-5 shrink-0 mt-0.5", iconStyles[type])} />
        case "info":
          return <Info className={cn("h-5 w-5 shrink-0 mt-0.5", iconStyles[type])} />
        default:
          return null
      }
    }

    return (
      <div
        ref={ref}
        className={cn(
          baseStyles,
          typeStyles[type],
          !open && "translate-y-2 opacity-0 pointer-events-none",
          className
        )}
        {...props}
      >
        {getIcon()}
        <div className="flex-1">
          {title && (
            <h3 className={cn("font-semibold text-sm", titleStyles[type])}>
              {title}
            </h3>
          )}
          {description && (
            <p className={cn("text-sm mt-1", descriptionStyles[type])}>
              {description}
            </p>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={cn(
              "shrink-0 rounded-md p-1 transition-opacity hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 mt-0.5",
              type === "success" && "focus:ring-green-500",
              type === "error" && "focus:ring-red-500",
              type === "info" && "focus:ring-blue-500",
              type === "default" && "focus:ring-slate-500"
            )}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    )
  }
)
Toast.displayName = "Toast"

export default Toast
