import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import {
  Mail,
  ArrowRight,
  ShieldCheck,
  KeyRound,
  RefreshCw,
  Building2,
  AlertCircle,
  CheckCircle2,
  Lock,
  ArrowLeft,
  FileCheck,
  Sparkles,
  Info,
} from 'lucide-react';
import { DSN_SERVICES } from '../data/dsnServices';

export const LoginPage: React.FC = () => {
  const { requestOtp, verifyOtp, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'EMAIL' | 'OTP'>('EMAIL');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [otpAttempt, setOtpAttempt] = useState(1);
  const [lockoutRemaining, setLockoutRemaining] = useState(0);

  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

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

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMessage('Mohon masukkan alamat email yang valid.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await requestOtp(cleanEmail, 'LOGIN');
      setStep('OTP');
      setCountdown(45);
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
        err.response?.data?.message || 'Gagal mengirimkan kode verifikasi. Silakan coba kembali.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);

    // Auto-advance to next input
    if (value && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
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
        // Not registered -> direct to registration
        navigate(`/register?email=${encodeURIComponent(email.trim().toLowerCase())}&otpVerified=true`);
      }
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message || 'Kode verifikasi tidak sesuai atau telah kedaluwarsa.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || lockoutRemaining > 0 || isLoading) return;
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await requestOtp(email.trim().toLowerCase(), 'LOGIN');
      setCountdown(45);
      if (res.attempt) {
        setOtpAttempt(res.attempt);
      }
      setLockoutRemaining(0);
      setOtpDigits(['', '', '', '', '', '']);
      otpInputsRef.current[0]?.focus();
    } catch (err: any) {
      const serverCode = err.response?.data?.code;
      const lockoutSecs = err.response?.data?.lockoutSeconds;
      if (serverCode === 'OTP_LIMIT_REACHED' && lockoutSecs) {
        setLockoutRemaining(lockoutSecs);
      }
      setErrorMessage(
        err.response?.data?.message || 'Gagal mengirim ulang kode OTP. Silakan coba beberapa saat lagi.'
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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 sm:p-6 lg:p-8 selection:bg-emerald-700 selection:text-white">
      {/* Container with institutional Card Layout */}
      <div className="w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden grid grid-cols-1 lg:grid-cols-12 transition-all">
        
        {/* ── LEFT PANEL: INSTITUTIONAL BRANDING (5 Cols) ── */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#004d25] via-[#006633] to-[#00381a] p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Islamic Motif Background Overlay */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:20px_20px]" />
          <div className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full bg-[#d4af37]/10 blur-2xl pointer-events-none" />

          {/* Top Logo & Institution Name */}
          <div className="relative z-10 space-y-5">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="h-12 w-12 rounded-2xl bg-white p-2 shadow-md flex items-center justify-center transition-transform group-hover:scale-105">
                <img
                  src="/images/logo-dsn.png"
                  alt="Logo DSN-MUI"
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="text-left">
                <span className="text-lg font-black tracking-tight text-white block">
                  AMANAH
                </span>
                <span className="text-[11px] text-emerald-200 font-medium tracking-wide block uppercase">
                  DSN-MUI Public Portal
                </span>
              </div>
            </Link>

            <div className="pt-3 border-t border-white/15">
              <span className="inline-block text-[11px] font-semibold text-emerald-300 uppercase tracking-widest mb-1">
                Portal Layanan Terpadu
              </span>
              <h1 className="text-lg sm:text-xl font-bold leading-snug tracking-tight text-white">
                Dewan Syariah Nasional – Majelis Ulama Indonesia
              </h1>
              <p className="text-xs text-emerald-100/85 mt-1.5 leading-relaxed">
                Kanal digital satu pintu bagi korporasi dan lembaga pemohon kepatuhan & opini syariah.
              </p>
            </div>
          </div>

          {/* ── 9 LAYANAN RESMI DSN-MUI SHOWCASE ── */}
          <div className="relative z-10 my-6 p-4 rounded-2xl bg-black/20 backdrop-blur-md border border-white/15 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-accent uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                9 Layanan Terpadu
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/10 text-emerald-200 border border-white/10">
                1 Akun PIC
              </span>
            </div>
            <p className="text-[11px] text-emerald-100/80 leading-tight">
              Akses instan setelah login untuk permohonan resmi:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
              {DSN_SERVICES.map((srv, idx) => (
                <div
                  key={srv.code}
                  className="flex items-center gap-2 p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-[11px] text-emerald-100 transition-colors"
                  title={srv.name}
                >
                  <div className="w-4 h-4 rounded-md bg-emerald-500/30 text-emerald-200 flex items-center justify-center text-[9px] font-bold flex-shrink-0">
                    {idx + 1}
                  </div>
                  <span className="truncate font-medium">{srv.shortTitle}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Value Props & Trust Badges */}
          <div className="relative z-10 space-y-2.5 text-xs">
            <div className="flex items-start gap-2.5 bg-white/10 backdrop-blur-md p-2.5 rounded-xl border border-white/10">
              <ShieldCheck className="w-4 h-4 text-emerald-300 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-bold text-white text-[11px]">Keamanan Tanpa Password</p>
                <p className="text-[10px] text-emerald-100/80 leading-tight">
                  Verifikasi kode OTP dikirim langsung ke email resmi narahubung terdaftar.
                </p>
              </div>
            </div>
          </div>

          {/* Footer Secretariat */}
          <div className="relative z-10 pt-4 border-t border-white/15 text-[11px] text-emerald-200/80 space-y-0.5">
            <p className="font-semibold text-white">Sekretariat DSN-MUI Pusat</p>
            <p>Gedung Majelis Ulama Indonesia, Jl. Proklamasi No. 51, Jakarta</p>
          </div>
        </div>

        {/* ── RIGHT PANEL: INTERACTIVE FORM (7 Cols) ── */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
          {errorMessage && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-xs flex items-start gap-3 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1 leading-relaxed">
                <p>{errorMessage}</p>
                {errorMessage.includes('belum terdaftar') && (
                  <Link
                    to={`/register?email=${encodeURIComponent(email.trim().toLowerCase())}`}
                    className="inline-flex items-center gap-1 font-bold text-emerald-700 dark:text-emerald-400 underline mt-1.5 hover:text-emerald-800"
                  >
                    Daftar Akun Perusahaan Baru Sekarang <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          )}

          {step === 'EMAIL' ? (
            /* ── STEP 1: INPUT EMAIL ── */
            <div className="space-y-6">
              <div>
                <span className="text-[11px] font-bold text-primary dark:text-emerald-400 uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200/80 dark:border-emerald-800">
                  Akses Portal Pemohon
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-3">
                  Masuk ke Akun Perusahaan
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Masukkan alamat email resmi narahubung (PIC) yang terdaftar untuk menerima kode verifikasi OTP.
                </p>
              </div>

              <form onSubmit={handleRequestOtp} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-2">
                    Alamat Email Resmi Perusahaan / PIC
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
                    Sistem akan mengirimkan 6 digit kode sandi satu kali pakai (OTP) ke email ini.
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
                  Kirim Kode Akses (OTP)
                </Button>
              </form>

              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs gap-3">
                <span className="text-slate-500 dark:text-slate-400">
                  Perusahaan belum terdaftar?
                </span>
                <Link
                  to="/register"
                  className="font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 hover:underline inline-flex items-center gap-1"
                >
                  Daftarkan Perusahaan Pemohon <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            /* ── STEP 2: INPUT OTP ── */
            <div className="space-y-6">
              <div>
                <button
                  type="button"
                  onClick={() => {
                    setStep('EMAIL');
                    setErrorMessage(null);
                  }}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors mb-3"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Ganti Alamat Email
                </button>

                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Verifikasi Kode Akses
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Masukkan 6 digit kode keamanan yang telah dikirimkan ke:
                </p>
                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200">
                  <Mail className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>{email}</span>
                </div>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Kode Verifikasi (6 Digit)
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

                  {/* 6 Digit Discrete Input Cells */}
                  <div className="flex items-center justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
                    {otpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => (otpInputsRef.current[idx] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(idx, e)}
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
                  Verifikasi & Masuk ke Portal
                </Button>

                {/* Helpful delivery tip */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-2 text-left">
                  <Info className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Tips: Pastikan memeriksa folder <strong>Spam / Promosi / Junk</strong> jika email OTP belum terlihat di kotak masuk utama dalam beberapa detik.</span>
                </div>

                {/* Resend Action Area */}
                <div className="text-center pt-2 space-y-2">
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
                        onClick={handleResend}
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
