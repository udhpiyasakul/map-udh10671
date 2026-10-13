import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Compass,
  Video,
  Layers,
  Eye,
  Plane,
  Tag,
  Sun,
  Moon,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export const ControlDock: React.FC = () => {
  const isPlaying = useAppStore((s) => s.isPlaying);
  const speedMultiplier = useAppStore((s) => s.speedMultiplier);
  const cameraMode = useAppStore((s) => s.cameraMode);
  const autoRotate = useAppStore((s) => s.autoRotate);
  const activeFloor = useAppStore((s) => s.activeFloor);
  const lighting = useAppStore((s) => s.lighting);
  const showFloatingLabels = useAppStore((s) => s.showFloatingLabels);

  // Actions
  const setPlaying = useAppStore((s) => s.setPlaying);
  const setSpeedMultiplier = useAppStore((s) => s.setSpeedMultiplier);
  const setCameraMode = useAppStore((s) => s.setCameraMode);
  const setAutoRotate = useAppStore((s) => s.setAutoRotate);
  const setActiveFloor = useAppStore((s) => s.setActiveFloor);
  const resetSimulation = useAppStore((s) => s.resetSimulation);
  const toggleDayNightMode = useAppStore((s) => s.toggleDayNightMode);
  const clearSelection = useAppStore((s) => s.clearSelection);
  const selectObject = useAppStore((s) => s.selectObject);
  const toggleFloatingLabels = useAppStore((s) => s.toggleFloatingLabels);

  const handleOverviewClick = () => {
    clearSelection();
    setCameraMode('overview');
    setAutoRotate(false);
  };

  const handleHelipadFocus = () => {
    selectObject('opd', 'building', {
      position: { x: 75, y: 38, z: 72 },
      target: { x: 62, y: 24, z: 51 },
    });
  };

  const handleRotate360Toggle = () => {
    setAutoRotate(!autoRotate);
    if (!autoRotate) {
      setCameraMode('orbit');
    }
  };

  const handleFlythroughToggle = () => {
    if (cameraMode === 'flythrough') {
      setCameraMode('overview');
    } else {
      setCameraMode('flythrough');
    }
  };

  return (
    <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 w-[calc(100%-1rem)] sm:w-auto max-w-3xl bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-2xl p-1.5 sm:p-2 shadow-2xl flex items-center justify-between sm:justify-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar">
      {/* 1. Simulation Play / Pause / Speeds */}
      <div className="flex items-center gap-1 bg-slate-900/90 p-1 border border-slate-800/80 rounded-xl shrink-0">
        <button
          onClick={() => setPlaying(!isPlaying)}
          className={`p-2 sm:p-1.5 rounded-lg text-xs font-medium transition-colors min-w-[34px] min-h-[34px] sm:min-w-0 sm:min-h-0 flex items-center justify-center ${
            isPlaying
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
          }`}
          title={isPlaying ? 'หยุดการจำลองชั่วคราว (Pause)' : 'เริ่มการจำลองต่อ (Play)'}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>

        {/* Speed selectors */}
        <div className="flex items-center gap-0.5">
          {([1, 3, 8] as const).map((spd) => (
            <button
              key={spd}
              onClick={() => setSpeedMultiplier(spd)}
              className={`px-2 py-1.5 sm:py-1 text-[11px] font-mono-numbers rounded-lg transition-colors min-h-[34px] sm:min-h-0 flex items-center justify-center ${
                speedMultiplier === spd
                  ? 'bg-sky-500 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
              title={`ปรับความเร็วการจำลอง ${spd}x`}
            >
              {spd}x
            </button>
          ))}
        </div>

        <button
          onClick={resetSimulation}
          className="p-2 sm:p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors min-w-[34px] min-h-[34px] sm:min-w-0 sm:min-h-0 flex items-center justify-center"
          title="รีเซ็ตสถานะการจำลอง (Reset Simulation)"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 2. Camera Mode Controls */}
      <div className="flex items-center gap-1 bg-slate-900/90 p-1 border border-slate-800/80 rounded-xl shrink-0">
        {/* Reset / Overview */}
        <button
          onClick={handleOverviewClick}
          className={`flex items-center gap-1 px-2.5 py-1.5 sm:py-1 text-xs rounded-lg transition-colors min-h-[34px] sm:min-h-0 ${
            cameraMode === 'overview' && !autoRotate
              ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="มุมมองภาพรวมทั้งโรงพยาบาล (Overview)"
        >
          <Eye className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">ภาพรวม</span>
        </button>

        {/* 360 Auto Orbit */}
        <button
          onClick={handleRotate360Toggle}
          className={`flex items-center gap-1 px-2.5 py-1.5 sm:py-1 text-xs rounded-lg transition-colors min-h-[34px] sm:min-h-0 ${
            autoRotate
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="หมุนมุมมอง 360 องศาอัตโนมัติ"
        >
          <Compass className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">หมุน 360°</span>
        </button>

        {/* Flythrough Tour */}
        <button
          onClick={handleFlythroughToggle}
          className={`flex items-center gap-1 px-2.5 py-1.5 sm:py-1 text-xs rounded-lg transition-colors min-h-[34px] sm:min-h-0 ${
            cameraMode === 'flythrough'
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="เคลื่อนกล้องสำรวจรอบพื้นที่ (Flythrough Tour)"
        >
          <Video className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">ทัวร์บิน</span>
        </button>

        {/* Quick Focus on OPD Helipad */}
        <button
          onClick={handleHelipadFocus}
          className="flex items-center gap-1 px-2.5 py-1.5 sm:py-1 text-xs rounded-lg transition-colors min-h-[34px] sm:min-h-0 text-rose-300 hover:text-white hover:bg-rose-500/20"
          title="ซูมดูกล้องลานจอด ฮ. บนตึกอำนวยการ (OPD Rooftop Helipad)"
        >
          <Plane className="w-3.5 h-3.5 text-rose-400" />
          <span className="hidden sm:inline">ลาน ฮ.</span>
        </button>

        {/* Quick 3D Labels Toggle */}
        <button
          onClick={toggleFloatingLabels}
          className={`flex items-center gap-1 px-2.5 py-1.5 sm:py-1 text-xs rounded-lg transition-colors min-h-[34px] sm:min-h-0 ${
            showFloatingLabels
              ? 'text-sky-300 bg-sky-500/20 border border-sky-500/30 font-semibold'
              : 'text-slate-500 hover:text-slate-300'
          }`}
          title="เปิด/ปิด ป้ายชื่ออาคาร 3D ลอยเหนือตึก"
        >
          <Tag className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">ป้ายชื่อ</span>
        </button>
      </div>

      {/* 3. Floor Cutaway Filter */}
      <div className="flex items-center gap-1 bg-slate-900/90 p-1 border border-slate-800/80 rounded-xl shrink-0">
        <Layers className="w-3.5 h-3.5 text-slate-400 ml-1 hidden xs:inline" />
        <span className="text-[11px] text-slate-400 hidden md:inline">ชั้น:</span>
        <button
          onClick={() => setActiveFloor(null)}
          className={`px-2 py-1.5 sm:py-1 text-[11px] rounded-lg transition-colors min-h-[34px] sm:min-h-0 flex items-center justify-center ${
            activeFloor === null
              ? 'bg-slate-800 text-sky-400 font-bold border border-sky-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="แสดงทุกชั้นอาคาร"
        >
          ทั้งหมด
        </button>
        {[1, 2, 3, 4, 5].map((flr) => (
          <button
            key={flr}
            onClick={() => setActiveFloor(activeFloor === flr ? null : flr)}
            className={`px-2 py-1.5 sm:py-1 text-[11px] font-mono-numbers rounded-lg transition-colors min-h-[34px] sm:min-h-0 flex items-center justify-center ${
              activeFloor === flr
                ? 'bg-sky-500 text-white font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title={`เจาะดูชั้น ${flr} (Floor ${flr} Cutaway View)`}
          >
            F{flr}
          </button>
        ))}
      </div>
    </div>
  );
};
