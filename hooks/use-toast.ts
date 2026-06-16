import { useToastStore } from "@/store/toast";
import type { Toast, ToastType } from "@/store/toast";

export type { Toast, ToastType };

type ToastInput = string | { title?: string; description: string };

/** Normalizes the string-or-object toast argument into {title, description}. */
function normalize(input: ToastInput): { title?: string; description: string } {
  if (typeof input === "string") {
    return { description: input };
  }
  return { title: input.title, description: input.description };
}

/**
 * Toast hook backed by a shared Zustand store (store/toast.ts).
 *
 * Every component that calls useToast() reads/writes the SAME toast array, so a
 * toast fired here is rendered by the ToasterProvider mounted in the root layout.
 */
export function useToast() {
  const toasts = useToastStore((state) => state.toasts);
  const addToast = useToastStore((state) => state.addToast);
  const dismiss = useToastStore((state) => state.dismiss);

  const make = (type: ToastType) => (props: ToastInput) => {
    const { title, description } = normalize(props);
    const id = addToast({ title, description, type });
    return { id, dismiss: () => dismiss(id) };
  };

  const toast = {
    success: make("success"),
    error: make("error"),
    info: make("info"),
    default: make("default"),
  };

  return {
    toast,
    toasts,
    dismiss,
  };
}
