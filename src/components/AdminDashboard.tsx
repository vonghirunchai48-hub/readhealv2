import React, { useState } from 'react';
import { 
  BookingRequest, 
  VolunteerProfile, 
  Story, 
  AudioSubmission,
  AudioErrorReport,
  VolunteerAvailabilitySlot,
  ServiceEvaluation,
  CertificateRequest,
  VolunteerWarning
} from '../types';
import { 
  ShieldCheck, 
  Users, 
  Calendar, 
  Clock, 
  Search, 
  FileAudio, 
  ThumbsUp, 
  ThumbsDown, 
  CheckCircle2, 
  AlertCircle, 
  Filter, 
  Award, 
  BookOpen, 
  Check, 
  X, 
  Star, 
  AlertTriangle, 
  Mail, 
  ArrowLeft,
  Volume2,
  VolumeX,
  MessageSquare,
  Sparkles,
  Eye,
  Building2,
  CalendarCheck,
  Send,
  ExternalLink
} from 'lucide-react';
import { healingSound } from '../utils/audioSynthesizer';
import { CHONBURI_HOSPITALS, CHONBURI_DISTRICTS } from '../data/chonburiHospitals';
import { Html5AudioPlayer } from './Html5AudioPlayer';

interface AdminDashboardProps {
  bookings: BookingRequest[];
  onUpdateBookingStatus: (id: string, newStatus: 'confirmed' | 'pending' | 'completed' | 'cancelled') => void;
  volunteers: VolunteerProfile[];
  stories: Story[];
  onViewVolunteer: (vol: VolunteerProfile) => void;
  audioSubmissions?: AudioSubmission[];
  onApproveSubmission?: (id: string, adminNotes?: string) => void;
  onRejectSubmission?: (id: string, reason: string, adminNotes?: string) => void;
  onResetToLanding?: () => void;
  audioErrorReports?: AudioErrorReport[];
  onResolveErrorReport?: (reportId: string, resolutionNotes: string) => void;
  availabilitySlots?: VolunteerAvailabilitySlot[];
  onConfirmMatch?: (bookingId: string, slotId: string) => void;
  evaluations?: ServiceEvaluation[];
  onIssueWarning?: (volunteerId: string, volunteerName: string, reason: string, severity: 'advisory' | 'warning' | 'critical') => void;
  certificateRequests?: CertificateRequest[];
  onApproveCertificate?: (requestId: string) => void;
  onRejectCertificate?: (requestId: string, reason: string) => void;
  onViewCertificate?: (certificate: CertificateRequest) => void;
  currentAdmin?: { name: string; email: string; hospital: string; roleTitle: string } | null;
  onAdminLogout?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  bookings,
  onUpdateBookingStatus,
  volunteers,
  stories,
  onViewVolunteer,
  audioSubmissions = [],
  onApproveSubmission,
  onRejectSubmission,
  onResetToLanding,
  audioErrorReports = [],
  onResolveErrorReport,
  availabilitySlots = [],
  onConfirmMatch,
  evaluations = [],
  onIssueWarning,
  certificateRequests = [],
  onApproveCertificate,
  onRejectCertificate,
  onViewCertificate,
  currentAdmin,
  onAdminLogout,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    'matching' | 'audio-reviews' | 'audio-reports' | 'evaluations' | 'certificates' | 'bookings' | 'volunteers' | 'stories'
  >('matching');

  // Filters
  const [bookingFilter, setBookingFilter] = useState<'all' | 'confirmed' | 'pending' | 'completed' | 'cancelled'>('all');
  const [hospitalFilter, setHospitalFilter] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState('');

