import { Room } from '../types/hospital';
import { UDH_OFFICIAL_ROOMS } from './udhOfficialRooms';

export interface RealRoom {
  id: string;
  buildingId: string;
  floor: number;
  name: string;
  cleanName: string;
  phone?: string;
  category?: string;
  roomType?: string;
  phoneType?: string;
  note?: string;
  isRealData: true;
  dataSource: 'OFFICIAL REAL DATA';
  importedAt: string;
}

export interface BuildingCatalogMetadata {
  buildingId: string;
  nameTh: string;
  nameEn: string;
  code: string;
  floorCount: number;
  descriptionTh: string;
}

export const OFFICIAL_CAMPUS_BUILDINGS: BuildingCatalogMetadata[] = [
  {
    buildingId: 'bldg-metta',
    nameTh: 'อาคารเมตตาธรรม',
    nameEn: 'Metta Tham Building',
    code: 'METTA',
    floorCount: 4,
    descriptionTh: 'อาคารเมตตาธรรม 4 ชั้น (F1-F4) รองรับงานชีวาภิบาล การดูแลแบบประคับประคอง และหอผู้ป่วย',
  },
  {
    buildingId: 'opd',
    nameTh: 'อาคารผู้ป่วยนอกและอำนวยการ',
    nameEn: 'Outpatient & Administration Building',
    code: 'OPD',
    floorCount: 7,
    descriptionTh: 'อาคารผู้ป่วยนอกและอำนวยการ 7 ชั้น (F1-F7) พร้อมลานจอดเฮลิคอปเตอร์ฉุกเฉินชั้นดาดฟ้า',
  },
  {
    buildingId: 'excellent',
    nameTh: 'อาคารศูนย์ความเป็นเลิศทางการแพทย์ (EXCELLENT CENTER)',
    nameEn: 'Medical Excellence Center',
    code: 'EXC',
    floorCount: 7,
    descriptionTh: 'ศูนย์การแพทย์เฉพาะทางระดับตติยภูมิขั้นสูง 7 ชั้น',
  },
  {
    buildingId: 'bldg-69y',
    nameTh: 'อาคาร 69 ปี โรงพยาบาลอุดรธานี',
    nameEn: '69th Anniversary Inpatient Building',
    code: '69Y',
    floorCount: 8,
    descriptionTh: 'อาคารผู้ป่วยใน 8 ชั้น (F1-F8)',
  },
  {
    buildingId: 'bldg-96y',
    nameTh: 'อาคาร 96 ปี หลวงตามหาบัว ญาณสัมปันโน',
    nameEn: 'Luang Ta Maha Bua 96 Years Building',
    code: '96Y',
    floorCount: 10,
    descriptionTh: 'อาคารผู้ป่วยในและศูนย์ฟื้นฟู 10 ชั้น (F1-F10)',
  },
  {
    buildingId: 'bldg-surg',
    nameTh: 'อาคารศัลยคารอุตราทร',
    nameEn: 'Surgery & Operating Theater Building',
    code: 'SURG',
    floorCount: 7,
    descriptionTh: 'อาคารศัลยกรรมและห้องผ่าตัด 7 ชั้น (F1-F7)',
  },
  {
    buildingId: 'bldg-obgyn',
    nameTh: 'อาคารสูตินรีเวชกรรม',
    nameEn: 'Obstetrics & Gynecology Building',
    code: 'OBGYN',
    floorCount: 6,
    descriptionTh: 'อาคารสูตินรีเวชกรรมและหอผู้ป่วยเด็ก 6 ชั้น (F1-F6)',
  },
  {
    buildingId: 'bldg-med-edu',
    nameTh: 'อาคารศูนย์แพทยศาสตรศึกษาชั้นคลินิก',
    nameEn: 'Medical Education Center',
    code: 'MED',
    floorCount: 6,
    descriptionTh: 'ศูนย์การศึกษาและฝึกอบรมแพทย์ 6 ชั้น (F1-F6)',
  },
  {
    buildingId: 'bldg-opd-old',
    nameTh: 'อาคารผู้ป่วยนอกเดิม',
    nameEn: 'Former OPD Historic Pavilion',
    code: 'OLD-OPD',
    floorCount: 2,
    descriptionTh: 'อาคารอนุรักษ์ประวัติศาสตร์ 2 ชั้น (F1-F2)',
  },
  {
    buildingId: 'bldg-pathology',
    nameTh: 'อาคารพยาธิวิทยาและห้องปฏิบัติการชันสูตร',
    nameEn: 'Pathology & Diagnostic Laboratory',
    code: 'PATH',
    floorCount: 3,
    descriptionTh: 'อาคารพยาธิวิทยาและตรวจทางห้องปฏิบัติการ 3 ชั้น (F1-F3)',
  },
  {
    buildingId: 'bldg-social-med',
    nameTh: 'อาคารเวชกรรมสังคมและส่งเสริมสุขภาพ',
    nameEn: 'Social & Preventive Medicine Pavilion',
    code: 'SOC',
    floorCount: 2,
    descriptionTh: 'อาคารเวชกรรมสังคม 2 ชั้น (F1-F2)',
  },
  {
    buildingId: 'bldg-hemodialysis',
    nameTh: 'อาคารไตเทียมและบำบัดทดแทนไต',
    nameEn: 'Artificial Kidney & Dialysis Center',
    code: 'HEMO',
    floorCount: 2,
    descriptionTh: 'อาคารฟอกไตเทียม 2 ชั้น (F1-F2)',
  },
  {
    buildingId: 'bldg-or-old',
    nameTh: 'อาคารผ่าตัดเดิม',
    nameEn: 'Surgical Daycare & Endoscopy Center',
    code: 'OR',
    floorCount: 2,
    descriptionTh: 'อาคารผ่าตัดผู้ป่วยนอก 2 ชั้น (F1-F2)',
  },
  {
    buildingId: 'bldg-supply-cssd',
    nameTh: 'อาคารจ่ายกลางและนึ่งฆ่าเชื้อ (CSSD)',
    nameEn: 'Central Sterile Supply Department',
    code: 'CSSD',
    floorCount: 1,
    descriptionTh: 'อาคารหน่วยจ่ายกลางและฆ่าเชื้อเครื่องมือแพทย์ 1 ชั้น',
  },
  {
    buildingId: 'bldg-ruangphueng',
    nameTh: 'อาคารรวงผึ้งฟื้นฟูสภาพ',
    nameEn: 'Ruangphueng Rehabilitation Center',
    code: 'RUANG',
    floorCount: 2,
    descriptionTh: 'อาคารฟื้นฟูสมรรถภาพทางกายและจิตสังคม 2 ชั้น',
  },
  {
    buildingId: 'bldg-maintenance',
    nameTh: 'อาคารซ่อมบำรุงและวิศวกรรมการแพทย์',
    nameEn: 'Biomedical Engineering & Facilities',
    code: 'MAINT',
    floorCount: 1,
    descriptionTh: 'อาคารวิศวกรรมการแพทย์และสนับสนุนระบบอาคาร 1 ชั้น',
  },
  {
    buildingId: 'bldg-warehouse',
    nameTh: 'อาคารพัสดุและคลังเวชภัณฑ์กลาง',
    nameEn: 'Central Medical Supplies Warehouse',
    code: 'WH',
    floorCount: 1,
    descriptionTh: 'คลังพัสดุและเวชภัณฑ์กลาง 1 ชั้น',
  },
  {
    buildingId: 'bldg-pharm-storage',
    nameTh: 'อาคารคลังยาและโลจิสติกส์เภสัชกรรม',
    nameEn: 'Central Pharmacy Storage & Cold Chain',
    code: 'PHARM-WH',
    floorCount: 1,
    descriptionTh: 'คลังยาหลักและระบบควบคุมอุณหภูมิ Cold-Chain 1 ชั้น',
  },
  {
    buildingId: 'bldg-nutrition',
    nameTh: 'อาคารกลุ่มงานโภชนาการทางการแพทย์',
    nameEn: 'Clinical Nutrition & Meal Facility',
    code: 'NUTRI',
    floorCount: 1,
    descriptionTh: 'อาคารโภชนศาสตร์และบริการอาหารผู้ป่วย 1 ชั้น',
  },
  {
    buildingId: 'bldg-laundry',
    nameTh: 'อาคารงานซักฟอกและผ้าทางการแพทย์',
    nameEn: 'Hygienic Hospital Laundry Service',
    code: 'LAUNDRY',
    floorCount: 1,
    descriptionTh: 'อาคารซักฟอกมาตรฐานป้องกันการติดเชื้อ 1 ชั้น',
  },
  {
    buildingId: 'bldg-forensic',
    nameTh: 'อาคารนิติเวชวิทยา',
    nameEn: 'Forensic Medicine Department',
    code: 'FORENSIC',
    floorCount: 1,
    descriptionTh: 'อาคารกลุ่มงานนิติเวช 1 ชั้น',
  },
  {
    buildingId: 'bldg-field',
    nameTh: 'อาคารโรงพยาบาลสนามและหอคัดแยก',
    nameEn: 'Field Hospital & Isolation Ward',
    code: 'FIELD',
    floorCount: 1,
    descriptionTh: 'อาคารรองรับสถานการณ์วิกฤต 1 ชั้น',
  },
  {
    buildingId: 'bldg-ari-tent',
    nameTh: 'อาคารคลินิกตรวจโรคติดเชื้อระบบทางเดินหายใจ (ARI)',
    nameEn: 'ARI Clinic & Respiratory Triage',
    code: 'ARI',
    floorCount: 1,
    descriptionTh: 'คลินิกโรคทางเดินหายใจ 1 ชั้น',
  },
];

