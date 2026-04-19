import { useState, useCallback } from "react";

export type ToastType = "success" | "error" | "default" | "info";

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  type: ToastType;
  open: boolean;
}

interface ToastActionType {
  type: "ADD_TOAST" | "REMOVE_TOAST" | "CLEAR_TOASTS";
  payload?: Toast;
  id?: string;
}

/**
 * Custom hook for managing toast notifications
 * Provides methods to create, dismiss, and clear toasts
 */
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (
      props: Pick<Toast, "title" | "description" | "type"> & {
        duration?: number;
      }
    ) => {
      const id = `${Date.now()}-${Math.random()}`;
      const newToast: Toast = {
        id,
        title: props.title,
        description: props.description,
        type: props.type || "default",
        open: true,
      };

      setToasts((prev) => [...prev, newToast]);

      // Auto-remove after duration (default 5 seconds)
      if (props.duration !== 0) {
        const timeout = setTimeout(() => {
          setToasts((prev) =>
            prev.map((t) => (t.id === id ? { ...t, open: false } : t))
          );
          // Remove from DOM after animation
          setTimeout(
            () => {
              setToasts((prev) => prev.filter((t) => t.id !== id));
            },
            300
          );
        }, props.duration || 5000);

        return {
          id,
          dismiss: () => clearTimeout(timeout),
        };
      }

      return {
        id,
        dismiss: () => {
          setToasts((prev) =>
            prev.map((t) => (t.id === id ? { ...t, open: false } : t))
          );
        },
      };
    },
    []
  );

  const dismiss = useCallback((toastId: string) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === toastId ? { ...t, open: false } : t))
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toastId));
    }, 300);
  }, []);

  const toast = {
    success: (props: string | { title?: string; description: string }) => {
      const message = typeof props === "string" ? props : props;
      return addToast({
        title: typeof message === "string" ? undefined : message.title,
        description:
          typeof message === "string" ? message : message.description,
        type: "success",
      });
    },
    error: (props: string | { title?: string; description: string }) => {
      const message = typeof props === "string" ? props : props;
      return addToast({
        title: typeof message === "string" ? undefined : message.title,
        description:
          typeof message === "string" ? message : message.description,
        type: "error",
      });
    },
    info: (props: string | { title?: string; description: string }) => {
      const message = typeof props === "string" ? props : props;
      return addToast({
        title: typeof message === "string" ? undefined : message.title,
        description:
          typeof message === "string" ? message : message.description,
        type: "info",
      });
    },
    default: (props: string | { title?: string; description: string }) => {
      const message = typeof props === "string" ? props : props;
      return addToast({
        title: typeof message === "string" ? undefined : message.title,
        description:
          typeof message === "string" ? message : message.description,
        type: "default",
      });
    },
  };

  return {
    toast,
    toasts,
    dismiss,
  };
}
