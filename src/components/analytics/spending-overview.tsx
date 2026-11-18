'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingDown, ChevronRight, PieChart } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { useTransactions } from '@/lib/hooks/use-transactions';
import { calculateMonthlyBurn } from '@/lib/utils/calculations';
import { formatCurrency } from '@/lib/utils/currency';
import { DEFAULT_CATEGORIES } from '@/lib/types';
import Link from 'next/link';

export const SpendingOverview: React.FC = () => {
  const { data: transactions = [] } = useTransactions();

  const burn = calculateMonthlyBurn(transactions, undefined, undefined, 50000);

  // Group transactions by category for top 5 breakdown
  const categoryTotals: Record<string, number> = {};
  transactions
    .filter((tx) => tx.type === 'PERSONAL' || tx.type === 'GROUP_SPLIT')
    .forEach((tx) => {
      const cat = tx.category || 'Other';
      categoryTotals[cat] = (categoryTotals[cat] || 0) + Number(tx.totalAmount);
    });

  const sortedCategories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, total]) => {
      const config = DEFAULT_CATEGORIES.find((c) => c.name === name);
      const percentage = burn.spent > 0 ? Math.round((total / burn.spent) * 100) : 0;
      return {
        name,
        total,
        percentage,
        icon: config?.icon || '📋',
        color: config?.color || '#3b82f6',
      };
    });

  return (
    <GlassCard variant="primary" className="p-5 bg-[#121317]/95 border-white/[0.1] space-y-4">
      {/* Widget Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <PieChart className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100">Monthly Burn Overview</h3>
            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              <span className="flex items-center text-emerald-400 font-medium">
                <TrendingDown className="w-3 h-3 inline mr-0.5" /> 8.4%
              </span>
              <span>vs last month</span>
            </div>
          </div>
        </div>

        <Link
          href="/analytics"
          className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium group transition-colors"
        >
          <span>Deep Analytics</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Monthly Budget Progress Bar */}
      <div className="bg-[#17181e] p-3.5 rounded-[20px] border border-white/[0.06] space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">Spent this month</span>
          <span className="font-bold text-white">
            {formatCurrency(burn.spent, 'INR')}{' '}
            <span className="text-slate-400 font-normal">
              / {formatCurrency(burn.budget, 'INR')}
            </span>
          </span>
        </div>

        {/* Progress Track */}
        <div className="h-2.5 w-full bg-white/[0.05] rounded-full overflow-hidden p-[1px]">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${burn.percentage}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={`h-full rounded-full ${
              burn.percentage > 90
                ? 'bg-rose-500'
                : burn.percentage > 70
                ? 'bg-amber-500'
                : 'bg-gradient-to-r from-blue-600 to-indigo-500'
            }`}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
          <span>{burn.percentage}% of limit utilized</span>
          <span className="text-emerald-400 font-medium">
            {formatCurrency(burn.remaining, 'INR')} remaining
          </span>
        </div>
      </div>

      {/* Top 5 Categories Breakdown */}
      <div className="space-y-2">
        <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 px-1">
          Top Spending Categories
        </div>

        <div className="space-y-1.5">
          {sortedCategories.map((cat) => (
            <div
              key={cat.name}
              className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/[0.04] text-xs hover:bg-white/[0.04] transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-base">{cat.icon}</span>
                <span className="font-medium text-slate-200">{cat.name}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-16 h-1.5 bg-white/[0.06] rounded-full overflow-hidden hidden sm:block">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${cat.percentage}%`,
                      backgroundColor: cat.color,
                    }}
                  />
                </div>
                <span className="font-semibold text-white min-w-[55px] text-right">
                  {formatCurrency(cat.total, 'INR')}
                </span>
                <span className="text-[10px] text-slate-400 min-w-[28px] text-right">
                  {cat.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
};
