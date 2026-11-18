'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  UserPlus,
  Phone,
  ChevronRight,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { useContacts } from '@/lib/hooks/use-contacts';
import { useKhataStore } from '@/lib/stores/khata-store';
import { formatCurrency } from '@/lib/utils/currency';
import { Contact } from '@/lib/types';

interface KhataListProps {
  onSelectContact?: (contact: Contact) => void;
}

export const KhataList: React.FC<KhataListProps> = ({ onSelectContact }) => {
  const {
    searchQuery,
    setSearchQuery,
    setSelectedContact,
    toggleAddContact,
  } = useKhataStore();

  const { data: contacts = [], isLoading } = useContacts(searchQuery);

  // Compute total "You'll Get" (positive balances) and "You'll Give" (negative balances)
  const totalYoullGet = contacts
    .filter((c) => c.netBalance > 0)
    .reduce((sum, c) => sum + c.netBalance, 0);

  const totalYoullGive = contacts
    .filter((c) => c.netBalance < 0)
    .reduce((sum, c) => sum + Math.abs(c.netBalance), 0);

  const handleContactClick = (contact: Contact) => {
    setSelectedContact(contact);
    if (onSelectContact) {
      onSelectContact(contact);
    }
  };

  return (
    <div className="w-full max-w-[540px] mx-auto space-y-4">
      {/* Top Net Totals Card */}
      <GlassCard variant="primary" className="p-4 md:p-5 bg-[#121317]/95">
        <div className="grid grid-cols-2 gap-3 divide-x divide-white/[0.08]">
          {/* You'll Get */}
          <div className="pr-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 mb-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>You&apos;ll Get</span>
            </div>
            <div className="text-2xl md:text-3xl font-extrabold text-emerald-400">
              {formatCurrency(totalYoullGet, 'INR', { compact: true })}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              from {contacts.filter((c) => c.netBalance > 0).length} contacts
            </div>
          </div>

          {/* You'll Give */}
          <div className="pl-4">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-400 mb-1">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>You&apos;ll Give</span>
            </div>
            <div className="text-2xl md:text-3xl font-extrabold text-rose-400">
              {formatCurrency(totalYoullGive, 'INR', { compact: true })}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              to {contacts.filter((c) => c.netBalance < 0).length} contacts
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Search Bar & Add Contact Button */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search customer by name or phone..."
            className="w-full bg-[#17181e]/90 text-sm text-slate-200 placeholder-slate-500 pl-10 pr-4 py-2.5 rounded-full border border-white/[0.08] focus:outline-none focus:border-blue-500/50 transition-colors"
          />
        </div>
        <GlassButton
          variant="secondary"
          size="md"
          onClick={() => toggleAddContact(true)}
          className="shrink-0 flex items-center gap-1.5"
        >
          <UserPlus className="w-4 h-4 text-blue-400" />
          <span className="hidden sm:inline">Add Customer</span>
        </GlassButton>
      </div>

      {/* Contacts List */}
      <div className="space-y-2">
        {isLoading ? (
          <div className="text-center py-10 text-slate-500 text-sm">
            Loading Khata records...
          </div>
        ) : contacts.length === 0 ? (
          <GlassCard variant="secondary" className="p-8 text-center">
            <p className="text-slate-400 text-sm">No customers found.</p>
            <GlassButton
              variant="primary"
              size="sm"
              onClick={() => toggleAddContact(true)}
              className="mt-3"
            >
              Add First Customer
            </GlassButton>
          </GlassCard>
        ) : (
          contacts.map((contact) => {
            const isOwed = contact.netBalance > 0;
            const owesYou = contact.netBalance < 0;

            return (
              <motion.div
                key={contact.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleContactClick(contact)}
                className="group relative cursor-pointer"
              >
                <GlassCard
                  variant="secondary"
                  className="p-3.5 flex items-center justify-between hover:border-white/20 transition-all bg-[#17181e]/90"
                >
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-11 h-11 rounded-[16px] bg-gradient-to-br from-slate-700 to-slate-800 border border-white/10 flex items-center justify-center text-slate-200 font-bold text-base shadow-sm">
                      {contact.contactName.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-slate-100 group-hover:text-blue-400 transition-colors">
                        {contact.contactName}
                      </h4>
                      {contact.contactPhone && (
                        <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{contact.contactPhone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Net Balance Tag */}
                  <div className="text-right flex items-center gap-3">
                    <div>
                      <div
                        className={`text-base font-bold ${
                          isOwed
                            ? 'text-emerald-400'
                            : owesYou
                            ? 'text-rose-400'
                            : 'text-slate-400'
                        }`}
                      >
                        {formatCurrency(Math.abs(contact.netBalance), 'INR')}
                      </div>
                      <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                        {isOwed ? "You'll Get" : owesYou ? "You'll Give" : 'Settled'}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                  </div>
                </GlassCard>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};
