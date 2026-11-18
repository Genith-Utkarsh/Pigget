import { create } from 'zustand';
import { Group, GroupMember, SplitMethod } from '@/lib/types';

export interface GroupState {
  selectedGroup: Group | null;
  splitMethod: SplitMethod;
  members: GroupMember[];
  splits: Record<string, number>;
  paidByUserId: string;
  isCreateGroupOpen: boolean;
  isAddExpenseOpen: boolean;
  simplifyDebtsView: boolean;

  setSelectedGroup: (group: Group | null) => void;
  setSplitMethod: (method: SplitMethod) => void;
  setPaidByUserId: (userId: string) => void;
  setMemberSplit: (userId: string, amount: number) => void;
  setSplits: (splits: Record<string, number>) => void;
  toggleCreateGroup: (open?: boolean) => void;
  toggleAddExpense: (open?: boolean) => void;
  toggleSimplifyDebts: () => void;
  reset: () => void;
}

export const useGroupStore = create<GroupState>((set) => ({
  selectedGroup: null,
  splitMethod: 'equal',
  members: [],
  splits: {},
  paidByUserId: 'usr-self',
  isCreateGroupOpen: false,
  isAddExpenseOpen: false,
  simplifyDebtsView: true,

  setSelectedGroup: (group) =>
    set({
      selectedGroup: group,
      members: group?.members || [],
    }),
  setSplitMethod: (method) => set({ splitMethod: method }),
  setPaidByUserId: (userId) => set({ paidByUserId: userId }),
  setMemberSplit: (userId, amount) =>
    set((state) => ({
      splits: { ...state.splits, [userId]: amount },
    })),
  setSplits: (splits) => set({ splits }),
  toggleCreateGroup: (open) =>
    set((state) => ({
      isCreateGroupOpen: open !== undefined ? open : !state.isCreateGroupOpen,
    })),
  toggleAddExpense: (open) =>
    set((state) => ({
      isAddExpenseOpen: open !== undefined ? open : !state.isAddExpenseOpen,
    })),
  toggleSimplifyDebts: () =>
    set((state) => ({ simplifyDebtsView: !state.simplifyDebtsView })),
  reset: () =>
    set({
      splitMethod: 'equal',
      splits: {},
      isAddExpenseOpen: false,
    }),
}));
