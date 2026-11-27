import React from 'react';
import { ShieldCheck, Lock, Trash2, Server, EyeOff, Radio } from 'lucide-react';

export const Privacy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Title */}
      <div className="text-center space-y-3 pb-8 border-b-2 border-strange-tan">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-strange-card border border-strange-tan rounded-full text-xs font-mono font-bold text-strange-blood">
          <ShieldCheck className="w-4 h-4 text-strange-lime" />
          <span>ZERO PERMANENT RETENTION PROTOCOL</span>
        </div>
        <h1 className="font-heading text-5xl sm:text-6xl text-strange-blood tracking-wide">
          PRIVACY & SECURITY POLICY
        </h1>
        <p className="font-mono text-xs text-strange-tan max-w-xl mx-auto">
          "Your files. Your business. No secret experiments at Hawkins Lab."
        </p>
      </div>

      {/* Mandatory Official Privacy Notice Callout */}
      <div className="bg-strange-blood/10 border-4 border-strange-blood rounded-2xl p-6 sm:p-8 shadow-retro-crimson space-y-3">
        <div className="flex items-center gap-2 font-mono font-bold text-sm text-strange-blood uppercase tracking-wider">
          <Radio className="w-5 h-5 animate-pulse text-strange-crimson" />
          <span>OFFICIAL PRIVACY GUARANTEE</span>
        </div>
        <p className="font-body text-base sm:text-lg font-bold text-strange-dark leading-relaxed">
          "Your documents are processed securely and are not permanently stored by StrangePDF. 
          Temporary files are automatically deleted after processing and download."
        </p>
      </div>

      {/* Detailed Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="bg-strange-card border-2 border-strange-tan rounded-xl p-6 shadow-retro space-y-3">
          <div className="w-10 h-10 rounded-lg bg-strange-cream border border-strange-tan flex items-center justify-center text-strange-crimson">
            <Trash2 className="w-5 h-5" />
          </div>
          <h3 className="font-heading text-2xl text-strange-blood">AUTOMATIC FILE CLEANUP</h3>
          <p className="text-xs font-body text-strange-dark/80 leading-relaxed">
            All uploaded files and generated outputs are placed in randomized, isolated temporary directories. 
            Once your file is downloaded, or within an automated 30-minute background sweep, all data is permanently purged from disk.
          </p>
        </div>

        <div className="bg-strange-card border-2 border-strange-tan rounded-xl p-6 shadow-retro space-y-3">
          <div className="w-10 h-10 rounded-lg bg-strange-cream border border-strange-tan flex items-center justify-center text-strange-crimson">
            <Server className="w-5 h-5" />
          </div>
          <h3 className="font-heading text-2xl text-strange-blood">IN-HOUSE SERVER PROCESSING</h3>
          <p className="text-xs font-body text-strange-dark/80 leading-relaxed">
            We never route or send your files to external third-party conversion APIs. 
            Every conversion, OCR pass, and document transformation happens right on our own isolated, dedicated backend instances.
          </p>
        </div>

        <div className="bg-strange-card border-2 border-strange-tan rounded-xl p-6 shadow-retro space-y-3">
          <div className="w-10 h-10 rounded-lg bg-strange-cream border border-strange-tan flex items-center justify-center text-strange-crimson">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-heading text-2xl text-strange-blood">NO PASSWORD LOGGING</h3>
          <p className="text-xs font-body text-strange-dark/80 leading-relaxed">
            When you protect or unlock a PDF, credentials exist only in memory during the cryptographic stream cipher operation. 
            Passwords are never stored in databases, server logs, or error monitoring frameworks.
          </p>
        </div>

        <div className="bg-strange-card border-2 border-strange-tan rounded-xl p-6 shadow-retro space-y-3">
          <div className="w-10 h-10 rounded-lg bg-strange-cream border border-strange-tan flex items-center justify-center text-strange-crimson">
            <EyeOff className="w-5 h-5" />
          </div>
          <h3 className="font-heading text-2xl text-strange-blood">ZERO USER TRACKING</h3>
          <p className="text-xs font-body text-strange-dark/80 leading-relaxed">
            No mandatory accounts, no registrations, no marketing trackers. 
            StrangePDF operates as a clean, public productivity utility for everyone.
          </p>
        </div>

      </div>

    </div>
  );
};
