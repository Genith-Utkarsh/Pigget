'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ArrowRight,
  Check,
} from 'lucide-react';
import { DEFAULT_CATEGORIES } from '@/lib/types';
import { useExpenseStore } from '@/lib/stores/expense-store';
import { parseCurrencyInput } from '@/lib/utils/currency';
import { CategoryIcon } from '@/components/ui/category-icon';

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

  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  const currentCategory =
    DEFAULT_CATEGORIES.find((c) => c.id === selectedCategory) ||
    DEFAULT_CATEGORIES[0];

  const numericAmount = parseCurrencyInput(amount);

  // Dynamic USD reference conversion (approx 1 USD = 86.5 INR)
  const usdReference =
    numericAmount > 0 ? (numericAmount / 86.5).toFixed(2) : null;

  const handleQuickAdd = (addVal: number) => {
    const currentNum = parseCurrencyInput(amount);
    const newTotal = currentNum + addVal;
    setAmount(newTotal.toString());
  };

  return (
    <div className="w-full max-w-[540px] mx-auto select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
        className="sb-card p-3 pb-4 sm:p-4 sm:pb-5 w-full"
      >
        <div className="flex flex-col gap-3">
          {/* Top Category Pullout */}
          <div className="relative grid select-none sb-pullout bg-muted">
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                className="group relative text-left flex w-full items-center justify-between transition-all cursor-pointer gap-4 p-4 sm:p-5"
              >
                <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                  {/* Category Vector Icon Squircle */}
                  <div
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-[20px] flex items-center justify-center shrink-0 border shadow-inner transition-transform group-hover:scale-105"
                    style={{
                      backgroundColor: `${currentCategory.color}18`,
                      borderColor: `${currentCategory.color}35`,
                      color: currentCategory.color,
                    }}
                  >
                    <CategoryIcon name={currentCategory.icon} className="w-6 h-6" />
                  </div>

                  {/* Category Name & Subtitle */}
                  <div className="flex flex-col gap-0.5 truncate">
                    <span className="text-xl sm:text-2xl font-heading font-semibold text-foreground leading-tight truncate">
                      {currentCategory.name}
                    </span>
                    <span className="text-xs sm:text-sm font-body text-muted-foreground leading-none">
                      Personal Envelope
                    </span>
                  </div>
                </div>

                {/* Chevron Pill Button */}
                <div className="sb-button flex shrink-0 items-center justify-center size-9 rounded-full border border-white/10 bg-white/[0.04] group-hover:bg-white/[0.08] transition-all">
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground group-hover:text-foreground transition-transform duration-200 ${
                      isCategoryDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </button>
            </div>

            {/* Category Dropdown Menu */}
            <AnimatePresence>
              {isCategoryDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  className="border-t border-white/[0.06] p-3 max-h-60 overflow-y-auto space-y-1 scrollbar-hidden"
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
                        className={`w-full flex items-center justify-between p-2.5 rounded-[16px] text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                            : 'text-slate-300 hover:bg-white/[0.05]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-[10px] flex items-center justify-center border"
                            style={{
                              backgroundColor: `${cat.color}15`,
                              borderColor: `${cat.color}30`,
                              color: cat.color,
                            }}
                          >
                            <CategoryIcon name={cat.icon} className="w-4 h-4" />
                          </div>
                          <span className="text-xs sm:text-sm font-medium">{cat.name}</span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-blue-400" />}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Amount Section Pullout */}
          <div className="sb-pullout bg-muted flex flex-col gap-3 relative px-5 sm:px-6 pt-5 pb-5 transition-colors">
            <div className="flex flex-col items-start gap-2 sm:gap-3">
              {/* Header Row */}
              <div className="h-6 flex items-center justify-between w-full">
                <h3 className="font-heading font-semibold text-sm sm:text-base text-foreground leading-none">
                  Amount
                </h3>
                <span className="text-xs sm:text-sm text-muted-foreground font-mono leading-none">
                  INR (₹)
                </span>
              </div>

              {/* Big Amount Input Display */}
              <div className="flex items-baseline gap-2 w-full my-1">
                <span className="text-3xl sm:text-4xl font-heading text-muted-foreground select-none">
                  ₹
                </span>
                <input
                  aria-label="Expense Amount"
                  inputMode="decimal"
                  type="text"
                  value={amount}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9.]/g, '');
                    setAmount(val);
                  }}
                  placeholder="0"
                  autoFocus
                  className="w-full bg-transparent border-none p-0 text-4xl sm:text-5xl font-heading font-bold tracking-tight text-foreground focus:ring-0 focus:outline-none placeholder:text-muted-foreground/30 leading-none"
                />
              </div>

              {/* Bottom Reference & Action Pills */}
              <div className="h-7 flex items-center justify-between w-full pt-1">
                <span className="text-xs sm:text-sm text-muted-foreground font-body">
                  {usdReference ? `≈ $${usdReference} USD` : 'Instant Ledger Auto-Calc'}
                </span>

                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <button
                    type="button"
                    onClick={() => handleQuickAdd(100)}
                    className="font-button cursor-pointer inline-flex items-center justify-center rounded-full bg-white/[0.04] hover:bg-white/[0.09] text-foreground border border-white/10 h-7 px-2.5 py-1 text-xs transition-colors"
                  >
                    +100
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickAdd(500)}
                    className="font-button cursor-pointer inline-flex items-center justify-center rounded-full bg-white/[0.04] hover:bg-white/[0.09] text-foreground border border-white/10 h-7 px-2.5 py-1 text-xs transition-colors"
                  >
                    +500
                  </button>
                  {numericAmount > 0 && (
                    <button
                      type="button"
                      onClick={() => setAmount('')}
                      className="font-button cursor-pointer inline-flex items-center justify-center rounded-full bg-white/[0.04] hover:bg-white/[0.09] text-rose-400 border border-white/10 h-7 px-2.5 py-1 text-xs transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Clean Optional Note Pullout */}
          <div className="sb-pullout bg-muted px-4 py-3 flex items-center gap-3">
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add note (e.g. Swiggy order, Starbucks, Uber...)"
              className="w-full bg-transparent text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
            />
          </div>

          {/* Primary Action Button */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            disabled={numericAmount <= 0}
            onClick={() => toggleReview(true)}
            className="font-button cursor-pointer inline-flex items-center justify-center gap-2 w-full h-12 sm:h-13 rounded-full bg-foreground text-background font-bold text-sm sm:text-base shadow-lg shadow-black/30 hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-30 disabled:pointer-events-none mt-1"
          >
            <span>Review & Record Spend</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>

          {/* Status Footer Line */}
          <div className="text-center flex items-center justify-center gap-2 text-xs text-muted-foreground font-body select-none pt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
            <span>Instant UPI auto-sync • Private & offline ready</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
