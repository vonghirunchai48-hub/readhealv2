export interface ChonburiHospital {
  id: string;
  name: string;
  nameEn: string;
  district: string; // อำเภอ
  zone: string;
  type: 'university' | 'public_center' | 'community' | 'private';
  typeLabel: string;
  address: string;
  phone: string;
  suggestedWards: string[];
  visitingHours: string;
  highlight?: boolean;
  beds?: number;
}

export const CHONBURI_HOSPITALS: ChonburiHospital[] = [
  {
    id: 'buu-hospital',
    name: 'โรงพยาบาลมหาวิทยาลัยบูรพา',
    nameEn: 'Burapha University Hospital',
    district: 'อำเภอเมืองชลบุรี',
    zone: 'โซนเมืองชลบุรี-บางแสน',
    type: 'university',
    typeLabel: 'โรงพยาบาลมหาวิทยาลัย',
    address: '169 ถ.ลงหาดบางแสน ต.แสนสุข อ.เมืองชลบุรี จ.ชลบุรี 20131',
    phone: '038-394-850',
    suggestedWards: [
      'หอผู้ป่วยอายุรกรรม ชั้น 6',
      'หอผู้ป่วยศัลยกรรม ชั้น 5',
      'หอผู้ป่วยกุมารเวชกรรม ชั้น 4',
      'หอผู้ป่วยพิเศษบูรพา ชั้น 7',
      'ศูนย์ฟื้นฟูสมรรถภาพและกายภาพบำบัด',
    ],
    visitingHours: '11:00 - 20:00 น.',
    highlight: true,
  },
  {
    id: 'chonburi-hospital',
    name: 'โรงพยาบาลชลบุรี',
    nameEn: 'Chonburi Hospital',
    district: 'อำเภอเมืองชลบุรี',
    zone: 'โซนเมืองชลบุรี-บางแสน',
    type: 'public_center',
    typeLabel: 'โรงพยาบาลศูนย์ประจำจังหวัด',
    address: '69 หมู่ 2 ถ.สุขุมวิท ต.บ้านสวน อ.เมืองชลบุรี จ.ชลบุรี 20000',
    phone: '038-931-000',
    suggestedWards: [
      'อาคารผู้ป่วยใน 84 พรรษา ชั้น 5',
      'หอผู้ป่วยอายุรกรรมรวม ตึก 50 ปี',
      'หอผู้ป่วยกระดูกและข้อ ชั้น 4',
      'หอผู้ป่วยเด็กและทารกแรกเกิด',
      'หอผู้ป่วยเคมีบำบัดและรังสีรักษา',
    ],
    visitingHours: '12:00 - 14:00 น. และ 17:00 - 20:00 น.',
    highlight: true,
  },
  {
    id: 'sriracha-queen-memorial',
    name: 'โรงพยาบาลสมเด็จพระบรมราชเทวี ณ ศรีราชา',
    nameEn: 'Queen Savang Vadhana Memorial Hospital (Red Cross)',
    district: 'อำเภอศรีราชา',
    zone: 'โซนศรีราชา-แหลมฉบัง',
    type: 'public_center',
    typeLabel: 'โรงพยาบาลสภากาชาดไทย',
    address: '290 ถ.เจิมจอมพล ต.ศรีราชา อ.ศรีราชา จ.ชลบุรี 20110',
    phone: '038-320-200',
    suggestedWards: [
      'อาคารศรีสวรินทิรานุสรณ์ 150 ปี ชั้น 8',
      'หอผู้ป่วยอายุรกรรมชาย-หญิง',
      'หอผู้ป่วยพักฟื้นผู้สูงอายุ',
      'หอผู้ป่วยพิเศษกษัตริยานุสรณ์',
    ],
    visitingHours: '11:00 - 19:30 น.',
    highlight: true,
  },
  {
    id: 'banglamung-hospital',
    name: 'โรงพยาบาลบางละมุง',
    nameEn: 'Banglamung Hospital',
    district: 'อำเภอบางละมุง',
    zone: 'โซนพัทยา-บางละมุง',
    type: 'public_center',
    typeLabel: 'โรงพยาบาลทั่วไป',
    address: '66/3 หมู่ 5 ถ.สุขุมวิท ต.นาเกลือ อ.บางละมุง จ.ชลบุรี 20150',
    phone: '038-429-244',
    suggestedWards: [
      'หอผู้ป่วยอายุรกรรม ชั้น 3',
      'หอผู้ป่วยศัลยกรรมอุบัติเหตุ',
      'หอผู้ป่วยสูติ-นรีเวชกรรม',
      'หอผู้ป่วยพิเศษบางละมุง',
    ],
    visitingHours: '11:30 - 14:00 น. และ 17:00 - 20:00 น.',
  },
  {
    id: 'laemchabang-hospital',
    name: 'โรงพยาบาลแหลมฉบัง',
    nameEn: 'Laem Chabang Hospital',
    district: 'อำเภอศรีราชา',
    zone: 'โซนศรีราชา-แหลมฉบัง',
    type: 'public_center',
    typeLabel: 'โรงพยาบาลชุมชนขนาดใหญ่',
    address: '269 หมู่ 6 ต.ทุ่งสุขลา อ.ศรีราชา จ.ชลบุรี 20230',
    phone: '038-354-999',
    suggestedWards: [
      'หอผู้ป่วยสามัญ 1 ชั้น 3',
      'หอผู้ป่วยพักฟื้นหลังผ่าตัด',
      'หอผู้ป่วยกุมารเวชกรรม',
    ],
    visitingHours: '12:00 - 14:00 น. และ 17:00 - 19:30 น.',
  },
  {
    id: 'queen-sirikit-naval',
    name: 'โรงพยาบาลสมเด็จพระนางเจ้าสิริกิติ์',
    nameEn: 'Queen Sirikit Naval Hospital',
    district: 'อำเภอสัตหีบ',
    zone: 'โซนสัตหีบ',
    type: 'public_center',
    typeLabel: 'โรงพยาบาลทหารเรือ/ระดับตติยภูมิ',
    address: '111 หมู่ 2 ต.พลูตาหลวง อ.สัตหีบ จ.ชลบุรี 20180',
    phone: '038-245-735',
    suggestedWards: [
      'อาคารผู้ป่วยใน 10 ชั้น หอผู้ป่วยอายุรกรรม',
      'หอผู้ป่วยศัลยกรรมกระดูก',
      'หอผู้ป่วยพิเศษนาวีอนุสรณ์',
    ],
    visitingHours: '12:00 - 14:00 น. และ 17:00 - 20:00 น.',
  },
  {
    id: 'sattahip-km10',
    name: 'โรงพยาบาลสัตหีบ กม.10',
    nameEn: 'Sattahip Km.10 Hospital',
    district: 'อำเภอสัตหีบ',
    zone: 'โซนสัตหีบ',
    type: 'community',
    typeLabel: 'โรงพยาบาลชุมชน',
    address: 'หมู่ 1 ถ.สุขุมวิท กม.10 ต.สัตหีบ อ.สัตหีบ จ.ชลบุรี 20180',
    phone: '038-245-021',
    suggestedWards: [
      'หอผู้ป่วยในรวม ชั้น 2',
      'หอผู้ป่วยพักฟื้น',
    ],
    visitingHours: '11:00 - 13:30 น. และ 17:00 - 19:30 น.',
  },
  {
    id: 'banbueng-hospital',
    name: 'โรงพยาบาลบ้านบึง',
    nameEn: 'Ban Bueng Hospital',
    district: 'อำเภอบ้านบึง',
    zone: 'โซนบ้านบึง-พนัสนิคม',
    type: 'community',
    typeLabel: 'โรงพยาบาลชุมชน',
    address: '228 หมู่ 1 ต.บ้านบึง อ.บ้านบึง จ.ชลบุรี 20170',
    phone: '038-443-661',
    suggestedWards: [
      'หอผู้ป่วยอายุรกรรม ชั้น 2',
      'หอผู้ป่วยศัลยกรรมและอุบัติเหตุ',
    ],
    visitingHours: '12:00 - 14:00 น. และ 17:00 - 19:30 น.',
  },
  {
    id: 'phanatnikhom-hospital',
    name: 'โรงพยาบาลพนัสนิคม',
    nameEn: 'Phanat Nikhom Hospital',
    district: 'อำเภอพนัสนิคม',
    zone: 'โซนบ้านบึง-พนัสนิคม',
    type: 'community',
    typeLabel: 'โรงพยาบาลชุมชน',
    address: '111 ถ.ศุขประยูร ต.พนัสนิคม อ.พนัสนิคม จ.ชลบุรี 20140',
    phone: '038-461-244',
    suggestedWards: [
      'หอผู้ป่วยในชาย-หญิง',
      'หอผู้ป่วยกุมารและฟื้นฟู',
    ],
    visitingHours: '12:00 - 14:00 น. และ 17:00 - 19:30 น.',
  },
  {
    id: 'phanthong-hospital',
    name: 'โรงพยาบาลพานทอง',
    nameEn: 'Phan Thong Hospital',
    district: 'อำเภอพานทอง',
    zone: 'โซนพานทอง-อมตะนคร',
    type: 'community',
    typeLabel: 'โรงพยาบาลชุมชน',
    address: 'หมู่ 4 ต.พานทอง อ.พานทอง จ.ชลบุรี 20160',
    phone: '038-451-244',
    suggestedWards: [
      'หอผู้ป่วยในรวม ตึก 2',
    ],
    visitingHours: '12:00 - 14:00 น. และ 17:00 - 19:30 น.',
  },
  {
    id: 'phyathai-sriracha',
    name: 'โรงพยาบาลพญาไท ศรีราชา',
    nameEn: 'Phyathai Sriracha Hospital',
    district: 'อำเภอศรีราชา',
    zone: 'โซนศรีราชา-แหลมฉบัง',
    type: 'private',
    typeLabel: 'โรงพยาบาลเอกชน',
    address: '90 ถ.ศรีราชานคร 3 ต.ศรีราชา อ.ศรีราชา จ.ชลบุรี 20110',
    phone: '038-317-333',
    suggestedWards: [
      'หอผู้ป่วยพิเศษ ชั้น 9-11',
      'หอผู้ป่วยอายุรกรรม ชั้น 7',
      'หอผู้ป่วยศัลยกรรมและพักฟื้น',
    ],
    visitingHours: '09:00 - 20:00 น.',
  },
  {
    id: 'bangkok-pattaya',
    name: 'โรงพยาบาลกรุงเทพพัทยา',
    nameEn: 'Bangkok Hospital Pattaya',
    district: 'อำเภอบางละมุง',
    zone: 'โซนพัทยา-บางละมุง',
    type: 'private',
    typeLabel: 'โรงพยาบาลเอกชน',
    address: '301 หมู่ 6 ถ.สุขุมวิท กม.143 ต.นาเกลือ อ.บางละมุง จ.ชลบุรี 20150',
    phone: '038-259-999',
    suggestedWards: [
      'Ward 7A (Medical)',
      'Ward 8B (Surgical Recovery)',
      'Pediatric Care Ward',
      'Executive Deluxe Suite',
    ],
    visitingHours: '08:00 - 21:00 น.',
  },
  {
    id: 'samitivej-sriracha',
    name: 'โรงพยาบาลสมิติเวช ศรีราชา',
    nameEn: 'Samitivej Sriracha Hospital',
    district: 'อำเภอศรีราชา',
    zone: 'โซนศรีราชา-แหลมฉบัง',
    type: 'private',
    typeLabel: 'โรงพยาบาลเอกชน',
    address: '8 ซอยแหลมเกตุ ต.ศรีราชา อ.ศรีราชา จ.ชลบุรี 20110',
    phone: '038-320-300',
    suggestedWards: [
      'หอผู้ป่วยเดี่ยวพิเศษ ชั้น 5',
      'หอผู้ป่วยฟื้นฟูสุขภาพ',
    ],
    visitingHours: '09:00 - 20:00 น.',
  },
  {
    id: 'aekchon-hospital',
    name: 'โรงพยาบาลเอกชล',
    nameEn: 'Aekchon Hospital',
    district: 'อำเภอเมืองชลบุรี',
    zone: 'โซนเมืองชลบุรี-บางแสน',
    type: 'private',
    typeLabel: 'โรงพยาบาลเอกชน',
    address: '55/36 หมู่ 2 ถ.พระยาสัจจา ต.บ้านสวน อ.เมืองชลบุรี จ.ชลบุรี 20000',
    phone: '038-939-999',
    suggestedWards: [
      'หอผู้ป่วยพิเศษ ชั้น 4',
      'หอผู้ป่วยอายุรกรรม ชั้น 3',
    ],
    visitingHours: '09:00 - 20:00 น.',
  },
];

