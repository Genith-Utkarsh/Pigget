'use client';

import React, { useState } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { FloatingModal } from '@/components/ui/floating-modal';
import { GlassButton } from '@/components/ui/glass-button';
import { useGroupStore } from '@/lib/stores/group-store';
import { useCreateTransaction } from '@/lib/hooks/use-transactions';
import { useCreateGroup } from '@/lib/hooks/use-groups';
import { SplitMethod, TransactionSplit } from '@/lib/types';
import { calculateSplit } from '@/lib/utils/calculations';
import { parseCurrencyInput, formatCurrency } from '@/lib/utils/currency';

const SPLIT_METHODS: { id: SplitMethod; label: string }[] = [
  { id: 'equal', label: '= Equal' },
  { id: 'exact', label: '₹ Exact' },
  { id: 'percentage', label: '% Pct' },
  { id: 'shares', label: '⚖️ Shares' },
];

export const AddGroupExpenseModal: React.FC = () => {
  const {
    selectedGroup,
    splitMethod,
    setSplitMethod,
    paidByUserId,
    setPaidByUserId,
    isAddExpenseOpen,
    toggleAddExpense,
    isCreateGroupOpen,
    toggleCreateGroup,
  } = useGroupStore();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [customSplits, setCustomSplits] = useState<Record<string, number>>({});
  const [isSuccess, setIsSuccess] = useState(false);

  // Group creation state
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupCurrency, setNewGroupCurrency] = useState('INR');

  const createTxMutation = useCreateTransaction();
  const createGroupMutation = useCreateGroup();

  const members = selectedGroup?.members || [];
  const memberIds = members.map((m) => m.userId);
  const numericAmount = parseCurrencyInput(amount);

  // Auto calculate splits when amount, method or members change
  const computedSplits = React.useMemo(() => {
    return calculateSplit(numericAmount, memberIds, splitMethod, customSplits);
  }, [numericAmount, memberIds, splitMethod, customSplits]);

  // Validation
  const sumOfSplits = computedSplits.reduce((acc, s) => acc + s.amount, 0);
  const isSplitValid =
    numericAmount > 0 && Math.abs(sumOfSplits - numericAmount) < 0.1;

  const handleCustomSplitChange = (userId: string, val: string) => {
    const num = parseFloat(val) || 0;
    setCustomSplits((prev) => ({ ...prev, [userId]: num }));
  };

  const handleSaveExpense = async () => {
    if (!selectedGroup || !title.trim() || !numericAmount) return;

    try {
      const splits: TransactionSplit[] = computedSplits
        .filter((s) => s.userId !== paidByUserId)
        .map((s, idx) => ({
          id: `sp-${Date.now()}-${idx}`,
          transactionId: '',
          paidByUserId: paidByUserId,
          owedByUserId: s.userId,
          amountOwed: s.amount,
          isSettled: false,
        }));

      await createTxMutation.mutateAsync({
        title: title.trim(),
        totalAmount: numericAmount,
        currency: selectedGroup.currency,
        type: 'GROUP_SPLIT',
        paidById: paidByUserId,
        groupId: selectedGroup.id,
        splits: splits,
      });

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setTitle('');
        setAmount('');
        setCustomSplits({});
        toggleAddExpense(false);
      }, 1200);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    try {
      await createGroupMutation.mutateAsync({
        name: newGroupName.trim(),
        createdById: 'usr-self',
        simplifyDebts: true,
        currency: newGroupCurrency,
        members: [
          {
            id: `gm-self-${Date.now()}`,
            groupId: '',
            userId: 'usr-self',
          },
        ],
      });

      setNewGroupName('');
      toggleCreateGroup(false);
    } catch (err) {
      console.error(err);
    }
  };

  // Create Group Modal
  if (isCreateGroupOpen) {
    return (
      <FloatingModal
        isOpen={isCreateGroupOpen}
        onClose={() => toggleCreateGroup(false)}
        title="Create Shared Group"
        description="Split trips, rent, bills, or outings with friends"
        size="sm"
      >
        <form onSubmit={handleCreateGroup} className="space-y-4 pt-2">
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1 uppercase tracking-wider">
              Group Name
            </label>
            <input
              type="text"
              required
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="e.g. Manali Road Trip or Room 304"
              className="w-full bg-[#17181e] text-slate-200 placeholder-slate-500 px-3.5 py-2.5 rounded-xl border border-white/[0.08] focus:outline-none focus:border-blue-500/50 text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1 uppercase tracking-wider">
              Currency
            </label>
            <select
              value={newGroupCurrency}
              onChange={(e) => setNewGroupCurrency(e.target.value)}
              className="w-full bg-[#17181e] text-slate-200 px-3.5 py-2.5 rounded-xl border border-white/[0.08] focus:outline-none focus:border-blue-500/50 text-sm"
            >
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="AED">AED (AED)</option>
            </select>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <GlassButton
              type="button"
              variant="secondary"
              onClick={() => toggleCreateGroup(false)}
              className="flex-1 justify-center"
            >
              Cancel
            </GlassButton>
            <GlassButton
              type="submit"
              variant="primary"
              loading={createGroupMutation.isPending}
              className="flex-1 justify-center"
            >
              Create Group
            </GlassButton>
          </div>
        </form>
      </FloatingModal>
    );
  }

  // Add Group Expense Modal
  return (
    <FloatingModal
      isOpen={isAddExpenseOpen}
      onClose={() => {
        if (!isSuccess) toggleAddExpense(false);
      }}
      title={`Add Expense to ${selectedGroup?.name || 'Group'}`}
      description="Split automatically with group members"
      size="md"
    >
      {isSuccess ? (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-3 animate-bounce">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h4 className="text-lg font-bold text-white">Group Expense Added</h4>
          <p className="text-xs text-slate-400">Balances updated and debt simplified.</p>
        </div>
      ) : (
        <div className="space-y-4 pt-1">
          {/* Title & Amount Inputs */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1 uppercase tracking-wider">
                Description / Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Dinner, Uber, Airbnb, Groceries"
                className="w-full bg-[#17181e] text-slate-200 placeholder-slate-500 px-3.5 py-2.5 rounded-xl border border-white/[0.08] focus:outline-none focus:border-blue-500/50 text-sm"
              />
            </div>

            <div className="bg-[#17181e] p-4 rounded-[20px] border border-white/[0.08] text-center">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Total Bill Amount
              </div>
              <div className="flex items-center justify-center">
                <span className="text-3xl font-bold text-slate-400 mr-1">
                  {selectedGroup?.currency === 'INR' ? '₹' : '$'}
                </span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className="bg-transparent text-white text-4xl font-bold tracking-tight text-center focus:outline-none placeholder-slate-600 w-44"
                />
              </div>
            </div>
          </div>

          {/* Paid By Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1 uppercase tracking-wider">
              Paid By
            </label>
            <select
              value={paidByUserId}
              onChange={(e) => setPaidByUserId(e.target.value)}
              className="w-full bg-[#17181e] text-slate-200 px-3.5 py-2.5 rounded-xl border border-white/[0.08] focus:outline-none focus:border-blue-500/50 text-sm"
            >
              {members.map((m) => (
                <option key={m.userId} value={m.userId}>
                  {m.userId === 'usr-self' ? 'You (usr-self)' : m.user?.name || m.userId}
                </option>
              ))}
            </select>
          </div>

          {/* Split Method Toggle */}
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1.5 uppercase tracking-wider">
              Split Method
            </label>
            <div className="grid grid-cols-4 gap-2">
              {SPLIT_METHODS.map((sm) => (
                <button
                  key={sm.id}
                  type="button"
                  onClick={() => setSplitMethod(sm.id)}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    splitMethod === sm.id
                      ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                      : 'bg-[#17181e] text-slate-400 border-white/[0.06] hover:bg-[#1e2028]'
                  }`}
                >
                  {sm.label}
                </button>
              ))}
            </div>
          </div>

          {/* Member Split Breakdown */}
          <div className="bg-[#17181e]/80 p-3 rounded-2xl border border-white/[0.06] space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold px-1">
              <span>Member</span>
              <span>Calculated Share</span>
            </div>

            {members.map((m) => {
              const split = computedSplits.find((s) => s.userId === m.userId);
              const memberName =
                m.userId === 'usr-self' ? 'You' : m.user?.name || m.userId;

              return (
                <div
                  key={m.userId}
                  className="flex items-center justify-between text-xs py-1 px-1 border-t border-white/[0.04]"
                >
                  <span className="text-slate-300 font-medium">{memberName}</span>
                  <div className="flex items-center gap-2">
                    {splitMethod !== 'equal' && (
                      <input
                        type="number"
                        placeholder="0"
                        value={customSplits[m.userId] ?? ''}
                        onChange={(e) => handleCustomSplitChange(m.userId, e.target.value)}
                        className="w-16 bg-black/40 text-right px-2 py-1 rounded-lg border border-white/10 text-white focus:outline-none"
                      />
                    )}
                    <span className="font-bold text-white min-w-[60px] text-right">
                      {formatCurrency(split?.amount || 0, selectedGroup?.currency || 'INR')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {!isSplitValid && numericAmount > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-rose-400 bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Splits total must equal {formatCurrency(numericAmount, 'INR')}.</span>
            </div>
          )}

          {/* Save Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <GlassButton
              type="button"
              variant="secondary"
              onClick={() => toggleAddExpense(false)}
              className="flex-1 justify-center"
            >
              Cancel
            </GlassButton>
            <GlassButton
              type="button"
              variant="primary"
              disabled={!title.trim() || !isSplitValid}
              loading={createTxMutation.isPending}
              onClick={handleSaveExpense}
              className="flex-1 justify-center"
            >
              Save Group Expense
            </GlassButton>
          </div>
        </div>
      )}
    </FloatingModal>
  );
};
