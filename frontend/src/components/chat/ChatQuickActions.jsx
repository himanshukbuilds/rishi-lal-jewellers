'use client';

import React from 'react';
import { Sparkles, Crown, Gem, Gift, HelpCircle, ShieldCheck } from 'lucide-react';

const ACTION_ICONS = {
  'Find Jewelry': Gem,
  'Bridal Collection': Crown,
  'Shop Under ₹50K': Sparkles,
  'Under ₹50K': Sparkles,
  'Silver Idols': Gift,
  'Gold Coins': Crown,
  'Help & Support': HelpCircle,
  'Help & Policies': ShieldCheck,
  'Natural Diamonds': Gem,
  '22K Heritage Gold': Crown,
};

export default function ChatQuickActions({ actions = [], onSelectAction, disabled }) {
  if (!actions || actions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5 px-3 py-2 border-t border-[#C2AA6A]/20 bg-ivory-50/60">
      {actions.map((action, idx) => {
        const IconComponent = ACTION_ICONS[action] || Sparkles;
        return (
          <button
            key={`${action}-${idx}`}
            type="button"
            disabled={disabled}
            onClick={() => onSelectAction(action)}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#C2AA6A]/40 bg-white px-2.5 py-1 text-[11px] font-medium text-[#4A0B13] shadow-2xs transition-all duration-200 hover:border-[#C2AA6A] hover:bg-[#4A0B13] hover:text-[#C2AA6A] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <IconComponent className="h-3 w-3 text-[#C2AA6A]" />
            <span>{action}</span>
          </button>
        );
      })}
    </div>
  );
}

