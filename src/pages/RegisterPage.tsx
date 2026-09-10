import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { Button } from '../components/ui/Button';
import {
  Mail,
  Building2,
  User,
  Phone,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  MapPin,
  Globe,
  RefreshCw,
  FileText,
  Lock,
  Loader2,
  Info,
} from 'lucide-react';

interface RegionItem {
  id: string;
  name: string;
  provinceId?: string;
  regencyId?: string;
  districtId?: string;
}

export const RegisterPage: React.FC = () => {
  const { requestOtp, verifyOtp, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [otpVerified, setOtpVerified] = useState<boolean>(
    searchParams.get('otpVerified') === 'true'
  );
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(0);
  const [otpAttempt, setOtpAttempt] = useState<number>(1);
  const [lockoutRemaining, setLockoutRemaining] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successModalOpen, setSuccessModalOpen] = useState<boolean>(false);

  // Form State
  const [formData, setFormData] = useState({
    // PIC Data
    picFullName: '',
    picPosition: 'Head of Compliance / Sharia',
    picPhone: '',

    // Company Data
    companyName: '',
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

    // Agreement
    agreedToTerms: false,
  });

  // Cascading Regional State
  const [provinces, setProvinces] = useState<RegionItem[]>([]);
  const [regencies, setRegencies] = useState<RegionItem[]>([]);
  const [districts, setDistricts] = useState<RegionItem[]>([]);
  const [villages, setVillages] = useState<RegionItem[]>([]);

  const [selectedProvinceId, setSelectedProvinceId] = useState<string>('');
  const [selectedRegencyId, setSelectedRegencyId] = useState<string>('');
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('');
  const [selectedVillageId, setSelectedVillageId] = useState<string>('');

  const [loadingRegional, setLoadingRegional] = useState<{
    provinces: boolean;
    regencies: boolean;
    districts: boolean;
    villages: boolean;
    postal: boolean;
  }>({
    provinces: false,
    regencies: false,
    districts: false,
    villages: false,
    postal: false,
  });

  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Fetch provinces when reaching Step 3 or when list empty
  const fetchProvinces = async () => {
    try {
      setLoadingRegional((prev) => ({ ...prev, provinces: true }));
      const res = await api.get('/master/provinces');
      if (res.data?.status === 'success' && Array.isArray(res.data.data)) {
        setProvinces(res.data.data);
      }
    } catch (err) {
      console.error('[Regional] Gagal memuat provinsi:', err);
    } finally {
      setLoadingRegional((prev) => ({ ...prev, provinces: false }));
    }
  };

  useEffect(() => {
    if (currentStep === 3 && provinces.length === 0) {
      fetchProvinces();
    }
  }, [currentStep, provinces.length]);

  // Cascading Handlers
  const handleProvinceSelect = async (provId: string) => {
    setSelectedProvinceId(provId);
    const selected = provinces.find((p) => p.id === provId);
    const provName = selected ? selected.name : '';

    setFormData((prev) => ({
      ...prev,
      province: provName,
      city: '',
      district: '',
      subdistrict: '',
      postalCode: '',
    }));

    setSelectedRegencyId('');
    setSelectedDistrictId('');
    setSelectedVillageId('');
    setRegencies([]);
    setDistricts([]);
    setVillages([]);

    if (!provId) return;

    try {
      setLoadingRegional((prev) => ({ ...prev, regencies: true }));
      const res = await api.get(`/master/regencies/${provId}`);
      if (res.data?.status === 'success' && Array.isArray(res.data.data)) {
        setRegencies(res.data.data);
      }
    } catch (err) {
      console.error('[Regional] Gagal memuat kabupaten/kota:', err);
    } finally {
      setLoadingRegional((prev) => ({ ...prev, regencies: false }));
    }
  };

  const handleRegencySelect = async (regId: string) => {
    setSelectedRegencyId(regId);
    const selected = regencies.find((r) => r.id === regId);
    const regName = selected ? selected.name : '';

    setFormData((prev) => ({
      ...prev,
      city: regName,
      district: '',
      subdistrict: '',
      postalCode: '',
    }));

    setSelectedDistrictId('');
    setSelectedVillageId('');
    setDistricts([]);
    setVillages([]);

    if (!regId) return;

    try {
      setLoadingRegional((prev) => ({ ...prev, districts: true }));
      const res = await api.get(`/master/districts/${regId}`);
      if (res.data?.status === 'success' && Array.isArray(res.data.data)) {
        setDistricts(res.data.data);
      }
    } catch (err) {
      console.error('[Regional] Gagal memuat kecamatan:', err);
    } finally {
      setLoadingRegional((prev) => ({ ...prev, districts: false }));
    }
  };

  const handleDistrictSelect = async (distId: string) => {
    setSelectedDistrictId(distId);
    const selected = districts.find((d) => d.id === distId);
    const distName = selected ? selected.name : '';

    setFormData((prev) => ({
      ...prev,
      district: distName,
      subdistrict: '',
      postalCode: '',
    }));

    setSelectedVillageId('');
    setVillages([]);

    if (!distId) return;

    try {
      setLoadingRegional((prev) => ({ ...prev, villages: true }));
      const res = await api.get(`/master/villages/${distId}`);
      if (res.data?.status === 'success' && Array.isArray(res.data.data)) {
        setVillages(res.data.data);
      }
    } catch (err) {
      console.error('[Regional] Gagal memuat kelurahan:', err);
    } finally {
      setLoadingRegional((prev) => ({ ...prev, villages: false }));
    }
  };

  const handleVillageSelect = async (villId: string) => {
    setSelectedVillageId(villId);
    const selected = villages.find((v) => v.id === villId);
    const villName = selected ? selected.name : '';

    setFormData((prev) => ({
      ...prev,
      subdistrict: villName,
    }));

    if (!villName) return;

    // Auto lookup postal code
    try {
      setLoadingRegional((prev) => ({ ...prev, postal: true }));
      const currentDistrict = formData.district;
      const res = await api.get(
        `/master/postal-code?district=${encodeURIComponent(currentDistrict)}&village=${encodeURIComponent(villName)}`
      );
      if (res.data?.status === 'success' && res.data.postalCode) {
        setFormData((prev) => ({
          ...prev,
          postalCode: res.data.postalCode,
        }));
      }
    } catch (err) {
      console.error('[Regional] Gagal memuat kodepos:', err);
    } finally {
      setLoadingRegional((prev) => ({ ...prev, postal: false }));
    }
  };

  useEffect(() => {
    if (isAuthenticated && !successModalOpen) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate, successModalOpen]);

  useEffect(() => {
    if (searchParams.get('otpVerified') === 'true' && searchParams.get('email')) {
      setOtpVerified(true);
      setCurrentStep(2);
    }
  }, [searchParams]);

  useEffect(() => {
    let timer: any;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  useEffect(() => {
    let timer: any;
    if (lockoutRemaining > 0) {
      timer = setInterval(() => setLockoutRemaining((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [lockoutRemaining]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // STEP 1A: Request OTP
  const handleRequestOtp = async (e?: React.FormEvent | React.MouseEvent) => {
    e?.preventDefault?.();
    setErrorMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMessage('Mohon masukkan alamat email yang valid.');
      return;
    }

    if (lockoutRemaining > 0) {
      setErrorMessage(`Batas 3x pengiriman tercapai. Silakan tunggu ${formatLockout(lockoutRemaining)}.`);
      return;
    }

    setIsLoading(true);
    try {
      const res = await requestOtp(cleanEmail, 'REGISTER');
      setOtpSent(true);
      setCountdown(45); // Tepat 45 detik
      if (res.attempt) {
        setOtpAttempt(res.attempt);
      }
      setLockoutRemaining(0);
      setOtpDigits(['', '', '', '', '', '']);
      setTimeout(() => otpInputsRef.current[0]?.focus(), 150);
    } catch (err: any) {
      const serverCode = err.response?.data?.code;
      const lockoutSecs = err.response?.data?.lockoutSeconds;
      if (serverCode === 'OTP_LIMIT_REACHED' && lockoutSecs) {
        setLockoutRemaining(lockoutSecs);
      }
      setErrorMessage(
        err.response?.data?.message || 'Gagal mengirim kode verifikasi. Silakan coba kembali.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // STEP 1B: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const otp = otpDigits.join('');
    if (otp.length !== 6) {
      setErrorMessage('Mohon lengkapi 6 digit kode OTP.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await verifyOtp(email.trim().toLowerCase(), otp);
      if (res.registered) {
        navigate('/dashboard');
      } else {
        setOtpVerified(true);
        setCurrentStep(2); // Proceed to PIC Data
      }
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message || 'Kode verifikasi tidak sesuai atau telah kedaluwarsa.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpDigitChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);
    if (value && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pasted)) {
      const digits = pasted.split('');
      setOtpDigits(digits);
      otpInputsRef.current[5]?.focus();
    }
  };

  // Final Registration Submit
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.agreedToTerms) {
      setErrorMessage(
        'Anda wajib menyetujui pernyataan keabsahan dan ketentuan pengajuan DSN-MUI.'
      );
      return;
    }

    setIsLoading(true);
    try {
      await register({
        email: email.trim().toLowerCase(),
        ...formData,
      });

      setSuccessModalOpen(true);
      try {
        confetti({
          particleCount: 75,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {}
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message || 'Gagal mendaftarkan perusahaan. Silakan periksa kembali data Anda.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const formatCountdown = (seconds: number) => {
    if (seconds < 60) return `${seconds} detik`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatLockout = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} menit ${secs.toString().padStart(2, '0')} detik`;
  };

  const stepsList = [
    { num: 1, label: 'Verifikasi Email' },
    { num: 2, label: 'Data Narahubung (PIC)' },
    { num: 3, label: 'Legalitas Perusahaan' },
    { num: 4, label: 'Konfirmasi' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 selection:bg-emerald-700 selection:text-white">
      {/* Top Header & Branding */}
      <div className="max-w-3xl mx-auto text-center mb-8">
        <Link to="/" className="inline-flex items-center gap-3 group mb-4">
          <div className="h-12 w-12 rounded-2xl bg-white dark:bg-slate-900 p-2 shadow-md border border-slate-200 dark:border-slate-800 flex items-center justify-center transition-transform group-hover:scale-105">
            <img src="/images/logo-dsn.png" alt="DSN-MUI" className="h-full w-full object-contain" />
          </div>
          <div className="text-left">
            <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white block">
              AMANAH DSN-MUI
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">
              Portal Pendaftaran Perusahaan Pemohon
            </span>
          </div>
        </Link>

        {/* Step Indicator Progress Bar */}
        <div className="mt-6 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm max-w-2xl mx-auto">
          <div className="grid grid-cols-4 gap-2">
            {stepsList.map((s) => {
              const isActive = currentStep === s.num;
              const isPast = currentStep > s.num;
              return (
                <div key={s.num} className="flex flex-col items-center gap-1.5">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isPast
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : isActive
                        ? 'bg-emerald-700 text-white ring-4 ring-emerald-500/20 shadow'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {isPast ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                  </div>
                  <span
                    className={`text-[10px] sm:text-[11px] text-center font-medium leading-tight line-clamp-1 ${
                      isActive
                        ? 'text-emerald-700 dark:text-emerald-400 font-bold'
                        : isPast
                        ? 'text-slate-800 dark:text-slate-200 font-semibold'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Registration Card */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200/80 dark:border-slate-800 space-y-6">
          
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-xs flex items-start gap-3 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1 leading-relaxed">
                <p>{errorMessage}</p>
                {errorMessage.includes('sudah terdaftar') && (
                  <Link
                    to={`/login?email=${encodeURIComponent(email.trim().toLowerCase())}`}
                    className="inline-flex items-center gap-1 font-bold text-emerald-700 dark:text-emerald-400 underline mt-1.5 hover:text-emerald-800"
                  >
                    Masuk ke Akun Sekarang <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* ── STEP 1: VERIFIKASI EMAIL ── */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200/80 dark:border-emerald-800">
                  Langkah 1 dari 4
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight mt-2.5">
                  Verifikasi Email Resmi Perusahaan
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Masukkan email resmi narahubung (PIC) yang berwenang. Kode verifikasi keamanan akan dikirimkan ke email ini.
                </p>
              </div>

              {!otpSent && !otpVerified ? (
                /* Form Input Email */
                <form onSubmit={handleRequestOtp} className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-2">
                      Alamat Email Resmi Narahubung / Korporasi
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                      <input
                        type="email"
                        required
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="contoh: pic.syariah@lembaga.co.id"
                        className="w-full pl-10 pr-4 py-3 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-emerald-600 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all text-slate-900 dark:text-white"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1.5">
                      Email ini akan menjadi identitas login resmi perusahaan Anda pada portal Amanah DSN-MUI.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={isLoading}
                    className="w-full shadow-md text-sm font-semibold h-12"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Kirim Kode OTP Verifikasi
                  </Button>
                </form>
              ) : (
                /* Form Input 6 Digit OTP */
                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 dark:text-slate-500">Email Tujuan: </span>
                      <strong className="text-slate-900 dark:text-white">{email}</strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setOtpSent(false);
                        setCountdown(0);
                        setOtpDigits(['', '', '', '', '', '']);
                      }}
                      className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold hover:underline"
                    >
                      Ganti
                    </button>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Masukkan 6 Digit Kode OTP
                      </label>
                      {countdown > 0 ? (
                        <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 font-mono">
                          Berlaku: {countdown} dtk
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400">
                          Kode Kedaluwarsa (45 dtk)
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
                      {otpDigits.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={(el) => (otpInputsRef.current[idx] = el)}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                          className="w-11 h-14 sm:w-13 sm:h-16 text-center text-2xl font-black rounded-2xl bg-slate-50 dark:bg-slate-800/90 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-emerald-600 dark:focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-emerald-500/15 focus:outline-none transition-all shadow-sm"
                        />
                      ))}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={isLoading}
                    className="w-full shadow-md text-sm font-semibold h-12"
                    rightIcon={<CheckCircle2 className="w-4 h-4" />}
                  >
                    Verifikasi OTP & Lanjutkan
                  </Button>

                  {/* Helpful delivery tip */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-2 text-left">
                    <Info className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>Tips: Pastikan memeriksa folder <strong>Spam / Promosi / Junk</strong> jika email OTP belum terlihat di kotak masuk utama dalam beberapa detik.</span>
                  </div>

                  <div className="text-center pt-1 space-y-2">
                    {lockoutRemaining > 0 ? (
                      <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-amber-800 dark:text-amber-200 text-xs text-center space-y-1">
                        <p className="font-bold">Batas 3x Pengiriman OTP Tercapai</p>
                        <p className="text-[11px] text-amber-700 dark:text-amber-300">
                          Demi keamanan akun, silakan tunggu <span className="font-bold font-mono text-amber-900 dark:text-amber-100">{formatLockout(lockoutRemaining)}</span> untuk meminta kode baru.
                        </p>
                      </div>
                    ) : countdown > 0 ? (
                      <div>
                        <p className="text-xs text-slate-400 dark:text-slate-500">
                          Belum menerima kode? Kirim ulang dalam{' '}
                          <span className="font-bold text-slate-600 dark:text-slate-300 font-mono">
                            {formatCountdown(countdown)}
                          </span>
                        </p>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                          Pengiriman ke-{otpAttempt} dari 3 (Maksimal 3x)
                        </p>
                      </div>
                    ) : (
                      <div>
                        <button
                          type="button"
                          disabled={isLoading}
                          onClick={handleRequestOtp}
                          className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline inline-flex items-center gap-1.5"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} /> Kirim Ulang Kode OTP
                        </button>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                          Pengiriman ke-{otpAttempt} dari 3 (Maksimal 3x sebelum jeda 5 menit)
                        </p>
                      </div>
                    )}
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ── STEP 2: DATA PIC ── */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200/80 dark:border-emerald-800">
                  Langkah 2 dari 4
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight mt-2.5">
                  Data Penanggung Jawab (PIC)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Informasi narahubung resmi yang bertindak atas nama perusahaan dalam proses permohonan ke DSN-MUI.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
                    Nama Lengkap Narahubung (beserta Gelar) *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={formData.picFullName}
                      onChange={(e) => handleInputChange('picFullName', e.target.value)}
                      placeholder="contoh: Prof. Dr. H. Irfan Hakim, M.E.Sy."
                      className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-emerald-600 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
                      Jabatan di Perusahaan *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.picPosition}
                      onChange={(e) => handleInputChange('picPosition', e.target.value)}
                      placeholder="cth: Direktur Kepatuhan / Head of Sharia"
                      className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-emerald-600 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
                      Nomor Handphone / WhatsApp Aktif *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                      <input
                        type="tel"
                        required
                        value={formData.picPhone}
                        onChange={(e) => handleInputChange('picPhone', e.target.value)}
                        placeholder="0812XXXXXXXX"
                        className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-emerald-600 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <Button variant="outline" size="md" onClick={() => setCurrentStep(1)}>
                  <ArrowLeft className="w-4 h-4 mr-1" /> Kembali
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  disabled={!formData.picFullName || !formData.picPhone}
                  onClick={() => setCurrentStep(3)}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Lanjut ke Data Perusahaan
                </Button>
              </div>
            </div>
          )}

          {/* ── STEP 3: DATA PERUSAHAAN ── */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200/80 dark:border-emerald-800">
                  Langkah 3 dari 4
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight mt-2.5">
                  Profil Legalitas & Domisili Perusahaan
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Lengkapi identitas badan usaha dan alamat domisili resmi pihak pemohon kesesuaian syariah.
                </p>
              </div>

              <div className="space-y-4">
                {/* Bentuk Badan & Nama Perusahaan */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="sm:col-span-1">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
                      Bentuk Badan *
                    </label>
                    <select
                      value={formData.legalType}
                      onChange={(e) => handleInputChange('legalType', e.target.value)}
                      className="w-full px-3 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-emerald-600 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none text-slate-900 dark:text-white cursor-pointer"
                    >
                      <option value="PT">PT</option>
                      <option value="PT Tbk">PT (Tbk)</option>
                      <option value="CV">CV</option>
                      <option value="Koperasi">Koperasi</option>
                      <option value="Yayasan">Yayasan</option>
                      <option value="BUMN/BUMD">BUMN / BUMD</option>
                      <option value="Lembaga">Lembaga Negara</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
                      Nama Resmi Perusahaan / Lembaga *
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={formData.companyName}
                        onChange={(e) => handleInputChange('companyName', e.target.value)}
                        placeholder="contoh: Bank Syariah Berkah Nusantara"
                        className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-emerald-600 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Nomor Legalitas & NPWP */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
                      Nomor Legalitas / NIB / Akta
                    </label>
                    <input
                      type="text"
                      value={formData.legalityNumber}
                      onChange={(e) => handleInputChange('legalityNumber', e.target.value)}
                      placeholder="contoh: AHU-0012345.AH.01.01 atau 1234567890123"
                      className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-emerald-600 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
                      NPWP Perusahaan
                    </label>
                    <input
                      type="text"
                      value={formData.npwp}
                      onChange={(e) => handleInputChange('npwp', e.target.value)}
                      placeholder="00.000.000.0-000.000"
                      className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-emerald-600 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* SECTION: DOMISILI PERUSAHAAN (PILIHAN BERANTAI) */}
                <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60 dark:border-slate-700/60">
                    <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        Domisili Kantor Perusahaan (Pilihan Berantai)
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Pilih wilayah secara bertingkat: Provinsi → Kabupaten/Kota → Kecamatan → Kelurahan.
                      </p>
                    </div>
                  </div>

                  {/* Alamat Jalan / Gedung */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
                      Alamat Kantor Pusat (Gedung / Jalan / Nomor) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="contoh: Menara Mandiri Lt. 21, Jl. Jend. Sudirman Kav. 54-55"
                      className="w-full px-4 py-2.5 text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none text-slate-900 dark:text-white"
                    />
                  </div>

                  {/* Berantai 1: Provinsi & Kabupaten/Kota */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200">
                          Provinsi *
                        </label>
                        {loadingRegional.provinces && (
                          <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
                            <Loader2 className="w-3 h-3 animate-spin" /> Memuat...
                          </span>
                        )}
                      </div>
                      <select
                        value={selectedProvinceId}
                        onChange={(e) => handleProvinceSelect(e.target.value)}
                        className="w-full px-3 py-2.5 text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none text-slate-900 dark:text-white cursor-pointer"
                      >
                        <option value="">-- Pilih Provinsi --</option>
                        {provinces.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200">
                          Kabupaten / Kota *
                        </label>
                        {loadingRegional.regencies && (
                          <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
                            <Loader2 className="w-3 h-3 animate-spin" /> Memuat...
                          </span>
                        )}
                      </div>
                      <select
                        value={selectedRegencyId}
                        onChange={(e) => handleRegencySelect(e.target.value)}
                        disabled={!selectedProvinceId || loadingRegional.regencies}
                        className="w-full px-3 py-2.5 text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none text-slate-900 dark:text-white disabled:opacity-50 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <option value="">
                          {!selectedProvinceId
                            ? 'Pilih Provinsi dahulu'
                            : loadingRegional.regencies
                            ? 'Memuat kabupaten/kota...'
                            : '-- Pilih Kabupaten / Kota --'}
                        </option>
                        {regencies.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Berantai 2: Kecamatan & Kelurahan */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200">
                          Kecamatan *
                        </label>
                        {loadingRegional.districts && (
                          <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
                            <Loader2 className="w-3 h-3 animate-spin" /> Memuat...
                          </span>
                        )}
                      </div>
                      <select
                        value={selectedDistrictId}
                        onChange={(e) => handleDistrictSelect(e.target.value)}
                        disabled={!selectedRegencyId || loadingRegional.districts}
                        className="w-full px-3 py-2.5 text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none text-slate-900 dark:text-white disabled:opacity-50 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <option value="">
                          {!selectedRegencyId
                            ? 'Pilih Kota/Kabupaten dahulu'
                            : loadingRegional.districts
                            ? 'Memuat kecamatan...'
                            : '-- Pilih Kecamatan --'}
                        </option>
                        {districts.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200">
                          Kelurahan / Desa *
                        </label>
                        {loadingRegional.villages && (
                          <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
                            <Loader2 className="w-3 h-3 animate-spin" /> Memuat...
                          </span>
                        )}
                      </div>
                      <select
                        value={selectedVillageId}
                        onChange={(e) => handleVillageSelect(e.target.value)}
                        disabled={!selectedDistrictId || loadingRegional.villages}
                        className="w-full px-3 py-2.5 text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none text-slate-900 dark:text-white disabled:opacity-50 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <option value="">
                          {!selectedDistrictId
                            ? 'Pilih Kecamatan dahulu'
                            : loadingRegional.villages
                            ? 'Memuat kelurahan...'
                            : '-- Pilih Kelurahan / Desa --'}
                        </option>
                        {villages.map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Berantai 3: Kodepos & Nomor Telp Perusahaan */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200">
                          Kode Pos
                        </label>
                        {loadingRegional.postal ? (
                          <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
                            <Loader2 className="w-3 h-3 animate-spin" /> Mencari kodepos...
                          </span>
                        ) : formData.postalCode ? (
                          <span className="text-[10px] text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded font-medium">
                            Otomatis Terisi
                          </span>
                        ) : null}
                      </div>
                      <input
                        type="text"
                        maxLength={6}
                        value={formData.postalCode}
                        onChange={(e) => handleInputChange('postalCode', e.target.value)}
                        placeholder="contoh: 12190"
                        className="w-full px-4 py-2.5 text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none text-slate-900 dark:text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
                        Nomor Telp Perusahaan *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="021-XXXXXXXX / 0811XXXXXXX"
                          className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Website Resmi */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
                    Website Resmi Perusahaan (Opsional)
                  </label>
                  <div className="relative">
                    <Globe className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      placeholder="https://perusahaan.co.id"
                      className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:border-emerald-600 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <Button variant="outline" size="md" onClick={() => setCurrentStep(2)}>
                  <ArrowLeft className="w-4 h-4 mr-1" /> Kembali
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  disabled={
                    !formData.companyName ||
                    !formData.address ||
                    !formData.province ||
                    !formData.city ||
                    !formData.district ||
                    !formData.subdistrict ||
                    !formData.phone
                  }
                  onClick={() => setCurrentStep(4)}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Lanjut ke Konfirmasi
                </Button>
              </div>
            </div>
          )}

          {/* ── STEP 4: KONFIRMASI ── */}
          {currentStep === 4 && (
            <form onSubmit={handleFinalSubmit} className="space-y-6">
              <div>
                <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200/80 dark:border-emerald-800">
                  Langkah 4 dari 4
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight mt-2.5">
                  Konfirmasi & Aktivasi Akun
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Periksa ringkasan data sebelum mengaktifkan akun institusi Anda pada portal Amanah DSN-MUI.
                </p>
              </div>

              {/* Review summary cards */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3.5 text-xs">
                {/* Entitas */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-2.5 border-b border-slate-200 dark:border-slate-700 gap-1">
                  <span className="text-slate-500 dark:text-slate-400">Nama Perusahaan / Lembaga:</span>
                  <span className="font-bold text-sm text-slate-900 dark:text-white">
                    {formData.legalType} {formData.companyName}
                  </span>
                </div>

                {/* Legalitas & NPWP */}
                {(formData.legalityNumber || formData.npwp) && (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-2.5 border-b border-slate-200 dark:border-slate-700 gap-1">
                    <span className="text-slate-500 dark:text-slate-400">NIB / NPWP Perusahaan:</span>
                    <span className="font-medium text-slate-900 dark:text-white font-mono">
                      {formData.legalityNumber || '-'} / {formData.npwp || '-'}
                    </span>
                  </div>
                )}

                {/* Domisili Lengkap */}
                <div className="pb-2.5 border-b border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="text-slate-500 dark:text-slate-400 block">Alamat & Domisili Kantor:</span>
                  <div className="font-medium text-slate-900 dark:text-white leading-relaxed">
                    <p className="font-semibold">{formData.address}</p>
                    <p className="text-slate-600 dark:text-slate-300">
                      Kel. {formData.subdistrict}, Kec. {formData.district}, {formData.city}, {formData.province}{' '}
                      {formData.postalCode ? `(Kodepos: ${formData.postalCode})` : ''}
                    </p>
                  </div>
                </div>

                {/* Telepon Perusahaan & Website */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pb-2.5 border-b border-slate-200 dark:border-slate-700">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">No. Telp Perusahaan:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{formData.phone || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">Website Resmi:</span>
                    <span className="font-semibold text-slate-900 dark:text-white truncate block">
                      {formData.website || '-'}
                    </span>
                  </div>
                </div>

                {/* PIC */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-2.5 border-b border-slate-200 dark:border-slate-700 gap-1">
                  <span className="text-slate-500 dark:text-slate-400">Narahubung (PIC):</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {formData.picFullName} ({formData.picPosition})
                  </span>
                </div>

                {/* Akun Email & HP PIC */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">Email Login Resmi:</span>
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400 font-mono">
                      {email}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block">No. HP PIC:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{formData.picPhone}</span>
                  </div>
                </div>
              </div>

              {/* Legal Checkbox */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    required
                    checked={formData.agreedToTerms}
                    onChange={(e) => handleInputChange('agreedToTerms', e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded border-slate-300 text-emerald-700 focus:ring-emerald-500"
                  />
                  <span className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    Dengan ini kami menyatakan bahwa seluruh data perusahaan dan domisili yang diisi adalah benar, sah, dan bertindak mewakili entitas pemohon yang bersangkutan untuk seluruh korespondensi dan proses pengajuan kesesuaian syariah ke DSN-MUI.
                  </span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <Button variant="outline" size="md" onClick={() => setCurrentStep(3)}>
                  <ArrowLeft className="w-4 h-4 mr-1" /> Kembali
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isLoading}
                  disabled={!formData.agreedToTerms}
                  rightIcon={<CheckCircle2 className="w-4 h-4" />}
                  className="shadow-md text-sm font-semibold h-11"
                >
                  Selesaikan Pendaftaran & Masuk
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* Footer link */}
        <div className="text-center mt-6 text-xs text-slate-500 dark:text-slate-400">
          Sudah memiliki akun terdaftar?{' '}
          <Link to="/login" className="font-bold text-emerald-700 dark:text-emerald-400 hover:underline">
            Masuk di sini
          </Link>
        </div>
      </div>

      {/* ── CELEBRATORY SUCCESS MODAL ── */}
      {successModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="max-w-md w-full rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-inner border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200">
                Pendaftaran Berhasil & Terverifikasi
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-2.5">
                Selamat! Akun Perusahaan Anda Telah Aktif
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                Akun perusahaan <strong>{formData.legalType} {formData.companyName}</strong> telah aktif dan siap digunakan untuk proses pengajuan kesesuaian syariah.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Email Login:</span>
                <strong className="text-slate-900 dark:text-white">{email}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Domisili Kantor:</span>
                <span className="text-slate-900 dark:text-white font-medium">
                  {formData.city}, {formData.province}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">PIC Resmi:</span>
                <span className="text-slate-900 dark:text-white font-medium">{formData.picFullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Metode Masuk:</span>
                <span className="text-emerald-600 font-bold">Passwordless (Email OTP)</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2.5 text-left">
              <Mail className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Email konfirmasi aktivasi dan panduan login telah dikirimkan ke kotak masuk Anda.</span>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full shadow-lg h-11 text-sm font-semibold"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => navigate('/dashboard')}
            >
              Masuk ke Dashboard Portal
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
