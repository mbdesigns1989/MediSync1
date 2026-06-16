import { create } from "zustand";

export type ToastType = "success" | "error" | "default" | "info";

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  type: ToastType;
  open: boolean;
}

interface AddToastProps {
  title?: string;
  description?: string;
  type: ToastType;
  duration?: number;
}

interface ToastStore {
  toasts: Toast[];
  /** Adds a toast and schedules its auto-dismiss. Returns the new toast id. */
  addToast: (props: AddToastProps) => string;
  /** Animates a toast out, then removes it from the array. */
  dismiss: (toastId: string) => void;
  clear: () => void;
}

// Counter for stable, collision-free ids (avoids Date.now()/Math.random hydration concerns).
let toastCounter = 0;

/**
 * Shared toast store.
 *
 * Toasts live in a single Zustand store so every consumer — the form that fires
 * a toast and the ToasterProvider that renders them — reads and writes the SAME
 * array. (Previously each useToast() call had its own useState, so toasts fired
 * from a component were never rendered by the provider.)
 */
export const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],

  addToast: (props) => {
    const id = `toast-${toastCounter++}`;
    const newToast: Toast = {
      id,
      title: props.title,
      description: props.description,
      type: props.type || "default",
      open: true,
    };

    set((state) => ({ toasts: [...state.toasts, newToast] }));

    // Auto-dismiss after duration (default 5s); duration: 0 keeps it sticky.
    if (props.duration !== 0) {
      setTimeout(() => {
        get().dismiss(id);
      }, props.duration || 5000);
    }

    return id;
  },

  dismiss: (toastId) => {
    // Mark closed to trigger the exit animation...
    set((state) => ({
      toasts: state.toasts.map((t) =>
        t.id === toastId ? { ...t, open: false } : t
      ),
    }));
    // ...then remove from the DOM once it has animated out.
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== toastId),
      }));
    }, 300);
  },

  clear: () => set({ toasts: [] }),
}));
