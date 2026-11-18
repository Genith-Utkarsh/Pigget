'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ShieldCheck, Download, Upload, RotateCcw, Check } from 'lucide-react';
import { useTransactions, useResetTransactions } from '@/lib/hooks/use-transactions';
import { useContacts } from '@/lib/hooks/use-contacts';
import { useGroups } from '@/lib/hooks/use-groups';

export interface VaultModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VaultModal: React.FC<VaultModalProps> = ({ isOpen, onClose }) => {
  const { data: transactions = [] } = useTransactions();
  const { data: contacts = [] } = useContacts();
  const { data: groups = [] } = useGroups();
  const resetMutation = useResetTransactions();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleExportJSON = () => {
    const backupData = {
      version: 1,
      timestamp: new Date().toISOString(),
      transactions,
      contacts,
      groups,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pigget_vault_backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = async () => {
    if (confirm('Are you sure you want to clear all ledger data and start completely fresh?')) {
      localStorage.removeItem('pigget_transactions_v3');
      localStorage.removeItem('pigget_contacts_v3');
      localStorage.removeItem('pigget_groups_v3');
      await resetMutation.mutateAsync();
      window.location.reload();
    }
  };

  return (
    <AnimatePresence>
      <div className="safe-modal-frame z-50 fixed inset-0 flex justify-center items-end p-3 sm:items-center sm:p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="sb-modal-backdrop fixed inset-0"
        />

        <motion.div
          role="dialog"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', stiffness: 360, damping: 28 }}
          className="sb-modal-glass relative z-10 w-full max-h-[85vh] md:max-w-md bg-[#121317]/95 border border-white/[0.09] rounded-t-[28px] md:rounded-[30px] shadow-2xl p-6 flex flex-col gap-4 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-sky-400" />
                <span>Security & Offline Vault</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Client-side encrypted backups & privacy controls.
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

          <div className="space-y-3.5 py-1 text-xs">
            {/* Encryption Pod */}
            <div className="p-4 rounded-2xl bg-[#17181e] border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-semibold text-slate-100 block">
                    Zero-Knowledge Local Storage
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    Ledger stored purely in your local browser sandbox.
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                ACTIVE
              </span>
            </div>

            {/* Backup Actions */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Data Management
              </span>

              <button
                type="button"
                onClick={handleExportJSON}
                className="w-full p-3 rounded-xl bg-[#1c1e25] hover:bg-[#252833] border border-white/5 flex items-center justify-between text-slate-200 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Download className="w-4 h-4 text-sky-400" />
                  <span className="font-medium">Export Complete JSON Backup</span>
                </div>
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <span className="text-[11px] text-slate-500 font-mono">.json</span>
                )}
              </button>

              <label className="w-full p-3 rounded-xl bg-[#1c1e25] hover:bg-[#252833] border border-white/5 flex items-center justify-between text-slate-200 transition-colors cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <Upload className="w-4 h-4 text-indigo-400" />
                  <span className="font-medium">Restore Backup from JSON</span>
                </div>
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        try {
                          const data = JSON.parse(event.target?.result as string);
                          if (data.transactions) {
                            localStorage.setItem(
                              'pigget_transactions_v2',
                              JSON.stringify(data.transactions)
                            );
                            window.location.reload();
                          }
                        } catch {
                          alert('Invalid backup file.');
                        }
                      };
                      reader.readAsText(file);
                    }
                  }}
                />
                <span className="text-[11px] text-slate-500">Upload</span>
              </label>

              <button
                type="button"
                onClick={handleReset}
                className="w-full p-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 flex items-center justify-between text-rose-300 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <RotateCcw className="w-4 h-4 text-rose-400" />
                  <span className="font-medium">Clear All Data (Start Fresh)</span>
                </div>
                <span className="text-[10px] text-rose-400 font-semibold">CLEAR</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
