'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExpenseStore } from '@/lib/stores/expense-store';

export interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuCard {
  id: string;
  title: string;
  description: string;
  iconText: string;
  gradient: string;
  action: () => void;
}

export const MenuModal: React.FC<MenuModalProps> = ({ isOpen, onClose }) => {
  const { setActiveTab, setActiveDockModal, setIsActivityOpen } = useExpenseStore();

  const cards: MenuCard[] = [
    {
      id: 'profile',
      title: 'Pigget ID',
      description: 'pigget@upi • Verified Ledger Identity',
      iconText: '🐷',
      gradient: 'from-blue-600/30 via-indigo-600/20 to-purple-600/30',
      action: () => {
        onClose();
        setActiveDockModal('vault');
      },
    },
    {
      id: 'categories',
      title: 'Categories & Caps',
      description: 'Manage monthly envelopes & spending caps.',
      iconText: '🗂️',
      gradient: 'from-purple-600/30 via-pink-600/20 to-rose-600/30',
      action: () => {
        onClose();
        setActiveDockModal('categories');
      },
    },
    {
      id: 'splitwise',
      title: 'Group Splits',
      description: 'Directed graph debt minimization for trips & flats.',
      iconText: '👥',
      gradient: 'from-emerald-600/30 via-teal-600/20 to-cyan-600/30',
      action: () => {
        onClose();
        setActiveTab('split');
      },
    },
    {
      id: 'khata',
      title: 'Khata Ledger',
      description: 'Udhaar tracking with WhatsApp reminder links.',
      iconText: '📖',
      gradient: 'from-lime-600/30 via-amber-600/20 to-orange-600/30',
      action: () => {
        onClose();
        setActiveTab('khata');
      },
    },
    {
      id: 'reports',
      title: 'Insights & Trends',
      description: 'Deep spending charts & category analytics.',
      iconText: '📊',
      gradient: 'from-cyan-600/30 via-blue-600/20 to-indigo-600/30',
      action: () => {
        onClose();
        setActiveDockModal('reports');
      },
    },
    {
      id: 'activity',
      title: 'Audit Trail',
      description: 'Filterable real-time transaction history.',
      iconText: '⚡',
      gradient: 'from-amber-600/30 via-orange-600/20 to-red-600/30',
      action: () => {
        onClose();
        setIsActivityOpen(true);
      },
    },
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="z-50 fixed inset-0 flex justify-center items-center p-2 sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-xl"
        />

        {/* Superbridge Grid Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          className="relative z-10 w-full max-w-4xl bg-[#121317]/95 border border-white/[0.09] rounded-[32px] shadow-2xl p-6 sm:p-12 overflow-hidden flex flex-col gap-10 my-auto"
        >
          {/* Close button with exact Superbridge cross SVG */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="font-button leading-none cursor-pointer inline-flex gap-1.5 items-center justify-center ring-offset-background focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 bg-[#1c1e25] text-slate-400 hover:text-white border border-white/10 rounded-full h-10 w-10 absolute right-6 top-6 shrink-0 shadow-lg hover:scale-105 active:scale-95 transition-all z-20"
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 fill-slate-300"
            >
              <path d="M36.8963 7.36117C38.0778 6.19973 39.9779 6.21503 41.1395 7.39632C42.3009 8.57781 42.2847 10.478 41.1033 11.6395L28.5291 23.9998L41.1033 36.3602C42.2848 37.5217 42.3 39.4218 41.1385 40.6034C39.977 41.7843 38.0787 41.8006 36.8973 40.6395L24.2498 28.2069L11.6033 40.6395C10.4219 41.8007 8.52265 41.7845 7.36115 40.6034C6.19963 39.4218 6.21574 37.5217 7.39728 36.3602L19.9695 23.9998L7.3963 11.6395C6.21501 10.4779 6.19971 8.57778 7.36115 7.39632C8.52271 6.21533 10.422 6.19983 11.6033 7.36117L24.2498 19.7928L36.8963 7.36117Z" />
            </svg>
          </button>

          {/* Cards Grid: 2 columns on mobile, 3 columns on desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 pt-4">
            {cards.map((card) => (
              <motion.button
                key={card.id}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={card.action}
                className="group flex flex-col text-center justify-start items-center gap-3.5 cursor-pointer outline-none"
              >
                {/* Shiny squircle visual container */}
                <div className="relative overflow-hidden rounded-[26px] sm:rounded-4xl flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 shadow-lg transition-all border border-white/10 group-hover:border-blue-500/50 bg-[#17181e] group-hover:shadow-blue-500/10">
                  <div
                    className={`absolute inset-0 bg-gradient-to-tr ${card.gradient} opacity-40 group-hover:opacity-70 transition-opacity`}
                  />
                  <div className="relative z-10 text-3xl sm:text-4xl select-none transform group-hover:scale-110 transition-transform duration-200">
                    {card.iconText}
                  </div>
                </div>

                {/* Typography */}
                <div className="max-w-[220px]">
                  <p className="text-sm sm:text-base font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors">
                    {card.title}
                  </p>
                  <p className="text-[11px] text-slate-400 tracking-tight mt-0.5 line-clamp-2">
                    {card.description}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Bottom Footer Section with Terms, Privacy and Social SVGs */}
          <div className="w-full flex flex-col md:flex-row justify-center gap-4 items-center pt-6 border-t border-white/[0.06]">
            {/* Terms & Privacy Pill Buttons */}
            <div className="flex gap-4 items-center">
              <div className="bg-[#17181e] border border-white/10 rounded-full flex items-center justify-center p-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="cursor-pointer inline-flex gap-1.5 items-center justify-center rounded-full text-slate-300 hover:text-white hover:bg-white/[0.06] py-1.5 text-xs px-3.5 tracking-tight transition-colors"
                >
                  Terms
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="cursor-pointer inline-flex gap-1.5 items-center justify-center rounded-full text-slate-300 hover:text-white hover:bg-white/[0.06] py-1.5 text-xs px-3.5 tracking-tight transition-colors"
                >
                  Privacy
                </button>
              </div>
            </div>

            {/* Social SVGs: GitHub, Warpcast, X */}
            <div className="bg-[#17181e] border border-white/10 rounded-full flex items-center justify-center gap-1 py-1 px-3">
              {/* GitHub */}
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="p-1.5 text-slate-400 hover:text-white transition-transform hover:scale-110"
                aria-label="GitHub"
              >
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="fill-current h-4 w-auto"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M31.1798 44.9588C30.1273 45.1741 29.7206 44.5042 29.7206 43.9301C29.7206 43.2125 29.7445 40.8921 29.7445 38.0214C29.7445 35.9881 29.0747 34.6963 28.2853 34.0265C33.0696 33.5002 38.0454 31.6822 38.0454 23.4053C38.0454 21.0609 37.232 19.1233 35.8446 17.6401C36.0599 17.1138 36.8014 14.8891 35.6293 11.9228C35.6293 11.9228 33.8351 11.3487 29.7445 14.1236C28.0461 13.6691 26.2041 13.406 24.41 13.406C22.6158 13.406 20.7978 13.6452 19.0754 14.1236C15.0087 11.3487 13.1907 11.9228 13.1907 11.9228C12.0185 14.8891 12.7601 17.0899 12.9754 17.6401C11.6358 19.1472 10.7746 21.0609 10.7746 23.4053C10.7746 31.6822 15.7742 33.5242 20.5107 34.0265C19.9127 34.5528 19.3386 35.5336 19.1711 36.921C17.9272 37.4952 14.8413 38.4281 12.9514 35.1269C12.9514 35.1269 11.8271 33.0696 9.65025 32.9261C9.65025 32.9261 7.56905 32.9261 9.50672 34.2418C9.50672 34.2418 10.9181 34.8877 11.875 37.3756C11.875 37.3756 13.1189 41.227 19.0515 39.9352C19.0515 41.7293 19.0754 43.4278 19.0754 43.9301C19.0754 44.5042 18.6927 45.1741 17.6162 44.9588C9.12397 42.1121 3 34.0504 3 24.5296C3.07177 12.6165 12.6405 3 24.4578 3C36.2752 3 45.8439 12.6165 45.796 24.5296C45.796 34.0504 39.672 42.1121 31.1798 44.9588Z"
                  />
                </svg>
              </a>

              {/* Warpcast */}
              <a
                href="https://warpcast.com"
                target="_blank"
                rel="noreferrer"
                className="p-1.5 text-slate-400 hover:text-white transition-transform hover:scale-110"
                aria-label="Warpcast"
              >
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="fill-current h-3.5 w-auto"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M36.6055 6H10.9231V11.1858H4.09026L5.62179 16.3694H6.91768V37.3395C6.26702 37.3395 5.7396 37.867 5.7396 38.5176V39.9313H5.50399C4.85335 39.9313 4.32586 40.4588 4.32586 41.1095V42.523H17.5205V41.1095C17.5205 40.4588 16.9931 39.9313 16.3424 39.9313H16.1068V38.5176C16.1068 37.867 15.5793 37.3395 14.9287 37.3395H14.6929V25.7919H14.7299C15.1466 21.1684 19.0323 17.5453 23.7643 17.5453C28.4963 17.5453 32.382 21.1684 32.7986 25.7919H32.8355V37.3632C32.2979 37.4723 31.8932 37.9477 31.8932 38.5176V39.9313H31.6577C31.007 39.9313 30.4795 40.4588 30.4795 41.1095V42.523H43.6743V41.1095C43.6743 40.4588 43.1468 39.9313 42.496 39.9313H42.2606V38.5176C42.2606 37.867 41.7331 37.3395 41.0823 37.3395V16.3694H42.3783L43.9097 11.1858H36.6055V6Z"
                  />
                </svg>
              </a>

              {/* X / Twitter */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="p-1.5 text-slate-400 hover:text-white transition-transform hover:scale-110"
                aria-label="X"
              >
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="fill-current h-3.5 w-auto"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M40.928 5L27.0858 21.0903L42.1399 43H31.0678L20.9299 28.2462L8.23733 43H4.95699L19.4736 26.1268L4.95699 5H16.0291L25.6288 18.9712L37.6479 5H40.928ZM21.1221 24.2092L22.5929 26.3128L32.611 40.6428H37.6495L25.3729 23.0826L23.9021 20.9788L14.4577 7.4694H9.41928L21.1221 24.2092Z"
                  />
                </svg>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
