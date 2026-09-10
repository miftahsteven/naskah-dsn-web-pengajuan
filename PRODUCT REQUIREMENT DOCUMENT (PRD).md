# PRODUCT REQUIREMENT DOCUMENT (PRD)
## AMANAH — Public Portal Pengajuan Kesesuaian Syariah

**Product:** Amanah Public Submission Portal  
**Institution:** Dewan Syariah Nasional – Majelis Ulama Indonesia  
**Platform:** Responsive Web Application  
**Frontend:** React + Vite + JavaScript  
**UI:** Tailwind CSS + shadcn/ui  
**Backend:** Backend ERP Amanah existing — shared backend, shared business process, shared database  
**Document Version:** 1.0  
**Target:** Production Ready

---

# 1. Product Overview

Amanah Public Submission Portal adalah portal eksternal bagi perusahaan atau lembaga yang ingin mengajukan permohonan kesesuaian/sertifikasi syariah kepada DSN-MUI.

Sebelumnya surat permohonan dan dokumen pendukung dikirimkan melalui email. Pada pengembangan baru, seluruh proses tersebut harus dipindahkan ke dalam platform Amanah sehingga perusahaan dapat:

- melakukan registrasi secara online;
- login menggunakan OTP email;
- melengkapi profil perusahaan;
- membuat pengajuan;
- mengunggah surat permohonan perusahaan;
- mengunggah seluruh dokumen persyaratan;
- mengirim pengajuan langsung kepada DSN-MUI;
- mengetahui perkembangan proses secara transparan;
- melihat kebutuhan revisi atau dokumen tambahan;
- mengetahui agenda dan tahapan pembahasan;
- menerima pemberitahuan atas perkembangan pengajuan;
- melihat hasil akhir pengajuan;
- membuka, mengunduh, dan mencetak sertifikat yang telah diterbitkan.

Portal ini merupakan bagian dari ekosistem **Amanah**, bukan sistem terpisah.

Frontend public dapat menjadi aplikasi tersendiri, tetapi **tidak boleh dibuat backend baru yang berdiri sendiri**.

Semua pengajuan dari portal public harus langsung menggunakan business process, API, database, document storage, workflow, notification dan audit trail dari backend Amanah yang sudah berjalan.

---

# 2. Product Vision

Membangun satu pintu digital antara perusahaan pemohon dengan DSN-MUI untuk seluruh siklus pengajuan kesesuaian syariah.

Prinsip utamanya:

> **Submit once. Track everything. Communicate transparently. Receive digitally.**

Perusahaan tidak perlu lagi mencari email, menanyakan progres melalui WhatsApp, mengirim ulang dokumen berkali-kali, atau menghubungi petugas untuk sekadar mengetahui posisi pengajuannya.

Amanah menjadi sumber informasi resmi (*single source of truth*) atas seluruh proses pengajuan.

---

# 3. Problem Statement

Pada proses sebelumnya terdapat beberapa permasalahan utama.

### Dari sisi perusahaan

Perusahaan mengirim surat dan lampiran melalui email.

Perusahaan tidak selalu mengetahui apakah surat sudah diterima, sudah diverifikasi, sedang dibahas, membutuhkan revisi, sudah masuk agenda rapat, atau sudah mendapatkan keputusan.

Komunikasi progres berpotensi tersebar melalui email, telepon, WhatsApp atau media lainnya.

Dokumen tambahan juga dapat tersebar dalam beberapa percakapan dan email berbeda.

### Dari sisi DSN-MUI

Petugas harus menerima surat dari berbagai sumber.

Petugas perlu mengidentifikasi perusahaan, permohonan, dokumen dan korespondensi secara manual.

Dokumen pengajuan berpotensi tidak mempunyai struktur penyimpanan yang seragam.

Tracking komunikasi dengan pemohon menjadi lebih sulit.

### Solusi

Semua proses pengajuan diarahkan melalui Amanah Public Portal.

Begitu perusahaan melakukan **Submit Pengajuan**, permohonan tersebut otomatis menjadi data **Surat Masuk / Pengajuan** pada ERP Amanah.

Tidak diperlukan input ulang oleh petugas.

---

# 4. Product Goals

Tujuan utama sistem adalah:

1. Menghilangkan ketergantungan terhadap email sebagai kanal pengajuan.
2. Menciptakan satu kanal resmi komunikasi perusahaan dengan DSN-MUI.
3. Mengintegrasikan pengajuan perusahaan dengan Surat Masuk ERP Amanah.
4. Memusatkan seluruh dokumen pada satu nomor pengajuan.
5. Menampilkan perkembangan proses secara transparan kepada perusahaan.
6. Mempermudah DSN-MUI meminta dokumen tambahan atau revisi.
7. Mempermudah perusahaan memberikan respon.
8. Menyediakan digital certificate delivery.
9. Menyediakan audit trail lengkap.
10. Meningkatkan keamanan dokumen perusahaan.

---

# 5. User Persona

## 5.1 Company Administrator

User utama perusahaan yang mendaftarkan organisasi dan mengelola akun perusahaan.

Hak utama:

- mengelola profil perusahaan;
- mengelola PIC;
- membuat pengajuan;
- melihat seluruh pengajuan perusahaan;
- mengunggah dokumen;
- merespon permintaan revisi;
- mengunduh sertifikat.

---

