import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import type { InterviewInvitation, PublicSubmission } from '../../types';
import {
  Printer,
  Download,
  Calendar,
  Clock,
  MapPin,
  Users,
  ShieldCheck,
} from 'lucide-react';

interface OfficialInterviewInvitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: PublicSubmission;
  invitation: InterviewInvitation;
}

export const OfficialInterviewInvitationModal: React.FC<OfficialInterviewInvitationModalProps> = ({
  isOpen,
  onClose,
  submission,
  invitation,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      maxWidth="2xl"
    >
      <div className="space-y-6 -mt-4">
        {/* Action Header bar inside modal */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4 no-print">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Dokumen Resmi DSN-MUI
            </span>
            <span className="text-xs font-mono text-muted-foreground font-semibold">
              {invitation.invitationNumber}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              leftIcon={<Printer className="w-4 h-4" />}
            >
              Cetak Dokumen
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handlePrint}
              leftIcon={<Download className="w-4 h-4" />}
            >
              Unduh PDF
            </Button>
          </div>
        </div>

        {/* ── KOP SURAT & LEMBAR DOKUMEN RESMI ── */}
        <div className="bg-white text-slate-900 p-8 sm:p-12 rounded-2xl border border-slate-300 shadow-sm print:shadow-none print:border-none print:p-0 font-serif leading-relaxed text-sm space-y-6">
          {/* Header Kop DSN-MUI */}
          <div className="border-b-4 border-double border-slate-900 pb-4 text-center space-y-1">
            <div className="flex items-center justify-center gap-4 mb-2">
              <div className="w-14 h-14 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs tracking-tighter shadow-sm font-sans">
                MUI
              </div>
              <div className="space-y-0.5 text-center">
                <h2 className="text-base sm:text-lg font-black uppercase tracking-wide text-slate-900 font-sans">
                  DEWAN SYARIAH NASIONAL - MAJELIS ULAMA INDONESIA
                </h2>
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-800 font-sans">
                  NATIONAL SHARIA BOARD - INDONESIAN COUNCIL OF ULAMA
                </h3>
                <p className="text-[11px] text-slate-600 font-sans">
                  Gedung MUI Lt. 3, Jl. Proklamasi No. 51, Menteng, Jakarta Pusat 10320 • Telp: (021) 3904141 • Email: sekretariat@dsnmui.or.id
                </p>
              </div>
            </div>
          </div>

          {/* Nomor & Tanggal Surat */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 text-xs font-sans">
            <table className="text-left">
              <tbody>
                <tr>
                  <td className="font-semibold pr-3 py-0.5 text-slate-600">Nomor</td>
                  <td className="pr-2">:</td>
                  <td className="font-bold font-mono text-slate-900">{invitation.invitationNumber}</td>
                </tr>
                <tr>
                  <td className="font-semibold pr-3 py-0.5 text-slate-600">Lampiran</td>
                  <td className="pr-2">:</td>
                  <td>1 (Satu) Berkas</td>
                </tr>
                <tr>
                  <td className="font-semibold pr-3 py-0.5 text-slate-600">Perihal</td>
                  <td className="pr-2">:</td>
                  <td className="font-bold text-slate-900">
                    Undangan Wawancara Uji Kepatutan & Kelayakan Calon Anggota DPS
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="text-left sm:text-right">
              <p className="font-semibold text-slate-700">Jakarta, {invitation.invitationDate}</p>
            </div>
          </div>

          {/* Kepada Yth */}
          <div className="space-y-1 font-sans text-xs">
            <p className="text-slate-700">Kepada Yang Terhormat,</p>
            <p className="font-bold text-slate-900 text-sm">{submission.company?.name || 'Pimpinan Perusahaan / LKS'}</p>
            <p className="text-slate-600">d/a {submission.company?.address || 'Di Tempat'}</p>
          </div>

          {/* Isi Surat */}
          <div className="space-y-3 text-justify font-serif text-[13px] leading-relaxed text-slate-800">
            <p className="italic font-bold">Assalamu’alaikum Warahmatullahi Wabarakatuh,</p>
            <p>
              Sehubungan dengan surat permohonan rekomendasi Dewan Pengawas Syariah (DPS) dari{' '}
              <strong className="font-sans font-bold">{submission.company?.name}</strong> Nomor:{' '}
              <strong className="font-sans font-bold font-mono">
                {submission.companyLetterNumber || submission.submissionNumber}
              </strong>
              {submission.companyLetterDate ? ` tertanggal ${invitation.invitationDate}` : ''}, dan
              setelah dilakukan proses pemeriksaan dan validasi administrasi kelengkapan dokumen persyaratan
              calon DPS oleh Sekretariat DSN-MUI, bersama ini kami mengundang Saudara serta Calon Anggota
              Dewan Pengawas Syariah untuk menghadiri{' '}
              <strong>Wawancara Uji Kepatutan dan Kelayakan (Fit and Proper Test)</strong> yang insya Allah
              akan diselenggarakan pada:
            </p>

            {/* Tabel Agenda Wawancara */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-300 font-sans text-xs space-y-2.5 my-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="text-slate-500 font-semibold">Hari / Tanggal</div>
                <div className="sm:col-span-2 font-bold text-slate-900 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-700" />
                  {invitation.interviewDayDate}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="text-slate-500 font-semibold">Waktu / Pukul</div>
                <div className="sm:col-span-2 font-bold text-slate-900 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-700" />
                  {invitation.interviewTime} WIB
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="text-slate-500 font-semibold">Tempat / Media</div>
                <div className="sm:col-span-2 font-bold text-slate-900 flex items-start gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>{invitation.venue}</span>
                </div>
              </div>
              {invitation.zoomUrl && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 border-t border-slate-200">
                  <div className="text-slate-500 font-semibold">Akses Virtual Zoom</div>
                  <div className="sm:col-span-2 space-y-1 text-slate-900">
                    <p className="font-mono text-emerald-800 font-bold break-all">{invitation.zoomUrl}</p>
                    {invitation.zoomMeetingId && (
                      <p className="text-[11px] text-slate-600">
                        Meeting ID: <span className="font-mono font-bold">{invitation.zoomMeetingId}</span> • Passcode:{' '}
                        <span className="font-mono font-bold">{invitation.zoomPasscode || '-'}</span>
                      </p>
                    )}
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 border-t border-slate-200">
                <div className="text-slate-500 font-semibold">Kandidat Diundang</div>
                <div className="sm:col-span-2 font-bold text-emerald-900 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-emerald-700" />
                  {invitation.candidates.join(', ')}
                </div>
              </div>
              {invitation.dresscode && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="text-slate-500 font-semibold">Ketentuan Busana</div>
                  <div className="sm:col-span-2 text-slate-800">{invitation.dresscode}</div>
                </div>
              )}
            </div>

            <p>
              Mengingat pentingnya agenda ini untuk penetapan rekomendasi resmi Dewan Pengawas Syariah, kami
              memohon kehadiran tepat waktu. Calon anggota DPS diharapkan mempersiapkan bahan paparan dan
              membawa dokumen asli kelengkapan yang telah diajukan.
            </p>
            <p>
              Demikian surat undangan ini kami sampaikan. Atas perhatian dan kerja sama yang baik, kami ucapkan
              terima kasih.
            </p>
            <p className="italic font-bold">Wassalamu’alaikum Warahmatullahi Wabarakatuh.</p>
          </div>

          {/* Tanda Tangan & Cap DSN-MUI */}
          <div className="pt-6 flex justify-between items-end font-sans text-xs">
            {/* QR Code Verifikasi */}
            <div className="space-y-1.5 text-center">
              <div className="p-2 border border-slate-300 rounded-lg inline-block bg-white shadow-xs">
                <div className="w-20 h-20 bg-slate-900 text-white flex flex-col items-center justify-center text-[9px] font-mono p-1 text-center font-bold">
                  <span>DSN-MUI</span>
                  <span className="text-[8px] text-emerald-400">VERIFIED</span>
                  <span className="text-[7px] text-slate-300 font-mono mt-1">{invitation.invitationNumber.slice(-8)}</span>
                </div>
              </div>
              <p className="text-[9px] text-slate-500 max-w-[120px] mx-auto leading-tight">
                Scan untuk verifikasi keabsahan surat undangan
              </p>
            </div>

            {/* Pejabat Penandatangan */}
            <div className="text-center space-y-16 min-w-[220px]">
              <div>
                <p className="font-semibold text-slate-700">Dewan Syariah Nasional - MUI</p>
                <p className="font-bold text-slate-900">{invitation.signatoryRole || 'Badan Pengurus Harian (BPH)'}</p>
              </div>

              {/* Tanda Tangan */}
              <div className="space-y-0.5 border-t border-slate-900 pt-1">
                <p className="font-bold text-slate-900 text-sm underline">
                  {invitation.signatoryName || 'Prof. Dr. KH. Hasanuddin, M.Ag'}
                </p>
                <p className="text-[11px] text-slate-600">Ketua Bidang Pengawasan</p>
              </div>
            </div>
          </div>

          {/* Footer Catatan Kontak */}
          <div className="border-t border-slate-200 pt-3 text-[10px] text-slate-500 font-sans flex flex-col sm:flex-row justify-between gap-1">
            <span>Konfirmasi Kehadiran: {invitation.contactPerson || 'Sekretariat DSN-MUI (021-3904141)'}</span>
            <span>Amanah e-Office • Dokumen Resmi Terverifikasi</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};
