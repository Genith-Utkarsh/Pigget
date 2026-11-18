export interface DebtBalance {
  userId: string;
  balance: number; // positive = owed money (creditor), negative = owes money (debtor)
  userName?: string;
}

export interface SimplifiedTransaction {
  from: string; // debtor
  to: string; // creditor
  amount: number;
  fromName?: string;
  toName?: string;
}

/**
 * Debt simplification algorithm using a greedy approach:
 * 1. Calculate net balance for each person.
 * 2. Separate into debtors (balance < 0) and creditors (balance > 0).
 * 3. Match largest debtor with largest creditor, settling the minimum of |debt| and credit.
 * 4. Repeat until all balances are settled within 1 cent/paisa.
 */
export function simplifyDebts(
  balances: { userId: string; balance: number; userName?: string }[]
): SimplifiedTransaction[] {
  const EPSILON = 0.01;

  // Separate into debtors and creditors, keeping track of names if available
  const debtors: { userId: string; amount: number; userName?: string }[] = [];
  const creditors: { userId: string; amount: number; userName?: string }[] = [];

  for (const b of balances) {
    const rounded = Math.round(b.balance * 100) / 100;
    if (rounded < -EPSILON) {
      debtors.push({ userId: b.userId, amount: -rounded, userName: b.userName });
    } else if (rounded > EPSILON) {
      creditors.push({ userId: b.userId, amount: rounded, userName: b.userName });
    }
  }

  const transactions: SimplifiedTransaction[] = [];

  // Sort descending by amount
  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);

  let i = 0; // debtor index
  let j = 0; // creditor index

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];

    const settledAmount = Math.min(debtor.amount, creditor.amount);
    const roundedSettled = Math.round(settledAmount * 100) / 100;

    if (roundedSettled > 0) {
      transactions.push({
        from: debtor.userId,
        to: creditor.userId,
        amount: roundedSettled,
        fromName: debtor.userName,
        toName: creditor.userName,
      });
    }

    debtor.amount -= settledAmount;
    creditor.amount -= settledAmount;

    if (debtor.amount <= EPSILON) {
      i++;
    }
    if (creditor.amount <= EPSILON) {
      j++;
    }
  }

  return transactions;
}