export const BUILDING_NAME_TO_ID: Record<string, string> = {
  'อาคารผู้ป่วยนอกและอำนวยการ': 'opd',
  'อาคารผู้ป่วยนอก OPD เก่า': 'bldg-opd-old',
  'ตึกเวชกรรมสังคม-อาชีวเวชกรรม': 'bldg-social-med',
  'อาคารเวชกรรมสังคมและส่งเสริมสุขภาพ': 'bldg-social-med',
  'อาคารศูนย์เชี่ยวชาญ (EXCELLENT CENTER)': 'excellent',
  'อาคารศูนย์ความเป็นเลิศทางการแพทย์ (EXCELLENT CENTER)': 'excellent',
  'ตึกเมตตาธรรม': 'bldg-metta',
  'อาคารเมตตาธรรม': 'bldg-metta',
  'ตึก OR เก่า': 'bldg-or-old',
  'อาคารผ่าตัดเดิม': 'bldg-or-old',
  'อาคารซักฟอก': 'bldg-laundry',
  'อาคารงานซักฟอกและผ้าทางการแพทย์': 'bldg-laundry',
  'อาคารจ่ายกลาง': 'bldg-supply-cssd',
  'อาคารจ่ายกลางและนึ่งฆ่าเชื้อ (CSSD)': 'bldg-supply-cssd',
  'อาคารไตเทียม': 'bldg-hemodialysis',
  'อาคารไตเทียมและบำบัดทดแทนไต': 'bldg-hemodialysis',
  'หอผู้ป่วยรวงผึ้ง': 'bldg-ruangphueng',
  'อาคารรวงผึ้งฟื้นฟูสภาพ': 'bldg-ruangphueng',
  'อาคารโภชนาศาสตร์': 'bldg-nutrition',
  'อาคารกลุ่มงานโภชนาการทางการแพทย์': 'bldg-nutrition',
  'อาคารซ่อมบำรุง': 'bldg-maintenance',
  'อาคารซ่อมบำรุงและวิศวกรรมการแพทย์': 'bldg-maintenance',
  'อาคารศูนย์แพทย์ศาสตร์': 'bldg-med-edu',
  'อาคารศูนย์แพทยศาสตรศึกษาชั้นคลินิก': 'bldg-med-edu',
  'อาคารสนาม': 'bldg-field',
  'อาคารโรงพยาบาลสนามและหอคัดแยก': 'bldg-field',
  'คลังพัสดุ': 'bldg-warehouse',
  'อาคารพัสดุและคลังเวชภัณฑ์กลาง': 'bldg-warehouse',
  'อาคารนิติเวช': 'bldg-forensic',
  'อาคารนิติเวชวิทยา': 'bldg-forensic',
  'อาคารคลังยาคลังน้ำเกลือ': 'bldg-pharm-storage',
  'อาคารคลังยาและโลจิสติกส์เภสัชกรรม': 'bldg-pharm-storage',
  'เต็นท์ ARI+บัวแคร์': 'bldg-ari-tent',
  'อาคารคลินิกตรวจโรคติดเชื้อระบบทางเดินหายใจ (ARI)': 'bldg-ari-tent',
  'อาคาร 69 ปี โรงพยาบาลอุดรธานี': 'bldg-69y',
  'อาคาร 96 ปี หลวงตามหาบัว': 'bldg-96y',
  'อาคาร 96 ปี หลวงตามหาบัว ญาณสัมปันโน': 'bldg-96y',
  'อาคารศัลยคารอุตราทร': 'bldg-surg',
  'อาคารสูติ-นรีเวชกรรม': 'bldg-obgyn',
  'ตึกพยาธิวิทยาคลินิก': 'bldg-pathology',
  'อาคารพยาธิวิทยาและห้องปฏิบัติการชันสูตร': 'bldg-pathology',
};

