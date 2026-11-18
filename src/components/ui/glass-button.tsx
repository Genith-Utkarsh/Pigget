"use client";

import React, { forwardRef } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type GlassButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "accent"
  | "danger";

export type GlassButtonSize = "sm" | "md" | "lg";

export interface GlassButtonProps
  extends Omit<HTMLMotionProps<"button">, "size"> {
  variant?: GlassButtonVariant;
  size?: GlassButtonSize;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

const variantStyles: Record<GlassButtonVariant, string> = {
  primary:
    "bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-[20px] shadow-lg shadow-blue-600/30 border border-blue-400/20 font-medium",
  secondary:
    "bg-[#17181e]/90 hover:bg-[#20222a] active:bg-[#15161b] text-slate-200 border border-white/10 rounded-full font-medium shadow-sm",
  ghost:
    "bg-transparent hover:bg-white/[0.06] active:bg-white/[0.1] text-slate-300 hover:text-white rounded-full border border-transparent",
  accent:
    "bg-[#cbf33e] hover:bg-[#b8e030] active:bg-[#a6cc29] text-black font-semibold rounded-full shadow-lg shadow-[#cbf33e]/20 border border-[#cbf33e]/30",
  danger:
    "bg-red-500/20 hover:bg-red-500/30 active:bg-red-500/40 text-red-400 border border-red-500/30 rounded-full font-medium",
};

const sizeStyles: Record<GlassButtonSize, string> = {
  sm: "text-xs px-3 py-1.5 gap-1.5",
  md: "text-sm px-4 py-2.5 gap-2",
  lg: "text-base px-6 py-3.5 gap-2.5",
};

export const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      icon,
      iconRight,
      children,
      className,
      disabled = false,
      loading = false,
      fullWidth = false,
      type = "button",
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.96 }}
        transition={{ type: "spring", stiffness: 450, damping: 25 }}
        className={cn(
          "inline-flex items-center justify-center transition-all duration-150 select-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin text-current shrink-0" />
        ) : (
          icon && <span className="shrink-0">{icon}</span>
        )}
        {children && (
          <span className="inline-flex min-w-0 items-center gap-1.5 leading-none">
            {children}
          </span>
        )}
        {!loading && iconRight && <span className="shrink-0">{iconRight}</span>}
      </motion.button>
    );
  }
);

GlassButton.displayName = "GlassButton";
