import React, { useRef, useState } from 'react';
import { UploadCloud, File, AlertCircle, Trash2 } from 'lucide-react';

interface FileUploaderProps {
  acceptedFormats: string;
  multiple?: boolean;
  onFilesSelected: (files: File[]) => void;
  selectedFiles: File[];
  onRemoveFile?: (index: number) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  acceptedFormats,
  multiple = false,
  onFilesSelected,
  selectedFiles,
  onRemoveFile
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      onFilesSelected(multiple ? droppedFiles : [droppedFiles[0]]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      onFilesSelected(multiple ? files : [files[0]]);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full space-y-4">
      {/* Drag & Drop Surface */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-strange-crimson bg-strange-crimson/10 shadow-glow-crimson scale-[1.01]'
            : 'border-strange-tan hover:border-strange-crimson bg-strange-card hover:bg-strange-cream/50 shadow-retro'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={acceptedFormats}
          multiple={multiple}
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-strange-cream border-2 border-strange-tan flex items-center justify-center text-strange-crimson shadow-sm group-hover:scale-110 transition-transform">
            <UploadCloud className="w-8 h-8 animate-bounce" style={{ animationDuration: '3s' }} />
          </div>

          <div>
            <h4 className="font-heading text-2xl tracking-wide text-strange-blood">
              DRAG & DROP {multiple ? 'YOUR FILES' : 'YOUR FILE'} HERE
            </h4>
            <p className="text-xs font-mono text-strange-dark/70 mt-1">
              or click here to browse from your device
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-strange-tan/20 rounded-full border border-strange-tan text-[11px] font-mono text-strange-dark/80">
            <span>Accepted formats:</span>
            <span className="font-bold text-strange-blood uppercase">{acceptedFormats}</span>
          </div>
        </div>
      </div>

      {/* Selected Files List */}
      {selectedFiles.length > 0 && (
        <div className="bg-strange-card border-2 border-strange-tan rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-strange-blood pb-2 border-b border-strange-tan/40">
            <span>READY FOR PROCESSING ({selectedFiles.length})</span>
            <span>TOTAL SIZE: {formatFileSize(selectedFiles.reduce((acc, f) => acc + f.size, 0))}</span>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {selectedFiles.map((f, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 bg-strange-cream rounded border border-strange-tan text-xs font-mono"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <File className="w-4 h-4 text-strange-crimson shrink-0" />
                  <span className="truncate font-semibold text-strange-dark">{f.name}</span>
                  <span className="text-strange-tan shrink-0">({formatFileSize(f.size)})</span>
                </div>
                {onRemoveFile && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFile(idx);
                    }}
                    className="p-1 text-strange-blood hover:text-strange-crimson transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