const STORAGE_KEY = 'udh_real_building_catalog_v2';

/**
 * Loads custom imported real rooms from localStorage if present
 */
export function loadImportedRoomsFromStorage(): Record<string, RealRoom[]> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse imported rooms from storage:', e);
    return {};
  }
}

/**
 * Saves imported real rooms to localStorage
 */
export function saveImportedRoomsToStorage(catalog: Record<string, RealRoom[]>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(catalog));
  } catch (e) {
    console.error('Failed to save imported rooms to storage:', e);
  }
}

/**
 * Parses a single CSV line with support for quoted strings
 */
function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  const delimiter = line.includes('\t') ? '\t' : ',';

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

/**
 * Converts room name / category to roomType
 */
function inferRoomType(name: string, category?: string): string {
  const lower = name.toLowerCase();
  const catLower = (category || '').toLowerCase();
  if (lower.includes('หอผู้ป่วย') || lower.includes('ward') || lower.includes('เตียง') || lower.includes('icu') || lower.includes('ccu')) {
    return 'ward';
  } else if (lower.includes('พยาบาล') || lower.includes('station') || lower.includes('เคาท์เตอร์')) {
    return 'nurse_station';
  } else if (lower.includes('ฉุกเฉิน') || lower.includes('กู้ชีพ') || lower.includes('er') || lower.includes('1669') || catLower.includes('ฉุกเฉิน')) {
    return 'emergency';
  } else if (lower.includes('ยา') || lower.includes('pharmacy') || catLower.includes('ยา')) {
    return 'pharmacy';
  } else if (lower.includes('ผ่าตัด') || lower.includes('or ') || catLower.includes('ผ่าตัด')) {
    return 'operating';
  } else if (lower.includes('กายภาพ') || lower.includes('rehab')) {
    return 'therapy';
  } else if (lower.includes('lab') || lower.includes('ชันสูตร') || lower.includes('เลือด') || lower.includes('เซลล์')) {
    return 'lab';
  } else if (lower.includes('x-ray') || lower.includes('เอกซเรย์') || lower.includes('ct') || lower.includes('mri') || lower.includes('อัลตราซาวด์') || lower.includes('ส่องกล้อง')) {
    return 'imaging';
  } else if (lower.includes('อำนวยการ') || lower.includes('ธุรการ') || lower.includes('บริหาร') || lower.includes('พัสดุ') || lower.includes('การเงิน')) {
    return 'administrative';
  }
  return 'examination';
}

