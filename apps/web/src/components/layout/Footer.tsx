import React from 'react';
import Link from 'next/link';
import { Users, ShieldCheck, Landmark, Twitter, Github, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-50 border-t-2 border-neutral-950 mt-20 pt-14 pb-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 inline-flex group">
              <div className="w-8 h-8 rounded bg-neutral-950 flex items-center justify-center text-white font-bold">
                <Landmark className="w-4 h-4 text-amber-400" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-black text-lg tracking-tight text-neutral-950 uppercase leading-none">
                  SHODASHA
                </span>
                <span className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest leading-none mt-1">
                  Jantar Mantar Civic Forum
                </span>
              </div>
            </Link>
            <p className="text-xs text-neutral-600 max-w-md leading-relaxed">
              An open civic publication and community discussion platform documenting peaceful demonstrations, policy analyses, eyewitness updates, and visitor perspectives centered at Jantar Mantar, New Delhi.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="w-8 h-8 rounded border border-neutral-300 bg-white flex items-center justify-center text-neutral-700 hover:text-white hover:bg-neutral-950 hover:border-neutral-950 transition-colors" aria-label="Twitter">
                <Twitter className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="w-8 h-8 rounded border border-neutral-300 bg-white flex items-center justify-center text-neutral-700 hover:text-white hover:bg-neutral-950 hover:border-neutral-950 transition-colors" aria-label="Github">
                <Github className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="w-8 h-8 rounded border border-neutral-300 bg-white flex items-center justify-center text-neutral-700 hover:text-white hover:bg-neutral-950 hover:border-neutral-950 transition-colors" aria-label="Contact Email">
                <Mail className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Directory Links Column 1 */}
          <div>
            <h4 className="font-serif font-bold text-neutral-950 text-xs tracking-wider uppercase mb-4 border-b border-neutral-200 pb-2">
              Directory
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/" className="text-neutral-700 hover:text-neutral-950 hover:underline transition-colors font-medium">All Dispatches</Link></li>
              <li><Link href="/trending" className="text-neutral-700 hover:text-neutral-950 hover:underline transition-colors font-medium">Trending Rallies</Link></li>
              <li><Link href="/latest" className="text-neutral-700 hover:text-neutral-950 hover:underline transition-colors font-medium">Eyewitness Feed</Link></li>
              <li><Link href="/create" className="text-neutral-700 hover:text-neutral-950 hover:underline transition-colors font-medium">Submit Report</Link></li>
            </ul>
          </div>

          {/* Directory Links Column 2 */}
          <div>
            <h4 className="font-serif font-bold text-neutral-950 text-xs tracking-wider uppercase mb-4 border-b border-neutral-200 pb-2">
              Civic Standards
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="#" className="text-neutral-700 hover:text-neutral-950 hover:underline transition-colors font-medium">Community Guidelines</Link></li>
              <li><Link href="#" className="text-neutral-700 hover:text-neutral-950 hover:underline transition-colors font-medium">Eyewitness Verification</Link></li>
              <li><Link href="#" className="text-neutral-700 hover:text-neutral-950 hover:underline transition-colors font-medium">Terms of Service</Link></li>
              <li><Link href="#" className="text-neutral-700 hover:text-neutral-950 hover:underline transition-colors font-medium">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-neutral-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-neutral-500 font-medium">
            &copy; {new Date().getFullYear()} Shodasha Civic Forum. Open Access Citizen Platform.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-neutral-700 font-medium">
            <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded border border-neutral-200">
              <Users className="w-3 h-3 text-amber-600" />
              <span>Public Civic Forum</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded border border-neutral-200">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>Fact Moderated</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded border border-neutral-200">
              <MapPin className="w-3 h-3 text-red-600" />
              <span>Jantar Mantar, New Delhi</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

