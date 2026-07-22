'use client';

import React, { useState } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 z-50 whitespace-nowrap bg-neutral-950 text-white text-[11px] font-medium px-2.5 py-1 rounded shadow-md border border-neutral-800 pointer-events-none animate-in fade-in duration-150">
          {content}
        </div>
      )}
    </div>
  );
};
