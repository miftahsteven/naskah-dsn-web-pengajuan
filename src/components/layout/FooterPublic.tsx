import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

export const FooterPublic: React.FC = () => {
  return (
    <footer className="bg-[#121c15] text-[#E8F5EE] border-t border-emerald-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & Address */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-white p-1.5 shadow-md flex items-center justify-center">
                <img
                  src="/images/logo-dsn.png"
                  alt="DSN-MUI Logo"
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight text-white">
                  AMANAH
                </span>
                <p className="text-xs text-emerald-400 font-medium">
                  Portal Pengajuan Kesesuaian Syariah Resmi
                </p>
              </div>
            </div>

            <p className="text-xs text-emerald-200/80 leading-relaxed max-w-sm">
              Satu pintu digital pelayanan permohonan sertifikasi dan opini kesesuaian syariah antara lembaga keuangan, industri, dan bisnis dengan Dewan Syariah Nasional – Majelis Ulama Indonesia.
            </p>

            <div className="space-y-2 pt-2 text-xs text-emerald-300/80">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                <span>
                  Gedung Majelis Ulama Indonesia, Lt. 3, Jl. Proklamasi No. 51, Menteng, Jakarta Pusat 10320
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-accent flex-shrink-0" />
                <span>(021) 3192 7623 / 391 7332</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-accent flex-shrink-0" />
                <span>sekretariat@dsnmui.or.id</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Layanan Syariah
            </h4>
            <ul className="space-y-2.5 text-xs text-emerald-200/80">
              <li>
                <a href="/#kategori" className="hover:text-accent transition-colors">
                  Perbankan Syariah
                </a>
              </li>
              <li>
                <a href="/#kategori" className="hover:text-accent transition-colors">
                  Fintech & P2P Lending
                </a>
              </li>
              <li>
                <a href="/#kategori" className="hover:text-accent transition-colors">
                  Pasar Modal & Sukuk
                </a>
              </li>
              <li>
                <a href="/#kategori" className="hover:text-accent transition-colors">
                  Asuransi & Reasuransi
                </a>
              </li>
              <li>
                <a href="/#kategori" className="hover:text-accent transition-colors">
                  Rumah Sakit & Hotel Halal
                </a>
              </li>
              <li>
                <a href="/#kategori" className="hover:text-accent transition-colors">
                  Bisnis Berjenjang Syariah
                </a>
              </li>
            </ul>
          </div>

          {/* Alur & Panduan */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Panduan Pemohon
            </h4>
            <ul className="space-y-2.5 text-xs text-emerald-200/80">
              <li>
                <a href="/#alur" className="hover:text-accent transition-colors">
                  Alur 4 Langkah
                </a>
              </li>
              <li>
                <Link to="/help" className="hover:text-accent transition-colors">
                  Persyaratan Dokumen
                </Link>
              </li>
              <li>
                <a href="/#faq" className="hover:text-accent transition-colors">
                  Tanya Jawab (FAQ)
                </a>
              </li>
              <li>
                <Link to="/login" className="hover:text-accent transition-colors">
                  Login Akun PIC
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-accent transition-colors">
                  Pendaftaran Perusahaan
                </Link>
              </li>
            </ul>
          </div>

          {/* Institutional Integrity & Badges */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Integritas & Keamanan
            </h4>
            <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800/60 space-y-3">
              <div className="flex items-center gap-2 text-accent">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-xs font-bold">Single Source of Truth</span>
              </div>
              <p className="text-[11px] text-emerald-200/70 leading-relaxed">
                Seluruh permohonan diproses secara transparan dan terintegrasi langsung dengan tata kelola persuratan resmi DSN-MUI.
              </p>
              <div className="pt-1 flex items-center gap-2">
                <img
                  src="/images/wqa-ukas.png"
                  alt="UKAS ISO Certification"
                  className="h-8 object-contain bg-white/90 rounded p-0.5"
                />
                <span className="text-[10px] text-emerald-300/80">
                  ISO 9001:2015 Quality Management
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-8 border-t border-emerald-900/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-400/70">
          <div>
            © 2026 Dewan Syariah Nasional – Majelis Ulama Indonesia. Hak Cipta Dilindungi.
          </div>
          <div className="flex items-center gap-6">
            <Link to="/help" className="hover:underline">
              Ketentuan Layanan
            </Link>
            <Link to="/help" className="hover:underline">
              Kebijakan Privasi
            </Link>
            <a
              href="https://dsnmui.or.id"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-accent"
            >
              Portal Utama DSN-MUI <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
