import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DSN_SERVICES, type DsnServiceDefinition } from '../../data/dsnServices';
import { DsnServiceIcon } from '../common/DsnServiceIcon';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import {
  ArrowRight,
  Sparkles,
  Search,
  CheckCircle2,
  FileText,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

interface MacbookServiceGridProps {
  onSelectService?: (service: DsnServiceDefinition) => void;
  className?: string;
}

export const MacbookServiceGrid: React.FC<MacbookServiceGridProps> = ({
  onSelectService,
  className = '',
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState<DsnServiceDefinition | null>(null);

  const filteredServices = DSN_SERVICES.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.shortTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenService = (service: DsnServiceDefinition) => {
    if (onSelectService) {
      onSelectService(service);
    } else {
      setSelectedService(service);
    }
  };

  const handleStartSubmission = (serviceCode: string) => {
    setSelectedService(null);
    navigate(`/submissions/new?typeCode=${encodeURIComponent(serviceCode)}`);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* ── MACBOOK LAUNCHPAD HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-[#00381a]/90 text-white p-6 rounded-3xl border border-white/10 shadow-xl backdrop-blur-xl relative overflow-hidden">
        {/* Soft decorative glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-emerald-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Pusat Layanan Resmi DSN-MUI</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Pilihan Menu Layanan Syariah
          </h2>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            Pilih menu layanan di bawah ini untuk memulai pengajuan surat permohonan, rekomendasi, pengawasan, atau sertifikasi institusi Anda.
          </p>
        </div>

        {/* Quick Search */}
        <div className="relative z-10 sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari layanan (cth: Fatwa, DPS)..."
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/20 focus:border-emerald-400 focus:outline-none text-white placeholder-slate-400 backdrop-blur-md transition-all"
          />
        </div>
      </div>

      {/* ── MACBOOK SQUARE APPS GRID ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-5">
        {filteredServices.map((service, idx) => (
          <div
            key={service.code}
            onClick={() => handleOpenService(service)}
            className="group relative cursor-pointer select-none"
          >
            {/* Main macOS App Tile */}
            <div
              className={`h-full flex flex-col justify-between p-5 sm:p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 shadow-sm transition-all duration-300 transform group-hover:-translate-y-2 group-hover:scale-[1.02] group-hover:shadow-xl ${service.borderHover} ${service.glowColor} group-active:scale-[0.98] overflow-hidden`}
            >
              {/* Glossy top reflection highlight */}
              <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white/40 dark:from-white/5 to-transparent pointer-events-none rounded-t-3xl" />

              {/* Number Index Pill (Mac subtle indicator) */}
              <div className="flex items-center justify-between mb-4 relative z-10">
                <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[11px] font-mono font-bold flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors shadow-inner">
                  {idx + 1}
                </span>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${service.badgeBg} ${service.badgeText}`}
                >
                  {service.tag}
                </span>
              </div>

              {/* Center App Icon (Mac Squircle with Gradient) */}
              <div className="flex flex-col items-center text-center space-y-3 my-2 relative z-10">
                <div
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${service.gradient} text-white flex items-center justify-center shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300 border border-white/25 ring-4 ring-black/5 dark:ring-white/5`}
                >
                  <DsnServiceIcon name={service.iconName} className="w-8 h-8 sm:w-9 sm:h-9 drop-shadow" />
                </div>

                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                    {service.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>

              {/* Bottom Quick CTA button */}
              <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between relative z-10 text-xs font-semibold text-slate-600 dark:text-slate-300 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                <span className="text-[11px]">Buka Layanan</span>
                <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center transition-all shadow-sm">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-3">
          <p className="text-sm text-slate-500">Tidak ada layanan yang cocok dengan kata kunci "{searchQuery}".</p>
          <Button variant="outline" size="sm" onClick={() => setSearchQuery('')}>
            Reset Pencarian
          </Button>
        </div>
      )}

      {/* ── MODAL DETAIL LAYANAN & DIRECT ACTION ── */}
      {selectedService && (
        <Modal
          isOpen={!!selectedService}
          onClose={() => setSelectedService(null)}
          title={selectedService.name}
          maxWidth="lg"
        >
          <div className="space-y-6">
            {/* Header Hero */}
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${selectedService.gradient} text-white flex items-center justify-center flex-shrink-0 shadow-md`}
              >
                <DsnServiceIcon name={selectedService.iconName} className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${selectedService.badgeBg} ${selectedService.badgeText}`}
                  >
                    {selectedService.category}
                  </span>
                  <span className="text-[10px] text-slate-400">• Kode: {selectedService.code}</span>
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  {selectedService.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {selectedService.detailedScope}
                </p>
              </div>
            </div>

            {/* Checklist Persyaratan Utama */}
            <div>
              <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>Dokumen Persyaratan Utama yang Diperlukan:</span>
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {selectedService.keyRequirements.map((req, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start gap-2 shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 dark:text-slate-300 font-medium leading-tight">
                      {req}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Notice */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>
                Dokumen pengajuan Anda akan diperiksa langsung oleh Sekretariat DSN-MUI dan ditelaah dalam Sidang Pleno Badan Pengurus Harian (BPH) DSN-MUI.
              </span>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <Button variant="outline" size="md" onClick={() => setSelectedService(null)}>
                Tutup
              </Button>
              <Button
                variant="primary"
                size="md"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={() => handleStartSubmission(selectedService.code)}
                className="shadow-md"
              >
                Mulai Buat Pengajuan Ini
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
