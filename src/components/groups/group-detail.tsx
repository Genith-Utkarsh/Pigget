'use client';

import React, { useMemo } from 'react';
import {
  ArrowLeft,
  Users,
  PlusCircle,
  Receipt,
  Sparkles,
  CheckCircle,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { Group } from '@/lib/types';
import { useTransactions } from '@/lib/hooks/use-transactions';
import { useGroupStore } from '@/lib/stores/group-store';
import { formatCurrency } from '@/lib/utils/currency';
import { simplifyDebts } from '@/lib/utils/debt-simplifier';

interface GroupDetailProps {
  group: Group;
  onBack: () => void;
}

export const GroupDetail: React.FC<GroupDetailProps> = ({ group, onBack }) => {
  const { toggleAddExpense, simplifyDebtsView, toggleSimplifyDebts } = useGroupStore();
  const { data: allTransactions = [] } = useTransactions({ groupId: group.id });

  const groupTransactions = allTransactions.filter((tx) => tx.groupId === group.id);

  // Compute individual balances for each group member
  const { memberBalances, simplifiedSettlements } = useMemo(() => {
    const members = group.members || [];
    const balanceMap: Record<string, { userId: string; userName: string; balance: number }> = {};

    members.forEach((m) => {
      const name = m.user?.name || (m.userId === 'usr-self' ? 'You' : `User ${m.userId}`);
      balanceMap[m.userId] = { userId: m.userId, userName: name, balance: 0 };
    });

    groupTransactions.forEach((tx) => {
      if (tx.splits && tx.splits.length > 0) {
        tx.splits.forEach((s) => {
          if (balanceMap[s.paidByUserId]) {
            balanceMap[s.paidByUserId].balance += Number(s.amountOwed);
          }
          if (balanceMap[s.owedByUserId]) {
            balanceMap[s.owedByUserId].balance -= Number(s.amountOwed);
          }
        });
      } else {
        // If no explicit splits array, assume paid by tx.paidById and split equally among all members
        const share = tx.totalAmount / (members.length || 1);
        if (balanceMap[tx.paidById]) {
          balanceMap[tx.paidById].balance += tx.totalAmount - share;
        }
        members.forEach((m) => {
          if (m.userId !== tx.paidById && balanceMap[m.userId]) {
            balanceMap[m.userId].balance -= share;
          }
        });
      }
    });

    const balances = Object.values(balanceMap);
    const settlements = simplifyDebts(balances);

    return {
      memberBalances: balances,
      simplifiedSettlements: settlements,
    };
  }, [group, groupTransactions]);

  const userBalance =
    memberBalances.find((m) => m.userId === 'usr-self')?.balance ?? (group.userBalance ?? 0);

  return (
    <div className="w-full max-w-[540px] mx-auto space-y-4">
      {/* Top Header Card */}
      <GlassCard variant="primary" className="p-5 bg-[#121317]/95">
        <div className="flex items-center justify-between mb-3">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Groups</span>
          </button>

          <button
            type="button"
            onClick={toggleSimplifyDebts}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
              simplifyDebtsView
                ? 'bg-blue-600/20 text-blue-400 border-blue-500/40'
                : 'bg-white/[0.05] text-slate-400 border-white/10 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Simplify Debts {simplifyDebtsView ? 'ON' : 'OFF'}</span>
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-[20px] bg-gradient-to-br from-indigo-600/30 to-blue-600/30 border border-white/10 flex items-center justify-center text-2xl shadow-inner">
              👥
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{group.name}</h2>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {group.members?.length || 1} members
                </span>
                <span>•</span>
                <span>{group.currency}</span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div
              className={`text-2xl font-black ${
                userBalance > 0
                  ? 'text-emerald-400'
                  : userBalance < 0
                  ? 'text-rose-400'
                  : 'text-slate-400'
              }`}
            >
              {userBalance !== 0
                ? `${userBalance > 0 ? '+' : '-'}${formatCurrency(
                    Math.abs(userBalance),
                    group.currency
                  )}`
                : 'Settled Up'}
            </div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              {userBalance > 0 ? 'You are owed' : userBalance < 0 ? 'You owe' : 'All clean'}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-white/[0.08]">
          <GlassButton
            variant="primary"
            onClick={() => toggleAddExpense(true)}
            className="w-full justify-center gap-1.5 py-3"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Group Expense</span>
          </GlassButton>

          <GlassButton
            variant="secondary"
            onClick={() => alert('Settle up via UPI or cash recording!')}
            className="w-full justify-center gap-1.5 py-3 text-slate-200"
          >
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Settle Up Tab</span>
          </GlassButton>
        </div>
      </GlassCard>

      {/* Simplified Debts Box (if turned on) */}
      {simplifyDebtsView && simplifiedSettlements.length > 0 && (
        <GlassCard variant="secondary" className="p-4 bg-[#17181e]/95 border-blue-500/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-400">
              <Sparkles className="w-4 h-4" />
              <span>Smart Minimized Transactions</span>
            </div>
            <span className="text-[11px] text-slate-400">
              Greedy graph reduction applied
            </span>
          </div>

          <div className="space-y-2">
            {simplifiedSettlements.map((st, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-rose-400">
                    {st.from === 'usr-self' ? 'You' : st.fromName || st.from}
                  </span>
                  <span className="text-slate-500 text-[11px]">pays</span>
                  <span className="font-semibold text-emerald-400">
                    {st.to === 'usr-self' ? 'You' : st.toName || st.to}
                  </span>
                </div>
                <div className="font-bold text-white">
                  {formatCurrency(st.amount, group.currency)}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Members Balances List */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1 mb-2">
          Member Balances
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {memberBalances.map((m) => {
            const isPos = m.balance > 0.01;
            const isNeg = m.balance < -0.01;
            return (
              <div
                key={m.userId}
                className="p-3 rounded-2xl bg-[#17181e]/90 border border-white/[0.06] flex items-center justify-between"
              >
                <div className="text-xs font-medium text-slate-200 truncate pr-2">
                  {m.userName}
                </div>
                <div
                  className={`text-xs font-bold shrink-0 ${
                    isPos
                      ? 'text-emerald-400'
                      : isNeg
                      ? 'text-rose-400'
                      : 'text-slate-400'
                  }`}
                >
                  {isPos ? '+' : ''}
                  {formatCurrency(m.balance, group.currency)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Expenses History */}
      <div>
        <div className="flex items-center justify-between px-1 mb-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Group Expenses
          </h3>
          <span className="text-xs text-slate-400">
            {groupTransactions.length} expenses
          </span>
        </div>

        <div className="space-y-2">
          {groupTransactions.length === 0 ? (
            <GlassCard variant="secondary" className="p-8 text-center">
              <Receipt className="w-8 h-8 text-slate-500 mx-auto mb-2" />
              <p className="text-slate-400 text-sm">No expenses in this group yet.</p>
              <GlassButton
                variant="primary"
                size="sm"
                onClick={() => toggleAddExpense(true)}
                className="mt-3"
              >
                Add First Expense
              </GlassButton>
            </GlassCard>
          ) : (
            groupTransactions.map((tx) => (
              <GlassCard
                key={tx.id}
                variant="secondary"
                className="p-3.5 flex items-center justify-between bg-[#17181e]/90"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[14px] bg-blue-600/15 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-100">{tx.title}</div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                      <span>Paid by {tx.paidById === 'usr-self' ? 'You' : 'Rohit'}</span>
                      <span>•</span>
                      <span>{new Date(tx.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-base font-bold text-white">
                    {formatCurrency(tx.totalAmount, tx.currency)}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {tx.splits?.length ? `${tx.splits.length + 1} split ways` : 'equal split'}
                  </div>
                </div>
              </GlassCard>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
