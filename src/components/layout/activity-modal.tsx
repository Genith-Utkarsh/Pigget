'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTransactions, useDeleteTransaction } from '@/lib/hooks/use-transactions';
import { formatCurrency } from '@/lib/utils/currency';
import { TransactionType } from '@/lib/types';
import { Trash2, History } from 'lucide-react';

export interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ActivityModal: React.FC<ActivityModalProps> = ({ isOpen, onClose }) => {
  const [filterType, setFilterType] = useState<TransactionType | 'ALL'>('ALL');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'SETTLED' | 'PENDING'>('ALL');
  const [isFromMenuOpen, setIsFromMenuOpen] = useState(false);
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);

  const { data: transactions = [] } = useTransactions({
    type: filterType === 'ALL' ? undefined : filterType,
  });

  const deleteTx = useDeleteTransaction();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="safe-modal-frame z-50 fixed inset-0 flex justify-center items-end p-3 sm:items-center sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="sb-modal-backdrop fixed inset-0"
        />

        {/* Dialog Window */}
        <motion.div
          role="dialog"
          tabIndex={-1}
          initial={{ opacity: 0, scale: 0.96, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ type: 'spring', stiffness: 360, damping: 28 }}
          className="pointer-events-auto flex flex-col w-full max-h-full md:max-h-[720px] relative p-0 h-[88vh] md:h-auto md:w-[90vw] md:max-w-[580px] z-10"
        >
          {/* Inner Card Container */}
          <div className="sb-modal-glass bg-[#121317]/95 border border-white/[0.09] rounded-t-[28px] md:rounded-[30px] shadow-2xl backdrop-blur-2xl flex-col overflow-hidden flex h-full sm:h-[min(86dvh,720px)]">
            {/* Header with Title and Identity Badge */}
            <div className="flex flex-col text-left py-6 gap-1 px-6 pb-4 pt-6 select-none">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-heading text-2xl font-bold tracking-tight text-white">
                  Activity
                </h2>
                <div className="flex flex-wrap gap-1">
                  <span className="px-2.5 py-1 text-xs leading-none text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full font-mono">
                    {transactions.length} {transactions.length === 1 ? 'event' : 'events'}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-400">
                Live ledger events, personal spends, and settled debts.
              </p>
            </div>

            {/* Filter Pills Row with User's Exact Chevron Dropdown SVGs */}
            <div className="flex flex-wrap gap-2 border-b border-white/[0.06] mx-3 py-3 px-3 relative z-20">
              {/* 'From' Source Filter */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsFromMenuOpen(!isFromMenuOpen);
                    setIsStatusMenuOpen(false);
                  }}
                  className="cursor-pointer inline-flex items-center shrink-0 ring-offset-background focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 bg-[#1c1e25] text-slate-300 hover:text-white border border-white/10 rounded-full py-1.5 justify-start gap-1.5 px-3 text-xs whitespace-nowrap transition-colors"
                >
                  <span className="flex min-w-0 items-center gap-1">
                    <span className="text-slate-400">From:</span>
                    <span className="font-semibold text-slate-200">
                      {filterType === 'ALL'
                        ? 'All'
                        : filterType === 'PERSONAL'
                        ? 'Personal'
                        : filterType === 'GROUP_SPLIT'
                        ? 'Splitwise'
                        : 'Khata'}
                    </span>
                  </span>
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-2.5 h-2.5 shrink-0 fill-slate-400"
                  >
                    <path d="M38.9204 15.1644C40.1145 14.0162 42.0132 14.0537 43.1616 15.2475C44.3098 16.4416 44.2734 18.3402 43.0796 19.4887L26.0796 35.8353C26.0764 35.8384 26.073 35.8411 26.0698 35.8441C25.9663 35.943 25.8571 36.0325 25.7436 36.1137C25.7351 36.1198 25.7268 36.1262 25.7182 36.1322C25.7042 36.1421 25.6895 36.151 25.6753 36.1605C25.6303 36.1909 25.5837 36.2179 25.5376 36.2455C25.4886 36.2748 25.4394 36.3032 25.3891 36.3295C25.3472 36.3514 25.3049 36.3722 25.2622 36.392C25.2172 36.4128 25.1722 36.433 25.1264 36.4516C25.0832 36.4691 25.0395 36.485 24.9956 36.5004C24.9473 36.5173 24.899 36.5338 24.8501 36.5482C24.8042 36.5618 24.7578 36.5731 24.7114 36.5844C24.6656 36.5955 24.6199 36.6057 24.5737 36.6146C24.5247 36.6242 24.4756 36.632 24.4263 36.6391C24.3817 36.6454 24.3372 36.6513 24.2925 36.6557C24.2407 36.6607 24.1891 36.664 24.1372 36.6664C24.0913 36.6685 24.0455 36.6703 23.9995 36.6703C23.9535 36.6703 23.9077 36.6685 23.8618 36.6664C23.8099 36.664 23.7582 36.6607 23.7065 36.6557C23.6621 36.6513 23.618 36.6454 23.5737 36.6391C23.5234 36.6319 23.4733 36.6244 23.4233 36.6146C23.3794 36.6061 23.336 36.5959 23.2925 36.5853C23.2441 36.5736 23.1958 36.5614 23.1479 36.5473C23.0994 36.5329 23.0513 36.5172 23.0034 36.5004C22.9595 36.485 22.9158 36.4691 22.8725 36.4516C22.8268 36.433 22.7818 36.4128 22.7368 36.392C22.6941 36.3721 22.6518 36.3514 22.6098 36.3295C22.5596 36.3032 22.5104 36.2748 22.4614 36.2455C22.4153 36.2179 22.3686 36.1909 22.3237 36.1605C22.3095 36.151 22.2948 36.1421 22.2807 36.1322C22.2722 36.1262 22.2639 36.1198 22.2554 36.1137C22.142 36.0325 22.0327 35.943 21.9292 35.8441C21.9262 35.8413 21.9234 35.8382 21.9204 35.8353L4.92039 19.4887C3.7266 18.3402 3.69015 16.4416 4.83836 15.2475C5.98678 14.0536 7.88543 14.0163 9.07957 15.1644L23.9995 29.5101L38.9204 15.1644Z" />
                  </svg>
                </button>

                {isFromMenuOpen && (
                  <div className="absolute top-full left-0 mt-1 bg-[#1a1c24] border border-white/10 rounded-xl p-1 shadow-2xl z-30 min-w-[140px]">
                    {[
                      { id: 'ALL', label: 'All Sources' },
                      { id: 'PERSONAL', label: 'Personal' },
                      { id: 'GROUP_SPLIT', label: 'Group Split' },
                      { id: 'KHATA_GIVE', label: 'Khata: You Gave' },
                      { id: 'KHATA_GOT', label: 'Khata: You Got' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setFilterType(opt.id as TransactionType | 'ALL');
                          setIsFromMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs rounded-lg transition-colors ${
                          filterType === opt.id
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-300 hover:bg-white/[0.05]'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 'Status' Filter */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsStatusMenuOpen(!isStatusMenuOpen);
                    setIsFromMenuOpen(false);
                  }}
                  className="cursor-pointer inline-flex items-center shrink-0 ring-offset-background focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 bg-[#1c1e25] text-slate-300 hover:text-white border border-white/10 rounded-full py-1.5 justify-start gap-1.5 px-3 text-xs whitespace-nowrap transition-colors"
                >
                  <span className="flex min-w-0 items-center gap-1">
                    <span className="text-slate-400">Status:</span>
                    <span className="font-semibold text-slate-200">
                      {filterStatus === 'ALL' ? 'All' : filterStatus}
                    </span>
                  </span>
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-2.5 h-2.5 shrink-0 fill-slate-400"
                  >
                    <path d="M38.9204 15.1644C40.1145 14.0162 42.0132 14.0537 43.1616 15.2475C44.3098 16.4416 44.2734 18.3402 43.0796 19.4887L26.0796 35.8353C26.0764 35.8384 26.073 35.8411 26.0698 35.8441C25.9663 35.943 25.8571 36.0325 25.7436 36.1137C25.7351 36.1198 25.7268 36.1262 25.7182 36.1322C25.7042 36.1421 25.6895 36.151 25.6753 36.1605C25.6303 36.1909 25.5837 36.2179 25.5376 36.2455C25.4886 36.2748 25.4394 36.3032 25.3891 36.3295C25.3472 36.3514 25.3049 36.3722 25.2622 36.392C25.2172 36.4128 25.1722 36.433 25.1264 36.4516C25.0832 36.4691 25.0395 36.485 24.9956 36.5004C24.9473 36.5173 24.899 36.5338 24.8501 36.5482C24.8042 36.5618 24.7578 36.5731 24.7114 36.5844C24.6656 36.5955 24.6199 36.6057 24.5737 36.6146C24.5247 36.6242 24.4756 36.632 24.4263 36.6391C24.3817 36.6454 24.3372 36.6513 24.2925 36.6557C24.2407 36.6607 24.1891 36.664 24.1372 36.6664C24.0913 36.6685 24.0455 36.6703 23.9995 36.6703C23.9535 36.6703 23.9077 36.6685 23.8618 36.6664C23.8099 36.664 23.7582 36.6607 23.7065 36.6557C23.6621 36.6513 23.618 36.6454 23.5737 36.6391C23.5234 36.6319 23.4733 36.6244 23.4233 36.6146C23.3794 36.6061 23.336 36.5959 23.2925 36.5853C23.2441 36.5736 23.1958 36.5614 23.1479 36.5473C23.0994 36.5329 23.0513 36.5172 23.0034 36.5004C22.9595 36.485 22.9158 36.4691 22.8725 36.4516C22.8268 36.433 22.7818 36.4128 22.7368 36.392C22.6941 36.3721 22.6518 36.3514 22.6098 36.3295C22.5596 36.3032 22.5104 36.2748 22.4614 36.2455C22.4153 36.2179 22.3686 36.1909 22.3237 36.1605C22.3095 36.151 22.2948 36.1421 22.2807 36.1322C22.2722 36.1262 22.2639 36.1198 22.2554 36.1137C22.142 36.0325 22.0327 35.943 21.9292 35.8441C21.9262 35.8413 21.9234 35.8382 21.9204 35.8353L4.92039 19.4887C3.7266 18.3402 3.69015 16.4416 4.83836 15.2475C5.98678 14.0536 7.88543 14.0163 9.07957 15.1644L23.9995 29.5101L38.9204 15.1644Z" />
                  </svg>
                </button>

                {isStatusMenuOpen && (
                  <div className="absolute top-full left-0 mt-1 bg-[#1a1c24] border border-white/10 rounded-xl p-1 shadow-2xl z-30 min-w-[120px]">
                    {[
                      { id: 'ALL', label: 'All Status' },
                      { id: 'SETTLED', label: 'Settled' },
                      { id: 'PENDING', label: 'Pending' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setFilterStatus(opt.id as 'ALL' | 'SETTLED' | 'PENDING');
                          setIsStatusMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs rounded-lg transition-colors ${
                          filterStatus === opt.id
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-300 hover:bg-white/[0.05]'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Transactions List or Empty Pullout */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5">
              {transactions.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center p-8 text-center my-auto min-h-[260px]">
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-slate-400 mb-3">
                    <History className="w-5 h-5 text-slate-400" />
                  </div>
                  <h3 className="font-heading font-semibold text-base text-white mb-1">
                    No Activity Yet
                  </h3>
                  <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                    Expenses recorded from the main card, group splits, and khata entries will appear here in real time.
                  </p>
                </div>
              ) : (
                transactions.map((tx) => {
                  const isCredit = tx.type === 'KHATA_GOT';
                  const isSplit = tx.type === 'GROUP_SPLIT';

                  return (
                    <motion.div
                      key={tx.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3.5 rounded-[18px] bg-[#17181e]/90 hover:bg-[#1d1f27] border border-white/[0.06] flex items-center justify-between transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-[14px] flex items-center justify-center text-sm font-bold border ${
                            isCredit
                              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                              : isSplit
                              ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400'
                              : 'bg-rose-500/15 border-rose-500/30 text-rose-400'
                          }`}
                        >
                          {isCredit ? '↓' : isSplit ? '⇄' : '↑'}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                            <span>{tx.title}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded font-medium bg-white/[0.06] text-slate-400">
                              {tx.category || tx.type}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                            <span>
                              {new Date(tx.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                            {tx.notes && <span>• {tx.notes}</span>}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span
                            className={`text-sm font-bold tracking-tight ${
                              isCredit
                                ? 'text-emerald-400'
                                : isSplit
                                ? 'text-indigo-400'
                                : 'text-slate-100'
                            }`}
                          >
                            {isCredit ? '+' : '-'} {formatCurrency(tx.totalAmount, tx.currency)}
                          </span>
                        </div>

                        {/* Delete single transaction action */}
                        <button
                          type="button"
                          onClick={() => deleteTx.mutate(tx.id)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                          title="Delete transaction"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>

          {/* Close Button with User's Exact Cross SVG */}
          <button
            type="button"
            tabIndex={0}
            onClick={onClose}
            aria-label="Close Activity"
            className="font-button leading-none cursor-pointer inline-flex gap-1.5 items-center justify-center ring-offset-background focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 bg-[#1c1e25] text-slate-400 hover:text-white border border-white/10 rounded-full h-9 w-9 sm:h-10 sm:w-10 absolute right-4 top-4 sm:right-5 sm:top-5 shrink-0 shadow-lg hover:scale-105 active:scale-95 transition-all z-30"
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-slate-300"
            >
              <path d="M36.8963 7.36117C38.0778 6.19973 39.9779 6.21503 41.1395 7.39632C42.3009 8.57781 42.2847 10.478 41.1033 11.6395L28.5291 23.9998L41.1033 36.3602C42.2848 37.5217 42.3 39.4218 41.1385 40.6034C39.977 41.7843 38.0787 41.8006 36.8973 40.6395L24.2498 28.2069L11.6033 40.6395C10.4219 41.8007 8.52265 41.7845 7.36115 40.6034C6.19963 39.4218 6.21574 37.5217 7.39728 36.3602L19.9695 23.9998L7.3963 11.6395C6.21501 10.4779 6.19971 8.57778 7.36115 7.39632C8.52271 6.21533 10.422 6.19983 11.6033 7.36117L24.2498 19.7928L36.8963 7.36117Z" />
            </svg>
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
