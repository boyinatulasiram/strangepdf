import React from 'react';
import { Ghost, ShieldCheck, Heart, Terminal, Radio } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-strange-dark text-strange-cream border-t-4 border-strange-blood mt-24">
      {/* Radio Frequency Retro Banner */}
      <div className="bg-strange-blood/60 border-b border-strange-blood/80 py-2.5 px-4 text-center font-mono text-xs flex items-center justify-center gap-3">
        <Radio className="w-4 h-4 text-strange-lime animate-pulse" />
        <span className="text-strange-cream tracking-widest uppercase">
          BROADCAST TRANSMISSION: 11.084 MHz • ZERO PERMANENT STORAGE GUARANTEED
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-strange-crimson rounded border border-strange-cream/20 flex items-center justify-center shadow-retro-crimson">
                <Ghost className="w-6 h-6 text-strange-cream" />
              </div>
              <span className="font-heading text-3xl tracking-wider text-strange-cream">
                STRANGE<span className="text-strange-crimson">PDF</span>
              </span>
            </div>
            <p className="text-sm font-body text-strange-cream/70 leading-relaxed">
              "Making PDFs a little less ordinary." Inspired by 1980s supernatural adventures and modern productivity.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-strange-blood/40 border border-strange-blood text-xs font-mono text-strange-lime">
              <ShieldCheck className="w-4 h-4 text-strange-lime" />
              <span>Safe & Private Backend</span>
            </div>
          </div>

          {/* Popular Tools */}
          <div>
            <h4 className="font-mono font-bold text-strange-lime uppercase tracking-wider text-sm mb-4 flex items-center gap-2">
              <Terminal className="w-4 h-4" /> POPULAR TOOLS
            </h4>
            <ul className="space-y-2 text-sm font-mono">
              <li>
                <button onClick={() => onNavigate('tool:word-to-pdf')} className="text-strange-cream/70 hover:text-strange-crimson transition-colors">
                  Word to PDF
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('tool:pdf-to-word')} className="text-strange-cream/70 hover:text-strange-crimson transition-colors">
                  PDF to Word
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('tool:compress-pdf')} className="text-strange-cream/70 hover:text-strange-crimson transition-colors">
                  Compress PDF
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('tool:merge-pdf')} className="text-strange-cream/70 hover:text-strange-crimson transition-colors">
                  Merge PDF
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('tool:pdf-to-jpg')} className="text-strange-cream/70 hover:text-strange-crimson transition-colors">
                  PDF to JPG
                </button>
              </li>
            </ul>
          </div>

          {/* Security & Organization */}
          <div>
            <h4 className="font-mono font-bold text-strange-lime uppercase tracking-wider text-sm mb-4">
              ORGANIZE & SECURE
            </h4>
            <ul className="space-y-2 text-sm font-mono">
              <li>
                <button onClick={() => onNavigate('tool:protect-pdf')} className="text-strange-cream/70 hover:text-strange-crimson transition-colors">
                  Protect PDF
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('tool:remove-pdf-password')} className="text-strange-cream/70 hover:text-strange-crimson transition-colors">
                  Unlock PDF
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('tool:split-pdf')} className="text-strange-cream/70 hover:text-strange-crimson transition-colors">
                  Split PDF
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('tool:sign-pdf')} className="text-strange-cream/70 hover:text-strange-crimson transition-colors">
                  Sign PDF
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('tool:ocr')} className="text-strange-cream/70 hover:text-strange-crimson transition-colors">
                  OCR Text Scanner
                </button>
              </li>
            </ul>
          </div>

          {/* Privacy & Legal */}
          <div>
            <h4 className="font-mono font-bold text-strange-lime uppercase tracking-wider text-sm mb-4">
              ABOUT & PRIVACY
            </h4>
            <ul className="space-y-2 text-sm font-mono">
              <li>
                <button onClick={() => onNavigate('about')} className="text-strange-cream/70 hover:text-strange-crimson transition-colors">
                  About StrangePDF
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('privacy')} className="text-strange-cream/70 hover:text-strange-crimson transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="text-strange-cream/70 hover:text-strange-crimson transition-colors">
                  Contact The Lab
                </button>
              </li>
            </ul>
            <p className="mt-4 text-xs font-mono text-strange-cream/50 leading-relaxed">
              No mandatory sign-ups. No external conversion APIs. Files purged automatically.
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-strange-cream/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-strange-cream/50">
          <p>© 1984 - 2026 StrangePDF. All rights reserved.</p>
          <p className="flex items-center gap-1.5 mt-4 sm:mt-0">
            Engineered with <Heart className="w-3.5 h-3.5 text-strange-crimson fill-strange-crimson" /> for nostalgic productivity.
          </p>
        </div>
      </div>
    </footer>
  );
};
