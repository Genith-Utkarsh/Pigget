'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DEFAULT_CATEGORIES } from '@/lib/types';
import { useTransactions } from '@/lib/hooks/use-transactions';
import { formatCurrency } from '@/lib/utils/currency';
import { useExpenseStore } from '@/lib/stores/expense-store';

export interface CategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CategoriesModal: React.FC<CategoriesModalProps> = ({ isOpen, onClose }) => {
  const { data: transactions = [] } = useTransactions();
  const { setCategory, setActiveTab } = useExpenseStore();
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  // Calculate spent per category
  const categorySpentMap: Record<string, number> = {};
  transactions
    .filter((tx) => tx.type === 'PERSONAL' || tx.type === 'GROUP_SPLIT')
    .forEach((tx) => {
      const cat = tx.category || 'Other';
      categorySpentMap[cat] = (categorySpentMap[cat] || 0) + Number(tx.totalAmount);
    });

  const filteredCategories = DEFAULT_CATEGORIES.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AnimatePresence>
      <div className="z-50 fixed inset-0 flex justify-center items-end md:items-center p-1 md:p-0">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-md"
        />

        <motion.div
          role="dialog"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', stiffness: 360, damping: 28 }}
          className="relative z-10 w-full max-h-[85vh] md:max-w-xl bg-[#121317]/95 border border-white/[0.09] rounded-t-[28px] md:rounded-[30px] shadow-2xl p-6 flex flex-col gap-4 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <span>Category Envelopes</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 font-normal">
                  {DEFAULT_CATEGORIES.length} active
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Dynamic budget limits & live spending progress.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-white bg-[#1c1e25] border border-white/10 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Search Bar */}
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories (e.g. Food, Travel, Rent...)"
            className="w-full bg-[#181920]/80 text-xs text-slate-200 placeholder-slate-500 px-3.5 py-2.5 rounded-xl border border-white/5 focus:outline-none focus:border-purple-500/50"
          />

          {/* Categories Grid */}
          <div className="overflow-y-auto space-y-2 pr-1 max-h-[50vh] scrollbar-thin">
            {filteredCategories.map((cat) => {
              const spent = categorySpentMap[cat.name] || 0;
              const budget = cat.budget || 10000;
              const percentage = Math.min(100, Math.round((spent / budget) * 100));

              return (
                <div
                  key={cat.id}
                  onClick={() => {
                    setCategory(cat.id);
                    setActiveTab('personal');
                    onClose();
                  }}
                  className="p-3 rounded-2xl bg-[#17181e]/90 hover:bg-[#1d1f27] border border-white/[0.06] flex items-center justify-between cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-[14px] flex items-center justify-center text-xl border shadow-inner"
                      style={{
                        backgroundColor: `${cat.color}20`,
                        borderColor: `${cat.color}40`,
                      }}
                    >
                      {cat.icon}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-200 group-hover:text-purple-400 transition-colors flex items-center gap-1.5">
                        <span>{cat.name}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>Spent: {formatCurrency(spent, 'INR')}</span>
                        <span>•</span>
                        <span>Cap: {formatCurrency(budget, 'INR', { compact: true })}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5">
                    <span className="text-xs font-semibold text-slate-300">
                      {percentage}%
                    </span>
                    <div className="w-20 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor:
                            percentage > 90 ? '#f43f5e' : percentage > 70 ? '#f59e0b' : cat.color,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