/**
 * Universal text parser:
 * 1. Automatically detects CSV / TSV format (e.g. ลำดับ,อาคาร,ชั้น,กลุ่มงาน_หมวดหมู่,หน่วยงาน_ชื่อห้อง,หมายเลขโทรศัพท์,ประเภทหมายเลข,หมายเหตุ)
 * 2. Or parses free-form Thai text (e.g. "ชั้น 1: ศูนย์ชีวาภิบาล โทร 6101")
 */
export function parseBuildingText(buildingId: string, rawText: string): RealRoom[] {
  const lines = rawText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) return [];

  const results: RealRoom[] = [];
  const now = new Date().toISOString();

  // Check if first line looks like CSV header or data row
  const firstLine = lines[0];
  const isCsvOrTsv = firstLine.includes(',') || firstLine.includes('\t');
  const hasCsvColumns = isCsvOrTsv && parseCsvLine(firstLine).length >= 4;

  if (hasCsvColumns) {
    // Process as CSV / TSV
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // Skip header row if it contains 'ลำดับ' or 'อาคาร'
      if (i === 0 && (line.includes('ลำดับ') || line.includes('อาคาร') || line.includes('หน่วยงาน_ชื่อห้อง'))) {
        continue;
      }

      const cols = parseCsvLine(line);
      if (cols.length < 3) continue;

      // Columns format:
      // Index 0: ลำดับ
      // Index 1: อาคาร
      // Index 2: ชั้น
      // Index 3: กลุ่มงาน_หมวดหมู่
      // Index 4: หน่วยงาน_ชื่อห้อง
      // Index 5: หมายเลขโทรศัพท์
      // Index 6: ประเภทหมายเลข
      // Index 7: หมายเหตุ
      let rowBuildingRaw = '';
      let rowFloorRaw = '';
      let rowCategory = '';
      let rowName = '';
      let rowPhone = '';
      let rowPhoneType = '';
      let rowNote = '';

      if (cols.length >= 6) {
        rowBuildingRaw = cols[1];
        rowFloorRaw = cols[2];
        rowCategory = cols[3] === '-' ? '' : cols[3];
        rowName = cols[4];
        rowPhone = cols[5] === '-' ? '' : cols[5];
        rowPhoneType = cols[6] || '';
        rowNote = cols[7] === '-' ? '' : cols[7] || '';
      } else {
        // Shorter column set fallback: [ชั้น, ชื่อห้อง, เบอร์] or [อาคาร, ชั้น, ชื่อห้อง, เบอร์]
        if (cols.length === 3) {
          rowFloorRaw = cols[0];
          rowName = cols[1];
          rowPhone = cols[2];
        } else if (cols.length === 4) {
          rowBuildingRaw = cols[0];
          rowFloorRaw = cols[1];
          rowName = cols[2];
          rowPhone = cols[3];
        } else {
          rowBuildingRaw = cols[1];
          rowFloorRaw = cols[2];
          rowName = cols[3];
          rowPhone = cols[4];
        }
      }

      // Check building match if buildingId is specified
      const targetBldId = BUILDING_NAME_TO_ID[rowBuildingRaw] || buildingId;
      if (buildingId && targetBldId !== buildingId && rowBuildingRaw) {
        // Skip rows belonging to other buildings when importing specifically into one building
        continue;
      }

      // Extract floor number
      const flrMatch = rowFloorRaw.match(/\d+/);
      const floorNum = flrMatch ? parseInt(flrMatch[0], 10) : 1;

      if (!rowName || rowName === '-') continue;

      const roomId = `room-${targetBldId || 'bld'}-f${floorNum}-${results.length + 1}`;
      results.push({
        id: roomId,
        buildingId: targetBldId || buildingId,
        floor: floorNum,
        name: rowPhone ? `${rowName} [โทร.${rowPhone}]` : rowName,
        cleanName: rowName,
        phone: rowPhone,
        category: rowCategory || undefined,
        phoneType: rowPhoneType || undefined,
        note: rowNote || undefined,
        roomType: inferRoomType(rowName, rowCategory),
        isRealData: true,
        dataSource: 'OFFICIAL REAL DATA',
        importedAt: now,
      });
    }

    if (results.length > 0) {
      return results;
    }
  }

  // Fallback: Free-form text parser
  let currentFloor = 1;
  const bldInfo = OFFICIAL_CAMPUS_BUILDINGS.find((b) => b.buildingId === buildingId);
  const maxFloor = bldInfo ? bldInfo.floorCount : 10;

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex].trim();
    if (!line) continue;

    // Check if line is a building header (e.g. "ตึกเมตตาธรรม" or "อาคารเมตตาธรรม")
    if (BUILDING_NAME_TO_ID[line] || OFFICIAL_CAMPUS_BUILDINGS.some((b) => b.nameTh === line || b.nameEn.toLowerCase() === line.toLowerCase())) {
      buildingId = BUILDING_NAME_TO_ID[line] || buildingId;
      continue;
    }

    // Check if line indicates a floor
    const floorHeaderMatch = line.match(/(?:ชั้น|floor|f|fl)\s*[:.\s]?\s*(\d{1,2})/i);
    if (floorHeaderMatch) {
      const parsedFloor = parseInt(floorHeaderMatch[1], 10);
      if (parsedFloor >= 1 && parsedFloor <= maxFloor) {
        currentFloor = parsedFloor;
      }
    }

    const segments = line.split(/[,;\n•]+/).map((s) => s.trim()).filter(Boolean);

    for (let segIndex = 0; segIndex < segments.length; segIndex++) {
      let seg = segments[segIndex];
      seg = seg.replace(/^(?:ชั้น|floor|f|fl)\s*[:.\s]?\s*\d{1,2}\s*[:\-–]?\s*/i, '').trim();
      if (!seg || seg.length < 2) continue;

      // Skip segment if it is just the building name
      if (BUILDING_NAME_TO_ID[seg] || OFFICIAL_CAMPUS_BUILDINGS.some((b) => b.nameTh === seg)) {
        continue;
      }

      let phone: string | undefined = undefined;
      const phoneMatch = seg.match(/(?:โทร\.?|ต่อ|เบอร์|tel\.?|phone)\s*[:.\s]?\s*([0-9\-\s/]+)/i);
      if (phoneMatch) {
        phone = phoneMatch[1].trim().replace(/\s+/g, '');
        seg = seg.replace(/(?:โทร\.?|ต่อ|เบอร์|tel\.?|phone)\s*[:.\s]?\s*[0-9\-\s/]+/i, '').trim();
      } else {
        const trailingDigitMatch = seg.match(/(\d{4,5})$/);
        if (trailingDigitMatch) {
          phone = trailingDigitMatch[1];
          seg = seg.replace(/\d{4,5}$/, '').trim();
        }
      }

      seg = seg.replace(/^(?:[0-9]+[.)]|[\-*+>])\s*/, '').trim();
      seg = seg.replace(/[:\-–]+$/, '').trim();

      if (!seg || seg.length < 2) continue;

      const roomId = `room-${buildingId}-f${currentFloor}-${results.length + 1}`;
      results.push({
        id: roomId,
        buildingId,
        floor: currentFloor,
        name: phone ? `${seg} [โทร.${phone}]` : seg,
        cleanName: seg,
        phone,
        category: 'งานบริการทางการแพทย์',
        roomType: inferRoomType(seg),
        isRealData: true,
        dataSource: 'OFFICIAL REAL DATA',
        importedAt: now,
      });
    }
  }

  return results;
}

