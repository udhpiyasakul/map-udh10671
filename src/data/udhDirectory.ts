import { REAL_POIS } from './udhRealPois';
import { REAL_BUILDINGS } from './udhRealData';

/**
 * Udon Thani Hospital Telephone & Service Directory (UDH Directory)
 * Integrated from official UDH dataset (Version 2026-09-17-1NF).
 * All building IDs match the 23 real campus buildings.
 */

export interface UdhDirectoryEntry {
  id: string;
  nameTh: string;
  nameEn: string;
  category: 'clinical' | 'emergency' | 'outpatient' | 'inpatient' | 'support' | 'administrative' | 'diagnostic';
  buildingId: string;
  buildingName: string;
  floor: number;
  telExtension: string;
  directPhone?: string;
  descriptionTh: string;
  tags: string[];
}

// Curated priority contact points for fast lookup
const CURATED_DIRECTORIES: UdhDirectoryEntry[] = [
  // 1. ศูนย์อุบัติเหตุฉุกเฉินและกู้ชีพ 1669 (opd ชั้น 1)
  {
    id: 'udh-tel-er-1669',
    nameTh: 'ศูนย์สั่งการกู้ชีพและอุบัติเหตุฉุกเฉิน (1669 / ER Triage)',
    nameEn: 'EMS 1669 Emergency Operations & Trauma Triage',
    category: 'emergency',
    buildingId: 'opd',
    buildingName: 'อาคารผู้ป่วยนอกและอำนวยการ',
    floor: 1,
    telExtension: '1669 / 1101',
    directPhone: '042-245555 ต่อ 1101',
    descriptionTh: 'รับแจ้งเหตุฉุกเฉิน 24 ชั่วโมง ศูนย์ประสานงานรถพยาบาลกู้ชีพ ALS/BLS',
    tags: ['ฉุกเฉิน', '1669', 'กู้ชีพ', 'อุบัติเหตุ', 'ER', 'Trauma', 'opd'],
  },
  {
    id: 'udh-tel-er-resus',
    nameTh: 'ห้องกู้ชีพฉุกเฉินระดับวิกฤต (ER Resuscitation Bay)',
    nameEn: 'ER High-Acuity Resuscitation Unit',
    category: 'emergency',
    buildingId: 'opd',
    buildingName: 'อาคารผู้ป่วยนอกและอำนวยการ',
    floor: 1,
    telExtension: '1102',
    directPhone: '042-245555 ต่อ 1102',
    descriptionTh: 'ห้องช่วยฟื้นคืนชีพผู้ป่วยวิกฤตฉุกเฉิน Fast-Track Red Zone',
    tags: ['กู้ชีพ', 'CPR', 'วิกฤต', 'Red Zone', 'opd'],
  },

  // 2. อาคารผู้ป่วยนอกและอำนวยการ (opd)
  {
    id: 'udh-tel-opd-triage',
    nameTh: 'จุดคัดกรองผู้ป่วยนอกและวัดสัญญาณชีพ (Screening & Triage)',
    nameEn: 'OPD Central Triage & Vital Signs Screening',
    category: 'outpatient',
    buildingId: 'opd',
    buildingName: 'อาคารผู้ป่วยนอกและอำนวยการ',
    floor: 1,
    telExtension: '2101',
    directPhone: '042-245555 ต่อ 2101',
    descriptionTh: 'จุดคัดกรองแรกรับ ประเมินอาการ คัดแยกความเร่งด่วนสู่คลินิกเฉพาะทาง',
    tags: ['คัดกรอง', 'แรกรับ', 'วัดความดัน', 'Screening', 'Triage', 'opd'],
  },
  {
    id: 'udh-tel-opd-reg',
    nameTh: 'งานเวชระเบียนและออกบัตรผู้ป่วย (Registration & Medical Records)',
    nameEn: 'Patient Registration & Medical Records Desk',
    category: 'administrative',
    buildingId: 'opd',
    buildingName: 'อาคารผู้ป่วยนอกและอำนวยการ',
    floor: 1,
    telExtension: '2102',
    directPhone: '042-245555 ต่อ 2102',
    descriptionTh: 'ทำบัตรใหม่ ตรวจสอบสิทธิการรักษา (บัตรทอง/ประกันสังคม/ข้าราชการ)',
    tags: ['เวชระเบียน', 'ทำบัตร', 'สิทธิการรักษา', 'Reception', 'opd'],
  },
  {
    id: 'udh-tel-pharmacy-opd',
    nameTh: 'ห้องจ่ายยาผู้ป่วยนอกหลัก (Central Outpatient Pharmacy)',
    nameEn: 'Central Outpatient Pharmacy & Automation Dispense',
    category: 'outpatient',
    buildingId: 'opd',
    buildingName: 'อาคารผู้ป่วยนอกและอำนวยการ',
    floor: 1,
    telExtension: '2105',
    directPhone: '042-245555 ต่อ 2105',
    descriptionTh: 'จ่ายยาผู้ป่วยนอก พร้อมระบบจัดยาและตรวจสอบอัตโนมัติด้วยหุ่นยนต์',
    tags: ['ห้องยา', 'รับยา', 'เภสัชกรรม', 'Pharmacy', 'opd'],
  },
  {
    id: 'udh-tel-opd-med',
    nameTh: 'คลินิกผู้ป่วยนอกอายุรกรรม (Internal Medicine Clinic)',
    nameEn: 'Internal Medicine Outpatient Clinic',
    category: 'outpatient',
    buildingId: 'opd',
    buildingName: 'อาคารผู้ป่วยนอกและอำนวยการ',
    floor: 2,
    telExtension: '2301',
    directPhone: '042-245555 ต่อ 2301',
    descriptionTh: 'ตรวจรักษาโรคเบาหวาน ความดัน ไต หัวใจ ทางเดินอาหารและโรคทั่วไป',
    tags: ['อายุรกรรม', 'เบาหวาน', 'ความดัน', 'โรคไต', 'ตรวจโรค', 'opd'],
  },
  {
    id: 'udh-tel-director',
    nameTh: 'สำนักงานผู้อำนวยการโรงพยาบาลอุดรธานี (Director Office)',
    nameEn: 'Office of the Hospital Director',
    category: 'administrative',
    buildingId: 'opd',
    buildingName: 'อาคารผู้ป่วยนอกและอำนวยการ',
    floor: 6,
    telExtension: '7301',
    directPhone: '042-245555 ต่อ 7301',
    descriptionTh: 'งานบริหารยุทธศาสตร์ นโยบายการพัฒนาโรงพยาบาลศูนย์อุดรธานี',
    tags: ['อำนวยการ', 'ผู้บริหาร', 'ธุรการ', 'สารบรรณ', 'opd'],
  },

  // 3. อาคารศูนย์เชี่ยวชาญ EXCELLENT CENTER
  {
    id: 'udh-tel-cath-lab',
    nameTh: 'ศูนย์ปฏิบัติการสวนหัวใจและหลอดเลือด (Cardiac Cath Lab)',
    nameEn: 'Cardiovascular Catheterization Intervention Lab',
    category: 'clinical',
    buildingId: 'excellent',
    buildingName: 'อาคารศูนย์เชี่ยวชาญ (EXCELLENT CENTER)',
    floor: 3,
    telExtension: '5301',
    directPhone: '042-245555 ต่อ 5301',
    descriptionTh: 'สวนหัวใจ ขยายหลอดเลือดโคโรนารีด้วยบอลลูนและขดลวด (PCI 24 ชม.)',
    tags: ['สวนหัวใจ', 'หัวใจขาดเลือด', 'Cath Lab', 'PCI', 'excellent'],
  },
  {
    id: 'udh-tel-chemo-day',
    nameTh: 'ศูนย์เคมีบำบัดผู้ป่วยนอก (Chemotherapy Day Care Unit)',
    nameEn: 'Outpatient Chemotherapy Day Care Suite',
    category: 'clinical',
    buildingId: 'excellent',
    buildingName: 'อาคารศูนย์เชี่ยวชาญ (EXCELLENT CENTER)',
    floor: 4,
    telExtension: '5401',
    directPhone: '042-245555 ต่อ 5401',
    descriptionTh: 'บริการให้ยาเคมีบำบัดและภูมิคุ้มกันบำบัดแบบไปกลับ',
    tags: ['เคมีบำบัด', 'คีโม', 'มะเร็ง', 'Chemotherapy', 'excellent'],
  },
  {
    id: 'udh-tel-mri-ct',
    nameTh: 'ศูนย์รังสีวินิจฉัยขั้นสูง (Advanced Diagnostic Radiology MRI/CT)',
    nameEn: 'Advanced Diagnostic Radiology MRI / Dual-Source CT',
    category: 'diagnostic',
    buildingId: 'excellent',
    buildingName: 'อาคารศูนย์เชี่ยวชาญ (EXCELLENT CENTER)',
    floor: 1,
    telExtension: '5102',
    directPhone: '042-245555 ต่อ 5102',
    descriptionTh: 'เครื่องตรวจคลื่นแม่เหล็กไฟฟ้า MRI 3.0T และ CT สแกนความเร็วสูง 256 สไลซ์',
    tags: ['MRI', 'CT', 'เอกซเรย์', 'รังสี', 'excellent'],
  },

  // 4. อาคาร 96 ปี หลวงตามหาบัว (bldg-96y)
  {
    id: 'udh-tel-luangta-shuttle',
    nameTh: 'สถานีรถไฟฟ้ารับส่งผู้ป่วยหลวงตามหาบัว (Luang Ta Shuttle Station)',
    nameEn: 'Luang Ta Maha Bua EV Patient Shuttle Hub',
    category: 'support',
    buildingId: 'bldg-96y',
    buildingName: 'อาคาร 96 ปี หลวงตามหาบัว',
    floor: 1,
    telExtension: '3100',
    descriptionTh: 'จุดบริการรถไฟฟ้ารับส่งผู้ป่วยและญาติฟรี เชื่อมต่อทุกอาคารและถนนเพาะนิยม',
    tags: ['รถกอล์ฟ', 'รถรับส่ง', 'สถานีหลวงตา', 'Shuttle', 'EV', 'bldg-96y'],
  },
  {
    id: 'udh-tel-monk-ward',
    nameTh: 'หอผู้ป่วยพระสงฆ์อาพาธ (Monk Inpatient Ward)',
    nameEn: 'Buddhist Monk Inpatient Care Ward',
    category: 'inpatient',
    buildingId: 'bldg-96y',
    buildingName: 'อาคาร 96 ปี หลวงตามหาบัว',
    floor: 3,
    telExtension: '3301',
    directPhone: '042-245555 ต่อ 3301',
    descriptionTh: 'การดูแลเฉพาะสำหรับพระภิกษุสงฆ์อาพาธตามพระธรรมวินัย',
    tags: ['พระสงฆ์', 'อาพาธ', 'หอผู้ป่วย', 'bldg-96y'],
  },
  {
    id: 'udh-tel-hemato-ward',
    nameTh: 'ศูนย์โลหิตวิทยาและปลูกถ่ายเซลล์ต้นกำเนิด (Hematology Center)',
    nameEn: 'Hematology & Bone Marrow Transplant Center',
    category: 'inpatient',
    buildingId: 'bldg-96y',
    buildingName: 'อาคาร 96 ปี หลวงตามหาบัว',
    floor: 7,
    telExtension: '3701',
    directPhone: '042-245555 ต่อ 3701',
    descriptionTh: 'รักษาโรคเลือด มะเร็งเม็ดเลือดขาว ธาลัสซีเมีย พร้อมห้องปลอดเชื้อความดันบวก',
    tags: ['โรคเลือด', 'โลหิตวิทยา', 'ปลูกถ่ายไขกระดูก', 'Hematology', 'bldg-96y'],
  },

  // 5. อาคารศัลยคารอุตราทร (bldg-surg)
  {
    id: 'udh-tel-central-or',
    nameTh: 'ศูนย์ห้องผ่าตัดหลัก (Central Operating Theaters)',
    nameEn: 'Central Operating Suites Complex',
    category: 'clinical',
    buildingId: 'bldg-surg',
    buildingName: 'อาคารศัลยคารอุตราทร',
    floor: 3,
    telExtension: '4301',
    directPhone: '042-245555 ต่อ 4301',
    descriptionTh: 'ห้องผ่าตัดปลอดเชื้อ 16 ห้อง รองรับการผ่าตัดผ่านกล้องและผ่าตัดซับซ้อน',
    tags: ['ห้องผ่าตัด', 'OR', 'ผ่าตัด', 'ศัลยกรรม', 'bldg-surg'],
  },

  // 6. อาคารจ่ายกลางและซ่อมบำรุง
  {
    id: 'udh-tel-cssd',
    nameTh: 'งานจ่ายกลางและทำให้ปราศจากเชื้อ (CSSD)',
    nameEn: 'Central Sterile Supply Department (CSSD)',
    category: 'support',
    buildingId: 'bldg-supply-cssd',
    buildingName: 'อาคารจ่ายกลาง',
    floor: 1,
    telExtension: '6201',
    descriptionTh: 'ฆ่าเชื้อและเตรียมเครื่องมือผ่าตัด จัดส่งด้วยหุ่นยนต์อัตโนมัติ AGV',
    tags: ['จ่ายกลาง', 'CSSD', 'ฆ่าเชื้อ', 'เครื่องมือแพทย์', 'bldg-supply-cssd'],
  },
  {
    id: 'udh-tel-biomed-eng',
    nameTh: 'กลุ่มงานวิศวกรรมการแพทย์ (Biomedical Engineering Unit)',
    nameEn: 'Biomedical & Clinical Engineering Unit',
    category: 'support',
    buildingId: 'bldg-maintenance',
    buildingName: 'อาคารซ่อมบำรุง',
    floor: 1,
    telExtension: '6401',
    descriptionTh: 'สอบเทียบ ซ่อมบำรุง และทดสอบความปลอดภัยเครื่องมือแพทย์ตามมาตรฐาน',
    tags: ['ช่างเครื่องมือแพทย์', 'วิศวกรรมการแพทย์', 'Biomedical', 'ซ่อมบำรุง', 'bldg-maintenance'],
  },

  // 7. อาคารไตเทียม
  {
    id: 'udh-tel-hemodialysis',
    nameTh: 'ศูนย์ฟอกเลือดด้วยเครื่องไตเทียม (Hemodialysis Center)',
    nameEn: 'Hemodialysis Unit & Artificial Kidney Center',
    category: 'clinical',
    buildingId: 'bldg-hemodialysis',
    buildingName: 'อาคารไตเทียม',
    floor: 1,
    telExtension: '7101',
    directPhone: '042-245555 ต่อ 7101',
    descriptionTh: 'ให้บริการฟอกเลือดด้วยเครื่องไตเทียมประสิทธิภาพสูง 32 เตียง',
    tags: ['ไตเทียม', 'ฟอกเลือด', 'ไตวาย', 'Hemodialysis', 'bldg-hemodialysis'],
  },
];

