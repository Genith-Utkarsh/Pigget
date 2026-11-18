"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

export interface PillTab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

export interface PillToggleProps {
  tabs: PillTab[];
  activeTab: string;
  onTabChange: (id: string) => void;
  className?: string;
}

export const PillToggle: React.FC<PillToggleProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className,
}) => {
  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex max-w-full items-center overflow-x-auto scrollbar-hidden bg-[#121318]/90 backdrop-blur-2xl border border-white/10 rounded-[24px] p-1.5 shadow-card-specular relative",
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <motion.button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 450, damping: 25 }}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "relative shrink-0 rounded-[18px] px-2.5 py-2 text-xs font-medium transition-colors duration-200 flex items-center gap-1.5 select-none z-10 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50 sm:px-4 sm:text-sm sm:gap-2",
              isActive ? "text-white" : "text-slate-400 hover:text-slate-200"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="active-pill-indicator"
                className="absolute inset-0 bg-blue-600 rounded-[18px] shadow-lg shadow-blue-600/30"
                transition={{ type: "spring", stiffness: 450, damping: 35 }}
                style={{ zIndex: -1 }}
              />
            )}
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={cn(
                  "text-[10px] font-bold px-1.5 py-0.5 rounded-full transition-colors",
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-white/10 text-slate-400"
                )}
              >
                {tab.badge}
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
};
