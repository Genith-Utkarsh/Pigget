'use client';

import React from 'react';
import { Header } from './header';
import { BottomDock } from './bottom-dock';
import { AmbientBackground } from '@/components/ui/ambient-background';
import { FloatingModal } from '@/components/ui/floating-modal';
import { ActivityModal } from './activity-modal';
import { MenuModal } from './menu-modal';
import { CategoriesModal } from './categories-modal';
import { ScanPayModal } from './scan-pay-modal';
import { ReportsModal } from './reports-modal';
import { VaultModal } from './vault-modal';
import { MoreToolsModal } from './more-tools-modal';
import { useExpenseStore } from '@/lib/stores/expense-store';

export interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const {
    activeTab,
    setActiveTab,
    activeDockModal,
    setActiveDockModal,
    isActivityOpen,
    setIsActivityOpen,
    isMenuOpen,
    setIsMenuOpen,
    isWalletOpen,
    setIsWalletOpen,
  } = useExpenseStore();

  const handleDockItemClick = (id: string) => {
    switch (id) {
      case 'overview':
        setActiveTab('personal');
        setActiveDockModal(null);
        break;
      case 'categories':
        setActiveDockModal('categories');
        break;
      case 'scan_pay':
        setActiveDockModal('scan_pay');
        break;
      case 'shared_khata':
        setActiveTab('khata');
        setActiveDockModal(null);
        break;
      case 'ledgers':
        setActiveTab('split');
        setActiveDockModal(null);
        break;
      case 'reports':
        setActiveDockModal('reports');
        break;
      case 'vault':
        setActiveDockModal('vault');
        break;
      case 'more_tools':
        setActiveDockModal('more_tools');
        break;
      default:
        break;
    }
  };

  // Determine which dock item is visually active
  let currentDockActive = 'overview';
  if (activeDockModal) {
    currentDockActive = activeDockModal;
  } else if (activeTab === 'khata') {
    currentDockActive = 'shared_khata';
  } else if (activeTab === 'split') {
    currentDockActive = 'ledgers';
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-[#08090d] text-slate-100 overflow-x-hidden selection:bg-blue-600/30 selection:text-white">
      {/* Animated Ambient Glow Mesh Background */}
      <AmbientBackground />

      {/* Top Header */}
      <Header
        onActivityClick={() => setIsActivityOpen(true)}
        onMenuClick={() => setIsMenuOpen(true)}
        onWalletClick={() => setIsWalletOpen(true)}
        onGlobeClick={() => setActiveDockModal('more_tools')}
        onCurrencyClick={() => setActiveDockModal('more_tools')}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-start w-full max-w-5xl mx-auto px-4 pt-2 pb-28 relative z-10">
        {/* Luminous centered blue glow behind main cards */}
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] sm:w-[520px] h-[380px] sm:h-[520px] bg-blue-600/15 rounded-full blur-[110px] pointer-events-none -z-10"
          aria-hidden="true"
        />

        {children}
      </main>

      {/* Floating Bottom Navigation Dock */}
      <BottomDock
        activeItem={currentDockActive}
        onItemClick={handleDockItemClick}
      />

      {/* Superbridge Activity Modal */}
      <ActivityModal
        isOpen={isActivityOpen}
        onClose={() => setIsActivityOpen(false)}
      />

      {/* Superbridge Hamburger Settings / Identity Overlay */}
      <MenuModal
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />

      {/* Dock Modals for All 8 Features */}
      <CategoriesModal
        isOpen={activeDockModal === 'categories'}
        onClose={() => setActiveDockModal(null)}
      />

      <ScanPayModal
        isOpen={activeDockModal === 'scan_pay'}
        onClose={() => setActiveDockModal(null)}
      />

      <ReportsModal
        isOpen={activeDockModal === 'reports'}
        onClose={() => setActiveDockModal(null)}
      />

      <VaultModal
        isOpen={activeDockModal === 'vault'}
        onClose={() => setActiveDockModal(null)}
      />

      <MoreToolsModal
        isOpen={activeDockModal === 'more_tools'}
        onClose={() => setActiveDockModal(null)}
      />

      {/* Wallet Modal */}
      <FloatingModal
        isOpen={isWalletOpen}
        onClose={() => setIsWalletOpen(false)}
        title="Primary UPI & Connected Accounts"
        description="Encrypted banking rails linked for instant reconciliation"
        size="sm"
      >
        <div className="space-y-3 py-2">
          <div className="p-4 rounded-2xl bg-[#17181e]/90 border border-white/5 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium">Default Account</p>
              <p className="text-sm font-semibold text-white">HDFC Bank •• 4092</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
              Active
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-[#17181e]/90 border border-white/5 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium">Primary UPI VPA</p>
              <p className="text-sm font-semibold text-white">pigget@hdfc</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">
              Verified
            </span>
          </div>
        </div>
      </FloatingModal>
    </div>
  );
};
