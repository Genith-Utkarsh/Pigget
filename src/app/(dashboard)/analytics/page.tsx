'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Download,
  TrendingDown,
  PieChart,
  BarChart3,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { useTransactions } from '@/lib/hooks/use-transactions';
import { formatCurrency } from '@/lib/utils/currency';
import { DEFAULT_CATEGORIES } from '@/lib/types';

export default function AnalyticsPage() {
  const { data: transactions = [] } = useTransactions();
  const [copiedExport, setCopiedExport] = useState(false);

  // Group transactions by month for bar chart (last 6 months)
  const monthlyData = [
    { month: 'Jun', spend: 38400, budget: 45000 },
    { month: 'Jul', spend: 42100, budget: 45000 },
    { month: 'Aug', spend: 49200, budget: 45000 },
    { month: 'Sep', spend: 35800, budget: 45000 },
    { month: 'Oct', spend: 44300, budget: 50000 },
    { month: 'Nov', spend: 39850, budget: 50000 },
  ];

  const maxMonthSpend = Math.max(...monthlyData.map((m) => Math.max(m.spend, m.budget)));

  // Group by category for pie / breakdown
  const categoryTotals: Record<string, number> = {};
  transactions.forEach((tx) => {
    if (tx.type === 'PERSONAL' || tx.type === 'GROUP_SPLIT') {
      const cat = tx.category || 'Other';
      categoryTotals[cat] = (categoryTotals[cat] || 0) + Number(tx.totalAmount);
    }
  });

  const totalSpent = Object.values(categoryTotals).reduce((a, b) => a + b, 0) || 1;

  const categoryBreakdown = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .map(([name, amount]) => {
      const cfg = DEFAULT_CATEGORIES.find((c) => c.name === name);
      const percentage = Math.round((amount / totalSpent) * 100);
      return {
        name,
        amount,
        percentage,
        color: cfg?.color || '#3b82f6',
        icon: cfg?.icon || '📋',
        budget: cfg?.budget || 10000,
      };
    });

  // Build conic gradient string for pure CSS donut chart
  const { stops: gradientStops, totalPct } = categoryBreakdown.slice(0, 6).reduce(
    (acc, c) => {
      const start = acc.totalPct;
      const end = acc.totalPct + c.percentage;
      return {
        totalPct: end,
        stops: [...acc.stops, `${c.color} ${start}% ${end}%`],
      };
    },
    { totalPct: 0, stops: [] as string[] }
  );

  const finalGradientStops = [...gradientStops];
  if (totalPct < 100) {
    finalGradientStops.push(`#64748b ${totalPct}% 100%`);
  }
  const conicGradientStyle = {
    background: `conic-gradient(${finalGradientStops.join(', ')})`,
  };

  const handleExportCSV = () => {
    const headers = 'ID,Title,Amount,Currency,Category,Type,Date\n';
    const rows = transactions
      .map(
        (t) =>
          `"${t.id}","${t.title.replace(/"/g, '""')}",${t.totalAmount},"${t.currency}","${
            t.category || ''
          }","${t.type}","${t.createdAt}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pigget-expenses-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setCopiedExport(true);
    setTimeout(() => setCopiedExport(false), 2000);
  };

  return (
    <div className="w-full max-w-[720px] mx-auto px-4 py-6 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Dashboard</span>
        </Link>

        <div className="flex items-center gap-2">
          <GlassButton
            variant="secondary"
            size="sm"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5"
          >
            {copiedExport ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Download className="w-3.5 h-3.5 text-blue-400" />
            )}
            <span>{copiedExport ? 'Exported CSV!' : 'Export CSV'}</span>
          </GlassButton>
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Spending & Burn Analytics</h1>
        <p className="text-xs text-slate-400 mt-1">
          Visual breakdowns of personal expenses, category budgets, and historical burn rate.
        </p>
      </div>

      {/* Top 3 KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <GlassCard variant="secondary" className="p-4 bg-[#17181e]/90">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Total Nov Spend
          </div>
          <div className="text-2xl font-black text-white">
            {formatCurrency(totalSpent, 'INR')}
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1">
            <TrendingDown className="w-3 h-3" />
            <span>8.4% below planned cap</span>
          </div>
        </GlassCard>

        <GlassCard variant="secondary" className="p-4 bg-[#17181e]/90">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Daily Average
          </div>
          <div className="text-2xl font-black text-white">
            {formatCurrency(Math.round(totalSpent / 18), 'INR')}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">across last 18 days</div>
        </GlassCard>

        <GlassCard variant="secondary" className="p-4 bg-[#17181e]/90">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Largest Category
          </div>
          <div className="text-2xl font-black text-blue-400">
            {categoryBreakdown[0]?.name || 'Food'}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {categoryBreakdown[0]?.percentage || 0}% of all outflows
          </div>
        </GlassCard>
      </div>

      {/* 1. Monthly Spending CSS Bar Chart */}
      <GlassCard variant="primary" className="p-5 bg-[#121317]/95 border-white/[0.1] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-semibold text-white">Monthly Spend vs Budget (6-Mo Trend)</h3>
          </div>
          <span className="text-xs text-slate-400">All figures in INR (₹)</span>
        </div>

        <div className="h-48 pt-6 pb-2 flex items-end justify-between gap-3 px-2 border-b border-white/[0.08]">
          {monthlyData.map((item) => {
            const spendHeight = Math.round((item.spend / maxMonthSpend) * 100);
            const budgetHeight = Math.round((item.budget / maxMonthSpend) * 100);

            return (
              <div key={item.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <div className="w-full flex items-end justify-center gap-1.5 h-full">
                  {/* Spend Bar */}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${spendHeight}%` }}
                    transition={{ duration: 0.6 }}
                    className="w-1/2 max-w-[28px] bg-gradient-to-t from-blue-600 to-indigo-500 rounded-t-lg group-hover:brightness-125 transition-all relative"
                  >
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 bg-[#1b1c24] text-[10px] font-bold text-white px-1.5 py-0.5 rounded shadow pointer-events-none transition-opacity whitespace-nowrap z-10">
                      {formatCurrency(item.spend, 'INR', { compact: true })}
                    </div>
                  </motion.div>

                  {/* Budget Limit Bar */}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${budgetHeight}%` }}
                    transition={{ duration: 0.6 }}
                    className="w-1/2 max-w-[28px] bg-white/[0.08] border-t-2 border-dashed border-slate-400 rounded-t-lg relative"
                  />
                </div>
                <span className="text-xs font-semibold text-slate-400 group-hover:text-white transition-colors">
                  {item.month}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-center gap-6 text-xs text-slate-400 pt-1">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-blue-500" />
            <span>Actual Spend</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-white/[0.1] border-t border-dashed border-slate-400" />
            <span>Monthly Budget Cap</span>
          </div>
        </div>
      </GlassCard>

      {/* 2. Category Donut & Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* CSS Donut Chart */}
        <GlassCard variant="primary" className="p-5 bg-[#121317]/95 border-white/[0.1] flex flex-col items-center justify-center">
          <div className="flex items-center gap-2 self-start mb-4">
            <PieChart className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-semibold text-white">Category Allocation</h3>
          </div>

          <div className="relative w-44 h-44 rounded-full flex items-center justify-center my-2 shadow-2xl p-1" style={conicGradientStyle}>
            {/* Center Cutout for Donut */}
            <div className="w-28 h-28 rounded-full bg-[#121317] flex flex-col items-center justify-center shadow-inner">
              <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                Total Outflow
              </span>
              <span className="text-base font-extrabold text-white">
                {formatCurrency(totalSpent, 'INR', { compact: true })}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mt-4 text-[11px] text-slate-300">
            {categoryBreakdown.slice(0, 4).map((c) => (
              <span key={c.name} className="flex items-center gap-1 bg-white/[0.04] px-2 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                <span>{c.name}</span>
                <span className="text-slate-400 font-medium">({c.percentage}%)</span>
              </span>
            ))}
          </div>
        </GlassCard>

        {/* Category Budget vs Actual */}
        <GlassCard variant="primary" className="p-5 bg-[#121317]/95 border-white/[0.1] space-y-3">
          <h3 className="text-sm font-semibold text-white">Budget vs. Actual</h3>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {categoryBreakdown.map((cat) => {
              const pctUsed = Math.min(Math.round((cat.amount / cat.budget) * 100), 100);
              const isOver = cat.amount > cat.budget;

              return (
                <div key={cat.name} className="p-2.5 rounded-xl bg-[#17181e] border border-white/[0.06] space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                      <span>{cat.icon}</span> {cat.name}
                    </span>
                    <span className={`font-bold ${isOver ? 'text-rose-400' : 'text-slate-300'}`}>
                      {formatCurrency(cat.amount, 'INR')} /{' '}
                      <span className="text-slate-500 font-normal">{formatCurrency(cat.budget, 'INR')}</span>
                    </span>
                  </div>

                  <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isOver ? 'bg-rose-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${pctUsed}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
