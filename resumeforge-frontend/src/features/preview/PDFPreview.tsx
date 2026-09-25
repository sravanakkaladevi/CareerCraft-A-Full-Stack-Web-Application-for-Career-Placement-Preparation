import React, { useState } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Download, AlertTriangle, Loader2, CheckCircle, RefreshCw } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { GeneratedDocument } from '../../types';
import { documentApi } from '../../services/api';

interface PDFPreviewProps {
  document: GeneratedDocument | null;
  onGenerate: () => void;
  isGenerating: boolean;
}

export const PDFPreview: React.FC<PDFPreviewProps> = ({ document, onGenerate, isGenerating }) => {
  const [zoom, setZoom] = useState(100);

  const handleZoomIn = () => setZoom((z) => Math.min(z + 15, 160));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 15, 60));
  const handleResetZoom = () => setZoom(100);

  const getPdfSrc = () => {
    if (!document || !document.pdf_url) return '';
    if (document.pdf_url.startsWith('http')) return document.pdf_url;
    return `http://127.0.0.1:8000${document.pdf_url}`;
  };

  return (
    <div className="h-full flex flex-col bg-slate-200/80 border-l border-slate-200 overflow-hidden">
      {/* Control Toolbar */}
      <div className="h-12 px-4 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 text-xs">
          {isGenerating ? (
            <span className="flex items-center gap-1.5 text-amber-700 bg-amber-50 px-2.5 py-1 rounded font-semibold border border-amber-200">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Compiling LaTeX...
            </span>
          ) : document?.status === 'SUCCESS' ? (
            <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded font-semibold border border-emerald-200">
              <CheckCircle className="w-3.5 h-3.5" /> PDF Ready
            </span>
          ) : document?.status === 'FAILED' ? (
            <span className="flex items-center gap-1.5 text-red-700 bg-red-50 px-2.5 py-1 rounded font-semibold border border-red-200">
              <AlertTriangle className="w-3.5 h-3.5" /> Compilation Failed
            </span>
          ) : (
            <span className="text-slate-500 font-medium">Ready for compilation</span>
          )}
        </div>

        {/* Zoom & Action Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded border border-slate-200">
            <button onClick={handleZoomOut} className="p-1 hover:bg-white rounded text-slate-600" title="Zoom Out">
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono px-1.5 text-slate-700">{zoom}%</span>
            <button onClick={handleZoomIn} className="p-1 hover:bg-white rounded text-slate-600" title="Zoom In">
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button onClick={handleResetZoom} className="p-1 hover:bg-white rounded text-slate-600" title="Fit Width">
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={onGenerate}
            isLoading={isGenerating}
            icon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Generate PDF
          </Button>

          {document?.status === 'SUCCESS' && (
            <a
              href={documentApi.getDownloadUrl(document.id)}
              download
              target="_blank"
              rel="noreferrer"
            >
              <Button variant="outline" size="sm" icon={<Download className="w-3.5 h-3.5" />}>
                Download
              </Button>
            </a>
          )}
        </div>
      </div>

      {/* Preview Viewport Canvas */}
      <div className="flex-1 overflow-hidden p-3 sm:p-4 bg-slate-200/80 flex flex-col items-center justify-center">
        {isGenerating ? (
          <div className="my-auto text-center p-8 bg-white rounded-xl shadow-lg border border-slate-200 space-y-3 max-w-sm">
            <Loader2 className="w-8 h-8 animate-spin text-slate-900 mx-auto" />
            <h4 className="font-bold text-slate-900 text-sm">Compiling LaTeX Document</h4>
            <p className="text-xs text-slate-500">Converting structured resume data into isolated LaTeX source and generating PDF...</p>
          </div>
        ) : document?.status === 'FAILED' ? (
          <div className="my-auto text-center p-8 bg-white rounded-xl shadow-lg border border-red-200 space-y-3 max-w-md">
            <AlertTriangle className="w-8 h-8 text-red-500 mx-auto" />
            <h4 className="font-bold text-slate-900 text-sm">LaTeX Compilation Error</h4>
            <p className="text-xs text-red-600 bg-red-50 p-3 rounded font-mono text-left max-h-32 overflow-auto border border-red-200">
              {document.error_message || 'The document could not be compiled.'}
            </p>
            <Button variant="primary" size="sm" onClick={onGenerate}>
              Try Again
            </Button>
          </div>
        ) : document?.status === 'SUCCESS' && getPdfSrc() ? (
          <div
            className="paper-canvas w-full h-full max-w-4xl bg-white rounded-lg shadow-md border border-slate-300 overflow-hidden flex flex-col transition-all duration-150"
            style={{
              transform: zoom !== 100 ? `scale(${zoom / 100})` : undefined,
              transformOrigin: 'top center',
            }}
          >
            <iframe
              src={`${getPdfSrc()}#toolbar=0&navpanes=0`}
              title="Compiled Resume PDF"
              className="w-full h-full flex-1 border-none bg-white"
            />
          </div>
        ) : (
          <div className="my-auto text-center p-8 bg-white rounded-xl shadow-sm border border-slate-200 space-y-3 max-w-sm">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">PDF Preview Ready</h4>
            <p className="text-xs text-slate-500">Click "Generate PDF" above to compile structured form data into a real PDF document.</p>
            <Button variant="primary" size="sm" onClick={onGenerate} icon={<RefreshCw className="w-3.5 h-3.5" />}>
              Generate PDF Now
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
