import React, { useState, useEffect } from 'react';
import { 
  UserRole, 
  Category, 
  VolunteerProfile, 
  Story, 
  BookingRequest, 
  AudioPlayerState,
  AudioSubmission,
  AudioErrorReport,
  VolunteerAvailabilitySlot,
  NotificationItem,
  ServiceEvaluation,
  VolunteerWarning,
  CertificateRequest
} from './types';
import { 
  INITIAL_CATEGORIES, 
  INITIAL_VOLUNTEERS, 
  INITIAL_STORIES, 
  INITIAL_BOOKINGS 
} from './data/mockData';
import { INITIAL_AUDIO_SUBMISSIONS } from './data/mockAudioSubmissions';
import { 
  INITIAL_AUDIO_ERROR_REPORTS, 
  INITIAL_VOLUNTEER_AVAILABILITY, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_EVALUATIONS, 
  INITIAL_VOLUNTEER_WARNINGS, 
  INITIAL_CERTIFICATE_REQUESTS 
} from './data/mockOperationalData';
import { Navbar } from './components/Navbar';
import { RoleSelectionPage } from './components/RoleSelectionPage';
import { VolunteerRegistration } from './components/VolunteerRegistration';
import { VolunteerAudioPortal } from './components/VolunteerAudioPortal';
import { MainDashboard } from './components/MainDashboard';
import { PatientBookingFlow } from './components/PatientBookingFlow';
import { AdminDashboard } from './components/AdminDashboard';
import { MyBookingsView } from './components/MyBookingsView';
import { StoryModal } from './components/StoryModal';
import { VolunteerProfileModal } from './components/VolunteerProfileModal';
import { BedsideAudioPlayer } from './components/BedsideAudioPlayer';
import { RoleSelectionModal } from './components/RoleSelectionModal';
import { AboutProjectModal } from './components/AboutProjectModal';
import { VolunteerLoginModal } from './components/VolunteerLoginModal';
import { NotificationCenterModal } from './components/NotificationCenterModal';
import { DigitalCertificateModal } from './components/DigitalCertificateModal';
import { AudioErrorReportModal } from './components/AudioErrorReportModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { healingSound } from './utils/audioSynthesizer';