## 5.2 Company PIC

Perwakilan perusahaan yang bertanggung jawab terhadap pengajuan tertentu.

PIC dapat menerima email notification mengenai:

- pengajuan diterima;
- perubahan status;
- permintaan dokumen;
- permintaan revisi;
- agenda proses;
- hasil keputusan;
- sertifikat diterbitkan.

---

## 5.3 DSN-MUI Internal User

Tidak login melalui Public Portal.

User internal tetap menggunakan ERP Amanah.

Setiap pengajuan dari Public Portal langsung tersedia di ERP sesuai role dan workflow yang berlaku.

---

# 6. High-Level Architecture

Arsitektur harus menggunakan prinsip:

**One Backend — Multiple Frontend Experiences.**

```text
                    ┌────────────────────────────┐
                    │     PERUSAHAAN / USER      │
                    └──────────────┬─────────────┘
                                   │
                                   ▼
                    ┌────────────────────────────┐
                    │ AMANAH PUBLIC WEB PORTAL   │
                    │ React + Vite + Tailwind    │
                    └──────────────┬─────────────┘
                                   │
                              HTTPS REST API
                                   │
                                   ▼
              ┌────────────────────────────────────────┐
              │       AMANAH EXISTING BACKEND          │
              │                                        │
              │ Authentication                         │
              │ Company                                │
              │ Submission                             │
              │ Incoming Letter                        │
              │ Workflow                               │
              │ Meeting Process                        │
              │ Documents                              │
              │ Notification                           │
              │ Certificate                            │
              │ Audit Trail                            │
              └───────────────────┬────────────────────┘
                                  │
                 ┌────────────────┼────────────────┐
                 ▼                ▼                ▼
             Database        File Storage      Email Service
                 │
                 ▼
              ┌────────────────────────────┐
              │       ERP AMANAH           │
              │      Internal DSN-MUI      │
              └────────────────────────────┘
```

### Architectural Rule

Public Portal **tidak memiliki backend sendiri**.

Tidak boleh terdapat:

```text
Public Portal
     ↓
Public Backend
     ↓
ERP Backend
```

Arsitektur tersebut harus dihindari karena menciptakan:

- duplicate business logic;
- duplicate security layer;
- data synchronization problem;
- redundant API;
- higher maintenance cost.

Gunakan:

```text
Public Portal ───────┐
                     ├──► AMANAH BACKEND
ERP Amanah ──────────┘
```

Backend menentukan hak akses berdasarkan authentication context dan role.

---

# 7. Recommended Frontend Technology

## Core

```text
React
Vite
JavaScript
React Router
Tailwind CSS
shadcn/ui
Lucide Icons
```

shadcn/ui direkomendasikan karena component source berada dalam project sehingga desain dapat dimodifikasi secara penuh agar konsisten dengan visual ERP Amanah, bukan terlihat seperti aplikasi template pihak ketiga.

## Data & Form Management

Direkomendasikan:

```text
TanStack Query
React Hook Form
Zod
Axios / Fetch API wrapper
```

### TanStack Query

Digunakan untuk:

- API fetching;
- cache;
- loading state;
- retry;
- revalidation;
- pagination;
- background refresh status pengajuan.

### React Hook Form

Digunakan untuk form kompleks seperti:

- registrasi perusahaan;
- pengajuan;
- dokumen persyaratan;
- perubahan data perusahaan.

### Zod

Digunakan untuk client-side validation schema.

Validation di frontend hanya untuk usability.

**Validation keamanan tetap wajib dilakukan backend.**

---

# 8. Amanah Design System

Public Portal wajib terlihat sebagai bagian dari sistem Amanah.

Tidak boleh membuat branding baru.

Developer harus mengambil design token dari ERP Amanah existing.

Design token minimum:

```text
Primary Color
Secondary Color
Accent Color
Background Color
Surface Color
Success Color
Warning Color
Danger Color
Text Primary
Text Secondary
Border Color

Font Family
Font Weight
Border Radius
Shadow
Button Style
Input Style
Card Style
Logo Usage
```

Logo resmi Amanah yang sama dengan ERP wajib digunakan.

---

# 9. UI Design Direction

Visual diarahkan kepada:

**Modern Government / Enterprise SaaS.**

Karakter visual:

- professional;
- trustworthy;
- calm;
- spacious;
- modern;
- tidak terasa seperti portal pemerintah lama;
- tidak terlalu banyak menu;
- mobile friendly;
- accessibility friendly.

Gunakan layout dengan white space cukup.

Card tidak menggunakan terlalu banyak shadow.

Gunakan border tipis dan subtle shadow.

Status menggunakan badge warna yang konsisten.

Icon menggunakan Lucide dengan gaya outline.

---

# 10. Public Landing Page

Sebelum login, user melihat landing page Amanah.

### Hero Section

Headline rekomendasi:

**Pengajuan Kesesuaian Syariah Lebih Mudah melalui Amanah**

Subheadline:

> Ajukan dokumen, pantau proses, lengkapi kebutuhan administrasi, dan akses hasil pengajuan Anda dalam satu platform resmi.

CTA:

**Ajukan Sekarang**

Secondary CTA:

**Masuk ke Akun**

Visual hero dapat menggunakan ilustrasi profesional berupa:

- corporate document;
- digital submission;
- document verification;
- collaboration;
- certification.

