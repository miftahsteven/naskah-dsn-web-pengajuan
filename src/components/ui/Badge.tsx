import React from 'react';
import { getStatusMeta } from '../../lib/api';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileBadge,
  Sparkles,
  Send,
  Loader2,
  XCircle,
  FileEdit,
} from 'lucide-react';

interface BadgeProps {
  status?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'info' | 'danger' | 'purple' | 'gold';
  className?: string;
  size?: 'sm' | 'md';
  showIcon?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  status,
  children,
  variant,
  className,
  size = 'md',
  showIcon = true,
}) => {
  if (status) {
    const meta = getStatusMeta(status);

    const getIcon = () => {
      switch (status) {
        case 'DRAFT':
          return <FileEdit className="w-3 h-3" />;
        case 'SUBMITTED':
          return <Send className="w-3 h-3" />;
        case 'VERIFIKASI_ADMINISTRASI':
        case 'SEDANG_DIPROSES':
          return <Loader2 className="w-3 h-3 animate-spin" />;
        case 'PERLU_PERBAIKAN':
          return <AlertTriangle className="w-3 h-3 text-amber-600" />;
        case 'DALAM_PEMBAHASAN':
        case 'PROSES_KEPUTUSAN':
          return <Clock className="w-3 h-3" />;
        case 'DISETUJUI':
          return <CheckCircle2 className="w-3 h-3" />;
        case 'SERTIFIKAT_DITERBITKAN':
        case 'SELESAI':
          return <FileBadge className="w-3 h-3 text-emerald-600" />;
        case 'DITOLAK':
          return <XCircle className="w-3 h-3" />;
        default:
          return <Sparkles className="w-3 h-3" />;
      }
    };

    return (
      <span
        className={twMerge(
          clsx(
            'inline-flex items-center gap-1.5 font-medium rounded-full border shadow-subtle',
            size === 'sm' ? 'text-xs px-2.5 py-0.5' : 'text-xs px-3 py-1',
            meta.bg,
            meta.text,
            meta.border,
            className
          )
        )}
      >
        {showIcon && getIcon()}
        <span>{children || meta.label}</span>
      </span>
    );
  }

  const variantStyles = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-300',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    gold: 'bg-amber-50 text-amber-800 border-amber-300 font-semibold',
  };

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center gap-1 font-medium rounded-full border',
          size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1',
          variant ? variantStyles[variant] : variantStyles.default,
          className
        )
      )}
    >
      {children}
    </span>
  );
};