/**
 * Generates exact official text samples from attached hospital dataset for any building
 */
export function getOfficialSampleTextForBuilding(
  buildingId: string,
  format: 'grouped' | 'csv' = 'grouped'
): string {
  const bldInfo = OFFICIAL_CAMPUS_BUILDINGS.find((b) => b.buildingId === buildingId);
  const rooms = UDH_OFFICIAL_ROOMS.filter((r) => r.buildingId === buildingId);
  if (rooms.length === 0) return '';

  if (format === 'csv') {
    const header = 'ลำดับ,อาคาร,ชั้น,กลุ่มงาน_หมวดหมู่,หน่วยงาน_ชื่อห้อง,หมายเลขโทรศัพท์,ประเภทหมายเลข,หมายเหตุ';
    const rows = rooms.map((r) =>
      [
        r.rowNum || 1,
        r.buildingName,
        r.floorLabel || `ชั้น ${r.floor}`,
        r.category || '-',
        r.cleanName,
        r.phone || '-',
        r.phoneType || 'เบอร์ภายใน',
        r.note || '-',
      ].join(',')
    );
    return [header, ...rows].join('\n');
  }

  // format === 'grouped'
  const title = bldInfo ? bldInfo.nameTh : (rooms[0].buildingName || 'อาคาร');
  const byFloor: Record<number, string[]> = {};
  rooms.forEach((r) => {
    if (!byFloor[r.floor]) byFloor[r.floor] = [];
    const rName = r.cleanName || r.name;
    const item = r.phone ? `${rName} โทร ${r.phone}` : rName;
    byFloor[r.floor].push(item);
  });

  const lines: string[] = [title];
  const sortedFloors = Object.keys(byFloor)
    .map(Number)
    .sort((a, b) => a - b);
  sortedFloors.forEach((f) => {
    lines.push(`ชั้น ${f}: ${byFloor[f].join(', ')}`);
  });

  return lines.join('\n');
}

