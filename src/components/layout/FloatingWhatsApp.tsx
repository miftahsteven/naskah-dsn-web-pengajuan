import React, { useState } from 'react';
import { X, Send } from 'lucide-react';

export const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M17.472 14.382c-.301-.15-1.777-.877-2.052-.977-.276-.1-.477-.15-.678.15s-.778.977-.954 1.178c-.175.201-.351.226-.652.076-.301-.15-1.27-.468-2.42-1.493-.895-.798-1.5-1.784-1.676-2.085-.175-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.175.2-.301.301-.501.1-.201.05-.376-.025-.527-.075-.15-.678-1.631-.929-2.233-.245-.586-.494-.506-.678-.515-.175-.01-.376-.01-.577-.01-.201 0-.527.075-.803.376-.276.301-1.053 1.028-1.053 2.508s1.078 2.909 1.229 3.11c.15.201 2.122 3.24 5.141 4.542.718.31 1.279.495 1.716.634.722.23 1.378.197 1.898.12.58-.087 1.777-.727 2.028-1.429.251-.702.251-1.304.175-1.43-.075-.125-.276-.201-.577-.351zM12.04 2c-5.52 0-10 4.47-10 9.99 0 1.76.46 3.48 1.33 5l-1.41 5.15 5.29-1.39c1.47.8 3.13 1.23 4.79 1.23 5.52 0 10-4.47 10-9.99S17.56 2 12.04 2zm0 18.23c-1.5 0-2.97-.4-4.25-1.16l-.3-.18-3.15.83.84-3.08-.2-.31a8.21 8.21 0 01-1.26-4.3c0-4.54 3.7-8.24 8.26-8.24 4.55 0 8.25 3.7 8.25 8.24s-3.7 8.2-8.24 8.2z" />
  </svg>
);

export const FloatingWhatsApp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [hasDismissed, setHasDismissed] = useState(false);

  const whatsappNumber = '6282260004146';
  const prefilledMessage = encodeURIComponent(
    'Assalamu’alaikum Admin Layanan DSN-MUI, saya ingin berkonsultasi mengenai pengajuan kesesuaian syariah di portal AMANAH.'
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${prefilledMessage}`;

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleCloseBubble = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    setHasDismissed(true);
  };

  return (
    <aside aria-label="Bantuan WhatsApp DSN-MUI" className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      {/* ── CHAT POPUP BUBBLE ── */}
      {isOpen && (
        <div className="pointer-events-auto mb-3.5 w-[330px] sm:w-[350px] rounded-2xl bg-white dark:bg-slate-900 border border-emerald-800/30 shadow-2xl overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
          {/* Card Header (DSN Emerald Theme) */}
          <div className="bg-gradient-to-r from-[#121c15] via-[#1a2e22] to-[#121c15] text-white p-4 border-b border-emerald-700/40 relative">
            <button
              onClick={handleCloseBubble}
              className="absolute top-3 right-3 p-1 text-emerald-300/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Tutup pesan"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src="/images/cs-hijab.jpg"
                  alt="Customer Service DSN-MUI"
                  className="w-12 h-12 rounded-full object-cover border-2 border-emerald-400 shadow"
                />
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#121c15] rounded-full" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold text-white tracking-wide">
                    Admin Layanan DSN-MUI
                  </h4>
                </div>
                <p className="text-[11px] text-emerald-300 font-medium">
                  Portal Kesesuaian Syariah AMANAH
                </p>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-200/80 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Online • Siap Membantu Anda</span>
                </div>
              </div>
            </div>
          </div>

          {/* Message Body */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950/70 space-y-3">
            <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs text-xs text-slate-700 dark:text-slate-200 leading-relaxed space-y-1.5">
              <p className="font-semibold text-emerald-800 dark:text-emerald-400">
                Assalamu’alaikum Wr. Wb. 👋
              </p>
              <p>
                Ada yang ingin ditanyakan seputar permohonan sertifikasi, rekomendasi DPS, atau opini kesesuaian syariah?
              </p>
              <p className="text-muted-foreground text-[11px]">
                Silakan hubungi kami melalui WhatsApp resmi untuk konsultasi langsung.
              </p>
            </div>

            {/* WhatsApp Action Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] active:scale-[0.98] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
            >
              <WhatsAppIcon className="w-4 h-4 text-white" />
              <span>Chat via WhatsApp Sekarang</span>
              <Send className="w-3.5 h-3.5 ml-auto opacity-80" />
            </a>

            <div className="text-center">
              <span className="text-[10px] text-muted-foreground">
                Hotline Resmi: <strong className="text-slate-700 dark:text-slate-300">0822 6000 4146</strong>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── FLOATING TRIGGER BUTTON (STANDARD WHATSAPP CIRCLE BUTTON) ── */}
      <div className="pointer-events-auto flex items-center gap-3">
        {/* Callout Pill (Visible when collapsed) */}
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-2 py-2 px-3.5 rounded-full bg-white dark:bg-slate-900 text-slate-800 dark:text-white border border-emerald-600/30 shadow-xl hover:shadow-2xl text-xs font-semibold hover:border-emerald-500 transition-all duration-200 group"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Ada pertanyaan? Chat WhatsApp</span>
          </button>
        )}

        {/* Main Floating WhatsApp Circle Button (Standard Large Size) */}
        <button
          onClick={handleToggle}
          aria-label="Buka Chat WhatsApp DSN-MUI"
          className="relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-[0_8px_25px_rgba(37,211,102,0.45)] hover:shadow-[0_10px_30px_rgba(37,211,102,0.6)] focus:outline-hidden focus:ring-4 focus:ring-emerald-400/40 transition-all duration-300 hover:scale-105 active:scale-95 group"
        >
          {/* Subtle pulse ring effect */}
          <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-30 animate-ping -z-10 group-hover:opacity-50 duration-1000" />

          {/* Real WhatsApp Icon (Standard large icon) */}
          <WhatsAppIcon className="w-8 h-8 sm:w-9 sm:h-9 text-white drop-shadow-sm group-hover:rotate-6 transition-transform duration-300" />

          {/* Active Status Indicator Dot */}
          <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-300 border-2 border-white shadow-xs" />
          </span>
        </button>
      </div>
    </aside>
  );
};

export default FloatingWhatsApp;
