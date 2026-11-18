'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, BookOpen, Sparkles } from 'lucide-react';
import { PillToggle, PillTab } from '@/components/ui/pill-toggle';
import { ExpenseCard } from '@/components/expenses/expense-card';
import { ExpenseReviewModal } from '@/components/expenses/expense-review-modal';
import { KhataList } from '@/components/khata/khata-list';
import { KhataDetail } from '@/components/khata/khata-detail';
import { KhataEntryModal } from '@/components/khata/khata-entry-modal';
import { GroupList } from '@/components/groups/group-list';
import { GroupDetail } from '@/components/groups/group-detail';
import { AddGroupExpenseModal } from '@/components/groups/add-group-expense-modal';
import { SpendingOverview } from '@/components/analytics/spending-overview';
import { useExpenseStore } from '@/lib/stores/expense-store';
import { useKhataStore } from '@/lib/stores/khata-store';
import { useGroupStore } from '@/lib/stores/group-store';
import { useGroups } from '@/lib/hooks/use-groups';
import { useContacts } from '@/lib/hooks/use-contacts';

export default function DashboardPage() {
  const { activeTab, setActiveTab } = useExpenseStore();
  const { selectedContact, setSelectedContact } = useKhataStore();
  const { selectedGroup, setSelectedGroup } = useGroupStore();
  const { data: groups = [] } = useGroups();
  const { data: contacts = [] } = useContacts();

  const tabs: PillTab[] = [
    {
      id: 'personal',
      label: 'Personal Spend',
      icon: <Sparkles className="w-3.5 h-3.5 text-blue-400" />,
    },
    {
      id: 'split',
      label: 'Group Split',
      icon: <Users className="w-3.5 h-3.5 text-indigo-400" />,
      badge: groups.length.toString(),
    },
    {
      id: 'khata',
      label: 'Khata Book',
      icon: <BookOpen className="w-3.5 h-3.5 text-lime-400" />,
      badge: contacts.length.toString(),
    },
  ];

  return (
    <div className="w-full flex flex-col items-center justify-start pb-16">
      {/* Centered Floating Pill Toggle */}
      <div className="mb-6 z-20">
        <PillToggle
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={(id) => {
            setActiveTab(id as 'personal' | 'split' | 'khata');
          }}
        />
      </div>

      {/* Main Content Area with Spring Tab Transitions */}
      <div className="w-full max-w-[620px] px-2">
        <AnimatePresence mode="wait">
          {activeTab === 'personal' && (
            <motion.div
              key="personal-tab"
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              className="space-y-6 flex flex-col items-center"
            >
              {/* Main Superbridge-style Centered 430px Card */}
              <ExpenseCard />

              {/* Compact Monthly Analytics Overview Widget */}
              <div className="w-full max-w-[430px]">
                <SpendingOverview />
              </div>
            </motion.div>
          )}

          {activeTab === 'split' && (
            <motion.div
              key="split-tab"
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            >
              {selectedGroup ? (
                <GroupDetail
                  group={selectedGroup}
                  onBack={() => setSelectedGroup(null)}
                />
              ) : (
                <GroupList onSelectGroup={(grp) => setSelectedGroup(grp)} />
              )}
            </motion.div>
          )}

          {activeTab === 'khata' && (
            <motion.div
              key="khata-tab"
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            >
              {selectedContact ? (
                <KhataDetail
                  contact={selectedContact}
                  onBack={() => setSelectedContact(null)}
                />
              ) : (
                <KhataList onSelectContact={(c) => setSelectedContact(c)} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modals for All Flows */}
      <ExpenseReviewModal />
      <KhataEntryModal />
      <AddGroupExpenseModal />
    </div>
  );
}
