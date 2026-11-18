import { SplitMethod, Transaction } from '@/lib/types';

export interface SplitResult {
  userId: string;
  amount: number;
}

/**
 * Calculates how much each member owes based on the split method.
 * Methods:
 * - equal: divides total equally
 * - exact: uses customSplits values directly
 * - percentage: uses customSplits as percentages of total
 * - shares: uses customSplits as share counts (e.g. 2 shares vs 1 share)
 */
export function calculateSplit(
  total: number,
  memberIds: string[],
  method: SplitMethod = 'equal',
  customSplits?: Record<string, number>
): SplitResult[] {
  if (!memberIds.length || total <= 0) return [];

  const round = (val: number) => Math.round(val * 100) / 100;

  switch (method) {
    case 'equal': {
      const share = round(total / memberIds.length);
      const results: SplitResult[] = [];
      let accumulated = 0;

      for (let i = 0; i < memberIds.length; i++) {
        if (i === memberIds.length - 1) {
          // Adjust last member for rounding differences
          results.push({ userId: memberIds[i], amount: round(total - accumulated) });
        } else {
          results.push({ userId: memberIds[i], amount: share });
          accumulated += share;
        }
      }
      return results;
    }

    case 'exact': {
      return memberIds.map((id) => ({
        userId: id,
        amount: round(customSplits?.[id] ?? 0),
      }));
    }

    case 'percentage': {
      let accumulated = 0;
      const results: SplitResult[] = [];

      for (let i = 0; i < memberIds.length; i++) {
        const id = memberIds[i];
        const pct = customSplits?.[id] ?? 0;
        if (i === memberIds.length - 1) {
          results.push({ userId: id, amount: round(total - accumulated) });
        } else {
          const splitAmount = round((total * pct) / 100);
          results.push({ userId: id, amount: splitAmount });
          accumulated += splitAmount;
        }
      }
      return results;
    }

    case 'shares': {
      const totalShares = memberIds.reduce(
        (sum, id) => sum + (customSplits?.[id] ?? 1),
        0
      );
      if (totalShares <= 0) return memberIds.map((id) => ({ userId: id, amount: 0 }));

      let accumulated = 0;
      const results: SplitResult[] = [];

      for (let i = 0; i < memberIds.length; i++) {
        const id = memberIds[i];
        const memberShare = customSplits?.[id] ?? 1;
        if (i === memberIds.length - 1) {
          results.push({ userId: id, amount: round(total - accumulated) });
        } else {
          const splitAmount = round((total * memberShare) / totalShares);
          results.push({ userId: id, amount: splitAmount });
          accumulated += splitAmount;
        }
      }
      return results;
    }

    default:
      return [];
  }
}

/**
 * Calculates net balance from transactions.
 * Positive = overall in credit / get back
 * Negative = overall in debt / owes
 */
export function calculateNetBalance(
  transactions: Transaction[],
  currentUserId: string = 'user-current'
): number {
  let net = 0;

  for (const tx of transactions) {
    if (tx.type === 'KHATA_GIVE') {
      // You gave money to someone -> they owe you (+ balance)
      net += Number(tx.totalAmount);
    } else if (tx.type === 'KHATA_GOT') {
      // You received money from someone -> debt reduced or you owe (- balance)
      net -= Number(tx.totalAmount);
    } else if (tx.type === 'GROUP_SPLIT' && tx.splits) {
      for (const split of tx.splits) {
        if (split.paidByUserId === currentUserId && split.owedByUserId !== currentUserId) {
          // You paid for someone else -> they owe you
          net += Number(split.amountOwed);
        } else if (split.owedByUserId === currentUserId && split.paidByUserId !== currentUserId) {
          // Someone paid for you -> you owe them
          net -= Number(split.amountOwed);
        }
      }
    }
  }

  return Math.round(net * 100) / 100;
}

/**
 * Calculates total spent, budget, and burn percentage for a given month and year.
 */
export function calculateMonthlyBurn(
  transactions: Transaction[],
  month?: number,
  year?: number,
  budgetAmount: number = 50000
): { spent: number; budget: number; percentage: number; remaining: number } {
  let spent = 0;

  for (const tx of transactions) {
    if (tx.type === 'PERSONAL' || tx.type === 'GROUP_SPLIT') {
      if (month !== undefined && year !== undefined) {
        const txDate = new Date(tx.createdAt);
        if (txDate.getMonth() === month && txDate.getFullYear() === year) {
          spent += Number(tx.totalAmount);
        }
      } else {
        spent += Number(tx.totalAmount);
      }
    }
  }

  spent = Math.round(spent * 100) / 100;
  const percentage = budgetAmount > 0 ? Math.min(Math.round((spent / budgetAmount) * 100), 100) : 0;
  const remaining = Math.max(0, budgetAmount - spent);

  return { spent, budget: budgetAmount, percentage, remaining };
}
