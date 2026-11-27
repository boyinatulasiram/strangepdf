import React from 'react';

interface ProgressBarProps {
  progress: number;
  statusText?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, statusText = 'Processing document...' }) => {
  return (
    <div className="w-full bg-strange-card border-2 border-strange-tan rounded-xl p-6 shadow-retro space-y-4">
      <div className="flex items-center justify-between text-xs font-mono font-bold text-strange-blood">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-strange-crimson animate-ping" />
          <span>{statusText.toUpperCase()}</span>
        </div>
        <span>{progress}%</span>
      </div>

      {/* Progress track */}
      <div className="w-full h-4 bg-strange-cream rounded-full border border-strange-tan overflow-hidden p-0.5">
        <div
          className="h-full bg-strange-crimson rounded-full transition-all duration-300 relative overflow-hidden"
          style={{ width: `${Math.max(5, progress)}%` }}
        >
          {/* Subtle animated stripe */}
          <div className="absolute inset-0 bg-white/20 bg-stripes animate-pulse" />
        </div>
      </div>

      <p className="text-center text-[11px] font-mono text-strange-tan">
        Securing temporary session • Running isolated transformation
      </p>
    </div>
  );
};
