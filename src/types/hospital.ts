/**
 * Data types for Udon Thani Hospital Digital Twin
 * All data strictly labeled with dataSource = "SIMULATED DATA"
 */

export type OperationalStatus = 'normal' | 'busy' | 'critical' | 'closed' | 'maintenance';
export type EquipmentStatus = 'available' | 'in_use' | 'maintenance' | 'offline';
export type MaintenanceStatus = 'good' | 'due_soon' | 'overdue' | 'in_service';
export type AlertSeverity = 'info' | 'warning' | 'critical';
export type AlertStatus = 'active' | 'acknowledged' | 'resolved';
export type VehicleType = 'ambulance' | 'agv_cart' | 'patient_shuttle' | 'wheelchair_assist';
export type TimeOfDay = 'morning' | 'daytime' | 'evening' | 'night';

export interface Position3D {
  x: number;
  y: number;
  z: number;
}

export interface Size3D {
  width: number;
  height: number;
  depth: number;
}

export type DataSourceType = 'SIMULATED DATA' | 'REAL UDH DATA' | 'OFFICIAL REAL DATA';

export interface Building {
  id: string;
  nameTh: string;
  nameEn: string;
  code: string;
  floorCount: number;
  position: Position3D;
  size: Size3D;
  color: string;
  descriptionTh: string;
  descriptionEn: string;
  totalRooms: number;
  totalCapacity: number;
  currentOccupancy: number;
  operationalStatus: OperationalStatus;
  isRealData?: boolean;
  dataSource: DataSourceType;
  updatedAt: string;
}

export interface Department {
  id: string;
  buildingId: string;
  nameTh: string;
  nameEn: string;
  floor: number;
  departmentType: 'emergency' | 'outpatient' | 'inpatient' | 'surgery' | 'radiology' | 'laboratory' | 'pharmacy' | 'cardiology' | 'oncology' | 'support';
  operationalStatus: OperationalStatus;
  utilization: number; // 0 - 100%
  staffCountSimulated: number; // aggregate non-identifiable
  activeRooms: number;
  totalRooms: number;
  simulatedQueueLength: number;
  simulatedAvgWaitMinutes: number;
  color: string;
  isRealData?: boolean;
  dataSource: DataSourceType;
  updatedAt: string;
}

export interface Room {
  id: string;
  departmentId: string;
  buildingId: string;
  buildingName?: string;
  name: string;
  cleanName?: string;
  floor: number;
  floorLabel?: string;
  roomType: 'er_bay' | 'or_suite' | 'icu_bed' | 'ward' | 'consultation' | 'lab_bench' | 'scan_suite' | 'pharmacy_counter';
  status: 'available' | 'occupied' | 'cleaning' | 'reserved' | 'maintenance';
  capacity: number;
  currentAggregateUsage: number;
  utilization: number;
  relativePosition: Position3D;
  phone?: string;
  category?: string;
  roomCode?: string;
  workingHours?: string;
  keywords?: string[];
  isRealData?: boolean;
  dataSource: DataSourceType;
  updatedAt: string;
}

export interface Equipment {
  id: string;
  roomId: string;
  departmentId: string;
  buildingId: string;
  nameTh: string;
  nameEn: string;
  equipmentType: 'mri' | 'ct_scanner' | 'ventilator' | 'defibrillator' | 'infusion_pump' | 'ultrasound' | 'xray_mobile' | 'hemodialysis' | 'ecg_monitor';
  status: EquipmentStatus;
  maintenanceStatus: MaintenanceStatus;
  lastMaintenanceAt: string;
  usageHoursSimulated: number;
  batteryLevel?: number; // for mobile devices
  position: Position3D;
  dataSource: 'SIMULATED DATA';
  updatedAt: string;
}

export interface Vehicle {
  id: string;
  name: string;
  vehicleType: VehicleType;
  currentZoneId: string;
  destinationZoneId: string;
  progress: number; // 0 to 1
  speed: number;
  position: Position3D;
  rotationY: number;
  pathWaypoints: Position3D[];
  operationalStatus: 'in_transit' | 'idle' | 'charging' | 'dispatched';
  batteryLevel: number;
  payloadType?: string;
  dataSource: 'SIMULATED DATA';
  updatedAt: string;
}

export interface Alert {
  id: string;
  zoneId: string;
  zoneName: string;
  alertType: 'occupancy_surge' | 'equipment_maintenance' | 'oxygen_pressure' | 'wait_time_threshold' | 'hvac_check' | 'transport_delay';
  severity: AlertSeverity;
  status: AlertStatus;
  titleTh: string;
  titleEn: string;
  descriptionTh: string;
  descriptionEn: string;
  startedAt: string;
  updatedAt: string;
  dataSource: 'SIMULATED DATA';
}

export interface HospitalKpi {
  activeDepartments: number;
  totalDepartments: number;
  availableRooms: number;
  occupiedRooms: number;
  totalRooms: number;
  overallUtilizationRate: number; // percentage
  simulatedTotalPatientsAggregate: number; // non-identifiable count
  simulatedAvgWaitTimeMinutes: number;
  activeAlertsCount: number;
  criticalAlertsCount: number;
  equipmentReadinessRate: number; // percentage
  activeVehiclesCount: number;
}

export interface LightingSettings {
  timeOfDay: TimeOfDay;
  sunElevation: number; // degrees 0-90
  sunAzimuth: number; // degrees 0-360
  sunlightIntensity: number; // 0 - 2.5
  ambientLightIntensity: number; // 0 - 1.5
  shadowIntensity: number; // 0 - 1
  sceneExposure: number; // 0.5 - 2.0
  indoorLightIntensity: number; // 0 - 2.0
  emergencyLightPreview: boolean;
}

export type SelectedObjectType = 'building' | 'department' | 'room' | 'equipment' | 'vehicle' | 'alert' | null;

export interface SimulationState {
  isPlaying: boolean;
  speedMultiplier: 1 | 3 | 8;
  simulationTime: Date;
  selectedObjectId: string | null;
  selectedObjectType: SelectedObjectType;
  activeFloor: number | null; // null = all floors
  activeLayer: 'all' | 'buildings' | 'heatmap' | 'vehicles' | 'equipment';
  cameraMode: 'overview' | 'orbit' | 'floor' | 'flythrough' | 'focus';
  autoRotate: boolean;
  audioEnabled: boolean;
  audioVolume: number;
}