Hindari stock image handshake yang terlalu generik.

Jika tidak tersedia ilustrasi resmi DSN-MUI, visual dapat dibuat menggunakan AI image generation dengan style corporate flat / semi-3D illustration agar mempunyai identitas visual yang konsisten.

---

# 11. Landing Page Structure

```text
Navbar
 ↓
Hero
 ↓
Bagaimana Cara Mengajukan
 ↓
4 Step Process
 ↓
Keuntungan menggunakan Amanah
 ↓
FAQ
 ↓
Help / Contact
 ↓
Footer
```

### Four Step Explanation

```text
01
Daftar Perusahaan

02
Lengkapi Pengajuan

03
Pantau Proses

04
Terima Hasil
```

---

# 12. Registration Flow

Pendaftaran menggunakan **Email OTP Verification**.

Flow:

```text
Masukkan Email
       ↓
Kirim OTP
       ↓
Verifikasi OTP
       ↓
Data PIC
       ↓
Data Perusahaan
       ↓
Konfirmasi
       ↓
Account Created
       ↓
Dashboard
```

---

# 13. Company Registration Form

Data minimum:

### Data Perusahaan

- Nama perusahaan/lembaga
- Bentuk badan usaha
- Nomor legalitas perusahaan
- NPWP jika dibutuhkan
- Alamat
- Provinsi
- Kota/Kabupaten
- Website
- Nomor telepon perusahaan

### PIC

- Nama lengkap
- Jabatan
- Email
- Nomor handphone

Field harus mengikuti kebutuhan aktual DSN-MUI dan struktur database Amanah.

---

# 14. Passwordless Authentication

Login tidak menggunakan password.

Flow:

```text
Email
  ↓
Kirim OTP
  ↓
6 Digit Verification
  ↓
Authenticated Session
  ↓
Dashboard
```

OTP minimal harus:

- mempunyai masa berlaku singkat;
- single-use;
- mempunyai batas percobaan;
- otomatis tidak berlaku setelah berhasil digunakan;
- tidak dicatat sebagai plaintext pada log;
- mempunyai resend cooldown;
- OTP sebelumnya invalid ketika OTP baru dibuat.

Prinsip tersebut sesuai dengan rekomendasi keamanan OTP OWASP.

Recommended configuration:

```text
OTP Length         : 6 digit
OTP TTL            : 5 menit
Maximum Attempt    : 5
Resend Cooldown    : 60 detik
Maximum Resend     : controlled/rate limited
```

Backend menyimpan OTP dalam bentuk hash.

---

# 15. Dashboard

Setelah login user melihat dashboard sederhana.

Header:

```text
Selamat Datang,
PT Contoh Indonesia
```

Summary card:

```text
Total Pengajuan

Dalam Proses

Perlu Tindakan

Selesai
```

Di bawahnya:

## Pengajuan Terbaru

Contoh:

| Nomor | Jenis Pengajuan | Tanggal | Status |
|---|---|---|---|
| AMN-2026-000821 | Kesesuaian Syariah Produk ABC | 21 Agu 2026 | Dalam Verifikasi |

CTA utama harus terlihat jelas:

**+ Buat Pengajuan Baru**

---

# 16. Main Navigation

Desktop sidebar:

```text
Dashboard

Pengajuan Saya

Dokumen

Sertifikat

Profil Perusahaan

Pusat Bantuan
```

Mobile menggunakan bottom navigation atau compact navigation drawer.

---

# 17. New Submission Wizard

Pembuatan pengajuan tidak menggunakan satu halaman form panjang.

Gunakan **multi-step wizard**.

```text
1. Informasi Pengajuan
          ↓
2. Surat Permohonan
          ↓
3. Dokumen Persyaratan
          ↓
4. Review
          ↓
5. Submit
```

Header stepper selalu terlihat.

---

# 18. Step 1 — Informasi Pengajuan

Contoh informasi:

- kategori pengajuan;
- jenis pengajuan;
- judul/subject permohonan;
- produk atau layanan yang diajukan;
- deskripsi singkat;
- PIC pengajuan.

Kategori harus bersumber dari master data backend Amanah sehingga tidak di-hardcode di frontend.

---

# 19. Step 2 — Surat Permohonan

Karena surat disusun sendiri oleh perusahaan, portal menyediakan upload:

**Surat Permohonan Resmi**

Preferred format:

```text
PDF
```

Jika kebutuhan operasional mengizinkan:

```text
DOCX
PDF
```

User melihat:

```text
Drag & Drop dokumen di sini

atau

Pilih Dokumen
```

Setelah upload:

```text
surat-permohonan.pdf
PDF • 1.8 MB

[Preview] [Ganti] [Hapus]
```

---

# 20. Step 3 — Dokumen Persyaratan

Persyaratan tidak boleh berupa attachment generik saja.

Backend memberikan **requirement checklist** berdasarkan kategori pengajuan.

Contoh:

```text
✓ Surat Permohonan
✓ Profil Perusahaan
✓ Legalitas Perusahaan
○ Dokumen Produk
○ Dokumen Pendukung
○ Dokumen Tambahan
```

Setiap persyaratan mempunyai:

- nama dokumen;
- deskripsi;
- mandatory / optional;
- allowed file type;
- maximum file size;
- upload status.

Submit tidak aktif selama mandatory requirement belum lengkap.

---

