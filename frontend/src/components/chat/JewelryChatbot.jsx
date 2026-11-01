'use client';

import React, { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import ChatWindow from './ChatWindow';
import RivaAvatar from './RivaAvatar';

export default function JewelryChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasPrompted, setHasPrompted] = useState(false);

  // Esc key listener to close chatbot
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Subtle delayed invitation prompt for first-time visitors
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasPrompted(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <aside aria-label="RIVA - Personal Jewellery Assistant" className="fixed bottom-5 right-5 z-50 print:hidden">
      {/* Active Floating Chat Window */}
      {isOpen && (
        <div className="fixed inset-x-3 bottom-3 top-20 z-50 flex sm:inset-auto sm:bottom-6 sm:right-6 sm:h-[590px] sm:w-[420px] transition-all duration-300 ease-out animate-in fade-in slide-in-from-bottom-5">
          <ChatWindow onClose={() => setIsOpen(false)} />
        </div>
      )}

      {/* Floating Trigger Button (when closed) */}
      {!isOpen && (
        <div className="relative flex items-center">
          {/* Subtle Invitation Pill */}
          {hasPrompted && (
            <div
              onClick={() => setIsOpen(true)}
              className="mr-3 hidden cursor-pointer items-center gap-2 rounded-full border border-[#C2AA6A]/50 bg-white/95 px-3 py-1.5 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-[#C2AA6A] hover:bg-white md:flex"
            >
              <RivaAvatar size="xs" />
              <span className="font-serif text-xs font-medium text-[#4A0B13]">
                Ask RIVA
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setHasPrompted(false);
                }}
                className="ml-1 text-charcoal-400 hover:text-charcoal-600"
                title="Dismiss tip"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}

          {/* Luxury Floating Button with RIVA Icon */}
          <button
            onClick={() => setIsOpen(true)}
            type="button"
            className="group relative flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#C2AA6A] bg-[#4A0B13] p-0.5 shadow-xl transition-all duration-300 hover:scale-105 hover:border-[#E4D4A7] hover:shadow-2xl active:scale-95 cursor-pointer"
            aria-label="Open RIVA - Personal Jewellery Assistant"
            title="Chat with RIVA - Personal Jewellery Assistant"
          >
            {/* Pulsing ring */}
            <span className="absolute -inset-1 rounded-full border border-[#C2AA6A]/40 animate-ping opacity-60 pointer-events-none" />

            <RivaAvatar size="lg" showStatus={true} />
          </button>
        </div>
      )}
    </aside>
  );
}

