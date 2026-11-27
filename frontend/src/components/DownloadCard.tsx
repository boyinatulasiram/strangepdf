import React from 'react';
import { Download, CheckCircle, ArrowRight, Zap, RefreshCw } from 'lucide-react';
import { CompressionStats } from '../services/api';

interface DownloadCardProps {
  filename: string;
  blob: Blob;
  stats?: CompressionStats;
  onReset: () => void;
}

export const DownloadCard: React.FC<DownloadCardProps> = ({
  filename,
  blob,
  stats,
  onReset
}) => {
  const handleDownload = () => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full bg-strange-card border-2 border-strange-tan rounded-xl p-8 shadow-retro-lg text-center space-y-6">
      
      {/* Success Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-strange-lime/30 text-strange-blood border-2 border-strange-lime rounded-full text-xs font-mono font-bold shadow-sm">
        <CheckCircle className="w-4 h-4 text-strange-blood" />
        <span>DOCUMENT PROCESSED SUCCESSFULLY</span>
      </div>

      <div>
        <h3 className="font-heading text-3xl sm:text-4xl text-strange-blood tracking-wide">
          YOUR FILE IS READY FOR DOWNLOAD
        </h3>
        <p className="mt-1 font-mono text-xs text-strange-tan">
          Processed instantly with zero permanent storage
        </p>
      </div>

      {/* Stats Display (for Compression) */}
      {stats && (
        <div className="bg-strange-cream border-2 border-strange-tan rounded-lg p-5 max-w-md mx-auto grid grid-cols-2 gap-4 text-left font-mono">
          <div>
            <div className="text-[10px] text-strange-tan uppercase font-bold">ORIGINAL SIZE</div>
            <div className="text-sm font-bold text-strange-dark">{formatSize(stats.originalSize)}</div>
          </div>
          <div>
            <div className="text-[10px] text-strange-tan uppercase font-bold">OPTIMIZED SIZE</div>
            <div className="text-sm font-bold text-strange-crimson">{formatSize(stats.compressedSize)}</div>
          </div>
          <div className="col-span-2 pt-3 border-t border-strange-tan/50 flex items-center justify-between">
            <span className="text-xs text-strange-dark/80 font-bold">Reduction:</span>
            <span className={`text-xs px-2 py-0.5 rounded font-bold ${stats.isLarger ? 'bg-strange-crimson/20 text-strange-blood' : 'bg-strange-lime/40 text-strange-blood'}`}>
              {stats.isLarger ? 'File already well optimized' : `-${stats.percentage}% (${formatSize(stats.savingsBytes)})`}
            </span>
          </div>
        </div>
      )}

      {/* Main Download Button */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
        <button
          onClick={handleDownload}
          className="w-full sm:w-auto px-8 py-4 bg-strange-crimson hover:bg-strange-blood text-strange-cream font-mono font-bold text-base rounded-lg border-2 border-strange-blood shadow-retro-crimson hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-3"
        >
          <Download className="w-5 h-5 text-strange-lime animate-bounce" />
          <span>DOWNLOAD {filename}</span>
        </button>

        <button
          onClick={onReset}
          className="w-full sm:w-auto px-6 py-4 bg-strange-cream hover:bg-strange-tan/20 text-strange-blood font-mono font-bold text-sm rounded-lg border-2 border-strange-tan shadow-retro hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>PROCESS ANOTHER</span>
        </button>
      </div>

    </div>
  );
};
