import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import api, { formatDate } from '../lib/api';
import type { Company, User } from '../types';
import {
  Building2,
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Globe,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  Shield,
  Save,
} from 'lucide-react';

export const CompanyProfilePage: React.FC = () => {
  const { company, user, updateCompany } = useAuth();
  const [formData, setFormData] = useState<Partial<Company>>({
    name: '',
    legalType: 'PT',
    legalityNumber: '',
    npwp: '',
    address: '',
    province: '',
    city: '',
    district: '',
    subdistrict: '',
    postalCode: '',
    phone: '',
    website: '',
  });

  const [picList, setPicList] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Invite PIC Modal
  const [showInviteModal, setShowInviteModal] = useState<boolean>(false);
  const [inviteForm, setInviteForm] = useState({
    fullName: '',
    email: '',
    position: 'PIC Pengajuan',
    phone: '',
    role: 'STAFF',
  });
  const [isInviting, setIsInviting] = useState<boolean>(false);

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || '',
        legalType: company.legalType || 'PT',
        legalityNumber: company.legalityNumber || '',
        npwp: company.npwp || '',
        address: company.address || '',
        province: company.province || '',
        city: company.city || '',
        district: company.district || '',
        subdistrict: company.subdistrict || '',
        postalCode: company.postalCode || '',
        phone: company.phone || '',
        website: company.website || '',
      });
    }
    fetchPics();
  }, [company]);

  const fetchPics = async () => {
    try {
      const res = await api.get('/company/users');
      if (res.data.status === 'success') {
        setPicList(res.data.data || []);
      }
    } catch {}
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);
    try {
      await updateCompany(formData);
      setSuccessMessage('Data profil perusahaan berhasil diperbarui.');
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Gagal memperbarui profil perusahaan.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInvitePic = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsInviting(true);
    try {
      const res = await api.post('/company/users/invite', inviteForm);
      if (res.data.status === 'success') {
        setShowInviteModal(false);
        setInviteForm({
          fullName: '',
          email: '',
          position: 'PIC Pengajuan',
          phone: '',
          role: 'STAFF',
        });
        fetchPics();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menambahkan PIC.');
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
          Profil & Legalitas Perusahaan
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Kelola data legalitas instansi dan daftar penanggung jawab (PIC) pengajuan DSN-MUI
        </p>
      </div>

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* ── FORM PROFIL PERUSAHAAN ── */}
      <form onSubmit={handleSaveProfile} className="bg-white dark:bg-[#172019] p-6 sm:p-8 rounded-3xl border border-border shadow-subtle space-y-6">
        <div className="border-b border-border pb-4 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-foreground">Informasi Badan Usaha</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Identitas resmi yang tertera pada sertifikat fatwa</p>
          </div>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isLoading}
            leftIcon={<Save className="w-3.5 h-3.5" />}
          >
            Simpan Perubahan
          </Button>
        </div>

        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="sm:col-span-1">
              <label className="block font-semibold text-foreground mb-1.5">Bentuk Usaha</label>
              <select
                value={formData.legalType}
                onChange={(e) => setFormData({ ...formData, legalType: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="PT">PT</option>
                <option value="PT Tbk">PT (Tbk)</option>
                <option value="CV">CV</option>
                <option value="Koperasi">Koperasi</option>
                <option value="Yayasan">Yayasan</option>
                <option value="BUMN/BUMD">BUMN / BUMD</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <div className="sm:col-span-3">
              <label className="block font-semibold text-foreground mb-1.5">Nama Perusahaan / Lembaga *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary focus:outline-none text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-foreground mb-1.5">Nomor NIB / Akta Notaris</label>
              <input
                type="text"
                value={formData.legalityNumber}
                onChange={(e) => setFormData({ ...formData, legalityNumber: e.target.value })}
                placeholder="cth: 0123456789"
                className="w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1.5">NPWP Perusahaan</label>
              <input
                type="text"
                value={formData.npwp}
                onChange={(e) => setFormData({ ...formData, npwp: e.target.value })}
                placeholder="01.234.567.8-012.000"
                className="w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-foreground mb-1.5">Alamat Kantor Pusat</label>
            <textarea
              rows={2}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-foreground mb-1.5">Provinsi</label>
              <input
                type="text"
                value={formData.province}
                onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1.5">Kota / Kabupaten</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-foreground mb-1.5">Kecamatan</label>
              <input
                type="text"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1.5">Kelurahan / Desa</label>
              <input
                type="text"
                value={formData.subdistrict}
                onChange={(e) => setFormData({ ...formData, subdistrict: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-foreground mb-1.5">Kode Pos</label>
              <input
                type="text"
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1.5">No. Telp Perusahaan</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1.5">Website Resmi</label>
              <input
                type="text"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:outline-none"
              />
            </div>
          </div>
        </div>
      </form>

      {/* ── PIC TEAM MANAGEMENT ── */}
      <div className="bg-white dark:bg-[#172019] p-6 sm:p-8 rounded-3xl border border-border shadow-subtle space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h3 className="text-base font-bold text-foreground">Tim PIC (Penanggung Jawab)</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Daftar narahubung yang berhak mengakses dan menerima notifikasi permohonan
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowInviteModal(true)}
            leftIcon={<PlusCircle className="w-3.5 h-3.5" />}
          >
            + Tambah PIC
          </Button>
        </div>

        <div className="divide-y divide-border/60">
          {picList.map((pic) => (
            <div key={pic.id} className="py-4 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary font-bold flex items-center justify-center flex-shrink-0">
                  {pic.fullName.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-foreground flex items-center gap-2">
                    <span>{pic.fullName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-muted font-mono font-semibold">
                      {pic.role}
                    </span>
                  </div>
                  <div className="text-muted-foreground mt-0.5">
                    {pic.position || 'Staff'} • {pic.email} • {pic.phone || '-'}
                  </div>
                </div>
              </div>

              {pic.id === user?.id && (
                <span className="text-[10px] font-bold px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full">
                  Akun Anda
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── INVITE PIC MODAL ── */}
      <Modal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        title="Tambah PIC / Anggota Tim"
        maxWidth="md"
      >
        <form onSubmit={handleInvitePic} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-foreground mb-1.5">Nama Lengkap & Gelar *</label>
            <input
              type="text"
              required
              value={inviteForm.fullName}
              onChange={(e) => setInviteForm({ ...inviteForm, fullName: e.target.value })}
              placeholder="Ahmad Fauzi, S.E."
              className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-foreground mb-1.5">Email PIC *</label>
            <input
              type="email"
              required
              value={inviteForm.email}
              onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
              placeholder="ahmad@perusahaan.co.id"
              className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-foreground mb-1.5">Jabatan</label>
              <input
                type="text"
                value={inviteForm.position}
                onChange={(e) => setInviteForm({ ...inviteForm, position: e.target.value })}
                placeholder="Staff Kepatuhan"
                className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-foreground mb-1.5">No. Handphone / WA</label>
              <input
                type="tel"
                value={inviteForm.phone}
                onChange={(e) => setInviteForm({ ...inviteForm, phone: e.target.value })}
                placeholder="0812XXXXXXXX"
                className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-border flex justify-end gap-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setShowInviteModal(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isInviting}>
              Tambahkan PIC
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
