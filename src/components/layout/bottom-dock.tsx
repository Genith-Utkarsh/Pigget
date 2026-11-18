"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Globe,
  Layers,
  UserPlus,
  BookOpen,
  TrendingUp,
  Lock,
  QrCode,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface BottomDockProps {
  activeItem?: string;
  onItemClick?: (id: string) => void;
  className?: string;
}

interface DockItemConfig {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  badgeColor?: string;
  customButton?: boolean;
  colorClass?: string;
}

export const BottomDock: React.FC<BottomDockProps> = ({
  activeItem = "overview",
  onItemClick,
  className,
}) => {
  const items: DockItemConfig[] = [
    {
      id: "overview",
      label: "Overview",
      icon: <Globe className="w-5 h-5 text-slate-300" />,
      colorClass: "text-slate-200",
    },
    {
      id: "categories",
      label: "Categories",
      icon: <Layers className="w-5 h-5 text-purple-400" />,
      colorClass: "text-purple-400",
    },
    {
      id: "scan_pay",
      label: "Quick Scan & Pay",
      customButton: true,
      icon: (
        <div className="w-10 h-10 rounded-[14px] bg-gradient-to-tr from-blue-600 via-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/40 border border-white/20">
          <QrCode className="w-5 h-5" />
        </div>
      ),
    },
    {
      id: "shared_khata",
      label: "Shared Khata",
      icon: <UserPlus className="w-5 h-5 text-[#cbf33e]" />,
      badge: "New",
      badgeColor: "bg-black text-[#cbf33e] border border-[#cbf33e]/50",
      colorClass: "text-[#cbf33e]",
    },
    {
      id: "ledgers",
      label: "Group Ledgers",
      icon: <BookOpen className="w-5 h-5 text-blue-400" />,
      badge: "Split",
      badgeColor: "bg-black text-blue-400 border border-blue-500/50",
      colorClass: "text-blue-400",
    },
    {
      id: "reports",
      label: "Reports & Insights",
      icon: <TrendingUp className="w-5 h-5 text-emerald-400" />,
      colorClass: "text-emerald-400",
    },
    {
      id: "vault",
      label: "Privacy Vault",
      icon: <Lock className="w-5 h-5 text-sky-400" />,
      colorClass: "text-sky-400",
    },
    {
      id: "more_tools",
      label: "More Tools",
      icon: (
        <div className="grid grid-cols-2 gap-1 p-0.5">
          <span className="w-1.5 h-1.5 rounded-sm bg-rose-400" />
          <span className="w-1.5 h-1.5 rounded-sm bg-blue-400" />
          <span className="w-1.5 h-1.5 rounded-sm bg-emerald-400" />
          <span className="w-1.5 h-1.5 rounded-sm bg-amber-400" />
        </div>
      ),
      colorClass: "text-slate-300",
    },
  ];

  return (
    <div
      className={cn(
        "fixed bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-[95vw] px-2",
        className
      )}
    >
      <nav
        aria-label="Bottom Navigation Dock"
        className="flex items-center gap-1 sm:gap-2 px-3 py-2 bg-[#121318]/90 backdrop-blur-2xl border border-white/10 rounded-[24px] shadow-2xl shadow-black/80 overflow-x-auto scrollbar-hidden"
      >
        {items.map((item) => {
          const isActive = activeItem === item.id;

          if (item.customButton) {
            return (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: "spring", stiffness: 450, damping: 25 }}
                onClick={() => onItemClick?.(item.id)}
                className="relative mx-1 shrink-0 flex flex-col items-center justify-center cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50"
                title={item.label}
              >
                {item.icon}
              </motion.button>
            );
          }

          return (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: "spring", stiffness: 450, damping: 25 }}
              onClick={() => onItemClick?.(item.id)}
              className={cn(
                "relative p-2.5 rounded-[18px] flex flex-col items-center justify-center shrink-0 transition-colors duration-150 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50 group",
                isActive
                  ? "bg-white/[0.08] text-white"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
              )}
              title={item.label}
            >
              {/* Badge */}
              {item.badge && (
                <span
                  className={cn(
                    "absolute -top-1.5 -right-1 text-[8px] font-black uppercase px-1 py-0.2 rounded-full pointer-events-none select-none",
                    item.badgeColor || "bg-blue-600 text-white"
                  )}
                >
                  {item.badge}
                </span>
              )}

              {/* Icon */}
              <div className="flex items-center justify-center">{item.icon}</div>

              {/* Active dot indicator underneath */}
              {isActive && (
                <motion.span
                  layoutId="dock-active-dot"
                  className="absolute -bottom-1 w-1 h-1 bg-white rounded-full shadow-sm"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </nav>
    </div>
  );
};
