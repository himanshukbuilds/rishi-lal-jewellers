'use client';

import React from 'react';
import Image from 'next/image';
import { User } from 'lucide-react';
import ChatProductCard from './ChatProductCard';

/**
 * Lightweight helper to render simple markdown bold and lists cleanly without external deps
 */
function FormattedText({ content }) {
  if (!content) return null;

  const lines = content.split('\n');

  return (
    <div className="space-y-1.5 text-xs leading-relaxed">
      {lines.map((line, idx) => {
        if (!line.trim()) {
          return <div key={idx} className="h-1" />;
        }

        // Parse **bold** parts
        const parts = line.split(/(\*\*.*?\*\*)/g);
        const formattedLine = parts.map((part, pIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={pIdx} className="font-semibold text-[#4A0B13]">
                {part.slice(2, -2)}
              </strong>
            );
          }
          return part;
        });

        // Bullet line
        if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
          return (
            <div key={idx} className="flex items-start gap-1.5 pl-1">
              <span className="text-[#C2AA6A] font-bold">•</span>
              <div>{formattedLine}</div>
            </div>
          );
        }

        return <p key={idx}>{formattedLine}</p>;
      })}
    </div>
  );
}

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div className="flex w-full justify-end pl-8">
        <div className="relative rounded-2xl rounded-tr-xs bg-[#4A0B13] px-3.5 py-2.5 text-xs text-white shadow-xs">
          <p className="whitespace-pre-wrap leading-relaxed">{message.text}</p>
          {message.timestamp && (
            <span className="mt-1 block text-right text-[9px] text-white/60">
              {message.timestamp}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-2 pr-6">
      <div className="flex items-start gap-2">
        {/* Halku Assistant Avatar */}
        <div className="relative h-7 w-7 flex-shrink-0 overflow-hidden rounded-full border border-[#C2AA6A] bg-[#4A0B13] shadow-xs">
          <Image
            src="/images/avatar/halku.png"
            alt="Halku"
            fill
            sizes="28px"
            className="object-cover"
          />
        </div>

        {/* Message bubble */}
        <div className="relative flex-1 rounded-2xl rounded-tl-xs border border-[#C2AA6A]/25 bg-white p-3.5 text-[#222222] shadow-2xs">
          <div className="mb-1 flex items-center justify-between">
            <span className="font-serif text-[11px] font-semibold tracking-wide text-[#4A0B13]">
              Halku
            </span>
            {message.timestamp && (
              <span className="text-[9px] text-charcoal-400">
                {message.timestamp}
              </span>
            )}
          </div>

          <FormattedText content={message.text} />
        </div>
      </div>

      {/* Embedded Product Recommendations */}
      {message.products && message.products.length > 0 && (
        <div className="mt-1 pl-9">
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#C2AA6A]">
            Recommended Creations ({message.products.length})
          </p>
          <div className="no-scrollbar flex gap-2.5 overflow-x-auto pb-2 pt-0.5">
            {message.products.map((product) => (
              <ChatProductCard key={product._id || product.slug} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

