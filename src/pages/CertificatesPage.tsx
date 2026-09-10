import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { DocumentViewerModal } from '../components/ui/DocumentViewerModal';
import { Modal } from '../components/ui/Modal';
import api, { formatDate, formatFileSize } from '../lib/api';
import type { ShariaCertificate } from '../types';
import QRCode from 'qrcode';
import {
  FileBadge,
  Download,
  Eye,
  QrCode,
  Calendar,
  Building2,
  ShieldCheck,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

export const CertificatesPage: React.FC = () => {
  const [certificates, setCertificates] = useState<ShariaCertificate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // QR Modal
  const [qrModal, setQrModal] = useState<{
    isOpen: boolean;
    certNumber: string;
    qrDataUrl: string;
    title: string;
  }>({
    isOpen: false,
    certNumber: '',
    qrDataUrl: '',
    title: '',
  });

  // Viewer Modal
  const [previewDoc, setPreviewDoc] = useState<{
    isOpen: boolean;
    title: string;
    fileUrl: string;
    fileSize?: number;
  }>({
    isOpen: false,
    title: '',
    fileUrl: '',
  });

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/certificates');
      if (res.data.status === 'success') {
        setCertificates(res.data.data.certificates || []);
      }
    } catch (err) {
      console.error('Failed to fetch certificates', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenQrModal = async (cert: ShariaCertificate) => {
    const verifyUrl = `${window.location.origin}/verify/public/${encodeURIComponent(cert.certificateNumber)}`;
    try {
      const dataUrl = await QRCode.toDataURL(verifyUrl, { width: 300, margin: 2 });
      setQrModal({
        isOpen: true,
        certNumber: cert.certificateNumber,
        qrDataUrl: dataUrl,
        title: cert.title,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
            Sertifikat Syariah Diterbitkan
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Daftar resmi sertifikat kesesuaian syariah dan opini fatwa DSN-MUI
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>{certificates.length} Sertifikat Sah</span>
        </div>
      </div>

      {/* Certificates Grid */}
      {isLoading ? (
        <div className="py-20 text-center text-xs text-muted-foreground">
          Memuat sertifikat syariah...
        </div>
      ) : certificates.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white dark:bg-[#172019] border border-border shadow-subtle text-center space-y-3">
          <FileBadge className="w-12 h-12 text-muted-foreground/40 mx-auto" />
          <h3 className="text-base font-bold text-foreground">Belum Ada Sertifikat Diterbitkan</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Sertifikat kesesuaian syariah resmi akan tampil di sini secara otomatis setelah pengajuan Anda disetujui dan diterbitkan oleh DSN-MUI.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="p-6 rounded-3xl bg-white dark:bg-[#172019] border border-border hover:border-amber-400/80 transition-all hover:shadow-card shadow-subtle flex flex-col justify-between space-y-6 relative overflow-hidden group"
            >
              {/* Gold Top Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-1.5 gradient-gold" />

              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center flex-shrink-0 border border-amber-200 shadow-sm">
                    <FileBadge className="w-6 h-6" />
                  </div>
                  <button
                    onClick={() => handleOpenQrModal(cert)}
                    className="p-2 rounded-xl text-muted-foreground hover:text-primary hover:bg-muted transition-colors flex items-center gap-1 text-xs"
                    title="Tampilkan QR Code Verifikasi"
                  >
                    <QrCode className="w-4 h-4" />
                    <span className="text-[11px] font-semibold">QR Code</span>
                  </button>
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-mono font-bold text-primary truncate">
                    {cert.certificateNumber}
                  </div>
                  <h3 className="text-base font-bold text-foreground leading-snug">
                    {cert.title}
                  </h3>
                  {cert.submission?.productOrServiceName && (
                    <p className="text-xs text-muted-foreground">
                      Produk: <strong>{cert.submission.productOrServiceName}</strong>
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-muted/40 border border-border text-xs">
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Tanggal Terbit</span>
                    <span className="font-semibold text-foreground">{formatDate(cert.issueDate)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Masa Berlaku</span>
                    <span className="font-semibold text-foreground">{formatDate(cert.validUntil)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-border flex items-center justify-between gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setPreviewDoc({
                      isOpen: true,
                      title: cert.title,
                      fileUrl: cert.fileUrl,
                      fileSize: cert.fileSize,
                    })
                  }
                  leftIcon={<Eye className="w-3.5 h-3.5" />}
                >
                  Pratinjau
                </Button>

                <a
                  href={`${api.defaults.baseURL}/certificates/${cert.id}/download`}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={<Download className="w-3.5 h-3.5" />}
                  >
                    Unduh PDF Resmi
                  </Button>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── QR CODE MODAL ── */}
      <Modal
        isOpen={qrModal.isOpen}
        onClose={() => setQrModal((prev) => ({ ...prev, isOpen: false }))}
        title="QR Code Verifikasi Sertifikat"
        maxWidth="sm"
      >
        <div className="text-center space-y-4">
          <p className="text-xs text-muted-foreground">
            Pindai QR Code ini menggunakan kamera ponsel untuk memverifikasi keaslian sertifikat pada portal publik resmi DSN-MUI.
          </p>

          {qrModal.qrDataUrl && (
            <div className="p-4 bg-white rounded-2xl border border-border shadow-inner inline-block mx-auto">
              <img src={qrModal.qrDataUrl} alt="QR Code" className="w-48 h-48 mx-auto" />
            </div>
          )}

          <div className="font-mono text-xs font-bold text-primary">
            {qrModal.certNumber}
          </div>

          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                window.open(`/verify/public/${encodeURIComponent(qrModal.certNumber)}`, '_blank');
              }}
              leftIcon={<ExternalLink className="w-3.5 h-3.5" />}
              className="w-full"
            >
              Buka Halaman Verifikasi Publik
            </Button>
          </div>
        </div>
      </Modal>

      {/* ── VIEWER MODAL ── */}
      <DocumentViewerModal
        isOpen={previewDoc.isOpen}
        onClose={() => setPreviewDoc((prev) => ({ ...prev, isOpen: false }))}
        title={previewDoc.title}
        fileUrl={previewDoc.fileUrl}
        fileSize={previewDoc.fileSize}
      />
    </div>
  );
};
