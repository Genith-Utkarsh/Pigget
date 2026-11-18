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
import { RegisterServiceWorker } from '@/components/pwa/register-service-worker';
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

  const [upiId, setUpiId] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('pigget_user_upi') || '';
    }
    return '';
  });
  const [bankAccount, setBankAccount] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('pigget_user_bank') || '';
    }
    return '';
  });
  const [isSaved, setIsSaved] = React.useState(false);

  const handleSaveWallet = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      localStorage.setItem('pigget_user_upi', upiId.trim());
      localStorage.setItem('pigget_user_bank', bankAccount.trim());
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  const handleDockItemClick = (id: string) => {
    switch (id) {
      case 'overview':
        setActiveTab('personal');
        setActiveDockModal(null);
        break;
      case 'shared_khata':
        setActiveTab('khata');
        setActiveDockModal(null);
        break;
      case 'ledgers':
        setActiveTab('split');
        setActiveDockModal(null);
        break;
      default:
        break;
    }
  };

  const currentDockActive =
    activeTab === 'khata' ? 'shared_khata' : activeTab === 'split' ? 'ledgers' : 'overview';

  return (
    <div
      data-sb-color-mode="dark"
      translate="no"
      className="rollie-theme notranslate bg-transparent text-foreground w-full min-h-[100dvh] relative transition-colors duration-1000 flex flex-col items-center overflow-x-hidden selection:bg-blue-600/30 selection:text-white"
    >
      <RegisterServiceWorker />
      {/* Animated Ambient Glow Mesh Background */}
      <AmbientBackground />

      {/* Top Header */}
      <Header
        onActivityClick={() => setIsActivityOpen(true)}
        onMenuClick={() => setIsMenuOpen(true)}
        onWalletClick={() => setIsWalletOpen(true)}
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

      {/* Secondary feature modals */}
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

      {/* Wallet Modal */}
      <FloatingModal
        isOpen={isWalletOpen}
        onClose={() => setIsWalletOpen(false)}
        title="UPI & Payment Rails"
        description="Configure your personal UPI ID for payment requests and settlement links"
        size="sm"
      >
        <form onSubmit={handleSaveWallet} className="space-y-3.5 py-2">
          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 font-medium block">
              Personal UPI ID (VPA)
            </label>
            <input
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="e.g. username@upi"
              className="w-full bg-[#17181e] text-sm text-white px-3.5 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-blue-500/50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 font-medium block">
              Bank / Account Nickname (Optional)
            </label>
            <input
              type="text"
              value={bankAccount}
              onChange={(e) => setBankAccount(e.target.value)}
              placeholder="e.g. Primary Checking"
              className="w-full bg-[#17181e] text-sm text-white px-3.5 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-blue-500/50"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors cursor-pointer"
          >
            {isSaved ? 'Saved to Local Vault ✓' : 'Save Payment Details'}
          </button>
        </form>
      </FloatingModal>
    </div>
  );
};
