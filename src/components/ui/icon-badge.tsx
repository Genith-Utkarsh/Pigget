"use client";

import React from "react";
import { cn } from "@/lib/utils/cn";

export type IconBadgeSize = "sm" | "md" | "lg";

export interface IconBadgeProps {
  icon: React.ReactNode;
  gradient?: string;
  badgeColor?: string;
  badgeVisible?: boolean;
  size?: IconBadgeSize;
  className?: string;
}

const sizeConfig: Record<
  IconBadgeSize,
  { container: string; iconSize: string; dotSize: string; dotOffset: string }
> = {
  sm: {
    container: "w-8 h-8 rounded-[12px]",
    iconSize: "text-sm [&>svg]:w-4 [&>svg]:h-4",
    dotSize: "w-2.5 h-2.5 border-2",
    dotOffset: "-bottom-0.5 -right-0.5",
  },
  md: {
    container: "w-12 h-12 rounded-[18px]",
    iconSize: "text-xl [&>svg]:w-6 [&>svg]:h-6",
    dotSize: "w-3.5 h-3.5 border-2",
    dotOffset: "-bottom-1 -right-1",
  },
  lg: {
    container: "w-16 h-16 rounded-[22px]",
    iconSize: "text-2xl [&>svg]:w-8 [&>svg]:h-8",
    dotSize: "w-4 h-4 border-2",
    dotOffset: "-bottom-1 -right-1",
  },
};

export const IconBadge: React.FC<IconBadgeProps> = ({
  icon,
  gradient = "bg-gradient-to-br from-blue-600 to-indigo-600",
  badgeColor = "bg-emerald-500",
  badgeVisible = false,
  size = "md",
  className,
}) => {
  const config = sizeConfig[size];

  return (
    <div className="relative inline-flex shrink-0">
      <div
        className={cn(
          "flex items-center justify-center text-white shadow-md relative overflow-hidden select-none border border-white/10",
          gradient,
          config.container,
          config.iconSize,
          className
        )}
      >
        {typeof icon === "string" ? <span>{icon}</span> : icon}
      </div>
      {badgeVisible && (
        <span
          className={cn(
            "absolute rounded-full border-[#121317] ring-1 ring-black/40 z-10",
            badgeColor,
            config.dotSize,
            config.dotOffset
          )}
        />
      )}
    </div>
  );
};
