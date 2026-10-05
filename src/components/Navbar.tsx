import React from 'react';
import { UserRole, VolunteerProfile } from '../types';
import { 
  BookHeart, 
  Users, 
  UserCheck, 
  ShieldCheck, 
  CalendarPlus, 
  Search, 
  Sparkles,
  Volume2,
  Bell,
  RefreshCw,
  Info,
  FileAudio,
  Upload,
  ArrowLeft,
  CalendarCheck
} from 'lucide-react';

interface NavbarProps {
  currentRole: UserRole;
  currentVolunteer?: VolunteerProfile | null;
  onSelectRole: (role: UserRole) => void;
  onResetToLanding?: () => void;
  activeTab: 'home' | 'volunteer-register' | 'volunteer-audio' | 'booking' | 'admin' | 'my-bookings';
  setActiveTab: (tab: 'home' | 'volunteer-register' | 'volunteer-audio' | 'booking' | 'admin' | 'my-bookings') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  bookingCount: number;
  pendingAudioCount?: number;
  notificationCount?: number;
  onOpenInfoModal: () => void;
  onOpenRoleSelector: () => void;
  onOpenNotificationCenter?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  currentVolunteer,
  onSelectRole,
  onResetToLanding,
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  bookingCount,
  pendingAudioCount = 0,
  notificationCount = 0,
  onOpenInfoModal,
  onOpenRoleSelector,
  onOpenNotificationCenter,
}) => {
  const getRoleBadge = () => {
    switch (currentRole) {
      case 'patient':
        return {
          label: 'ผู้รับบริการ / ผู้ป่วย',
          icon: <Users className="w-3.5 h-3.5" />,
          color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        };
      case 'volunteer':
        return {
          label: currentVolunteer ? `จิตอาสา: ${currentVolunteer.nickname || currentVolunteer.fullName}` : 'จิตอาสา / ผู้อ่าน',
          icon: <UserCheck className="w-3.5 h-3.5" />,
          color: 'bg-sky-50 text-sky-700 border-sky-200',
        };
      case 'admin':
        return {
          label: 'ผู้ดูแลระบบ (Admin)',
          icon: <ShieldCheck className="w-3.5 h-3.5" />,
          color: 'bg-purple-50 text-purple-700 border-purple-200',
        };
      default:
        return {
          label: 'เลือกบทบาท',
          icon: <Sparkles className="w-3.5 h-3.5 text-sky-600 animate-pulse" />,
          color: 'bg-sky-50 hover:bg-sky-100 text-sky-800 border-sky-300 font-semibold shadow-xs',
        };
    }
  };

  const roleInfo = getRoleBadge();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
      {/* Healing hospital notice bar */}
      <div className="bg-gradient-to-r from-sky-50 via-teal-50 to-blue-50 border-b border-sky-100/60 px-4 py-1.5 text-xs text-sky-900 flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="inline-flex items-center gap-1 font-medium text-sky-700 bg-white/80 px-2 py-0.5 rounded-full border border-sky-200/80">
            <Volume2 className="w-3 h-3 text-sky-600 animate-pulse" />
            เสียงอ่านข้างเตียงบำบัดใจ
          </span>
          <span className="hidden sm:inline text-slate-600">
            เปิดให้บริการเพื่อส่งมอบความหวัง รอยยิ้ม และความสงบในโรงพยาบาล
          </span>
        </div>

        <div className="flex items-center gap-3">
          {currentRole !== null && onResetToLanding && (
            <>
              <button
                onClick={onResetToLanding}
                className="flex items-center gap-1 font-medium text-sky-700 hover:text-sky-900 transition-colors cursor-pointer"
                title="กลับสู่หน้าหลักเลือกบทบาท (Patient, Volunteer, Admin)"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>หน้าหลักเลือกบทบาท</span>
              </button>
              <span className="text-slate-300">|</span>
            </>
          )}
          <button
            onClick={onOpenInfoModal}
            className="flex items-center gap-1 hover:text-sky-700 text-slate-500 transition-colors"
            title="เกี่ยวกับโครงการ ReadHeal"
          >
            <Info className="w-3.5 h-3.5" />
            <span className="hidden md:inline">เกี่ยวกับ ReadHeal</span>
          </button>
          <span className="text-slate-300">|</span>
          <button
            onClick={onOpenRoleSelector}
            className="flex items-center gap-1 font-medium text-sky-600 hover:text-sky-800 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>สลับบทบาทผู้ใช้</span>
          </button>
        </div>
      </div>

      {/* Main navigation container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-3 sm:gap-6">
          {/* Logo brand & optional back button */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div 
              onClick={() => {
                if (onResetToLanding) {
                  onResetToLanding();
                } else {
                  setActiveTab('home');
                }
              }} 
              className="flex items-center gap-3 cursor-pointer select-none group shrink-0"
              title="คลิกเพื่อกลับสู่หน้าหลักเลือกบทบาท (Role Selection Gateway)"
            >
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-sky-500 to-teal-500 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform duration-200">
                <BookHeart className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xl tracking-tight text-slate-800">
                    ReadHeal
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-sky-100 text-sky-700">
                    TH
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-normal hidden sm:block">
                  เตียงนี้มีเรื่องเล่า • เสียงอ่านเคียงข้างคุณ
                </p>
              </div>
            </div>

            {/* Back to Role Selection Button when in a specific role */}
            {currentRole !== null && onResetToLanding && (
              <button
                onClick={onResetToLanding}
                className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-xs font-medium transition-all border border-slate-200 shadow-2xs group cursor-pointer"
                title="กลับสู่หน้าเลือกบทบาท (Role Selection Gateway)"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-slate-500 group-hover:-translate-x-0.5 transition-transform" />
                <span>เลือกบทบาทใหม่</span>
              </button>
            )}
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาเรื่องเล่า, นิทาน, ธรรมะ, หรือชื่อจิตอาสา..."
                className="w-full bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-sm text-slate-700 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-sky-400 focus:ring-3 focus:ring-sky-100 transition-all placeholder:text-slate-400"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 bg-slate-200/70 hover:bg-slate-300 w-4 h-4 rounded-full flex items-center justify-center"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Role indicator pill */}
            <button
              onClick={onOpenRoleSelector}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium cursor-pointer transition-all hover:shadow-xs ${roleInfo.color}`}
              title="คลิกเพื่อเปลี่ยนบทบาทการใช้งาน"
            >
              {roleInfo.icon}
              <span className="max-w-[110px] sm:max-w-none truncate">{roleInfo.label}</span>
            </button>

            {/* Quick Navigation Tabs */}
            <nav className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab('home')}
                className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  activeTab === 'home'
                    ? 'bg-sky-50 text-sky-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                หน้าแรก
              </button>

              {/* Volunteer profile link */}
              <button
                onClick={() => setActiveTab('volunteer-register')}
                className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  activeTab === 'volunteer-register'
                    ? 'bg-sky-50 text-sky-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                ลงทะเบียนจิตอาสา
              </button>

              {/* Volunteer Audio Upload & Status Portal */}
              <button
                onClick={() => setActiveTab('volunteer-audio')}
                className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
                  activeTab === 'volunteer-audio'
                    ? 'bg-sky-500 text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
                title="อัปโหลดและตรวจสอบสถานะไฟล์เสียงอ่านจิตอาสา"
              >
                <FileAudio className={`w-3.5 h-3.5 ${activeTab === 'volunteer-audio' ? 'text-white' : 'text-sky-600'}`} />
                <span>ส่งไฟล์เสียงอ่าน</span>
              </button>

              {/* Admin button if admin or switchable */}
              {currentRole === 'admin' && (
                <button
                  onClick={() => setActiveTab('admin')}
                  className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
                    activeTab === 'admin'
                      ? 'bg-purple-600 text-white font-semibold shadow-xs'
                      : 'text-purple-700 bg-purple-50 hover:bg-purple-100'
                  }`}
                >
                  <span>ระบบดูแล (Admin)</span>
                  {pendingAudioCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-amber-400 text-purple-950 text-[10px] font-bold flex items-center justify-center animate-pulse">
                      {pendingAudioCount}
                    </span>
                  )}
                </button>
              )}

              {/* My Bookings tab */}
              <button
                onClick={() => setActiveTab('my-bookings')}
                className={`relative px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  activeTab === 'my-bookings'
                    ? 'bg-sky-50 text-sky-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
                title="รายการนัดหมายอ่านหนังสือข้างเตียง"
              >
                <span className="flex items-center gap-1.5">
                  <CalendarCheck className="w-4 h-4 text-slate-500" />
                  <span className="hidden sm:inline">การนัดหมาย</span>
                  {bookingCount > 0 && (
                    <span className="w-4.5 h-4.5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {bookingCount}
                    </span>
                  )}
                </span>
              </button>
            </nav>

            {/* Notification Center Bell Button */}
            {onOpenNotificationCenter && (
              <button
                onClick={onOpenNotificationCenter}
                className="relative p-2 rounded-xl text-slate-600 hover:text-sky-700 hover:bg-sky-50 transition-all cursor-pointer border border-transparent hover:border-sky-100"
                title="ศูนย์แจ้งเตือนและระบบอีเมลตอบรับ"
              >
                <Bell className="w-4.5 h-4.5 text-slate-600" />
                {notificationCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse shadow-xs">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </span>
                )}
              </button>
            )}

            {/* Primary Action Button: Book Reader */}
            <button
              id="nav-book-reader-btn"
              onClick={() => setActiveTab('booking')}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white rounded-xl text-xs sm:text-sm font-medium shadow-sm shadow-sky-500/20 hover:shadow-md transition-all active:scale-98 cursor-pointer"
            >
              <CalendarPlus className="w-4 h-4" />
              <span className="whitespace-nowrap font-medium">จองจิตอาสา</span>
            </button>
          </div>
        </div>

        {/* Mobile search bar visible on small screens */}
        <div className="pb-2 md:hidden">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาเรื่องเล่า, นิทาน, ธรรมะ..."
              className="w-full bg-slate-50 text-sm text-slate-700 pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-sky-400"
            />
          </div>
        </div>

        {/* Mobile quick-action navigation chips row */}
        <div className="flex md:hidden items-center gap-1.5 overflow-x-auto no-scrollbar pb-3 pt-0.5 text-xs">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-medium transition-all ${
              activeTab === 'home'
                ? 'bg-sky-50 text-sky-700 font-semibold border border-sky-200'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            หน้าแรก
          </button>
          <button
            onClick={() => setActiveTab('volunteer-register')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-medium transition-all ${
              activeTab === 'volunteer-register'
                ? 'bg-sky-50 text-sky-700 font-semibold border border-sky-200'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            ลงทะเบียนจิตอาสา
          </button>
          <button
            onClick={() => setActiveTab('volunteer-audio')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-medium transition-all flex items-center gap-1 ${
              activeTab === 'volunteer-audio'
                ? 'bg-sky-500 text-white font-semibold'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            <FileAudio className="w-3.5 h-3.5" />
            <span>ส่งไฟล์เสียงอ่าน</span>
          </button>
          <button
            onClick={() => setActiveTab('my-bookings')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-medium transition-all flex items-center gap-1 ${
              activeTab === 'my-bookings'
                ? 'bg-sky-50 text-sky-700 font-semibold border border-sky-200'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>การนัดหมาย {bookingCount > 0 ? `(${bookingCount})` : ''}</span>
          </button>
          {onOpenNotificationCenter && (
            <button
              onClick={onOpenNotificationCenter}
              className="px-3 py-1.5 rounded-xl whitespace-nowrap font-medium transition-all flex items-center gap-1 bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/80 relative"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>แจ้งเตือน</span>
              {notificationCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              )}
            </button>
          )}
          <button
            onClick={() => setActiveTab('booking')}
            className="px-3 py-1.5 rounded-xl whitespace-nowrap font-medium bg-gradient-to-r from-sky-500 to-teal-500 text-white shadow-xs"
          >
            จองจิตอาสา
          </button>
        </div>
      </div>
    </header>
  );
};
