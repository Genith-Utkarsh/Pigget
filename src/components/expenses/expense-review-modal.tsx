'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ArrowRight, ShieldCheck, Calendar, Tag, CreditCard } from 'lucide-react';
import { FloatingModal } from '@/components/ui/floating-modal';
import { GlassButton } from '@/components/ui/glass-button';
import { useExpenseStore } from '@/lib/stores/expense-store';
import { useCreateTransaction } from '@/lib/hooks/use-transactions';
import { DEFAULT_CATEGORIES } from '@/lib/types';
import { formatCurrency, parseCurrencyInput } from '@/lib/utils/currency';
import { CategoryIcon } from '@/components/ui/category-icon';

export const ExpenseReviewModal: React.FC = () => {
  const {
    isReviewOpen,
    toggleReview,
    amount,
    note,
    selectedCategory,
    currency,
    reset,
  } = useExpenseStore();

  const [isSuccess, setIsSuccess] = useState(false);
  const createTxMutation = useCreateTransaction();

  const currentCategory =
    DEFAULT_CATEGORIES.find((c) => c.id === selectedCategory) ||
    DEFAULT_CATEGORIES[0];

  const numericAmount = parseCurrencyInput(amount);

  const handleConfirm = async () => {
    try {
      await createTxMutation.mutateAsync({
        title: note.trim() || `${currentCategory.name} Expense`,
        totalAmount: numericAmount,
        currency,
        category: currentCategory.name,
        type: 'PERSONAL',
        paidById: 'usr-self',
        notes: note.trim() || undefined,
      });

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        reset();
        toggleReview(false);
      }, 1600);
    } catch (err) {
      console.error('Failed to create transaction', err);
    }
  };

  return (
    <FloatingModal
      isOpen={isReviewOpen}
      onClose={() => {
        if (!isSuccess) toggleReview(false);
      }}
      title="Review & Confirm Expense"
      description="Verify transaction breakdown before recording to ledger"
      size="sm"
    >
      <AnimatePresence mode="wait">
        {isSuccess ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center justify-center py-8 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-4 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Expense Recorded!</h3>
            <p className="text-sm text-slate-400">
              Synced with your ledger and monthly budget.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="review-details"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4 pt-1"
          >
            {/* Amount Hero Box */}
            <div className="bg-[#17181e] p-5 rounded-[22px] border border-white/[0.08] text-center">
              <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
                Total Amount
              </span>
              <div className="text-4xl font-extrabold text-white mt-1">
                {formatCurrency(numericAmount, currency)}
              </div>
            </div>

            {/* Details Breakdown */}
            <div className="bg-[#17181e]/80 rounded-[20px] p-4 border border-white/[0.06] space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-blue-400" /> Category
                </span>
                <span className="font-medium text-slate-200 flex items-center gap-1.5">
                  <CategoryIcon name={currentCategory.icon} className="w-3.5 h-3.5 text-blue-400" />
                  <span>{currentCategory.name}</span>
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-purple-400" /> Ledger Record
                </span>
                <span className="font-medium text-emerald-400">Personal Spend • Auto-Sync</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" /> Date & Time
                </span>
                <span className="font-medium text-slate-200">Today, Just now</span>
              </div>

              {note && (
                <div className="pt-2 border-t border-white/[0.06] text-xs">
                  <span className="text-slate-400 block mb-0.5">Note:</span>
                  <p className="text-slate-300 italic">{note}</p>
                </div>
              )}
            </div>

            {/* Offline & privacy hint */}
            <div className="flex items-center gap-2 px-1 text-[11px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Offline-first encryption enabled. Auto-synced across devices.</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <GlassButton
                type="button"
                variant="secondary"
                onClick={() => toggleReview(false)}
                className="flex-1 justify-center"
                disabled={createTxMutation.isPending}
              >
                Edit
              </GlassButton>
              <GlassButton
                type="button"
                variant="primary"
                onClick={handleConfirm}
                loading={createTxMutation.isPending}
                className="flex-1 justify-center gap-1.5"
              >
                <span>Confirm & Save</span>
                <ArrowRight className="w-4 h-4" />
              </GlassButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </FloatingModal>
  );
};
