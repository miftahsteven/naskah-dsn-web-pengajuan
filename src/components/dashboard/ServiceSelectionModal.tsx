import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DSN_SERVICES, type DsnServiceDefinition } from '../../data/dsnServices';
import { DsnServiceIcon } from '../common/DsnServiceIcon';
import { Modal } from '../ui/Modal';
import { Search, ChevronRight, Sparkles, ArrowLeft, HeartPulse, Building2, ShieldCheck, Lock } from 'lucide-react';

interface ServiceSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ServiceSelectionModal: React.FC<ServiceSelectionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubSectorService, setSelectedSubSectorService] = useState<DsnServiceDefinition | null>(null);

  const filteredServices = DSN_SERVICES.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.shortTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectService = (service: DsnServiceDefinition) => {
    if (service.code === 'SERTIFIKASI_KESESUAIAN_SYARIAH' || service.shortTitle.toLowerCase().includes('sertifikasi syariah')) {
      // Prompt user with the 2-choice sub-sector selection: Rumah Sakit vs Non Rumah Sakit under Sertifikasi Syariah
      setSelectedSubSectorService(service);
      return;
    }
    // 1. Close the modal popup
    onClose();
    // 2. Navigate immediately to the submission form with the service type preselected
    navigate(`/submissions/new?typeCode=${encodeURIComponent(service.code)}`);
  };

  const handleSelectSector = (sector: 'RS' | 'NON_RS') => {
    if (sector === 'NON_RS') return; // Disabled for now
    onClose();
    setSelectedSubSectorService(null);
    navigate(`/submissions/new?typeCode=SERTIFIKASI_KESESUAIAN_SYARIAH&sector=RS`);
  };

  const handleClose = () => {
    setSelectedSubSectorService(null);
    setSearchQuery('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      maxWidth="4xl"
      className="max-w-4xl"
      title={
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center flex-shrink-0">
            {selectedSubSectorService ? <HeartPulse className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-foreground">
              {selectedSubSectorService
                ? 'Pilih Sektor Pengajuan Sertifikasi Syariah'
                : 'Pilih Layanan Pengajuan Syariah'}
            </h3>
            <p className="text-[11px] text-muted-foreground font-normal">
              {selectedSubSectorService
                ? 'Pilih kategori institusi Anda untuk diarahkan ke formulir persyaratan yang tepat'
                : 'Pilih jenis permohonan DSN-MUI untuk langsung mengisi formulir berkas'}
            </p>
          </div>
        </div>
      }
    >
      {selectedSubSectorService ? (
        /* ── SUB-SECTOR SELECTION (RUMAH SAKIT VS NON RUMAH SAKIT) ── */
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setSelectedSubSectorService(null)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 hover:underline transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Kembali ke Semua Layanan
            </button>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              Sertifikasi Syariah
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* OPTION 1: RUMAH SAKIT (ACTIVE) */}
            <div
              onClick={() => handleSelectSector('RS')}
              className="group relative cursor-pointer rounded-2xl p-5 bg-gradient-to-b from-emerald-50/50 via-white to-white dark:from-emerald-950/20 dark:via-slate-900 dark:to-slate-900 border-2 border-emerald-500 hover:border-emerald-600 shadow-md hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                    <HeartPulse className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-600 text-white shadow-xs">
                    Layanan Aktif
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-extrabold text-foreground group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                    Rumah Sakit
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  </h4>
                  <p className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 mt-0.5">
                    Permohonan Sertifikasi Syariah Rumah Sakit
                  </p>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                    Pengajuan resmi sertifikasi syariah bagi institusi rumah sakit umum, RS swasta, dan fasilitas kesehatan bersama MUKISI dan DSN-MUI.
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-1">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Kelengkapan Berkas:
                  </div>
                  <div className="text-[11px] text-slate-700 dark:text-slate-300 space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span>7 Dokumen Legalitas Lengkap RS</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span>4 Dokumen Permohonan & Rekening LKS</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span>Kelengkapan Calon Anggota DPS (Multi-Kandidat)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span>Berkas Khusus RS (MUKISI, BPJPH, Akreditasi RS)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-emerald-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-emerald-700 dark:text-emerald-400">
                <span>Buka Formulir Rumah Sakit</span>
                <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* OPTION 2: NON RUMAH SAKIT (DISABLED / COMING SOON) */}
            <div className="relative rounded-2xl p-5 bg-slate-50/80 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 opacity-80 cursor-not-allowed flex flex-col justify-between select-none">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Segera Hadir
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-extrabold text-slate-700 dark:text-slate-300">
                    Non Rumah Sakit
                  </h4>
                  <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
                    Lembaga Bisnis, Keuangan, Fintech & Korporasi Umum
                  </p>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                    Pengajuan kesesuaian syariah untuk lembaga keuangan non-bank, perbankan, pasar modal, koperasi syariah, perhotelan, dan entitas bisnis non-faskes.
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Tahap Pengerjaan:
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Layanan ini akan segera diaktifkan pada tahap berikutnya setelah flow Rumah Sakit selesai diimplementasikan.
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-muted-foreground">
                <span>Tahap Berikutnya</span>
                <span className="text-[11px] font-mono">Segera Hadir</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ── DEFAULT ALL SERVICES GRID ── */
        <div className="space-y-4">
          {/* Search Filter Bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari layanan (contoh: Rekomendasi DPS, Fatwa, Kesesuaian Syariah)..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-muted/50 border border-border focus:border-emerald-500 focus:bg-background focus:outline-none transition-all"
              autoFocus
            />
          </div>

          {/* MacBook App-Style Grid (Compact & Balanced) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredServices.map((service, idx) => (
              <div
                key={service.code}
                onClick={() => handleSelectService(service)}
                className="group relative cursor-pointer select-none"
              >
                <div
                  className={`h-full flex flex-col justify-between p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-emerald-500/60 transition-all duration-200 transform hover:-translate-y-0.5 active:scale-[0.99]`}
                >
                  {/* Top Row: Category Badge & Index */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${service.badgeBg} ${service.badgeText} truncate max-w-[170px]`}
                    >
                      {service.category}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground/60 font-semibold">
                      #{idx + 1}
                    </span>
                  </div>

                  {/* Content: Balanced Icon + Name + Description */}
                  <div className="flex items-start gap-3 my-1">
                    {/* Compact macOS Squircle Icon */}
                    <div
                      className={`w-11 h-11 rounded-xl bg-gradient-to-br ${service.gradient} text-white flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 group-hover:shadow transition-transform`}
                    >
                      <DsnServiceIcon name={service.iconName} className="w-5 h-5 drop-shadow-xs" />
                    </div>

                    {/* Title & Concise Explanation */}
                    <div className="min-w-0 flex-1">
                      <h4
                        title={service.name}
                        className="text-xs sm:text-sm font-bold text-foreground group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors truncate whitespace-nowrap leading-snug"
                      >
                        {service.shortTitle || service.name}
                      </h4>
                      <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Action Hint */}
                  <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[11px] font-semibold text-muted-foreground group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                    <span>{service.code === 'KESESUAIAN_SYARIAH' ? 'Pilih Sektor' : 'Pilih Form Ini'}</span>
                    <div className="w-5 h-5 rounded-md bg-muted group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center transition-colors">
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredServices.length === 0 && (
            <div className="text-center py-8 text-xs text-muted-foreground space-y-2">
              <p>Tidak ada layanan yang sesuai dengan kata kunci "{searchQuery}".</p>
              <button
                onClick={() => setSearchQuery('')}
                className="text-emerald-600 font-bold hover:underline"
              >
                Tampilkan Semua Layanan
              </button>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};