# 21. Draft Submission

Pengajuan otomatis tersimpan sebagai:

**DRAFT**

User dapat keluar dari browser dan melanjutkan kembali.

Dashboard menampilkan:

> Draft — 3 dari 5 tahap selesai

CTA:

**Lanjutkan Pengajuan**

---

# 22. Final Review

Sebelum Submit tampil halaman review.

Section:

```text
Informasi Pengajuan

PIC

Surat Permohonan

Dokumen Persyaratan

Pernyataan
```

Checkbox:

> Saya menyatakan seluruh informasi dan dokumen yang disampaikan benar dan dapat dipertanggungjawabkan.

Button:

**Kirim Pengajuan**

Gunakan confirmation dialog:

> Setelah dikirim, pengajuan akan diteruskan kepada DSN-MUI dan tidak dapat diubah kecuali terdapat permintaan perbaikan.

---

# 23. Submission Creation in ERP

Setelah berhasil Submit:

Public Portal mengirim request ke backend Amanah.

Backend secara atomic melakukan:

```text
Create Submission
      +
Create Incoming Letter
      +
Link Company
      +
Link Applicant
      +
Link Documents
      +
Create Workflow
      +
Create Audit Event
      +
Create Notification
```

ERP Amanah kemudian langsung menampilkan pengajuan tersebut pada:

**Surat Masuk**

Tidak ada input ulang.

---

# 24. Incoming Letter Mapping

Data dari portal dipetakan minimal menjadi:

```text
Nomor Pengajuan
Nomor Surat Perusahaan
Tanggal Surat
Tanggal Pengajuan
Asal Surat
Nama Perusahaan
Perihal
PIC
Jenis Pengajuan
Surat Utama
Lampiran
Status
```

Pada ERP dokumen tetap dapat:

- Preview
- Download
- Print

---

# 25. Submission Status

Gunakan status bisnis yang mudah dipahami perusahaan.

Hindari memperlihatkan terminology internal DSN-MUI yang terlalu teknis.

Recommended status:

```text
Draft

Pengajuan Terkirim

Verifikasi Administrasi

Perlu Perbaikan

Sedang Diproses

Dalam Pembahasan

Menunggu Informasi Tambahan

Proses Keputusan

Disetujui

Sertifikat Diterbitkan

Selesai
```

Opsional:

```text
Ditolak

Dibatalkan
```

---

# 26. Status Mapping

Backend boleh mempunyai status internal lebih kompleks.

Public Portal menggunakan mapping.

Contoh:

```text
ERP INTERNAL
VERIFICATION_LEVEL_2

            ↓ mapping

PUBLIC
Verifikasi Administrasi
```

Dengan demikian workflow ERP tidak perlu disederhanakan hanya untuk kebutuhan public UI.

---

# 27. Submission Detail Page

Ini merupakan halaman terpenting sistem.

Layout:

```text
Breadcrumb

Nomor Pengajuan
Judul Pengajuan
Status

────────────────────────────

Progress Timeline

────────────────────────────

Ringkasan Pengajuan

────────────────────────────

Dokumen

────────────────────────────

Permintaan / Tindakan

────────────────────────────

Riwayat Aktivitas
```

---

# 28. Progress Timeline

Timeline harus menjadi center of experience.

Contoh:

```text
● 21 Agu 2026
Pengajuan Diterima

│

● 22 Agu 2026
Verifikasi Administrasi

│

● 24 Agu 2026
Dokumen Dinyatakan Lengkap

│

● 27 Agu 2026
Dalam Pembahasan

│

○
Proses Keputusan

│

○
Sertifikat
```

Current process menggunakan highlight.

---

# 29. Process Transparency

User tidak perlu mengetahui semua aktivitas internal.

Backend menentukan event mana yang:

```text
INTERNAL_ONLY
```

dan mana yang:

```text
PUBLIC_VISIBLE
```

Contoh internal:

> Surat dialihkan dari Staff A ke Staff B.

Tidak perlu ditampilkan.

Contoh public:

> Dokumen dinyatakan lengkap.

Harus ditampilkan.

---

# 30. Meeting / Discussion Process

Karena pengajuan dapat melalui beberapa pembahasan atau rapat, sistem harus dapat menyimpan beberapa tahap pembahasan.

Public timeline cukup menampilkan informasi seperti:

```text
Pembahasan Pengajuan

12 September 2026

Pengajuan Anda sedang dalam tahap pembahasan oleh tim terkait.
```

Tidak perlu membocorkan:

- catatan rapat internal;
- voting internal;
- komentar internal;
- dokumen confidential;
- nama reviewer apabila tidak diperlukan.

Gunakan field:

```text
visibility = INTERNAL | PUBLIC
```

pada workflow event atau activity.

---

# 31. Request for Revision

DSN-MUI dapat meminta revisi melalui ERP.

Contoh:

**Perlu Perbaikan**

> Mohon melengkapi dokumen spesifikasi produk terbaru.

Deadline:

**27 Agustus 2026**

CTA:

**Lengkapi Sekarang**

User kemudian melihat form:

```text
Catatan DSN-MUI

Dokumen yang diminta

Upload Dokumen Baru

Catatan dari Pemohon
```

Setelah submit:

```text
Revision Submitted
```

dan workflow ERP otomatis bergerak sesuai rule.

---

# 32. Communication Model

