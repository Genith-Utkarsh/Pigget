'use client';

import React from 'react';
import {
  Utensils,
  Compass,
  ShoppingBag,
  Film,
  Zap,
  HeartPulse,
  Plane,
  ShoppingCart,
  Home,
  RotateCw,
  TrendingUp,
  Tag,
  Gift,
  Briefcase,
  LucideIcon,
} from 'lucide-react';

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  food: Utensils,
  transport: Compass,
  shopping: ShoppingBag,
  entertainment: Film,
  bills: Zap,
  health: HeartPulse,
  travel: Plane,
  groceries: ShoppingCart,
  rent: Home,
  subscriptions: RotateCw,
  investments: TrendingUp,
  gifts: Gift,
  salary: Briefcase,
  other: Tag,
};

export interface CategoryIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  name,
  className = 'w-5 h-5',
}) => {
  const IconComponent = CATEGORY_ICONS[name] || Tag;
  return <IconComponent className={className} strokeWidth={2} />;
};
