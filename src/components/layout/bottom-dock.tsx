"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  House,
  UsersRound,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface BottomDockProps {
  activeItem?: string;
  onItemClick?: (id: string) => void;
  className?: string;
}

const items = [
  { id: "overview", label: "Overview", icon: House },
  { id: "shared_khata", label: "Khata", icon: BookOpen },
  { id: "ledgers", label: "Groups", icon: UsersRound },
];

export const BottomDock: React.FC<BottomDockProps> = ({
  activeItem = "overview",
  onItemClick,
  className,
}) => (
  <div
    className={cn(
      "fixed bottom-[calc(env(safe-area-inset-bottom)+12px)] left-1/2 z-40 w-max max-w-[calc(100vw-24px)] -translate-x-1/2 px-1",
      className
    )}
  >
    <nav
      aria-label="Main navigation"
      className="flex items-center gap-1 rounded-[22px] border border-white/[0.12] bg-slate-900/60 px-2 py-2 shadow-[0_18px_60px_rgba(0,0,0,0.38),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-2xl backdrop-saturate-150"
    >
      {items.map(({ id, label, icon: Icon }) => {
        const isActive = activeItem === id;

        return (
          <motion.button
            key={id}
            type="button"
            aria-label={label}
            aria-pressed={isActive}
            title={label}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 360, damping: 28 }}
            onClick={() => onItemClick?.(id)}
            className={cn(
              "relative flex w-[76px] shrink-0 flex-col items-center justify-center gap-1.5 rounded-[15px] px-2 py-2.5 text-center outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-blue-400/60",
              isActive
                ? "bg-blue-400/[0.12] text-blue-200"
                : "text-slate-400 hover:bg-white/[0.06] hover:text-slate-100"
            )}
          >
            <Icon
              aria-hidden="true"
              className={cn("size-[18px]", isActive && "text-blue-300")}
              strokeWidth={1.8}
            />
            <span className="w-full truncate text-[10px] font-medium leading-none tracking-normal">
              {label}
            </span>
            {isActive && (
              <motion.span
                layoutId="dock-active-indicator"
                className="absolute -bottom-1 h-1 w-1 rounded-full bg-blue-300 shadow-[0_0_8px_rgba(147,197,253,0.8)]"
                transition={{ type: "spring", stiffness: 360, damping: 30 }}
              />
            )}
          </motion.button>
        );
      })}
    </nav>
  </div>
);
