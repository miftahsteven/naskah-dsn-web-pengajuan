import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import {
  Download,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Printer,
  FileText,
  ExternalLink,
} from 'lucide-react';
import { SERVER_BASE_URL, formatFileSize } from '../../lib/api';

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  fileUrl: string;
  fileSize?: number;
  mimeType?: string;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  isOpen,
  onClose,
  title,
  fileUrl,
  fileSize,
  mimeType,
}) => {
  const [zoom, setZoom] = useState<number>(100);
  const [rotation, setRotation] = useState<number>(0);

  if (!isOpen) return null;

  // Resolve full URL
  const resolvedUrl = fileUrl.startsWith('http')
    ? fileUrl
    : `${SERVER_BASE_URL}${fileUrl.startsWith('/') ? fileUrl : '/' + fileUrl}`;

  const isPdf =
    fileUrl.toLowerCase().endsWith('.pdf') || mimeType?.includes('pdf');
  const isImage =
    fileUrl.toLowerCase().match(/\.(jpg|jpeg|png|webp|svg)$/i) ||
    mimeType?.includes('image');

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 50));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);

  const handlePrint = () => {
    window.open(resolvedUrl, '_blank')?.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="4xl"
      title={
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          <span className="truncate max-w-md">{title}</span>
        </div>
      }
      description={fileSize ? `Ukuran berkas: ${formatFileSize(fileSize)}` : undefined}
    >
      <div className="flex flex-col h-[70vh]">
        {/* Viewer Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-muted/60 rounded-2xl mb-3 border border-border/70 text-xs">
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleZoomOut}
              className="p-1.5 hover:bg-white dark:hover:bg-slate-800 rounded-lg text-foreground/80 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="font-semibold px-2 py-0.5 bg-white dark:bg-slate-800 rounded-md border border-border">
              {zoom}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1.5 hover:bg-white dark:hover:bg-slate-800 rounded-lg text-foreground/80 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <div className="h-4 w-px bg-border mx-1" />
            <button
              onClick={handleRotate}
              className="p-1.5 hover:bg-white dark:hover:bg-slate-800 rounded-lg text-foreground/80 transition-colors flex items-center gap-1"
              title="Putar Dokumen"
            >
              <RotateCw className="w-4 h-4" />
              <span className="hidden sm:inline">Putar</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={resolvedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center"
            >
              <Button
                variant="outline"
                size="sm"
                leftIcon={<ExternalLink className="w-3.5 h-3.5" />}
              >
                Buka Tab Baru
              </Button>
            </a>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              leftIcon={<Printer className="w-3.5 h-3.5" />}
            >
              Cetak
            </Button>
            <a href={resolvedUrl} download target="_blank" rel="noopener noreferrer">
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Download className="w-3.5 h-3.5" />}
              >
                Unduh Berkas
              </Button>
            </a>
          </div>
        </div>

        {/* Content View Container */}
        <div className="flex-1 overflow-auto bg-slate-900/5 dark:bg-slate-950/40 rounded-2xl border border-border flex items-center justify-center p-2 sm:p-4">
          {isPdf ? (
            <object
              data={resolvedUrl}
              type="application/pdf"
              className="w-full h-full rounded-xl shadow-inner border-0 min-h-[55vh]"
            >
              <iframe
                src={`${resolvedUrl}#toolbar=0`}
                className="w-full h-full rounded-xl shadow-inner border-0"
                title={title}
              >
                <p className="p-4 text-xs text-center">
                  Browser Anda tidak mendukung iframe PDF.{' '}
                  <a href={resolvedUrl} target="_blank" rel="noreferrer" className="text-primary underline">
                    Klik di sini untuk melihat berkas.
                  </a>
                </p>
              </iframe>
            </object>
          ) : isImage ? (
            <div
              className="transition-transform duration-200 flex items-center justify-center max-w-full max-h-full"
              style={{
                transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
              }}
            >
              <img
                src={resolvedUrl}
                alt={title}
                className="max-h-[60vh] max-w-full object-contain rounded-lg shadow-lg"
              />
            </div>
          ) : (
            <div className="text-center py-12 px-6">
              <FileText className="w-16 h-16 text-primary/40 mx-auto mb-4" />
              <h4 className="text-base font-bold text-foreground mb-1">
                Format Berkas Membutuhkan Aplikasi Pembaca
              </h4>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto mb-6">
                Berkas ini tidak dapat dipratinjau langsung di browser. Silakan unduh dokumen untuk membukanya di perangkat Anda.
              </p>
              <a href={resolvedUrl} download target="_blank" rel="noopener noreferrer">
                <Button
                  variant="primary"
                  leftIcon={<ExternalLink className="w-4 h-4" />}
                >
                  Buka / Unduh Dokumen ({formatFileSize(fileSize)})
                </Button>
              </a>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
