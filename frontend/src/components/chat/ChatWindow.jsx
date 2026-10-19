'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { X, RotateCcw, AlertCircle } from 'lucide-react';
import ChatMessage from './ChatMessage';
import ChatQuickActions from './ChatQuickActions';
import ChatInput from './ChatInput';
import { api } from '@/services/api';

const INITIAL_WELCOME_MESSAGE = {
  id: 'welcome',
  role: 'model',
  text: "Hi! I'm Halku, your jewellery shopping assistant at Rishi Lal Jewellers. How can I help you today?",
  timestamp: 'Just now',
  products: []
};

const DEFAULT_QUICK_ACTIONS = [
  'Find Jewelry',
  'Bridal Collection',
  'Shop Under ₹50K',
  'Silver Idols',
  'Gold Coins',
  'Help & Support'
];

export default function ChatWindow({ onClose }) {
  const [messages, setMessages] = useState([INITIAL_WELCOME_MESSAGE]);
  const [quickActions, setQuickActions] = useState(DEFAULT_QUICK_ACTIONS);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleResetConversation = () => {
    setMessages([
      {
        ...INITIAL_WELCOME_MESSAGE,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setQuickActions(DEFAULT_QUICK_ACTIONS);
    setErrorMessage(null);
  };

  const handleSendMessage = async (textToSend) => {
    if (!textToSend || isLoading) return;

    setErrorMessage(null);
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Add User message
    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: textToSend,
      timestamp: nowTime
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // 2. Prepare conversation history for the API
    const historyPayload = messages
      .filter((m) => m.id !== 'welcome')
      .map((m) => ({
        role: m.role,
        text: m.text
      }));

    try {
      const response = await api.sendChatMessage(textToSend, historyPayload);

      if (response && response.success) {
        const botMessage = {
          id: `bot-${Date.now()}`,
          role: 'model',
          text: response.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          products: response.products || []
        };
        setMessages((prev) => [...prev, botMessage]);

        if (response.suggestedActions && response.suggestedActions.length > 0) {
          setQuickActions(response.suggestedActions);
        }
      } else {
        throw new Error(response?.reply || 'Unable to connect to assistant');
      }
    } catch (err) {
      console.warn('[ChatWindow] Error in conversation:', err.message);
      setErrorMessage("I'm having trouble assisting you right now. Please try again shortly or contact our support team.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-[#C2AA6A]/40 bg-white shadow-2xl">
      {/* Luxury Header */}
      <header className="relative flex items-center justify-between border-b border-[#C2AA6A]/30 bg-gradient-to-r from-[#4A0B13] via-[#8B1E2D] to-[#4A0B13] px-4 py-3.5 text-white">
        <div className="flex items-center gap-2.5">
          <div className="relative h-9 w-9 overflow-hidden rounded-full border border-[#C2AA6A] bg-[#4A0B13] shadow-xs shrink-0">
            <Image
              src="/images/avatar/halku.png"
              alt="Halku"
              fill
              sizes="36px"
              className="object-cover"
              priority
            />
            <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full border border-[#4A0B13] bg-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-serif text-sm font-semibold tracking-wide text-white">
                Halku
              </h3>
              <span className="rounded bg-[#C2AA6A]/20 px-1.5 py-0.2 text-[9px] font-semibold text-[#E4D4A7]">
                AI ASSISTANT
              </span>
            </div>
            <p className="text-[10px] text-white/70">
              Your Jewellery Assistant
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleResetConversation}
            type="button"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            title="Reset conversation"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={onClose}
            type="button"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            title="Close chatbot"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-ivory-50/70 to-white p-3.5 space-y-3.5">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {/* Typing indicator */}
        {isLoading && (
          <div className="flex items-center gap-2">
            <div className="relative h-7 w-7 overflow-hidden rounded-full border border-[#C2AA6A] shrink-0">
              <Image
                src="/images/avatar/halku.png"
                alt="Halku"
                fill
                sizes="28px"
                className="object-cover"
              />
            </div>
            <div className="rounded-2xl rounded-tl-xs border border-[#C2AA6A]/20 bg-white px-3.5 py-2.5 shadow-2xs">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-medium text-[#4A0B13]">
                  Halku is curating
                </span>
                <span className="flex gap-1">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#C2AA6A]" style={{ animationDelay: '0ms' }} />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#C2AA6A]" style={{ animationDelay: '150ms' }} />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#C2AA6A]" style={{ animationDelay: '300ms' }} />
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Error notification banner */}
        {errorMessage && (
          <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-2.5 text-xs text-red-800">
            <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-600" />
            <p className="flex-1">{errorMessage}</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Action Pills */}
      <ChatQuickActions
        actions={quickActions}
        onSelectAction={handleSendMessage}
        disabled={isLoading}
      />

      {/* Input Bar */}
      <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}

