"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";

export type AmountDisplaySize = "sm" | "md" | "lg" | "xl";

export interface AmountDisplayProps {
  amount: number | string;
  currency?: string;
  subtitle?: string;
  size?: AmountDisplaySize;
  className?: string;
  animate?: boolean;
}

const sizeStyles: Record<
  AmountDisplaySize,
  { container: string; prefix: string; amount: string; subtitle: string }
> = {
  sm: {
    container: "gap-1",
    prefix: "text-base font-semibold",
    amount: "text-xl font-bold",
    subtitle: "text-xs",
  },
  md: {
    container: "gap-1.5",
    prefix: "text-xl font-semibold",
    amount: "text-3xl font-bold",
    subtitle: "text-xs",
  },
  lg: {
    container: "gap-2",
    prefix: "text-2xl font-bold",
    amount: "text-4xl font-extrabold",
    subtitle: "text-sm",
  },
  xl: {
    container: "gap-2",
    prefix: "text-3xl md:text-4xl font-bold",
    amount: "text-5xl md:text-6xl font-black tracking-tight",
    subtitle: "text-sm",
  },
};

export const AmountDisplay: React.FC<AmountDisplayProps> = ({
  amount,
  currency = "₹",
  subtitle,
  size = "xl",
  className,
  animate = true,
}) => {
  const styles = sizeStyles[size];
  const stringAmount =
    typeof amount === "number"
      ? amount.toLocaleString("en-IN", { maximumFractionDigits: 2 })
      : amount;

  return (
    <div
      className={cn(
        "inline-flex flex-col items-center justify-center select-none",
        className
      )}
    >
      <div className={cn("flex items-baseline", styles.container)}>
        <span className={cn("text-slate-400 font-sans", styles.prefix)}>
          {currency}
        </span>
        <div className="relative overflow-hidden inline-flex">
          {animate ? (
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={String(amount)}
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className={cn("text-white font-sans tabular-nums", styles.amount)}
              >
                {stringAmount}
              </motion.span>
            </AnimatePresence>
          ) : (
            <span className={cn("text-white font-sans tabular-nums", styles.amount)}>
              {stringAmount}
            </span>
          )}
        </div>
      </div>
      {subtitle && (
        <span
          className={cn(
            "text-slate-400/80 font-medium tracking-wide mt-1",
            styles.subtitle
          )}
        >
          {subtitle}
        </span>
      )}
    </div>
  );
};
