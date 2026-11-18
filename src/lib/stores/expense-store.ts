import { create } from 'zustand';

export type DockModalType =
  | 'categories'
  | 'scan_pay'
  | 'reports'
  | 'vault'
  | null;

export interface ExpenseState {
  activeTab: 'personal' | 'split' | 'khata';
  selectedCategory: string | null;
  amount: string;
  note: string;
  currency: string;
  paymentMethod: string;
  isAddExpenseOpen: boolean;
  isReviewOpen: boolean;
  activeDockModal: DockModalType;
  isActivityOpen: boolean;
  isMenuOpen: boolean;
  isWalletOpen: boolean;

  // actions
  setActiveTab: (tab: 'personal' | 'split' | 'khata') => void;
  setAmount: (amount: string) => void;
  setNote: (note: string) => void;
  setCategory: (category: string | null) => void;
  setCurrency: (currency: string) => void;
  setPaymentMethod: (method: string) => void;
  toggleAddExpense: (open?: boolean) => void;
  toggleReview: (open?: boolean) => void;
  setActiveDockModal: (modal: DockModalType) => void;
  setIsActivityOpen: (open: boolean) => void;
  setIsMenuOpen: (open: boolean) => void;
  setIsWalletOpen: (open: boolean) => void;
  reset: () => void;
}

export const useExpenseStore = create<ExpenseState>((set) => ({
  activeTab: 'personal',
  selectedCategory: 'cat-food',
  amount: '',
  note: '',
  currency: 'INR',
  paymentMethod: 'Instant UPI',
  isAddExpenseOpen: false,
  isReviewOpen: false,
  activeDockModal: null,
  isActivityOpen: false,
  isMenuOpen: false,
  isWalletOpen: false,

  setActiveTab: (tab) => set({ activeTab: tab }),
  setAmount: (amount) => set({ amount }),
  setNote: (note) => set({ note }),
  setCategory: (category) => set({ selectedCategory: category }),
  setCurrency: (currency) => set({ currency }),
  setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
  toggleAddExpense: (open) =>
    set((state) => ({
      isAddExpenseOpen: open !== undefined ? open : !state.isAddExpenseOpen,
    })),
  toggleReview: (open) =>
    set((state) => ({
      isReviewOpen: open !== undefined ? open : !state.isReviewOpen,
    })),
  setActiveDockModal: (modal) => set({ activeDockModal: modal }),
  setIsActivityOpen: (open) => set({ isActivityOpen: open }),
  setIsMenuOpen: (open) => set({ isMenuOpen: open }),
  setIsWalletOpen: (open) => set({ isWalletOpen: open }),
  reset: () =>
    set({
      amount: '',
      note: '',
      selectedCategory: 'cat-food',
      isReviewOpen: false,
    }),
}));
