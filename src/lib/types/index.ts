export type TransactionType = 'PERSONAL' | 'GROUP_SPLIT' | 'KHATA_GIVE' | 'KHATA_GOT';

export type SplitMethod = 'equal' | 'exact' | 'percentage' | 'shares';

export type BillFrequency = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  avatarUrl?: string | null;
  upiId?: string | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface Contact {
  id: string;
  ownerId: string;
  contactName: string;
  contactPhone?: string | null;
  contactEmail?: string | null;
  netBalance: number; // positive = they owe you, negative = you owe them
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface GroupMember {
  id: string;
  groupId: string;
  userId: string;
  user?: User;
  joinedAt?: string | Date;
}

export interface Group {
  id: string;
  name: string;
  createdById: string;
  simplifyDebts: boolean;
  currency: string;
  members?: GroupMember[];
  memberCount?: number;
  userBalance?: number; // calculated balance for current user in this group
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface TransactionSplit {
  id: string;
  transactionId: string;
  paidByUserId: string;
  owedByUserId: string;
  amountOwed: number;
  isSettled: boolean;
  settledAt?: string | Date | null;
  paidByUser?: User;
  owedByUser?: User;
}

export interface Transaction {
  id: string;
  title: string;
  totalAmount: number;
  currency: string;
  category?: string | null;
  type: TransactionType;
  paidById: string;
  groupId?: string | null;
  contactId?: string | null;
  receiptUrl?: string | null;
  notes?: string | null;
  createdAt: string | Date;
  paidBy?: User;
  group?: Group;
  contact?: Contact;
  splits?: TransactionSplit[];
}

export interface Category {
  id: string;
  name: string;
  icon?: string | null;
  color?: string | null;
  userId?: string | null;
}

export interface Budget {
  id: string;
  userId: string;
  categoryId: string;
  monthlyLimit: number;
  month: number;
  year: number;
  category?: Category;
}

export interface RecurringBill {
  id: string;
  userId: string;
  title: string;
  amount: number;
  categoryId: string;
  frequency: BillFrequency;
  nextDueDate: string | Date;
  isActive: boolean;
  category?: Category;
}

export interface CategoryConfig {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface DockItem {
  id: string;
  label: string;
  icon: string;
  badge?: string;
  href?: string;
  color?: string;
}

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

export const DEFAULT_CATEGORIES: CategoryConfig[] = [
  { id: 'cat-food', name: 'Food & Dining', icon: 'food', color: '#3b82f6' },
  { id: 'cat-transport', name: 'Transport', icon: 'transport', color: '#6366f1' },
  { id: 'cat-shopping', name: 'Shopping', icon: 'shopping', color: '#8b5cf6' },
  { id: 'cat-entertainment', name: 'Entertainment', icon: 'entertainment', color: '#a855f7' },
  { id: 'cat-bills', name: 'Bills & Utilities', icon: 'bills', color: '#38bdf8' },
  { id: 'cat-health', name: 'Health', icon: 'health', color: '#ef4444' },
  { id: 'cat-travel', name: 'Travel', icon: 'travel', color: '#06b6d4' },
  { id: 'cat-groceries', name: 'Groceries', icon: 'groceries', color: '#10b981' },
  { id: 'cat-rent', name: 'Housing & Rent', icon: 'rent', color: '#64748b' },
  { id: 'cat-subscriptions', name: 'Subscriptions', icon: 'subscriptions', color: '#f59e0b' },
  { id: 'cat-investments', name: 'Investments', icon: 'investments', color: '#14b8a6' },
  { id: 'cat-gifts', name: 'Gifts & Social', icon: 'gifts', color: '#ec4899' },
  { id: 'cat-salary', name: 'Income / Salary', icon: 'salary', color: '#22c55e' },
  { id: 'cat-other', name: 'General Spend', icon: 'other', color: '#94a3b8' },
];
