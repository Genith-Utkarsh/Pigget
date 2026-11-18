'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, Users } from 'lucide-react';
import { formatCurrency, parseCurrencyInput } from '@/lib/utils/currency';

export interface MoreToolsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MoreToolsModal: React.FC<MoreToolsModalProps> = ({ isOpen, onClose }) => {
  const [billAmount, setBillAmount] = useState('2400');
  const [numPeople, setNumPeople] = useState('4');
  const [tipPercent, setTipPercent] = useState('10');

  if (!isOpen) return null;

  const bill = parseCurrencyInput(billAmount);
  const people = Math.max(1, parseInt(numPeople) || 1);
  const tip = (bill * (parseInt(tipPercent) || 0)) / 100;
  const total = bill + tip;
  const perPerson = Math.round(total / people);

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
          className="relative z-10 w-full max-h-[85vh] md:max-w-md bg-[#121317]/95 border border-white/[0.09] rounded-t-[28px] md:rounded-[30px] shadow-2xl p-6 flex flex-col gap-4 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <Calculator className="w-5 h-5 text-amber-400" />
                <span>Quick Financial Tools</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Instant bill splitter, tip calculator & utilities.
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

          <div className="space-y-4 py-1 text-xs">
            {/* Quick Bill Splitter Card */}
            <div className="p-4 rounded-2xl bg-[#17181e] border border-white/5 space-y-3">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Users className="w-4 h-4 text-blue-400" /> Quick Split & Tip Calculator
              </span>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">
                    Bill Amount (₹)
                  </label>
                  <input
                    type="text"
                    value={billAmount}
                    onChange={(e) => setBillAmount(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full bg-[#121317] border border-white/10 rounded-xl px-3 py-2 text-white font-bold text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">
                    Split Between
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={numPeople}
                    onChange={(e) => setNumPeople(e.target.value)}
                    className="w-full bg-[#121317] border border-white/10 rounded-xl px-3 py-2 text-white font-bold text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Tip Pills */}
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">
                  Tip Percentage
                </label>
                <div className="flex gap-2">
                  {['0', '5', '10', '15'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTipPercent(t)}
                      className={`flex-1 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                        tipPercent === t
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-[#121317] text-slate-400 hover:text-white border border-white/5'
                      }`}
                    >
                      {t}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Result hero box */}
              <div className="p-3.5 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-between mt-2">
                <div>
                  <span className="text-[10px] text-blue-400 uppercase font-bold tracking-wider block">
                    Each Person Pays
                  </span>
                  <span className="text-2xl font-black text-white">
                    {formatCurrency(perPerson, 'INR')}
                  </span>
                </div>
                <div className="text-right text-[11px] text-slate-400">
                  <div>Total: {formatCurrency(total, 'INR')}</div>
                  <div className="text-emerald-400">Tip: {formatCurrency(tip, 'INR')}</div>
                </div>
              </div>
            </div>

            {/* Currency Rates Reference */}
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Estimated FX Equivalents (for ₹1,000 INR)
              </span>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-lg bg-[#17181e]">
                  <span className="text-slate-400 text-[10px] block">USD ($)</span>
                  <span className="font-bold text-white text-xs">$11.56</span>
                </div>
                <div className="p-2 rounded-lg bg-[#17181e]">
                  <span className="text-slate-400 text-[10px] block">EUR (€)</span>
                  <span className="font-bold text-white text-xs">€10.85</span>
                </div>
                <div className="p-2 rounded-lg bg-[#17181e]">
                  <span className="text-slate-400 text-[10px] block">AED (د.إ)</span>
                  <span className="font-bold text-white text-xs">42.45 د.إ</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