Tahap awal tidak perlu membuat fitur chat seperti WhatsApp.

Gunakan model:

**Structured Request & Response**

Lebih aman, mudah diaudit dan lebih cocok untuk proses administrasi formal.

Contoh:

```text
DSN-MUI Request
        ↓
Company Response
        ↓
DSN-MUI Review
```

Seluruh komunikasi tersimpan dalam application activity.

---

# 33. Notification Center

Navbar mempunyai icon:

**🔔 Notification**

Contoh event:

- pengajuan berhasil dikirim;
- pengajuan diterima;
- status berubah;
- perlu revisi;
- dokumen tambahan dibutuhkan;
- proses pembahasan;
- keputusan tersedia;
- sertifikat diterbitkan.

Notifikasi memiliki:

```text
read
unread
```

---

# 34. Email Notification

Event penting juga mengirim email.

Contoh subject:

**[AMANAH] Pengajuan Anda Memerlukan Tindakan**

Email hanya berisi ringkasan.

Dokumen sensitif tidak perlu dilampirkan.

CTA:

**Buka Amanah**

User login ke portal untuk melihat detail.

---

# 35. Certificate Delivery

Ketika DSN-MUI menerbitkan sertifikat melalui ERP:

Backend menghubungkan sertifikat dengan Submission.

Status:

**Sertifikat Diterbitkan**

Portal menampilkan:

```text
Sertifikat Kesesuaian Syariah

Nomor Sertifikat
Tanggal Terbit
Masa Berlaku

[Preview Sertifikat]

[Download PDF]
```

---

# 36. Certificate Security

Certificate download harus menggunakan authorized API.

Jangan mengekspos direct public storage URL.

Recommended:

```text
GET /certificate/:id/download
```

Backend memeriksa:

```text
authenticated
     +
company ownership
     +
submission ownership
     +
certificate status
```

Baru kemudian backend menghasilkan secure temporary response / signed download.

---

# 37. Document Preview

Sistem menyediakan unified document viewer.

Supported minimum:

```text
PDF
Image
```

Untuk DOCX/XLSX/PPTX bila dibutuhkan, jangan memaksa browser melakukan native rendering.

Direkomendasikan backend/document service membuat **preview derivative PDF** ketika dokumen di-upload.

Original file tetap disimpan.

Model:

```text
Original DOCX
     │
     ├── Original Storage
     │
     └── Preview PDF
              ↓
         Web Viewer
```

Untuk PDF viewer gunakan PDF.js atau viewer internal berbasis PDF.js.

---

# 38. Document Viewer UX

Viewer menyediakan:

```text
Zoom In

Zoom Out

Fit Width

Page Navigation

Rotate

Fullscreen

Download

Print
```

Dokumen tidak perlu di-download terlebih dahulu agar dapat dibaca.

---

# 39. Secure File Upload

Karena portal menerima dokumen eksternal perusahaan, upload merupakan attack surface penting.

Implementasikan:

- extension allowlist;
- MIME validation;
- file signature validation;
- maximum size;
- randomized filename;
- malware scanning;
- authorization;
- file storage di luar public webroot;
- controlled download;
- audit trail.

OWASP secara eksplisit merekomendasikan kombinasi pertahanan tersebut karena pemeriksaan extension saja tidak mencukupi.

---

# 40. Recommended File Policy

Tahap awal:

```text
PDF
DOCX
XLSX
JPG
JPEG
PNG
```

Hindari:

```text
HTML
JS
PHP
EXE
BAT
SH
APK
ZIP
```

kecuali secara bisnis benar-benar diperlukan.

---

# 41. File Size

Default recommendation:

```text
Single Document : 20 MB
```

Untuk dokumen tertentu dapat diatur dari master requirement.

Contoh:

```text
Dokumen Produk
Maximum 50 MB
```

Jangan hardcode seluruh batas file di frontend.

Backend menjadi source of truth.

---

# 42. Profile Perusahaan

Menu:

**Profil Perusahaan**

Section:

```text
Informasi Perusahaan

Alamat

Legalitas

PIC

Kontak

Security
```

---

# 43. Multiple PIC

Sistem sebaiknya mendukung lebih dari satu user dalam perusahaan.

Role contoh:

```text
Company Admin

Company User
```

Company Admin dapat:

- invite user;
- deactivate user;
- menentukan PIC pengajuan.

Hal ini penting agar akun Amanah tidak bergantung kepada satu orang ketika PIC perusahaan berpindah jabatan.

---

# 44. Company User Invitation

Flow:

```text
Company Admin
     ↓
Invite Email
     ↓
Recipient Click
     ↓
Email OTP Verification
     ↓
Join Company
```

---

# 45. Authorization Model

Backend wajib menerapkan tenant isolation.

Setiap user mempunyai:

```text
user_id
company_id
role
```

Semua query submission harus memverifikasi company ownership.

Tidak boleh bergantung hanya kepada:

```text
submission_id
```

yang dikirim dari frontend.

Backend wajib melakukan:

```text
submission.company_id === authenticatedUser.company_id
```

---

# 46. Session Security

Session direkomendasikan menggunakan:

- Secure cookie;
- HttpOnly;
- SameSite;
- session expiration;
- session rotation;
- CSRF protection sesuai authentication architecture;
- device/session management.

Hindari menyimpan long-lived authentication token di `localStorage` jika tidak diperlukan.

