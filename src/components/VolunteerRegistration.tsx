import React, { useState } from 'react';
import { VolunteerProfile, Gender } from '../types';
import { 
  UserCheck, 
  Mic, 
  Square, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  Sparkles, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin, 
  BookOpen, 
  Heart,
  Volume2,
  Building2,
  Check,
  ArrowLeft
} from 'lucide-react';
import { healingSound } from '../utils/audioSynthesizer';
import { CHONBURI_HOSPITALS, CHONBURI_DISTRICTS } from '../data/chonburiHospitals';

interface VolunteerRegistrationProps {
  onRegisterSuccess: (newVolunteer: VolunteerProfile) => void;
  onCancel: () => void;
  onResetToLanding?: () => void;
}

export const VolunteerRegistration: React.FC<VolunteerRegistrationProps> = ({
  onRegisterSuccess,
  onCancel,
  onResetToLanding,
}) => {
  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nickname, setNickname] = useState('');
  const [dob, setDob] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState<Gender>('female');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  // Multi-hospital selection for Chon Buri province
  const [selectedHospitals, setSelectedHospitals] = useState<string[]>([
    'โรงพยาบาลมหาวิทยาลัยบูรพา',
    'โรงพยาบาลชลบุรี',
  ]);
  const [districtFilter, setDistrictFilter] = useState<string>('all');
  const [bio, setBio] = useState('');
  const [readingStyle, setReadingStyle] = useState('เสียงนุ่มนวล อบอุ่น ฟังสบาย');
  const [voiceToneDesc, setVoiceToneDesc] = useState('อบอุ่น อ่อนโยน ชวนผ่อนคลายและคลายกังวล');
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([
    'นิทาน / เรื่องสั้น',
    'จิตวิทยา / กำลังใจ',
  ]);
  const [availableDays, setAvailableDays] = useState<string[]>(['เสาร์', 'อาทิตย์']);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([
    '14:00 - 15:30 น.',
    '18:30 - 19:30 น.',
  ]);
  const [agreementChecked, setAgreementChecked] = useState(false);

  // Voice recording test state
  const [isRecording, setIsRecording] = useState(false);
  const [recordTimer, setRecordTimer] = useState(0);
  const [hasRecordedSample, setHasRecordedSample] = useState(false);
  const [isPlayingRecorded, setIsPlayingRecorded] = useState(false);
  const [timerInterval, setTimerInterval] = useState<number | null>(null);

  // Submission state
  const [submitted, setSubmitted] = useState(false);
  const [registeredProfile, setRegisteredProfile] = useState<VolunteerProfile | null>(null);

  // Auto calculate age when DOB changes
  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDob(val);
    if (val) {
      const birthDate = new Date(val);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      if (calculatedAge > 0 && calculatedAge < 120) {
        setAge(calculatedAge);
      }
    }
  };

  const toggleSpecialty = (item: string) => {
    if (selectedSpecialties.includes(item)) {
      setSelectedSpecialties(selectedSpecialties.filter((s) => s !== item));
    } else {
      setSelectedSpecialties([...selectedSpecialties, item]);
    }
  };

  const toggleDay = (day: string) => {
    if (availableDays.includes(day)) {
      setAvailableDays(availableDays.filter((d) => d !== day));
    } else {
      setAvailableDays([...availableDays, day]);
    }
  };

  const toggleHospital = (hospitalName: string) => {
    if (selectedHospitals.includes(hospitalName)) {
      setSelectedHospitals(selectedHospitals.filter((h) => h !== hospitalName));
    } else {
      setSelectedHospitals([...selectedHospitals, hospitalName]);
    }
  };

  const selectDistrictHospitals = (district: string) => {
    const districtHospitals = CHONBURI_HOSPITALS.filter(h => h.district === district).map(h => h.name);
    const newSelection = Array.from(new Set([...selectedHospitals, ...districtHospitals]));
    setSelectedHospitals(newSelection);
  };

  const selectAllHospitals = () => {
    setSelectedHospitals(CHONBURI_HOSPITALS.map(h => h.name));
  };

  const clearAllHospitals = () => {
    setSelectedHospitals([]);
  };

  const toggleTimeSlot = (slot: string) => {
    if (availableTimeSlots.includes(slot)) {
      setAvailableTimeSlots(availableTimeSlots.filter((s) => s !== slot));
    } else {
      setAvailableTimeSlots([...availableTimeSlots, slot]);
    }
  };

  // Voice recording simulation with web audio chime
  const startVoiceRecording = () => {
    healingSound.playChime(660, 0.5);
    setIsRecording(true);
    setRecordTimer(0);
    setHasRecordedSample(false);

    const interval = window.setInterval(() => {
      setRecordTimer((prev) => {
        if (prev >= 20) {
          // Auto stop at 20 seconds
          stopVoiceRecording();
          return 20;
        }
        return prev + 1;
      });
    }, 1000);
    setTimerInterval(interval);
  };

  const stopVoiceRecording = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    healingSound.playChime(528, 0.8);
    setIsRecording(false);
    setHasRecordedSample(true);
  };

  const playRecordedVoice = () => {
    if (isPlayingRecorded) {
      healingSound.stopAmbient();
      setIsPlayingRecorded(false);
      return;
    }
    setIsPlayingRecorded(true);
    healingSound.startAmbient('piano');
    setTimeout(() => {
      healingSound.stopAmbient();
      setIsPlayingRecorded(false);
    }, (recordTimer || 5) * 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !dob || !phone) {
      alert('กรุณากรอกข้อมูลสำคัญให้ครบถ้วน (ชื่อ-นามสกุล, วันเดือนปีเกิด, และเบอร์โทร)');
      return;
    }
    if (!agreementChecked) {
      alert('กรุณายอมรับข้อตกลงและจรรยาบรรณจิตอาสาโรงพยาบาล');
      return;
    }
    if (selectedHospitals.length === 0) {
      alert('กรุณาเลือกโรงพยาบาลในจังหวัดชลบุรีที่ท่านสะดวกปฏิบัติหน้าที่อย่างน้อย 1 แห่ง');
      return;
    }

    healingSound.playChime(784, 1.2);

    const generatedZoneDesc = selectedHospitals.length === 1
      ? `${selectedHospitals[0]} (จ.ชลบุรี)`
      : selectedHospitals.length <= 3
      ? selectedHospitals.join(', ')
      : `${selectedHospitals[0]} และอีก ${selectedHospitals.length - 1} แห่ง (จ.ชลบุรี)`;

    const newVolunteer: VolunteerProfile = {
      id: `vol-${Date.now()}`,
      fullName: `${firstName} ${lastName}`.trim(),
      nickname: nickname || firstName,
      dob,
      age: Number(age) || 25,
      gender,
      phone,
      email: email || `${nickname.toLowerCase() || 'volunteer'}@readheal.org`,
      hospitalZone: generatedZoneDesc,
      availableHospitals: selectedHospitals,
      bio: bio || 'มีความตั้งใจที่จะนำเสียงอ่านอบอุ่นมาช่วยปลอบประโลมและสร้างรอยยิ้มให้ผู้ป่วยข้างเตียงในโรงพยาบาลจังหวัดชลบุรี',
      readingStyle,
      voiceToneDesc,
      voiceSampleDuration: recordTimer > 0 ? `00:${recordTimer < 10 ? '0' + recordTimer : recordTimer}` : '01:30',
      experienceYears: 1,
      rating: 5.0,
      reviewCount: 1,
      totalReadHours: 0,
      totalStoriesRead: 0,
      badge: 'จิตอาสาใหม่ (ชลบุรี)',
      availableDays: availableDays.length > 0 ? availableDays : ['เสาร์', 'อาทิตย์'],
      availableTimeSlots: availableTimeSlots.length > 0 ? availableTimeSlots : ['14:00 - 15:30 น.'],
      avatar: gender === 'female' 
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
      status: 'verified',
      specialties: selectedSpecialties.length > 0 ? selectedSpecialties : ['นิทาน / เรื่องสั้น'],
    };

    setRegisteredProfile(newVolunteer);
    setSubmitted(true);
    onRegisterSuccess(newVolunteer);
  };

  const sampleReadingText = `"กาลครั้งหนึ่งนานมาแล้ว ท่ามกลางสวนดอกไม้หลังตึกพักฟื้น มีสายลมอ่อนโยนพัดพากลิ่นหอมของดอกมะลิลอยมาเบาๆ ขอให้ทุกท่านหลับตาลง ผ่อนคลาย และพักผ่อนให้สบายใจนะคะ..."`;

  if (submitted && registeredProfile) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 text-center">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-emerald-100 shadow-xl shadow-emerald-500/10">
          <div className="w-18 h-18 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            ลงทะเบียนจิตอาสาสำเร็จแล้ว
          </span>

          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-3 mb-2">
            ยินดีต้อนรับสู่ครอบครัว ReadHeal!
          </h2>
          <p className="text-slate-600 text-sm max-w-lg mx-auto mb-6">
            ขอบพระคุณ <span className="font-semibold text-slate-900">{registeredProfile.fullName} ({registeredProfile.nickname})</span> ที่ร่วมเป็นส่วนหนึ่งในการส่งมอบพลังเสียงอ่านบำบัดใจให้ผู้ป่วยในโรงพยาบาล
          </p>

          {/* Volunteer card summary */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 text-left max-w-md mx-auto mb-8">
            <div className="flex items-center gap-4">
              <img 
                src={registeredProfile.avatar} 
                alt={registeredProfile.fullName}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-sm"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-800">{registeredProfile.fullName}</h4>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 font-medium">
                    {registeredProfile.nickname}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {registeredProfile.hospitalZone}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-medium">
                    {registeredProfile.badge}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    อายุ {registeredProfile.age} ปี
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200/60 text-xs text-slate-600 space-y-2">
              <p><strong className="text-slate-700">สไตล์การอ่าน:</strong> {registeredProfile.readingStyle}</p>
              <p><strong className="text-slate-700">หมวดที่ถนัด:</strong> {registeredProfile.specialties.join(', ')}</p>
              <p><strong className="text-slate-700">วันว่าง:</strong> {registeredProfile.availableDays.join(', ')}</p>
              {registeredProfile.availableHospitals && registeredProfile.availableHospitals.length > 0 && (
                <div>
                  <strong className="text-slate-700 block mb-1">
                    โรงพยาบาลที่สะดวกปฏิบัติหน้าที่ ({registeredProfile.availableHospitals.length} แห่ง):
                  </strong>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {registeredProfile.availableHospitals.map(h => (
                      <span key={h} className="text-[11px] px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 font-medium">
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onCancel}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white font-medium text-sm shadow-md shadow-sky-500/20 transition-all cursor-pointer"
            >
              ไปยังหน้าหลักเพื่อเริ่มใช้งาน
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-10 px-4 sm:px-6">
      {/* Header Back Button / Return to Role Selection Gateway */}
      {(onResetToLanding || onCancel) && (
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={onResetToLanding || onCancel}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-700 hover:text-slate-900 text-xs sm:text-sm font-medium transition-all shadow-2xs group cursor-pointer"
            title="กลับสู่หน้าเลือกบทบาท (Role Selection Gateway)"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:-translate-x-0.5 transition-transform" />
            <span>← กลับสู่หน้าเลือกบทบาท (Patient, Volunteer, Admin)</span>
          </button>
        </div>
      )}

      {/* Title & Introduction banner */}
      <div className="bg-gradient-to-r from-sky-500 via-sky-600 to-teal-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-sky-500/15 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-medium mb-3">
            <UserCheck className="w-3.5 h-3.5" />
            <span>แบบฟอร์มลงทะเบียนและสร้างโปรไฟล์จิตอาสา</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            ร่วมส่งต่อพลังเสียงอ่านบำบัดใจ (ReadHeal Volunteer)
          </h1>
          <p className="text-sky-100 text-xs sm:text-sm max-w-2xl leading-relaxed">
            เสียงของคุณมีคุณค่าในการเยียวยาจิตใจผู้ป่วยข้างเตียง กรอกข้อมูลส่วนตัว 
            สไตล์การอ่าน และทดสอบบันทึกเสียงเพื่อสร้างประวัติจิตอาสาในระบบ
          </p>
        </div>
      </div>

      {/* Main Registration Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-8">
        
        {/* Section 1: ข้อมูลส่วนตัว (Personal Data) */}
        <div>
          <div className="flex items-center gap-2 pb-3 mb-5 border-b border-slate-100">
            <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs">
              1
            </div>
            <h3 className="text-lg font-bold text-slate-800">
              ข้อมูลส่วนตัว (Personal Information)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* First Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                ชื่อจริง (First Name) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="เช่น พิมลวรรณ, กฤษณะ"
                className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-sky-400 focus:ring-3 focus:ring-sky-100"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                นามสกุล (Last Name) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="เช่น สุขประเสริฐ, พิชิตพงศ์"
                className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-sky-400 focus:ring-3 focus:ring-sky-100"
              />
            </div>

            {/* Nickname */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                ชื่อเล่น / นามแฝงที่ใช้เรียก (Nickname)
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="เช่น ครูนิ่ม, น้องมายด์, กานต์"
                className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-sky-400 focus:ring-3 focus:ring-sky-100"
              />
            </div>

            {/* Date of Birth & Age */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  วันเดือนปีเกิด <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={handleDobChange}
                    className="w-full text-xs sm:text-sm px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-sky-400 focus:ring-3 focus:ring-sky-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  อายุ (ปี)
                </label>
                <input
                  type="number"
                  min="15"
                  max="99"
                  value={age}
                  onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="คำนวณอัตโนมัติ"
                  className="w-full text-sm px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-sky-400 focus:ring-3 focus:ring-sky-100"
                />
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                เพศ (Gender)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'female', label: 'หญิง (Female)' },
                  { id: 'male', label: 'ชาย (Male)' },
                  { id: 'other', label: 'อื่นๆ / หลากหลาย' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setGender(item.id as Gender)}
                    className={`py-2 px-2 text-xs rounded-xl border transition-all text-center ${
                      gender === item.id
                        ? 'bg-sky-50 border-sky-400 text-sky-700 font-semibold shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                เบอร์โทรศัพท์ติดต่อ <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="เช่น 081-234-5678"
                  className="w-full text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-sky-400 focus:ring-3 focus:ring-sky-100"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                อีเมล (Email)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-sky-400 focus:ring-3 focus:ring-sky-100"
                />
              </div>
            </div>

            {/* Chon Buri Multi-Hospital Selection */}
            <div className="sm:col-span-2">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <label className="block text-xs font-semibold text-slate-700">
                  โรงพยาบาลในจังหวัดชลบุรีที่สะดวกปฏิบัติหน้าที่ (เลือกได้หลายแห่ง) *
                </label>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                    selectedHospitals.length > 0 
                      ? 'bg-sky-100 text-sky-800' 
                      : 'bg-rose-100 text-rose-700'
                  }`}>
                    เลือกแล้ว {selectedHospitals.length} จาก {CHONBURI_HOSPITALS.length} แห่ง
                  </span>
                  <button
                    type="button"
                    onClick={selectAllHospitals}
                    className="text-xs text-sky-600 hover:text-sky-700 font-medium hover:underline"
                  >
                    เลือกทั้งหมด
                  </button>
                  <span className="text-slate-300">|</span>
                  <button
                    type="button"
                    onClick={clearAllHospitals}
                    className="text-xs text-slate-500 hover:text-slate-700 hover:underline"
                  >
                    ล้าง
                  </button>
                </div>
              </div>

              {/* District Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5 mb-3">
                <span className="text-xs text-slate-500 mr-1">กรองตามอำเภอ:</span>
                <button
                  type="button"
                  onClick={() => setDistrictFilter('all')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    districtFilter === 'all'
                      ? 'bg-sky-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  ทั้งหมด ({CHONBURI_HOSPITALS.length})
                </button>
                {CHONBURI_DISTRICTS.map((district) => {
                  const count = CHONBURI_HOSPITALS.filter(h => h.district === district).length;
                  return (
                    <button
                      key={district}
                      type="button"
                      onClick={() => setDistrictFilter(district)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                        districtFilter === district
                          ? 'bg-sky-600 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {district} ({count})
                    </button>
                  );
                })}
              </div>

              {/* Hospital Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1 p-1 rounded-2xl bg-slate-50/70 border border-slate-200/80">
                {CHONBURI_HOSPITALS
                  .filter(h => districtFilter === 'all' || h.district === districtFilter)
                  .map((hospital) => {
                    const isSelected = selectedHospitals.includes(hospital.name);
                    return (
                      <div
                        key={hospital.id}
                        onClick={() => toggleHospital(hospital.name)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                          isSelected
                            ? 'border-sky-400 bg-white shadow-2xs ring-2 ring-sky-200/70'
                            : 'border-slate-200 bg-white/70 hover:bg-white hover:border-slate-300'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                            isSelected
                              ? 'bg-sky-500 text-white shadow-2xs'
                              : 'border border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <h4 className="text-xs font-bold text-slate-800 truncate">
                              {hospital.name}
                            </h4>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium shrink-0">
                              {hospital.type}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-sky-500 shrink-0" />
                              {hospital.district}
                            </span>
                            <span>•</span>
                            <span>{hospital.zone}</span>
                            {hospital.beds && (
                              <>
                                <span>•</span>
                                <span className="text-slate-400">{hospital.beds} เตียง</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {selectedHospitals.length === 0 && (
                <p className="text-xs text-rose-500 mt-2 flex items-center gap-1">
                  ⚠️ กรุณาเลือกโรงพยาบาลในจังหวัดชลบุรีอย่างน้อย 1 แห่ง
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: รายละเอียดโปรไฟล์การอ่าน (Reading Profile & Style) */}
        <div>
          <div className="flex items-center gap-2 pb-3 mb-5 border-b border-slate-100">
            <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs">
              2
            </div>
            <h3 className="text-lg font-bold text-slate-800">
              รายละเอียดโปรไฟล์ & สไตล์การอ่าน (Reading Profile)
            </h3>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {/* Reading Style selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                สไตล์หรือเอกลักษณ์น้ำเสียงของคุณ
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    title: 'เสียงนุ่มนวล อบอุ่น',
                    desc: 'จังหวะช้า ฟังสบาย เหมาะกับผู้ป่วยพักผ่อนและก่อนนอน',
                  },
                  {
                    title: 'สดใส มีชีวิตชีวา',
                    desc: 'สนุกสนาน เล่นเสียงตัวละคร เหมาะกับผู้ป่วยเด็กและเรื่องสั้น',
                  },
                  {
                    title: 'สงบเย็น แผ่วเบา',
                    desc: 'ดั่งสายน้ำใส ช่วยคลายความเจ็บปวดและฝึกสติสมาธิ',
                  },
                ].map((style) => (
                  <div
                    key={style.title}
                    onClick={() => {
                      setReadingStyle(style.title);
                      setVoiceToneDesc(style.desc);
                    }}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      readingStyle === style.title
                        ? 'border-sky-400 bg-sky-50/70 shadow-xs ring-2 ring-sky-100'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <p className="font-semibold text-sm text-slate-800 mb-1">{style.title}</p>
                    <p className="text-xs text-slate-500 leading-normal">{style.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Specialties */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                หมวดหมู่เรื่องเล่าที่ถนัดหรือสนใจอ่าน (เลือกได้หลายข้อ)
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  'นิทาน / เรื่องสั้น',
                  'พัฒนาตนเอง',
                  'จิตวิทยา / กำลังใจ',
                  'วรรณกรรม',
                  'ความรู้ทั่วไป & สุขภาพ',
                  'ศาสนา / ธรรมะบำบัด',
                ].map((item) => {
                  const isChecked = selectedSpecialties.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleSpecialty(item)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
                        isChecked
                          ? 'bg-sky-500 text-white border-sky-500 shadow-xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {isChecked ? '✓ ' : '+ '}
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                แนะนำตัวสั้นๆ และแรงบันดาลใจในการเป็นจิตอาสา (Bio)
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="บอกเล่าประสบการณ์ ความสุขที่อยากส่งต่อ หรือเหตุผลที่คุณอยากอ่านหนังสือให้ผู้ป่วยฟัง..."
                className="w-full text-sm p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:border-sky-400 focus:ring-3 focus:ring-sky-100"
              />
            </div>

            {/* Available Days & Time Slots */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  วันที่สะดวกปฏิบัติหน้าที่
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'อาทิตย์'].map((day) => {
                    const isSelected = availableDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                          isSelected
                            ? 'bg-emerald-500 text-white border-emerald-500'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  ช่วงเวลาที่สะดวก
                </label>
                <div className="flex flex-col gap-1.5">
                  {[
                    '10:00 - 11:30 น. (ช่วงสาย)',
                    '14:00 - 15:30 น. (ช่วงบ่าย)',
                    '18:30 - 19:30 น. (ช่วงก่อนนอน)',
                  ].map((slot) => {
                    const isSelected = availableTimeSlots.includes(slot);
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => toggleTimeSlot(slot)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border text-left transition-all ${
                          isSelected
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-400 font-semibold'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {isSelected ? '✓ ' : '○ '} {slot}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: บันทึกทดสอบเสียงอ่าน (Voice Sample Test) */}
        <div>
          <div className="flex items-center gap-2 pb-3 mb-5 border-b border-slate-100">
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
              3
            </div>
            <h3 className="text-lg font-bold text-slate-800">
              ทดสอบบันทึกเสียงอ่านตัวอย่าง (Voice Sample Recording)
            </h3>
          </div>

          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80">
            <p className="text-xs text-slate-600 mb-3 leading-relaxed">
              ลองอ่านข้อความตัวอย่างด้านล่างนี้ด้วยน้ำเสียงผ่อนคลาย เพื่อให้ผู้ป่วยและทีมงานรับฟังตัวอย่างเสียงของคุณ:
            </p>

            {/* Prompt reading box */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 text-sm italic text-slate-700 mb-4 shadow-2xs font-serif leading-relaxed">
              {sampleReadingText}
            </div>

            {/* Recording Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {!isRecording ? (
                  <button
                    type="button"
                    onClick={startVoiceRecording}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-medium text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
                  >
                    <Mic className="w-4 h-4" />
                    <span>เริ่มบันทึกเสียงทดสอบ (Record)</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopVoiceRecording}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-medium text-xs sm:text-sm shadow-xs transition-all cursor-pointer animate-pulse"
                  >
                    <Square className="w-4 h-4 fill-white" />
                    <span>หยุดบันทึก ({recordTimer} วินาที)</span>
                  </button>
                )}

                {hasRecordedSample && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={playRecordedVoice}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-800 font-medium text-xs transition-all cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-sky-800" />
                      <span>{isPlayingRecorded ? 'กำลังเล่น...' : 'ฟังเสียงที่บันทึก'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={startVoiceRecording}
                      className="p-2 text-slate-400 hover:text-slate-600"
                      title="บันทึกใหม่"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-sky-500" />
                <span>
                  {hasRecordedSample
                    ? `บันทึกเสียงแล้ว (${recordTimer || 8} วินาที)`
                    : 'แนะนำให้อัดคลิปเสียงสั้นๆ 10-20 วินาที'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: จรรยาบรรณจิตอาสาและการยืนยัน */}
        <div className="pt-2">
          <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200/80 mb-6">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={agreementChecked}
                onChange={(e) => setAgreementChecked(e.target.checked)}
                className="mt-1 w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500"
              />
              <span className="text-xs text-slate-700 leading-relaxed">
                ข้าพเจ้าขอปฏิญาณว่าจะปฏิบัติหน้าที่จิตอาสาอ่านหนังสือข้างเตียงด้วยความเมตตา 
                เคารพความเป็นส่วนตัวของผู้ป่วย ปฏิบัติตามมาตรการป้องกันการติดเชื้อของโรงพยาบาลอย่างเคร่งครัด 
                และมุ่งมั่นส่งมอบกำลังใจที่ดีที่สุดให้แก่ผู้รับบริการทุกท่าน
              </span>
            </label>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium transition-all"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white font-semibold text-sm shadow-md shadow-sky-500/20 hover:shadow-lg transition-all active:scale-98 cursor-pointer"
            >
              ยืนยันการลงทะเบียนจิตอาสา
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
