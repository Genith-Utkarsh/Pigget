'use client';

import React, { useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, Calendar, User, Phone, CheckCircle2 } from 'lucide-react';
import { FloatingModal } from '@/components/ui/floating-modal';
import { GlassButton } from '@/components/ui/glass-button';
import { useKhataStore } from '@/lib/stores/khata-store';
import { useCreateTransaction } from '@/lib/hooks/use-transactions';
import { useCreateContact } from '@/lib/hooks/use-contacts';
import { parseCurrencyInput } from '@/lib/utils/currency';

export const KhataEntryModal: React.FC = () => {
  const {
    selectedContact,
    setSelectedContact,
    transactionType,
    setTransactionType,
    isTransactionOpen,
    toggleTransaction,
    isAddContactOpen,
    toggleAddContact,
    amount,
    setAmount,
    note,
    setNote,
    reset,
  } = useKhataStore();

  const [date, setDate] = useState<string>('');
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const createTxMutation = useCreateTransaction();
  const createContactMutation = useCreateContact();

  const handleSaveTransaction = async () => {
    const numericAmount = parseCurrencyInput(amount);
    if (!numericAmount || !transactionType || !selectedContact) return;

    try {
      await createTxMutation.mutateAsync({
        title:
          transactionType === 'give'
            ? `Gave to ${selectedContact.contactName}`
            : `Received from ${selectedContact.contactName}`,
        totalAmount: numericAmount,
        currency: 'INR',
        type: transactionType === 'give' ? 'KHATA_GIVE' : 'KHATA_GOT',
        paidById: 'usr-self',
        contactId: selectedContact.id,
        notes: note.trim() || undefined,
        createdAt: date ? new Date(date).toISOString() : new Date().toISOString(),
      });

      // Update local contact net balance in-memory for immediate UI reflection
      const balanceDelta = transactionType === 'give' ? numericAmount : -numericAmount;
      setSelectedContact({
        ...selectedContact,
        netBalance: selectedContact.netBalance + balanceDelta,
      });

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        reset();
      }, 1200);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName.trim()) return;

    try {
      await createContactMutation.mutateAsync({
        ownerId: 'usr-self',
        contactName: newContactName.trim(),
        contactPhone: newContactPhone.trim() || null,
        contactEmail: null,
        netBalance: 0,
      });

      setNewContactName('');
      setNewContactPhone('');
      toggleAddContact(false);
    } catch (err) {
      console.error(err);
    }
  };

  // If "Add Customer" modal is open:
  if (isAddContactOpen) {
    return (
      <FloatingModal
        isOpen={isAddContactOpen}
        onClose={() => toggleAddContact(false)}
        title="Add New Customer"
        description="Add a contact to manage udhaar & credit ledgers"
        size="sm"
      >
        <form onSubmit={handleCreateContact} className="space-y-4 pt-2">
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1.5 uppercase tracking-wider">
              Customer Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={newContactName}
                onChange={(e) => setNewContactName(e.target.value)}
                placeholder="e.g. Ramesh Kumar"
                className="w-full bg-[#17181e] text-slate-200 placeholder-slate-500 pl-10 pr-4 py-2.5 rounded-xl border border-white/[0.08] focus:outline-none focus:border-blue-500/50 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1.5 uppercase tracking-wider">
              Mobile Number (Optional)
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={newContactPhone}
                onChange={(e) => setNewContactPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full bg-[#17181e] text-slate-200 placeholder-slate-500 pl-10 pr-4 py-2.5 rounded-xl border border-white/[0.08] focus:outline-none focus:border-blue-500/50 text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <GlassButton
              type="button"
              variant="secondary"
              onClick={() => toggleAddContact(false)}
              className="flex-1 justify-center"
            >
              Cancel
            </GlassButton>
            <GlassButton
              type="submit"
              variant="primary"
              loading={createContactMutation.isPending}
              className="flex-1 justify-center"
            >
              Save Customer
            </GlassButton>
          </div>
        </form>
      </FloatingModal>
    );
  }

  // Khata Transaction Entry Modal:
  return (
    <FloatingModal
      isOpen={isTransactionOpen}
      onClose={() => {
        if (!isSuccess) toggleTransaction(false);
      }}
      title={
        selectedContact
          ? `Record Entry: ${selectedContact.contactName}`
          : 'Record Khata Entry'
      }
      description="Choose whether you gave or received money"
      size="sm"
    >
      {isSuccess ? (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-3 animate-bounce">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h4 className="text-lg font-bold text-white">Entry Saved</h4>
          <p className="text-xs text-slate-400">Balance updated in Khata book.</p>
        </div>
      ) : (
        <div className="space-y-4 pt-1">
          {/* Two Big Toggle Buttons: You Gave vs You Got */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setTransactionType('give')}
              className={`p-4 rounded-[20px] border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                transactionType === 'give'
                  ? 'bg-rose-500/20 border-rose-500 text-rose-400 shadow-lg shadow-rose-500/10'
                  : 'bg-[#17181e] border-white/10 text-slate-400 hover:text-slate-200 hover:bg-[#1d1f27]'
              }`}
            >
              <ArrowUpRight className="w-6 h-6 text-rose-400" />
              <div className="text-center">
                <div className="text-sm font-bold">You Gave ₹</div>
                <div className="text-[10px] text-slate-400">Customer owes you</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setTransactionType('got')}
              className={`p-4 rounded-[20px] border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                transactionType === 'got'
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-lg shadow-emerald-500/10'
                  : 'bg-[#17181e] border-white/10 text-slate-400 hover:text-slate-200 hover:bg-[#1d1f27]'
              }`}
            >
              <ArrowDownLeft className="w-6 h-6 text-emerald-400" />
              <div className="text-center">
                <div className="text-sm font-bold">You Got ₹</div>
                <div className="text-[10px] text-slate-400">Received payment</div>
              </div>
            </button>
          </div>

          {/* Amount Input */}
          <div className="bg-[#17181e] p-4 rounded-[20px] border border-white/[0.08] text-center">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Enter Amount
            </div>
            <div className="flex items-center justify-center">
              <span className="text-3xl font-bold text-slate-400 mr-1">₹</span>
              <input
                type="text"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="bg-transparent text-white text-4xl font-bold tracking-tight text-center focus:outline-none placeholder-slate-600 w-48"
              />
            </div>
          </div>

          {/* Note Input */}
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">
              Note / Items (Optional)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. 5 bags cement or lunch bill"
              className="w-full bg-[#17181e] text-slate-200 placeholder-slate-500 px-3.5 py-2.5 rounded-xl border border-white/[0.08] focus:outline-none focus:border-blue-500/50 text-sm"
            />
          </div>

          {/* Date Selector */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-400">
                Transaction Date
              </label>
              {!date && (
                <span className="text-[10px] text-blue-400 font-medium">
                  Today
                </span>
              )}
            </div>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#17181e] text-slate-200 pl-10 pr-4 py-2 rounded-xl border border-white/[0.08] focus:outline-none focus:border-blue-500/50 text-sm"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center gap-3 pt-2">
            <GlassButton
              type="button"
              variant="secondary"
              onClick={() => toggleTransaction(false)}
              className="flex-1 justify-center"
            >
              Cancel
            </GlassButton>
            <GlassButton
              type="button"
              variant="primary"
              disabled={!transactionType || !parseCurrencyInput(amount)}
              loading={createTxMutation.isPending}
              onClick={handleSaveTransaction}
              className="flex-1 justify-center"
            >
              Save Entry
            </GlassButton>
          </div>
        </div>
      )}
    </FloatingModal>
  );
};
