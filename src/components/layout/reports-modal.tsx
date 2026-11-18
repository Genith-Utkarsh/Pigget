'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Download, PieChart, ArrowUpRight } from 'lucide-react';
import { useTransactions } from '@/lib/hooks/use-transactions';
import { formatCurrency } from '@/lib/utils/currency';
import { calculateMonthlyBurn } from '@/lib/utils/calculations';
import Link from 'next/link';

export interface ReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReportsModal: React.FC<ReportsModalProps> = ({ isOpen, onClose }) => {
  const { data: transactions = [] } = useTransactions();

  if (!isOpen) return null;

  const burn = calculateMonthlyBurn(transactions, undefined, undefined, 50000);

  // Group by type
  const personalTotal = transactions
    .filter((tx) => tx.type === 'PERSONAL')
    .reduce((s, tx) => s + Number(tx.totalAmount), 0);
  const splitTotal = transactions
    .filter((tx) => tx.type === 'GROUP_SPLIT')
    .reduce((s, tx) => s + Number(tx.totalAmount), 0);
  const khataGave = transactions
    .filter((tx) => tx.type === 'KHATA_GIVE')
    .reduce((s, tx) => s + Number(tx.totalAmount), 0);
  const khataGot = transactions
    .filter((tx) => tx.type === 'KHATA_GOT')
    .reduce((s, tx) => s + Number(tx.totalAmount), 0);

  const handleExportCSV = () => {
    const headers = 'ID,Date,Title,Amount,Currency,Category,Type,Notes\n';
    const rows = transactions
      .map(
        (tx) =>
          `"${tx.id}","${new Date(tx.createdAt).toISOString()}","${tx.title}","${
            tx.totalAmount
          }","${tx.currency}","${tx.category || ''}","${tx.type}","${tx.notes || ''}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pigget_statement_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      <div className="z-50 fixed inset-0 flex justify-center items-end md:items-center p-1 md:p-0">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        <motion.div
          role="dialog"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', stiffness: 360, damping: 28 }}
          className="relative z-10 w-full max-h-[88vh] md:max-w-lg bg-[#121317]/95 border border-white/[0.09] rounded-t-[28px] md:rounded-[30px] shadow-2xl p-6 flex flex-col gap-4 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <span>Financial Reports</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Overview across personal, split, and khata books.
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

          <div className="overflow-y-auto space-y-4 pr-1 max-h-[60vh] scrollbar-thin">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-[#17181e] border border-white/5">
                <span className="text-[11px] text-slate-400 block font-medium">
                  Monthly Spend
                </span>
                <span className="text-xl font-bold text-white mt-1 block">
                  {formatCurrency(burn.spent, 'INR')}
                </span>
                <span className="text-[10px] text-emerald-400 mt-1 block">
                  {burn.percentage}% of 50k budget
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#17181e] border border-white/5">
                <span className="text-[11px] text-slate-400 block font-medium">
                  Total Ledger Events
                </span>
                <span className="text-xl font-bold text-white mt-1 block">
                  {transactions.length}
                </span>
                <span className="text-[10px] text-blue-400 mt-1 block">
                  Across all engines
                </span>
              </div>
            </div>

            {/* Ledger Breakdown by Engine */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Volume Breakdown
              </span>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs">
                <span className="text-slate-300">Personal Outflow</span>
                <span className="font-semibold text-white">
                  {formatCurrency(personalTotal, 'INR')}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs">
                <span className="text-slate-300">Group Split Volume</span>
                <span className="font-semibold text-indigo-400">
                  {formatCurrency(splitTotal, 'INR')}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs">
                <span className="text-slate-300">Khata You Gave</span>
                <span className="font-semibold text-rose-400">
                  {formatCurrency(khataGave, 'INR')}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs">
                <span className="text-slate-300">Khata You Got</span>
                <span className="font-semibold text-emerald-400">
                  {formatCurrency(khataGot, 'INR')}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={handleExportCSV}
                className="flex-1 py-3 px-4 rounded-xl bg-[#1c1e25] hover:bg-[#252833] text-slate-200 text-xs font-semibold border border-white/10 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4 text-blue-400" />
                <span>Export CSV Statement</span>
              </button>

              <Link
                href="/analytics"
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg shadow-blue-600/30"
              >
                <PieChart className="w-4 h-4" />
                <span>Full Analytics Page</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
