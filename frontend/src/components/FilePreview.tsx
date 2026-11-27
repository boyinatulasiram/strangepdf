import React, { useState } from 'react';
import { ThumbnailData } from '../services/api';
import { Eye, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';

interface FilePreviewProps {
  thumbnails: ThumbnailData[];
  onReorder?: (newOrder: number[]) => void;
}

export const FilePreview: React.FC<FilePreviewProps> = ({ thumbnails, onReorder }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [zoom, setZoom] = useState(1);

  if (!thumbnails || thumbnails.length === 0) return null;

  return (
    <div className="bg-strange-card border-2 border-strange-tan rounded-xl p-4 shadow-retro space-y-4">
      {/* Header controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-strange-tan/40 text-xs font-mono font-bold text-strange-blood">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-strange-crimson" />
          <span>DOCUMENT VIEWER: PAGE {currentPage + 1} OF {thumbnails.length}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom(Math.max(0.6, zoom - 0.2))}
            className="p-1.5 bg-strange-cream hover:bg-strange-tan/20 rounded border border-strange-tan"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] px-1">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom(Math.min(2.0, zoom + 0.2))}
            className="p-1.5 bg-strange-cream hover:bg-strange-tan/20 rounded border border-strange-tan"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main View Area */}
      <div className="w-full flex items-center justify-center p-4 bg-strange-cream/50 rounded border border-strange-tan/40 min-h-[340px] overflow-auto">
        <img
          src={thumbnails[currentPage].image}
          alt={`Page ${currentPage + 1}`}
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
          className="max-h-[460px] object-contain shadow-md rounded transition-transform duration-150 border border-strange-tan"
        />
      </div>

      {/* Pagination & Thumbnails strip */}
      <div className="flex items-center justify-between pt-2">
        <button
          disabled={currentPage === 0}
          onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
          className="p-2 bg-strange-cream disabled:opacity-40 rounded border border-strange-tan hover:bg-strange-tan/20 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Thumbnail scroll strip */}
        <div className="flex items-center gap-2 overflow-x-auto px-2 max-w-[400px] py-1">
          {thumbnails.map((t, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx)}
              className={`shrink-0 border-2 rounded overflow-hidden transition-all ${
                idx === currentPage
                  ? 'border-strange-crimson shadow-retro-crimson scale-105'
                  : 'border-strange-tan opacity-70 hover:opacity-100'
              }`}
            >
              <img src={t.image} alt={`thumb ${t.page}`} className="w-12 h-16 object-cover" />
            </button>
          ))}
        </div>

        <button
          disabled={currentPage === thumbnails.length - 1}
          onClick={() => setCurrentPage((p) => Math.min(thumbnails.length - 1, p + 1))}
          className="p-2 bg-strange-cream disabled:opacity-40 rounded border border-strange-tan hover:bg-strange-tan/20 transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
