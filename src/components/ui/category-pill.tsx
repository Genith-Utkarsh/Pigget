"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

export interface CategoryItem {
  id: string;
  name: string;
  icon?: string;
  color?: string;
}

export interface CategoryPillProps {
  categories: CategoryItem[];
  selected?: string | null;
  onSelect: (id: string) => void;
  layout?: "grid" | "inline";
  className?: string;
}

export const CategoryPill: React.FC<CategoryPillProps> = ({
  categories,
  selected,
  onSelect,
  layout = "inline",
  className,
}) => {
  return (
    <div
      className={cn(
        layout === "grid"
          ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2"
          : "flex flex-wrap gap-2",
        className
      )}
    >
      {categories.map((cat) => {
        const isSelected = selected === cat.id;

        return (
          <motion.button
            key={cat.id}
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={() => onSelect(cat.id)}
            className={cn(
              "inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-150 border select-none cursor-pointer text-left",
              isSelected
                ? "bg-blue-600/20 border-blue-500 text-white shadow-sm shadow-blue-500/25"
                : "bg-[#17181e]/80 border-white/[0.06] text-slate-400 hover:text-slate-200 hover:bg-[#20222a]/90 hover:border-white/10"
            )}
          >
            {cat.icon && (
              <span className="text-base shrink-0 leading-none">{cat.icon}</span>
            )}
            <span className="truncate">{cat.name}</span>
          </motion.button>
        );
      })}
    </div>
  );
};
