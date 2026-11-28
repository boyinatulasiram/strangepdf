import React, { useState } from 'react';
import { ToolMetadata } from '../data/tools';
import { FileUploader } from '../components/FileUploader';
import { ProgressBar } from '../components/ProgressBar';
import { DownloadCard } from '../components/DownloadCard';
import { FilePreview } from '../components/FilePreview';
import { executeToolApi, CompressionStats, fetchDocumentThumbnails, ThumbnailData } from '../services/api';
import { ArrowLeft, Play, Settings2, AlertTriangle } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

interface ToolExecutorProps {
  tool: ToolMetadata;
  onBack: () => void;
}

export const ToolExecutor: React.FC<ToolExecutorProps> = ({ tool, onBack }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [downloadFilename, setDownloadFilename] = useState('');
  const [stats, setStats] = useState<CompressionStats | undefined>();
  const [error, setError] = useState<string | null>(null);

  // Dynamic Options per tool category
  const [compressionLevel, setCompressionLevel] = useState<'low' | 'recommended' | 'extreme'>('recommended');
  const [splitMode, setSplitMode] = useState<'all' | 'range'>('all');
  const [splitRanges, setSplitRanges] = useState('');
  const [rotationAngle, setRotationAngle] = useState<number>(90);
  const [rotationPages, setRotationPages] = useState('all');
  const [customText, setCustomText] = useState('StrangePDF Confidential');
  const [textColor, setTextColor] = useState('#C33149');
  const [textSize, setTextSize] = useState(14);
  const [pageNumberPosition, setPageNumberPosition] = useState('bottom-center');
  const [watermarkText, setWatermarkText] = useState('STRANGE ARCHIVE');
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.25);
  const [watermarkRotation, setWatermarkRotation] = useState(45);
  const [password, setPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [ocrLang, setOcrLang] = useState('eng');

  // Preview Thumbnails
  const [thumbnails, setThumbnails] = useState<ThumbnailData[]>([]);
  const [loadingPreview, setLoadingPreview] = useState(false);

  const handleFilesSelected = async (newFiles: File[]) => {
    let updatedFiles: File[];
    if (tool.multipleFiles) {
      // Append newly selected files to existing list to allow multiple browse/drop actions
      updatedFiles = [...files, ...newFiles];
    } else {
      updatedFiles = newFiles.slice(0, 1);
    }
    setFiles(updatedFiles);
    setError(null);
    setResultBlob(null);

    // If PDF file and organization tool, load thumbnails
    if (updatedFiles.length > 0 && updatedFiles[0].name.toLowerCase().endsWith('.pdf')) {
      try {
        setLoadingPreview(true);
        const previewData = await fetchDocumentThumbnails(updatedFiles[0]);
        setThumbnails(previewData.thumbnails);
      } catch (e) {
        // Thumbnail preview optional fallback
      } finally {
        setLoadingPreview(false);
      }
    }
  };

  const handleExecute = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    setProgress(15);
    setError(null);

    try {
      const formData = new FormData();

      if (tool.multipleFiles) {
        files.forEach((f) => formData.append('files', f));
      } else {
        formData.append('file', files[0]);
      }

      // Append specific tool parameters
      if (tool.id === 'compress-pdf') {
        formData.append('level', compressionLevel);
      } else if (tool.id === 'split-pdf') {
        formData.append('split_mode', splitMode);
        formData.append('ranges', splitRanges);
      } else if (tool.id === 'rotate-pdf') {
        formData.append('angle', rotationAngle.toString());
        formData.append('pages', rotationPages);
      } else if (tool.id === 'add-text') {
        formData.append('text', customText);
        formData.append('page', '1');
        formData.append('x', '50');
        formData.append('y', '50');
        formData.append('font_size', textSize.toString());
        formData.append('color', textColor);
      } else if (tool.id === 'page-numbers') {
        formData.append('position', pageNumberPosition);
        formData.append('template', 'Page {page} of {total}');
        formData.append('start_num', '1');
      } else if (tool.id === 'watermark') {
        formData.append('text', watermarkText);
        formData.append('opacity', watermarkOpacity.toString());
        formData.append('rotation', watermarkRotation.toString());
      } else if (tool.id === 'protect-pdf') {
        formData.append('password', password);
      } else if (tool.id === 'remove-pdf-password') {
        formData.append('password', password);
      } else if (tool.id === 'change-pdf-password') {
        formData.append('old_password', oldPassword);
        formData.append('new_password', password);
      } else if (tool.id === 'remove-pdf-restrictions') {
        formData.append('password', password);
      } else if (tool.id === 'ocr') {
        formData.append('lang', ocrLang);
      } else if (tool.id === 'reorder-pdf') {
        const orderArr = thumbnails.map((_, i) => thumbnails.length - 1 - i);
        formData.append('order', JSON.stringify(orderArr.length > 0 ? orderArr : [0]));
      }

      const fullEndpoint = `${API_BASE}${tool.endpoint}`;
      const res = await executeToolApi(fullEndpoint, formData, (pct) => setProgress(pct));
      setResultBlob(res.blob);
      setDownloadFilename(res.filename);
      setStats(res.stats);
      setProgress(100);
    } catch (err: any) {
      setError(err.message || 'Operation failed. Please verify the document format.');
    } finally {
      setProcessing(false);
    }
  };

  const handleReset = () => {
    setFiles([]);
    setResultBlob(null);
    setThumbnails([]);
    setError(null);
    setProgress(0);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Back button and tool header */}
      <div className="space-y-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 font-mono font-bold text-xs text-strange-blood hover:text-strange-crimson transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO ALL TOOLS</span>
        </button>

        <div className="bg-strange-card border-2 border-strange-tan rounded-xl p-6 shadow-retro">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-strange-crimson text-strange-cream">
              {tool.category}
            </span>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl text-strange-blood tracking-wide mt-2">
            {tool.name}
          </h1>
          <p className="mt-1 font-body text-xs sm:text-sm text-strange-dark/80">
            {tool.description}
          </p>
        </div>
      </div>

      {/* Main Action Area */}
      {!resultBlob && !processing && (
        <div className="space-y-6">
          <FileUploader
            acceptedFormats={tool.acceptedFormats}
            multiple={tool.multipleFiles}
            selectedFiles={files}
            onFilesSelected={handleFilesSelected}
            onRemoveFile={(idx) => setFiles(files.filter((_, i) => i !== idx))}
          />

          {/* Optional Document Viewer / Thumbnail Strip if available */}
          {thumbnails.length > 0 && (
            <FilePreview thumbnails={thumbnails} />
          )}

          {/* Tool specific configurations */}
          {files.length > 0 && (
            <div className="bg-strange-card border-2 border-strange-tan rounded-xl p-6 shadow-retro space-y-4 font-mono text-xs">
              <div className="flex items-center gap-2 font-bold text-strange-blood pb-2 border-b border-strange-tan/40">
                <Settings2 className="w-4 h-4" />
                <span>TOOL OPTIONS & PARAMETERS</span>
              </div>

              {/* Compress PDF options */}
              {tool.id === 'compress-pdf' && (
                <div className="space-y-3">
                  <label className="block text-strange-dark font-bold">Compression Level:</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {(['low', 'recommended', 'extreme'] as const).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setCompressionLevel(lvl)}
                        className={`p-3 rounded-lg border-2 text-left capitalize ${
                          compressionLevel === lvl
                            ? 'border-strange-crimson bg-strange-crimson/10 font-bold text-strange-blood shadow-retro-crimson'
                            : 'border-strange-tan bg-strange-cream hover:bg-strange-tan/20'
                        }`}
                      >
                        <div className="font-bold">{lvl}</div>
                        <div className="text-[10px] text-strange-tan mt-0.5">
                          {lvl === 'low' && 'High quality, light reduction'}
                          {lvl === 'recommended' && 'Optimal balance of size & clarity'}
                          {lvl === 'extreme' && 'Aggressive optimization'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Password Protection */}
              {tool.id === 'protect-pdf' && (
                <div className="space-y-2">
                  <label className="block text-strange-dark font-bold">Set Password:</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter document password"
                    className="w-full p-2.5 bg-strange-cream border border-strange-tan rounded focus:border-strange-crimson focus:outline-none"
                  />
                </div>
              )}

              {/* Unlock PDF */}
              {tool.id === 'remove-pdf-password' && (
                <div className="space-y-2">
                  <label className="block text-strange-dark font-bold">Document Password:</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter existing password to remove lock"
                    className="w-full p-2.5 bg-strange-cream border border-strange-tan rounded focus:border-strange-crimson focus:outline-none"
                  />
                </div>
              )}

              {/* Change Password */}
              {tool.id === 'change-pdf-password' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-strange-dark font-bold mb-1">Current Password:</label>
                    <input
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="Old password"
                      className="w-full p-2.5 bg-strange-cream border border-strange-tan rounded focus:border-strange-crimson focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-strange-dark font-bold mb-1">New Password:</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="New password"
                      className="w-full p-2.5 bg-strange-cream border border-strange-tan rounded focus:border-strange-crimson focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Watermark options */}
              {tool.id === 'watermark' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-strange-dark font-bold mb-1">Watermark Text:</label>
                    <input
                      type="text"
                      value={watermarkText}
                      onChange={(e) => setWatermarkText(e.target.value)}
                      className="w-full p-2.5 bg-strange-cream border border-strange-tan rounded focus:border-strange-crimson focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-strange-dark font-bold mb-1">Rotation Angle (°):</label>
                    <input
                      type="number"
                      value={watermarkRotation}
                      onChange={(e) => setWatermarkRotation(Number(e.target.value))}
                      className="w-full p-2.5 bg-strange-cream border border-strange-tan rounded focus:border-strange-crimson focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Add Text options */}
              {tool.id === 'add-text' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-strange-dark font-bold mb-1">Text String:</label>
                    <input
                      type="text"
                      value={customText}
                      onChange={(e) => setCustomText(e.target.value)}
                      className="w-full p-2.5 bg-strange-cream border border-strange-tan rounded focus:border-strange-crimson focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-strange-dark font-bold mb-1">Color:</label>
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-full h-10 p-1 bg-strange-cream border border-strange-tan rounded cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {/* Split PDF options */}
              {tool.id === 'split-pdf' && (
                <div className="space-y-3">
                  <div className="flex gap-4">
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={splitMode === 'all'}
                        onChange={() => setSplitMode('all')}
                        className="accent-strange-crimson"
                      />
                      <span>Extract all pages separately</span>
                    </label>
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={splitMode === 'range'}
                        onChange={() => setSplitMode('range')}
                        className="accent-strange-crimson"
                      />
                      <span>Custom page range</span>
                    </label>
                  </div>
                  {splitMode === 'range' && (
                    <input
                      type="text"
                      value={splitRanges}
                      onChange={(e) => setSplitRanges(e.target.value)}
                      placeholder="e.g. 1-3, 5, 7-10"
                      className="w-full p-2.5 bg-strange-cream border border-strange-tan rounded focus:border-strange-crimson focus:outline-none"
                    />
                  )}
                </div>
              )}

              {/* Rotate PDF */}
              {tool.id === 'rotate-pdf' && (
                <div className="flex gap-3">
                  {[90, 180, 270].map((deg) => (
                    <button
                      key={deg}
                      type="button"
                      onClick={() => setRotationAngle(deg)}
                      className={`px-4 py-2 rounded border ${
                        rotationAngle === deg
                          ? 'border-strange-crimson bg-strange-crimson text-strange-cream font-bold'
                          : 'border-strange-tan bg-strange-cream'
                      }`}
                    >
                      {deg}° Clockwise
                    </button>
                  ))}
                </div>
              )}

              {/* Submit Execution Button */}
              <div className="pt-4">
                {tool.id === 'merge-pdf' && files.length < 2 && (
                  <p className="text-center text-strange-blood font-mono text-xs font-bold mb-2">
                    ⚠️ Please add at least 2 PDF files to merge (Current: {files.length})
                  </p>
                )}
                <button
                  type="button"
                  disabled={tool.id === 'merge-pdf' && files.length < 2}
                  onClick={handleExecute}
                  className={`w-full py-4 text-strange-cream font-mono font-bold text-base rounded-lg border-2 border-strange-blood transition-all flex items-center justify-center gap-3 ${
                    tool.id === 'merge-pdf' && files.length < 2
                      ? 'bg-strange-tan/50 cursor-not-allowed opacity-60'
                      : 'bg-strange-crimson hover:bg-strange-blood shadow-retro-crimson hover:shadow-none hover:translate-x-1 hover:translate-y-1'
                  }`}
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>PROCESS {tool.name.toUpperCase()}</span>
                </button>
              </div>

            </div>
          )}
        </div>
      )}

      {/* Progress state */}
      {processing && (
        <ProgressBar progress={progress} statusText={`Processing ${tool.name}...`} />
      )}

      {/* Error state */}
      {error && (
        <div className="p-4 bg-strange-blood/10 border-2 border-strange-blood rounded-lg flex items-center gap-3 text-strange-blood text-xs font-mono font-bold">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Result Card */}
      {resultBlob && (
        <DownloadCard
          filename={downloadFilename}
          blob={resultBlob}
          stats={stats}
          onReset={handleReset}
        />
      )}

    </div>
  );
};
