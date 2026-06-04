"use client";

import { Toaster } from "sonner";

export default function AppToaster() {
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "font-sans text-sm border border-black/10 shadow-lg bg-white text-brand-black",
          title: "font-medium",
          description: "text-black/60",
        },
      }}
    />
  );
}
