'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Plus,
  TrendingUp,
  TrendingDown,
  ChevronRight,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { GlassButton } from '@/components/ui/glass-button';
import { useGroups } from '@/lib/hooks/use-groups';
import { useGroupStore } from '@/lib/stores/group-store';
import { formatCurrency } from '@/lib/utils/currency';
import { Group } from '@/lib/types';

interface GroupListProps {
  onSelectGroup?: (group: Group) => void;
}

export const GroupList: React.FC<GroupListProps> = ({ onSelectGroup }) => {
  const { setSelectedGroup, toggleCreateGroup } = useGroupStore();
  const { data: groups = [], isLoading } = useGroups();

  // Calculate overall you owe / you are owed across all groups
  const totalOwedToYou = groups
    .filter((g) => (g.userBalance ?? 0) > 0)
    .reduce((sum, g) => sum + (g.userBalance ?? 0), 0);

  const totalYouOwe = groups
    .filter((g) => (g.userBalance ?? 0) < 0)
    .reduce((sum, g) => sum + Math.abs(g.userBalance ?? 0), 0);

  const handleGroupClick = (group: Group) => {
    setSelectedGroup(group);
    if (onSelectGroup) {
      onSelectGroup(group);
    }
  };

  return (
    <div className="w-full max-w-[540px] mx-auto space-y-4">
      {/* Top Split Balances Summary */}
      <GlassCard variant="primary" className="p-4 md:p-5 bg-[#121317]/95">
        <div className="grid grid-cols-2 gap-3 divide-x divide-white/[0.08]">
          <div className="pr-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 mb-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>You are Owed</span>
            </div>
            <div className="text-2xl md:text-3xl font-extrabold text-emerald-400">
              {formatCurrency(totalOwedToYou, 'INR', { compact: true })}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              across active trip groups
            </div>
          </div>

          <div className="pl-4">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-400 mb-1">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>You Owe</span>
            </div>
            <div className="text-2xl md:text-3xl font-extrabold text-rose-400">
              {formatCurrency(totalYouOwe, 'INR', { compact: true })}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              to flatmates & shared tabs
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Header & Create Group Button */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h3 className="text-sm font-semibold text-slate-200">Shared Expense Groups</h3>
          <p className="text-xs text-slate-400">Splitwise-synced group ledgers</p>
        </div>
        <GlassButton
          variant="secondary"
          size="sm"
          onClick={() => toggleCreateGroup(true)}
          className="flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4 text-blue-400" />
          <span>New Group</span>
        </GlassButton>
      </div>

      {/* Group Cards List */}
      <div className="space-y-2">
        {isLoading ? (
          <div className="text-center py-10 text-slate-500 text-sm">
            Loading groups...
          </div>
        ) : groups.length === 0 ? (
          <GlassCard variant="secondary" className="p-8 text-center">
            <p className="text-slate-400 text-sm">No groups found.</p>
            <GlassButton
              variant="primary"
              size="sm"
              onClick={() => toggleCreateGroup(true)}
              className="mt-3"
            >
              Create Your First Group
            </GlassButton>
          </GlassCard>
        ) : (
          groups.map((group) => {
            const balance = group.userBalance ?? 0;
            const isOwed = balance > 0;
            const owes = balance < 0;

            return (
              <motion.div
                key={group.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleGroupClick(group)}
                className="group cursor-pointer"
              >
                <GlassCard
                  variant="secondary"
                  className="p-4 flex items-center justify-between hover:border-white/20 transition-all bg-[#17181e]/90"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-[18px] bg-blue-600/15 border border-blue-500/20 flex items-center justify-center text-xl shadow-inner">
                      👥
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-100 group-hover:text-blue-400 transition-colors">
                        {group.name}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-slate-400" />
                          {group.memberCount || group.members?.length || 1} members
                        </span>
                        {group.simplifyDebts && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            Smart Debt Minimized
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-right">
                    <div>
                      <div
                        className={`text-base font-bold ${
                          isOwed
                            ? 'text-emerald-400'
                            : owes
                            ? 'text-rose-400'
                            : 'text-slate-400'
                        }`}
                      >
                        {balance !== 0
                          ? `${isOwed ? '+' : '-'}${formatCurrency(
                              Math.abs(balance),
                              group.currency
                            )}`
                          : 'Settled Up'}
                      </div>
                      <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                        {isOwed ? 'you get' : owes ? 'you owe' : 'all clean'}
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
