'use client';

import React from 'react';
import { ChevronRight, PieChart } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { useTransactions } from '@/lib/hooks/use-transactions';
import { formatCurrency } from '@/lib/utils/currency';
import { DEFAULT_CATEGORIES } from '@/lib/types';
import { CategoryIcon } from '@/components/ui/category-icon';
import Link from 'next/link';

export const SpendingOverview: React.FC = () => {
  const { data: transactions = [] } = useTransactions();

  // Group transactions by category for top 5 breakdown
  const categoryTotals: Record<string, number> = {};
  transactions
    .filter((tx) => tx.type === 'PERSONAL' || tx.type === 'GROUP_SPLIT')
    .forEach((tx) => {
      const cat = tx.category || 'General Spend';
      categoryTotals[cat] = (categoryTotals[cat] || 0) + Number(tx.totalAmount);
    });

  const totalSpent = Object.values(categoryTotals).reduce((a, b) => a + b, 0);

  const sortedCategories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, total]) => {
      const config = DEFAULT_CATEGORIES.find((c) => c.name === name);
      const percentage = totalSpent > 0 ? Math.round((total / totalSpent) * 100) : 0;
      return {
        name,
        total,
        percentage,
        icon: config?.icon || 'other',
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
              <span>{transactions.length} total events • Live Ledger</span>
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

      {/* Monthly Outflow Summary */}
      <div className="bg-[#17181e] p-3.5 rounded-[20px] border border-white/[0.06] space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">Total Outflow</span>
          <span className="font-bold text-white">
            {formatCurrency(totalSpent, 'INR')}
          </span>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
          <span>Across {Object.keys(categoryTotals).length} active categories</span>
          <span className="text-blue-400 font-medium">Real-time dynamic</span>
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
                <div
                  className="w-7 h-7 rounded-[8px] flex items-center justify-center border"
                  style={{
                    backgroundColor: `${cat.color}15`,
                    borderColor: `${cat.color}30`,
                    color: cat.color,
                  }}
                >
                  <CategoryIcon name={cat.icon} className="w-3.5 h-3.5" />
                </div>
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
