import { Vehicle } from '../types/hospital';

/**
 * Udon Thani Hospital Campus Vehicles (Simulated Autonomous & Emergency Fleet)
 * Navigates across the real UDH campus coordinate space (Pho Niyom Road, Central Plaza, and building bays).
 */
export const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 'veh-shuttle-udh',
    name: 'รถไฟฟ้ารับส่งผู้ป่วย UDH Shuttle Bus #01 (หลวงตามหาบัว 96 ปี - OPD - ศูนย์เชี่ยวชาญ)',
    vehicleType: 'patient_shuttle',
    currentZoneId: 'bldg-96y',
    destinationZoneId: 'opd',
    progress: 0.25,
    speed: 0.9,
    position: { x: 75, y: 0.4, z: -120 },
    rotationY: 0,
    pathWaypoints: [
      { x: 80, y: 0.4, z: -130 },  // สถานีอาคาร 96 ปี หลวงตามหาบัว
      { x: 60, y: 0.4, z: -80 },
      { x: 30, y: 0.4, z: -20 },   // วงเวียนกลาง
      { x: 50, y: 0.4, z: 30 },    // ถนนหน้าตึกผู้ป่วยนอก (OPD)
      { x: 60, y: 0.4, z: 60 },    // สถานี OPD ด้านหน้า
      { x: 10, y: 0.4, z: 80 },    // เชื่อมต่ออาคารศูนย์เชี่ยวชาญ (Excellent)
      { x: -20, y: 0.4, z: 90 },   // สถานี Excellent Center
      { x: -10, y: 0.4, z: 40 },
      { x: 30, y: 0.4, z: -20 },
      { x: 80, y: 0.4, z: -130 },
    ],
    operationalStatus: 'in_transit',
    batteryLevel: 92,
    payloadType: 'รับ-ส่งผู้รับบริการและญาติฟรี (ยานพาหนะไฟฟ้า 10 ที่นั่ง)',
    dataSource: 'SIMULATED DATA',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'veh-amb-1669-01',
    name: 'รถพยาบาลกู้ชีพฉุกเฉินระดับสูง ALS 1669 UDH #01',
    vehicleType: 'ambulance',
    currentZoneId: 'opd',
    destinationZoneId: 'opd',
    progress: 0.15,
    speed: 1.3,
    position: { x: 68, y: 0.5, z: 58 },
    rotationY: 0,
    pathWaypoints: [
      { x: 68, y: 0.5, z: 58 },   // ลานจอด Ambulance Bay หน้า ER
      { x: 45, y: 0.5, z: 65 },
      { x: 0, y: 0.5, z: 85 },    // ถนนเพาะนิยม (Pho Niyom Rd)
      { x: -40, y: 0.5, z: 100 },
      { x: -20, y: 0.5, z: 95 },
      { x: 20, y: 0.5, z: 75 },
      { x: 68, y: 0.5, z: 58 },
    ],
    operationalStatus: 'in_transit',
    batteryLevel: 96,
    payloadType: 'Trauma & Cardiac Emergency Resuscitation Unit (EMS-1669)',
    dataSource: 'SIMULATED DATA',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'veh-amb-stroke-02',
    name: 'รถพยาบาลรักษาโรคหลอดเลือดสมอง Mobile Stroke Unit UDH #02',
    vehicleType: 'ambulance',
    currentZoneId: 'opd',
    destinationZoneId: 'excellent',
    progress: 0,
    speed: 0,
    position: { x: 72, y: 0.5, z: 52 },
    rotationY: Math.PI / 4,
    pathWaypoints: [
      { x: 72, y: 0.5, z: 52 },
      { x: 72, y: 0.5, z: 52 },
    ],
    operationalStatus: 'idle',
    batteryLevel: 100,
    payloadType: 'Mobile CT Scanner & rt-PA Thrombolytic Ready',
    dataSource: 'SIMULATED DATA',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'veh-agv-cssd-01',
    name: 'หุ่นยนต์ขนส่งเวชภัณฑ์ปลอดเชื้อ AGV Alpha (จ่ายกลาง CSSD -> ตึกศัลยกรรม)',
    vehicleType: 'agv_cart',
    currentZoneId: 'bldg-supply-cssd',
    destinationZoneId: 'bldg-surg',
    progress: 0.45,
    speed: 0.6,
    position: { x: -20, y: 0.3, z: -35 },
    rotationY: 0,
    pathWaypoints: [
      { x: -36, y: 0.3, z: -30 }, // อาคารจ่ายกลาง (bldg-supply-cssd)
      { x: -20, y: 0.3, z: -35 },
      { x: 0, y: 0.3, z: -45 },   // อาคารศัลยการอุตราทร (bldg-surg)
      { x: 4, y: 0.3, z: -50 },   // จุดส่งมอบเครื่องมือผ่าตัด
      { x: 0, y: 0.3, z: -45 },
      { x: -20, y: 0.3, z: -35 },
      { x: -36, y: 0.3, z: -30 },
    ],
    operationalStatus: 'in_transit',
    batteryLevel: 88,
    payloadType: 'ถาดเครื่องมือผ่าตัดปลอดเชื้อ OR Surgical Sterile Packs (16 Sets)',
    dataSource: 'SIMULATED DATA',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'veh-agv-pharma-02',
    name: 'หุ่นยนต์ขนส่งยาและสารน้ำ AGV Beta (คลังยา -> ตึก 69 ปี)',
    vehicleType: 'agv_cart',
    currentZoneId: 'bldg-pharm-storage',
    destinationZoneId: 'bldg-69y',
    progress: 0.6,
    speed: 0.5,
    position: { x: -60, y: 0.3, z: -20 },
    rotationY: 0,
    pathWaypoints: [
      { x: -105, y: 0.3, z: 70 }, // คลังยาคลังน้ำเกลือ
      { x: -60, y: 0.3, z: 20 },
      { x: -30, y: 0.3, z: -40 },
      { x: -21, y: 0.3, z: -95 }, // อาคาร 69 ปี
      { x: -30, y: 0.3, z: -40 },
      { x: -60, y: 0.3, z: 20 },
      { x: -105, y: 0.3, z: 70 },
    ],
    operationalStatus: 'in_transit',
    batteryLevel: 79,
    payloadType: 'เวชภัณฑ์และน้ำเกลือไอวี IV Solutions Batch Deliveries',
    dataSource: 'SIMULATED DATA',
    updatedAt: new Date().toISOString(),
  },
];
