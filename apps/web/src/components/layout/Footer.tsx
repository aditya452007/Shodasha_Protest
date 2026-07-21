import React from 'react';
import Link from 'next/link';
import { Users, ShieldCheck, Landmark, Twitter, Github, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-950 border-t border-gray-800/60 mt-16 pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4 group inline-flex">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
                <Landmark className="w-4 h-4" />
              </div>
              <div>
                <span className="font-extrabold text-md tracking-wider text-gray-100 uppercase leading-none">
                  SHODASHA
                </span>
              </div>
            </Link>
            <p className="text-[14px] text-gray-400 max-w-sm leading-relaxed mb-6">
              An open, public community publishing platform documenting peaceful demonstrations, visitor perspectives, policy discussions, and eyewitness updates at Jantar Mantar, New Delhi.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-9 h-9 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links Column 1 */}
          <div>
            <h4 className="font-bold text-gray-100 text-[13px] tracking-wider uppercase mb-4">Platform</h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">All Discussions</Link></li>
              <li><Link href="/trending" className="text-sm text-gray-400 hover:text-white transition-colors">Trending Topics</Link></li>
              <li><Link href="/latest" className="text-sm text-gray-400 hover:text-white transition-colors">Latest Updates</Link></li>
              <li><Link href="/create" className="text-sm text-gray-400 hover:text-white transition-colors">Submit Report</Link></li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h4 className="font-bold text-gray-100 text-[13px] tracking-wider uppercase mb-4">Community</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Guidelines</Link></li>
              <li><Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Moderation Policy</Link></li>
              <li><Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800/60 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Shodasha Civic Forum. Open Source.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-400">
            <div className="flex items-center gap-2 bg-gray-900/50 px-3 py-1.5 rounded-full border border-gray-800/50">
              <Users className="w-3.5 h-3.5 text-amber-500" />
              <span>Open Dialogue</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-900/50 px-3 py-1.5 rounded-full border border-gray-800/50">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Moderated</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-900/50 px-3 py-1.5 rounded-full border border-gray-800/50">
              <MapPin className="w-3.5 h-3.5 text-orange-400" />
              <span>New Delhi, IN</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
