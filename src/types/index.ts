export interface User {
  id: string;
  email: string;
  fullName: string;
  position?: string;
  phone?: string;
  role: string;
}

export interface Company {
  id: string;
  name: string;
  legalType?: string;
  legalityNumber?: string;
  npwp?: string;
  address?: string;
  province?: string;
  city?: string;
  district?: string;
  subdistrict?: string;
  postalCode?: string;
  phone?: string;
  email?: string;
  website?: string;
  logoUrl?: string;
}

export interface SubmissionRequirementMaster {
  id: string;
  submissionTypeId: string;
  code: string;
  name: string;
  description?: string;
  isMandatory: boolean;
  allowedFileTypes: string;
  maxFileSizeMb: number;
  sortOrder: number;
}

export interface SubmissionTypeMaster {
  id: string;
  code: string;
  name: string;
  description?: string;
  icon?: string;
  sortOrder: number;
  isActive: boolean;
  requirements: SubmissionRequirementMaster[];
}

export interface PublicSubmissionDocument {
  id: string;
  submissionId: string;
  requirementMasterId?: string;
  requirementName: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  isMandatory: boolean;
  status: 'VALID' | 'REVISION_REQUIRED' | 'REPLACED';
  notes?: string;
  uploadedAt: string;
}

export interface PublicSubmissionActivity {
  id: string;
  submissionId: string;
  title: string;
  description?: string;
  publicStatus: string;
  visibility: string;
  performedByName?: string;
  createdAt: string;
}

export interface PublicSubmissionRevision {
  id: string;
  submissionId: string;
  requestNotes: string;
  requestedDocuments?: any;
  deadline?: string;
  status: 'PENDING' | 'RESPONDED' | 'RESOLVED';
  responseNotes?: string;
  requestedAt: string;
  respondedAt?: string;
}

export interface ShariaCertificate {
  id: string;
  submissionId: string;
  companyId: string;
  certificateNumber: string;
  title: string;
  issueDate: string;
  validUntil: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  qrCode?: string;
  downloadCount: number;
  submission?: {
    id: string;
    submissionNumber: string;
    title: string;
    productOrServiceName?: string;
    submissionTypeName: string;
  };
  company?: Company;
}

export interface PublicSubmissionCandidateDoc {
  fileName: string;
  fileUrl: string;
  fileSize?: number;
  mimeType?: string;
}

export interface PublicSubmissionCandidate {
  id: string;
  name: string;
  nik?: string;
  phone?: string;
  email?: string;
  documents: {
    suratMui?: PublicSubmissionCandidateDoc;
    sertifikatPelatihan?: PublicSubmissionCandidateDoc;
    sertifikatKompetensi?: PublicSubmissionCandidateDoc;
    profilCv?: PublicSubmissionCandidateDoc;
    suratPernyataanNonPegawai?: PublicSubmissionCandidateDoc;
    [key: string]: PublicSubmissionCandidateDoc | undefined;
  };
}

export interface InterviewInvitation {
  invitationNumber: string;
  invitationDate: string;
  interviewDayDate: string;
  interviewTime: string;
  format: 'OFFLINE' | 'ONLINE' | 'HYBRID';
  venue: string;
  zoomUrl?: string | null;
  zoomMeetingId?: string | null;
  zoomPasscode?: string | null;
  subject: string;
  candidates: string[];
  dresscode?: string;
  requirements?: string;
  contactPerson?: string;
  notes?: string | null;
  signatoryName?: string;
  signatoryRole?: string;
  createdAt?: string;
}

export interface PublicSubmission {
  id: string;
  submissionNumber: string;
  companyId: string;
  company?: Company;
  applicantUserId: string;
  applicantUser?: User;
  submissionTypeId?: string;
  submissionType?: SubmissionTypeMaster;
  submissionTypeName: string;
  title: string;
  productOrServiceName?: string;
  description?: string;
  companyLetterNumber?: string;
  companyLetterDate?: string;
  officialLetterUrl?: string;
  officialLetterName?: string;
  officialLetterSize?: number;
  status:
    | 'DRAFT'
    | 'SUBMITTED'
    | 'PROSES_PENGAJUAN'
    | 'VALIDASI_DOKUMEN'
    | 'WAWANCARA'
    | 'PROSES_INTERNAL'
    | 'LULUS'
    | 'TIDAK_LULUS'
    | 'VERIFIKASI_ADMINISTRASI'
    | 'PERLU_PERBAIKAN'
    | 'SEDANG_DIPROSES'
    | 'DALAM_PEMBAHASAN'
    | 'PROSES_KEPUTUSAN'
    | 'DISETUJUI'
    | 'SERTIFIKAT_DITERBITKAN'
    | 'SELESAI'
    | 'DITOLAK'
    | string;
  stepCompleted: number;
  submittedAt?: string;
  erpDocumentId?: string;
  candidates?: PublicSubmissionCandidate[];
  dpsStage?: string;
  validationType?: string;
  interviewInvitation?: InterviewInvitation;
  documents?: PublicSubmissionDocument[];
  timeline?: PublicSubmissionActivity[];
  revisions?: PublicSubmissionRevision[];
  certificate?: ShariaCertificate;
  createdAt: string;
  updatedAt: string;
  _count?: {
    documents: number;
    revisions: number;
  };
}

export interface PublicNotification {
  id: string;
  companyId: string;
  userId?: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ACTION_REQUIRED';
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface SubmissionStats {
  total: number;
  draft: number;
  inProgress: number;
  actionNeeded: number;
  completed: number;
}