---

# 47. Risk-Based Step-Up Verification

Email OTP menjadi authentication utama sesuai requirement.

Namun untuk tindakan sensitif dapat diminta OTP ulang.

Contoh:

```text
Ganti Email Utama

Tambah Company Admin

Perubahan Data Legal

Download Sertifikat Pertama Kali

Perubahan Informasi Security
```

---

# 48. Brute Force Protection

Endpoint OTP harus dilindungi dengan:

```text
IP Rate Limit

Account Rate Limit

OTP Attempt Limit

Resend Cooldown

Temporary Lock

Suspicious Activity Logging
```

OWASP juga merekomendasikan login throttling dan pembatasan upaya autentikasi untuk mengurangi automated attacks.

---

# 49. Audit Trail

Semua aktivitas penting dicatat.

Contoh:

```text
LOGIN_SUCCESS

OTP_REQUESTED

OTP_FAILED

COMPANY_UPDATED

SUBMISSION_CREATED

DOCUMENT_UPLOADED

SUBMISSION_SUBMITTED

REVISION_REQUESTED

REVISION_SUBMITTED

CERTIFICATE_VIEWED

CERTIFICATE_DOWNLOADED
```

Audit menyimpan:

```text
timestamp
user_id
company_id
action
resource
resource_id
IP
user_agent
metadata
```

OTP value tidak boleh masuk audit log.

---

# 50. Application Activity

Audit Trail berbeda dengan Activity Timeline.

**Audit Trail**

Untuk keamanan dan administrator.

**Activity Timeline**

Untuk pengalaman pengguna.

Contoh:

```text
21 Aug 10:22
Pengajuan dikirim

22 Aug 09:10
Pengajuan sedang diverifikasi
```

---

# 51. API Design

Backend existing ditambahkan resource sesuai kebutuhan public portal.

Contoh struktur endpoint:

```text
/auth/request-otp
/auth/verify-otp
/auth/logout
/auth/session

/public/company
/public/company/users

/public/submissions
/public/submissions/:id
/public/submissions/:id/documents
/public/submissions/:id/submit

/public/submissions/:id/timeline
/public/submissions/:id/requests
/public/submissions/:id/responses

/public/certificates
/public/certificates/:id
/public/certificates/:id/download

/public/notifications
```

Prefix `/public/` di sini berarti API untuk consumer Public Portal.

Tetap berada pada **service Amanah existing**, bukan backend baru.

---

# 52. Shared Domain Model

Entity minimum:

```text
User
Company
CompanyUser

Submission
SubmissionType
SubmissionRequirement

IncomingLetter

Document
SubmissionDocument

Workflow
WorkflowStep
WorkflowActivity

Request
RequestResponse

Notification

Certificate

AuditLog
```

---

# 53. Critical Relationship

```text
Company
  │
  ├── Users
  │
  └── Submission
         │
         ├── Incoming Letter
         │
         ├── Documents
         │
         ├── Workflow
         │      └── Activities
         │
         ├── Requests
         │
         └── Certificate
```

Satu Submission harus dapat ditelusuri dari awal hingga sertifikat.

---

# 54. Submission Number

Backend menghasilkan nomor unik.

Contoh:

```text
AMN-2026-000001
```

Nomor tersebut menjadi referensi komunikasi public.

Nomor surat resmi perusahaan tetap disimpan sebagai field terpisah.

---

# 55. Search

Pengajuan Saya menyediakan pencarian:

```text
Nomor Pengajuan

Nomor Surat

Judul Pengajuan
```

Filter:

```text
Status

Jenis Pengajuan

Tanggal
```

---

# 56. Empty State

Jangan tampilkan table kosong.

Contoh:

**Belum ada pengajuan**

> Mulai pengajuan kesesuaian syariah pertama perusahaan Anda melalui Amanah.

**Buat Pengajuan**

---

# 57. Error UX

Hindari pesan seperti:

```text
Error 500
```

Gunakan:

> Kami belum dapat memproses permintaan Anda. Silakan coba kembali.

Namun backend tetap mengirim trace ID.

Contoh:

```text
Reference ID:
AMA-ERR-K8HF73
```

agar support dapat melakukan tracing.

---

# 58. Upload UX

Upload besar harus menunjukkan progress.

```text
Mengunggah Dokumen

████████░░ 82%

Jangan tutup halaman sampai upload selesai.
```

Jika gagal:

```text
Upload tidak berhasil

[Coba Lagi]
```

Jangan memaksa user memilih file ulang jika browser memungkinkan retry menggunakan file yang sama.

---

# 59. Unsaved Changes

Jika user meninggalkan form:

> Perubahan Anda belum tersimpan.

Options:

```text
Tetap di Halaman

Keluar
```

Draft auto-save direkomendasikan.

---

# 60. Accessibility

Target minimal:

**WCAG 2.1 AA**

Perhatikan:

- contrast;
- keyboard navigation;
- focus state;
- screen reader labels;
- button size;
- form error description;
- semantic HTML.

Status jangan hanya dibedakan melalui warna.

Gunakan:

```text
icon + text + color
```

---

# 61. Responsive Design

Prioritas breakpoint:

```text
Desktop

Laptop

Tablet

Mobile
```

Walaupun proses upload dokumen kemungkinan dominan desktop, tracking proses sangat mungkin dilakukan melalui handphone.

