import React, { useState } from 'react';
import { VolunteerProfile } from '../types';
import { 
  X, 
  HeartHandshake, 
  Zap, 
  LogIn, 
  UserPlus, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  Phone, 
  User,
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import { healingSound } from '../utils/audioSynthesizer';

interface VolunteerLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  volunteers: VolunteerProfile[];
  onLoginSuccess: (volunteer: VolunteerProfile) => void;
  onGoToRegistration: () => void;
}

export const VolunteerLoginModal: React.FC<VolunteerLoginModalProps> = ({
  isOpen,
  onClose,
  volunteers,
  onLoginSuccess,
  onGoToRegistration,
}) => {
  const [identifier, setIdentifier] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  // Clean phone string for robust comparison (strip hyphens, spaces, country codes)
  const normalizePhone = (p: string) => p.replace(/\D/g, '');

  const handleDemoBypass = () => {
    healingSound.playChime(640, 0.7);
    const demoVolunteer = volunteers[0] || {
      id: 'vol-demo',
      fullName: 'จิตอาสาตัวอย่าง (Demo)',
      nickname: 'ครูนิ่ม',
      age: 42,
      gender: 'female',
      phone: '081-456-7890',
      email: 'demo@readheal.org',
      hospitalZone: 'เครือข่ายโรงพยาบาลจังหวัดชลบุรี',
      availableHospitals: ['โรงพยาบาลชลบุรี', 'โรงพยาบาลมหาวิทยาลัยบูรพา'],
      bio: 'จิตอาสาตัวอย่างสำหรับสาธิตระบบ',
      readingStyle: 'เสียงนุ่มนวล ผ่อนคลาย',
      voiceToneDesc: 'อบอุ่น อ่อนโยน',
      experienceYears: 3,
      rating: 4.95,
      reviewCount: 112,
      totalReadHours: 75,
      totalStoriesRead: 40,
      badge: 'จิตอาสายอดเยี่ยมประจำปี',
      availableDays: ['จันทร์', 'พุธ', 'เสาร์'],
      availableTimeSlots: ['10:00 - 11:30 น.', '14:00 - 15:30 น.'],
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
      status: 'verified',
      specialties: ['นิทาน / เรื่องสั้น', 'จิตวิทยา / กำลังใจ'],
    };

    setSuccessInfo(`เข้าสู่ระบบสาธิตในนาม "${demoVolunteer.nickname || demoVolunteer.fullName}" สำเร็จ`);
    setTimeout(() => {
      onLoginSuccess(demoVolunteer);
    }, 450);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessInfo(null);

    const query = identifier.trim();

    if (!query) {
      setErrorMessage('กรุณาระบุรหัสจิตอาสา หรือ เบอร์โทรศัพท์ที่ลงทะเบียนไว้');
      healingSound.playClickBeep();
      return;
    }

    setIsLoading(true);
    healingSound.playClickBeep();

    setTimeout(() => {
      setIsLoading(false);
      const cleanQuery = query.toLowerCase();
      const cleanPhoneQuery = normalizePhone(query);

      // 1. Check exact ID match (e.g. "vol-1", "vol-2") or numeric ID (e.g. "1")
      let matched = volunteers.find((v) => {
        const vId = v.id.toLowerCase();
        if (vId === cleanQuery) return true;
        if (vId === `vol-${cleanQuery}`) return true;
        return false;
      });

      // 2. Check Phone match
      if (!matched && cleanPhoneQuery.length >= 8) {
        matched = volunteers.find((v) => {
          const vPhone = normalizePhone(v.phone);
          return vPhone === cleanPhoneQuery || vPhone.endsWith(cleanPhoneQuery) || cleanPhoneQuery.endsWith(vPhone);
        });
      }

      // 3. Check Nickname or Full Name or Email match
      if (!matched) {
        matched = volunteers.find((v) => 
          v.nickname?.toLowerCase() === cleanQuery ||
          v.fullName.toLowerCase().includes(cleanQuery) ||
          v.email.toLowerCase() === cleanQuery
        );
      }

      if (matched) {
        healingSound.playChime(720, 0.8);
        setSuccessInfo(`ยินดีต้อนรับคุณ ${matched.nickname || matched.fullName} (${matched.id})`);
        setTimeout(() => {
          onLoginSuccess(matched!);
        }, 500);
      } else {
        healingSound.playClickBeep();
        setErrorMessage(
          `ไม่พบข้อมูลจิตอาสา "${query}" ในระบบ ท่านสามารถตรวจสอบความถูกต้อง หรือกดปุ่ม "⚡ Demo Mode" ด้านบนเพื่อทดลองใช้งานทันที`
        );
      }
    }, 350);
  };

  const handleFillDemo = (demoVal: string) => {
    setIdentifier(demoVal);
    setErrorMessage(null);
    healingSound.playClickBeep();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/55 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-7 shadow-2xl border border-slate-100 my-8 relative animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          aria-label="ปิดหน้าต่าง"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-3.5 mb-5 pr-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-teal-400 text-white flex items-center justify-center shadow-md shadow-sky-200 shrink-0">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 text-xs font-medium border border-sky-200/70 mb-1">
              <Sparkles className="w-3 h-3 text-sky-500" />
              <span>Volunteer Reader Verification</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-800">
              เข้าสู่ระบบจิตอาสานักอ่าน
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              สำหรับอาสาสมัครโครงการเตียงนี้มีเรื่องเล่า เพื่อบันทึกเสียงและดูแลงานอ่านข้างเตียง
            </p>
          </div>
        </div>

        {/* ⚡ SPECIAL PROMINENT BUTTON: DEMO MODE (For professors / evaluators) */}
        <div className="mb-6 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-400/15 to-orange-500/10 border-2 border-amber-400/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              <span>โหมดสาธิตการนำเสนอ (Presentation Fast Track)</span>
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
              ไม่ต้องกรอกข้อมูล
            </span>
          </div>

          <p className="text-xs text-slate-600 mb-3 leading-relaxed">
            ท่านอาจารย์หรือคณะกรรมการสามารถกดปุ่มนี้เพื่อเข้าสู่พอร์ทัลจิตอาสาได้ทันที พร้อมสิทธิ์อัปโหลดและจัดการคลิปเสียงบำบัด
          </p>

          <button
            id="btn-demo-mode-bypass"
            type="button"
            onClick={handleDemoBypass}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-[0.99] text-white font-semibold text-sm shadow-md shadow-amber-200 flex items-center justify-center gap-2 transition-all cursor-pointer group"
          >
            <Zap className="w-4 h-4 fill-white text-white group-hover:scale-110 transition-transform" />
            <span>⚡ สำหรับอาจารย์/ผู้ประเมิน: เข้าสู่ระบบทดลองทันที (Demo Mode)</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center mb-5">
          <div className="border-t border-slate-200 w-full" />
          <span className="bg-white px-3 text-[11px] font-medium text-slate-400 shrink-0 uppercase tracking-wider">
            หรือ เข้าสู่ระบบด้วยบัญชีจริง
          </span>
          <div className="border-t border-slate-200 w-full" />
        </div>

        {/* Regular Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              รหัสจิตอาสา หรือ เบอร์โทรศัพท์ที่ลงทะเบียนไว้ <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                id="input-volunteer-login-id"
                type="text"
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="เช่น vol-1 หรือ 081-456-7890"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 text-sm text-slate-800 placeholder:text-slate-400 transition-all outline-none"
                autoFocus
              />
            </div>
            
            {/* Quick helper test accounts chips */}
            <div className="mt-2 text-[11px] text-slate-500 flex flex-wrap items-center gap-1.5">
              <span className="text-slate-400">คลิกเพื่อลองใส่บัญชีตัวอย่าง:</span>
              <button
                type="button"
                onClick={() => handleFillDemo('081-456-7890')}
                className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-sky-100 hover:text-sky-700 text-slate-600 transition-colors cursor-pointer"
              >
                081-456-7890 (ครูนิ่ม)
              </button>
              <button
                type="button"
                onClick={() => handleFillDemo('vol-2')}
                className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-sky-100 hover:text-sky-700 text-slate-600 transition-colors cursor-pointer"
              >
                vol-2 (หมออาร์ต)
              </button>
              <button
                type="button"
                onClick={() => handleFillDemo('095-778-9901')}
                className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-sky-100 hover:text-sky-700 text-slate-600 transition-colors cursor-pointer"
              >
                095-778-9901 (น้องมายด์)
              </button>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Message */}
          {successInfo && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 flex items-center gap-2 animate-in fade-in duration-150">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span className="font-medium">{successInfo}</span>
            </div>
          )}

          {/* Login / Verify Button */}
          <button
            id="btn-volunteer-verify-submit"
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 active:scale-[0.99] text-white font-semibold text-sm shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>กำลังตรวจสอบข้อมูล...</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>เข้าสู่ระบบ (Login / Verify)</span>
              </>
            )}
          </button>
        </form>

        {/* Link / Option to switch to Volunteer Registration page */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-slate-500 text-center sm:text-left">
            ยังไม่ได้เป็นจิตอาสาของโครงการ?
          </div>
          <button
            id="btn-switch-to-volunteer-registration"
            type="button"
            onClick={() => {
              healingSound.playClickBeep();
              onGoToRegistration();
            }}
            className="inline-flex items-center gap-1.5 text-sky-600 hover:text-sky-700 font-semibold hover:underline cursor-pointer group"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>ลงทะเบียนสมัครจิตอาสาใหม่</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Safe network footer note */}
        <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>ระบบรับรองจิตอาสาข้างเตียง เครือข่าย รพ. 14 แห่งในจังหวัดชลบุรี</span>
        </div>
      </div>
    </div>
  );
};
