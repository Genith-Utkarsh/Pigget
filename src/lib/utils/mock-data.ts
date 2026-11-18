import { User, Contact, Group, Transaction } from '@/lib/types';

export const CURRENT_USER: User = {
  id: 'usr-self',
  name: 'You',
  email: '',
  phone: '',
  upiId: '',
};

export const MOCK_USERS: User[] = [CURRENT_USER];
export const MOCK_CONTACTS: Contact[] = [];
export const MOCK_GROUPS: Group[] = [];
export const MOCK_TRANSACTIONS: Transaction[] = [];
