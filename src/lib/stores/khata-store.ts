import { create } from 'zustand';
import { Contact } from '@/lib/types';

export interface KhataState {
  selectedContact: Contact | null;
  transactionType: 'give' | 'got' | null;
  amount: string;
  note: string;
  searchQuery: string;
  isAddContactOpen: boolean;
  isTransactionOpen: boolean;

  setSelectedContact: (contact: Contact | null) => void;
  setTransactionType: (type: 'give' | 'got' | null) => void;
  setAmount: (amount: string) => void;
  setNote: (note: string) => void;
  setSearchQuery: (query: string) => void;
  toggleAddContact: (open?: boolean) => void;
  toggleTransaction: (open?: boolean) => void;
  reset: () => void;
}

export const useKhataStore = create<KhataState>((set) => ({
  selectedContact: null,
  transactionType: null,
  amount: '',
  note: '',
  searchQuery: '',
  isAddContactOpen: false,
  isTransactionOpen: false,

  setSelectedContact: (contact) => set({ selectedContact: contact }),
  setTransactionType: (type) => set({ transactionType: type }),
  setAmount: (amount) => set({ amount }),
  setNote: (note) => set({ note }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  toggleAddContact: (open) =>
    set((state) => ({
      isAddContactOpen: open !== undefined ? open : !state.isAddContactOpen,
    })),
  toggleTransaction: (open) =>
    set((state) => ({
      isTransactionOpen: open !== undefined ? open : !state.isTransactionOpen,
    })),
  reset: () =>
    set({
      amount: '',
      note: '',
      transactionType: null,
      isTransactionOpen: false,
    }),
}));
