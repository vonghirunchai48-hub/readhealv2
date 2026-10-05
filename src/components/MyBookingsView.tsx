import React, { useState } from 'react';
import { BookingRequest } from '../types';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  BookOpen, 
  Phone, 
  QrCode, 
  ArrowRight, 
  Plus, 
  ArrowLeft,
  XCircle,
  Star,
  Layers,
  HeartHandshake
} from 'lucide-react';
import { CancellationModal } from './CancellationModal';
import { EvaluationModal } from './EvaluationModal';
import { healingSound } from '../utils/audioSynthesizer';

interface MyBookingsViewProps {
  bookings: BookingRequest[];
  onNavigateToBooking: () => void;
  onCancelBooking: (id: string, reason: string) => void;
  onResetToLanding?: () => void;
  onSubmitEvaluation?: (evalData: any) => void;
}

export const MyBookingsView: React.FC<MyBookingsViewProps> = ({
  bookings,
  onNavigateToBooking,
  onCancelBooking,
  onResetToLanding,
  onSubmitEvaluation,
}) => {
  const [cancellingBooking, setCancellingBooking] = useState<BookingRequest | null>(null);
  const [evaluatingBooking, setEvaluatingBooking] = useState<BookingRequest | null>(null);

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-10 px-4 sm:px-6">
      {/* Header Back Button / Return to Role Selection Gateway */}
      {onResetToLanding && (
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={onResetToLanding}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-700 hover:text-slate-900 text-xs sm:text-sm font-medium transition-all shadow-2xs group cursor-pointer"
            title="กลับสู่หน้าเลือกบทบาท (Role Selection Gateway)"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:-translate-x-0.5 transition-transform" />
            <span>← กลับสู่หน้าเลือกบทบาท (Patient, Volunteer, Admin)</span>
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
            ระบบติดตามสถานะนัดหมายข้างเตียง
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-2">
            รายการนัดหมายอ่านหนังสือ ({bookings.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            ตรวจสอบข้อมูลรอบเวลา จิตอาสาผู้อ่าน ยกเลิกนัดหมายพร้อมระบุเหตุผล และประเมินความพึงพอใจ
          </p>
        </div>

        <button
          onClick={onNavigateToBooking}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white text-xs sm:text-sm font-semibold shadow-md shadow-sky-500/20 flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>จองคิวใหม่อีกช่วง</span>
        </button>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-2xs">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-700">ยังไม่มีรายการนัดหมาย</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mt-1 mb-6">
            คุณสามารถเลือกจิตอาสาและจองคิวอ่านหนังสือข้างเตียงเพื่อรับฟังเรื่องเล่าอบอุ่นได้ทันที
          </p>
          <button
            onClick={onNavigateToBooking}
            className="px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-medium text-sm transition-all shadow-sm"
          >
            จองคิวอ่านหนังสือข้างเตียง
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className={`bg-white rounded-3xl p-6 border transition-all flex flex-col md:flex-row md:items-start justify-between gap-6 ${
                booking.status === 'cancelled'
                  ? 'border-rose-200 bg-rose-50/20'
                  : booking.status === 'confirmed'
                    ? 'border-emerald-200/80 shadow-xs hover:shadow-md'
                    : 'border-slate-200/80 shadow-xs hover:shadow-md'
              }`}
            >
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-100">
                    {booking.id}
                  </span>

                  {booking.status === 'confirmed' && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      ยืนยันแล้ว จิตอาสาตอบรับ
                    </span>
                  )}
                  {booking.status === 'pending' && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                      <AlertCircle className="w-3.5 h-3.5" />
                      รอยืนยันจากโรงพยาบาล / รอนัดหมาย
                    </span>
                  )}
                  {booking.status === 'completed' && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      เสร็จสิ้นเรียบร้อย
                    </span>
                  )}
                  {booking.status === 'cancelled' && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                      <XCircle className="w-3.5 h-3.5" />
                      ยกเลิกแล้ว
                    </span>
                  )}

                  {booking.isEvaluated && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                      <Star className="w-3 h-3 fill-purple-400 text-purple-400" />
                      ประเมินแล้ว
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-800">
                    เรื่อง: {booking.storyTitle || booking.customTopic || 'เรื่องเล่าสร้างกำลังใจ'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    ผู้รับบริการ: <strong className="text-slate-700">{booking.patientInfo.fullName}</strong>
                    {booking.patientInfo.hnNumber && (
                      <span className="ml-2 font-mono text-[10px] px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 font-medium">
                        {booking.patientInfo.hnNumber}
                      </span>
                    )}
                    {' '}({booking.patientInfo.hospitalName} • {booking.patientInfo.ward} • {booking.patientInfo.bedNumber})
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-sky-500" />
                    <span>{booking.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-sky-500" />
                    <span>{booking.timeSlot}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-teal-500" />
                    <span>หมวด: {booking.categoryName}</span>
                  </div>
                </div>

                {/* Multi-slot items if booked with multiple sessions (Requirement 3) */}
                {booking.slots && booking.slots.length > 0 && (
                  <div className="p-3 bg-sky-50/60 rounded-2xl border border-sky-100 space-y-1.5 mt-2">
                    <span className="text-[11px] font-bold text-sky-800 flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5" />
                      <span>ช่วงเวลาทั้งหมดในการจองล่วงหน้านี้ ({booking.slots.length} รอบ):</span>
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {booking.slots.map((s, idx) => (
                        <div key={s.id || idx} className="p-2 bg-white rounded-xl border border-sky-200/70 text-slate-700">
                          <span className="font-semibold text-sky-700">รอบที่ {idx + 1}: </span>
                          <span>{s.date} ({s.timeSlot})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cancellation Details if cancelled */}
                {booking.status === 'cancelled' && booking.cancellationReason && (
                  <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-900 mt-2">
                    <span className="font-bold">เหตุผลการยกเลิก: </span>
                    <span>{booking.cancellationReason}</span>
                  </div>
                )}
              </div>

              {/* Reader avatar & Actions */}
              <div className="flex md:flex-col items-center md:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 shrink-0">
                <div className="flex items-center gap-2.5">
                  <img
                    src={booking.volunteerAvatar}
                    alt={booking.volunteerName}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                  <div className="text-left md:text-right">
                    <p className="text-xs font-bold text-slate-800">
                      {booking.volunteerName}
                    </p>
                    <p className="text-[11px] text-sky-600">จิตอาสาผู้อ่าน</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Evaluation Button (Requirement 5) */}
                  {booking.status !== 'cancelled' && onSubmitEvaluation && (
                    <button
                      onClick={() => setEvaluatingBooking(booking)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors ${
                        booking.isEvaluated
                          ? 'bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs'
                      }`}
                    >
                      <Star className="w-3.5 h-3.5" />
                      <span>{booking.isEvaluated ? 'แก้ไขการประเมิน' : 'ประเมินความพึงพอใจ'}</span>
                    </button>
                  )}

                  {/* Cancel Button (Requirement 3) */}
                  {booking.status !== 'cancelled' && (
                    <button
                      onClick={() => setCancellingBooking(booking)}
                      className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-medium cursor-pointer transition-colors"
                    >
                      ยกเลิกนัดหมาย
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cancellation Modal */}
      {cancellingBooking && (
        <CancellationModal
          isOpen={true}
          booking={cancellingBooking}
          onClose={() => setCancellingBooking(null)}
          onConfirmCancel={(id, reason) => {
            onCancelBooking(id, reason);
            setCancellingBooking(null);
          }}
        />
      )}

      {/* Evaluation Modal */}
      {evaluatingBooking && onSubmitEvaluation && (
        <EvaluationModal
          isOpen={true}
          booking={evaluatingBooking}
          onClose={() => setEvaluatingBooking(null)}
          onSubmitEvaluation={(evalData) => {
            onSubmitEvaluation(evalData);
            setEvaluatingBooking(null);
          }}
        />
      )}
    </div>
  );
};
