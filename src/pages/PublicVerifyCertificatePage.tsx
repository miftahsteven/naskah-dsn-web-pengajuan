import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api, { formatDate } from '../lib/api';
import { Button } from '../components/ui/Button';
import {
  ShieldCheck,
  CheckCircle2,
  FileBadge,
  Building2,
  Calendar,
  AlertTriangle,
  ArrowLeft,
  Download,
  ExternalLink,
  Award,
} from 'lucide-react';

export const PublicVerifyCertificatePage: React.FC = () => {
  const { certNumber } = useParams<{ certNumber: string }>();
  const [certData, setCertData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isNotFound, setIsNotFound] = useState<boolean>(false);

  useEffect(() => {
    if (certNumber) {
      setIsLoading(true);
      api.get(`/certificates/verify/public/${encodeURIComponent(certNumber)}`)
        .then((res) => {
          if (res.data.status === 'success') {
            setCertData(res.data.data);
            setIsNotFound(false);
          }
        })
        .catch(() => {
          setIsNotFound(true);
        })
        .finally(() => setIsLoading(false));
    }
  }, [certNumber]);

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto w-full space-y-8">
        {/* Top brand */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="h-14 w-14 rounded-2xl bg-white p-1.5 shadow-md border border-border flex items-center justify-center">
              <img src="/images/logo-dsn.png" alt="DSN-MUI" className="h-full w-full object-contain" />
            </div>
            <div className="text-left">
              <span className="text-xl font-extrabold text-primary">AMANAH</span>
              <p className="text-xs text-muted-foreground">Verifikasi Sertifikat Syariah Resmi</p>
            </div>
          </Link>
        </div>

        {isLoading ? (
          <div className="py-20 text-center text-xs text-muted-foreground">
            Memverifikasi sertifikat ke sistem DSN-MUI...
          </div>
        ) : isNotFound || !certData ? (
          <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#172019] border-2 border-rose-200 text-center space-y-4 shadow-xl">
            <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-extrabold text-foreground">Sertifikat Tidak Terdaftar</h2>
            <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
              Nomor sertifikat <strong>{certNumber}</strong> tidak ditemukan dalam basis data resmi DSN-MUI atau belum diterbitkan.
            </p>
            <div className="pt-2">
              <Link to="/">
                <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                  Kembali ke Beranda
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="glass rounded-3xl p-6 sm:p-10 border border-emerald-200/80 dark:border-emerald-800 shadow-2xl space-y-6">
            {/* Authenticity Badge */}
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 flex items-center gap-3 text-emerald-900 dark:text-emerald-200">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-md">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm font-bold">SERTIFIKAT KESESUAIAN SYARIAH SAH</div>
                <div className="text-xs text-emerald-700 dark:text-emerald-300">
                  Diterbitkan secara resmi oleh Dewan Syariah Nasional – Majelis Ulama Indonesia
                </div>
              </div>
            </div>

            {/* Certificate Details */}
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-background border border-border space-y-2">
                <span className="text-[11px] text-muted-foreground block">Nomor Sertifikat:</span>
                <span className="font-mono text-sm sm:text-base font-extrabold text-primary block">
                  {certData.certificateNumber}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-background border border-border space-y-2">
                <span className="text-[11px] text-muted-foreground block">Perihal / Judul Sertifikat:</span>
                <span className="text-sm font-bold text-foreground block">
                  {certData.title}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-background border border-border">
                  <span className="text-[11px] text-muted-foreground block">Badan Usaha / Lembaga:</span>
                  <span className="font-bold text-foreground text-sm block">
                    {certData.company?.name}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-background border border-border">
                  <span className="text-[11px] text-muted-foreground block">Kategori Syariah:</span>
                  <span className="font-bold text-foreground text-sm block">
                    {certData.submission?.submissionTypeName}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-background border border-border">
                  <span className="text-[11px] text-muted-foreground block">Tanggal Terbit:</span>
                  <span className="font-bold text-foreground block">
                    {formatDate(certData.issueDate)}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-background border border-border">
                  <span className="text-[11px] text-muted-foreground block">Masa Berlaku:</span>
                  <span className="font-bold text-foreground block">
                    {formatDate(certData.validUntil)}
                  </span>
                </div>
              </div>
            </div>

            {/* Institution footer */}
            <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-accent" />
                <span>DSN-MUI ISO 9001:2015</span>
              </div>

              <Link to="/" className="text-primary font-semibold hover:underline">
                Portal Utama Amanah →
              </Link>
            </div>
          </div>
        )}
      </div>

      <div className="text-center text-xs text-muted-foreground mt-8">
        © 2026 Dewan Syariah Nasional – Majelis Ulama Indonesia.
      </div>
    </div>
  );
};
