'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Transaction, TransactionType } from '@/lib/types';

const STORAGE_KEY = 'pigget_transactions_v3';

function getInitialTransactions(): Transaction[] {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to read transactions from localStorage', e);
  }
  return [];
}

let localTransactions: Transaction[] = getInitialTransactions();

function saveTransactions(txs: Transaction[]) {
  localTransactions = txs;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(txs));
    } catch (e) {
      console.error('Failed to save transactions to localStorage', e);
    }
  }
}

export interface TransactionFilters {
  type?: TransactionType | 'ALL';
  groupId?: string;
  contactId?: string;
  category?: string;
  search?: string;
}

export function useTransactions(filters?: TransactionFilters) {
  return useQuery<Transaction[]>({
    queryKey: ['transactions', filters],
    queryFn: async () => {
      // Re-hydrate from storage if in browser
      if (typeof window !== 'undefined') {
        const stored = getInitialTransactions();
        localTransactions = stored;
      }

      let result = [...localTransactions];

      if (filters?.type && filters.type !== 'ALL') {
        result = result.filter((t) => t.type === filters.type);
      }
      if (filters?.groupId) {
        result = result.filter((t) => t.groupId === filters.groupId);
      }
      if (filters?.contactId) {
        result = result.filter((t) => t.contactId === filters.contactId);
      }
      if (filters?.category && filters.category !== 'ALL') {
        result = result.filter((t) => t.category === filters.category);
      }
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        result = result.filter(
          (t) =>
            t.title.toLowerCase().includes(q) ||
            t.notes?.toLowerCase().includes(q) ||
            t.category?.toLowerCase().includes(q)
        );
      }

      // Sort newest first
      return result.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    },
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      newTx: Omit<Transaction, 'id' | 'createdAt'> & { id?: string; createdAt?: string }
    ) => {
      const created: Transaction = {
        ...newTx,
        id: newTx.id || `tx-${Date.now()}`,
        createdAt: newTx.createdAt || new Date().toISOString(),
      };
      saveTransactions([created, ...localTransactions]);
      return created;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<Transaction>;
    }) => {
      const updatedList = localTransactions.map((tx) =>
        tx.id === id ? { ...tx, ...updates } : tx
      );
      saveTransactions(updatedList);
      const updated = updatedList.find((tx) => tx.id === id);
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const filtered = localTransactions.filter((tx) => tx.id !== id);
      saveTransactions(filtered);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });
}

export function useResetTransactions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      saveTransactions([]);
      return [];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });
}