/**
 * Batch parses multi-building CSV and persists to storage
 */
export function importCampusBatchCsv(rawCsvText: string): { importedCount: number; buildingsCount: number } {
  const lines = rawCsvText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const byBuilding: Record<string, RealRoom[]> = {};
  const now = new Date().toISOString();

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (i === 0 && (line.includes('ลำดับ') || line.includes('อาคาร'))) continue;

    const cols = parseCsvLine(line);
    if (cols.length < 5) continue;

    const bldRaw = cols[1];
    const targetBldId = BUILDING_NAME_TO_ID[bldRaw];
    if (!targetBldId) continue;

    const flrStr = cols[2];
    const flrMatch = flrStr.match(/\d+/);
    const floorNum = flrMatch ? parseInt(flrMatch[0], 10) : 1;
    const category = cols[3] === '-' ? '' : cols[3];
    const roomName = cols[4];
    const phone = cols[5] === '-' ? '' : cols[5];
    const phoneType = cols[6] || '';
    const note = cols[7] === '-' ? '' : cols[7] || '';

    if (!roomName || roomName === '-') continue;

    if (!byBuilding[targetBldId]) {
      byBuilding[targetBldId] = [];
    }

    const roomId = `room-${targetBldId}-f${floorNum}-${byBuilding[targetBldId].length + 1}`;
    byBuilding[targetBldId].push({
      id: roomId,
      buildingId: targetBldId,
      floor: floorNum,
      name: phone ? `${roomName} [โทร.${phone}]` : roomName,
      cleanName: roomName,
      phone,
      category: category || undefined,
      phoneType: phoneType || undefined,
      note: note || undefined,
      roomType: inferRoomType(roomName, category),
      isRealData: true,
      dataSource: 'OFFICIAL REAL DATA',
      importedAt: now,
    });
  }

  const store = loadImportedRoomsFromStorage();
  let totalImported = 0;
  let buildingsCount = 0;

  Object.entries(byBuilding).forEach(([bId, roomList]) => {
    store[bId] = roomList;
    totalImported += roomList.length;
    buildingsCount++;
  });

  saveImportedRoomsToStorage(store);
  return { importedCount: totalImported, buildingsCount };
}