Karena itu dashboard dan Submission Detail wajib optimal di mobile.

---

# 62. Recommended Desktop Layout

```text
┌──────────────┬────────────────────────────────────────┐
│              │ Header                                 │
│ Amanah       ├────────────────────────────────────────┤
│              │                                        │
│ Dashboard    │             Content                    │
│ Pengajuan    │                                        │
│ Dokumen      │                                        │
│ Sertifikat   │                                        │
│ Profil       │                                        │
│              │                                        │
└──────────────┴────────────────────────────────────────┘
```

---

# 63. Recommended Mobile Layout

```text
┌──────────────────────┐
│ Amanah        🔔 👤   │
├──────────────────────┤
│                      │
│      CONTENT         │
│                      │
│                      │
├──────────────────────┤
│ Home  Pengajuan  👤  │
└──────────────────────┘
```

---

# 64. User Help

Sediakan:

**Pusat Bantuan**

Kategori:

```text
Cara Membuat Pengajuan

Dokumen Persyaratan

Status Pengajuan

Perbaikan Dokumen

Sertifikat

Akun dan Login
```

FAQ dapat dikelola dari ERP/CMS apabila memungkinkan.

---

# 65. Support Ticket — Future Ready

Phase berikutnya dapat menambahkan:

**Hubungi Kami / Ticket Support**

Ticket tetap terhubung dengan:

```text
company_id
submission_id
```

sehingga support tidak kehilangan konteks.

---

# 66. Performance Requirement

Target:

```text
Initial load < 3 sec pada koneksi normal

API common response < 2 sec

Interactive feedback < 300 ms

Lazy load document viewer

Chunk large page modules
```

Gunakan route-based code splitting.

---

# 67. Browser Support

Minimal target modern browsers:

```text
Chrome

Edge

Firefox

Safari

Mobile Chrome

Mobile Safari
```

Vite production build modern secara default menargetkan browser modern dan mendukung konfigurasi target apabila dibutuhkan.

---

# 68. Observability

Frontend harus mencatat:

```text
API error

Unhandled exception

Upload failure

Authentication failure

Slow request

Document preview failure
```

Gunakan correlation/trace ID dari backend.

Sensitive document data tidak boleh masuk telemetry.

---

# 69. Security Headers

Deployment frontend/API harus memperhatikan:

```text
HTTPS Only

HSTS

Content-Security-Policy

X-Content-Type-Options

Referrer-Policy

Permissions-Policy

Frame Ancestors
```

CORS hanya mengizinkan origin Amanah yang dibutuhkan.

---

# 70. Privacy

Portal menyimpan data perusahaan dan PIC.

Harus tersedia:

```text
Privacy Policy

Terms / Ketentuan Penggunaan

Data Processing Information
```

User mendapatkan informasi penggunaan data saat registrasi.

---

# 71. Public Portal ↔ ERP Behavior

Contoh end-to-end:

```text
COMPANY

Buat Pengajuan
      ↓
Submit
      ↓

─────────────────────────────

AMANAH BACKEND

Create Submission
Create Incoming Letter
Create Workflow

─────────────────────────────

ERP AMANAH

Surat Masuk Baru
      ↓
Staff Verifikasi
      ↓
Request Revision

─────────────────────────────

AMANAH BACKEND

Create Public Activity
Create Notification

─────────────────────────────

PUBLIC PORTAL

Status:
Perlu Perbaikan

User Upload Revisi
      ↓

─────────────────────────────

ERP AMANAH

Dokumen Revisi Masuk
      ↓
Proses
      ↓
Rapat / Pembahasan
      ↓
Keputusan
      ↓
Generate Certificate

─────────────────────────────

PUBLIC PORTAL

Sertifikat Tersedia
      ↓
Preview
      ↓
Download
```

---

# 72. Notification Event Mapping

| Event ERP | Public Status | Email |
|---|---|---|
| Submission Received | Pengajuan Terkirim | Yes |
| Verification Started | Verifikasi Administrasi | Optional |
| Revision Required | Perlu Perbaikan | Yes |
| Revision Accepted | Sedang Diproses | Yes |
| Discussion | Dalam Pembahasan | Optional |
| Decision Process | Proses Keputusan | Optional |
| Approved | Disetujui | Yes |
| Certificate Published | Sertifikat Diterbitkan | Yes |

---

# 73. Homepage Visual Language

Recommended visual:

**Enterprise + Islamic Institutional + Digital Service**

Bukan berarti UI harus menggunakan banyak ornamen Islam.

Gunakan identitas secara subtle:

- brand color Amanah;
- pola geometris ringan pada background;
- clean typography;
- institutional photography hanya jika relevan;
- illustration of document process;
- subtle Islamic geometric visual sebagai accent.

Hal ini akan membuat portal tetap modern dan professional.

---

# 74. Image Asset Strategy

Prioritas asset:

### Level 1

Asset resmi:

- Logo DSN-MUI;
- Logo Amanah;
- foto institusi resmi.

### Level 2

Custom illustration.

Buat ilustrasi AI dengan visual konsisten.

Contoh prompt visual:

> Professional Indonesian corporate digital service illustration showing company representative submitting official documents through a secure digital platform, sophisticated institutional atmosphere, clean modern SaaS aesthetic, subtle Islamic geometric elements, white background, elegant corporate colors, premium government enterprise UI illustration, no text.

