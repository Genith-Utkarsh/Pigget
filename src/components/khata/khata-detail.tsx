'use client';

import React from 'react';
import {
  ArrowLeft,
  Phone,
  PlusCircle,
  MinusCircle,
  Calendar,
  MessageCircle,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { Contact } from '@/lib/types';
import { useTransactions } from '@/lib/hooks/use-transactions';
import { useKhataStore } from '@/lib/stores/khata-store';
import { formatCurrency } from '@/lib/utils/currency';

interface KhataDetailProps {
  contact: Contact;
  onBack: () => void;
}

export const KhataDetail: React.FC<KhataDetailProps> = ({ contact, onBack }) => {
  const { setSelectedContact, setTransactionType, toggleTransaction } = useKhataStore();
  const { data: allTransactions = [] } = useTransactions({ contactId: contact.id });

  // Sort chronological for running balance calculation, then reverse for display
  const contactTxs = allTransactions.filter(
    (tx) => tx.contactId === contact.id
  );

  const isOwed = contact.netBalance > 0;
  const owesYou = contact.netBalance < 0;

  const handleOpenEntry = (type: 'give' | 'got') => {
    setSelectedContact(contact);
    setTransactionType(type);
    toggleTransaction(true);
  };

  const handleWhatsAppReminder = () => {
    const formattedAmount = formatCurrency(Math.abs(contact.netBalance), 'INR');
    const msg = isOwed
      ? `Hi ${contact.contactName}, a gentle reminder that an amount of ${formattedAmount} is pending on Pigget Khata book. Kindly settle when convenient. Thanks!`
      : `Hi ${contact.contactName}, I have a recorded pending amount of ${formattedAmount} to give you on Pigget Khata. Let's settle up soon!`;

    const encoded = encodeURIComponent(msg);
    const phoneClean = contact.contactPhone?.replace(/[^0-9]/g, '') || '';
    const url = phoneClean
      ? `https://wa.me/${phoneClean}?text=${encoded}`
      : `https://wa.me/?text=${encoded}`;
    window.open(url, '_blank');
  };

  return (
    <div className="w-full max-w-[540px] mx-auto space-y-4">
      {/* Top Header Card */}
      <GlassCard variant="primary" className="p-5 bg-[#121317]/95">
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Contacts</span>
          </button>

          <GlassButton
            variant="ghost"
            size="sm"
            onClick={handleWhatsAppReminder}
            className="text-xs text-emerald-400 hover:text-emerald-300 gap-1.5"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp Reminder</span>
          </GlassButton>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-[20px] bg-gradient-to-br from-blue-600/30 to-purple-600/30 border border-white/10 flex items-center justify-center text-xl font-bold text-white shadow-lg">
              {contact.contactName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{contact.contactName}</h2>
              {contact.contactPhone && (
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{contact.contactPhone}</span>
                </div>
              )}
            </div>
          </div>

          <div className="text-right">
            <div
              className={`text-2xl font-black ${
                isOwed ? 'text-emerald-400' : owesYou ? 'text-rose-400' : 'text-slate-400'
              }`}
            >
              {formatCurrency(Math.abs(contact.netBalance), 'INR')}
            </div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              {isOwed ? "You'll Get" : owesYou ? "You'll Give" : 'Settled Clean'}
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-white/[0.08]">
          <GlassButton
            variant="secondary"
            onClick={() => handleOpenEntry('give')}
            className="w-full justify-center text-rose-400 hover:bg-rose-500/10 border-rose-500/30 gap-1.5 py-3"
          >
            <MinusCircle className="w-4 h-4" />
            <span>You Gave ₹</span>
          </GlassButton>

          <GlassButton
            variant="secondary"
            onClick={() => handleOpenEntry('got')}
            className="w-full justify-center text-emerald-400 hover:bg-emerald-500/10 border-emerald-500/30 gap-1.5 py-3"
          >
            <PlusCircle className="w-4 h-4" />
            <span>You Got ₹</span>
          </GlassButton>
        </div>
      </GlassCard>

      {/* Transaction History Section */}
      <div>
        <div className="flex items-center justify-between px-1 mb-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Statement & Passbook
          </h3>
          <span className="text-xs text-slate-400">
            {contactTxs.length} {contactTxs.length === 1 ? 'entry' : 'entries'}
          </span>
        </div>

        <div className="space-y-2">
          {contactTxs.length === 0 ? (
            <GlassCard variant="secondary" className="p-8 text-center">
              <p className="text-slate-400 text-sm">No transaction entries yet.</p>
              <div className="flex justify-center gap-3 mt-4">
                <GlassButton size="sm" onClick={() => handleOpenEntry('give')}>
                  Record First Entry
                </GlassButton>
              </div>
            </GlassCard>
          ) : (
            contactTxs.map((tx) => {
              const isGive = tx.type === 'KHATA_GIVE';
              return (
                <GlassCard
                  key={tx.id}
                  variant="secondary"
                  className="p-3.5 flex items-center justify-between bg-[#17181e]/90"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-[14px] flex items-center justify-center font-bold text-sm border ${
                        isGive
                          ? 'bg-rose-500/15 border-rose-500/30 text-rose-400'
                          : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                      }`}
                    >
                      {isGive ? 'GAVE' : 'GOT'}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-100">{tx.title}</div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(tx.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </span>
                        {tx.notes && <span>• {tx.notes}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`text-base font-bold ${
                        isGive ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      {isGive ? '+' : '-'}
                      {formatCurrency(tx.totalAmount, tx.currency)}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {isGive ? 'Customer Owes' : 'Payment Received'}
                    </div>
                  </div>
                </GlassCard>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
