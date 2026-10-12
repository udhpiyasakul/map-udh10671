import { create } from 'zustand';
import {
  Building,
  Department,
  Room,
  Equipment,
  Vehicle,
  Alert,
  HospitalKpi,
  LightingSettings,
  SelectedObjectType,
  Position3D,
  TimeOfDay,
} from '../types/hospital';
import { INITIAL_BUILDINGS } from '../data/demoHospital';
import { INITIAL_DEPARTMENTS } from '../data/demoDepartments';
import { INITIAL_ROOMS } from '../data/demoRooms';
import { INITIAL_EQUIPMENT } from '../data/demoEquipment';
import { INITIAL_VEHICLES } from '../data/demoVehicles';
import { INITIAL_ALERTS } from '../data/demoAlerts';
import { audioManager } from '../simulation/audioManager';

export interface CameraFocusTarget {
  position: Position3D;
  target: Position3D;
  zoom?: number;
}

export type AppTheme = 'udh-teal' | 'navy-ops' | 'clinical-light' | 'dark-obsidian';
export type AppFontStyle = 'prompt' | 'sarabun' | 'kanit' | 'system';

export type CameraPresetType = 'panorama' | 'hospital' | 'plaza' | 'duck' | 'helipad';

export const CAMERA_PRESETS: Record<CameraPresetType, CameraFocusTarget> = {
  panorama: {
    position: { x: 220, y: 155, z: 195 },
    target: { x: 75, y: 4, z: 0 },
  },
  hospital: {
    position: { x: 75, y: 115, z: 135 },
    target: { x: 20, y: 4, z: 0 },
  },
  plaza: {
    position: { x: 108, y: 22, z: 126 },
    target: { x: 74, y: 4, z: 108 },
  },
  duck: {
    position: { x: 195, y: 26, z: 20 },
    target: { x: 225, y: 6, z: -20 },
  },
  helipad: {
    position: { x: 92, y: 44, z: 66 },
    target: { x: 62, y: 25, z: 50 },
  },
};

interface AppStoreState {
  // Data entities
  buildings: Building[];
  departments: Department[];
  rooms: Room[];
  equipment: Equipment[];
  vehicles: Vehicle[];
  alerts: Alert[];

  // Selection
  selectedObjectId: string | null;
  selectedObjectType: SelectedObjectType;
  cameraFocusTarget: CameraFocusTarget | null;
  activeCameraPreset: CameraPresetType;

  // Simulation controls
  isPlaying: boolean;
  speedMultiplier: 1 | 3 | 8;
  simulationTime: Date;
  activeFloor: number | null;
  activeLayer: 'all' | 'buildings' | 'heatmap' | 'vehicles' | 'equipment';
  cameraMode: 'overview' | 'orbit' | 'floor' | 'flythrough' | 'focus';
  autoRotate: boolean;

  // Lighting
  lighting: LightingSettings;

  // Audio
  audioEnabled: boolean;
  audioVolume: number;

  // Theme and Font Style
  theme: AppTheme;
  fontStyle: AppFontStyle;
  isThemeModalOpen: boolean;

  // UI Panels
  isDetailPanelOpen: boolean;
  isKpiOpen: boolean;
  isLightingOpen: boolean;
  isMapOpen: boolean;
  isSearchOpen: boolean;
  isPrivacyModalOpen: boolean;
  showFloatingLabels: boolean;
  isArchitecturalPreviewOpen: boolean;

  // Actions
  setShowFloatingLabels: (show: boolean) => void;
  toggleFloatingLabels: () => void;
  setArchitecturalPreviewOpen: (open: boolean) => void;
  setCameraPreset: (preset: CameraPresetType) => void;
  setTheme: (theme: AppTheme) => void;
  setFontStyle: (fontStyle: AppFontStyle) => void;
  setThemeModalOpen: (open: boolean) => void;
  selectObject: (id: string, type: SelectedObjectType, focusTarget?: CameraFocusTarget) => void;
  clearSelection: () => void;
  setPlaying: (playing: boolean) => void;
  setSpeedMultiplier: (speed: 1 | 3 | 8) => void;
  setActiveFloor: (floor: number | null) => void;
  setActiveLayer: (layer: 'all' | 'buildings' | 'heatmap' | 'vehicles' | 'equipment') => void;
  setCameraMode: (mode: 'overview' | 'orbit' | 'floor' | 'flythrough' | 'focus') => void;
  setAutoRotate: (rotate: boolean) => void;
  setTimeOfDayPreset: (preset: TimeOfDay) => void;
  toggleDayNightMode: () => void;
  setDayNightMode: (mode: 'day' | 'night') => void;
  updateLighting: (partial: Partial<LightingSettings>) => void;
  acknowledgeAlert: (alertId: string) => void;
  toggleAudio: () => void;
  setAudioVolume: (volume: number) => void;
  resetSimulation: () => void;
  setDetailPanelOpen: (open: boolean) => void;
  setKpiOpen: (open: boolean) => void;
  setLightingOpen: (open: boolean) => void;
  setMapOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  setPrivacyModalOpen: (open: boolean) => void;

