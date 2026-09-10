import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { DocumentViewerModal } from '../components/ui/DocumentViewerModal';
import api, { formatFileSize } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import type { SubmissionTypeMaster, PublicSubmission, PublicSubmissionDocument } from '../types';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Trash2,
  Eye,
  FileCheck2,
  Building2,
  User,
  Clock,
  Sparkles,
  Info,
  Layers,
  Paperclip,
  Check,
  ShieldCheck,
} from 'lucide-react';
import { DpsSubmissionForm } from '../components/submissions/DpsSubmissionForm';

export const NewSubmissionWizardPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const [searchParams] = useSearchParams();
  const typeCodeParam = searchParams.get('typeCode');
  const { user, company } = useAuth();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [submissionTypes, setSubmissionTypes] = useState<SubmissionTypeMaster[]>([]);
  const [submissionId, setSubmissionId] = useState<string | null>(id || null);
  const [submissionData, setSubmissionData] = useState<Partial<PublicSubmission>>({
    submissionTypeId: '',
    title: '',
    productOrServiceName: '',
    description: '',
    companyLetterNumber: '',
    companyLetterDate: new Date().toISOString().split('T')[0],
  });

  const [officialLetterFile, setOfficialLetterFile] = useState<File | null>(null);
  const [uploadedDocuments, setUploadedDocuments] = useState<PublicSubmissionDocument[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [submittedResult, setSubmittedResult] = useState<any>(null);

  // Document Viewer Modal
  const [previewDoc, setPreviewDoc] = useState<{
    isOpen: boolean;
    title: string;
    fileUrl: string;
    fileSize?: number;
  }>({
    isOpen: false,
    title: '',
    fileUrl: '',
  });

  // Fetch Master Data & Existing Draft
  useEffect(() => {
    api.get('/master/submission-types').then((res) => {
      if (res.data.status === 'success') {
        const types: SubmissionTypeMaster[] = res.data.data;
        setSubmissionTypes(types);

        // If creating new and typeCode is passed, auto-select matching service
        if (!id && typeCodeParam) {
          const match = types.find(
            (t) =>
              t.code === typeCodeParam ||
              t.code.toLowerCase() === typeCodeParam.toLowerCase()
          );
          if (match) {
            setSubmissionData((prev) => ({
              ...prev,
              submissionTypeId: match.id,
              title: prev.title || `Pengajuan ${match.name}`,
            }));
          }
        }
      }
    });

    if (id) {
      setIsLoading(true);
      api.get(`/submissions/${id}`)
        .then((res) => {
          if (res.data.status === 'success') {
            const data = res.data.data;
            setSubmissionId(data.id);
            setSubmissionData({
              submissionTypeId: data.submissionTypeId || '',
              title: data.title || '',
              productOrServiceName: data.productOrServiceName || '',
              description: data.description || '',
              companyLetterNumber: data.companyLetterNumber || '',
              companyLetterDate: data.companyLetterDate ? data.companyLetterDate.split('T')[0] : '',
              officialLetterUrl: data.officialLetterUrl,
              officialLetterName: data.officialLetterName,
              officialLetterSize: data.officialLetterSize,
            });
            setUploadedDocuments(data.documents || []);
            setCurrentStep(Math.min(data.stepCompleted || 1, 4));
          }
        })
        .catch((err) => {
          console.error(err);
          setErrorMessage('Gagal memuat draf pengajuan.');
        })
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  const selectedTypeMaster = submissionTypes.find(
    (t) => t.id === submissionData.submissionTypeId
  );

  const handleInputChange = (field: string, value: any) => {
    setSubmissionData((prev) => ({ ...prev, [field]: value }));
  };

  // ── STEP 1: SAVE INFO DRAFT ──
  const handleSaveStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!submissionData.submissionTypeId) {
      setErrorMessage('Mohon pilih kategori jenis pengajuan.');
      return;
    }
    if (!submissionData.title) {
      setErrorMessage('Mohon isi judul / perihal pengajuan.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.post('/submissions/draft', {
        id: submissionId,
        submissionTypeId: submissionData.submissionTypeId,
        title: submissionData.title,
        productOrServiceName: submissionData.productOrServiceName,
        description: submissionData.description,
        companyLetterNumber: submissionData.companyLetterNumber,
        companyLetterDate: submissionData.companyLetterDate,
        stepCompleted: 1,
      });

      if (res.data.status === 'success') {
        setSubmissionId(res.data.data.id);
        setCurrentStep(2);
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Gagal menyimpan draf pengajuan.');
    } finally {
      setIsLoading(false);
    }
  };

  // ── STEP 2: UPLOAD OFFICIAL LETTER ──
  const handleOfficialLetterUpload = async (file: File) => {
    if (!submissionId) return;
    setIsUploading(true);
    setErrorMessage(null);

    try {
      const form = new FormData();
      form.append('file', file);

      const res = await api.post(`/submissions/${submissionId}/upload-letter`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.status === 'success') {
        setSubmissionData((prev) => ({
          ...prev,
          officialLetterUrl: res.data.data.officialLetterUrl,
          officialLetterName: res.data.data.officialLetterName,
          officialLetterSize: res.data.data.officialLetterSize,
        }));
        setOfficialLetterFile(null);
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Gagal mengunggah surat permohonan.');
    } finally {
      setIsUploading(false);
    }
  };

  // ── STEP 3: UPLOAD REQUIREMENT DOCUMENT ──
  const handleRequirementDocUpload = async (
    reqItem: { id: string; name: string; isMandatory: boolean },
    file: File
  ) => {
    if (!submissionId) return;
    setErrorMessage(null);
    setUploadProgress((prev) => ({ ...prev, [reqItem.id]: 20 }));

    try {
      const form = new FormData();
      form.append('file', file);
      form.append('requirementMasterId', reqItem.id);
      form.append('requirementName', reqItem.name);
      form.append('isMandatory', String(reqItem.isMandatory));

      setUploadProgress((prev) => ({ ...prev, [reqItem.id]: 60 }));

      const res = await api.post(`/submissions/${submissionId}/upload-document`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.status === 'success') {
        setUploadProgress((prev) => ({ ...prev, [reqItem.id]: 100 }));
        // Update local documents list
        const updatedDoc = res.data.data;
        setUploadedDocuments((prev) => {
          const filtered = prev.filter(
            (d) => d.requirementMasterId !== reqItem.id
          );
          return [updatedDoc, ...filtered];
        });
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || `Gagal mengunggah berkas ${reqItem.name}`);
    } finally {
      setTimeout(() => {
        setUploadProgress((prev) => {
          const clone = { ...prev };
          delete clone[reqItem.id];
          return clone;
        });
      }, 800);
    }
  };

  // Delete Document
  const handleDeleteDocument = async (docId: string) => {
    if (!submissionId) return;
    try {
      await api.delete(`/submissions/${submissionId}/documents/${docId}`);
      setUploadedDocuments((prev) => prev.filter((d) => d.id !== docId));
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Gagal menghapus dokumen.');
    }
  };

  // ── STEP 4: FINAL SUBMIT TO DSN-MUI ──
  const handleFinalSubmit = async () => {
    if (!submissionId) return;
    setShowConfirmModal(false);
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await api.post(`/submissions/${submissionId}/submit`);
      if (res.data.status === 'success') {
        setSubmittedResult(res.data.data);
        setCurrentStep(5); // Success step
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Gagal mengirimkan pengajuan ke DSN-MUI.');
    } finally {
      setIsLoading(false);
    }
  };

  // Validation helper for Step 3
  const isMandatoryRequirementsComplete = () => {
    if (!selectedTypeMaster?.requirements) return true;
    const mandatory = selectedTypeMaster.requirements.filter((r) => r.isMandatory);
    return mandatory.every((req) =>
      uploadedDocuments.some(
        (doc) =>
          doc.requirementMasterId === req.id ||
          doc.requirementName.toLowerCase().includes(req.name.toLowerCase())
      )
    );
  };

  const isDpsService =
    selectedTypeMaster?.code === 'REKOMENDASI_DPS' ||
    typeCodeParam === 'REKOMENDASI_DPS' ||
    submissionData.title?.includes('DPS') ||
    submissionData.productOrServiceName?.includes('DPS');

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* ── SPECIALIZED DPS FORM FLOW ── */}
      {isDpsService && currentStep < 5 ? (
        <div className="space-y-6">
          {/* Institutional Header Banner */}
          <div className="bg-gradient-to-br from-[#004d25] via-[#006633] to-[#00381a] p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:20px_20px]" />
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-200 border border-white/15 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" /> Layanan Prioritas DSN-MUI
                </div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  Permohonan Rekomendasi Dewan Pengawas Syariah (DPS)
                </h1>
                <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl leading-relaxed">
                  Unggah 1 surat permohonan/pengantar resmi dari perusahaan dan lengkapi 5 berkas persyaratan untuk setiap calon DPS yang diusulkan. Anda dapat mengajukan lebih dari 1 calon tanpa batas kuota.
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/submissions/new')}
                className="self-start sm:self-auto border-white/20 text-white hover:bg-white/10 rounded-2xl text-xs font-bold shrink-0"
              >
                Ganti Layanan
              </Button>
            </div>
          </div>

          <DpsSubmissionForm
            initialSubmissionId={submissionId}
            companyName={company?.name}
            onSuccess={(data) => {
              setSubmittedResult(data);
              setCurrentStep(5);
              confetti({
                particleCount: 120,
                spread: 80,
                origin: { y: 0.6 },
              });
            }}
            onCancel={() => navigate('/dashboard')}
          />
        </div>
      ) : currentStep < 5 ? (
        /* ── GENERIC 4-STEP WIZARD STEPPER HEADER ── */
        <div className="bg-white dark:bg-[#172019] p-6 rounded-3xl border border-border shadow-subtle">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-extrabold text-foreground tracking-tight">
                Pembuatan Pengajuan Kesesuaian Syariah
              </h1>
              <p className="text-xs text-muted-foreground">
                Ikuti 4 tahap pengisian data dan pengunggahan berkas persyaratan
              </p>
            </div>
            {currentStep < 5 && (
              <span className="text-xs font-bold px-3 py-1 bg-secondary text-primary rounded-full border border-emerald-200">
                Tahap {currentStep} dari 4
              </span>
            )}
          </div>

          {/* Stepper Progress Bar */}
          <div className="grid grid-cols-4 gap-2 pt-2">
            {[
              { step: 1, label: '1. Informasi' },
              { step: 2, label: '2. Surat Permohonan' },
              { step: 3, label: '3. Dokumen Syarat' },
              { step: 4, label: '4. Review & Submit' },
            ].map((s) => (
              <div key={s.step} className="space-y-1.5">
                <div
                  className={`h-2 rounded-full transition-all ${
                    currentStep >= s.step ? 'bg-primary' : 'bg-muted'
                  }`}
                />
                <div
                  className={`text-[11px] font-semibold truncate ${
                    currentStep === s.step
                      ? 'text-primary'
                      : currentStep > s.step
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                  }`}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {errorMessage && currentStep < 5 && !isDpsService && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <div className="flex-1">{errorMessage}</div>
        </div>
      )}

      {/* ── STEP 1: INFORMASI PENGAJUAN (GENERIC ONLY) ── */}
      {!isDpsService && currentStep === 1 && (
        <form onSubmit={handleSaveStep1} className="bg-white dark:bg-[#172019] p-6 sm:p-8 rounded-3xl border border-border shadow-subtle space-y-6">
          <div className="border-b border-border pb-4">
            <h3 className="text-base font-bold text-foreground">Langkah 1: Informasi Permohonan</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Pilih bidang permohonan dan cantumkan deskripsi produk atau akad yang diajukan.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Kategori Layanan Kesesuaian Syariah *
              </label>
              <select
                required
                value={submissionData.submissionTypeId}
                onChange={(e) => handleInputChange('submissionTypeId', e.target.value)}
                className="w-full px-4 py-3 text-sm rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="">-- Pilih Kategori Layanan --</option>
                {submissionTypes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Judul / Perihal Permohonan *
              </label>
              <input
                type="text"
                required
                value={submissionData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Contoh: Permohonan Kesesuaian Syariah Produk Pembiayaan Sindikasi Hijau"
                className="w-full px-4 py-3 text-sm rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Nama Produk / Layanan (Bila Ada)
                </label>
                <input
                  type="text"
                  value={submissionData.productOrServiceName}
                  onChange={(e) => handleInputChange('productOrServiceName', e.target.value)}
                  placeholder="Contoh: Green Murabahah iB"
                  className="w-full px-4 py-2.5 text-sm rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Nomor Surat Resmi Perusahaan
                </label>
                <input
                  type="text"
                  value={submissionData.companyLetterNumber}
                  onChange={(e) => handleInputChange('companyLetterNumber', e.target.value)}
                  placeholder="Contoh: DIR/BSN/VIII/2026/0442"
                  className="w-full px-4 py-2.5 text-sm rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Ringkasan / Deskripsi Singkat Produk
              </label>
              <textarea
                rows={3}
                value={submissionData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Jelaskan secara singkat latar belakang produk, target nasabah, dan akad fikih yang digunakan..."
                className="w-full px-4 py-2.5 text-sm rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            {/* PIC Info Card */}
            <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-2 text-xs">
              <div className="font-bold text-foreground flex items-center gap-1.5">
                <User className="w-4 h-4 text-primary" />
                <span>PIC Pengajuan (Penanggung Jawab):</span>
              </div>
              <div className="text-muted-foreground">
                {user?.fullName} ({user?.position || 'PIC'}) • {user?.email} • {user?.phone || '-'}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Simpan & Lanjut ke Surat Permohonan
            </Button>
          </div>
        </form>
      )}

      {/* ── STEP 2: SURAT PERMOHONAN RESMI ── */}
      {currentStep === 2 && (
        <div className="bg-white dark:bg-[#172019] p-6 sm:p-8 rounded-3xl border border-border shadow-subtle space-y-6">
          <div className="border-b border-border pb-4">
            <h3 className="text-base font-bold text-foreground">Langkah 2: Unggah Surat Permohonan Resmi</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Unggah berkas surat permohonan resmi perusahaan bertanda tangan basah/TTE direksi. Format PDF sangat disarankan.
            </p>
          </div>

          {/* Already uploaded letter box */}
          {submissionData.officialLetterUrl ? (
            <div className="p-5 rounded-2xl bg-secondary/50 border border-emerald-200 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold flex-shrink-0">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-foreground truncate">
                    {submissionData.officialLetterName || 'Surat_Permohonan.pdf'}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    PDF • {formatFileSize(submissionData.officialLetterSize)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setPreviewDoc({
                      isOpen: true,
                      title: submissionData.officialLetterName || 'Surat Permohonan',
                      fileUrl: submissionData.officialLetterUrl!,
                      fileSize: submissionData.officialLetterSize,
                    })
                  }
                  leftIcon={<Eye className="w-3.5 h-3.5" />}
                >
                  Pratinjau
                </Button>
                <label className="cursor-pointer">
                  <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-border hover:bg-muted text-foreground transition-colors">
                    Ganti Berkas
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.docx"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleOfficialLetterUpload(e.target.files[0]);
                      }
                    }}
                  />
                </label>
              </div>
            </div>
          ) : (
            /* Drag and drop upload zone */
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files?.[0]) {
                  handleOfficialLetterUpload(e.dataTransfer.files[0]);
                }
              }}
              className="border-2 border-dashed border-border hover:border-primary rounded-3xl p-8 sm:p-12 text-center bg-background/50 hover:bg-secondary/20 transition-all cursor-pointer"
            >
              <UploadCloud className="w-12 h-12 text-primary/60 mx-auto mb-3 animate-bounce" />
              <h4 className="text-sm font-bold text-foreground mb-1">
                Tarik & Letakkan Berkas Surat di Sini
              </h4>
              <p className="text-xs text-muted-foreground mb-4">
                Format PDF atau DOCX (Maksimal 20 MB)
              </p>
              <label className="cursor-pointer inline-block">
                <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary-dark shadow-md transition-all">
                  Pilih Dokumen dari Perangkat
                </span>
                <input
                  type="file"
                  accept=".pdf,.docx"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleOfficialLetterUpload(e.target.files[0]);
                    }
                  }}
                />
              </label>
            </div>
          )}

          <div className="pt-4 border-t border-border flex items-center justify-between">
            <Button variant="outline" size="md" onClick={() => setCurrentStep(1)}>
              <ArrowLeft className="w-4 h-4 mr-1" /> Kembali
            </Button>
            <Button
              variant="primary"
              size="md"
              disabled={!submissionData.officialLetterUrl || isUploading}
              onClick={() => setCurrentStep(3)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Lanjut ke Dokumen Persyaratan
            </Button>
          </div>
        </div>
      )}

      {/* ── STEP 3: DOKUMEN PERSYARATAN DINAMIS ── */}
      {currentStep === 3 && (
        <div className="bg-white dark:bg-[#172019] p-6 sm:p-8 rounded-3xl border border-border shadow-subtle space-y-6">
          <div className="border-b border-border pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-foreground">Langkah 3: Dokumen Persyaratan</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Kategori: <strong>{selectedTypeMaster?.name || 'Umum'}</strong>
              </p>
            </div>
            <div className="text-xs font-semibold px-3 py-1 rounded-full bg-secondary text-primary border border-emerald-200">
              {uploadedDocuments.length} Berkas Diunggah
            </div>
          </div>

          {/* Checklist master items */}
          <div className="space-y-4">
            {selectedTypeMaster?.requirements?.map((req) => {
              const uploaded = uploadedDocuments.find(
                (d) => d.requirementMasterId === req.id || d.requirementName === req.name
              );
              const progress = uploadProgress[req.id];

              return (
                <div
                  key={req.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    uploaded
                      ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60 shadow-subtle'
                      : 'bg-background/60 border-border'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-foreground">{req.name}</span>
                        {req.isMandatory ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-700">
                            Wajib
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                            Opsional
                          </span>
                        )}
                        {uploaded && (
                          <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Terunggah
                          </span>
                        )}
                      </div>
                      {req.description && (
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {req.description}
                        </p>
                      )}
                      {uploaded && (
                        <div className="text-[11px] font-mono text-primary truncate pt-1">
                          📄 {uploaded.fileName} ({formatFileSize(uploaded.fileSize)})
                        </div>
                      )}
                    </div>

                    {/* Action button */}
                    <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                      {uploaded ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setPreviewDoc({
                                isOpen: true,
                                title: uploaded.fileName,
                                fileUrl: uploaded.fileUrl,
                                fileSize: uploaded.fileSize,
                              })
                            }
                            leftIcon={<Eye className="w-3.5 h-3.5" />}
                          >
                            Lihat
                          </Button>
                          <label className="cursor-pointer">
                            <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-medium bg-white border border-border hover:bg-muted text-foreground transition-colors">
                              Ganti
                            </span>
                            <input
                              type="file"
                              accept=".pdf,.docx,.xlsx,.jpg,.png"
                              className="hidden"
                              onChange={(e) => {
                                if (e.target.files?.[0]) {
                                  handleRequirementDocUpload(req, e.target.files[0]);
                                }
                              }}
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => handleDeleteDocument(uploaded.id)}
                            className="p-1.5 text-muted-foreground hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                            title="Hapus berkas"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <label className="cursor-pointer">
                          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary-dark shadow-sm transition-all">
                            <UploadCloud className="w-3.5 h-3.5" />
                            {progress ? `Mengunggah (${progress}%)` : 'Unggah Berkas'}
                          </span>
                          <input
                            type="file"
                            accept=".pdf,.docx,.xlsx,.jpg,.png"
                            disabled={!!progress}
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                handleRequirementDocUpload(req, e.target.files[0]);
                              }
                            }}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-between">
            <Button variant="outline" size="md" onClick={() => setCurrentStep(2)}>
              <ArrowLeft className="w-4 h-4 mr-1" /> Kembali
            </Button>
            <Button
              variant="primary"
              size="md"
              disabled={!isMandatoryRequirementsComplete()}
              onClick={() => setCurrentStep(4)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Lanjut ke Review & Submit
            </Button>
          </div>
        </div>
      )}

      {/* ── STEP 4: REVIEW & PERNYATAAN ── */}
      {currentStep === 4 && (
        <div className="bg-white dark:bg-[#172019] p-6 sm:p-8 rounded-3xl border border-border shadow-subtle space-y-6">
          <div className="border-b border-border pb-4">
            <h3 className="text-base font-bold text-foreground">Langkah 4: Review Akhir Pengajuan</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Periksa seluruh data permohonan dan berkas sebelum dikirimkan secara resmi ke DSN-MUI.
            </p>
          </div>

          <div className="space-y-4">
            {/* Info Summary */}
            <div className="p-5 rounded-2xl bg-muted/40 border border-border space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <span className="text-muted-foreground">Perusahaan Pemohon:</span>
                <span className="font-bold text-foreground">{company?.name}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <span className="text-muted-foreground">Kategori Layanan:</span>
                <span className="font-semibold text-primary">{selectedTypeMaster?.name}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <span className="text-muted-foreground">Perihal Pengajuan:</span>
                <span className="font-semibold text-foreground">{submissionData.title}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <span className="text-muted-foreground">Nomor Surat Perusahaan:</span>
                <span className="font-mono font-semibold text-foreground">
                  {submissionData.companyLetterNumber || '-'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">PIC Pengajuan:</span>
                <span className="font-semibold text-foreground">
                  {user?.fullName} ({user?.email})
                </span>
              </div>
            </div>

            {/* Document Attachments Review */}
            <div className="p-5 rounded-2xl bg-muted/40 border border-border space-y-3">
              <div className="text-xs font-bold text-foreground flex items-center justify-between">
                <span>Berkas yang Akan Terkirim:</span>
                <span className="text-primary font-semibold">{uploadedDocuments.length + 1} Berkas</span>
              </div>

              <div className="space-y-2 text-xs">
                {/* Official Letter */}
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="font-semibold">Surat Permohonan Resmi</span>
                  </div>
                  <span className="font-mono text-[11px] text-muted-foreground">
                    {submissionData.officialLetterName}
                  </span>
                </div>

                {/* Requirements */}
                {uploadedDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-border flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span className="font-medium">{doc.requirementName}</span>
                    </div>
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {doc.fileName}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Legal Statement Checkbox */}
            <div className="p-5 rounded-2xl bg-secondary/60 border border-emerald-200/80 space-y-3">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  required
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-xs text-foreground leading-relaxed">
                  Saya menyatakan dengan sesungguhnya bahwa seluruh data permohonan, informasi produk, dan dokumen pendukung yang disampaikan adalah benar, sah, dan dapat dipertanggungjawabkan sesuai hukum yang berlaku di Indonesia dan fatwa DSN-MUI.
                </span>
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-between">
            <Button variant="outline" size="md" onClick={() => setCurrentStep(3)}>
              <ArrowLeft className="w-4 h-4 mr-1" /> Kembali
            </Button>
            <Button
              variant="gold"
              size="lg"
              disabled={!agreedToTerms}
              onClick={() => setShowConfirmModal(true)}
              rightIcon={<CheckCircle2 className="w-5 h-5" />}
              className="shadow-md"
            >
              Kirim Pengajuan ke DSN-MUI
            </Button>
          </div>
        </div>
      )}

      {/* ── STEP 5: SUCCESS SUBMISSION SCREEN ── */}
      {currentStep === 5 && submittedResult && (
        <div className="bg-white dark:bg-[#172019] p-8 sm:p-12 rounded-3xl border border-emerald-200 dark:border-emerald-800 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 rounded-3xl gradient-primary text-white flex items-center justify-center mx-auto shadow-xl">
            <Check className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" /> Pengajuan Berhasil Terkirim
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Permohonan Anda Telah Masuk ke Antrean DSN-MUI
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
              Berkas permohonan telah otomatis tercatat pada sistem Surat Masuk DSN-MUI dan segera diverifikasi oleh tim sekretariat.
            </p>
          </div>

          {/* Ticket ID Box */}
          <div className="p-6 rounded-3xl bg-background border-2 border-primary/20 max-w-md mx-auto space-y-1">
            <div className="text-xs font-semibold text-muted-foreground">Nomor Registrasi / Tiket:</div>
            <div className="text-2xl font-mono font-extrabold text-primary tracking-wider">
              {submittedResult.submissionNumber}
            </div>
            <div className="text-[11px] text-muted-foreground pt-1">
              Gunakan nomor ini sebagai referensi resmi komunikasi Anda.
            </div>
          </div>

          {/* 5 Tahapan Alur Roadmap for DPS */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left max-w-lg mx-auto space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Alur 5 Tahap Proses Rekomendasi DPS:</span>
            </div>
            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2 font-bold text-emerald-700 dark:text-emerald-400">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">1</span>
                <span>Proses Pengajuan (Sedang Berjalan di Antrean)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 pl-7">
                <span>2. Validasi Dokumen (Pemeriksaan berkas & persyaratan)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 pl-7">
                <span>3. Wawancara (Uji kompetensi syariah calon DPS)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 pl-7">
                <span>4. Proses Internal (Sidang pleno komisi & BPH DSN-MUI)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 pl-7">
                <span>5. Lulus / Tidak Lulus (Penerbitan Surat Rekomendasi Resmi)</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate(`/submissions/${submittedResult.id}`)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="w-full sm:w-auto"
            >
              Pantau Perkembangan Proses
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => navigate('/dashboard')}
              className="w-full sm:w-auto"
            >
              Kembali ke Dashboard
            </Button>
          </div>
        </div>
      )}

      {/* ── CONFIRMATION DIALOG MODAL ── */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Kirim Permohonan ke DSN-MUI?"
        maxWidth="md"
      >
        <div className="space-y-4 text-xs text-muted-foreground leading-relaxed">
          <p>
            Setelah dikirim, permohonan ini akan diteruskan secara resmi ke sistem Surat Masuk DSN-MUI dan dokumen tidak dapat diubah kembali kecuali terdapat permintaan perbaikan dari verifikator.
          </p>
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800">
            Pastikan seluruh berkas telah memenuhi ketentuan akad dan perundang-undangan.
          </div>
          <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowConfirmModal(false)}>
              Batal
            </Button>
            <Button
              variant="gold"
              size="sm"
              isLoading={isLoading}
              onClick={handleFinalSubmit}
            >
              Ya, Kirim Pengajuan
            </Button>
          </div>
        </div>
      </Modal>

      {/* ── DOCUMENT PREVIEW MODAL ── */}
      <DocumentViewerModal
        isOpen={previewDoc.isOpen}
        onClose={() => setPreviewDoc((prev) => ({ ...prev, isOpen: false }))}
        title={previewDoc.title}
        fileUrl={previewDoc.fileUrl}
        fileSize={previewDoc.fileSize}
      />
    </div>
  );
};
