import axios from 'axios';

// Normalize API and Server Base URLs from environment
const rawApiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:4002/api/public').trim().replace(/\/+$/, '');

export const API_BASE_URL = rawApiUrl.endsWith('/api/public')
  ? rawApiUrl
  : rawApiUrl.endsWith('/api')
  ? `${rawApiUrl}/public`
  : `${rawApiUrl}/api/public`;

export const SERVER_BASE_URL = (
  import.meta.env.VITE_SERVER_URL ||
  API_BASE_URL.replace(/\/api\/public\/?$/, '')
).trim().replace(/\/+$/, '');

export const getFileUrl = (filePath?: string | null): string => {
  if (!filePath) return '';
  if (filePath.startsWith('http://') || filePath.startsWith('https://')) return filePath;
  const cleanPath = filePath.startsWith('/') ? filePath : `/${filePath}`;
  return `${SERVER_BASE_URL}${cleanPath}`;
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('amanah_public_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token on invalid session if on protected page
      const currentPath = window.location.pathname;
      if (
        !currentPath.includes('/login') &&
        !currentPath.includes('/register') &&
        currentPath !== '/' &&
        !currentPath.includes('/verify')
      ) {
        localStorage.removeItem('amanah_public_token');
        localStorage.removeItem('amanah_public_user');
        localStorage.removeItem('amanah_public_company');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const getStatusMeta = (status: string) => {
  const meta: Record<
    string,
    { label: string; bg: string; text: string; border: string; iconBg: string; stepIndex: number }
  > = {
    DRAFT: {
      label: 'Draf Pengajuan',
      bg: 'bg-slate-100 dark:bg-slate-800',
      text: 'text-slate-700 dark:text-slate-300',
      border: 'border-slate-200 dark:border-slate-700',
      iconBg: 'bg-slate-400',
      stepIndex: 0,
    },
    PROSES_PENGAJUAN: {
      label: 'Proses Pengajuan',
      bg: 'bg-blue-50 dark:bg-blue-950/30',
      text: 'text-blue-700 dark:text-blue-300',
      border: 'border-blue-200 dark:border-blue-900/50',
      iconBg: 'bg-blue-600',
      stepIndex: 1,
    },
    VALIDASI_DOKUMEN: {
      label: 'Validasi Dokumen',
      bg: 'bg-indigo-50 dark:bg-indigo-950/30',
      text: 'text-indigo-700 dark:text-indigo-300',
      border: 'border-indigo-200 dark:border-indigo-900/50',
      iconBg: 'bg-indigo-600',
      stepIndex: 2,
    },
    WAWANCARA: {
      label: 'Wawancara',
      bg: 'bg-purple-50 dark:bg-purple-950/30',
      text: 'text-purple-700 dark:text-purple-300',
      border: 'border-purple-200 dark:border-purple-900/50',
      iconBg: 'bg-purple-600',
      stepIndex: 3,
    },
    PROSES_INTERNAL: {
      label: 'Proses Internal',
      bg: 'bg-amber-50 dark:bg-amber-950/30',
      text: 'text-amber-700 dark:text-amber-300',
      border: 'border-amber-300 dark:border-amber-800',
      iconBg: 'bg-amber-600',
      stepIndex: 4,
    },
    LULUS: {
      label: 'Lulus (Rekomendasi Terbit)',
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
      text: 'text-emerald-700 dark:text-emerald-300',
      border: 'border-emerald-300 dark:border-emerald-800',
      iconBg: 'bg-emerald-600',
      stepIndex: 5,
    },
    TIDAK_LULUS: {
      label: 'Tidak Lulus',
      bg: 'bg-rose-50 dark:bg-rose-950/30',
      text: 'text-rose-700 dark:text-rose-300',
      border: 'border-rose-300 dark:border-rose-800',
      iconBg: 'bg-rose-600',
      stepIndex: -1,
    },
    SUBMITTED: {
      label: 'Pengajuan Terkirim',
      bg: 'bg-blue-50 dark:bg-blue-950/30',
      text: 'text-blue-700 dark:text-blue-300',
      border: 'border-blue-200 dark:border-blue-900/50',
      iconBg: 'bg-blue-600',
      stepIndex: 1,
    },
    VERIFIKASI_ADMINISTRASI: {
      label: 'Verifikasi Administrasi',
      bg: 'bg-indigo-50 dark:bg-indigo-950/30',
      text: 'text-indigo-700 dark:text-indigo-300',
      border: 'border-indigo-200 dark:border-indigo-900/50',
      iconBg: 'bg-indigo-600',
      stepIndex: 2,
    },
    PERLU_PERBAIKAN: {
      label: 'Perlu Tindakan',
      bg: 'bg-amber-50 dark:bg-amber-950/30',
      text: 'text-amber-700 dark:text-amber-300',
      border: 'border-amber-300 dark:border-amber-800',
      iconBg: 'bg-amber-600',
      stepIndex: 2,
    },
    SEDANG_DIPROSES: {
      label: 'Sedang Diproses',
      bg: 'bg-sky-50 dark:bg-sky-950/30',
      text: 'text-sky-700 dark:text-sky-300',
      border: 'border-sky-200 dark:border-sky-900/50',
      iconBg: 'bg-sky-600',
      stepIndex: 3,
    },
    DALAM_PEMBAHASAN: {
      label: 'Dalam Pembahasan Syariah',
      bg: 'bg-purple-50 dark:bg-purple-950/30',
      text: 'text-purple-700 dark:text-purple-300',
      border: 'border-purple-200 dark:border-purple-900/50',
      iconBg: 'bg-purple-600',
      stepIndex: 4,
    },
    PROSES_KEPUTUSAN: {
      label: 'Proses Sidang Pleno',
      bg: 'bg-orange-50 dark:bg-orange-950/30',
      text: 'text-orange-700 dark:text-orange-300',
      border: 'border-orange-200 dark:border-orange-900/50',
      iconBg: 'bg-orange-600',
      stepIndex: 5,
    },
    DISETUJUI: {
      label: 'Kesesuaian Disetujui',
      bg: 'bg-teal-50 dark:bg-teal-950/30',
      text: 'text-teal-700 dark:text-teal-300',
      border: 'border-teal-200 dark:border-teal-900/50',
      iconBg: 'bg-teal-600',
      stepIndex: 6,
    },
    SERTIFIKAT_DITERBITKAN: {
      label: 'Sertifikat Diterbitkan',
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
      text: 'text-emerald-700 dark:text-emerald-300',
      border: 'border-emerald-300 dark:border-emerald-800',
      iconBg: 'bg-emerald-600',
      stepIndex: 7,
    },
    SELESAI: {
      label: 'Selesai',
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
      text: 'text-emerald-700 dark:text-emerald-300',
      border: 'border-emerald-300 dark:border-emerald-800',
      iconBg: 'bg-emerald-600',
      stepIndex: 7,
    },
    DITOLAK: {
      label: 'Ditolak',
      bg: 'bg-red-50 dark:bg-red-950/30',
      text: 'text-red-700 dark:text-red-300',
      border: 'border-red-300 dark:border-red-800',
      iconBg: 'bg-red-600',
      stepIndex: -1,
    },
  };

  return (
    meta[status] || {
      label: status,
      bg: 'bg-slate-100',
      text: 'text-slate-700',
      border: 'border-slate-200',
      iconBg: 'bg-slate-500',
      stepIndex: 0,
    }
  );
};

export const formatDate = (dateString?: string | Date | null) => {
  if (!dateString) return '-';
  const d = new Date(dateString);
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export const formatDateTime = (dateString?: string | Date | null) => {
  if (!dateString) return '-';
  const d = new Date(dateString);
  return `${d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })} • ${d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`;
};

export const formatFileSize = (bytes?: number) => {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

export default api;