// Dynamically augment with all REAL_POIS that have telephone contacts
const poiDirectoryEntries: UdhDirectoryEntry[] = REAL_POIS.filter((p) => Boolean(p.phone)).map((p) => {
  const bld = REAL_BUILDINGS.find((b) => b.id === p.buildingId);
  const floorNum = typeof p.floor === 'number' ? p.floor : parseInt(String(p.floor)) || 1;
  const cat = (p.category || '').toLowerCase();

  let entryCategory: UdhDirectoryEntry['category'] = 'clinical';
  if (cat.includes('ฉุกเฉิน') || p.name.includes('ฉุกเฉิน')) {
    entryCategory = 'emergency';
  } else if (cat.includes('ผู้ป่วยนอก') || cat.includes('คลินิก')) {
    entryCategory = 'outpatient';
  } else if (cat.includes('หอผู้ป่วย') || cat.includes('ward')) {
    entryCategory = 'inpatient';
  } else if (cat.includes('ชันสูตร') || cat.includes('รังสี') || cat.includes('แล็บ')) {
    entryCategory = 'diagnostic';
  } else if (cat.includes('ธุรการ') || cat.includes('อำนวยการ') || cat.includes('เวชระเบียน')) {
    entryCategory = 'administrative';
  } else {
    entryCategory = 'support';
  }

  return {
    id: `udh-tel-poi-${p.id}`,
    nameTh: p.name,
    nameEn: p.locId || `Location ${p.id}`,
    category: entryCategory,
    buildingId: p.buildingId,
    buildingName: bld ? bld.name : p.buildingName,
    floor: floorNum,
    telExtension: p.phone,
    directPhone: p.phone.length > 5 ? p.phone : `042-245555 ต่อ ${p.phone}`,
    descriptionTh: `${p.name} อาคาร${bld ? bld.name : p.buildingName} ${p.floorLabel || `ชั้น ${floorNum}`}`,
    tags: [p.name, p.buildingId, p.category || '', ...(p.keywords || [])],
  };
});

// Export combined directory with curated priority items first, followed by POI entries
export const UDH_TELEPHONE_DIRECTORY: UdhDirectoryEntry[] = [
  ...CURATED_DIRECTORIES,
  ...poiDirectoryEntries.filter(
    (poi) => !CURATED_DIRECTORIES.some((c) => c.telExtension === poi.telExtension && c.buildingId === poi.buildingId)
  ),
];