### Level 3

Stock photography hanya digunakan jika mempunyai kualitas tinggi dan relevan.

Hindari stock image berlebihan.

---

# 75. MVP Scope

Phase 1 wajib meliputi:

```text
Landing Page

Registration OTP

Login OTP

Company Profile

Dashboard

Create Submission

Draft Submission

Document Requirement

Document Upload

Submission

Integration to Surat Masuk ERP

Submission List

Submission Detail

Progress Timeline

Revision Request

Revision Response

Notification

Email Notification

Certificate Preview

Certificate Download

Audit Trail

Responsive UI
```

---

# 76. Phase 2

Setelah MVP stabil:

```text
Multiple Company Users

Delegation

Support Ticket

Advanced Company Document Library

Reusable Legal Documents

Realtime Notification

Meeting Information

Digital Correspondence

Certificate Validation QR

Public Certificate Verification

Analytics
```

---

# 77. Company Document Library — Recommended Enhancement

Satu enhancement yang sangat direkomendasikan adalah:

**Dokumen Perusahaan**

Contoh perusahaan sudah pernah mengupload:

```text
NIB

NPWP

Akta Perusahaan

Profil Perusahaan
```

Untuk pengajuan berikutnya user dapat memilih:

**Gunakan Dokumen Tersimpan**

daripada upload ulang.

Backend tetap memastikan dokumen belum expired.

Hal ini dapat sangat meningkatkan kenyamanan perusahaan yang melakukan beberapa pengajuan.

---

# 78. Submission Requirement Engine — Recommended Enhancement

Jangan hardcode persyaratan pada frontend.

ERP menyediakan master:

```text
Submission Type
       ↓
Requirement
       ↓
Mandatory
       ↓
File Type
       ↓
Max File Size
       ↓
Description
```

Dengan demikian ketika DSN-MUI mengubah persyaratan, frontend tidak perlu di-deploy ulang.

---

# 79. Public Timeline Engine

Workflow event minimum mempunyai property:

```text
event_type
title
description
timestamp
visibility
public_status
performed_by
metadata
```

Contoh:

```text
visibility = PUBLIC
```

muncul pada portal.

```text
visibility = INTERNAL
```

hanya tersedia pada ERP.

---

# 80. Acceptance Criteria — Submission

Feature dinyatakan selesai apabila:

1. User dapat registrasi melalui OTP.
2. OTP yang kedaluwarsa tidak dapat digunakan.
3. User dapat membuat draft pengajuan.
4. User dapat upload surat.
5. User dapat upload persyaratan.
6. Requirement mandatory divalidasi.
7. User dapat melakukan Submit.
8. Submit menghasilkan submission number.
9. Submission otomatis muncul dalam Surat Masuk ERP.
10. Attachment yang sama tersedia di ERP.
11. User tidak dapat mengedit submission setelah Submit kecuali workflow mengizinkan.
12. Aktivitas Submit tercatat dalam audit.

---

# 81. Acceptance Criteria — Workflow

Feature dinyatakan selesai apabila:

1. Perubahan proses dari ERP dapat terlihat di Public Portal.
2. Hanya activity `PUBLIC` yang terlihat.
3. Internal notes tidak pernah dikirim ke frontend.
4. Request revision dapat terlihat.
5. User dapat merespon request revision.
6. Response langsung tersedia di ERP.
7. Notification dikirim sesuai event.

---

# 82. Acceptance Criteria — Certificate

Feature selesai apabila:

1. Sertifikat diterbitkan dari ERP.
2. Sertifikat otomatis muncul pada submission terkait.
3. Company lain tidak dapat membuka sertifikat.
4. User dapat preview.
5. User dapat download.
6. Download dicatat dalam audit trail.
7. Direct storage URL tidak diekspos secara permanen.

---

# 83. Definition of Done

Public Portal dianggap production-ready jika:

```text
Functional Test PASS

API Integration PASS

Authorization Test PASS

File Security Test PASS

OTP Security Test PASS

Responsive Test PASS

Browser Test PASS

Document Preview Test PASS

ERP Synchronization Test PASS

Audit Test PASS

Performance Test PASS

UAT DSN-MUI PASS
```

---

# 84. Product Principle

Seluruh pengembangan harus mengikuti satu prinsip penting:

> **ERP Amanah adalah pusat proses kerja DSN-MUI, sedangkan Public Portal Amanah adalah jendela resmi perusahaan terhadap proses tersebut.**

Tidak boleh ada dua workflow berbeda.

Tidak boleh ada duplicate submission.

Tidak boleh ada sinkronisasi manual antara Public Portal dan ERP.

Semua aktivitas harus berangkat dari business object yang sama di backend Amanah.

---

# 85. Target User Experience

Pengguna perusahaan idealnya merasakan proses:

```text
Daftar
 ↓
Ajukan
 ↓
Pantau
 ↓
Lengkapi jika diminta
 ↓
Tunggu proses
 ↓
Terima hasil
```

Tanpa harus memahami struktur organisasi DSN-MUI.

Tanpa harus mengetahui siapa staf yang menangani.

Tanpa harus mencari email lama.

Tanpa harus menanyakan:

**“Pengajuan kami sudah sampai mana?”**

Karena jawabannya selalu tersedia di **Amanah**.