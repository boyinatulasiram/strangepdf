import React from 'react';
import { Ghost, ShieldCheck, Sparkles, Terminal } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  return (
    <header className="sticky top-0 z-50 bg-strange-cream/95 backdrop-blur-md border-b-2 border-strange-tan shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <button 
          onClick={() => onNavigate('home')} 
          className="flex items-center gap-3 group text-left transition-transform active:scale-95"
        >
          <div className="w-12 h-12 bg-strange-crimson rounded-lg border-2 border-strange-blood flex items-center justify-center shadow-retro-crimson group-hover:rotate-6 transition-transform">
            <Ghost className="w-7 h-7 text-strange-cream animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading text-3xl tracking-wider text-strange-blood group-hover:text-strange-crimson transition-colors">
                STRANGE<span className="text-strange-crimson group-hover:text-strange-blood">PDF</span>
              </span>
              <span className="px-2 py-0.5 text-xs font-mono font-bold bg-strange-lime/30 text-strange-blood border border-strange-lime rounded">
                1984
              </span>
            </div>
            <p className="text-xs font-mono font-bold text-strange-tan -mt-1 tracking-tight">
              THE UPSIDE-DOWN TOOLKIT
            </p>
          </div>
        </button>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-2">
          <button
            onClick={() => onNavigate('home')}
            className={`px-4 py-2 font-mono font-bold text-sm rounded-md transition-all ${
              currentView === 'home'
                ? 'bg-strange-tan/30 text-strange-blood border-b-2 border-strange-crimson'
                : 'text-strange-dark hover:text-strange-crimson hover:bg-strange-tan/20'
            }`}
          >
            HOME
          </button>
          
          <button
            onClick={() => onNavigate('all-tools')}
            className={`px-4 py-2 font-mono font-bold text-sm rounded-md transition-all ${
              currentView === 'all-tools'
                ? 'bg-strange-tan/30 text-strange-blood border-b-2 border-strange-crimson'
                : 'text-strange-dark hover:text-strange-crimson hover:bg-strange-tan/20'
            }`}
          >
            ALL TOOLS
          </button>

          <button
            onClick={() => onNavigate('about')}
            className={`px-4 py-2 font-mono font-bold text-sm rounded-md transition-all ${
              currentView === 'about'
                ? 'bg-strange-tan/30 text-strange-blood border-b-2 border-strange-crimson'
                : 'text-strange-dark hover:text-strange-crimson hover:bg-strange-tan/20'
            }`}
          >
            ABOUT
          </button>

          <button
            onClick={() => onNavigate('privacy')}
            className={`px-4 py-2 font-mono font-bold text-sm rounded-md transition-all ${
              currentView === 'privacy'
                ? 'bg-strange-tan/30 text-strange-blood border-b-2 border-strange-crimson'
                : 'text-strange-dark hover:text-strange-crimson hover:bg-strange-tan/20'
            }`}
          >
            PRIVACY
          </button>
        </nav>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('all-tools')}
            className="flex items-center gap-2 px-5 py-2.5 bg-strange-crimson hover:bg-strange-blood text-strange-cream font-mono font-bold text-sm rounded-md border-2 border-strange-blood shadow-retro-crimson hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
          >
            <Sparkles className="w-4 h-4 text-strange-lime animate-spin" style={{ animationDuration: '6s' }} />
            <span>EXPLORE TOOLS</span>
          </button>
        </div>

      </div>
    </header>
  );
};
