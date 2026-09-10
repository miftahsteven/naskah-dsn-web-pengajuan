import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DSN_SERVICES, type DsnServiceDefinition } from '../../data/dsnServices';
import { DsnServiceIcon } from '../common/DsnServiceIcon';
import { Modal } from '../ui/Modal';
import { Search, ChevronRight, Sparkles } from 'lucide-react';

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

  const filteredServices = DSN_SERVICES.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.shortTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectService = (service: DsnServiceDefinition) => {
    // 1. Close the modal popup
    onClose();
    // 2. Navigate immediately to the submission form with the service type preselected
    navigate(`/submissions/new?typeCode=${encodeURIComponent(service.code)}`);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="4xl"
      className="max-w-4xl"
      title={
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-foreground">
              Pilih Layanan Pengajuan Syariah
            </h3>
            <p className="text-[11px] text-muted-foreground font-normal">
              Pilih jenis permohonan DSN-MUI untuk langsung mengisi formulir berkas
            </p>
          </div>
        </div>
      }
    >
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
                  <span>Pilih Form Ini</span>
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
    </Modal>
  );
};
