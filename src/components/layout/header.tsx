"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Wallet,
  Globe,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface HeaderProps {
  className?: string;
  onActivityClick?: () => void;
  onCurrencyClick?: () => void;
  onWalletClick?: () => void;
  onGlobeClick?: () => void;
  onMenuClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  className,
  onActivityClick,
  onCurrencyClick,
  onWalletClick,
  onGlobeClick,
  onMenuClick,
}) => {
  const [currency] = useState("₹ INR");

  return (
    <header
      className={cn(
        "w-full max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between z-30 select-none relative",
        className
      )}
    >
      {/* Brand Logo & Khata Badge */}
      <div className="flex items-center gap-3">
        <motion.div
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="flex items-center gap-2.5 cursor-pointer"
        >
          {/* Custom Pigget Logo provided by user */}
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-[13px] bg-[#121317] border border-white/10 flex items-center justify-center overflow-hidden shadow-lg shadow-black/40 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://imgh.in/host/upjl0o"
              alt="Pigget Logo"
              className="w-full h-full object-contain p-0.5"
              loading="eager"
            />
          </div>
          <span className="text-[17px] sm:text-xl font-bold tracking-tight text-white font-sans flex items-center gap-1.5">
            pigget
          </span>
        </motion.div>

        {/* Khata Pill Badge */}
        <div className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20 shadow-sm">
          <Sparkles className="w-3 h-3 text-blue-400" />
          <span>Khata</span>
        </div>
      </div>

      {/* Top Right Utility Navigation Group */}
      <div className="flex items-center gap-2">
        {/* Activity Button (Superbridge Signature Activity Button & Clock Radar SVG) */}
        <button
          type="button"
          tabIndex={0}
          onClick={onActivityClick}
          className="font-button cursor-pointer inline-flex items-center justify-center shrink-0 ring-offset-background focus-visible:outline-hidden focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 sb-button-floating text-slate-100 hover:text-white bg-[#17181e]/90 hover:bg-[#20222a] border border-white/10 px-3.5 sm:px-4 py-1.5 text-xs sm:text-sm pl-4 pr-3 h-9 sm:h-10 gap-2 overflow-hidden transition-all duration-200 shadow-sm active:scale-95"
          style={{ borderRadius: "500px" }}
          aria-label="Open Activity"
        >
          <span className="whitespace-nowrap font-medium">Activity</span>
          <span className="flex shrink-0">
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 sm:h-5 sm:w-5 fill-slate-300"
            >
              <path d="M4.00009 24.0001C4.00009 12.9544 12.9542 4.00025 23.9998 4.00015C35.0455 4.00015 43.9997 12.9543 43.9997 23.9999C43.9997 35.0456 35.0457 43.9998 24 43.9998C12.9543 43.9998 4.00011 35.0458 4.00009 24.0001ZM31.9189 28.3758C31.6427 28.8541 31.8066 29.4657 32.2849 29.7418L34.0169 30.7418C34.4952 31.0177 35.1069 30.854 35.383 30.3758C35.659 29.8976 35.495 29.286 35.0169 29.0098L33.2849 28.0098C32.8066 27.7336 32.195 27.8975 31.9189 28.3758ZM34.6915 23.1262C34.1394 23.1262 33.6919 23.5733 33.6917 24.1254C33.6918 24.6776 34.1396 25.1256 34.6918 25.1256L36.6921 25.1258C37.244 25.1254 37.6914 24.6772 37.6915 24.1253C37.6913 23.5734 37.2437 23.1266 36.6918 23.1263L34.6915 23.1262ZM28.4419 31.8532C27.9636 32.1293 27.7998 32.7412 28.0759 33.2194L29.0754 34.9512C29.3516 35.4293 29.9635 35.5932 30.4417 35.3172C30.9198 35.041 31.0835 34.4291 30.8076 33.9509L29.8082 32.2191C29.5321 31.7409 28.9201 31.5772 28.4419 31.8532ZM32.9683 17.6929C32.4901 17.969 32.3255 18.5804 32.6015 19.0587C32.8777 19.5368 33.4895 19.7007 33.9678 19.4246L35.7 18.4243C36.1779 18.1481 36.3413 17.537 36.0655 17.0589C35.7894 16.5809 35.1787 16.417 34.7005 16.6926L32.9683 17.6929ZM23.6915 33.126C23.1393 33.1261 22.6912 33.5739 22.6912 34.1261L22.6915 36.1256C22.6916 36.6778 23.1394 37.1258 23.6916 37.1258C24.2437 37.1257 24.6917 36.6779 24.6918 36.1258L24.6915 34.1263C24.6915 33.5741 24.2436 33.1262 23.6915 33.126ZM24 9.49977C23.1719 9.49989 22.5006 10.1715 22.5003 10.9997L22.5 22.5003L18.0005 22.5006C17.1722 22.5006 16.5 23.1716 16.5 24C16.5001 24.8284 17.1724 25.5002 18.0008 25.5002L24 25.4998L24.1532 25.4924C24.9095 25.4157 25.5004 24.7769 25.5006 24.0004L25.5008 11C25.5007 10.1717 24.8283 9.49992 24 9.49977ZM16.7586 34.6341C16.4825 35.1124 16.6463 35.724 17.1246 36.0001C17.6029 36.2761 18.2146 36.1123 18.4907 35.6341L19.4907 33.9021C19.7667 33.4239 19.6027 32.8122 19.1246 32.536C18.6463 32.2599 18.0347 32.4238 17.7586 32.9021L16.7586 34.6341ZM28.7586 13.8495C28.4825 14.3278 28.6463 14.9394 29.1246 15.2155C29.6029 15.4914 30.2146 15.3277 30.4907 14.8495L31.4907 13.1174C31.7667 12.6392 31.6027 12.0276 31.1246 11.7514C30.6463 11.4753 30.0347 11.6392 29.7586 12.1174L28.7586 13.8495ZM12.1834 29.6934C11.7054 29.9695 11.5413 30.5801 11.8171 31.0583C12.0932 31.5363 12.7047 31.7008 13.1829 31.4251L14.9151 30.4248C15.3932 30.1486 15.557 29.5367 15.2811 29.0585C15.0049 28.5806 14.3938 28.4172 13.9156 28.693L12.1834 29.6934ZM16.9416 11.9344C16.4633 12.2106 16.2995 12.8224 16.5756 13.3007L17.5751 15.0324C17.8513 15.5105 18.4632 15.6744 18.9414 15.3984C19.4195 15.1223 19.5832 14.5103 19.3073 14.0321L18.3078 12.3004C18.0317 11.8221 17.4198 11.6584 16.9416 11.9344ZM10.691 23.1259C10.1391 23.1262 9.69219 23.5736 9.6921 24.1256C9.69219 24.6777 10.1392 25.1252 10.6913 25.1254L12.6916 25.1255C13.2437 25.1254 13.6918 24.6776 13.6919 24.1255C13.6917 23.5734 13.2434 23.1262 12.6913 23.1261L10.691 23.1259ZM12.0003 16.8758C11.7241 17.3541 11.888 17.9657 12.3663 18.2418L14.0983 19.2418C14.5766 19.5177 15.1883 19.354 15.4644 18.8758C15.7405 18.3976 15.5764 17.786 15.0983 17.5098L13.3663 16.5098C12.888 16.2336 12.2764 16.3975 12.0003 16.8758Z" />
            </svg>
          </span>
        </button>

        {/* Currency Switcher Pill */}
        <button
          type="button"
          onClick={onCurrencyClick}
          className="flex items-center gap-1.5 bg-[#17181e]/90 hover:bg-[#20222a] border border-white/10 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <span>{currency}</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </button>

        {/* Wallet / Accounts Connected Pill */}
        <button
          type="button"
          aria-label="Wallet Status"
          onClick={onWalletClick}
          className="w-8 h-8 rounded-full bg-[#17181e]/90 hover:bg-[#20222a] border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <Wallet className="w-3.5 h-3.5" />
        </button>

        {/* Region / Network Pill */}
        <button
          type="button"
          aria-label="Language & Region"
          onClick={onGlobeClick}
          className="w-8 h-8 rounded-full bg-[#17181e]/90 hover:bg-[#20222a] border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <Globe className="w-3.5 h-3.5" />
        </button>

        {/* Hamburger Menu Icon */}
        <button
          type="button"
          aria-label="App Menu"
          onClick={onMenuClick}
          className="w-8 h-8 rounded-full bg-[#17181e]/90 hover:bg-[#20222a] border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <line x1="4" x2="20" y1="8" y2="8" />
            <line x1="4" x2="20" y1="16" y2="16" />
          </svg>
        </button>
      </div>
    </header>
  );
};
