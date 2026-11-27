import React from 'react';
import { Ghost, Sparkles, Terminal, Heart, Zap, Cpu } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Title */}
      <div className="text-center space-y-3 pb-8 border-b-2 border-strange-tan">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-strange-card border border-strange-tan rounded-full text-xs font-mono font-bold text-strange-blood">
          <Ghost className="w-4 h-4 text-strange-crimson animate-pulse" />
          <span>PROJECT STRANGEPDF DOSSIER</span>
        </div>
        <h1 className="font-heading text-5xl sm:text-6xl text-strange-blood tracking-wide">
          ABOUT STRANGEPDF
        </h1>
        <p className="font-mono text-xs text-strange-tan max-w-xl mx-auto">
          "Everything You Need for PDFs. Nothing Strange About It."
        </p>
      </div>

      {/* Origin Story */}
      <div className="bg-strange-card border-2 border-strange-tan rounded-2xl p-8 sm:p-10 shadow-retro space-y-4">
        <h2 className="font-heading text-3xl text-strange-blood">
          THE NOSTALGIC MISSION
        </h2>
        <p className="font-body text-sm text-strange-dark/85 leading-relaxed">
          StrangePDF was born from a simple belief: online document utilities shouldn't feel like bland, sterile, corporate software. 
          Drawing inspiration from the mystery, camaraderie, and nostalgic 1980s supernatural sci-fi aesthetic of Hawkins, 
          we created an all-in-one PDF toolkit that's genuinely enjoyable to use, relentlessly fast, and uncompromising on privacy.
        </p>
        <p className="font-body text-sm text-strange-dark/85 leading-relaxed">
          Whether you're a student stitching lecture slides together, a legal professional applying signatures and password protection, 
          or an engineer compressing large blueprints, StrangePDF gives you the entire suite in one friendly place.
        </p>
      </div>

      {/* Tech Specifications */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
        <div className="bg-strange-cream border-2 border-strange-tan rounded-xl p-5 shadow-retro space-y-2">
          <div className="flex items-center gap-2 font-bold text-strange-blood">
            <Cpu className="w-4 h-4 text-strange-crimson" />
            <span>MODERN BACKEND</span>
          </div>
          <p className="text-strange-dark/80">
            Powered by high-performance Python engines (PyMuPDF, pikepdf, OpenPyXL, and ReportLab) for accurate fidelity.
          </p>
        </div>

        <div className="bg-strange-cream border-2 border-strange-tan rounded-xl p-5 shadow-retro space-y-2">
          <div className="flex items-center gap-2 font-bold text-strange-blood">
            <Zap className="w-4 h-4 text-strange-crimson" />
            <span>REAL RESULTS ONLY</span>
          </div>
          <p className="text-strange-dark/80">
            No mock animations or synthetic percentage numbers. Actual mathematical compression bytes and real outputs.
          </p>
        </div>

        <div className="bg-strange-cream border-2 border-strange-tan rounded-xl p-5 shadow-retro space-y-2">
          <div className="flex items-center gap-2 font-bold text-strange-blood">
            <Sparkles className="w-4 h-4 text-strange-crimson" />
            <span>1984 RETRO PALETTE</span>
          </div>
          <p className="text-strange-dark/80">
            Styled in iconic Crimson Red (#C33149), Retro Lime (#A8C256), Warm Cream (#F3D9B1), Vintage Tan (#C29979), and Deep Blood Red (#A22522).
          </p>
        </div>
      </div>

    </div>
  );
};
