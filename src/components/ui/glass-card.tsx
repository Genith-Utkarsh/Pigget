"use client";

import React, { forwardRef } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils/cn";

export type GlassCardVariant = "primary" | "secondary" | "minimal";

export interface GlassCardProps extends HTMLMotionProps<"div"> {
  variant?: GlassCardVariant;
  className?: string;
  children?: React.ReactNode;
  as?: React.ElementType;
}

const variantStyles: Record<GlassCardVariant, string> = {
  primary:
    "bg-[#121317]/90 backdrop-blur-2xl border border-white/[0.09] rounded-[30px] shadow-card-specular",
  secondary:
    "bg-[#17181e]/95 border border-white/[0.06] rounded-[22px] shadow-subtle-inner",
  minimal:
    "bg-white/[0.02] border border-white/[0.04] rounded-2xl backdrop-blur-md",
};

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      variant = "primary",
      className,
      children,
      as = "div",
      initial = { opacity: 0, scale: 0.98, y: 8 },
      animate = { opacity: 1, scale: 1, y: 0 },
      transition = { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
      ...props
    },
    ref
  ) => {
    const Component = motion.create(as);

    return (
      <Component
        ref={ref}
        initial={initial}
        animate={animate}
        transition={transition}
        className={cn(
          "relative overflow-hidden transition-all duration-200",
          variantStyles[variant],
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

GlassCard.displayName = "GlassCard";
