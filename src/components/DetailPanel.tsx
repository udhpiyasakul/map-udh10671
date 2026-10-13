import React, { useState } from 'react';
import {
  X,
  MapPin,
  Building2,
  Stethoscope,
  Truck,
  AlertTriangle,
  Clock,
  Layers,
  Wrench,
  CheckCircle,
  Eye,
  BatteryCharging,
  Users,
  Shield,
  Phone,
  Copy,
  Check,
  DoorOpen,
  Search,
  RefreshCw,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export const DetailPanel: React.FC = () => {
  const isDetailPanelOpen = useAppStore((s) => s.isDetailPanelOpen);
  const selectedObjectId = useAppStore((s) => s.selectedObjectId);
  const selectedObjectType = useAppStore((s) => s.selectedObjectType);
  const buildings = useAppStore((s) => s.buildings);
  const departments = useAppStore((s) => s.departments);
  const rooms = useAppStore((s) => s.rooms);
  const equipment = useAppStore((s) => s.equipment);
  const vehicles = useAppStore((s) => s.vehicles);
  const alerts = useAppStore((s) => s.alerts);

  // Actions
  const clearSelection = useAppStore((s) => s.clearSelection);
  const acknowledgeAlert = useAppStore((s) => s.acknowledgeAlert);
  const selectObject = useAppStore((s) => s.selectObject);
  const setActiveFloor = useAppStore((s) => s.setActiveFloor);
  const activeFloor = useAppStore((s) => s.activeFloor);
  const resetBuildingToOfficial = useAppStore((s) => s.resetBuildingToOfficial);

  // Local state
  const [showMaintDetails, setShowMaintDetails] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);
  const [buildingRoomSearch, setBuildingRoomSearch] = useState('');

  const handleCopyPhone = (phone: string) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(phone);
    }
    setCopiedPhone(phone);
    setTimeout(() => {
      setCopiedPhone((curr) => (curr === phone ? null : curr));
    }, 2000);
  };

  if (!isDetailPanelOpen || !selectedObjectId) return null;

  // Resolve entity
  const building = buildings.find((b) => b.id === selectedObjectId);
  const department = departments.find((d) => d.id === selectedObjectId);
  const room = rooms.find((r) => r.id === selectedObjectId);
  const eq = equipment.find((e) => e.id === selectedObjectId);
  const vehicle = vehicles.find((v) => v.id === selectedObjectId);
  const alert = alerts.find((a) => a.id === selectedObjectId);

  return (
    <aside className="fixed inset-x-0 bottom-0 sm:inset-x-auto sm:top-18 sm:right-4 sm:bottom-20 z-30 w-full sm:w-96 max-h-[85vh] sm:max-h-none bg-slate-950/95 backdrop-blur-xl border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all animate-in fade-in slide-in-from-bottom sm:slide-in-from-right duration-200">
      {/* Mobile drag handle bar */}
      <div className="w-12 h-1 bg-slate-700/80 rounded-full mx-auto my-2 sm:hidden shrink-0" />

      {/* Header */}
      <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-slate-800/80 bg-slate-900/60 shrink-0">
        <div className="flex items-center gap-2">
          {building && <Building2 className="w-5 h-5 text-sky-400" />}
          {department && <Layers className="w-5 h-5 text-indigo-400" />}
          {room && <MapPin className="w-5 h-5 text-emerald-400" />}
          {eq && <Stethoscope className="w-5 h-5 text-purple-400" />}
          {vehicle && <Truck className="w-5 h-5 text-amber-400" />}
          {alert && <AlertTriangle className="w-5 h-5 text-red-400" />}
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              {selectedObjectType} Information
            </span>
            <div className="flex items-center gap-1.5 text-[10px]">
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                ข้อมูลจริง รพ.อุดรธานี
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={clearSelection}
          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
          title="ปิดแผงรายละเอียด"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* ================= BUILDING VIEW ================= */}
        {building && (
          <div className="space-y-4">
            <div>
              <div className="text-xs font-mono-numbers text-sky-400">{building.code}</div>
              <h2 className="text-base font-bold text-white mt-0.5">{building.nameTh}</h2>
              <div className="text-xs text-slate-400">{building.nameEn}</div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800">
              {building.descriptionTh}
            </p>

            {/* Building Factual Details */}
            {(() => {
              const bldRoomsCount = rooms.filter((r) => r.buildingId === building.id).length;
              return (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80">
                    <span className="text-slate-400 text-[11px] block">จำนวนชั้นโครงสร้าง</span>
                    <span className="font-bold text-slate-100 font-mono-numbers text-sm">
                      {building.floorCount} ชั้น (F1-F{building.floorCount})
                    </span>
                  </div>
                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80">
                    <span className="text-slate-400 text-[11px] block">รหัสอาคาร</span>
                    <span className="font-bold text-sky-400 font-mono-numbers text-sm">
                      {building.code}
                    </span>
                  </div>
                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80">
                    <span className="text-slate-400 text-[11px] block">จุดบริการที่บันทึก</span>
                    <span className="font-bold text-emerald-400 font-mono-numbers text-sm">
                      {bldRoomsCount > 0 ? `${bldRoomsCount} จุดบริการ` : 'รอข้อมูลจากแชต'}
                    </span>
                  </div>
                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80">
                    <span className="text-slate-400 text-[11px] block">สถานะข้อมูล</span>
                    <span className="font-bold text-slate-200 text-sm">
                      {bldRoomsCount > 0 ? 'บันทึกข้อมูลแล้ว' : 'รอการนำเข้าข้อมูล'}
                    </span>
                  </div>
                </div>
              );
            })()}

            {/* Floor Cutaway Controls for Building */}
            {building.floorCount > 1 && (
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-sky-400" />
                    <span>มุมมองตัดชั้น 3D (Floor Cutaway F1-F{building.floorCount})</span>
                  </span>
                  {activeFloor && (
                    <button
                      type="button"
                      onClick={() => setActiveFloor(null)}
                      className="text-[10px] text-sky-400 hover:text-sky-300 underline"
                    >
                      ดูทุกชั้น
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setActiveFloor(null)}
                    className={`px-2.5 py-1 text-xs rounded transition-colors ${
                      activeFloor === null
                        ? 'bg-sky-500 text-white font-bold'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700'
                    }`}
                  >
                    ทุกชั้น
                  </button>
                  {Array.from({ length: building.floorCount }, (_, i) => i + 1).map((flr) => (
                    <button
                      key={flr}
                      type="button"
                      onClick={() => setActiveFloor(activeFloor === flr ? null : flr)}
                      className={`px-2.5 py-1 text-xs font-mono-numbers rounded transition-colors ${
                        activeFloor === flr
                          ? 'bg-sky-500 text-white font-bold shadow-sm'
                          : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700'
                      }`}
                    >
                      F{flr}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Special Rooftop Helipad Badge for OPD Building */}
            {building.id === 'opd' && (
              <div className="p-3 rounded-xl bg-gradient-to-r from-rose-950/40 to-slate-900 border border-rose-500/40 space-y-1.5 shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-300">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    <span>🚁 ลานจอด ฮ. ดาดฟ้า (Rooftop Helipad)</span>
                  </div>
                  <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded">
                    ชั้นดาดฟ้า F7
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  ลานจอดเฮลิคอปเตอร์กู้ชีพฉุกเฉินทางการแพทย์ รองรับเฮลิคอปเตอร์ส่งต่อผู้ป่วยวิกฤต (EMS Air Transfer) มีวงกลมสัญลักษณ์ H และไฟสัญญาณนำร่องการบินรอบทิศทาง 24 ชม.
                </p>
              </div>
            )}

            {/* Real Examination Rooms & POIs inside this building */}
            {(() => {
              const bldRooms = rooms.filter((r) => r.buildingId === building.id);
              const floorFilteredRooms = bldRooms.filter((r) => {
                const matchesFloor = activeFloor === null || r.floor === activeFloor;
                if (!matchesFloor) return false;
                if (!buildingRoomSearch.trim()) return true;
                const q = buildingRoomSearch.trim().toLowerCase();
                return (
                  r.name.toLowerCase().includes(q) ||
                  (r.phone && r.phone.includes(q)) ||
                  (r.category && r.category.toLowerCase().includes(q))
                );
              });

              if (bldRooms.length === 0) {
                return (
                  <div className="space-y-3">
                    <div className="p-3.5 rounded-xl bg-slate-900/90 border border-sky-500/30 space-y-2.5 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sky-300 font-bold text-xs">
                          <Building2 className="w-4 h-4 text-sky-400 shrink-0" />
                          <span>โครงสร้างอาคาร {building.nameTh} ({building.floorCount} ชั้น)</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => resetBuildingToOfficial(building.id)}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-600/90 hover:bg-emerald-500 text-white flex items-center gap-1 shadow-sm transition-colors"
                        >
                          <RefreshCw className="w-3 h-3 text-white" />
                          <span>โหลดข้อมูลทางการจากไฟล์แนบ</span>
                        </button>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        โครงสร้างโมเดล 3D และจำนวนชั้นถูกต้องตามผังแม่บท รพ.อุดรธานี
                      </p>
                    </div>
                  </div>
                );
              }

              return (
                <div className="space-y-3">
                  {/* Real Examination Rooms Box */}
                  <div className="space-y-2 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                        <DoorOpen className="w-4 h-4 text-emerald-400" />
                        <span>
                          จุดบริการและห้องตรวจจริง ({floorFilteredRooms.length}/{bldRooms.length} จุด
                          {activeFloor !== null ? ` ชั้น F${activeFloor}` : ''})
                        </span>
                      </h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 font-semibold border border-emerald-500/30 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        ข้อมูลจริง รพ.อุดรธานี
                      </span>
                    </div>

                    {/* Quick Search inside building rooms */}
                    {bldRooms.length > 4 && (
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={buildingRoomSearch}
                          onChange={(e) => setBuildingRoomSearch(e.target.value)}
                          placeholder="ค้นหาห้อง, คลินิก, เบอร์ภายใน..."
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-8 py-1.5 text-[11px] text-slate-200 placeholder-slate-500 outline-none focus:border-sky-500/60"
                        />
                        {buildingRoomSearch && (
                          <button
                            type="button"
                            onClick={() => setBuildingRoomSearch('')}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-[10px] px-1.5 py-0.5 rounded bg-slate-800"
                          >
                            ล้าง
                          </button>
                        )}
                      </div>
                    )}

                    {/* Rooms List */}
                    <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                      {floorFilteredRooms.length === 0 ? (
                        <div className="text-center py-4 text-xs text-slate-500">
                          ไม่พบจุดบริการที่ค้นหาในชั้นนี้
                        </div>
                      ) : (
                        floorFilteredRooms.map((r) => {
                          const phoneMatch = r.name.match(/\[โทร\.([^\]]+)\]/);
                          const roomPhone = r.phone || (phoneMatch ? phoneMatch[1] : undefined);
                          const roomCleanName = r.cleanName || r.name.replace(/\s*\[โทร\.[^\]]+\]/, '');

                          return (
                            <div
                              key={r.id}
                              onClick={() => selectObject(r.id, 'room')}
                              className="p-2.5 bg-slate-950/80 hover:bg-slate-800 border border-slate-800/90 hover:border-emerald-500/50 rounded-xl cursor-pointer transition-all group flex items-start justify-between gap-2"
                            >
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[10px] font-mono-numbers px-1.5 py-0.5 rounded bg-slate-800 text-sky-300 font-bold border border-slate-700/60 shrink-0">
                                    F{r.floor}
                                  </span>
                                  <h4 className="text-xs font-semibold text-slate-200 group-hover:text-emerald-300 transition-colors leading-snug truncate">
                                    {roomCleanName}
                                  </h4>
                                </div>
                                <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                                  {r.category && (
                                    <span className="text-slate-400">
                                      {r.category}
                                    </span>
                                  )}
                                  <span className="text-slate-600">·</span>
                                  <span className="text-emerald-400 font-medium">
                                    ข้อมูลจริง
                                  </span>
                                </div>
                              </div>

                              {roomPhone && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCopyPhone(roomPhone);
                                  }}
                                  className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-mono-numbers font-semibold transition-all shrink-0 ${
                                    copiedPhone === roomPhone
                                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-sm'
                                      : 'bg-slate-900 hover:bg-sky-500/20 text-sky-400 border border-slate-700/80 hover:border-sky-500/40'
                                  }`}
                                  title={`คัดลอกเบอร์โทร ${roomPhone}`}
                                >
                                  {copiedPhone === roomPhone ? (
                                    <>
                                      <Check className="w-3 h-3 text-emerald-400" />
                                      <span className="text-[10px]">คัดลอกแล้ว</span>
                                    </>
                                  ) : (
                                    <>
                                      <span>ต่อ {roomPhone}</span>
                                      <Copy className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                                    </>
                                  )}
                                </button>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Departments inside this building */}
            {departments.filter((d) => d.buildingId === building.id).length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-slate-300 mb-2 flex items-center justify-between">
                  <span>แผนกภายในอาคาร ({departments.filter((d) => d.buildingId === building.id).length})</span>
                </h3>
                <div className="space-y-1.5">
                  {departments
                    .filter((d) => d.buildingId === building.id)
                    .map((dept) => (
                      <div
                        key={dept.id}
                        onClick={() => selectObject(dept.id, 'department')}
                        className="p-2.5 bg-slate-900/60 hover:bg-slate-800/80 cursor-pointer rounded-lg border border-slate-800 flex items-center justify-between transition-colors"
                      >
                        <div>
                          <div className="text-xs font-medium text-slate-200">{dept.nameTh}</div>
                          <div className="text-[10px] text-slate-500 font-mono-numbers">
                            ชั้น {dept.floor}
                          </div>
                        </div>
                        <span className="text-[11px] font-semibold text-emerald-400">
                          เปิดบริการ
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= DEPARTMENT VIEW ================= */}
        {department && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono-numbers text-sky-400">
                <span>{department.id}</span>
                <span aria-hidden="true">·</span>
                <span>ชั้น {department.floor}</span>
              </div>
              <h2 className="text-base font-bold text-white mt-0.5">{department.nameTh}</h2>
              <div className="text-xs text-slate-400">{department.nameEn}</div>
            </div>

            {/* Department Factual Information */}
            {(() => {
              const deptRooms = rooms.filter((r) => r.departmentId === department.id);
              const bld = buildings.find((b) => b.id === department.buildingId);
              return (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80">
                    <span className="text-slate-400 text-[11px] block">ชั้นที่ตั้ง</span>
                    <span className="font-bold text-slate-100 font-mono-numbers text-sm">
                      ชั้น {department.floor}
                    </span>
                  </div>
                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80">
                    <span className="text-slate-400 text-[11px] block">สังกัดอาคาร</span>
                    <span className="font-bold text-sky-400 text-sm truncate block">
                      {bld?.nameTh || department.buildingId}
                    </span>
                  </div>
                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80">
                    <span className="text-slate-400 text-[11px] block">ห้องบริการในระบบ</span>
                    <span className="font-bold text-emerald-400 font-mono-numbers text-sm">
                      {deptRooms.length} ห้อง
                    </span>
                  </div>
                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80">
                    <span className="text-slate-400 text-[11px] block">สถานะแผนก</span>
                    <span className="font-bold text-emerald-400 text-sm">
                      เปิดให้บริการ
                    </span>
                  </div>
                </div>
              );
            })()}

            {/* Quick floor cutaway action */}
            <button
              onClick={() => setActiveFloor(department.floor)}
              className="w-full py-2 px-3 text-xs font-medium bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-sky-300 flex items-center justify-center gap-2 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>ตัดมุมมองเฉพาะชั้น {department.floor}</span>
            </button>

            {/* Rooms inside department */}
            <div>
              <h3 className="text-xs font-bold text-slate-300 mb-2 flex items-center justify-between">
                <span>ห้องบริการจริง ({rooms.filter((r) => r.departmentId === department.id).length})</span>
                <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
                  ข้อมูลจริง รพ.อุดรธานี
                </span>
              </h3>
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {rooms
                  .filter((r) => r.departmentId === department.id)
                  .map((rm) => {
                    const phoneMatch = rm.name.match(/\[โทร\.([^\]]+)\]/);
                    const roomPhone = rm.phone || (phoneMatch ? phoneMatch[1] : undefined);
                    const roomCleanName = rm.cleanName || rm.name.replace(/\s*\[โทร\.[^\]]+\]/, '');

                    return (
                      <div
                        key={rm.id}
                        onClick={() => selectObject(rm.id, 'room')}
                        className="p-2.5 bg-slate-900/60 hover:bg-slate-800/80 cursor-pointer rounded-lg border border-slate-800 flex items-center justify-between transition-colors group"
                      >
                        <div className="min-w-0 flex-1 pr-2">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-mono-numbers px-1.5 py-0.5 rounded bg-slate-800 text-sky-300 font-bold border border-slate-700/60 shrink-0">
                              F{rm.floor}
                            </span>
                            <div className="text-xs font-medium text-slate-200 group-hover:text-emerald-300 transition-colors truncate">
                              {roomCleanName}
                            </div>
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono-numbers capitalize mt-0.5">
                            {rm.category || rm.roomType}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {roomPhone && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyPhone(roomPhone);
                              }}
                              className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono-numbers transition-all ${
                                copiedPhone === roomPhone
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                                  : 'bg-slate-800 hover:bg-sky-500/20 text-sky-400 border border-slate-700'
                              }`}
                              title={`คัดลอกเบอร์โทร ${roomPhone}`}
                            >
                              {copiedPhone === roomPhone ? (
                                <Check className="w-2.5 h-2.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-2.5 h-2.5 opacity-60" />
                              )}
                              <span>ต่อ {roomPhone}</span>
                            </button>
                          )}
                          <span
                            className={`text-[10px] font-semibold px-1.5 py-0.5 rounded capitalize ${
                              rm.status === 'available'
                                ? 'text-emerald-400 bg-emerald-500/10'
                                : 'text-amber-400 bg-amber-500/10'
                            }`}
                          >
                            {rm.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {/* ================= ROOM VIEW ================= */}
        {room && (() => {
          const roomPhoneMatch = room.name.match(/\[โทร\.([^\]]+)\]/);
          const roomPhone = roomPhoneMatch ? roomPhoneMatch[1] : undefined;
          const roomCleanName = room.name.replace(/\s*\[โทร\.[^\]]+\]/, '');
          const bld = buildings.find((b) => b.id === room.buildingId);

          return (
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono-numbers text-sky-400">
                  <span>{room.id}</span>
                  {bld && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-slate-400">{bld.nameTh}</span>
                    </>
                  )}
                  <span aria-hidden="true">·</span>
                  <span>ชั้น {room.floor}</span>
                </div>
                <h2 className="text-base font-bold text-white mt-0.5">{roomCleanName}</h2>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                    <span>ข้อมูลจริง รพ.อุดรธานี</span>
                  </span>
                  {room.category && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                      กลุ่มงาน: {room.category}
                    </span>
                  )}
                  <span className="text-xs text-slate-400 capitalize">{room.roomType}</span>
                </div>
              </div>

              {/* Working Hours & Service Details */}
              {room.workingHours && (
                <div className="p-2.5 bg-slate-900/70 border border-slate-800 rounded-xl flex items-center gap-2 text-xs text-slate-300">
                  <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>เวลาเปิดให้บริการ: <strong className="text-white">{room.workingHours}</strong></span>
                </div>
              )}

              {/* Parent Department Link */}
              {(() => {
                const dept = departments.find((d) => d.id === room.departmentId);
                if (!dept) return null;
                return (
                  <button
                    type="button"
                    onClick={() => selectObject(dept.id, 'department')}
                    className="w-full p-2.5 bg-slate-900/60 hover:bg-slate-800 border border-slate-800 hover:border-sky-500/40 rounded-xl text-left flex items-center justify-between transition-colors group"
                  >
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">สังกัดแผนก / กลุ่มงาน:</span>
                      <span className="text-xs font-semibold text-slate-200 group-hover:text-sky-300 transition-colors">
                        {dept.nameTh}
                      </span>
                    </div>
                    <span className="text-[10px] text-sky-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                      ดูข้อมูลแผนก &rarr;
                    </span>
                  </button>
                );
              })()}

              {/* Quick 3D Floor Cutaway */}
              <button
                type="button"
                onClick={() => setActiveFloor(room.floor)}
                className="w-full py-2 px-3 text-xs font-medium bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 rounded-xl text-sky-300 flex items-center justify-center gap-2 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>ตัดมุมมอง 3D ชั้น {room.floor} (F{room.floor})</span>
              </button>

              {/* Telephone Card */}
              {roomPhone && (
                <div className="p-3 bg-gradient-to-br from-slate-900 to-sky-950/40 border border-sky-500/30 rounded-xl space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 shrink-0">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-wider font-bold text-sky-300 block">
                          เบอร์โทรศัพท์ติดต่อภายใน UDH
                        </span>
                        <span className="text-base font-extrabold text-white font-mono-numbers">
                          ต่อ {roomPhone}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyPhone(roomPhone)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        copiedPhone === roomPhone
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-sm'
                          : 'bg-sky-500/20 hover:bg-sky-500/30 text-sky-200 border border-sky-500/40'
                      }`}
                      title={`คัดลอกเบอร์ ${roomPhone}`}
                    >
                      {copiedPhone === roomPhone ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>คัดลอกแล้ว</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>คัดลอกเบอร์</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span>สายตรงโทรศัพท์ภายนอก:</span>
                    <span className="font-mono-numbers text-slate-200 font-semibold">
                      042-245555 ต่อ {roomPhone}
                    </span>
                  </div>
                </div>
              )}

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 text-[11px] block">ชั้นที่ตั้ง</span>
                <span className="font-bold text-slate-100 font-mono-numbers text-sm">ชั้น {room.floor}</span>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 text-[11px] block">รหัสตำแหน่ง</span>
                <span className="font-bold text-sky-400 font-mono-numbers text-sm">{room.roomCode || room.id}</span>
              </div>
            </div>

            {/* Equipment in this room */}
            <div>
              <h3 className="text-xs font-bold text-slate-300 mb-2">อุปกรณ์ประจำห้อง</h3>
              <div className="space-y-1.5">
                {equipment
                  .filter((e) => e.roomId === room.id)
                  .map((item) => (
                    <div
                      key={item.id}
                      onClick={() => selectObject(item.id, 'equipment')}
                      className="p-2.5 bg-slate-900/60 hover:bg-slate-800/80 cursor-pointer rounded-lg border border-slate-800 flex items-center justify-between transition-colors"
                    >
                      <div className="text-xs font-medium text-slate-200">{item.nameTh}</div>
                      <span className="text-[10px] text-emerald-400 capitalize font-medium">
                        {item.status}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        );
      })()}

        {/* ================= EQUIPMENT VIEW ================= */}
        {eq && (
          <div className="space-y-4">
            <div>
              <div className="text-xs font-mono-numbers text-purple-400">{eq.id}</div>
              <h2 className="text-base font-bold text-white mt-0.5">{eq.nameTh}</h2>
              <div className="text-xs text-slate-400">{eq.nameEn}</div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 text-[11px] block">สถานะการทำงาน</span>
                <span className="font-bold text-emerald-400 capitalize text-sm">{eq.status}</span>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 text-[11px] block">การบำรุงรักษา</span>
                <span className="font-bold text-slate-200 capitalize text-sm">
                  {eq.maintenanceStatus}
                </span>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 text-[11px] block">รหัสประจำเครื่อง</span>
                <span className="font-bold text-sky-400 font-mono-numbers text-sm">
                  {eq.id}
                </span>
              </div>
              {eq.batteryLevel !== undefined && (
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80">
                  <span className="text-slate-400 text-[11px] block">ระดับแบตเตอรี่</span>
                  <span className="font-bold text-emerald-400 font-mono-numbers text-sm">
                    {eq.batteryLevel}%
                  </span>
                </div>
              )}
            </div>

            <div className="text-[11px] text-slate-400 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
              <span className="block text-slate-500">ตรวจสอบรอบล่าสุด:</span>
              <span className="font-mono-numbers text-slate-300">
                {new Date(eq.lastMaintenanceAt).toLocaleDateString('th-TH')}
              </span>
            </div>

            <button
              onClick={() => setShowMaintDetails(!showMaintDetails)}
              className="w-full py-2 px-3 text-xs font-medium bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-purple-300 flex items-center justify-center gap-2 transition-colors"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>{showMaintDetails ? 'ซ่อนประวัติบำรุงรักษา' : 'ดูประวัติบำรุงรักษาจำลอง'}</span>
            </button>

            {showMaintDetails && (
              <div className="p-3 bg-purple-950/20 border border-purple-500/30 rounded-lg text-xs space-y-2">
                <div className="font-semibold text-purple-300">
                  ประวัติบำรุงรักษาเชิงป้องกัน (Biomedical Preventive Maintenance)
                </div>
                <p className="text-slate-300 text-[11px]">
                  ผ่านการตรวจสอบมาตรฐานความปลอดภัยทางไฟฟ้า (Electrical Safety IEC 62353) และการสอบเทียบค่า Calibration ประจำปีโดยวิศวกรรมชีวการแพทย์
                </p>
                <div className="text-[10px] text-amber-400">
                  * ข้อมูลจำลองเพื่อการสาธิต ไม่ใช่การสั่งการหรือเชื่อมต่ออุปกรณ์จริง
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= VEHICLE VIEW ================= */}
        {vehicle && (
          <div className="space-y-4">
            <div>
              <div className="text-xs font-mono-numbers text-amber-400">{vehicle.id}</div>
              <h2 className="text-base font-bold text-white mt-0.5">{vehicle.name}</h2>
              <div className="text-xs text-slate-400 capitalize">{vehicle.vehicleType}</div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 text-[11px] block">สถานะการเคลื่อนที่</span>
                <span className="font-bold text-emerald-400 capitalize text-sm">
                  {vehicle.operationalStatus}
                </span>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 text-[11px] block">ระดับพลังงาน</span>
                <span className="font-bold text-amber-400 font-mono-numbers text-sm flex items-center gap-1">
                  <BatteryCharging className="w-3.5 h-3.5" />
                  <span>{vehicle.batteryLevel}%</span>
                </span>
              </div>
            </div>

            {vehicle.payloadType && (
              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 text-xs">
                <span className="text-slate-400 text-[11px] block mb-1">ประเภทภารกิจ:</span>
                <span className="text-slate-200 font-medium">{vehicle.payloadType}</span>
              </div>
            )}

            <div className="text-[11px] text-slate-400 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 space-y-1">
              <div>ความเร็ว: {vehicle.speed} m/s</div>
              <div>จุดแวะพักตามเส้นทาง: {vehicle.pathWaypoints.length} จุด</div>
            </div>
          </div>
        )}

        {/* ================= ALERT VIEW ================= */}
        {alert && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono-numbers">
                <span
                  className={
                    alert.severity === 'critical' ? 'text-red-400 font-bold' : 'text-amber-400'
                  }
                >
                  {alert.id}
                </span>
                <span aria-hidden="true">·</span>
                <span className="capitalize">{alert.severity}</span>
              </div>
              <h2 className="text-base font-bold text-white mt-0.5">{alert.titleTh}</h2>
              <div className="text-xs text-slate-400">{alert.titleEn}</div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/80 p-3 rounded-lg border border-slate-800">
              {alert.descriptionTh}
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 text-[11px] block">พื้นที่เกิดเหตุ</span>
                <span className="font-bold text-slate-200">{alert.zoneName}</span>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 text-[11px] block">สถานะคำเตือน</span>
                <span
                  className={`font-bold capitalize ${
                    alert.status === 'active' ? 'text-red-400' : 'text-emerald-400'
                  }`}
                >
                  {alert.status}
                </span>
              </div>
            </div>

            {alert.status === 'active' ? (
              <button
                onClick={() => acknowledgeAlert(alert.id)}
                className="w-full py-2.5 px-3 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow flex items-center justify-center gap-2 transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                <span>รับทราบคำเตือน (Acknowledge Alert)</span>
              </button>
            ) : (
              <div className="p-2.5 bg-emerald-950/20 border border-emerald-500/30 rounded-lg text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>รับทราบเหตุการณ์เรียบร้อยแล้ว</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Disclaimer */}
      <div className="p-3 bg-slate-950 border-t border-slate-800/80 text-[10px] text-slate-500 flex items-center gap-1.5">
        <Shield className="w-3.5 h-3.5 text-emerald-500/70 shrink-0" />
        <span>ระบบแผนที่และสารบบจุดบริการ โรงพยาบาลอุดรธานี</span>
      </div>
    </aside>
  );
};
