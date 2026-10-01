import React, { useState, useEffect, useRef } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import type { InterviewInvitation, PublicSubmission } from '../../types';
import api, { API_BASE_URL, getFileUrl } from '../../lib/api';
import {
  Printer,
  Download,
  Calendar,
  Clock,
  MapPin,
  Users,
  ShieldCheck,
  FileText,
  ExternalLink,
  Loader2,
  AlertCircle,
  Video,
  Building2,
  CheckCircle2,
} from 'lucide-react';

interface OfficialInterviewInvitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: PublicSubmission;
  invitation: InterviewInvitation;
}

interface LetterData {
  type: 'html' | 'pdf' | 'none';
  htmlContent?: string;
  fileUrl?: string;
  documentNumber?: string;
  title?: string;
  fileName?: string;
  downloadUrl?: string;
  invitation?: any;
}

export const OfficialInterviewInvitationModal: React.FC<OfficialInterviewInvitationModalProps> = ({
  isOpen,
  onClose,
  submission,
  invitation,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [letterData, setLetterData] = useState<LetterData | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const fetchLetterContent = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/submissions/${submission.id}/invitation-letter/content`);
      if (res.data?.status === 'success' && res.data?.data) {
        setLetterData(res.data.data);
      } else {
        setLetterData({
          type: 'none',
          documentNumber: invitation.outgoingLetterNumber || invitation.invitationNumber,
          title: invitation.outgoingLetterTitle || invitation.subject,
        });
      }
    } catch (err: any) {
      console.warn('[OfficialInterviewInvitationModal] Error fetching letter content:', err);
      // Fallback gracefully so applicant can still see schedule
      setLetterData({
        type: 'none',
        documentNumber: invitation.outgoingLetterNumber || invitation.invitationNumber,
        title: invitation.outgoingLetterTitle || invitation.subject,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchLetterContent();
    } else {
      setLetterData(null);
      setError(null);
    }
  }, [isOpen, submission.id]);

  const token = typeof window !== 'undefined' ? localStorage.getItem('amanah_public_token') || '' : '';
  const directDownloadUrl = `${API_BASE_URL}/submissions/${submission.id}/invitation-letter/download?token=${encodeURIComponent(token)}`;

  const handlePrint = () => {
    if (letterData?.type === 'html' && iframeRef.current?.contentWindow) {
      try {
        iframeRef.current.contentWindow.focus();
        iframeRef.current.contentWindow.print();
        return;
      } catch (e) {
        console.warn('Iframe print error, falling back to window.print():', e);
      }
    }
    window.print();
  };

  const effectiveNumber =
    letterData?.documentNumber ||
    invitation.outgoingLetterNumber ||
    invitation.invitationNumber ||
    'U-DSN-MUI';

  const effectiveTitle =
    letterData?.title ||
    invitation.outgoingLetterTitle ||
    invitation.subject ||
    'Surat Undangan Resmi Pelaksanaan Wawancara DSN-MUI';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      maxWidth="4xl"
      className="p-0 overflow-hidden"
    >
      <div className="flex flex-col h-full max-h-[92vh] -m-6">
        {/* ── TOP ACTION & TITLE BAR ── */}
        <div className="p-4 sm:p-5 border-b border-border bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur-sm flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5" />
                Surat Keluar Resmi DSN-MUI
              </span>
              <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 px-2.5 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 shadow-2xs">
                {effectiveNumber}
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-1 truncate">
              {effectiveTitle}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <a
              href={directDownloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-600 shadow-xs transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" /> Buka Tab Baru
            </a>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              leftIcon={<Printer className="w-4 h-4 text-emerald-600" />}
              disabled={loading}
              className="font-bold"
            >
              Cetak Dokumen
            </Button>
            <a
              href={directDownloadUrl}
              download={letterData?.fileName || `${effectiveNumber}.pdf`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#006633] hover:bg-[#00552b] text-white shadow-xs hover:shadow transition-all"
            >
              <Download className="w-4 h-4" /> Unduh Berkas
            </a>
          </div>
        </div>

        {/* ── SCHEDULE SUMMARY STRIP (QUICK ACCESS FOR CANDIDATES) ── */}
        <div className="bg-emerald-50/70 dark:bg-emerald-950/30 border-b border-emerald-100 dark:border-emerald-900/60 px-5 py-3 shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-1.5 font-medium">
                <Calendar className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
                <span className="font-bold text-slate-900 dark:text-white">
                  {invitation.interviewDayDate}
                </span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <Clock className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
                <span>{invitation.interviewTime} WIB</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <MapPin className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
                <span className="truncate max-w-[280px]">{invitation.venue}</span>
              </div>
            </div>

            {invitation.zoomUrl && (
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={invitation.zoomUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all"
                >
                  <Video className="w-3.5 h-3.5" /> Akses Zoom Meeting
                </a>
                {invitation.zoomPasscode && (
                  <span className="text-[11px] font-mono text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 px-2 py-1 rounded border border-slate-200 dark:border-slate-700">
                    Passcode: <strong className="text-slate-900 dark:text-white">{invitation.zoomPasscode}</strong>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── MAIN DOCUMENT READER CANVAS ── */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100 dark:bg-slate-950 flex flex-col items-center">
          {loading ? (
            <div className="flex flex-col items-center justify-center my-auto py-24 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 shadow-md flex items-center justify-center border border-slate-200 dark:border-slate-800">
                <Loader2 className="w-6 h-6 text-[#006633] animate-spin" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Memuat Berkas Surat Keluar Resmi DSN-MUI...
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Menyiapkan naskah surat, lampiran, dan tanda tangan digital terverifikasi.
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="p-6 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-200 max-w-lg text-center my-auto space-y-3">
              <AlertCircle className="w-8 h-8 text-rose-600 mx-auto" />
              <p className="font-bold text-sm">{error}</p>
              <Button variant="outline" size="sm" onClick={fetchLetterContent}>
                Coba Muat Ulang
              </Button>
            </div>
          ) : letterData?.type === 'html' && letterData.htmlContent ? (
            /* ── ACTUAL HTML SURAT KELUAR ── */
            <div className="w-full max-w-[850px] bg-white rounded-xl shadow-md border border-slate-300 overflow-hidden flex flex-col my-auto min-h-[750px]">
              <iframe
                ref={iframeRef}
                srcDoc={letterData.htmlContent}
                title={`Surat Keluar ${effectiveNumber}`}
                className="w-full flex-1 min-h-[750px] border-0"
                style={{ minHeight: '800px', display: 'block' }}
              />
            </div>
          ) : letterData?.type === 'pdf' && letterData.fileUrl ? (
            /* ── ACTUAL PDF SURAT KELUAR ── */
            <div className="w-full max-w-[850px] bg-white dark:bg-slate-900 rounded-xl shadow-md border border-slate-300 dark:border-slate-800 overflow-hidden flex flex-col my-auto min-h-[750px]">
              <iframe
                src={getFileUrl(letterData.fileUrl)}
                title={`Surat Keluar PDF ${effectiveNumber}`}
                className="w-full flex-1 min-h-[750px] border-0"
              />
            </div>
          ) : (
            /* ── FALLBACK AGENDA CARD IF PHYSICAL LETTER NOT YET GENERATED ── */
            <div className="w-full max-w-[700px] bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 space-y-6 my-auto">
              <div className="flex items-center gap-3 border-b border-border pb-4">
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 flex items-center justify-center font-bold">
                  <FileText className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Agenda Wawancara DSN-MUI
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    Nomor Agenda: {effectiveNumber}
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-xs font-sans">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-slate-500 font-semibold">Perihal:</span>
                    <span className="font-bold text-slate-900 dark:text-white text-right">
                      {effectiveTitle}
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-slate-500 font-semibold">Hari / Tanggal:</span>
                    <span className="font-bold text-slate-900 dark:text-white text-right">
                      {invitation.interviewDayDate}
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-slate-500 font-semibold">Waktu Pelaksanaan:</span>
                    <span className="font-bold text-slate-900 dark:text-white text-right">
                      {invitation.interviewTime} WIB
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-slate-500 font-semibold">Tempat / Media:</span>
                    <span className="font-bold text-slate-900 dark:text-white text-right">
                      {invitation.venue}
                    </span>
                  </div>
                  {invitation.zoomUrl && (
                    <div className="flex items-start justify-between gap-4 pt-2 border-t border-slate-200 dark:border-slate-700">
                      <span className="text-slate-500 font-semibold">Tautan Zoom:</span>
                      <a
                        href={invitation.zoomUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 font-bold hover:underline break-all text-right"
                      >
                        {invitation.zoomUrl}
                      </a>
                    </div>
                  )}
                  {invitation.candidates && invitation.candidates.length > 0 && (
                    <div className="flex items-start justify-between gap-4 pt-2 border-t border-slate-200 dark:border-slate-700">
                      <span className="text-slate-500 font-semibold">Peserta / Kandidat:</span>
                      <span className="font-bold text-emerald-800 dark:text-emerald-300 text-right">
                        {invitation.candidates.join(', ')}
                      </span>
                    </div>
                  )}
                  {invitation.dresscode && (
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-slate-500 font-semibold">Ketentuan Busana:</span>
                      <span className="text-slate-800 dark:text-slate-200 text-right">
                        {invitation.dresscode}
                      </span>
                    </div>
                  )}
                  {invitation.requirements && (
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-slate-500 font-semibold">Persyaratan:</span>
                      <span className="text-slate-800 dark:text-slate-200 text-right">
                        {invitation.requirements}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-blue-900 dark:text-blue-200">
                  <p className="font-semibold text-xs leading-relaxed">
                    Surat undangan resmi cetak sedang dalam proses pengesahan tanda tangan di sekretariat DSN-MUI. Silakan simpan jadwal wawancara di atas untuk persiapan Anda.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── MODAL FOOTER ── */}
        <div className="p-4 border-t border-border bg-slate-50 dark:bg-slate-900 flex items-center justify-between gap-3 text-xs text-muted-foreground shrink-0">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Amanah Public Portal • Sistem Persuratan Resmi DSN-MUI</span>
          </div>
          <Button variant="outline" size="sm" onClick={onClose}>
            Tutup
          </Button>
        </div>
      </div>
    </Modal>
  );
};
