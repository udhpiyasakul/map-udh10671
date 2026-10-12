import { Room } from '../types/hospital';
import { REAL_POIS } from './udhRealPois';

/**
 * Udon Thani Hospital Real Rooms & Service Locations (633+ Points of Interest)
 * Generated from official UDH dataset (Version 2026-09-17-1NF)
 * All data simulated operational metrics (occupancy, wait times) for Digital Twin visualization.
 */
export const INITIAL_ROOMS: Room[] = REAL_POIS.map((poi) => {
  const floorNum = typeof poi.floor === 'number' ? poi.floor : parseInt(String(poi.floor)) || 1;
  const nameLower = poi.name.toLowerCase();
  const cat = (poi.category || '').toLowerCase();

  // Categorize roomType based on real department / POI type
  let roomType: Room['roomType'] = 'consultation';
  if (nameLower.includes('ฉุกเฉิน') || nameLower.includes('er') || nameLower.includes('resus') || nameLower.includes('อุบัติเหตุ')) {
    roomType = 'er_bay';
  } else if (nameLower.includes('ผ่าตัด') || nameLower.includes('or ') || cat.includes('ผ่าตัด')) {
    roomType = 'or_suite';
  } else if (nameLower.includes('icu') || nameLower.includes('วิกฤต') || nameLower.includes('ccu') || nameLower.includes('nicu')) {
    roomType = 'icu_bed';
  } else if (nameLower.includes('หอผู้ป่วย') || nameLower.includes('ward') || cat.includes('หอผู้ป่วย') || nameLower.includes('สามัญ') || nameLower.includes('พิเศษ')) {
    roomType = 'ward';
  } else if (nameLower.includes('ยา') || cat.includes('เภสัช') || cat.includes('ยา') || nameLower.includes('pharmacy')) {
    roomType = 'pharmacy_counter';
  } else if (nameLower.includes('x-ray') || nameLower.includes('ct') || nameLower.includes('mri') || nameLower.includes('รังสี') || cat.includes('เอกซเรย์') || cat.includes('รังสี')) {
    roomType = 'scan_suite';
  } else if (nameLower.includes('lab') || nameLower.includes('ชันสูตร') || cat.includes('ชันสูตร') || nameLower.includes('เลือด') || nameLower.includes('ห้องปฏิบัติการ')) {
    roomType = 'lab_bench';
  }

  // Capacity & usage metrics
  const capacity = roomType === 'ward' ? 24 : roomType === 'icu_bed' ? 8 : roomType === 'er_bay' ? 6 : 4;
  const isOccupied = (poi.id % 5 !== 0);
  const currentUsage = isOccupied ? Math.max(1, Math.min(capacity, Math.round(capacity * (0.65 + ((poi.id * 7) % 35) * 0.01)))) : 0;
  const utilization = Math.min(100, Math.round((currentUsage / capacity) * 100));

  // Determine relative position inside building
  const xOffset = ((poi.id % 7) - 3) * 6;
  const zOffset = (((poi.id % 5) - 2)) * 6;

  return {
    id: `poi-${poi.id}`,
    departmentId: `dept-${poi.buildingId}-${(poi.category || 'general').replace(/\s+/g, '-').slice(0, 20)}`,
    buildingId: poi.buildingId,
    name: poi.name + (poi.floorLabel ? ` (${poi.floorLabel})` : '') + (poi.phone ? ` [โทร.${poi.phone}]` : ''),
    floor: floorNum,
    roomType,
    status: isOccupied ? (utilization >= 90 ? 'occupied' : 'available') : 'available',
    capacity,
    currentAggregateUsage: currentUsage,
    utilization,
    relativePosition: { x: xOffset, y: (floorNum - 0.5) * 3.4, z: zOffset },
    dataSource: 'SIMULATED DATA',
    updatedAt: new Date().toISOString(),
  };
});
