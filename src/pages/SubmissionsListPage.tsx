import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import api, { formatDate, getStatusMeta } from '../lib/api';
import type { PublicSubmission, SubmissionTypeMaster } from '../types';
import {
  PlusCircle,
  Search,
  Filter,
  FileText,
  Clock,
  ChevronRight,
  ArrowUpDown,
  Building2,
  Calendar,
  AlertTriangle,
  FileBadge,
} from 'lucide-react';

export const SubmissionsListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [submissions, setSubmissions] = useState<PublicSubmission[]>([]);
  const [submissionTypes, setSubmissionTypes] = useState<SubmissionTypeMaster[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get('search') || '');
  const [activeTab, setActiveTab] = useState<string>(searchParams.get('status') || 'ALL');
  const [selectedType, setSelectedType] = useState<string>(searchParams.get('typeId') || '');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const fetchSubmissions = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeTab !== 'ALL') params.append('status', activeTab);
      if (selectedType) params.append('typeId', selectedType);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());
      params.append('page', String(pagination.page));
      params.append('limit', String(pagination.limit));

      const res = await api.get(`/submissions?${params.toString()}`);
      if (res.data.status === 'success') {
        setSubmissions(res.data.data.submissions || []);
        if (res.data.data.pagination) {
          setPagination(res.data.data.pagination);
        }
      }
    } catch (err) {
      console.error('Failed to fetch submissions', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    api.get('/master/submission-types').then((res) => {
      if (res.data.status === 'success') {
        setSubmissionTypes(res.data.data);
      }
    });
  }, []);

  useEffect(() => {
    fetchSubmissions();
  }, [activeTab, selectedType, pagination.page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchSubmissions();
  };

  const tabs = [
    { id: 'ALL', label: 'Semua' },
    { id: 'IN_PROGRESS', label: 'Dalam Proses' },
    { id: 'ACTION_NEEDED', label: 'Perlu Tindakan' },
    { id: 'COMPLETED', label: 'Selesai / Terbit' },
    { id: 'DRAFT', label: 'Draf' },
  ];

  return (
    <div className="space-y-6">
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
            Pengajuan Saya
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Daftar seluruh permohonan kesesuaian syariah perusahaan Anda
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => navigate('/submissions/new')}
          leftIcon={<PlusCircle className="w-4 h-4" />}
          className="shadow-md"
        >
          + Buat Pengajuan Baru
        </Button>
      </div>

      {/* ── FILTER & SEARCH BAR ── */}
      <div className="bg-white dark:bg-[#172019] p-4 sm:p-5 rounded-3xl border border-border shadow-subtle space-y-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 border-b border-border/60">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nomor pengajuan, nomor surat resmi, atau judul..."
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </form>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className="px-3 py-2.5 text-xs rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary focus:outline-none w-full sm:w-auto"
            >
              <option value="">Semua Kategori Layanan</option>
              {submissionTypes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>

            <Button variant="secondary" size="sm" onClick={handleSearchSubmit}>
              Cari
            </Button>
          </div>
        </div>
      </div>

      {/* ── SUBMISSIONS LIST TABLE / CARDS ── */}
      <div className="bg-white dark:bg-[#172019] rounded-3xl border border-border shadow-subtle overflow-hidden">
        {isLoading ? (
          <div className="py-20 text-center text-xs text-muted-foreground">
            Memuat daftar pengajuan...
          </div>
        ) : submissions.length === 0 ? (
          <div className="py-20 text-center px-4 space-y-3">
            <FileText className="w-12 h-12 text-muted-foreground/40 mx-auto" />
            <h4 className="text-sm font-bold text-foreground">Tidak ada pengajuan yang ditemukan</h4>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Tidak ada data yang sesuai dengan kriteria pencarian atau filter yang dipilih.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setActiveTab('ALL');
                setSelectedType('');
                setSearchQuery('');
              }}
            >
              Reset Filter
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {submissions.map((sub) => (
              <div
                key={sub.id}
                onClick={() =>
                  navigate(
                    sub.status === 'DRAFT'
                      ? `/submissions/${sub.id}/edit`
                      : `/submissions/${sub.id}`
                  )
                }
                className="p-5 hover:bg-muted/40 transition-colors cursor-pointer flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                {/* Left info */}
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-primary px-2.5 py-0.5 rounded-md bg-secondary border border-emerald-200">
                      {sub.submissionNumber}
                    </span>
                    <Badge status={sub.status} size="sm" />
                    {sub.companyLetterNumber && (
                      <span className="text-[11px] text-muted-foreground font-mono">
                        Surat: {sub.companyLetterNumber}
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-foreground hover:text-primary transition-colors line-clamp-1">
                    {sub.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-primary" />
                      {sub.submissionTypeName}
                    </span>
                    {sub.productOrServiceName && (
                      <span>• Produk: <strong>{sub.productOrServiceName}</strong></span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(sub.submittedAt || sub.createdAt)}
                    </span>
                    <span>
                      • {sub._count?.documents || 0} Berkas Terunggah
                    </span>
                  </div>
                </div>

                {/* Right action button */}
                <div className="flex items-center gap-2 self-end lg:self-center flex-shrink-0">
                  {sub.status === 'PERLU_PERBAIKAN' ? (
                    <Button variant="gold" size="sm" rightIcon={<AlertTriangle className="w-3.5 h-3.5" />}>
                      Tanggapi Revisi
                    </Button>
                  ) : sub.status === 'DRAFT' ? (
                    <Button variant="secondary" size="sm" rightIcon={<ChevronRight className="w-3.5 h-3.5" />}>
                      Lanjutkan Draf
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" rightIcon={<ChevronRight className="w-3.5 h-3.5" />}>
                      Pantau Proses
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Footer */}
        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-border bg-muted/20 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              Menampilkan {submissions.length} dari {pagination.total} pengajuan
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page <= 1}
                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
              >
                Sebelumnya
              </Button>
              <span className="font-semibold text-foreground px-2">
                Halaman {pagination.page} / {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
              >
                Berikutnya
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