  // Engine tick
  tickSimulation: (deltaSeconds: number) => void;

  // Computed KPI getter
  getKpi: () => HospitalKpi;
}

const DEFAULT_LIGHTING: LightingSettings = {
  timeOfDay: 'daytime',
  sunElevation: 62,
  sunAzimuth: 140,
  sunlightIntensity: 1.6,
  ambientLightIntensity: 0.6,
  shadowIntensity: 0.45,
  sceneExposure: 1.05,
  indoorLightIntensity: 1.0,
  emergencyLightPreview: false,
};

export const useAppStore = create<AppStoreState>((set, get) => ({
  buildings: INITIAL_BUILDINGS,
  departments: INITIAL_DEPARTMENTS,
  rooms: INITIAL_ROOMS,
  equipment: INITIAL_EQUIPMENT,
  vehicles: INITIAL_VEHICLES,
  alerts: INITIAL_ALERTS,

  selectedObjectId: null,
  selectedObjectType: null,
  cameraFocusTarget: null,
  activeCameraPreset: 'panorama',

  isPlaying: true,
  speedMultiplier: 1,
  simulationTime: new Date(),
  activeFloor: null,
  activeLayer: 'all',
  cameraMode: 'overview',
  autoRotate: false,

  lighting: DEFAULT_LIGHTING,

  audioEnabled: false,
  audioVolume: 0.4,

  theme: (typeof window !== 'undefined' && (localStorage.getItem('udh_theme') as AppTheme)) || 'udh-teal',
  fontStyle: (typeof window !== 'undefined' && (localStorage.getItem('udh_font') as AppFontStyle)) || 'prompt',
  isThemeModalOpen: false,

  isDetailPanelOpen: false,
  isKpiOpen: true,
  isLightingOpen: false,
  isMapOpen: false,
  isSearchOpen: false,
  isPrivacyModalOpen: false,
  showFloatingLabels: true,
  isArchitecturalPreviewOpen: false,

  setShowFloatingLabels: (show) => set({ showFloatingLabels: show }),
  toggleFloatingLabels: () => set((s) => ({ showFloatingLabels: !s.showFloatingLabels })),
  setArchitecturalPreviewOpen: (open) => set({ isArchitecturalPreviewOpen: open }),
  setCameraPreset: (preset: CameraPresetType) => {
    audioManager.playSoftBeep(650, 0.08);
    const target = CAMERA_PRESETS[preset];
    set({
      activeCameraPreset: preset,
      cameraFocusTarget: target,
      cameraMode: 'focus',
      autoRotate: false,
    });
  },

  setTheme: (theme: AppTheme) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('udh_theme', theme);
    }
    set({ theme });
  },

  setFontStyle: (fontStyle: AppFontStyle) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('udh_font', fontStyle);
    }
    set({ fontStyle });
  },

  setThemeModalOpen: (open: boolean) => set({ isThemeModalOpen: open }),

  selectObject: (id, type, focusTarget) => {
    audioManager.playSoftBeep(780, 0.08);
    set({
      selectedObjectId: id,
      selectedObjectType: type,
      isDetailPanelOpen: true,
      cameraFocusTarget: focusTarget || null,
      cameraMode: focusTarget ? 'focus' : get().cameraMode,
    });
  },

  clearSelection: () => {
    set({
      selectedObjectId: null,
      selectedObjectType: null,
      isDetailPanelOpen: false,
      cameraFocusTarget: null,
    });
  },

  setPlaying: (playing) => set({ isPlaying: playing }),
  setSpeedMultiplier: (speed) => set({ speedMultiplier: speed }),
  setActiveFloor: (floor) => set({ activeFloor: floor }),
  setActiveLayer: (layer) => set({ activeLayer: layer }),
  setCameraMode: (mode) => set({ cameraMode: mode, autoRotate: mode === 'orbit' }),
  setAutoRotate: (rotate) => set({ autoRotate: rotate }),

  setTimeOfDayPreset: (preset) => {
    const presets: Record<TimeOfDay, Partial<LightingSettings>> = {
      morning: {
        timeOfDay: 'morning',
        sunElevation: 25,
        sunAzimuth: 80,
        sunlightIntensity: 1.2,
        ambientLightIntensity: 0.5,
        shadowIntensity: 0.5,
        sceneExposure: 1.0,
        indoorLightIntensity: 0.8,
        emergencyLightPreview: false,
      },
      daytime: {
        timeOfDay: 'daytime',
        sunElevation: 68,
        sunAzimuth: 140,
        sunlightIntensity: 1.6,
        ambientLightIntensity: 0.65,
        shadowIntensity: 0.4,
        sceneExposure: 1.1,
        indoorLightIntensity: 0.9,
        emergencyLightPreview: false,
      },
      evening: {
        timeOfDay: 'evening',
        sunElevation: 18,
        sunAzimuth: 260,
        sunlightIntensity: 1.1,
        ambientLightIntensity: 0.4,
        shadowIntensity: 0.6,
        sceneExposure: 0.95,
        indoorLightIntensity: 1.4,
        emergencyLightPreview: false,
      },
      night: {
        timeOfDay: 'night',
        sunElevation: 4,
        sunAzimuth: 300,
        sunlightIntensity: 0.15,
        ambientLightIntensity: 0.25,
        shadowIntensity: 0.2,
        sceneExposure: 0.85,
        indoorLightIntensity: 1.8,
        emergencyLightPreview: false,
      },
    };
    set((state) => ({
      lighting: { ...state.lighting, ...presets[preset] },
    }));
  },

  toggleDayNightMode: () => {
    const isCurrentlyDay = get().lighting.timeOfDay === 'daytime' || get().lighting.timeOfDay === 'morning';
    get().setTimeOfDayPreset(isCurrentlyDay ? 'night' : 'daytime');
  },

  setDayNightMode: (mode: 'day' | 'night') => {
    get().setTimeOfDayPreset(mode === 'day' ? 'daytime' : 'night');
  },

  updateLighting: (partial) => {
    set((state) => ({
      lighting: { ...state.lighting, ...partial },
    }));
  },

  acknowledgeAlert: (alertId) => {
    set((state) => ({
      alerts: state.alerts.map((a) =>
        a.id === alertId ? { ...a, status: 'acknowledged', updatedAt: new Date().toISOString() } : a
      ),
    }));
  },

  toggleAudio: () => {
    const isPlaying = audioManager.toggleAudio();
    set({ audioEnabled: isPlaying });
  },

  setAudioVolume: (volume) => {
    audioManager.setVolume(volume);
    set({ audioVolume: volume });
  },

  resetSimulation: () => {
    set({
      buildings: INITIAL_BUILDINGS,
      departments: INITIAL_DEPARTMENTS,
      rooms: INITIAL_ROOMS,
      equipment: INITIAL_EQUIPMENT,
      vehicles: INITIAL_VEHICLES,
      alerts: INITIAL_ALERTS,
      selectedObjectId: null,
      selectedObjectType: null,
      isDetailPanelOpen: false,
      simulationTime: new Date(),
      lighting: DEFAULT_LIGHTING,
      activeFloor: null,
      activeLayer: 'all',
      cameraMode: 'overview',
      autoRotate: false,
    });
  },

  setDetailPanelOpen: (open) => set({ isDetailPanelOpen: open }),
  setKpiOpen: (open) => set({ isKpiOpen: open }),
  setLightingOpen: (open) => set({ isLightingOpen: open }),
  setMapOpen: (open) => set({ isMapOpen: open }),
  setSearchOpen: (open) => set({ isSearchOpen: open }),
  setPrivacyModalOpen: (open) => set({ isPrivacyModalOpen: open }),

  tickSimulation: (deltaSeconds) => {
    const state = get();
    if (!state.isPlaying) return;

    const simDelta = deltaSeconds * state.speedMultiplier;
    const newSimTime = new Date(state.simulationTime.getTime() + simDelta * 1000);

    // Update vehicle positions along their waypoints
    const updatedVehicles = state.vehicles.map((v) => {
      if (v.operationalStatus !== 'in_transit' || v.pathWaypoints.length < 2) return v;

      const newProgress = (v.progress + (v.speed * simDelta * 0.05)) % 1;
      const pts = v.pathWaypoints;
      const totalSegments = pts.length - 1;
      const segmentProgress = newProgress * totalSegments;
      const currentIndex = Math.floor(segmentProgress);
      const nextIndex = (currentIndex + 1) % pts.length;
      const t = segmentProgress - currentIndex;

      const p0 = pts[currentIndex];
      const p1 = pts[nextIndex];

      const currentX = p0.x + (p1.x - p0.x) * t;
      const currentZ = p0.z + (p1.z - p0.z) * t;
      const dx = p1.x - p0.x;
      const dz = p1.z - p0.z;
      const rotationY = Math.atan2(dx, dz);

      // battery consumption
      const newBattery = Math.max(15, v.batteryLevel - simDelta * 0.005);

      return {
        ...v,
        progress: newProgress,
        position: { x: currentX, y: v.position.y, z: currentZ },
        rotationY,
        batteryLevel: Math.round(newBattery * 10) / 10,
        updatedAt: newSimTime.toISOString(),
      };
    });

    // Slight gentle non-identifiable fluctuations in department queues and utilization
    const tickCycle = Math.sin(newSimTime.getTime() / 15000);
    const updatedDepartments = state.departments.map((d, index) => {
      const shift = ((index % 3) - 1) * tickCycle * 0.5;
      const newUtil = Math.min(99, Math.max(35, Math.round(d.utilization + shift)));
      return {
        ...d,
        utilization: newUtil,
        simulatedAvgWaitMinutes: Math.max(5, Math.round(d.simulatedAvgWaitMinutes + shift * 0.3)),
      };
    });

    set({
      simulationTime: newSimTime,
      vehicles: updatedVehicles,
      departments: updatedDepartments,
    });
  },

  getKpi: () => {
    const { departments, rooms, alerts, equipment, vehicles } = get();

    const activeDepts = departments.filter((d) => d.operationalStatus !== 'closed').length;
    const totalDepts = departments.length;

    const totalRoomsCount = rooms.length;
    const availableRoomsCount = rooms.filter((r) => r.status === 'available').length;
    const occupiedRoomsCount = rooms.filter((r) => r.status === 'occupied').length;

    const avgUtil =
      departments.reduce((acc, d) => acc + d.utilization, 0) / (departments.length || 1);

    const aggregatePatients = departments.reduce(
      (acc, d) => acc + d.simulatedQueueLength + d.activeRooms * 2,
      0
    );

    const avgWait =
      departments.reduce((acc, d) => acc + d.simulatedAvgWaitMinutes, 0) /
      (departments.length || 1);

    const activeAlerts = alerts.filter((a) => a.status === 'active').length;
    const criticalAlerts = alerts.filter((a) => a.status === 'active' && a.severity === 'critical')
      .length;

    const readyEquipment = equipment.filter(
      (e) => e.status === 'available' || e.status === 'in_use'
    ).length;
    const equipReadiness = Math.round((readyEquipment / (equipment.length || 1)) * 100);

    const activeVehicles = vehicles.filter((v) => v.operationalStatus === 'in_transit').length;

    return {
      activeDepartments: activeDepts,
      totalDepartments: totalDepts,
      availableRooms: availableRoomsCount,
      occupiedRooms: occupiedRoomsCount,
      totalRooms: totalRoomsCount,
      overallUtilizationRate: Math.round(avgUtil),
      simulatedTotalPatientsAggregate: aggregatePatients,
      simulatedAvgWaitTimeMinutes: Math.round(avgWait),
      activeAlertsCount: activeAlerts,
      criticalAlertsCount: criticalAlerts,
      equipmentReadinessRate: equipReadiness,
      activeVehiclesCount: activeVehicles,
    };
  },
}));