export default function App() {
  // Current user role: null represents landing/role selection gateway screen
  const [currentRole, setCurrentRole] = useState<UserRole>(null);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<
    'home' | 'volunteer-register' | 'volunteer-audio' | 'booking' | 'admin' | 'my-bookings'
  >('home');

  // Master application datasets with localStorage persistence
  const [categories] = useState<Category[]>(INITIAL_CATEGORIES);

  const [volunteers, setVolunteers] = useState<VolunteerProfile[]>(() => {
    const saved = localStorage.getItem('readheal_volunteers');
    if (saved) {
      try { return JSON.parse(saved); } catch { return INITIAL_VOLUNTEERS; }
    }
    return INITIAL_VOLUNTEERS;
  });

  const [stories, setStories] = useState<Story[]>(() => {
    const saved = localStorage.getItem('readheal_stories');
    if (saved) {
      try { return JSON.parse(saved); } catch { return INITIAL_STORIES; }
    }
    return INITIAL_STORIES;
  });

  const [bookings, setBookings] = useState<BookingRequest[]>(() => {
    const saved = localStorage.getItem('readheal_bookings');
    if (saved) {
      try { return JSON.parse(saved); } catch { return INITIAL_BOOKINGS; }
    }
    return INITIAL_BOOKINGS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('readheal_volunteers', JSON.stringify(volunteers));
    } catch (e) {
      console.warn('Failed to save volunteers to localStorage:', e);
    }
  }, [volunteers]);

  useEffect(() => {
    try {
      localStorage.setItem('readheal_stories', JSON.stringify(stories));
    } catch (e) {
      console.warn('Failed to save stories to localStorage:', e);
    }
  }, [stories]);

  useEffect(() => {
    try {
      localStorage.setItem('readheal_bookings', JSON.stringify(bookings));
    } catch (e) {
      console.warn('Failed to save bookings to localStorage:', e);
    }
  }, [bookings]);

  // Current authenticated / active volunteer user
  const [currentVolunteerUser, setCurrentVolunteerUser] = useState<VolunteerProfile | null>(() => {
    return INITIAL_VOLUNTEERS[0] || null;
  });

  // Volunteer login / verification modal state
  const [isVolunteerLoginModalOpen, setIsVolunteerLoginModalOpen] = useState(false);

  // Volunteer Audio Submissions dataset with localStorage persistence
  const [audioSubmissions, setAudioSubmissions] = useState<AudioSubmission[]>(() => {
    const saved = localStorage.getItem('readheal_audio_submissions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_AUDIO_SUBMISSIONS;
      }
    }
    return INITIAL_AUDIO_SUBMISSIONS;
  });

  // Sync submissions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('readheal_audio_submissions', JSON.stringify(audioSubmissions));
    } catch (e) {
      console.warn('Failed to save audio submissions to localStorage:', e);
    }
  }, [audioSubmissions]);

  // Audio Error Reports with localStorage persistence
  const [audioErrorReports, setAudioErrorReports] = useState<AudioErrorReport[]>(() => {
    const saved = localStorage.getItem('readheal_audio_reports');
    if (saved) {
      try { return JSON.parse(saved); } catch { return INITIAL_AUDIO_ERROR_REPORTS; }
    }
    return INITIAL_AUDIO_ERROR_REPORTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('readheal_audio_reports', JSON.stringify(audioErrorReports));
    } catch (e) {
      console.warn('Failed to save audio reports to localStorage:', e);
    }
  }, [audioErrorReports]);

  // Volunteer Availability Slots with localStorage persistence
  const [availabilitySlots, setAvailabilitySlots] = useState<VolunteerAvailabilitySlot[]>(() => {
    const saved = localStorage.getItem('readheal_availability_slots');
    if (saved) {
      try { return JSON.parse(saved); } catch { return INITIAL_VOLUNTEER_AVAILABILITY; }
    }
    return INITIAL_VOLUNTEER_AVAILABILITY;
  });

  useEffect(() => {
    try {
      localStorage.setItem('readheal_availability_slots', JSON.stringify(availabilitySlots));
    } catch (e) {
      console.warn('Failed to save availability slots to localStorage:', e);
    }
  }, [availabilitySlots]);

  // Notifications with localStorage persistence
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('readheal_notifications');
    if (saved) {
      try { return JSON.parse(saved); } catch { return INITIAL_NOTIFICATIONS; }
    }
    return INITIAL_NOTIFICATIONS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('readheal_notifications', JSON.stringify(notifications));
    } catch (e) {
      console.warn('Failed to save notifications to localStorage:', e);
    }
  }, [notifications]);

  // Service Evaluations with localStorage persistence
  const [evaluations, setEvaluations] = useState<ServiceEvaluation[]>(() => {
    const saved = localStorage.getItem('readheal_evaluations');
    if (saved) {
      try { return JSON.parse(saved); } catch { return INITIAL_EVALUATIONS; }
    }
    return INITIAL_EVALUATIONS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('readheal_evaluations', JSON.stringify(evaluations));
    } catch (e) {
      console.warn('Failed to save evaluations to localStorage:', e);
    }
  }, [evaluations]);

  // Volunteer Warnings with localStorage persistence
  const [warnings, setWarnings] = useState<VolunteerWarning[]>(() => {
    const saved = localStorage.getItem('readheal_warnings');
    if (saved) {
      try { return JSON.parse(saved); } catch { return INITIAL_VOLUNTEER_WARNINGS; }
    }
    return INITIAL_VOLUNTEER_WARNINGS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('readheal_warnings', JSON.stringify(warnings));
    } catch (e) {
      console.warn('Failed to save warnings to localStorage:', e);
    }
  }, [warnings]);

  // Certificate Requests with localStorage persistence
  const [certificateRequests, setCertificateRequests] = useState<CertificateRequest[]>(() => {
    const saved = localStorage.getItem('readheal_certificate_requests');
    if (saved) {
      try { return JSON.parse(saved); } catch { return INITIAL_CERTIFICATE_REQUESTS; }
    }
    return INITIAL_CERTIFICATE_REQUESTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('readheal_certificate_requests', JSON.stringify(certificateRequests));
    } catch (e) {
      console.warn('Failed to save certificate requests to localStorage:', e);
    }
  }, [certificateRequests]);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Modals state
  const [activeStoryModal, setActiveStoryModal] = useState<Story | null>(null);
  const [activeVolunteerModal, setActiveVolunteerModal] = useState<VolunteerProfile | null>(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [activeCertificateModal, setActiveCertificateModal] = useState<CertificateRequest | null>(null);
  const [activeAudioReportModal, setActiveAudioReportModal] = useState<Story | AudioSubmission | null>(null);

  // Authenticated Hospital Admin State with localStorage persistence
  const [currentAdminUser, setCurrentAdminUser] = useState<{
    name: string;
    email: string;
    hospital: string;
    roleTitle: string;
  } | null>(() => {
    const saved = localStorage.getItem('readheal_current_admin');
    if (saved) {
      try { return JSON.parse(saved); } catch { return null; }
    }
    return null;
  });

  useEffect(() => {
    try {
      if (currentAdminUser) {
        localStorage.setItem('readheal_current_admin', JSON.stringify(currentAdminUser));
      } else {
        localStorage.removeItem('readheal_current_admin');
      }
    } catch (e) {
      console.warn('Failed to save current admin user to localStorage:', e);
    }
  }, [currentAdminUser]);

  // Pre-selected objects for booking wizard
  const [bookingPreselectedVolunteer, setBookingPreselectedVolunteer] = useState<VolunteerProfile | null>(null);
  const [bookingPreselectedStory, setBookingPreselectedStory] = useState<Story | null>(null);

  // Bedside Audio Player state
  const [playerState, setPlayerState] = useState<AudioPlayerState>({
    isPlaying: false,
    currentStory: null,
    progress: 0,
    currentTime: 0,
    duration: 300,
    volume: 0.8,
    ambientSound: 'piano',
    playbackRate: 1.0,
    isExpanded: false,
  });

  // Role selection from Gateway
  const handleSelectRoleFromGateway = (role: UserRole) => {
    healingSound.playClickBeep();
    if (role === 'volunteer') {
      // Open polite verification dialog instead of direct dashboard entry
      setIsVolunteerLoginModalOpen(true);
      return;
    }
    if (role === 'admin') {
      // Open secure admin login modal with demo fast track
      setIsAdminLoginModalOpen(true);
      return;
    }
    setCurrentRole(role);
    setActiveTab('home');
  };

  // Play a story
  const handlePlayStory = (story: Story) => {
    healingSound.playClickBeep();
    if (playerState.currentStory?.id === story.id && playerState.isPlaying) {
      // Pause
      setPlayerState((prev) => ({ ...prev, isPlaying: false }));
      healingSound.stopAmbient();
    } else {
      // Start playback with gentle ambient chime
      setPlayerState({
        ...playerState,
        currentStory: story,
        isPlaying: true,
        duration: story.durationSeconds,
        currentTime: 0,
        progress: 0,
      });
      healingSound.startAmbient(playerState.ambientSound);
    }
  };

  // Navigate to booking with preselected volunteer & story
  const handleStartBookingWithVolunteer = (
    volunteer: VolunteerProfile,
    preferredStory?: Story
  ) => {
    healingSound.playClickBeep();
    setBookingPreselectedVolunteer(volunteer);
    if (preferredStory) {
      setBookingPreselectedStory(preferredStory);
    }
    setActiveTab('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Volunteer login / verification success handler
  const handleVolunteerLoginSuccess = (volunteer: VolunteerProfile) => {
    setCurrentVolunteerUser(volunteer);
    setCurrentRole('volunteer');
    setActiveTab('volunteer-audio');
    setIsVolunteerLoginModalOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Switch to Volunteer Registration from login modal
  const handleGoToVolunteerRegistration = () => {
    setCurrentRole('volunteer');
    setActiveTab('volunteer-register');
    setIsVolunteerLoginModalOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Register new volunteer handler
  const handleRegisterVolunteer = (newVolunteer: VolunteerProfile) => {
    setVolunteers([newVolunteer, ...volunteers]);
    setCurrentVolunteerUser(newVolunteer);
    setCurrentRole('volunteer');
    setActiveTab('volunteer-audio');
  };

  // Admin login success handler
  const handleAdminLoginSuccess = (adminData?: {
    name: string;
    email: string;
    hospital: string;
    roleTitle: string;
  }) => {
    healingSound.playChime(750, 0.8);
    const admin = adminData || {
      name: 'พยาบาลวิชาชีพ กนกวรรณ เมตตารักษ์',
      email: 'admin@chonburi-hospital.go.th',
      hospital: 'โรงพยาบาลชลบุรี',
      roleTitle: 'หัวหน้าศูนย์ประสานงานจิตอาสาและเสียงอ่านบำบัด',
    };
    setCurrentAdminUser(admin);
    setCurrentRole('admin');
    setActiveTab('admin');
    setIsAdminLoginModalOpen(false);
    setIsRoleModalOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Admin logout handler
  const handleAdminLogout = () => {
    healingSound.playClickBeep();
    setCurrentAdminUser(null);
    setCurrentRole(null);
    setActiveTab('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Create new booking handler with multi-booking and notification triggers
  const handleBookingSuccess = (newBooking: BookingRequest) => {
    healingSound.playChime(700, 0.7);
    setBookings((prev) => [newBooking, ...prev]);

    // Check if slot has matching volunteer
    const matchingSlot = availabilitySlots.find(
      (s) => !s.isBooked && s.date === newBooking.date && s.hospitalName === newBooking.patientInfo.hospitalName
    );

    // Notify Admin of new booking
    const adminNotif: NotificationItem = {
      id: `NOTIF-BK-${Date.now().toString().slice(-6)}`,
      recipientRole: 'admin',
      title: 'มีคำขอนัดหมายอ่านหนังสือใหม่ 📖',
      message: `ผู้ป่วย ${newBooking.patientInfo.fullName} (${newBooking.patientInfo.hospitalName}) รอนัดหมายวันที่ ${newBooking.date} ${newBooking.timeSlot}`,
      type: 'match',
      read: false,
      createdAt: new Date().toLocaleString('th-TH'),
      emailSent: true,
      emailAddress: 'admin.readheal@chonburi.moph.go.th',
      actionUrlTab: 'admin',
    };

    // If no matching volunteer slot exists, alert Admin & Patient
    if (!matchingSlot && newBooking.volunteerId === 'auto-assign') {
      const pendingAlert: NotificationItem = {
        id: `NOTIF-ALERT-${Date.now().toString().slice(-6)}`,
        recipientRole: 'patient',
        title: 'ระบบกำลังจัดสรรจิตอาสาสำหรับช่วงเวลาของคุณ ⏳',
        message: `ได้รับคำขอนัดหมายวันที่ ${newBooking.date} เรียบร้อยแล้ว เจ้าหน้าที่กำลังจัดหาจิตอาสาที่เหมาะสมและจะแจ้งยืนยันผ่านระบบแจ้งเตือนและ SMS/อีเมลโดยเร็ว`,
        type: 'match',
        read: false,
        createdAt: new Date().toLocaleString('th-TH'),
        emailSent: true,
        emailAddress: newBooking.patientInfo.contactPhone || 'patient@example.com',
        actionUrlTab: 'my-bookings',
      };
      setNotifications((prev) => [adminNotif, pendingAlert, ...prev]);
    } else {
      setNotifications((prev) => [adminNotif, ...prev]);
    }
  };

  // Update booking status (Admin)
  const handleUpdateBookingStatus = (
    id: string,
    newStatus: 'confirmed' | 'pending' | 'completed' | 'cancelled'
  ) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );
  };

  // Cancel booking with mandatory reason input and notifications (Requirement 3)
  const handleCancelBooking = (id: string, reason: string) => {
    healingSound.playClickBeep();
    const target = bookings.find((b) => b.id === id);

    setBookings((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
              ...b,
              status: 'cancelled',
              cancellationReason: reason,
              cancelledAt: new Date().toLocaleString('th-TH'),
              cancelledBy: currentRole || 'patient',
            }
          : b
      )
    );

    // Release volunteer slot if booked
    setAvailabilitySlots((prev) =>
      prev.map((s) => (s.bookedRequestId === id ? { ...s, isBooked: false, bookedRequestId: undefined } : s))
    );

    // Generate notifications with simulated email alerts
    const cancelNotifs: NotificationItem[] = [
      {
        id: `NOTIF-CANCEL-PT-${Date.now().toString().slice(-6)}`,
        recipientRole: 'patient',
        title: 'การยกเลิกนัดหมายสำเร็จแล้ว',
        message: `การนัดหมายรหัส ${id} วันที่ ${target?.date || ''} ได้รับการยกเลิกเรียบร้อยแล้ว (เหตุผล: ${reason})`,
        type: 'cancellation',
        read: false,
        createdAt: new Date().toLocaleString('th-TH'),
        emailSent: true,
        emailAddress: target?.patientInfo.contactPhone || 'patient@example.com',
        actionUrlTab: 'my-bookings',
      },
      {
        id: `NOTIF-CANCEL-VOL-${Date.now().toString().slice(-6)}`,
        recipientRole: 'volunteer',
        recipientId: target?.volunteerId,
        title: 'แจ้งเตือน: นัดหมายข้างเตียงถูกยกเลิกกะทันหัน ⚠️',
        message: `นัดหมายวันที่ ${target?.date || ''} (${target?.timeSlot || ''}) กับผู้ป่วย ${target?.patientInfo.fullName || ''} ถูกยกเลิก (เหตุผล: ${reason})`,
        type: 'cancellation',
        read: false,
        createdAt: new Date().toLocaleString('th-TH'),
        emailSent: true,
        emailAddress: volunteers.find((v) => v.id === target?.volunteerId)?.email || 'volunteer@example.com',
        actionUrlTab: 'volunteer-audio',
      },
      {
        id: `NOTIF-CANCEL-ADM-${Date.now().toString().slice(-6)}`,
        recipientRole: 'admin',
        title: 'มีการยกเลิกนัดหมายข้างเตียง',
        message: `นัดหมาย ${id} ที่ ${target?.patientInfo.hospitalName || ''} ถูกยกเลิกโดย ${currentRole || 'ผู้ใช้'} (เหตุผล: ${reason})`,
        type: 'cancellation',
        read: false,
        createdAt: new Date().toLocaleString('th-TH'),
        actionUrlTab: 'admin',
      },
    ];

    setNotifications((prev) => [...cancelNotifs, ...prev]);
  };

  // Confirm Match between patient booking and volunteer availability slot (Requirement 4)
  const handleConfirmMatch = (bookingId: string, slotId: string) => {
    healingSound.playChime(750, 0.8);
    const booking = bookings.find((b) => b.id === bookingId);
    const slot = availabilitySlots.find((s) => s.id === slotId);

    if (!booking || !slot) return;

    // Update booking
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              status: 'confirmed',
              isMatched: true,
              matchedAt: new Date().toLocaleString('th-TH'),
              matchedBy: 'Admin รพ.ชลบุรี',
              volunteerId: slot.volunteerId,
              volunteerName: slot.volunteerName,
              volunteerAvatar: slot.volunteerAvatar,
            }
          : b
      )
    );

    // Update slot
    setAvailabilitySlots((prev) =>
      prev.map((s) =>
        s.id === slotId
          ? {
              ...s,
              isBooked: true,
              bookedRequestId: bookingId,
            }
          : s
      )
    );

    // Send notifications + simulated emails to both parties
    const matchNotifs: NotificationItem[] = [
      {
        id: `NOTIF-MATCH-PT-${Date.now().toString().slice(-6)}`,
        recipientRole: 'patient',
        title: 'จับคู่จิตอาสาสำเร็จแล้ว! 🎉',
        message: `คุณได้รับการจับคู่จิตอาสา "${slot.volunteerName}" สำหรับนัดหมายวันที่ ${booking.date} เวลา ${booking.timeSlot} ที่ ${booking.patientInfo.hospitalName}`,
        type: 'match',
        read: false,
        createdAt: new Date().toLocaleString('th-TH'),
        emailSent: true,
        emailAddress: booking.patientInfo.contactPhone || 'patient.chonburi@example.com',
        actionUrlTab: 'my-bookings',
      },
      {
        id: `NOTIF-MATCH-VOL-${Date.now().toString().slice(-6)}`,
        recipientRole: 'volunteer',
        recipientId: slot.volunteerId,
        title: 'นัดหมายข้างเตียงได้รับการยืนยัน 📚',
        message: `Admin ยืนยันการจับคู่คุณกับผู้ป่วย "${booking.patientInfo.fullName}" ที่ ${booking.patientInfo.hospitalName} ${booking.patientInfo.ward} (${booking.patientInfo.bedNumber}) วันที่ ${booking.date} เวลา ${booking.timeSlot}`,
        type: 'match',
        read: false,
        createdAt: new Date().toLocaleString('th-TH'),
        emailSent: true,
        emailAddress: volunteers.find((v) => v.id === slot.volunteerId)?.email || 'volunteer@example.com',
        actionUrlTab: 'volunteer-audio',
      },
    ];

    setNotifications((prev) => [...matchNotifs, ...prev]);
  };

  // Resolve Audio Error Report (Admin - Requirement 2)
  const handleResolveErrorReport = (reportId: string, resolutionNotes: string) => {
    healingSound.playChime(680, 0.6);
    const report = audioErrorReports.find((r) => r.id === reportId);

    setAudioErrorReports((prev) =>
      prev.map((r) =>
        r.id === reportId
          ? {
              ...r,
              status: 'resolved',
              resolutionNotes,
              resolvedAt: new Date().toLocaleString('th-TH'),
              thankYouMessageSent: true,
            }
          : r
      )
    );

    // Thank you notification
    const thankYouNotif: NotificationItem = {
      id: `NOTIF-RPT-RES-${Date.now().toString().slice(-6)}`,
      recipientRole: 'patient',
      title: 'ข้อความขอบคุณและการแก้ไขปัญหาไฟล์เสียง ❤️',
      message: `เรียน ${report?.reporterName || 'ผู้รับบริการ'}: ปัญหาเรื่อง "${report?.storyTitle || 'ไฟล์เสียง'}" ได้รับการแก้ไขแล้ว: "${resolutionNotes}" ขอบคุณที่ช่วยแจ้งเพื่อยกระดับคุณภาพเสียงข้างเตียงค่ะ`,
      type: 'report',
      read: false,
      createdAt: new Date().toLocaleString('th-TH'),
      emailSent: true,
      emailAddress: report?.reporterContact,
    };
    setNotifications((prev) => [thankYouNotif, ...prev]);
  };

  // Submit Audio Error Report (Patient/User)
  const handleSubmitAudioErrorReport = (
    reportData: Omit<AudioErrorReport, 'id' | 'reportedAt' | 'status'>
  ) => {
    healingSound.playChime(640, 0.6);
    const newReport: AudioErrorReport = {
      ...reportData,
      id: `RPT-2026-${Date.now().toString().slice(-5)}`,
      reportedAt: new Date().toLocaleString('th-TH'),
      status: 'pending',
    };

    setAudioErrorReports((prev) => [newReport, ...prev]);

    // Notify admin
    const adminAlert: NotificationItem = {
      id: `NOTIF-RPT-NEW-${Date.now().toString().slice(-6)}`,
      recipientRole: 'admin',
      title: `รายงานปัญหาไฟล์เสียงใหม่: ${newReport.issueTypeLabel}`,
      message: `เรื่อง "${newReport.storyTitle}" โดย ${newReport.reporterName} รายละเอียด: ${newReport.description}`,
      type: 'report',
      read: false,
      createdAt: new Date().toLocaleString('th-TH'),
      actionUrlTab: 'admin',
    };
    setNotifications((prev) => [adminAlert, ...prev]);
  };

  // Submit Patient Evaluation (Requirement 5)
  const handleSubmitEvaluation = (
    evalData: Omit<ServiceEvaluation, 'id' | 'createdAt'>
  ) => {
    healingSound.playChime(720, 0.8);
    const newEval: ServiceEvaluation = {
      ...evalData,
      id: `EVAL-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toLocaleString('th-TH'),
    };

    setEvaluations((prev) => [newEval, ...prev]);

    // Mark booking as evaluated
    setBookings((prev) =>
      prev.map((b) => (b.id === evalData.bookingId ? { ...b, isEvaluated: true } : b))
    );

    // Notify volunteer
    const volNotif: NotificationItem = {
      id: `NOTIF-EVAL-VOL-${Date.now().toString().slice(-6)}`,
      recipientRole: 'volunteer',
      recipientId: evalData.volunteerId,
      title: 'ได้รับคะแนนประเมินความพึงพอใจใหม่ ⭐',
      message: `ผู้รับบริการได้ประเมินบริการของคุณ (${evalData.overallRating} ดาว): "${evalData.comments}"`,
      type: 'review',
      read: false,
      createdAt: new Date().toLocaleString('th-TH'),
      actionUrlTab: 'volunteer-audio',
    };

    // If low rating, trigger warning alert to Admin for review
    if (evalData.overallRating <= 2 || evalData.etiquetteRating <= 2) {
      const adminAlert: NotificationItem = {
        id: `NOTIF-EVAL-WARN-${Date.now().toString().slice(-6)}`,
        recipientRole: 'admin',
        title: 'ข้อเสนอแนะที่ต้องติดตาม (คะแนนต่ำกว่าเกณฑ์) ⚠️',
        message: `จิตอาสา ${evalData.volunteerName} ได้รับคะแนนประเมิน ${evalData.overallRating} ดาว: "${evalData.comments}"`,
        type: 'warning',
        read: false,
        createdAt: new Date().toLocaleString('th-TH'),
        actionUrlTab: 'admin',
      };
      setNotifications((prev) => [volNotif, adminAlert, ...prev]);
    } else {
      setNotifications((prev) => [volNotif, ...prev]);
    }
  };

  // Issue Warning to volunteer (Admin - Requirement 5)
  const handleIssueWarning = (
    volunteerId: string,
    volunteerName: string,
    reason: string,
    severity: 'advisory' | 'warning' | 'critical'
  ) => {
    healingSound.playClickBeep();
    const newWarning: VolunteerWarning = {
      id: `WARN-${Date.now().toString().slice(-6)}`,
      volunteerId,
      volunteerName,
      reason,
      severity,
      issuedBy: 'Admin ศูนย์จิตอาสารพ.ชลบุรี',
      issuedAt: new Date().toLocaleString('th-TH'),
      acknowledged: false,
    };

    setWarnings((prev) => [newWarning, ...prev]);

    // Notify volunteer with simulated email
    const volAlert: NotificationItem = {
      id: `NOTIF-WARN-${Date.now().toString().slice(-6)}`,
      recipientRole: 'volunteer',
      recipientId: volunteerId,
      title: `ข้อความแจ้งเตือน / ให้คำแนะนำการปฏิบัติงาน (${severity.toUpperCase()}) ⚠️`,
      message: `เหตุผล: ${reason} โปรดอ่านและกดรับทราบในพอร์ทัลจิตอาสา`,
      type: 'warning',
      read: false,
      createdAt: new Date().toLocaleString('th-TH'),
      emailSent: true,
      emailAddress: volunteers.find((v) => v.id === volunteerId)?.email || 'volunteer@example.com',
      actionUrlTab: 'volunteer-audio',
    };

    setNotifications((prev) => [volAlert, ...prev]);
  };

  // Acknowledge warning (Volunteer)
  const handleAcknowledgeWarning = (id: string) => {
    healingSound.playClickBeep();
    setWarnings((prev) =>
      prev.map((w) => (w.id === id ? { ...w, acknowledged: true } : w))
    );
  };

  // Add Availability Slot (Volunteer - Requirement 3)
  const handleAddAvailabilitySlot = (
    slot: Omit<VolunteerAvailabilitySlot, 'id' | 'createdAt' | 'isBooked'>
  ) => {
    healingSound.playChime(640, 0.6);
    const newSlot: VolunteerAvailabilitySlot = {
      ...slot,
      id: `SLOT-VOL-${Date.now().toString().slice(-5)}`,
      isBooked: false,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setAvailabilitySlots((prev) => [newSlot, ...prev]);
  };

  // Delete Availability Slot (Volunteer)
  const handleDeleteAvailabilitySlot = (id: string) => {
    healingSound.playClickBeep();
    setAvailabilitySlots((prev) => prev.filter((s) => s.id !== id));
  };

  // Request Certificate (Volunteer - Requirement 6)
  const handleRequestCertificate = (
    certData: Omit<CertificateRequest, 'id' | 'status' | 'createdAt'>
  ) => {
    healingSound.playChime(720, 0.8);
    const newReq: CertificateRequest = {
      ...certData,
      id: `CERT-REQ-${Date.now().toString().slice(-5)}`,
      status: 'pending',
      createdAt: new Date().toLocaleString('th-TH'),
    };

    setCertificateRequests((prev) => [newReq, ...prev]);

    // Notify Admin
    const adminNotif: NotificationItem = {
      id: `NOTIF-CERT-REQ-${Date.now().toString().slice(-6)}`,
      recipientRole: 'admin',
      title: 'มีคำขอเกียรติบัตรจิตอาสาใหม่ 🏆',
      message: `จิตอาสา ${newReq.volunteerName} ยื่นขอเกียรติบัตร (ไฟล์เสียง ${newReq.onlineAudioCount} ไฟล์, ข้างเตียง ${newReq.onsiteSessionCount} ครั้ง)`,
      type: 'certificate',
      read: false,
      createdAt: new Date().toLocaleString('th-TH'),
      actionUrlTab: 'admin',
    };
    setNotifications((prev) => [adminNotif, ...prev]);
  };

  // Approve Certificate (Admin - Requirement 6)
  const handleApproveCertificate = (requestId: string) => {
    healingSound.playChime(800, 0.8);
    const certNum = requestId.replace(/\D/g, '').slice(-4).padStart(4, '0') || '0128';
    const certId = `RH-CERT-2026-${certNum}`;
    const target = certificateRequests.find((c) => c.id === requestId);

    setCertificateRequests((prev) =>
      prev.map((c) =>
        c.id === requestId
          ? {
              ...c,
              status: 'approved',
              certificateId: certId,
              reviewedBy: 'พยาบาลวิชาชีพ กนกวรรณ (รพ.ชลบุรี)',
              reviewedAt: new Date().toLocaleString('th-TH'),
            }
          : c
      )
    );

    // Notify volunteer with simulated email & certificate link
    const volNotif: NotificationItem = {
      id: `NOTIF-CERT-OK-${Date.now().toString().slice(-6)}`,
      recipientRole: 'volunteer',
      recipientId: target?.volunteerId,
      title: 'คำขอเกียรติบัตรได้รับการอนุมัติแล้ว! 🏆',
      message: `ยินดีด้วยค่ะ เกียรติบัตรรับรองจิตอาสา ReadHeal ของคุณได้รับการอนุมัติเรียบร้อยแล้ว (รหัส: ${certId}) สามารถดาวน์โหลดหรือพิมพ์ได้ทันที และส่งสำเนาเข้าอีเมลเรียบร้อยแล้ว`,
      type: 'certificate',
      read: false,
      createdAt: new Date().toLocaleString('th-TH'),
      emailSent: true,
      emailAddress: target?.email || 'volunteer@example.com',
      actionUrlTab: 'volunteer-audio',
    };
    setNotifications((prev) => [volNotif, ...prev]);
  };

  // Reject Certificate (Admin - Requirement 6)
  const handleRejectCertificate = (requestId: string, reason: string) => {
    healingSound.playClickBeep();
    const target = certificateRequests.find((c) => c.id === requestId);

    setCertificateRequests((prev) =>
      prev.map((c) =>
        c.id === requestId
          ? {
              ...c,
              status: 'rejected',
              rejectionReason: reason,
              reviewedBy: 'พยาบาลวิชาชีพ กนกวรรณ (รพ.ชลบุรี)',
              reviewedAt: new Date().toLocaleString('th-TH'),
            }
          : c
      )
    );

    // Notify volunteer with reason
    const volNotif: NotificationItem = {
      id: `NOTIF-CERT-REJ-${Date.now().toString().slice(-6)}`,
      recipientRole: 'volunteer',
      recipientId: target?.volunteerId,
      title: 'ผลการพิจารณาคำขอเกียรติบัตรจิตอาสา',
      message: `คำขอเกียรติบัตรยังไม่ผ่านการอนุมัติ (เหตุผล: ${reason}) คุณสามารถส่งผลงานเพิ่มเติมและยื่นขอใหม่ได้เสมอค่ะ`,
      type: 'warning',
      read: false,
      createdAt: new Date().toLocaleString('th-TH'),
      emailSent: true,
      emailAddress: target?.email || 'volunteer@example.com',
      actionUrlTab: 'volunteer-audio',
    };
    setNotifications((prev) => [volNotif, ...prev]);
  };

  // View Certificate
  const handleViewCertificate = (certificate: CertificateRequest) => {
    healingSound.playClickBeep();
    setActiveCertificateModal(certificate);
  };

  // Notification center read handlers
  const handleMarkAllNotificationsRead = () => {
    healingSound.playClickBeep();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleMarkNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // Submit new audio from Volunteer
  const handleSubmitAudio = (newSubmission: AudioSubmission) => {
    healingSound.playChime(640, 0.6);
    setAudioSubmissions((prev) => [newSubmission, ...prev]);
  };

  // Delete audio submission
  const handleDeleteSubmission = (id: string) => {
    healingSound.playClickBeep();
    setAudioSubmissions((prev) => prev.filter((s) => s.id !== id));
  };

  // Approve audio submission (Admin)
  const handleApproveSubmission = (id: string, adminNotes?: string) => {
    healingSound.playChime(720, 0.8);
    const target = audioSubmissions.find((s) => s.id === id);

    setAudioSubmissions((prev) =>
      prev.map((sub) =>
        sub.id === id
          ? {
              ...sub,
              status: 'approved',
              adminNotes:
                adminNotes ||
                'ผ่านการตรวจสอบคุณภาพเสียงและการอ่านเรียบร้อยแล้ว ได้มาตรฐานโรงพยาบาลชลบุรี',
              reviewedAt: new Date().toISOString(),
              reviewerName: 'พยาบาลวิชาชีพ กนกวรรณ (Admin รพ.ชลบุรี)',
            }
          : sub
      )
    );

    // If approved, automatically promote to active public stories so patients can immediately listen!
    if (target) {
      const newStory: Story = {
        id: `story-${target.id}`,
        title: target.title,
        thaiTitle: target.title,
        categoryId: target.categoryId,
        categoryName: target.categoryName,
        duration: target.durationFormatted || '03:00',
        durationSeconds: target.durationSeconds || 180,
        author: target.author || target.volunteerName,
        readerName: target.volunteerName,
        readerId: target.volunteerId,
        readerAvatar:
          volunteers.find((v) => v.id === target.volunteerId)?.avatar ||
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
        readerBadge: 'จิตอาสาที่ผ่านการรับรอง',
        listenCount: 1,
        rating: 5.0,
        recommendedFor: target.targetConditions.join(', ') || 'พักฟื้นทั่วไป',
        audioTone: target.audioTone || 'อบอุ่น นุ่มนวล',
        coverImage:
          'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800',
        excerpt:
          target.excerpt ||
          'เรื่องเล่าบำบัดใจที่บันทึกโดยจิตอาสาเพื่อมอบพลังใจแก่ผู้ป่วยข้างเตียงในชลบุรี',
        fullText:
          target.fullScript ||
          target.excerpt ||
          'เรื่องเล่าที่ส่งมอบกำลังใจและบรรยากาศอันสงบข้างเตียง...',
        likes: 12,
        tags: ['จิตอาสา', 'เรื่องเล่าใหม่', 'ผ่านการอนุมัติ', 'ชลบุรี'],
        audioUrl: target.audioUrl,
      };

      setStories((prev) => {
        if (prev.some((s) => s.id === newStory.id)) return prev;
        return [newStory, ...prev];
      });
    }
  };

  // Reject audio submission (Admin)
  const handleRejectSubmission = (id: string, reason: string, adminNotes?: string) => {
    healingSound.playClickBeep();
    setAudioSubmissions((prev) =>
      prev.map((sub) =>
        sub.id === id
          ? {
              ...sub,
              status: 'rejected',
              rejectionReason: reason,
              adminNotes: adminNotes || '',
              reviewedAt: new Date().toISOString(),
              reviewerName: 'พยาบาลวิชาชีพ กนกวรรณ (Admin รพ.ชลบุรี)',
            }
          : sub
      )
    );
  };

  // Play audio submission in floating bedside player
  const handlePlaySubmissionInBedside = (submission: AudioSubmission) => {
    const pseudoStory: Story = {
      id: `sub-${submission.id}`,
      title: submission.title,
      thaiTitle: submission.title,
      categoryId: submission.categoryId,
      categoryName: submission.categoryName,
      duration: submission.durationFormatted,
      durationSeconds: submission.durationSeconds,
      author: submission.author,
      readerName: submission.volunteerName,
      readerId: submission.volunteerId,
      readerAvatar:
        volunteers.find((v) => v.id === submission.volunteerId)?.avatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      readerBadge: 'จิตอาสา ReadHeal',
      listenCount: 0,
      rating: 5.0,
      recommendedFor: submission.targetConditions.join(', ') || 'ผู้ป่วยทั่วไป',
      audioTone: submission.audioTone,
      coverImage:
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800',
      excerpt: submission.excerpt,
      fullText: submission.fullScript || submission.excerpt,
      likes: 8,
      tags: ['ไฟล์เสียงทดสอบ', 'จิตอาสา'],
      audioUrl: submission.audioUrl,
    };
    handlePlayStory(pseudoStory);
  };

  // Smoothly reset user role and return to main 3-role selection landing page
  const handleResetToRoleLanding = () => {
    healingSound.playClickBeep();
    setCurrentRole(null);
    setActiveTab('home');
    setSearchQuery('');
    setBookingPreselectedVolunteer(null);
    setBookingPreselectedStory(null);
  };

  // Smart navigation tab switch handler that activates the correct role and tab without dead clicks
  const handleNavigateTab = (
    tab: 'home' | 'volunteer-register' | 'volunteer-audio' | 'booking' | 'admin' | 'my-bookings'
  ) => {
    healingSound.playClickBeep();

    // Automatically resolve user role so the requested view displays immediately
    if (tab === 'volunteer-register' || tab === 'volunteer-audio') {
      setCurrentRole('volunteer');
    } else if (tab === 'admin') {
      if (!currentAdminUser && currentRole !== 'admin') {
        setIsAdminLoginModalOpen(true);
        return;
      }
      setCurrentRole('admin');
    } else if (tab === 'booking' || tab === 'my-bookings') {
      if (currentRole === null || currentRole === 'admin') {
        setCurrentRole('patient');
      }
    } else if (tab === 'home') {
      if (currentRole === null) {
        setCurrentRole('patient');
      }
    }

    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Direct role selection handler that cleanly switches role and sets the primary dashboard tab
  const handleSelectRole = (role: UserRole) => {
    healingSound.playClickBeep();
    if (role === 'admin' && !currentAdminUser) {
      setIsAdminLoginModalOpen(true);
      return;
    }
    setCurrentRole(role);
    if (role === 'admin') {
      setActiveTab('admin');
    } else if (role === 'volunteer') {
      setActiveTab('volunteer-audio');
    } else if (role === 'patient') {
      setActiveTab('home');
    } else {
      setActiveTab('home');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-['Prompt',sans-serif]">
      {/* Top Main Navigation Bar */}
      <Navbar
        currentRole={currentRole}
        currentVolunteer={currentVolunteerUser}
        onSelectRole={handleSelectRole}
        onResetToLanding={handleResetToRoleLanding}
        activeTab={activeTab}
        setActiveTab={handleNavigateTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        bookingCount={bookings.filter((b) => b.status === 'confirmed' || b.status === 'pending').length}
        pendingAudioCount={audioSubmissions.filter((s) => s.status === 'pending').length}
        notificationCount={notifications.filter((n) => !n.read).length}
        onOpenInfoModal={() => setIsAboutModalOpen(true)}
        onOpenRoleSelector={() => setIsRoleModalOpen(true)}
        onOpenNotificationCenter={() => setIsNotificationModalOpen(true)}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        {/* If user has not selected role yet, show RoleSelectionPage (Page 1: Landing / Login Gateway) */}
        {currentRole === null ? (
          <RoleSelectionPage
            onSelectRole={handleSelectRoleFromGateway}
            onOpenVolunteerLogin={() => setIsVolunteerLoginModalOpen(true)}
            onOpenAdminLogin={() => setIsAdminLoginModalOpen(true)}
            onExploreDirectly={() => {
              setCurrentRole('patient');
              setActiveTab('home');
            }}
          />
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {/* TAB 1: Main Dashboard (Browse Hub) */}
            {activeTab === 'home' && (
              <MainDashboard
                categories={categories}
                volunteers={volunteers}
                stories={stories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                searchQuery={searchQuery}
                onPlayStory={handlePlayStory}
                currentPlayingStoryId={playerState.currentStory?.id || null}
                isAudioPlaying={playerState.isPlaying}
                onViewStoryDetails={(story) => setActiveStoryModal(story)}
                onViewVolunteerDetails={(vol) => setActiveVolunteerModal(vol)}
                onStartBookingWithVolunteer={handleStartBookingWithVolunteer}
                onNavigateToBooking={() => {
                  setBookingPreselectedVolunteer(null);
                  setBookingPreselectedStory(null);
                  setActiveTab('booking');
                }}
                onResetToLanding={handleResetToRoleLanding}
              />
            )}

            {/* TAB 2: Volunteer Registration & Profile Form */}
            {activeTab === 'volunteer-register' && (
              <VolunteerRegistration
                onRegisterSuccess={handleRegisterVolunteer}
                onCancel={() => setActiveTab('home')}
                onResetToLanding={handleResetToRoleLanding}
              />
            )}

            {/* TAB 2.5: Volunteer Audio Upload, Hours Tracking, Certificate & Feedback Portal */}
            {activeTab === 'volunteer-audio' && (
              <VolunteerAudioPortal
                volunteer={currentVolunteerUser || volunteers[0]}
                submissions={audioSubmissions}
                categories={categories}
                onSubmitAudio={handleSubmitAudio}
                onDeleteSubmission={handleDeleteSubmission}
                onPlayInBedsidePlayer={handlePlaySubmissionInBedside}
                onResetToLanding={handleResetToRoleLanding}
                evaluations={evaluations}
                warnings={warnings.filter((w) => !currentVolunteerUser || w.volunteerId === currentVolunteerUser.id)}
                onAcknowledgeWarning={handleAcknowledgeWarning}
                availabilitySlots={availabilitySlots}
                onAddAvailabilitySlot={handleAddAvailabilitySlot}
                onDeleteAvailabilitySlot={handleDeleteAvailabilitySlot}
                certificateRequests={certificateRequests.filter((c) => !currentVolunteerUser || c.volunteerId === currentVolunteerUser.id)}
                onRequestCertificate={handleRequestCertificate}
                onViewCertificate={handleViewCertificate}
                onsiteCompletedCount={bookings.filter((b) => b.status === 'completed' && (!currentVolunteerUser || b.volunteerId === currentVolunteerUser.id)).length || 3}
              />
            )}

            {/* TAB 3: Patient Information & Multi-Slot Booking Flow */}
            {activeTab === 'booking' && (
              <PatientBookingFlow
                volunteers={volunteers}
                categories={categories}
                stories={stories}
                preSelectedVolunteer={bookingPreselectedVolunteer}
                preSelectedStory={bookingPreselectedStory}
                onBookingSuccess={handleBookingSuccess}
                onCancel={() => {
                  setBookingPreselectedVolunteer(null);
                  setBookingPreselectedStory(null);
                  setActiveTab('home');
                }}
                onResetToLanding={handleResetToRoleLanding}
                availabilitySlots={availabilitySlots}
              />
            )}

            {/* TAB 4: Admin Dashboard - Audio Review, Matching, Error Reports, Evaluations & Certificates */}
            {activeTab === 'admin' && (
              <AdminDashboard
                bookings={bookings}
                onUpdateBookingStatus={handleUpdateBookingStatus}
                volunteers={volunteers}
                stories={stories}
                onViewVolunteer={(vol) => setActiveVolunteerModal(vol)}
                audioSubmissions={audioSubmissions}
                onApproveSubmission={handleApproveSubmission}
                onRejectSubmission={handleRejectSubmission}
                onResetToLanding={handleResetToRoleLanding}
                audioErrorReports={audioErrorReports}
                onResolveErrorReport={handleResolveErrorReport}
                availabilitySlots={availabilitySlots}
                onConfirmMatch={handleConfirmMatch}
                evaluations={evaluations}
                onIssueWarning={handleIssueWarning}
                certificateRequests={certificateRequests}
                onApproveCertificate={handleApproveCertificate}
                onRejectCertificate={handleRejectCertificate}
                onViewCertificate={handleViewCertificate}
                currentAdmin={currentAdminUser}
                onAdminLogout={handleAdminLogout}
              />
            )}

            {/* TAB 5: My Bookings & Schedule with Cancellation & Anonymous Evaluation */}
            {activeTab === 'my-bookings' && (
              <MyBookingsView
                bookings={bookings}
                onNavigateToBooking={() => {
                  setBookingPreselectedVolunteer(null);
                  setBookingPreselectedStory(null);
                  setActiveTab('booking');
                }}
                onCancelBooking={handleCancelBooking}
                onResetToLanding={handleResetToRoleLanding}
                onSubmitEvaluation={handleSubmitEvaluation}
              />
            )}
          </div>
        )}
      </main>

      {/* Floating / Bedside Audio Player Bar */}
      <BedsideAudioPlayer
        playerState={playerState}
        setPlayerState={setPlayerState}
        onClose={() => {
          setPlayerState((prev) => ({ ...prev, isPlaying: false, currentStory: null }));
          healingSound.stopAmbient();
        }}
        onOpenTranscript={(story) => setActiveStoryModal(story)}
        onReportError={(story) => setActiveAudioReportModal(story)}
      />

      {/* Story Reader Fullscreen / Modal */}
      <StoryModal
        story={activeStoryModal}
        onClose={() => setActiveStoryModal(null)}
        onPlay={handlePlayStory}
        isPlaying={
          playerState.currentStory?.id === activeStoryModal?.id &&
          playerState.isPlaying
        }
        onBookWithReader={(volunteer, story) => {
          handleStartBookingWithVolunteer(volunteer, story);
        }}
        volunteers={volunteers}
        onReportError={(story) => setActiveAudioReportModal(story)}
      />

      {/* Volunteer Profile Detailed Modal */}
      <VolunteerProfileModal
        volunteer={activeVolunteerModal}
        onClose={() => setActiveVolunteerModal(null)}
        onBook={(vol) => handleStartBookingWithVolunteer(vol)}
        stories={stories}
        onPlayStory={handlePlayStory}
      />

      {/* Quick Role Switcher Dialog */}
      <RoleSelectionModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        currentRole={currentRole}
        onSelectRole={(role) => {
          handleSelectRole(role);
          setIsRoleModalOpen(false);
        }}
        onOpenAdminLogin={() => {
          setIsRoleModalOpen(false);
          setIsAdminLoginModalOpen(true);
        }}
        onResetToLanding={handleResetToRoleLanding}
      />

      {/* Volunteer Reader Verification & Login Dialog */}
      <VolunteerLoginModal
        isOpen={isVolunteerLoginModalOpen}
        onClose={() => setIsVolunteerLoginModalOpen(false)}
        volunteers={volunteers}
        onLoginSuccess={handleVolunteerLoginSuccess}
        onGoToRegistration={handleGoToVolunteerRegistration}
      />

      {/* Hospital Admin Login & Authentication Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={() => setIsAdminLoginModalOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />

      {/* About Project & Hospital Network Dialog */}
      <AboutProjectModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />

      {/* Notification Center & Email System Dialog */}
      <NotificationCenterModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllNotificationsRead}
        onMarkAsRead={handleMarkNotificationRead}
        onNavigateTab={(tab) => {
          setIsNotificationModalOpen(false);
          handleNavigateTab(tab);
        }}
      />

      {/* Digital Certificate Viewer & Print Modal */}
      <DigitalCertificateModal
        isOpen={activeCertificateModal !== null}
        onClose={() => setActiveCertificateModal(null)}
        certificate={activeCertificateModal}
        volunteer={
          volunteers.find((v) => v.id === activeCertificateModal?.volunteerId) ||
          currentVolunteerUser
        }
      />

      {/* Audio Error Report Modal */}
      <AudioErrorReportModal
        isOpen={activeAudioReportModal !== null}
        onClose={() => setActiveAudioReportModal(null)}
        targetItem={activeAudioReportModal}
        onSubmitReport={handleSubmitAudioErrorReport}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-8 px-4 sm:px-6 lg:px-8 mt-auto text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">ReadHeal</span>
            <span>(เตียงนี้มีเรื่องเล่า)</span>
            <span className="text-slate-300">|</span>
            <span>โครงการจิตอาสาอ่านหนังสือบำบัดใจเพื่อผู้ป่วยในโรงพยาบาล</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setIsAboutModalOpen(true)}
              className="hover:text-sky-600 transition-colors"
            >
              แนวคิดโครงการ
            </button>
            <span>•</span>
            <button
              onClick={() => {
                setCurrentRole('volunteer');
                setActiveTab('volunteer-register');
              }}
              className="hover:text-sky-600 transition-colors"
            >
              ร่วมเป็นจิตอาสา
            </button>
            <span>•</span>
            <button
              onClick={() => {
                if (currentRole === 'admin' || currentAdminUser) {
                  setCurrentRole('admin');
                  setActiveTab('admin');
                } else {
                  setIsAdminLoginModalOpen(true);
                }
              }}
              className="hover:text-purple-600 transition-colors"
            >
              สำหรับเจ้าหน้าที่โรงพยาบาล (Admin)
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
