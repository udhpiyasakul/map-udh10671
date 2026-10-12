import React from 'react';
import {
  Activity,
  DoorOpen,
  DoorClosed,
  PieChart,
  Users,
  Clock,
  AlertTriangle,
  HeartPulse,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export const KpiDashboard: React.FC = () => {
  const isKpiOpen = useAppStore((s) => s.isKpiOpen);
  const setKpiOpen = useAppStore((s) => s.setKpiOpen);
  const getKpi = useAppStore((s) => s.getKpi);
  const alerts = useAppStore((s) => s.alerts);
  const selectObject = useAppStore((s) => s.selectObject);

  const kpi = getKpi();

  if (!isKpiOpen) {
    return (
      <button
        onClick={() => setKpiOpen(true)}
        className="absolute top-14 sm:top-18 left-2 sm:left-4 z-10 px-2.5 py-1.5 sm:px-3 sm:py-1.5 bg-slate-900/90 hover:bg-slate-800 text-sky-400 border border-slate-700/80 rounded-xl backdrop-blur-md shadow-lg text-xs font-semibold flex items-center gap-1.5 transition-all min-h-[36px]"
      >
        <Activity className="w-3.5 h-3.5 text-sky-400" />
        <span className="text-[11px] sm:text-xs">KPI ภาพรวม</span>
        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>
    );
  }

  return (
    <aside className="absolute top-14 sm:top-18 left-2 sm:left-4 right-2 sm:right-auto z-10 sm:max-w-4xl bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-2xl p-2.5 sm:p-3 shadow-2xl transition-all">
      <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800/80">
        <div className="flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-sky-400" />
          <h2 className="text-xs font-bold text-slate-200 tracking-wide">
            KPI ภาพรวมโรงพยาบาลอุดรธานี
          </h2>
          <span className="text-[10px] text-amber-400 font-medium font-mono-numbers hidden sm:inline">
            (SIMULATED DATA)
          </span>
        </div>
        <button
          onClick={() => setKpiOpen(false)}
          className="text-slate-400 hover:text-slate-200 p-1 hover:bg-slate-800/80 rounded-lg transition-colors flex items-center gap-1 text-[11px]"
          title="ย่อแถบ KPI"
        >
          <span className="hidden sm:inline">ย่อ</span>
          <ChevronUp className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Cards: scrollable row on mobile, grid on desktop */}
      <div className="flex overflow-x-auto gap-2 pb-1 no-scrollbar sm:grid sm:grid-cols-4 lg:grid-cols-8">
        {/* 1. Open Departments */}
        <div className="min-w-[125px] sm:min-w-0 bg-slate-900/80 border border-slate-800/80 rounded-xl p-2 flex flex-col justify-between shrink-0 sm:shrink">
          <div className="flex items-center justify-between text-slate-400 text-[10px]">
            <span>แผนกเปิดบริการ</span>
            <Activity className="w-3 h-3 text-emerald-400" />
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-sm sm:text-base font-bold font-mono-numbers text-slate-100">
              {kpi.activeDepartments}
            </span>
            <span className="text-[10px] text-slate-500 font-mono-numbers">
              /{kpi.totalDepartments}
            </span>
          </div>
          <span className="text-[9px] text-emerald-400/90 font-medium">100% ให้บริการ</span>
        </div>

        {/* 2. Available Rooms */}
        <div className="min-w-[125px] sm:min-w-0 bg-slate-900/80 border border-slate-800/80 rounded-xl p-2 flex flex-col justify-between shrink-0 sm:shrink">
          <div className="flex items-center justify-between text-slate-400 text-[10px]">
            <span>ห้องพร้อมใช้</span>
            <DoorOpen className="w-3 h-3 text-sky-400" />
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-sm sm:text-base font-bold font-mono-numbers text-sky-300">
              {kpi.availableRooms}
            </span>
            <span className="text-[10px] text-slate-500 font-mono-numbers">เตียง/ห้อง</span>
          </div>
          <span className="text-[9px] text-slate-400">สถานะว่าง</span>
        </div>

        {/* 3. Occupied Rooms */}
        <div className="min-w-[125px] sm:min-w-0 bg-slate-900/80 border border-slate-800/80 rounded-xl p-2 flex flex-col justify-between shrink-0 sm:shrink">
          <div className="flex items-center justify-between text-slate-400 text-[10px]">
            <span>มีผู้ใช้งาน</span>
            <DoorClosed className="w-3 h-3 text-amber-400" />
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-sm sm:text-base font-bold font-mono-numbers text-amber-300">
              {kpi.occupiedRooms}
            </span>
            <span className="text-[10px] text-slate-500 font-mono-numbers">เตียง/ห้อง</span>
          </div>
          <span className="text-[9px] text-slate-400">กำลังครองเตียง</span>
        </div>

        {/* 4. Overall Utilization */}
        <div className="min-w-[125px] sm:min-w-0 bg-slate-900/80 border border-slate-800/80 rounded-xl p-2 flex flex-col justify-between shrink-0 sm:shrink">
          <div className="flex items-center justify-between text-slate-400 text-[10px]">
            <span>อัตราครองเตียง</span>
            <PieChart className="w-3 h-3 text-indigo-400" />
          </div>
          <div className="mt-1 flex items-baseline gap-0.5">
            <span className="text-sm sm:text-base font-bold font-mono-numbers text-indigo-300">
              {kpi.overallUtilizationRate}
            </span>
            <span className="text-xs text-indigo-400 font-bold">%</span>
          </div>
          <span className="text-[9px] text-slate-400">ระดับการใช้พื้นที่</span>
        </div>

        {/* 5. Simulated Aggregate Patients */}
        <div className="min-w-[125px] sm:min-w-0 bg-slate-900/80 border border-slate-800/80 rounded-xl p-2 flex flex-col justify-between shrink-0 sm:shrink">
          <div className="flex items-center justify-between text-slate-400 text-[10px]">
            <span>ผู้รับบริการรวม</span>
            <Users className="w-3 h-3 text-cyan-400" />
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-sm sm:text-base font-bold font-mono-numbers text-slate-100">
              {kpi.simulatedTotalPatientsAggregate}
            </span>
            <span className="text-[10px] text-slate-500">คน</span>
          </div>
          <span className="text-[9px] text-slate-500">ไม่ระบุตัวบุคคล</span>
        </div>

        {/* 6. Avg Wait Time */}
        <div className="min-w-[125px] sm:min-w-0 bg-slate-900/80 border border-slate-800/80 rounded-xl p-2 flex flex-col justify-between shrink-0 sm:shrink">
          <div className="flex items-center justify-between text-slate-400 text-[10px]">
            <span>เวลารอคอยเฉลี่ย</span>
            <Clock className="w-3 h-3 text-amber-400" />
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-sm sm:text-base font-bold font-mono-numbers text-slate-100">
              {kpi.simulatedAvgWaitTimeMinutes}
            </span>
            <span className="text-[10px] text-slate-500">นาที</span>
          </div>
          <span className="text-[9px] text-amber-400/90 font-medium">จุดคัดกรอง & OPD</span>
        </div>

        {/* 7. Active Alerts */}
        <div
          onClick={() => {
            const firstActive = alerts.find((a) => a.status === 'active');
            if (firstActive) selectObject(firstActive.id, 'alert');
          }}
          className="min-w-[125px] sm:min-w-0 bg-slate-900/80 hover:bg-slate-800/90 cursor-pointer border border-slate-800/80 hover:border-red-500/40 rounded-xl p-2 flex flex-col justify-between transition-colors shrink-0 sm:shrink"
        >
          <div className="flex items-center justify-between text-slate-400 text-[10px]">
            <span>คำเตือนระบบ</span>
            <AlertTriangle
              className={`w-3 h-3 ${
                kpi.criticalAlertsCount > 0 ? 'text-red-400 animate-pulse' : 'text-amber-400'
              }`}
            />
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span
              className={`text-sm sm:text-base font-bold font-mono-numbers ${
                kpi.criticalAlertsCount > 0 ? 'text-red-400' : 'text-amber-400'
              }`}
            >
              {kpi.activeAlertsCount}
            </span>
            <span className="text-[10px] text-slate-500">เหตุ</span>
          </div>
          <span className="text-[9px] text-red-400/90 font-medium">
            {kpi.criticalAlertsCount} วิกฤต
          </span>
        </div>

        {/* 8. Medical Equipment Readiness */}
        <div className="min-w-[125px] sm:min-w-0 bg-slate-900/80 border border-slate-800/80 rounded-xl p-2 flex flex-col justify-between shrink-0 sm:shrink">
          <div className="flex items-center justify-between text-slate-400 text-[10px]">
            <span>อุปกรณ์พร้อมใช้</span>
            <HeartPulse className="w-3 h-3 text-emerald-400" />
          </div>
          <div className="mt-1 flex items-baseline gap-0.5">
            <span className="text-sm sm:text-base font-bold font-mono-numbers text-emerald-300">
              {kpi.equipmentReadinessRate}
            </span>
            <span className="text-xs text-emerald-400 font-bold">%</span>
          </div>
          <span className="text-[9px] text-slate-400">CT / MRI / Vent</span>
        </div>
      </div>
    </aside>
  );
};
