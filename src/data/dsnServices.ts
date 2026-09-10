export interface DsnServiceDefinition {
  code: string;
  name: string;
  shortTitle: string;
  tag: string;
  category: string;
  description: string;
  detailedScope: string;
  iconName: string;
  gradient: string;
  iconBg: string;
  borderHover: string;
  glowColor: string;
  badgeBg: string;
  badgeText: string;
  keyRequirements: string[];
}

export const DSN_SERVICES: DsnServiceDefinition[] = [
  {
    code: 'FATWA',
    name: 'Permohonan Fatwa',
    shortTitle: 'Fatwa Syariah',
    tag: 'Fatwa Baru',
    category: 'Regulasi Syariah',
    description: 'Permohonan fatwa hukum syariah baru atau fatwa turunan terkait inovasi akad, produk, atau skema transaksi keuangan dan bisnis syariah.',
    detailedScope: 'Kajian fikih muamalah mendalam bersama para ulama dan pakar ekonomi syariah untuk menetapkan keabsahan produk keuangan, instrumen pasar modal, serta model bisnis kontemporer.',
    iconName: 'BookOpen',
    gradient: 'from-emerald-600 via-emerald-700 to-teal-800',
    iconBg: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
    borderHover: 'hover:border-emerald-500/60',
    glowColor: 'hover:shadow-emerald-500/20',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800',
    badgeText: 'text-emerald-700 dark:text-emerald-300',
    keyRequirements: [
      'Surat Permohonan Resmi Direksi',
      'Dokumen Kajian / Latar Belakang Kebutuhan Fatwa',
      'Draf Usulan Akad / Skema Produk',
      'Opini Awal DPS / Rekomendasi Ahli Syariah',
    ],
  },
  {
    code: 'REKOMENDASI_DPS',
    name: 'Permohonan Rekomendasi DPS',
    shortTitle: 'Rekomendasi DPS',
    tag: 'Dewan Pengawas',
    category: 'Kepengurusan',
    description: 'Permohonan rekomendasi penempatan, perpanjangan masa tugas, atau pergantian anggota Dewan Pengawas Syariah (DPS) pada lembaga.',
    detailedScope: 'Verifikasi kompetensi, integritas, dan pemenuhan ketentuan batas rangkap jabatan calon anggota DPS sebelum diusulkan ke OJK/BI dan ditetapkan dalam RUPS.',
    iconName: 'Users',
    gradient: 'from-teal-600 via-teal-700 to-cyan-800',
    iconBg: 'bg-teal-500/15 text-teal-600 dark:text-teal-400',
    borderHover: 'hover:border-teal-500/60',
    glowColor: 'hover:shadow-teal-500/20',
    badgeBg: 'bg-teal-50 dark:bg-teal-950/60 border-teal-200 dark:border-teal-800',
    badgeText: 'text-teal-700 dark:text-teal-300',
    keyRequirements: [
      'Surat Permohonan Rekomendasi DPS dari Direksi',
      'Daftar Riwayat Hidup (CV) Lengkap Calon DPS',
      'Sertifikat Pelatihan / Kompetensi DPS DSN-MUI',
      'Surat Pernyataan Kesediaan & Pakta Integritas',
    ],
  },
  {
    code: 'REKOMENDASI_TAS',
    name: 'Permohonan Rekomendasi TAS',
    shortTitle: 'Rekomendasi TAS',
    tag: 'Tim Ahli Syariah',
    category: 'Konsultasi Pasar Modal',
    description: 'Permohonan rekomendasi penunjukan Tim Ahli Syariah (TAS) dalam penerbitan efek syariah, sukuk, reksa dana syariah, atau konsultasi bisnis.',
    detailedScope: 'Penelaahan kualifikasi Tim Ahli Syariah yang mendampingi emiten dan manajer investasi dalam memastikan kesesuaian efek syariah yang ditawarkan kepada publik.',
    iconName: 'Award',
    gradient: 'from-amber-600 via-amber-700 to-orange-800',
    iconBg: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
    borderHover: 'hover:border-amber-500/60',
    glowColor: 'hover:shadow-amber-500/20',
    badgeBg: 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800',
    badgeText: 'text-amber-700 dark:text-amber-300',
    keyRequirements: [
      'Surat Permohonan Penunjukan TAS dari Emiten/MI',
      'Tanda Daftar / Izin Ahli Syariah Pasar Modal (ASPM)',
      'Profil & Portofolio Pengalaman Calon TAS',
      'Draf Kontrak / Ruang Lingkup Penugasan',
    ],
  },
  {
    code: 'KESESUAIAN_SYARIAH',
    name: 'Permohonan Pernyataan Kesesuaian Syariah',
    shortTitle: 'Kesesuaian Syariah',
    tag: 'Kepatuhan Produk',
    category: 'Produk & Layanan',
    description: 'Permohonan surat pernyataan kesesuaian syariah (Shariah Compliance Statement) atas produk baru, skema pembiayaan, atau layanan institusi.',
    detailedScope: 'Uji kesesuaian syariah terhadap akad, alur transaksi (flowchart), pembagian margin/ujrah, serta dokumen operasional produk sebelum diluncurkan ke pasar.',
    iconName: 'ShieldCheck',
    gradient: 'from-emerald-700 via-green-800 to-teal-900',
    iconBg: 'bg-emerald-600/15 text-emerald-700 dark:text-emerald-400',
    borderHover: 'hover:border-emerald-600/60',
    glowColor: 'hover:shadow-emerald-600/20',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800',
    badgeText: 'text-emerald-800 dark:text-emerald-300',
    keyRequirements: [
      'Surat Permohonan Pernyataan Kesesuaian Syariah',
      'Deskripsi Produk, Flowchart Transaksi & Simulasi',
      'Draf Dokumen Perjanjian / Kontrak Nasabah',
      'Opini / Rekomendasi DPS Internal Lembaga',
    ],
  },
  {
    code: 'KESELARASAN_SYARIAH',
    name: 'Permohonan Pernyataan Keselarasan Syariah',
    shortTitle: 'Keselarasan Syariah',
    tag: 'Harmonisasi Regulasi',
    category: 'Regulasi & Kepatuhan',
    description: 'Permohonan evaluasi keselarasan implementasi prinsip syariah terhadap fatwa DSN-MUI dan ketentuan regulasi otoritas pengawas (OJK/BI).',
    detailedScope: 'Harmonisasi ketentuan hukum positif dengan hukum syariah guna memastikan operasional entitas mematuhi regulasi prudensial sekaligus fatwa syariah.',
    iconName: 'GitMerge',
    gradient: 'from-indigo-600 via-indigo-700 to-blue-800',
    iconBg: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400',
    borderHover: 'hover:border-indigo-500/60',
    glowColor: 'hover:shadow-indigo-500/20',
    badgeBg: 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800',
    badgeText: 'text-indigo-700 dark:text-indigo-300',
    keyRequirements: [
      'Surat Permohonan Evaluasi Keselarasan Syariah',
      'Matriks Keselarasan Regulasi OJK/BI vs Fatwa DSN',
      'Laporan Self-Assessment Kepatuhan Syariah',
      'Catatan & Rekomendasi DPS Pemohon',
    ],
  },
  {
    code: 'SERTIFIKASI_KESESUAIAN_SYARIAH',
    name: 'Sertifikasi Kesesuaian Syariah',
    shortTitle: 'Sertifikasi Syariah',
    tag: 'Sertifikasi Entitas',
    category: 'Audit & Sertifikasi',
    description: 'Pengajuan sertifikasi formal kesesuaian syariah untuk institusi, entitas usaha halal, rumah sakit syariah, perhotelan, atau platform digital.',
    detailedScope: 'Audit komprehensif atas tata kelola bisnis, sistem operasional, sarana prasarana, dan komitmen syariah yang bermuara pada penerbitan Sertifikat Resmi DSN-MUI.',
    iconName: 'FileCheck2',
    gradient: 'from-amber-500 via-yellow-600 to-amber-700',
    iconBg: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
    borderHover: 'hover:border-amber-500/60',
    glowColor: 'hover:shadow-amber-500/20',
    badgeBg: 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800',
    badgeText: 'text-amber-800 dark:text-amber-300',
    keyRequirements: [
      'Surat Permohonan Sertifikasi Kesesuaian Syariah',
      'Akta Pendirian, NIB & Izin Operasional Instansi',
      'Pedoman Pelayanan / Manual Standar Operasi Syariah',
      'Laporan Hasil Audit / Evaluasi Lapangan',
    ],
  },
  {
    code: 'LAPORAN_PENGAWASAN_DPS',
    name: 'Laporan Hasil Pengawasan DPS',
    shortTitle: 'Laporan DPS',
    tag: 'Pelaporan Berkala',
    category: 'Pengawasan Berkala',
    description: 'Penyampaian berkala Laporan Hasil Pengawasan (LHP) Dewan Pengawas Syariah semesteran atau tahunan dari lembaga keuangan syariah ke DSN-MUI.',
    detailedScope: 'Kanal pelaporan berkala resmi bagi Dewan Pengawas Syariah untuk menyampaikan temuan audit internal kepatuhan syariah, rekomendasi perbaikan, dan evaluasi berkala.',
    iconName: 'ClipboardCheck',
    gradient: 'from-sky-600 via-blue-700 to-indigo-800',
    iconBg: 'bg-sky-500/15 text-sky-600 dark:text-sky-400',
    borderHover: 'hover:border-sky-500/60',
    glowColor: 'hover:shadow-sky-500/20',
    badgeBg: 'bg-sky-50 dark:bg-sky-950/60 border-sky-200 dark:border-sky-800',
    badgeText: 'text-sky-700 dark:text-sky-300',
    keyRequirements: [
      'Surat Pengantar LHP Bertanda Tangan DPS & Direksi',
      'Dokumen Lengkap Laporan Hasil Pengawasan (LHP)',
      'Matriks Temuan Pengawasan & Tindak Lanjut Perbaikan',
      'Risalah / Notulen Rapat Koordinasi DPS',
    ],
  },
  {
    code: 'SURAT_PENGADUAN',
    name: 'Surat Pengaduan',
    shortTitle: 'Pengaduan Syariah',
    tag: 'Saluran Resmi',
    category: 'Perlindungan & Sengketa',
    description: 'Saluran pengaduan resmi terkait dugaan ketidaksesuaian syariah, sengketa muamalah, atau pelanggaran prinsip syariah pada lembaga terkait.',
    detailedScope: 'Mekanisme penerimaan laporan dan penanganan pengaduan dari masyarakat, nasabah, atau institusi mitra mengenai indikasi penyimpangan kaidah syariah.',
    iconName: 'AlertTriangle',
    gradient: 'from-rose-600 via-rose-700 to-red-800',
    iconBg: 'bg-rose-500/15 text-rose-600 dark:text-rose-400',
    borderHover: 'hover:border-rose-500/60',
    glowColor: 'hover:shadow-rose-500/20',
    badgeBg: 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800',
    badgeText: 'text-rose-700 dark:text-rose-300',
    keyRequirements: [
      'Surat Pengaduan Resmi & Kronologis Lengkap Kasus',
      'Bukti Perjanjian / Akad / Dokumen Transaksi Terkait',
      'Identitas Pelapor / Surat Kuasa Khusus',
      'Bukti Upaya Klarifikasi / Musyawarah Sebelumnya',
    ],
  },
  {
    code: 'UMUM',
    name: 'Umum',
    shortTitle: 'Layanan Umum',
    tag: 'Konsultasi & Lainnya',
    category: 'Korespondensi',
    description: 'Permohonan audiensi, konsultasi awal muamalah syariah, permintaan narasumber, atau korespondensi resmi umum lainnya ke DSN-MUI.',
    detailedScope: 'Kanal permohonan koordinasi kelembagaan, permohonan narasumber seminar/workshop fikih muamalah, penjajakan kerja sama, dan konsultasi syariah awal.',
    iconName: 'HelpCircle',
    gradient: 'from-slate-600 via-slate-700 to-zinc-800',
    iconBg: 'bg-slate-500/15 text-slate-600 dark:text-slate-400',
    borderHover: 'hover:border-slate-500/60',
    glowColor: 'hover:shadow-slate-500/20',
    badgeBg: 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700',
    badgeText: 'text-slate-700 dark:text-slate-300',
    keyRequirements: [
      'Surat Permohonan Resmi Berkop Institusi',
      'Kerangka Acuan Kerja (TOR) / Pokok Agenda Konsultasi',
      'Profil Lembaga & Narahubung Penanggung Jawab',
    ],
  },
];

export const getServiceMeta = (codeOrName: string): DsnServiceDefinition => {
  const found = DSN_SERVICES.find(
    (s) => s.code.toLowerCase() === codeOrName.toLowerCase() || s.name.toLowerCase() === codeOrName.toLowerCase()
  );
  if (found) return found;

  // Fallback
  return {
    code: codeOrName,
    name: codeOrName,
    shortTitle: codeOrName,
    tag: 'Layanan',
    category: 'DSN-MUI',
    description: 'Layanan administrasi dan permohonan syariah resmi DSN-MUI.',
    detailedScope: 'Proses verifikasi dokumen, penelaahan substansi syariah, dan penerbitan rekomendasi/sertifikat resmi.',
    iconName: 'FileText',
    gradient: 'from-emerald-600 to-teal-700',
    iconBg: 'bg-primary/10 text-primary',
    borderHover: 'hover:border-primary/60',
    glowColor: 'hover:shadow-primary/20',
    badgeBg: 'bg-secondary border-emerald-200',
    badgeText: 'text-primary',
    keyRequirements: ['Surat Permohonan Resmi', 'Dokumen Legalitas Perusahaan'],
  };
};
