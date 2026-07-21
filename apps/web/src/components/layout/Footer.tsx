import React from 'react';
import { Users, ShieldCheck, Landmark } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-950 border-t border-gray-800/80 mt-16 py-10">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div>
          <h4 className="font-bold text-gray-200 text-sm tracking-wider uppercase">
            SHODASHA | JANTAR MANTAR CIVIC FORUM
          </h4>
          <p className="text-xs text-gray-400 mt-1 max-w-md">
            An open, public community publishing platform documenting peaceful demonstrations, visitor perspectives, policy discussions, and eyewitness updates at Jantar Mantar, New Delhi.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center md:justify-end gap-6 text-xs text-gray-400">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-amber-500" />
            <span>Open Civic Dialogue</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Community Moderated</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Landmark className="w-4 h-4 text-orange-400" />
            <span>Jantar Mantar Focus</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