export const CHONBURI_DISTRICTS: string[] = Array.from(
  new Set(CHONBURI_HOSPITALS.map((h) => h.district))
);

export const CHONBURI_ZONES = [
  'ทั้งหมดในจังหวัดชลบุรี',
  'โซนเมืองชลบุรี-บางแสน',
  'โซนศรีราชา-แหลมฉบัง',
  'โซนพัทยา-บางละมุง',
  'โซนสัตหีบ',
  'โซนบ้านบึง-พนัสนิคม',
];

export const COMMON_DISEASE_SUGGESTIONS = [
  'พักฟื้นหลังการผ่าตัด',
  'โรคหัวใจและหลอดเลือด',
  'โรคไตเรื้อรัง / ฟอกเลือด',
  'เคมีบำบัด / รักษามะเร็ง',
  'โรคหลอดเลือดสมอง (Stroke)',
  'กระดูกหัก / รอผ่าตัดกระดูก',
  'ปอดอักเสบ / ระบบทางเดินหายใจ',
  'ไข้หวัดใหญ่ / กุมารเวชกรรม',
  'ผู้ป่วยติดเตียง / พักฟื้นชราภาพ',
  'ความดันโลหิตสูงและเบาหวาน',
];

export const COMMON_SYMPTOM_SUGGESTIONS = [
  'อ่อนเพลีย ปวดแผลผ่าตัด ต้องการเสียงนุ่มนวลช่วยผ่อนคลาย',
  'นอนไม่ค่อยหลับ วิตกกังวล อยากฟังเรื่องสบายใจก่อนนอน',
  'สายตาพร่ามัว / ไม่สะดวกเพ่งอ่านหนังสือด้วยตนเอง',
  'รู้สึกเหงาและโดดเดี่ยว อยากมีเพื่อนคุยและเสียงอ่านอบอุ่น',
  'แขนขาขยับลำบาก พักฟื้นบนเตียง ต้องการพลังใจสู้ต่อ',
  'เด็กน้อยงอแง กลัวเข็มฉีดยา อยากฟังนิทานสัตว์สนุกๆ',
  'ต้องการความสงบใจ ปล่อยวางความเครียดผ่านบทธรรมะ',
];
