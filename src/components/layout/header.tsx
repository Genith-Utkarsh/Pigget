'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { History, Menu, WalletCards } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export interface HeaderProps {
  className?: string;
  onActivityClick?: () => void;
  onWalletClick?: () => void;
  onMenuClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  className,
  onActivityClick,
  onWalletClick,
  onMenuClick,
}) => (
  <header
    className={cn(
      'relative z-30 mx-auto flex w-full max-w-5xl select-none items-center justify-between px-4 pb-4 pt-[calc(env(safe-area-inset-top)+1rem)] sm:px-6 sm:py-6',
      className
    )}
  >
    <div className="flex items-center gap-2.5">
      <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-[13px] border border-white/10 bg-slate-900/70 shadow-lg shadow-black/20">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://imgh.in/host/upjl0o"
          alt="Pigget logo"
          className="size-full object-contain p-0.5"
          loading="eager"
        />
      </div>
      <span className="font-heading text-xl font-bold tracking-tight text-white sm:text-2xl">
        pigget
      </span>
    </div>

    <div className="flex items-center gap-2">
      <motion.button
        type="button"
        onClick={onActivityClick}
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 360, damping: 28 }}
        className="sb-button-floating inline-flex h-10 items-center justify-center gap-2 rounded-full px-3 text-sm font-medium leading-none text-slate-200 outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 sm:px-4"
      >
        <span>Activity</span>
        <History aria-hidden="true" className="size-[17px] shrink-0" strokeWidth={1.8} />
      </motion.button>

      <motion.button
        type="button"
        onClick={onWalletClick}
        aria-label="Wallet status"
        title="Wallet status"
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 360, damping: 28 }}
        className="sb-button-floating inline-flex size-10 shrink-0 items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
      >
        <WalletCards aria-hidden="true" className="size-[18px]" strokeWidth={1.8} />
      </motion.button>

      <motion.button
        type="button"
        onClick={onMenuClick}
        aria-label="Open navigation menu"
        title="Menu"
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 360, damping: 28 }}
        className="sb-button-floating inline-flex size-10 shrink-0 items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
      >
        <Menu aria-hidden="true" className="size-[18px]" strokeWidth={1.8} />
      </motion.button>
    </div>
  </header>
);
