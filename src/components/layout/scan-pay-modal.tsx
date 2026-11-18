'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCreateTransaction } from '@/lib/hooks/use-transactions';
import { formatCurrency, parseCurrencyInput } from '@/lib/utils/currency';

export interface ScanPayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScanPayModal: React.FC<ScanPayModalProps> = ({ isOpen, onClose }) => {
  const [upiId, setUpiId] = useState('');
  const [payAmount, setPayAmount] = useState('');
  const [note, setNote] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const createTxMutation = useCreateTransaction();

  if (!isOpen) return null;

  const numeric = parseCurrencyInput(payAmount);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!numeric || numeric <= 0) return;

    try {
      await createTxMutation.mutateAsync({
        title: note.trim() || `Instant UPI to ${upiId || 'Merchant'}`,
        totalAmount: numeric,
        currency: 'INR',
        category: 'Shopping',
        type: 'PERSONAL',
        paidById: 'usr-self',
        notes: `Paid via Instant QR Scan to ${upiId || 'Verified UPI Merchant'}`,
      });

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setUpiId('');
        setPayAmount('');
        setNote('');
        onClose();
      }, 1500);
    } catch (err) {
      console.error(err);
    }
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
          className="relative z-10 w-full max-h-[90vh] md:max-w-md bg-[#121317]/95 border border-white/[0.09] rounded-t-[28px] md:rounded-[30px] shadow-2xl p-6 flex flex-col gap-4 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <QrCode className="w-5 h-5 text-blue-400" />
                <span>Instant Scan & Pay</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Simulated UPI QR Scanner with auto-recorded ledger entry.
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

          {isSuccess ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center justify-center py-10 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-4 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">
                Payment Successful!
              </h3>
              <p className="text-sm text-slate-300 font-semibold">
                {formatCurrency(numeric, 'INR')} debited & logged
              </p>
              <p className="text-xs text-slate-400 mt-1">
                To {upiId || 'Verified Merchant'}
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handlePay} className="space-y-4">
              {/* QR Scanner Viewfinder Simulation */}
              <div className="relative w-full h-36 rounded-2xl bg-[#17181e] border border-dashed border-blue-500/40 flex flex-col items-center justify-center overflow-hidden group">
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-pulse -top-1" />
                <QrCode className="w-12 h-12 text-blue-400/80 mb-2" />
                <span className="text-xs text-slate-300 font-medium">
                  Camera Viewfinder Active
                </span>
                <span className="text-[10px] text-slate-500">
                  Point at any BharatPe, Paytm, or GPay QR
                </span>
              </div>

              {/* UPI ID / Merchant */}
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">
                  UPI ID / Payee VPA
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="e.g. coffee@okaxis or 9876543210@upi"
                  className="w-full bg-[#181920]/80 text-sm text-slate-200 placeholder-slate-500 px-3.5 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-blue-500/50"
                />
              </div>

              {/* Amount */}
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">
                  Amount (₹)
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={payAmount}
                  onChange={(e) =>
                    setPayAmount(e.target.value.replace(/[^0-9.]/g, ''))
                  }
                  placeholder="₹ 0.00"
                  className="w-full bg-[#181920]/80 text-2xl font-bold text-white placeholder-slate-600 px-3.5 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-blue-500/50"
                  required
                />
              </div>

              {/* Note */}
              <div>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add note (optional)"
                  className="w-full bg-[#181920]/80 text-xs text-slate-200 placeholder-slate-500 px-3.5 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-blue-500/50"
                />
              </div>

              {/* Security Hint */}
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 px-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Simulated NPCI 256-bit sandbox tunnel</span>
              </div>

              {/* Pay Action Button */}
              <button
                type="submit"
                disabled={!numeric || numeric <= 0 || createTxMutation.isPending}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Pay & Auto-Log to Pigget</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
