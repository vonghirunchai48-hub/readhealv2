import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  Mail, 
  KeyRound, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  BadgeCheck, 
  Sparkles,
  Zap,
  ArrowRight
} from 'lucide-react';
import { healingSound } from '../utils/audioSynthesizer';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (adminData?: { name: string; email: string; hospital: string; roleTitle: string }) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [emailOrStaffId, setEmailOrStaffId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  // Sample official admin accounts for 1-click testing
  const SAMPLE_ACCOUNTS = [
    {
      id: 'acc-1',
      label: 'รพ.ชลบุรี (Admin หลัก)',
      email: 'admin@chonburi-hospital.go.th',
      staffId: 'ADM-6701-CHONBURI',
      name: 'พยาบาลวิชาชีพ กนกวรรณ เมตตารักษ์',
      hospital: 'โรงพยาบาลชลบุรี',
      roleTitle: 'หัวหน้าศูนย์ประสานงานจิตอาสาและเสียงอ่านบำบัด',
      password: 'admin@readheal2026',
    },
    {
      id: 'acc-2',
      label: 'รพ.มหาวิทยาลัยบูรพา',
      email: 'coordinator@buu-hospital.go.th',
      staffId: 'ADM-6702-BUU',
      name: 'พว. ธีรดา บุญรักษา',
      hospital: 'โรงพยาบาลมหาวิทยาลัยบูรพา',
      roleTitle: 'พยาบาลประสานงานผู้ป่วยข้างเตียง',
      password: 'admin@buu2026',
    },
    {
      id: 'acc-3',
      label: 'รพ.บางละมุง',
      email: 'staff.adm@banglamung.moph.go.th',
      staffId: 'ADM-6703-BANGLAMUNG',
      name: 'นายแพทย์ กิตติเดช จิตอาทร',
      hospital: 'โรงพยาบาลบางละมุง',
      roleTitle: 'กรรมการพัฒนาคุณภาพชีวิตผู้ป่วยใน',
      password: 'admin@moph2026',
    },
  ];

  // 1. Presentation Fast Track Handler
  const handlePresentationFastTrack = () => {
    healingSound.playChime(750, 0.8);
    const demoAdmin = SAMPLE_ACCOUNTS[0];
    setSuccessInfo(`⚡ เข้าสู่ระบบสาธิตในนาม "${demoAdmin.name}" (${demoAdmin.hospital}) สำเร็จ!`);
    
    setTimeout(() => {
      onLoginSuccess({
        name: demoAdmin.name,
        email: demoAdmin.email,
        hospital: demoAdmin.hospital,
        roleTitle: demoAdmin.roleTitle,
      });
    }, 450);
  };

  // 2. Sample Tag Autofill Handler
  const handleSelectSampleAccount = (acc: typeof SAMPLE_ACCOUNTS[0]) => {
    healingSound.playClickBeep();
    setEmailOrStaffId(acc.email);
    setPassword(acc.password);
    setErrorMessage(null);
  };

  // 3. Form Submit Login Handler
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessInfo(null);

    const query = emailOrStaffId.trim();
    const pwd = password.trim();

    if (!query) {
      setErrorMessage('กรุณาระบุรหัสเจ้าหน้าที่ (Staff ID) หรืออีเมลประจำโรงพยาบาล');
      healingSound.playClickBeep();
      return;
    }

    if (!pwd) {
      setErrorMessage('กรุณาระบุรหัสผ่านความปลอดภัย (Security Password)');
      healingSound.playClickBeep();
      return;
    }

    setIsLoading(true);
    healingSound.playClickBeep();

    setTimeout(() => {
      setIsLoading(false);

      // Match sample or allow any hospital domain / admin credentials
      const matched = SAMPLE_ACCOUNTS.find(
        (acc) =>
          acc.email.toLowerCase() === query.toLowerCase() ||
          acc.staffId.toLowerCase() === query.toLowerCase()
      );

      if (matched) {
        if (pwd === matched.password || pwd === 'admin' || pwd === '1234' || pwd.length >= 4) {
          healingSound.playChime(720, 0.8);
          setSuccessInfo(`ยืนยันตัวตนสำเร็จ: ยินดีต้อนรับ ${matched.name} (${matched.hospital})`);
          setTimeout(() => {
            onLoginSuccess({
              name: matched.name,
              email: matched.email,
              hospital: matched.hospital,
              roleTitle: matched.roleTitle,
            });
          }, 450);
          return;
        } else {
          setErrorMessage('รหัสผ่านไม่ถูกต้อง โปรดตรวจสอบรหัสผ่านอีกครั้ง');
          healingSound.playClickBeep();
          return;
        }
      }

      // Generic valid format acceptance for production simulation
      const isHospitalEmail = query.includes('@') && (query.includes('.go.th') || query.includes('hospital') || query.includes('moph'));
      const isStaffId = query.toUpperCase().startsWith('ADM-') || query.length >= 4;

      if (isHospitalEmail || isStaffId) {
        healingSound.playChime(720, 0.8);
        setSuccessInfo(`เข้าสู่ระบบสำเร็จ: ผู้ดูแลระบบโรงพยาบาล (${query})`);
        setTimeout(() => {
          onLoginSuccess({
            name: 'เจ้าหน้าที่ผู้ดูแลระบบ (Admin รพ.ชลบุรี)',
            email: query,
            hospital: 'โรงพยาบาลชลบุรี',
            roleTitle: 'ผู้ประสานงานโครงการเตียงนี้มีเรื่องเล่า',
          });
        }, 450);
      } else {
        setErrorMessage(
          'ไม่พบบัญชีผู้ดูแลนี้ในระบบ กรุณาใช้อีเมลเครือข่ายกระทรวงสาธารณสุข (@*.go.th) หรือรหัสเจ้าหน้าที่ เช่น ADM-6701-CHONBURI (หรือเลือกแท็กบัญชีตัวอย่างด้านล่าง)'
        );
        healingSound.playClickBeep();
      }
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/65 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-purple-100 my-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          title="ปิดหน้าต่าง"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-slate-100">
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-purple-700 via-indigo-700 to-sky-700 text-white flex items-center justify-center shrink-0 shadow-md shadow-purple-600/25 ring-4 ring-purple-100">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                Hospital Intranet Security Gateway
              </span>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium flex items-center gap-1 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                256-bit SSL
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              เข้าสู่ระบบผู้ดูแล (Admin Portal)
            </h2>
            <p className="text-xs text-slate-500">
              เครือข่ายโรงพยาบาลจังหวัดชลบุรี 14 แห่ง • โครงการเตียงนี้มีเรื่องเล่า
            </p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* REQUIREMENT 1: PROMINENT PRESENTATION FAST TRACK BOX */}
        {/* ========================================================================= */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100/60 border-2 border-amber-300/90 shadow-sm relative overflow-hidden group">
          <div className="flex items-start justify-between gap-3 mb-2.5">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs sm:text-sm">
              <Zap className="w-4 h-4 text-amber-600 fill-amber-500 shrink-0 animate-bounce" />
              <span>โหมดสาธิตการประเมินผล (Presentation Fast Track)</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-200/80 text-amber-950 border border-amber-300">
              สำหรับกรรมการ
            </span>
          </div>

          <p className="text-xs text-amber-900/90 mb-3 leading-relaxed">
            ข้ามการกรอกรหัสผ่านเพื่อทดสอบระบบจับคู่ (Matching), ตรวจอนุมัติไฟล์เสียง MP3, และอนุมัติเกียรติบัตรจิตอาสาได้ทันที
          </p>

          <button
            id="btn-admin-presentation-fast-track"
            type="button"
            onClick={handlePresentationFastTrack}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-orange-500/25 hover:shadow-lg hover:shadow-orange-500/35 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-99"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>⚡ สำหรับอาจารย์/ผู้ประเมิน: เข้าสู่ระบบแอดมินทันที (Admin Demo Mode)</span>
          </button>
        </div>

        {/* Feedback Messages */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successInfo && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{successInfo}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* REQUIREMENT 2 & 4: OFFICIAL FORM FIELDS & PROFESSIONAL LOGIN BUTTON */}
        {/* ========================================================================= */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>รหัสเจ้าหน้าที่ หรือ อีเมลโรงพยาบาล (Staff ID / Hospital Email) <span className="text-rose-500">*</span></span>
              <span className="text-[11px] font-normal text-slate-400">เช่น @*.go.th</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={emailOrStaffId}
                onChange={(e) => setEmailOrStaffId(e.target.value)}
                placeholder="เช่น admin@chonburi-hospital.go.th หรือ ADM-6701-CHONBURI"
                className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500 transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>รหัสผ่านความปลอดภัย (Security Password) <span className="text-rose-500">*</span></span>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] text-purple-600 hover:text-purple-800 transition-colors cursor-pointer flex items-center gap-1"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}</span>
              </button>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="กรอกรหัสผ่านประจำตัวเจ้าหน้าที่"
                className="w-full text-xs sm:text-sm pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500 transition-all font-mono"
                required
              />
            </div>
          </div>

          {/* Professional Primary Login Button */}
          <button
            id="btn-admin-submit-login"
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 hover:from-purple-800 hover:to-indigo-800 text-white font-bold text-xs sm:text-sm shadow-md shadow-purple-600/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>ยืนยันเข้าสู่ระบบผู้ดูแล (Hospital Admin Sign In)</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </form>

        {/* ========================================================================= */}
        {/* REQUIREMENT 3: QUICK SAMPLE ACCOUNT TAGS FOR EASY 1-CLICK TESTING */}
        {/* ========================================================================= */}
        <div className="mt-5 pt-4 border-t border-slate-100 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-purple-600" />
              <span>บัญชีตัวอย่างเจ้าหน้าที่ประจำโรงพยาบาล (คลิกเพื่อกรอกอัตโนมัติ):</span>
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {SAMPLE_ACCOUNTS.map((acc) => (
              <div
                key={acc.id}
                onClick={() => handleSelectSampleAccount(acc)}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-purple-50/70 border border-slate-200 hover:border-purple-200 text-left transition-all cursor-pointer group flex items-center justify-between"
                title={`คลิกเพื่อกรอกข้อมูลบัญชี ${acc.name}`}
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-800 group-hover:text-purple-900">
                      {acc.label}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      • {acc.staffId}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono">
                    {acc.email}
                  </p>
                </div>

                <span className="text-[11px] text-purple-600 font-semibold group-hover:underline flex items-center gap-1 shrink-0">
                  <span>เลือกบัญชีนี้</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Internal Security Policy Notice (NO REGISTRATION LINK as requested) */}
        <div className="mt-5 pt-3 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400 leading-relaxed">
            🔒 <strong className="text-slate-600 font-semibold">ข้อบังคับความปลอดภัย:</strong> สงวนสิทธิ์การเข้าใช้งานเฉพาะบุคลากรทางการแพทย์ที่ได้รับมอบหมายเท่านั้น 
            ไม่อนุญาตให้บุคคลภายนอกลงทะเบียนด้วยตนเอง หากยังไม่มีบัญชีโปรดติดต่อศูนย์ประสานงานสารสนเทศ รพ.ชลบุรี (โทร. 038-933-900)
          </p>
        </div>
      </div>
    </div>
  );
};
