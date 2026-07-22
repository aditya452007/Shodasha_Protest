'use client';

import React from 'react';
import { LayoutGrid, List } from 'lucide-react';

export type FeedViewMode = 'cards' | 'compact';

interface FeedViewToggleProps {
  viewMode: FeedViewMode;
  onViewModeChange: (mode: FeedViewMode) => void;
}

export const FeedViewToggle: React.FC<FeedViewToggleProps> = ({
  viewMode,
  onViewModeChange,
}) => {
  return (
    <div className="flex bg-neutral-100 border border-neutral-200 rounded p-0.5">
      <button
        onClick={() => onViewModeChange('cards')}
        className={`p-1.5 rounded transition-all cursor-pointer flex items-center gap-1 text-xs font-semibold ${
          viewMode === 'cards'
            ? 'bg-neutral-950 text-white shadow-sm'
            : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-200/60'
        }`}
        title="Cards View"
        aria-label="Cards View"
      >
        <LayoutGrid className="w-3.5 h-3.5" />
        <span className="hidden md:inline">Cards</span>
      </button>

      <button
        onClick={() => onViewModeChange('compact')}
        className={`p-1.5 rounded transition-all cursor-pointer flex items-center gap-1 text-xs font-semibold ${
          viewMode === 'compact'
            ? 'bg-neutral-950 text-white shadow-sm'
            : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-200/60'
        }`}
        title="Compact List View"
        aria-label="Compact List View"
      >
        <List className="w-3.5 h-3.5" />
        <span className="hidden md:inline">Compact</span>
      </button>
    </div>
  );
};
