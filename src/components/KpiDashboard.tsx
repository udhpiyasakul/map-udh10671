import React from 'react';
import {
  Building2,
  Layers,
  Phone,
  DoorOpen,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  Database,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export const KpiDashboard: React.FC = () => {
  const isKpiOpen = useAppStore((s) => s.isKpiOpen);
  const setKpiOpen = useAppStore((s) => s.setKpiOpen);
  const buildings = useAppStore((s) => s.buildings);
  const rooms = useAppStore((s) => s.rooms);
  const selectObject = useAppStore((s) => s.selectObject);

  // Factual calculations based purely on imported data
  const totalBuildingsCount = buildings.length; // 23 real buildings
  const buildingsWithRealData = buildings.filter((b) => rooms.some((r) => r.buildingId === b.id)).length;
  const buildingsPendingData = totalBuildingsCount - buildingsWithRealData;
  const recordedRoomsCount = rooms.length;
  const recordedPhonesCount = rooms.filter((r) => Boolean(r.phone)).length;

  if (!isKpiOpen) {
    return (
      <button
        onClick={() => setKpiOpen(true)}
        className="absolute top-14 sm:top-18 left-2 sm:left-4 z-10 px-2.5 py-1.5 sm:px-3 sm:py-1.5 bg-slate-900/90 hover:bg-slate-800 text-sky-400 border border-slate-700/80 rounded-xl backdrop-blur-md shadow-lg text-xs font-semibold flex items-center gap-1.5 transition-all min-h-[36px]"
      >
        <Database className="w-3.5 h-3.5 text-sky-400" />
        <span className="text-[11px] sm:text-xs">สถานะข้อมูลอาคาร ({totalBuildingsCount})</span>
        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>
    );
  }

  return (
    <aside className="absolute top-14 sm:top-18 left-2 sm:left-4 right-2 sm:right-auto z-10 sm:max-w-4xl bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-2xl p-2.5 sm:p-3 shadow-2xl transition-all">
      <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800/80">
        <div className="flex items-center gap-1.5">
          <Database className="w-4 h-4 text-sky-400" />
          <h2 className="text-xs font-bold text-slate-200 tracking-wide">
            สถานะฐานข้อมูลอาคาร โรงพยาบาลอุดรธานี
          </h2>
          <span className="text-[10px] text-emerald-400 font-semibold hidden sm:inline bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
            ระบบข้อมูลจริง 23 อาคาร
          </span>
          <span className="text-[10px] text-sky-400 font-medium hidden sm:inline">
            (อาคารเมตตาธรรม 4 ชั้น F1-F4)
          </span>
        </div>
        <button
          onClick={() => setKpiOpen(false)}
          className="text-slate-400 hover:text-slate-200 p-1 hover:bg-slate-800/80 rounded-lg transition-colors flex items-center gap-1 text-[11px]"
          title="ย่อแถบสถานะ"
        >
          <span className="hidden sm:inline">ย่อ</span>
          <ChevronUp className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Cards: Factual Campus Directory Metrics */}
      <div className="flex overflow-x-auto gap-2 pb-1 no-scrollbar sm:grid sm:grid-cols-3 lg:grid-cols-6">
        {/* 1. Total Buildings */}
        <div className="min-w-[130px] sm:min-w-0 bg-slate-900/80 border border-slate-800/80 rounded-xl p-2 flex flex-col justify-between shrink-0 sm:shrink">
          <div className="flex items-center justify-between text-slate-400 text-[10px]">
            <span>อาคารในผังแม่บท</span>
            <Building2 className="w-3 h-3 text-sky-400" />
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-sm sm:text-base font-bold font-mono-numbers text-slate-100">
              {totalBuildingsCount}
            </span>
            <span className="text-[10px] text-slate-500">อาคาร</span>
          </div>
          <span className="text-[9px] text-slate-400 font-medium">โครงสร้าง 3D สมบูรณ์</span>
        </div>

        {/* 2. Metta Tham Building */}
        <div
          onClick={() => selectObject('bldg-metta', 'building')}
          className="min-w-[130px] sm:min-w-0 bg-slate-900/80 hover:bg-slate-800/90 cursor-pointer border border-sky-500/30 rounded-xl p-2 flex flex-col justify-between shrink-0 sm:shrink transition-colors"
        >
          <div className="flex items-center justify-between text-sky-300 text-[10px] font-semibold">
            <span>อาคารเมตตาธรรม</span>
            <Layers className="w-3 h-3 text-sky-400" />
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-sm sm:text-base font-bold font-mono-numbers text-sky-300">
              4
            </span>
            <span className="text-[10px] text-slate-400">ชั้น (F1-F4)</span>
          </div>
          <span className="text-[9px] text-emerald-400 font-medium">ตัดชั้นดูโมเดล 3D ได้</span>
        </div>

        {/* 3. Buildings with Real Data */}
        <div className="min-w-[130px] sm:min-w-0 bg-slate-900/80 border border-slate-800/80 rounded-xl p-2 flex flex-col justify-between shrink-0 sm:shrink">
          <div className="flex items-center justify-between text-slate-400 text-[10px]">
            <span>มีข้อมูลจริงในระบบ</span>
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-sm sm:text-base font-bold font-mono-numbers text-emerald-300">
              {buildingsWithRealData}
            </span>
            <span className="text-[10px] text-slate-500 font-mono-numbers">/{totalBuildingsCount} อาคาร</span>
          </div>
          <span className="text-[9px] text-emerald-400/90 font-medium">นำเข้าข้อมูลแล้ว</span>
        </div>

        {/* 4. Buildings Awaiting Real Data */}
        <div className="min-w-[130px] sm:min-w-0 bg-slate-900/80 border border-slate-800/80 rounded-xl p-2 flex flex-col justify-between shrink-0 sm:shrink">
          <div className="flex items-center justify-between text-slate-400 text-[10px]">
            <span>รอข้อมูลจริง</span>
            <Clock className="w-3 h-3 text-amber-400" />
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-sm sm:text-base font-bold font-mono-numbers text-amber-300">
              {buildingsPendingData}
            </span>
            <span className="text-[10px] text-slate-500 font-mono-numbers">อาคาร</span>
          </div>
          <span className="text-[9px] text-amber-400/90 font-medium">วางข้อความในแชตได้</span>
        </div>

        {/* 5. Recorded Real Rooms */}
        <div className="min-w-[130px] sm:min-w-0 bg-slate-900/80 border border-slate-800/80 rounded-xl p-2 flex flex-col justify-between shrink-0 sm:shrink">
          <div className="flex items-center justify-between text-slate-400 text-[10px]">
            <span>จุดบริการจริงที่บันทึก</span>
            <DoorOpen className="w-3 h-3 text-teal-400" />
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-sm sm:text-base font-bold font-mono-numbers text-teal-300">
              {recordedRoomsCount}
            </span>
            <span className="text-[10px] text-slate-500 font-mono-numbers">จุด</span>
          </div>
          <span className="text-[9px] text-teal-400 font-medium">ห้องตรวจ/คลินิก</span>
        </div>

        {/* 6. Recorded Telephones */}
        <div className="min-w-[130px] sm:min-w-0 bg-slate-900/80 border border-slate-800/80 rounded-xl p-2 flex flex-col justify-between shrink-0 sm:shrink">
          <div className="flex items-center justify-between text-slate-400 text-[10px]">
            <span>เบอร์โทรสายในจริง</span>
            <Phone className="w-3 h-3 text-sky-400" />
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-sm sm:text-base font-bold font-mono-numbers text-sky-200">
              {recordedPhonesCount}
            </span>
            <span className="text-[10px] text-slate-500 font-mono-numbers">เบอร์</span>
          </div>
          <span className="text-[9px] text-sky-400 font-medium">ต่อสายตรง 042-245555</span>
        </div>
      </div>
    </aside>
  );
};
