'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Contact } from '@/lib/types';

const STORAGE_KEY = 'pigget_contacts_v3';

function getInitialContacts(): Contact[] {
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
    console.error('Failed to read contacts from localStorage', e);
  }
  return [];
}

let localContacts: Contact[] = getInitialContacts();

function saveContacts(contacts: Contact[]) {
  localContacts = contacts;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
    } catch (e) {
      console.error('Failed to save contacts to localStorage', e);
    }
  }
}

export function useContacts(searchQuery?: string) {
  return useQuery<Contact[]>({
    queryKey: ['contacts', searchQuery],
    queryFn: async () => {
      if (typeof window !== 'undefined') {
        localContacts = getInitialContacts();
      }
      let result = [...localContacts];

      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        result = result.filter(
          (c) =>
            c.contactName.toLowerCase().includes(q) ||
            c.contactPhone?.toLowerCase().includes(q) ||
            c.contactEmail?.toLowerCase().includes(q)
        );
      }

      return result.sort((a, b) => a.contactName.localeCompare(b.contactName));
    },
  });
}

export function useCreateContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      newContact: Omit<Contact, 'id' | 'createdAt'> & { id?: string; createdAt?: string }
    ) => {
      const created: Contact = {
        ...newContact,
        id: newContact.id || `con-${Date.now()}`,
        createdAt: newContact.createdAt || new Date().toISOString(),
      };
      saveContacts([created, ...localContacts]);
      return created;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
}

export function useUpdateContactBalance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      contactId,
      delta,
    }: {
      contactId: string;
      delta: number;
    }) => {
      const updated = localContacts.map((c) =>
        c.id === contactId
          ? { ...c, netBalance: Number((c.netBalance + delta).toFixed(2)) }
          : c
      );
      saveContacts(updated);
      return updated.find((c) => c.id === contactId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
}

export function useContactBalance(contactId: string) {
  return useQuery({
    queryKey: ['contact-balance', contactId],
    queryFn: async () => {
      const contact = localContacts.find((c) => c.id === contactId);
      return contact ? contact.netBalance : 0;
    },
  });
}