  // Audio Review state
  const [audioReviewFilter, setAudioReviewFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [rejectModalSubmission, setRejectModalSubmission] = useState<AudioSubmission | null>(null);
  const [selectedStandardReason, setSelectedStandardReason] = useState<string>('มีเสียงรบกวนมากเกินไป');
  const [customRejectionText, setCustomRejectionText] = useState<string>('');
  const [adminNoteText, setAdminNoteText] = useState<string>('');

  // Error Report Resolution Modal State
  const [resolvingReport, setResolvingReport] = useState<AudioErrorReport | null>(null);
  const [reportResolutionText, setReportResolutionText] = useState<string>('');

  // Matching Selection State
  const [selectedPatientBookingId, setSelectedPatientBookingId] = useState<string | null>(null);
  const [selectedVolunteerSlotId, setSelectedVolunteerSlotId] = useState<string | null>(null);

  // Warning Modal State
  const [warningVolunteer, setWarningVolunteer] = useState<VolunteerProfile | null>(null);
  const [warningReason, setWarningReason] = useState<string>('');
  const [warningSeverity, setWarningSeverity] = useState<'advisory' | 'warning' | 'critical'>('warning');

  // Certificate Reject Modal State
  const [rejectingCert, setRejectingCert] = useState<CertificateRequest | null>(null);
  const [certRejectionReason, setCertRejectionReason] = useState<string>('ชั่วโมงหรือจำนวนไฟล์เสียงยังไม่ครบถ้วนตามเกณฑ์ 5 ไฟล์ / 3 ครั้ง');

  // Success Feedback Message
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Metrics
  const pendingAudioCount = audioSubmissions.filter((s) => s.status === 'pending').length;
  const pendingBookingsCount = bookings.filter((b) => b.status === 'pending').length;
  const pendingReportsCount = audioErrorReports.filter((r) => r.status === 'pending').length;
  const pendingCertsCount = certificateRequests.filter((c) => c.status === 'pending').length;

  const triggerSuccessMsg = (msg: string) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(null), 4500);
  };

  // Standard rejection reasons (Requirement 1 & 2)
  const standardRejectionReasons = [
    'มีเสียงรบกวนมากเกินไป',
    'มีการเว้นวรรคระหว่างการอ่านนานเกินไป',
    'ไฟล์เสียงเกิดปัญหาไม่สามารถเปิดได้',
    'ไม่มีเสียง',
    'ระดับเสียงเบาเกินไป ไม่ได้มาตรฐานข้างเตียง',
    'เนื้อหาไม่เหมาะสมกับการบำบัดฟื้นฟูผู้ป่วย',
    'เหตุผลอื่นๆ (ระบุเพิ่มเติมด้านล่าง)',
  ];

  // Handle Audio Rejection submit
  const handleConfirmAudioReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectModalSubmission || !onRejectSubmission) return;

    healingSound.playClickBeep();
    const finalReason = selectedStandardReason === 'เหตุผลอื่นๆ (ระบุเพิ่มเติมด้านล่าง)'
      ? customRejectionText.trim()
      : customRejectionText.trim()
        ? `${selectedStandardReason} (${customRejectionText.trim()})`
        : selectedStandardReason;

    onRejectSubmission(rejectModalSubmission.id, finalReason, adminNoteText.trim());
    triggerSuccessMsg(`ปฏิเสธไฟล์เสียง "${rejectModalSubmission.title}" พร้อมแจ้งเหตุผลไปยังจิตอาสาเรียบร้อยแล้ว`);
    setRejectModalSubmission(null);
    setCustomRejectionText('');
    setAdminNoteText('');
  };

  // Handle Audio Approval
  const handleApproveAudio = (sub: AudioSubmission) => {
    if (!onApproveSubmission) return;
    healingSound.playChime(720, 0.8);
    const praise = prompt(
      `ยืนยันการอนุมัติและเผยแพร่ไฟล์เสียง "${sub.title}"\nกรอกคำชมเชยแด่จิตอาสา (ถ้ามี):`,
      'ผ่านการตรวจสอบคุณภาพเสียงและการอ่านเรียบร้อยแล้ว ได้มาตรฐานโรงพยาบาลชลบุรี'
    );
    if (praise !== null) {
      onApproveSubmission(sub.id, praise);
      triggerSuccessMsg(`อนุมัติและเผยแพร่ไฟล์เสียง "${sub.title}" สู่ผู้ป่วย 14 รพ. เรียบร้อยแล้ว!`);
    }
  };

  // Handle Confirm Matching (Requirement 4)
  const handleExecuteMatch = () => {
    if (!selectedPatientBookingId || !selectedVolunteerSlotId || !onConfirmMatch) return;
    healingSound.playChime(640, 0.6);
    onConfirmMatch(selectedPatientBookingId, selectedVolunteerSlotId);
    triggerSuccessMsg('จับคู่และยืนยันการนัดหมายสำเร็จ! ส่งอีเมลและการแจ้งเตือนถึงผู้ป่วยและจิตอาสาแล้ว');
    setSelectedPatientBookingId(null);
    setSelectedVolunteerSlotId(null);
  };

  // Handle Resolve Audio Report (Requirement 2)
  const handleConfirmResolveReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvingReport || !onResolveErrorReport) return;

    healingSound.playChime(640, 0.6);
    onResolveErrorReport(
      resolvingReport.id,
      reportResolutionText.trim() || 'ทีมงานได้แก้ไขไฟล์เสียงเรียบร้อยแล้ว ขอบคุณสำหรับการแจ้งปัญหาเพื่อผู้ป่วยค่ะ'
    );
    triggerSuccessMsg(`ทำเครื่องหมายแก้ไขปัญหา "${resolvingReport.storyTitle}" และส่งข้อความขอบคุณผู้แจ้งแล้ว`);
    setResolvingReport(null);
    setReportResolutionText('');
  };

  // Handle Issue Warning (Requirement 5)
  const handleConfirmWarning = (e: React.FormEvent) => {
    e.preventDefault();
    if (!warningVolunteer || !warningReason.trim() || !onIssueWarning) return;

    healingSound.playClickBeep();
    onIssueWarning(warningVolunteer.id, warningVolunteer.fullName, warningReason.trim(), warningSeverity);
    triggerSuccessMsg(`ออกหนังสือแจ้งเตือนไปยัง ${warningVolunteer.fullName} เรียบร้อยแล้ว`);
    setWarningVolunteer(null);
    setWarningReason('');
  };

  // Handle Certificate Actions (Requirement 6)
  const handleConfirmRejectCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingCert || !onRejectCertificate) return;

    healingSound.playClickBeep();
    onRejectCertificate(rejectingCert.id, certRejectionReason.trim());
    triggerSuccessMsg(`ปฏิเสธคำขอเกียรติบัตรและส่งอีเมลแจ้งเหตุผลไปยัง ${rejectingCert.email} แล้ว`);
    setRejectingCert(null);
  };

  // Filter pending patient requests and available slots
  const pendingRequests = bookings.filter((b) => b.status === 'pending');
  const availableSlots = availabilitySlots.filter((s) => !s.isBooked);

  return (
    <div className="space-y-6 sm:space-y-8 pb-16 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Header Back Button / Return to Role Selection Gateway */}
      {onResetToLanding && (
        <div className="flex items-center justify-between">
          <button
            onClick={onResetToLanding}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/90 text-purple-900 hover:text-purple-950 text-xs sm:text-sm font-semibold transition-all shadow-2xs group cursor-pointer"
            title="กลับสู่หน้าเลือกบทบาท (Role Selection Gateway)"
          >
            <ArrowLeft className="w-4 h-4 text-purple-600 group-hover:-translate-x-0.5 transition-transform" />
            <span>← กลับสู่หน้าเลือกบทบาท (Patient, Volunteer, Admin)</span>
          </button>
          <span className="text-xs text-purple-700 bg-purple-50 border border-purple-200 px-3 py-1 rounded-full font-medium hidden sm:inline">
            ผู้ดูแลระบบโรงพยาบาล (Hospital Administrator)
          </span>
        </div>
      )}

      {/* Success Toast Banner */}
      {actionSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{actionSuccessMsg}</span>
          </div>
          <button
            onClick={() => setActionSuccessMsg(null)}
            className="text-emerald-600 hover:text-emerald-800 text-xs font-semibold px-2 py-1"
          >
            ปิด
          </button>
        </div>
      )}

      {/* Admin Header Banner */}
      <div className="bg-gradient-to-r from-purple-800 via-indigo-800 to-sky-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-semibold mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>ศูนย์ควบคุมและประสานงานจิตอาสาโรงพยาบาล (Hospital Admin Hub)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold">
              ระบบบริหารจัดการโครงการ "เตียงนี้มีเรื่องเล่า"
            </h1>
            <p className="text-purple-100 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              ประสานการจับคู่นัดหมายข้างเตียง ตรวจสอบคุณภาพไฟล์เสียงอ่าน MP3 จัดการรายงานข้อผิดพลาด 
              และอนุมัติเกียรติบัตรรับรองแก่จิตอาสาเครือข่าย 14 โรงพยาบาลในจังหวัดชลบุรี
            </p>

            {currentAdmin && (
              <div className="mt-3 inline-flex flex-wrap items-center gap-2 px-3 py-1.5 rounded-xl bg-white/15 backdrop-blur-xs text-xs text-white border border-white/20">
                <Building2 className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span>เจ้าหน้าที่: <strong className="text-amber-200">{currentAdmin.name}</strong> • {currentAdmin.hospital}</span>
                {onAdminLogout && (
                  <button
                    onClick={onAdminLogout}
                    className="ml-2 text-purple-200 hover:text-white underline hover:no-underline text-[11px] cursor-pointer"
                  >
                    ออกจากระบบแอดมิน
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="bg-white/10 backdrop-blur-xs border border-white/20 rounded-2xl p-3 text-center min-w-[75px]">
              <span className="text-2xl font-bold block">{pendingBookingsCount}</span>
              <span className="text-[10px] text-purple-200">รอนัดหมาย</span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs border border-white/20 rounded-2xl p-3 text-center min-w-[75px]">
              <span className="text-2xl font-bold block text-amber-300">{pendingAudioCount}</span>
              <span className="text-[10px] text-purple-200">รอตรวจเสียง</span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs border border-white/20 rounded-2xl p-3 text-center min-w-[75px]">
              <span className="text-2xl font-bold block text-sky-300">{pendingCertsCount}</span>
              <span className="text-[10px] text-purple-200">ขอเกียรติบัตร</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-white/20 overflow-x-auto no-scrollbar text-xs font-semibold">
          <button
            onClick={() => setActiveSubTab('matching')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeSubTab === 'matching'
                ? 'bg-white text-purple-900 shadow-xs'
                : 'text-white/80 hover:bg-white/10'
            }`}
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>จับคู่การนัดหมาย (Matching)</span>
            {pendingRequests.length > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-400 text-purple-950 rounded-full text-[10px] font-bold">
                {pendingRequests.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSubTab('audio-reviews')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeSubTab === 'audio-reviews'
                ? 'bg-white text-purple-900 shadow-xs'
                : 'text-white/80 hover:bg-white/10'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>ตรวจไฟล์เสียงอ่าน (Audio Review)</span>
            {pendingAudioCount > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-400 text-purple-950 rounded-full text-[10px] font-bold animate-pulse">
                {pendingAudioCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSubTab('audio-reports')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeSubTab === 'audio-reports'
                ? 'bg-white text-purple-900 shadow-xs'
                : 'text-white/80 hover:bg-white/10'
            }`}
          >
            <VolumeX className="w-3.5 h-3.5" />
            <span>รายงานปัญหาไฟล์เสียง ({audioErrorReports.length})</span>
            {pendingReportsCount > 0 && (
              <span className="px-1.5 py-0.2 bg-rose-400 text-white rounded-full text-[10px] font-bold">
                {pendingReportsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSubTab('evaluations')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeSubTab === 'evaluations'
                ? 'bg-white text-purple-900 shadow-xs'
                : 'text-white/80 hover:bg-white/10'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>ฐานข้อมูลการประเมิน & เตือนจิตอาสา</span>
          </button>

          <button
            onClick={() => setActiveSubTab('certificates')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeSubTab === 'certificates'
                ? 'bg-white text-purple-900 shadow-xs'
                : 'text-white/80 hover:bg-white/10'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>คำขอเกียรติบัตร ({certificateRequests.length})</span>
            {pendingCertsCount > 0 && (
              <span className="px-1.5 py-0.2 bg-sky-300 text-purple-950 rounded-full text-[10px] font-bold">
                {pendingCertsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSubTab('bookings')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeSubTab === 'bookings'
                ? 'bg-white text-purple-900 shadow-xs'
                : 'text-white/80 hover:bg-white/10'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>รายการนัดหมายทั้งหมด ({bookings.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('volunteers')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeSubTab === 'volunteers'
                ? 'bg-white text-purple-900 shadow-xs'
                : 'text-white/80 hover:bg-white/10'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>ทำเนียบจิตอาสา ({volunteers.length})</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODULE 4: MATCHING & SCHEDULE CONTROL (Side-by-side comparative blocks)   */}
      {/* ========================================================================= */}
      {activeSubTab === 'matching' && (
        <div className="space-y-6">
          {/* Action Header Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                ระบบจับคู่คำขออ่านหนังสือข้างเตียง
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mt-2">
                เปรียบเทียบคำขอของผู้ป่วยและเวลาว่างของจิตอาสา (Side-by-Side Matching)
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                เลือกคำขอของผู้ป่วยจากฝั่งซ้าย และเลือกช่วงเวลาว่างของจิตอาสาจากฝั่งขวา จากนั้นกดปุ่ม "จับคู่และยืนยันการนัดหมาย"
              </p>
            </div>

            <button
              onClick={handleExecuteMatch}
              disabled={!selectedPatientBookingId || !selectedVolunteerSlotId}
              className={`px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ${
                selectedPatientBookingId && selectedVolunteerSlotId
                  ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-600 hover:from-purple-700 hover:to-sky-700 text-white shadow-purple-500/25 scale-102'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
              }`}
            >
              <CalendarCheck className="w-4 h-4" />
              <span>ยืนยันการจับคู่ (Confirm Match)</span>
            </button>
          </div>

          {/* Side by side comparison layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LEFT COLUMN: Pending Patient Requests */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <h3 className="font-bold text-sm text-slate-800">
                    คำขอของผู้ป่วยที่รอการจับคู่ ({pendingRequests.length})
                  </h3>
                </div>
                <span className="text-xs text-slate-400">คลิกการ์ดเพื่อเลือก</span>
              </div>

              {pendingRequests.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  ไม่มีคำขอรอนัดหมายในขณะนี้
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                  {pendingRequests.map((b) => {
                    const isSelected = selectedPatientBookingId === b.id;
                    return (
                      <div
                        key={b.id}
                        onClick={() => {
                          healingSound.playClickBeep();
                          setSelectedPatientBookingId(isSelected ? null : b.id);
                        }}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                          isSelected
                            ? 'bg-purple-50/70 border-purple-500 ring-2 ring-purple-300 shadow-xs'
                            : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100/70'
                        }`}
                      >
                        {isSelected && (
                          <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px] font-bold">
                            ✓
                          </span>
                        )}

                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md">
                            {b.id}
                          </span>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs font-semibold text-slate-700">
                            {b.patientInfo.fullName} ({b.patientInfo.age} ปี)
                          </span>
                        </div>

                        <div className="mt-2 space-y-1 text-xs text-slate-600">
                          <p className="flex items-center gap-1.5 font-medium text-slate-800">
                            <Building2 className="w-3.5 h-3.5 text-slate-400" />
                            <span>{b.patientInfo.hospitalName} ({b.patientInfo.ward} • {b.patientInfo.bedNumber})</span>
                          </p>
                          <p className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span className="font-semibold text-amber-700">{b.date} • {b.timeSlot}</span>
                          </p>
                          <p className="text-[11px] text-slate-500">
                            โรค/อาการ: {b.patientInfo.disease} ({b.patientInfo.symptoms})
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: Available Volunteer Slots */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                  <h3 className="font-bold text-sm text-slate-800">
                    เวลาว่างที่จิตอาสาเปิดรับ ({availableSlots.length})
                  </h3>
                </div>
                <span className="text-xs text-slate-400">คลิกการ์ดเพื่อเลือก</span>
              </div>

              {availableSlots.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  ไม่มีจิตอาสาลงเวลาว่างในขณะนี้
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                  {availableSlots.map((slot) => {
                    const isSelected = selectedVolunteerSlotId === slot.id;
                    return (
                      <div
                        key={slot.id}
                        onClick={() => {
                          healingSound.playClickBeep();
                          setSelectedVolunteerSlotId(isSelected ? null : slot.id);
                        }}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                          isSelected
                            ? 'bg-teal-50/70 border-teal-500 ring-2 ring-teal-300 shadow-xs'
                            : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100/70'
                        }`}
                      >
                        {isSelected && (
                          <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px] font-bold">
                            ✓
                          </span>
                        )}

                        <div className="flex items-center gap-2.5">
                          <img
                            src={slot.volunteerAvatar}
                            alt=""
                            className="w-8 h-8 rounded-full object-cover border border-slate-200"
                          />
                          <div>
                            <span className="text-xs font-bold text-slate-800 block">
                              {slot.volunteerName} ({slot.volunteerNickname || 'จิตอาสา'})
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">{slot.id}</span>
                          </div>
                        </div>

                        <div className="mt-2 space-y-1 text-xs text-slate-600">
                          <p className="flex items-center gap-1.5 font-medium text-slate-800">
                            <Building2 className="w-3.5 h-3.5 text-slate-400" />
                            <span>{slot.hospitalName}</span>
                          </p>
                          <p className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-teal-600" />
                            <span className="font-semibold text-teal-800">{slot.date} ({slot.startTime} - {slot.endTime} น.)</span>
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 2: AUDIO REVIEW & MANAGEMENT (Predefined Rejection Reasons)        */}
      {/* ========================================================================= */}
      {activeSubTab === 'audio-reviews' && (
        <div className="space-y-6">
          {/* Status Tabs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAudioReviewFilter('pending')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                audioReviewFilter === 'pending'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>รอการตรวจสอบ ({pendingAudioCount})</span>
            </button>

            <button
              onClick={() => setAudioReviewFilter('approved')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                audioReviewFilter === 'approved'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>อนุมัติแล้ว ({audioSubmissions.filter((s) => s.status === 'approved').length})</span>
            </button>

            <button
              onClick={() => setAudioReviewFilter('rejected')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                audioReviewFilter === 'rejected'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <X className="w-3.5 h-3.5" />
              <span>ไม่ผ่านการอนุมัติ ({audioSubmissions.filter((s) => s.status === 'rejected').length})</span>
            </button>

            <button
              onClick={() => setAudioReviewFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                audioReviewFilter === 'all'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              ทั้งหมด ({audioSubmissions.length})
            </button>
          </div>

          {/* Submissions List */}
          <div className="space-y-4">
            {audioSubmissions
              .filter((s) => audioReviewFilter === 'all' || s.status === audioReviewFilter)
              .map((sub) => (
                <div
                  key={sub.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col lg:flex-row lg:items-start justify-between gap-6"
                >
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        {sub.id}
                      </span>
                      {sub.status === 'pending' && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                          รออนุมัติ
                        </span>
                      )}
                      {sub.status === 'approved' && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                          อนุมัติเรียบร้อย
                        </span>
                      )}
                      {sub.status === 'rejected' && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                          ไม่ผ่านการอนุมัติ
                        </span>
                      )}
                      <span className="text-xs text-slate-400">• อัปโหลดเมื่อ {sub.uploadedAt}</span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-slate-800">
                      {sub.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {sub.excerpt}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-700 font-medium">
                        จิตอาสา: {sub.volunteerName}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                        หมวด: {sub.categoryName}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                        ความยาว {sub.durationFormatted} ({sub.fileSizeFormatted})
                      </span>
                    </div>

                    {/* Rejection reason if already rejected */}
                    {sub.status === 'rejected' && sub.rejectionReason && (
                      <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-900">
                        <span className="font-bold">เหตุผลที่ไม่ผ่าน: </span>
                        <span>{sub.rejectionReason}</span>
                      </div>
                    )}
                  </div>

                  {/* Player & Action Buttons */}
                  <div className="w-full lg:w-80 shrink-0 space-y-3">
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                      <Html5AudioPlayer
                        audioUrl={sub.audioUrl}
                        title={sub.title}
                        subtitle={sub.volunteerName}
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => handleApproveAudio(sub)}
                        className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>อนุมัติไฟล์เสียง</span>
                      </button>

                      <button
                        onClick={() => setRejectModalSubmission(sub)}
                        className="flex-1 py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center justify-center gap-1.5"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>ไม่ผ่านเกณฑ์</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 2: AUDIO ERROR REPORTS (Resolve and thank-you message)             */}
      {/* ========================================================================= */}
      {activeSubTab === 'audio-reports' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                ระบบจัดการข้อร้องเรียนไฟล์เสียง
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mt-2">
                รายงานปัญหาไฟล์เสียงจากผู้ป่วยและพยาบาล
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                ตรวจสอบปัญหาไฟล์เสียง ทำเครื่องหมายว่าแก้ไขแล้ว และส่งข้อความขอบคุณกลับไปยังผู้แจ้ง
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {audioErrorReports.length === 0 ? (
              <p className="text-xs text-slate-400 py-8 text-center">ไม่มีรายงานปัญหาไฟล์เสียง</p>
            ) : (
              audioErrorReports.map((report) => (
                <div
                  key={report.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    report.status === 'resolved'
                      ? 'bg-slate-50/70 border-slate-200'
                      : 'bg-rose-50/40 border-rose-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                          {report.id}
                        </span>
                        <span className="text-xs font-bold text-slate-800">
                          เรื่อง: {report.storyTitle}
                        </span>
                        {report.status === 'resolved' ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            แก้ไขเรียบร้อยแล้ว
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">
                            รอดำเนินการ
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-rose-900 font-semibold mt-1">
                        ปัญหา: {report.issueTypeLabel} - "{report.description}"
                      </p>

                      <p className="text-[11px] text-slate-500 mt-1">
                        ผู้แจ้ง: {report.reporterName} ({report.reporterContact}) • เมื่อ {report.reportedAt}
                      </p>

                      {report.resolutionNotes && (
                        <div className="mt-2 p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900">
                          <span className="font-bold">บันทึกการแก้ไข & ข้อความขอบคุณ: </span>
                          <span>{report.resolutionNotes}</span>
                        </div>
                      )}
                    </div>

                    {report.status !== 'resolved' && (
                      <button
                        onClick={() => {
                          setResolvingReport(report);
                          setReportResolutionText('ทีมงานได้ทำการปรับแต่งเสียงและอัปเดตไฟล์เสียงใหม่ให้เรียบร้อยแล้ว ขอบคุณสำหรับข้อเสนอแนะเพื่อผู้ป่วยค่ะ');
                        }}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shrink-0 flex items-center gap-1.5 shadow-sm"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>แก้ไขแล้ว & ส่งข้อความขอบคุณ</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 5: FEEDBACK DATABASE & WARNING SYSTEM                              */}
      {/* ========================================================================= */}
      {activeSubTab === 'evaluations' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                ฐานข้อมูลการประเมินและการควบคุมคุณภาพ
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mt-2">
                แบบประเมินจากผู้ป่วย & ระบบออกหนังสือเตือน (Warning System)
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                ตรวจสอบคะแนนความพึงพอใจ และสามารถออกหนังสือตักเตือน/แจ้งข้อเสนอแนะแก่จิตอาสาได้ทันที
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {evaluations.map((ev) => (
              <div key={ev.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">{ev.volunteerName}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-xs text-slate-500">{ev.hospitalName} ({ev.date})</span>
                  </div>
                  <p className="text-xs text-slate-700 font-medium">"{ev.comments}"</p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500">
                    <span>มารยาท: {ev.etiquetteRating}/5</span>
                    <span>น้ำเสียง: {ev.voiceWarmthRating}/5</span>
                    <span className="font-bold text-amber-600">รวม: {ev.overallRating}/5 ดาว</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const vol = volunteers.find((v) => v.id === ev.volunteerId) || volunteers[0];
                    setWarningVolunteer(vol);
                    setWarningReason(`สืบเนื่องจากข้อเสนอแนะในการอ่านวันที่ ${ev.date}: ขอให้ปรับปรุงระดับเสียงและความสุภาพให้เหมาะสมกับเตียงผู้ป่วย`);
                  }}
                  className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl text-xs font-semibold shrink-0 flex items-center gap-1"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>ออกหนังสือเตือน / แจ้งข้อเสนอแนะ</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 6: CERTIFICATE APPROVAL TABLE                                      */}
      {/* ========================================================================= */}
      {activeSubTab === 'certificates' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                ระบบอนุมัติเกียรติบัตรรับรองดิจิทัล
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mt-2">
                รายการคำขอรับเกียรติบัตรจิตอาสา
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                เกณฑ์: ส่งไฟล์เสียงครบ 5 ไฟล์ (Online) หรือ อ่านข้างเตียงครบ 3 ครั้ง (Onsite)
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {certificateRequests.length === 0 ? (
              <p className="text-xs text-slate-400 py-8 text-center">ไม่มีคำขอเกียรติบัตรในขณะนี้</p>
            ) : (
              certificateRequests.map((req) => (
                <div key={req.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800">{req.fullNameThai}</span>
                      <span className="text-xs text-slate-500">({req.fullNameEn})</span>
                      {req.status === 'approved' && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          อนุมัติแล้ว
                        </span>
                      )}
                      {req.status === 'rejected' && (
                        <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">
                          ปฏิเสธแล้ว
                        </span>
                      )}
                      {req.status === 'pending' && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                          รออนุมัติ
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600">
                      อีเมล: {req.email} • วัตถุประสงค์: {req.purpose}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      ผลงาน: ไฟล์เสียง {req.onlineAudioCount}/5 • อ่านข้างเตียง {req.onsiteSessionCount}/3 ครั้ง
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {req.status === 'pending' && (
                      <>
                        <button
                          onClick={() => {
                            if (onApproveCertificate) {
                              healingSound.playChime(720, 0.8);
                              onApproveCertificate(req.id);
                              triggerSuccessMsg(`อนุมัติเกียรติบัตรแก่ ${req.fullNameThai} และส่งอีเมลเรียบร้อยแล้ว`);
                            }
                          }}
                          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1 shadow-sm"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>อนุมัติเกียรติบัตร</span>
                        </button>
                        <button
                          onClick={() => setRejectingCert(req)}
                          className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold"
                        >
                          ปฏิเสธ
                        </button>
                      </>
                    )}

                    {req.status === 'approved' && onViewCertificate && (
                      <button
                        onClick={() => onViewCertificate(req)}
                        className="px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>เปิดดูเกียรติบัตร</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* OTHER SUB-TABS: BOOKINGS, VOLUNTEERS, STORIES                              */}
      {/* ========================================================================= */}
      {activeSubTab === 'bookings' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="font-bold text-base text-slate-800">บันทึกการนัดหมายทั้งหมด ({bookings.length})</h3>
          <div className="space-y-3">
            {bookings.map((b) => (
              <div key={b.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-700">{b.id}</span>
                    <span className="text-xs font-bold text-slate-800">{b.patientInfo.fullName}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
                      {b.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    {b.patientInfo.hospitalName} ({b.date} • {b.timeSlot})
                  </p>
                  {b.cancellationReason && (
                    <p className="text-xs text-rose-600 font-semibold mt-1">
                      เหตุผลที่ยกเลิก: {b.cancellationReason}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* REJECTION MODAL FOR AUDIO SUBMISSIONS (Requirement 2)                      */}
      {/* ========================================================================= */}
      {rejectModalSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-slate-100">
            <button
              onClick={() => setRejectModalSubmission(null)}
              className="absolute top-5 right-5 p-1 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <form onSubmit={handleConfirmAudioReject} className="space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                  <X className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">ระบุเหตุผลที่ไม่ผ่านการอนุมัติ</h3>
                  <p className="text-xs text-slate-500 truncate max-w-[240px]">
                    เรื่อง: {rejectModalSubmission.title}
                  </p>
                </div>
              </div>

              {/* Standard Predefined Reasons */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">เลือกเหตุผลมาตรฐาน</label>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {standardRejectionReasons.map((r) => (
                    <label
                      key={r}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                        selectedStandardReason === r
                          ? 'bg-rose-50/70 border-rose-300 font-semibold text-rose-900'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="stdReason"
                        value={r}
                        checked={selectedStandardReason === r}
                        onChange={() => setSelectedStandardReason(r)}
                        className="text-rose-600 focus:ring-rose-400"
                      />
                      <span>{r}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Additional notes */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">ข้อเสนอแนะเพิ่มเติมสำหรับจิตอาสา</label>
                <textarea
                  value={customRejectionText}
                  onChange={(e) => setCustomRejectionText(e.target.value)}
                  rows={2}
                  placeholder="เช่น มีเสียงพัดลมในนาทีที่ 01:20 ขอแนะนำให้อัดในห้องที่เงียบขึ้นค่ะ..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-200 focus:border-rose-400 outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectModalSubmission(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm"
                >
                  ยืนยันการปฏิเสธ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESOLUTION MODAL FOR AUDIO REPORT */}
      {resolvingReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-slate-100">
            <button
              onClick={() => setResolvingReport(null)}
              className="absolute top-5 right-5 p-1 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <form onSubmit={handleConfirmResolveReport} className="space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">ส่งข้อความขอบคุณ & แจ้งผลแก้ไข</h3>
                  <p className="text-xs text-slate-500">ผู้แจ้ง: {resolvingReport.reporterName}</p>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">ข้อความขอบคุณและการดำเนินการแก้ไข</label>
                <textarea
                  value={reportResolutionText}
                  onChange={(e) => setReportResolutionText(e.target.value)}
                  required
                  rows={3}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setResolvingReport(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm"
                >
                  บันทึก & ส่งข้อความ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* WARNING MODAL */}
      {warningVolunteer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-slate-100">
            <button
              onClick={() => setWarningVolunteer(null)}
              className="absolute top-5 right-5 p-1 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <form onSubmit={handleConfirmWarning} className="space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">ออกหนังสือเตือน / ข้อเสนอแนะ</h3>
                  <p className="text-xs text-slate-500">จิตอาสา: {warningVolunteer.fullName}</p>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">ระดับความสำคัญ</label>
                <select
                  value={warningSeverity}
                  onChange={(e) => setWarningSeverity(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-200 outline-none bg-white"
                >
                  <option value="advisory">ข้อเสนอแนะเพื่อพัฒนา (Advisory)</option>
                  <option value="warning">หนังสือตักเตือน (Formal Warning)</option>
                  <option value="critical">ตักเตือนขั้นวิกฤต (Critical)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">รายละเอียดเหตุผล</label>
                <textarea
                  value={warningReason}
                  onChange={(e) => setWarningReason(e.target.value)}
                  required
                  rows={3}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-200 outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setWarningVolunteer(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-sm"
                >
                  ออกหนังสือเตือน
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REJECT CERTIFICATE MODAL */}
      {rejectingCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-slate-100">
            <button
              onClick={() => setRejectingCert(null)}
              className="absolute top-5 right-5 p-1 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <form onSubmit={handleConfirmRejectCert} className="space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                  <X className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">ปฏิเสธคำขอเกียรติบัตร</h3>
                  <p className="text-xs text-slate-500">จิตอาสา: {rejectingCert.fullNameThai}</p>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">ระบุเหตุผลเพื่อส่งกลับทางอีเมล</label>
                <textarea
                  value={certRejectionReason}
                  onChange={(e) => setCertRejectionReason(e.target.value)}
                  required
                  rows={3}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-200 outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectingCert(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm"
                >
                  ยืนยันการปฏิเสธ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
