'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowDownToLine,
  ChevronRight,
  CircleHelp,
  Layers,
  ScanLine,
  Shield,
  TrendingUp,
  X,
} from 'lucide-react';
import { useExpenseStore } from '@/lib/stores/expense-store';

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MenuModal: React.FC<MenuModalProps> = ({ isOpen, onClose }) => {
  const { setActiveDockModal } = useExpenseStore();
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(() => {
    if (typeof window === 'undefined') return false;
    const displayMode = window.matchMedia('(display-mode: standalone)');
    const standaloneOnIOS = (navigator as Navigator & { standalone?: boolean }).standalone;
    return displayMode.matches || standaloneOnIOS === true;
  });
  const [isIOS] = useState(() => {
    if (typeof window === 'undefined') return false;
    return (
      /iPhone|iPad|iPod/i.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    );
  });
  const [showInstallHelp, setShowInstallHelp] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
    };
    const handleInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
      setShowInstallHelp(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  const installPigget = async () => {
    if (!installPrompt) {
      setShowInstallHelp(true);
      return;
    }

    try {
      await installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      if (choice.outcome === 'accepted') setIsInstalled(true);
    } catch {
      setShowInstallHelp(true);
    } finally {
      setInstallPrompt(null);
    }
  };

  const actions = [
    {
      id: 'vault',
      title: 'Security & Vault',
      description: 'Manage local backups and privacy settings',
      icon: Shield,
      onClick: () => setActiveDockModal('vault'),
    },
    {
      id: 'categories',
      title: 'Categories & Caps',
      description: 'Manage spending categories and limits',
      icon: Layers,
      onClick: () => setActiveDockModal('categories'),
    },
    {
      id: 'reports',
      title: 'Insights & Trends',
      description: 'Review spending charts and summaries',
      icon: TrendingUp,
      onClick: () => setActiveDockModal('reports'),
    },
    {
      id: 'scan-pay',
      title: 'Scan & Pay',
      description: 'Open payment QR and quick payment tools',
      icon: ScanLine,
      onClick: () => setActiveDockModal('scan_pay'),
    },
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="safe-modal-frame fixed inset-0 z-50 flex items-end justify-center p-3 sm:items-center sm:p-4">
        <motion.button
          type="button"
          aria-label="Close menu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="sb-modal-backdrop fixed inset-0 cursor-default"
        />

        <motion.section
          role="dialog"
          aria-modal="true"
          aria-labelledby="menu-title"
          initial={{ opacity: 0, y: 16, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.99 }}
          transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          className="sb-modal-glass relative z-10 flex max-h-[calc(100dvh-24px)] w-full max-w-2xl flex-col overflow-y-auto rounded-[26px] p-4 sm:rounded-[30px] sm:p-6"
        >
          <div className="mb-4 flex items-start justify-between gap-4 border-b border-white/[0.08] pb-4 sm:mb-5">
            <div className="min-w-0">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-300/80">
                Pigget
              </p>
              <h2 id="menu-title" className="text-lg font-semibold leading-tight text-white sm:text-xl">
                Menu
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-slate-400">
                Shortcuts and app settings
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-slate-300 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
            >
              <X aria-hidden="true" className="size-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
            {actions.map(({ id, title, description, icon: Icon, onClick }, index) => (
              <motion.button
                key={id}
                type="button"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.035, duration: 0.22 }}
                onClick={() => {
                  onClose();
                  onClick();
                }}
                className="group flex min-h-[68px] w-full items-center gap-3 rounded-2xl border border-white/[0.08] bg-slate-950/20 p-3 text-left transition-colors hover:border-blue-300/25 hover:bg-blue-400/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
              >
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-blue-300/15 bg-blue-400/[0.08] text-blue-200">
                  <Icon aria-hidden="true" className="size-[18px]" strokeWidth={1.8} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium leading-tight text-slate-100">
                    {title}
                  </span>
                  <span className="mt-1 block line-clamp-2 text-[11px] leading-snug text-slate-400">
                    {description}
                  </span>
                </span>
                <ChevronRight aria-hidden="true" className="size-4 shrink-0 text-slate-500 transition-transform group-hover:translate-x-0.5 group-hover:text-blue-200" />
              </motion.button>
            ))}

            {!isInstalled && (
              <motion.button
                type="button"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: actions.length * 0.035, duration: 0.22 }}
                onClick={installPigget}
                className="group flex min-h-[68px] w-full items-center gap-3 rounded-2xl border border-blue-300/20 bg-blue-400/[0.07] p-3 text-left transition-colors hover:border-blue-200/40 hover:bg-blue-400/[0.12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
              >
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-blue-300/20 bg-blue-400/[0.12] text-blue-200">
                  <ArrowDownToLine aria-hidden="true" className="size-[18px]" strokeWidth={1.8} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium leading-tight text-white">
                    Install Pigget
                  </span>
                  <span className="mt-1 block text-[11px] leading-snug text-slate-300">
                    Add the app to your home screen
                  </span>
                </span>
                <ChevronRight aria-hidden="true" className="size-4 shrink-0 text-blue-200 transition-transform group-hover:translate-x-0.5" />
              </motion.button>
            )}
          </div>

          {showInstallHelp && !isInstalled && (
            <div
              role="status"
              className="mt-3 flex items-start gap-2 rounded-xl border border-blue-300/15 bg-blue-400/[0.07] p-3 text-xs leading-relaxed text-slate-200"
            >
              <CircleHelp aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-blue-200" />
              <span>
                {isIOS
                  ? 'In Safari, tap Share, then choose “Add to Home Screen.”'
                  : 'Open your browser menu and choose “Install app” or “Add to Home Screen.”'}
              </span>
            </div>
          )}
        </motion.section>
      </div>
    </AnimatePresence>
  );
};
