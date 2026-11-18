'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Group } from '@/lib/types';

const STORAGE_KEY = 'pigget_groups_v3';

function getInitialGroups(): Group[] {
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
    console.error('Failed to read groups from localStorage', e);
  }
  return [];
}

let localGroups: Group[] = getInitialGroups();

function saveGroups(groups: Group[]) {
  localGroups = groups;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
    } catch (e) {
      console.error('Failed to save groups to localStorage', e);
    }
  }
}

export function useGroups() {
  return useQuery<Group[]>({
    queryKey: ['groups'],
    queryFn: async () => {
      if (typeof window !== 'undefined') {
        localGroups = getInitialGroups();
      }
      return [...localGroups];
    },
  });
}

export function useCreateGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      newGroup: Omit<Group, 'id' | 'createdAt'> & { id?: string; createdAt?: string }
    ) => {
      const created: Group = {
        ...newGroup,
        id: newGroup.id || `grp-${Date.now()}`,
        createdAt: newGroup.createdAt || new Date().toISOString(),
        memberCount: newGroup.members?.length || 1,
        userBalance: 0,
      };
      saveGroups([created, ...localGroups]);
      return created;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });
}

export function useGroupBalance(groupId: string) {
  return useQuery({
    queryKey: ['group-balance', groupId],
    queryFn: async () => {
      const group = localGroups.find((g) => g.id === groupId);
      return group?.userBalance ?? 0;
    },
  });
}
