'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ArrowRight,
  Check,
  Zap,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { DEFAULT_CATEGORIES } from '@/lib/types';
import { useExpenseStore } from '@/lib/stores/expense-store';
import { useTransactions } from '@/lib/hooks/use-transactions';
import { formatCurrency, parseCurrencyInput } from '@/lib/utils/currency';

export const ExpenseCard: React.FC = () => {
  const {
    amount,
    setAmount,
    note,
    setNote,
    selectedCategory,
    setCategory,
    toggleReview,
  } = useExpenseStore();

  const { data: transactions = [] } = useTransactions();
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  const currentCategory =
    DEFAULT_CATEGORIES.find((c) => c.id === selectedCategory) ||
    DEFAULT_CATEGORIES[0];

  // Dynamically calculate spent amount for the selected category from actual transactions
  const categorySpent = transactions
    .filter(
      (tx) =>
        (tx.type === 'PERSONAL' || tx.type === 'GROUP_SPLIT') &&
        tx.category === currentCategory.name
    )
    .reduce((sum, tx) => sum + Number(tx.totalAmount), 0);

  const categoryBudget = currentCategory.budget || 10000;
  const currentRemaining = Math.max(0, categoryBudget - categorySpent);

  const numericAmount = parseCurrencyInput(amount);
  const projectedRemaining = Math.max(0, currentRemaining - numericAmount);

  // Dynamic USD reference conversion (approx 1 USD = 86.5 INR)
  const usdReference =
    numericAmount > 0 ? (numericAmount / 86.5).toFixed(2) : null;

  const handleQuickAdd = (addVal: number) => {
    const currentNum = parseCurrencyInput(amount);
    const newTotal = currentNum + addVal;
    setAmount(newTotal.toString());
  };

  const handleSetMax = () => {
    setAmount(currentRemaining.toString());
  };

  const estimatedTax = numericAmount > 0 ? Math.round(numericAmount * 0.05) : 0; // 5% GST estimate

  return (
    <div className="w-full max-w-[430px] mx-auto">
      <GlassCard
        variant="primary"
        className="p-4 sm:p-5 shadow-card-specular relative border-white/[0.09] bg-[#121317]/90 rounded-[30px]"
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
      >
        {/* Category Pod (Single top pod — payment source removed) */}
        <div className="bg-[#17181e]/95 border border-white/[0.06] rounded-[22px] p-3.5 relative shadow-inner">
          <div
            onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
            className="flex items-center justify-between cursor-pointer group hover:opacity-95 transition-opacity"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
              }
            }}
          >
            <div className="flex items-center gap-3.5">
              {/* Icon Squircle with Badge */}
              <div className="relative">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-12 h-12 rounded-[18px] border flex items-center justify-center text-2xl shadow-inner transition-transform"
                  style={{
                    backgroundColor: `${currentCategory.color}20`,
                    borderColor: `${currentCategory.color}40`,
                  }}
                >
                  {currentCategory.icon}
                </motion.div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-[5px] border-2 border-[#17181e] flex items-center justify-center">
                  <span className="w-1.5 h-1.5 bg-white rounded-full" />
                </div>
              </div>

              {/* Title & Dynamic Budget Subtitle */}
              <div className="flex flex-col text-left">
                <span className="text-[17px] font-bold text-white tracking-tight leading-snug">
                  {currentCategory.name}
                </span>
                <span className="text-[12px] font-medium text-slate-400 flex items-center gap-1.5">
                  <span>Cap: {formatCurrency(categoryBudget, 'INR', { compact: true })}</span>
                  <span>•</span>
                  <span className="text-emerald-400">
                    {formatCurrency(currentRemaining, 'INR', { compact: true })} left
                  </span>
                </span>
              </div>
            </div>

            {/* Chevron Pill */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-8 h-8 rounded-full bg-[#20222a] border border-white/5 flex items-center justify-center text-slate-400 group-hover:text-white transition-colors"
            >
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  isCategoryDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </motion.div>
          </div>

          {/* Category Dropdown Menu */}
          <AnimatePresence>
            {isCategoryDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                className="mt-3 pt-2 border-t border-white/[0.06] z-30 max-h-56 overflow-y-auto space-y-1 scrollbar-hidden"
              >
                {DEFAULT_CATEGORIES.map((cat) => {
                  const isSelected = (selectedCategory || 'cat-food') === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setCategory(cat.id);
                        setIsCategoryDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-[14px] text-left transition-all ${
                        isSelected
                          ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                          : 'text-slate-300 hover:bg-white/[0.05]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg">{cat.icon}</span>
                        <span className="text-xs font-semibold">{cat.name}</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-blue-400" />}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Amount Input Section */}
        <div className="mt-2.5 px-3 pt-4 pb-2 flex flex-col">
          {/* Labels Row */}
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span className="text-slate-300 font-medium">Amount</span>
            <span className="tracking-wide">
              Balance Cap:{' '}
              <strong className="text-slate-200 font-semibold">
                {formatCurrency(currentRemaining, 'INR')}
              </strong>
            </span>
          </div>

          {/* Big Amount Display / Input */}
          <div className="my-2 flex items-baseline gap-1.5 justify-start">
            <span className="text-3xl font-semibold text-slate-400 select-none">₹</span>
            <input
              aria-label="Expense Amount"
              className="w-full bg-transparent border-none p-0 text-5xl font-bold tracking-tight text-white focus:ring-0 focus:outline-none placeholder-slate-700"
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9.]/g, '');
                setAmount(val);
              }}
              placeholder="0"
              autoFocus
            />
          </div>

          {/* Dynamic Reference and Quick Action Buttons */}
          <div className="flex items-center justify-between pt-1">
            {/* USD / Equivalent Reference */}
            <span className="text-xs text-slate-500 font-medium tracking-wide">
              {usdReference ? `≈ $${usdReference} USD` : 'Instant Ledger Auto-Calc'}
            </span>

            {/* Quick Increment Buttons */}
            <div className="flex items-center gap-1.5">
              <motion.button
                whileTap={{ scale: 0.94 }}
                type="button"
                onClick={() => handleQuickAdd(100)}
                className="bg-[#1c1e25] hover:bg-[#252833] text-slate-300 text-[11px] font-semibold px-2.5 py-1 rounded-md border border-white/5 transition-colors cursor-pointer"
              >
                +100
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.94 }}
                type="button"
                onClick={() => handleQuickAdd(500)}
                className="bg-[#1c1e25] hover:bg-[#252833] text-slate-300 text-[11px] font-semibold px-2.5 py-1 rounded-md border border-white/5 transition-colors cursor-pointer"
              >
                +500
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.94 }}
                type="button"
                onClick={handleSetMax}
                className="bg-[#1c1e25] hover:bg-[#252833] text-blue-400 text-[11px] font-semibold px-2.5 py-1 rounded-md border border-white/5 transition-colors cursor-pointer"
              >
                Max
              </motion.button>
            </div>
          </div>

          {/* Dynamic Budget Projection if amount entered */}
          {numericAmount > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-2 text-[11px] text-slate-400 flex items-center justify-between bg-white/[0.02] p-2 rounded-lg border border-white/[0.04]"
            >
              <span>Projected remaining in {currentCategory.name}:</span>
              <span
                className={`font-semibold ${
                  projectedRemaining <= 0 ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {formatCurrency(projectedRemaining, 'INR')}
              </span>
            </motion.div>
          )}

          {/* Optional Note / Tag Field */}
          <div className="mt-4 pt-3 border-t border-white/[0.05] flex items-center justify-between gap-2">
            <input
              className="w-full bg-[#181920]/60 text-xs text-slate-200 placeholder-slate-500 rounded-xl px-3.5 py-2.5 border border-white/5 focus:outline-none focus:border-blue-500/50 transition-colors"
              placeholder="Add note (e.g. Swiggy order, Starbucks, Uber...)"
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <span className="text-[11px] text-slate-500 font-mono whitespace-nowrap pl-1">
              Tax: {estimatedTax > 0 ? `₹${estimatedTax}` : '0%'}
            </span>
          </div>

          {/* Primary Action Button */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            disabled={numericAmount <= 0}
            onClick={() => toggleReview(true)}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 text-white font-semibold py-3.5 px-6 rounded-[20px] shadow-lg shadow-blue-600/30 active:scale-[0.99] transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span className="tracking-tight text-sm font-semibold">Review & Record Spend</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </motion.button>

          {/* Status Guarantee Footer Line */}
          <div className="mt-3 text-center flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-medium select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-emerald-400 inline" />
              Instant UPI auto-sync • Private & offline ready
            </span>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
