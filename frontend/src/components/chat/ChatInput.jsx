'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';

export default function ChatInput({ onSend, isLoading, placeholder }) {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  // Auto resize height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 100)}px`;
    }
  }, [text]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!text.trim() || isLoading) return;
    onSend(text.trim());
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-end gap-2 border-t border-[#C2AA6A]/20 bg-white p-3"
    >
      <div className="relative flex-1">
        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          placeholder={placeholder || 'Ask about bridal sets, gold, diamond rings, budget...'}
          className="w-full resize-none rounded-xl border border-charcoal-200 bg-ivory-50/70 px-3 py-2 text-xs text-[#4A0B13] placeholder-charcoal-400 focus:border-[#C2AA6A] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#C2AA6A] disabled:opacity-50"
        />
      </div>

      <button
        type="submit"
        disabled={!text.trim() || isLoading}
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[#4A0B13] text-[#C2AA6A] shadow-xs transition-all duration-200 hover:bg-[#8B1E2D] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        title="Send message"
      >
        <Send className="h-4 w-4" />
      </button>
    </form>
  );
}

