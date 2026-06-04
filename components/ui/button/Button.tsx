"use client";

import React from "react";
import clsx from "clsx";

type ButtonProps = {
  children: React.ReactNode;

  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";

  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;

  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={clsx(
        // base
        "inline-flex items-center justify-center gap-2 uppercase tracking-[0.2em] font-semibold transition-all duration-300 focus:outline-none",

        // sizes
        size === "sm" && "px-4 py-2 text-[10px]",
        size === "md" && "px-6 py-3 text-[11px]",
        size === "lg" && "px-8 py-4 text-[12px]",

        // variants
        variant === "primary" &&
          "bg-black text-white hover:bg-orange-600",

        variant === "outline" &&
          "border border-white text-white hover:bg-white hover:text-black",

        variant === "ghost" &&
          "text-white hover:bg-white/10",

        // disabled
        (disabled || loading) &&
          "opacity-50 cursor-not-allowed hover:none",

        className
      )}
      {...props}
    >
      {/* LEFT ICON */}
      {!loading && leftIcon && <span>{leftIcon}</span>}

      {/* LOADING SPINNER */}
      {loading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}

      {/* TEXT */}
      <span>{children}</span>

      {/* RIGHT ICON */}
      {!loading && rightIcon && <span>{rightIcon}</span>}
    </button>
  );
}