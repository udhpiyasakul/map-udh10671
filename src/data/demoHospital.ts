import { Building } from '../types/hospital';
import { REAL_BUILDINGS, geoToWorldMeters, UDH_CAMPUS_CENTER } from './udhRealData';

/**
 * Udon Thani Hospital Campus Data (โรงพยาบาลอุดรธานี)
 * Real dataset replacing all previous mock structures.
 * Center: 17.4158° N, 102.7798° E (33 Pho Niyom Rd, Mak Khaeng, Mueang Udon Thani)
 */

export const HOSPITAL_GEO_COORDS = {
  lat: UDH_CAMPUS_CENTER.lat,
  lng: UDH_CAMPUS_CENTER.lng,
  addressTh: 'โรงพยาบาลอุดรธานี เลขที่ 33 ถนนเพาะนิยม ตำบลหมากแข้ง อำเภอเมือง จังหวัดอุดรธานี 41000',
  addressEn: 'Udon Thani Hospital, 33 Pho Niyom Rd, Mak Khaeng, Mueang Udon Thani 41000',
  hospitalTypeTh: 'โรงพยาบาลศูนย์ ระดับตติยภูมิขั้นสูง (Tertiary Regional Hospital)',
  totalPoisReal: 639,
  dataVersion: '2026-10-12-639Pois',
};

// Specific architectural layout adjustments to prevent road encroachment and building overlaps
// Ensures all buildings sit comfortably west of the main boulevard (western road curb at X = +88)
// and opens a spacious courtyard in front of Old OPD building for the Royal Monument Plaza.
const BUILDING_LAYOUT_OVERRIDES: Record<
  string,
  { x?: number; z?: number; width?: number; depth?: number }
> = {
  // Main Administration & OPD (front row facing avenue)
  opd: { x: 62, z: 50, width: 72, depth: 38 },
  // Social Medicine Building (front row, real position facing avenue)
  'bldg-social-med': { x: 72, z: 138, width: 60, depth: 24 },
  // Luang Ta Maha Bua 96 Years Building (front row north)
  'bldg-96y': { x: 80, z: -140, width: 24, depth: 38 },
  // OB-GYN Building (front row north-central)
  'bldg-obgyn': { x: 76, z: -96, width: 44, depth: 28 },
  // Old OPD Building (positioned with front facing courtyard and Royal Monument Plaza)
  'bldg-opd-old': { x: 32, z: 108, width: 38, depth: 52 },
  // Metta Tham Building (อาคารเมตตาธรรม 4 ชั้น)
  'bldg-metta': { x: 30, z: -98, width: 32, depth: 24 },
  // Excellent Center
  excellent: { x: -26, z: 98, width: 56, depth: 38 },
};

const SHORT_BUILDING_CODES: Record<string, string> = {
  opd: 'OPD',
  'bldg-96y': '96Y',
  'bldg-69y': '69Y',
  'bldg-surg': 'SURG',
  'bldg-obgyn': 'OBGYN',
  'bldg-metta': 'METTA',
  excellent: 'EXC',
  'bldg-med-edu': 'MED',
  'bldg-opd-old': 'OLD-OPD',
  'bldg-pathology': 'PATH',
  'bldg-social-med': 'SOC',
  'bldg-hemodialysis': 'HEMO',
  'bldg-or-old': 'OR',
};

// Map the 23 real buildings into the 3D Building objects
export const INITIAL_BUILDINGS: Building[] = REAL_BUILDINGS.map((b) => {
  const worldPos = geoToWorldMeters(b.center[0], b.center[1]);
  const floorCount = b.floors.filter((f) => typeof f === 'number').length || 1;

  // Calculate polygon bounding box in meters
  let minLng = Infinity,
    maxLng = -Infinity,
    minLat = Infinity,
    maxLat = -Infinity;
  b.polygon.forEach(([lng, lat]) => {
    if (lng < minLng) minLng = lng;
    if (lng > maxLng) maxLng = lng;
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
  });

  const override = BUILDING_LAYOUT_OVERRIDES[b.id] || {};

  const widthM = override.width || Math.max(14, Math.round((maxLng - minLng) * 106000));
  const depthM = override.depth || Math.max(12, Math.round((maxLat - minLat) * 111132));
  const heightM = Math.max(6, floorCount * 3.4);

  const finalX = override.x !== undefined ? override.x : worldPos.x;
  const finalZ = override.z !== undefined ? override.z : worldPos.z;

  return {
    id: b.id,
    nameTh: b.name,
    nameEn: b.id.toUpperCase(),
    code: SHORT_BUILDING_CODES[b.id] || b.id.toUpperCase(),
    floorCount: floorCount,
    position: { x: finalX, y: 0, z: finalZ },
    size: { width: widthM, height: heightM, depth: depthM },
    color: b.color,
    descriptionTh: `${b.name} (${floorCount} ชั้น)`,
    descriptionEn: `${b.name} (${floorCount} floors)`,
    totalRooms: b.count,
    totalCapacity: 0,
    currentOccupancy: 0,
    operationalStatus: 'normal',
    isRealData: true,
    dataSource: 'REAL UDH DATA',
    updatedAt: new Date().toISOString(),
  };
});

