import React from 'react';
import { ArrowRight, Sparkles, Shield, Zap, FileText, Lock, RefreshCw, Layers } from 'lucide-react';
import { TOOLS } from '../data/tools';
import { ToolCard } from '../components/ToolCard';

interface HomeProps {
  onSelectTool: (toolId: string) => void;
  onNavigate: (view: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onSelectTool, onNavigate }) => {
  const popularTools = TOOLS.filter((t) => t.popular);

  return (
    <div className="space-y-20">
      
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden text-center">
        
        {/* Retro Grid Subtle Glow Behind Hero */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-strange-crimson/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative max-w-4xl mx-auto space-y-6">
          
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-strange-card border-2 border-strange-tan rounded-full shadow-retro text-xs font-mono font-bold text-strange-blood">
            <span className="w-2 h-2 rounded-full bg-strange-crimson animate-ping" />
            <span>HAWKINS LAB • 1980s SUPERNATURAL SCI-FI TOOLKIT</span>
          </div>

          {/* Main Title */}
          <h1 className="font-heading text-5xl sm:text-7xl lg:text-8xl tracking-wider text-strange-blood leading-none">
            PDFs HAVE NEVER BEEN <br />
            <span className="text-strange-crimson drop-shadow-[0_2px_10px_rgba(195,49,73,0.3)]">
              THIS STRANGE.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg font-body text-strange-dark/80 leading-relaxed">
            Convert, compress, edit and organize your documents with a little retro magic.
            Fast, secure, and completely free — no software to install and no account required.
          </p>

          {/* Hero Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('all-tools')}
              className="w-full sm:w-auto px-8 py-4 bg-strange-crimson hover:bg-strange-blood text-strange-cream font-mono font-bold text-base rounded-lg border-2 border-strange-blood shadow-retro-crimson hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-3"
            >
              <Sparkles className="w-5 h-5 text-strange-lime animate-spin" style={{ animationDuration: '4s' }} />
              <span>EXPLORE ALL 25+ TOOLS</span>
            </button>

            <button
              onClick={() => onSelectTool('compress-pdf')}
              className="w-full sm:w-auto px-8 py-4 bg-strange-card hover:bg-strange-cream text-strange-blood font-mono font-bold text-base rounded-lg border-2 border-strange-tan shadow-retro hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-2"
            >
              <span>COMPRESS A PDF NOW</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* POPULAR TOOLS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b-2 border-strange-tan">
          <div>
            <span className="text-xs font-mono font-bold text-strange-crimson uppercase tracking-widest">
              MOST FREQUENT TRANSMISSIONS
            </span>
            <h2 className="font-heading text-4xl text-strange-blood tracking-wide mt-1">
              POPULAR PDF TOOLS
            </h2>
          </div>
          <button
            onClick={() => onNavigate('all-tools')}
            className="mt-3 md:mt-0 font-mono font-bold text-sm text-strange-blood hover:text-strange-crimson flex items-center gap-1 transition-colors"
          >
            VIEW ALL TOOLS <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} onClick={() => onSelectTool(tool.id)} />
          ))}
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-strange-card border-2 border-strange-tan rounded-2xl p-8 sm:p-12 shadow-retro-lg">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-mono font-bold text-strange-crimson uppercase tracking-widest">
              SIMPLICITY FROM ANOTHER DIMENSION
            </span>
            <h2 className="font-heading text-4xl text-strange-blood tracking-wide mt-1">
              HOW STRANGEPDF WORKS
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-strange-cream border-2 border-strange-tan rounded-xl p-6 relative shadow-retro">
              <div className="w-10 h-10 rounded-full bg-strange-crimson text-strange-cream font-mono font-bold text-lg flex items-center justify-center border-2 border-strange-blood shadow-sm mb-4">
                1
              </div>
              <h3 className="font-heading text-2xl text-strange-blood">UPLOAD DOCUMENT</h3>
              <p className="mt-2 text-xs font-body text-strange-dark/80 leading-relaxed">
                Drag and drop your file into the secure portal. Files are transferred over TLS encryption.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-strange-cream border-2 border-strange-tan rounded-xl p-6 relative shadow-retro">
              <div className="w-10 h-10 rounded-full bg-strange-crimson text-strange-cream font-mono font-bold text-lg flex items-center justify-center border-2 border-strange-blood shadow-sm mb-4">
                2
              </div>
              <h3 className="font-heading text-2xl text-strange-blood">CHOOSE YOUR TOOL</h3>
              <p className="mt-2 text-xs font-body text-strange-dark/80 leading-relaxed">
                Convert, compress, password-protect, sign, or reorder pages with zero complex software configurations.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-strange-cream border-2 border-strange-tan rounded-xl p-6 relative shadow-retro">
              <div className="w-10 h-10 rounded-full bg-strange-lime text-strange-blood font-mono font-bold text-lg flex items-center justify-center border-2 border-strange-blood shadow-sm mb-4">
                3
              </div>
              <h3 className="font-heading text-2xl text-strange-blood">DOWNLOAD & PURGE</h3>
              <p className="mt-2 text-xs font-body text-strange-dark/80 leading-relaxed">
                Grab your processed document instantly. Temporary session files are automatically deleted.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PRIVACY & SECURITY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-strange-dark text-strange-cream border-4 border-strange-blood rounded-2xl p-8 sm:p-14 shadow-retro-lg relative overflow-hidden">
          
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-strange-blood/50 border border-strange-crimson rounded text-xs font-mono text-strange-lime font-bold">
              <Shield className="w-4 h-4" />
              <span>ZERO PERMANENT STORAGE PROTOCOL</span>
            </div>

            <h2 className="font-heading text-4xl sm:text-5xl tracking-wide text-strange-cream">
              YOUR FILES. YOUR BUSINESS.
            </h2>

            <p className="font-body text-sm sm:text-base text-strange-cream/80 leading-relaxed">
              "Your documents are processed securely and are not permanently stored by StrangePDF. 
              Temporary files are automatically deleted after processing and download."
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-xs font-mono">
              <div className="flex items-center gap-2 text-strange-cream/90">
                <span className="w-2 h-2 rounded-full bg-strange-lime" />
                No mandatory accounts or logins
              </div>
              <div className="flex items-center gap-2 text-strange-cream/90">
                <span className="w-2 h-2 rounded-full bg-strange-lime" />
                No 3rd-party conversion API leaks
              </div>
              <div className="flex items-center gap-2 text-strange-cream/90">
                <span className="w-2 h-2 rounded-full bg-strange-lime" />
                Isolated temporary file sandboxing
              </div>
              <div className="flex items-center gap-2 text-strange-cream/90">
                <span className="w-2 h-2 rounded-full bg-strange-lime" />
                Automatic timer-based garbage collection
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
