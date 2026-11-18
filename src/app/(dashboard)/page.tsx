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
      label: 'Personal',
      icon: <Sparkles className="w-3.5 h-3.5 text-blue-400" />,
    },
    {
      id: 'split',
      label: 'Groups',
      icon: <Users className="w-3.5 h-3.5 text-indigo-400" />,
      badge: groups.length.toString(),
    },
    {
      id: 'khata',
      label: 'Khata',
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
      <div className="w-full max-w-[540px] px-2">
        <AnimatePresence mode="wait">
          {activeTab === 'personal' && (
            <motion.div
              key="personal-tab"
              initial={{ opacity: 0, y: 8, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ type: 'spring', stiffness: 280, damping: 30, mass: 0.8 }}
              className="flex flex-col items-center w-full"
            >
              {/* Main Superbridge-style Centered Card */}
              <ExpenseCard />
            </motion.div>
          )}

          {activeTab === 'split' && (
            <motion.div
              key="split-tab"
              initial={{ opacity: 0, y: 8, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ type: 'spring', stiffness: 280, damping: 30, mass: 0.8 }}
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
              initial={{ opacity: 0, y: 8, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ type: 'spring', stiffness: 280, damping: 30, mass: 0.8 }}
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