/**
 * Returns current imported rooms for a specific building
 */
export function getBuildingRealRooms(buildingId: string): RealRoom[] {
  const store = loadImportedRoomsFromStorage();
  return store[buildingId] || [];
}

/**
 * Imports and persists text data for a building
 */
export function saveBuildingImport(buildingId: string, text: string): RealRoom[] {
  const parsed = parseBuildingText(buildingId, text);
  const store = loadImportedRoomsFromStorage();
  store[buildingId] = parsed;
  saveImportedRoomsToStorage(store);
  return parsed;
}

/**
 * Clears imported data for a building
 */
export function clearBuildingImport(buildingId: string): void {
  const store = loadImportedRoomsFromStorage();
  delete store[buildingId];
  saveImportedRoomsToStorage(store);
}

/**
 * Converts RealRoom to standard Room type for store
 */
export function realRoomToStoreRoom(r: RealRoom): Room {
  return {
    id: r.id,
    departmentId: `dept-${r.buildingId}-f${r.floor}`,
    buildingId: r.buildingId,
    floor: r.floor,
    roomCode: `F${r.floor}-${r.id.split('-').pop()}`,
    name: r.name,
    cleanName: r.cleanName,
    phone: r.phone,
    category: r.category,
    roomType: 'consultation',
    capacity: 0,
    currentAggregateUsage: 0,
    utilization: 0,
    relativePosition: { x: 0, y: (r.floor - 0.5) * 3.4, z: 0 },
    status: 'available',
    dataSource: 'OFFICIAL REAL DATA',
    isRealData: true,
    updatedAt: r.importedAt,
  };
}
