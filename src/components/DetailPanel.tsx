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
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { UDH_TELEPHONE_DIRECTORY } from '../data/udhDirectory';

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

  // Local state for simulated maintenance modal
  const [showMaintDetails, setShowMaintDetails] = useState(false);

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
            <div className="text-[10px] text-amber-400 font-medium">SIMULATED DATA</div>
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

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 text-[11px] block">จำนวนชั้น</span>
                <span className="font-bold text-slate-100 font-mono-numbers text-sm">
                  {building.floorCount} ชั้น
                </span>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 text-[11px] block">สถานะการทำงาน</span>
                <span className="font-bold text-emerald-400 capitalize">
                  {building.operationalStatus}
                </span>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 text-[11px] block">ความจุเตียงจำลอง</span>
                <span className="font-bold text-slate-100 font-mono-numbers text-sm">
                  {building.currentOccupancy} / {building.totalCapacity}
                </span>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 text-[11px] block">อัตราครองพื้นที่</span>
                <span className="font-bold text-sky-400 font-mono-numbers text-sm">
                  {Math.round((building.currentOccupancy / building.totalCapacity) * 100)}%
                </span>
              </div>
            </div>

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

            {/* Departments inside this building */}
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
                          ชั้น {dept.floor} · {dept.totalRooms} ห้อง
                        </div>
                      </div>
                      <span className="text-xs font-bold text-sky-400 font-mono-numbers">
                        {dept.utilization}%
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Telephone Directory for this building */}
            {UDH_TELEPHONE_DIRECTORY.filter((t) => t.buildingId === building.id).length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-slate-300 mb-2 flex items-center justify-between">
                  <span>เบอร์โทรศัพท์และหน่วยงาน UDH</span>
                  <Phone className="w-3.5 h-3.5 text-sky-400" />
                </h3>
                <div className="space-y-1.5">
                  {UDH_TELEPHONE_DIRECTORY.filter((t) => t.buildingId === building.id).map((tel) => (
                    <div
                      key={tel.id}
                      className="p-2.5 bg-slate-900/60 rounded-lg border border-slate-800 flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs font-medium text-slate-200">{tel.nameTh}</div>
                        <div className="text-[10px] text-slate-400">ชั้น {tel.floor} · {tel.descriptionTh}</div>
                      </div>
                      <span className="text-[11px] font-bold text-sky-400 font-mono-numbers px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                        ต่อ {tel.telExtension}
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

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 text-[11px] block">ระดับการใช้พื้นที่</span>
                <span className="font-bold text-amber-300 font-mono-numbers text-sm">
                  {department.utilization}%
                </span>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 text-[11px] block">เวลารอคอยเฉลี่ย</span>
                <span className="font-bold text-slate-100 font-mono-numbers text-sm">
                  {department.simulatedAvgWaitMinutes} นาที
                </span>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 text-[11px] block">คิวรอรับบริการ</span>
                <span className="font-bold text-slate-100 font-mono-numbers text-sm">
                  {department.simulatedQueueLength} คิว
                </span>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 text-[11px] block">บุคลากรจำลองรวม</span>
                <span className="font-bold text-slate-100 font-mono-numbers text-sm">
                  {department.staffCountSimulated} คน
                </span>
              </div>
            </div>

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
              <h3 className="text-xs font-bold text-slate-300 mb-2">
                ห้องบริการ ({rooms.filter((r) => r.departmentId === department.id).length})
              </h3>
              <div className="space-y-1.5">
                {rooms
                  .filter((r) => r.departmentId === department.id)
                  .map((rm) => (
                    <div
                      key={rm.id}
                      onClick={() => selectObject(rm.id, 'room')}
                      className="p-2.5 bg-slate-900/60 hover:bg-slate-800/80 cursor-pointer rounded-lg border border-slate-800 flex items-center justify-between transition-colors"
                    >
                      <div>
                        <div className="text-xs font-medium text-slate-200">{rm.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono-numbers capitalize">
                          {rm.roomType} · จุ {rm.capacity} เตียง
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded capitalize ${
                          rm.status === 'available'
                            ? 'text-emerald-400 bg-emerald-500/10'
                            : 'text-amber-400 bg-amber-500/10'
                        }`}
                      >
                        {rm.status}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= ROOM VIEW ================= */}
        {room && (
          <div className="space-y-4">
            <div>
              <div className="text-xs font-mono-numbers text-sky-400">{room.id}</div>
              <h2 className="text-base font-bold text-white mt-0.5">{room.name}</h2>
              <div className="text-xs text-slate-400">ชั้น {room.floor}</div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 text-[11px] block">สถานะปัจจุบัน</span>
                <span className="font-bold text-emerald-400 capitalize text-sm">{room.status}</span>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 text-[11px] block">ความจุรวม</span>
                <span className="font-bold text-slate-100 font-mono-numbers text-sm">
                  {room.currentAggregateUsage} / {room.capacity}
                </span>
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
        )}

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
                <span className="text-slate-400 text-[11px] block">ชั่วโมงใช้งานจำลอง</span>
                <span className="font-bold text-slate-100 font-mono-numbers text-sm">
                  {eq.usageHoursSimulated} ชม.
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
                <span className="text-slate-400 text-[11px] block mb-1">สัมภาระ/ภารกิจจำลอง:</span>
                <span className="text-slate-200 font-medium">{vehicle.payloadType}</span>
              </div>
            )}

            <div className="text-[11px] text-slate-400 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 space-y-1">
              <div>ความเร็วจำลอง: {vehicle.speed} m/s</div>
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
        <Shield className="w-3.5 h-3.5 text-amber-500/70 shrink-0" />
        <span>ระบบจำลองเพื่อการวางแผน ห้ามใช้สั่งการอุปกรณ์หรือควบคุมระบบจริง</span>
      </div>
    </aside>
  );
};
