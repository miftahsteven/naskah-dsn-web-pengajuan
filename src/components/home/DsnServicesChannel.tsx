import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DSN_SERVICES, type DsnServiceDefinition } from '../../data/dsnServices';
import { DsnServiceIcon } from '../common/DsnServiceIcon';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import {
  ArrowRight,
  Sparkles,
  Search,
  CheckCircle2,
  FileText,
  ShieldCheck,
  ChevronRight,
  Layers,
  PhoneCall,
  ExternalLink,
  Info,
} from 'lucide-react';

type FilterCategory = 'ALL' | 'REGULASI' | 'PENGAWAS' | 'KEPATUHAN' | 'PELAPORAN';

export const DsnServicesChannel: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [activeCategory, setActiveCategory] = useState<FilterCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState<DsnServiceDefinition | null>(null);

  const categoryTabs: { id: FilterCategory; label: string; count: number }[] = [
    { id: 'ALL', label: 'Semua Layanan', count: 9 },
    { id: 'REGULASI', label: 'Fatwa & Regulasi', count: 2 },
    { id: 'PENGAWAS', label: 'DPS & Ahli Syariah', count: 2 },
    { id: 'KEPATUHAN', label: 'Kepatuhan & Sertifikasi', count: 2 },
    { id: 'PELAPORAN', label: 'Laporan & Pengaduan', count: 3 },
  ];

  const filteredServices = useMemo(() => {
    return DSN_SERVICES.filter((s) => {
      // Category Match
      let matchesCategory = true;
      if (activeCategory === 'REGULASI') {
        matchesCategory = ['FATWA', 'KESELARASAN_SYARIAH'].includes(s.code);
      } else if (activeCategory === 'PENGAWAS') {
        matchesCategory = ['REKOMENDASI_DPS', 'REKOMENDASI_TAS'].includes(s.code);
      } else if (activeCategory === 'KEPATUHAN') {
        matchesCategory = ['KESESUAIAN_SYARIAH', 'SERTIFIKASI_KESESUAIAN_SYARIAH'].includes(s.code);
      } else if (activeCategory === 'PELAPORAN') {
        matchesCategory = ['LAPORAN_PENGAWASAN_DPS', 'SURAT_PENGADUAN', 'UMUM'].includes(s.code);
      }

      // Search Match
      const matchesSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.shortTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.tag.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const handleApply = (serviceCode: string) => {
    setSelectedService(null);
    if (isAuthenticated) {
      navigate(`/submissions/new?typeCode=${encodeURIComponent(serviceCode)}`);
    } else {
      navigate(`/login?redirect=${encodeURIComponent(`/submissions/new?typeCode=${serviceCode}`)}`);
    }
  };

  return (
    <section id="layanan" className="py-24 bg-slate-50 dark:bg-[#0c140e] border-b border-border/80 relative overflow-hidden">
      {/* Background Decorative Lighting */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* ── 1. SECTION HEADER ── */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-primary dark:text-emerald-300 text-xs font-bold shadow-subtle">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span>Kanal Khusus Layanan DSN-MUI</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
            9 Pintu Layanan Terpadu{' '}
            <span className="text-gradient">Dewan Syariah Nasional</span>
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Pusat pelayanan digital terintegrasi bagi institusi perbankan, pasar modal, lembaga keuangan non-bank, dan korporasi untuk pengajuan fatwa, rekomendasi, opini kepatuhan, serta pelaporan berkala.
          </p>
        </div>

        {/* ── 2. FILTER TABS & SEARCH BAR ── */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900/80 p-3 sm:p-4 rounded-3xl border border-border shadow-subtle">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {categoryTabs.map((tab) => {
              const isActive = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-primary text-white shadow-md'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari jenis layanan..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-border focus:ring-2 focus:ring-primary focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* ── 3. SERVICE CARDS GRID (9 SERVICES) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service, idx) => (
            <div
              key={service.code}
              className={`p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#151f17] border border-border ${service.borderHover} transition-all duration-300 hover:shadow-card-hover flex flex-col justify-between group relative overflow-hidden`}
            >
              {/* Subtle top-right gradient glow */}
              <div
                className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-10 rounded-full blur-2xl transition-opacity duration-300 pointer-events-none`}
              />

              <div className="space-y-4 relative z-10">
                {/* Header: Icon & Badges */}
                <div className="flex items-center justify-between">
                  <div
                    className={`w-14 h-14 rounded-2xl ${service.iconBg} flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300 border border-black/5 dark:border-white/10`}
                  >
                    <DsnServiceIcon
                      iconName={service.iconName}
                      className="w-7 h-7"
                    />
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      0{idx + 1}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${service.badgeBg} ${service.badgeText}`}
                    >
                      {service.tag}
                    </span>
                  </div>
                </div>

                {/* Service Title & Scope Description */}
                <div>
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-2 line-clamp-3">
                    {service.description}
                  </p>
                </div>

                {/* Key Requirements Highlights */}
                <div className="pt-3 border-t border-border/60 space-y-1.5">
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Ketentuan Dokumen Utama:
                  </div>
                  <div className="space-y-1">
                    {service.keyRequirements.slice(0, 2).map((req, rIdx) => (
                      <div
                        key={rIdx}
                        className="text-[11px] text-foreground/80 flex items-start gap-2 truncate"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                        <span className="truncate">{req}</span>
                      </div>
                    ))}
                    {service.keyRequirements.length > 2 && (
                      <div className="text-[10px] text-muted-foreground italic pl-5">
                        +{service.keyRequirements.length - 2} dokumen pendukung lainnya
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 mt-4 border-t border-border/60 flex items-center gap-2 relative z-10">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSelectedService(service)}
                  className="flex-1 text-xs"
                >
                  Detail & Syarat
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleApply(service.code)}
                  className="flex-1 text-xs shadow-sm hover:shadow-glow-green"
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Ajukan
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* ── 4. SECRETARIAT CONSULTATION BANNER ── */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#004d25] via-[#006633] to-[#00381a] text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-80 h-80 bg-accent/15 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-2 relative z-10 text-center md:text-left max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-accent text-xs font-bold border border-white/15">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pendampingan Administrasi & Syariah</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Butuh Konsultasi Sebelum Mengajukan Berkas?
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Tim Verifikator dan Sekretariat DSN-MUI siap membantu memastikan kelengkapan berkas, format surat resmi direksi, dan kesesuaian draf akad agar proses sidang berjalan lancar.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 relative z-10 flex-shrink-0 w-full md:w-auto">
            <a
              href="mailto:sekretariat@dsnmui.or.id"
              className="w-full sm:w-auto"
            >
              <Button
                variant="gold"
                size="md"
                className="w-full sm:w-auto shadow-md"
                leftIcon={<PhoneCall className="w-4 h-4" />}
              >
                Hubungi Sekretariat
              </Button>
            </a>
            <a href="#faq" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="md"
                className="w-full sm:w-auto text-white border-white/30 hover:bg-white/10"
              >
                Pelajari FAQ
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* ── 5. SERVICE DETAIL MODAL ── */}
      {selectedService && (
        <Modal
          isOpen={!!selectedService}
          onClose={() => setSelectedService(null)}
          title={selectedService.name}
          description={selectedService.category}
          maxWidth="2xl"
        >
          <div className="space-y-6">
            {/* Service Highlight Card */}
            <div className="p-4 rounded-2xl bg-secondary/50 border border-emerald-200 dark:border-emerald-800 flex items-start gap-4">
              <div
                className={`w-12 h-12 rounded-xl ${selectedService.iconBg} flex items-center justify-center flex-shrink-0 shadow-sm`}
              >
                <DsnServiceIcon
                  iconName={selectedService.iconName}
                  className="w-6 h-6"
                />
              </div>
              <div className="space-y-1">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${selectedService.badgeBg} ${selectedService.badgeText}`}
                >
                  {selectedService.tag}
                </span>
                <h4 className="text-sm font-bold text-foreground">
                  Ruang Lingkup & Penelaahan
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {selectedService.detailedScope}
                </p>
              </div>
            </div>

            {/* Checklist of Requirements */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Dokumen Persyaratan Pengajuan:
                </div>
                <span className="text-[11px] text-muted-foreground font-semibold">
                  Format: PDF, Maks 20 MB / Berkas
                </span>
              </div>

              <div className="space-y-2">
                {selectedService.keyRequirements.map((req, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-border flex items-start gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-foreground">{req}</div>
                      <div className="text-[11px] text-muted-foreground">
                        Wajib dilampirkan bertanda tangan dan berstempel resmi instansi pemohon.
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-border flex items-center justify-between gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedService(null)}
              >
                Kembali
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleApply(selectedService.code)}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="shadow-md hover:shadow-glow-green"
              >
                Mulai Buat Pengajuan Ini
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
};
