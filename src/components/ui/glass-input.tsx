"use client";

import React, { forwardRef } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type GlassInputVariant = "amount" | "text" | "search";

export interface GlassInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "prefix"> {
  variant?: GlassInputVariant;
  label?: string;
  helperText?: string;
  error?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  containerClassName?: string;
}

export const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  (
    {
      variant = "text",
      label,
      helperText,
      error,
      prefix,
      suffix,
      className,
      containerClassName,
      disabled,
      ...props
    },
    ref
  ) => {
    if (variant === "amount") {
      return (
        <div className={cn("w-full flex flex-col items-center", containerClassName)}>
          {label && (
            <label className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-2">
              {label}
            </label>
          )}
          <div className="relative flex items-center justify-center w-full">
            {prefix && (
              <span className="text-3xl md:text-5xl font-bold text-slate-400 mr-1 select-none">
                {prefix}
              </span>
            )}
            <input
              ref={ref}
              disabled={disabled}
              className={cn(
                "bg-transparent text-white text-4xl md:text-5xl font-bold tracking-tight text-center focus:outline-none placeholder-slate-600 max-w-full w-full",
                disabled && "opacity-50 cursor-not-allowed",
                className
              )}
              {...props}
            />
            {suffix && (
              <span className="text-lg font-medium text-slate-400 ml-2 select-none">
                {suffix}
              </span>
            )}
          </div>
          {error && <p className="text-xs text-red-400 mt-1.5">{error}</p>}
          {helperText && !error && (
            <p className="text-xs text-slate-500 mt-1.5">{helperText}</p>
          )}
        </div>
      );
    }

    return (
      <div className={cn("w-full flex flex-col gap-1.5", containerClassName)}>
        {label && (
          <label className="text-xs font-medium text-slate-300 select-none">
            {label}
          </label>
        )}
        <div
          className={cn(
            "relative flex items-center rounded-xl bg-[#181920]/60 border border-white/5 transition-all duration-200 focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/20",
            error && "border-red-500/50 focus-within:border-red-500",
            disabled && "opacity-50 cursor-not-allowed bg-[#181920]/30"
          )}
        >
          {variant === "search" && !prefix && (
            <div className="pl-3.5 pr-1 text-slate-500 shrink-0">
              <Search className="w-4 h-4" />
            </div>
          )}
          {prefix && (
            <div className="pl-3.5 pr-1 text-slate-400 shrink-0 select-none text-sm">
              {prefix}
            </div>
          )}
          <input
            ref={ref}
            disabled={disabled}
            className={cn(
              "w-full bg-transparent px-3.5 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none",
              (prefix || variant === "search") && "pl-2",
              suffix && "pr-2",
              className
            )}
            {...props}
          />
          {suffix && (
            <div className="pr-3.5 pl-1 text-slate-400 shrink-0 text-sm">
              {suffix}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-red-400">{error}</p>}
        {helperText && !error && (
          <p className="text-xs text-slate-500">{helperText}</p>
        )}
      </div>
    );
  }
);

GlassInput.displayName = "GlassInput";
