import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  Building,
  Layers,
  MapPin,
  Stethoscope,
  Truck,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { SelectedObjectType } from '../types/hospital';
import { UDH_TELEPHONE_DIRECTORY } from '../data/udhDirectory';

interface SearchResultItem {
  uniqueKey: string;
  id: string;
  targetId?: string;
  nameTh: string;
  nameEn: string;
  code: string;
  type: SelectedObjectType;
  buildingName?: string;
  categoryLabel: string;
  targetFloor?: number;
}

export const SearchModal: React.FC = () => {
  const isSearchOpen = useAppStore((s) => s.isSearchOpen);
  const setSearchOpen = useAppStore((s) => s.setSearchOpen);
  const buildings = useAppStore((s) => s.buildings);
  const departments = useAppStore((s) => s.departments);
  const rooms = useAppStore((s) => s.rooms);
  const equipment = useAppStore((s) => s.equipment);
  const vehicles = useAppStore((s) => s.vehicles);
  const alerts = useAppStore((s) => s.alerts);
  const selectObject = useAppStore((s) => s.selectObject);
  const setActiveFloor = useAppStore((s) => s.setActiveFloor);

  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  // Build searchable index
  const allItems = useMemo<SearchResultItem[]>(() => {
    const list: SearchResultItem[] = [];

    buildings.forEach((b) => {
      list.push({
        uniqueKey: `building-${b.id}`,
        id: b.id,
        nameTh: b.nameTh,
        nameEn: b.nameEn,
        code: b.code,
        type: 'building',
        categoryLabel: 'อาคาร (Building)',
      });
    });

    departments.forEach((d) => {
      const bld = buildings.find((b) => b.id === d.buildingId);
      list.push({
        uniqueKey: `dept-${d.id}`,
        id: d.id,
        nameTh: d.nameTh,
        nameEn: d.nameEn,
        code: d.id,
        type: 'department',
        buildingName: bld?.nameTh,
        categoryLabel: 'แผนก (Department)',
        targetFloor: d.floor,
      });
    });

    rooms.forEach((r) => {
      const bld = buildings.find((b) => b.id === r.buildingId);
      list.push({
        uniqueKey: `room-${r.id}`,
        id: r.id,
        nameTh: r.name,
        nameEn: `Floor ${r.floor} · ${r.roomType}`,
        code: r.id,
        type: 'room',
        buildingName: bld?.nameTh,
        categoryLabel: 'ห้อง/จุดบริการ (Indoor POI)',
        targetFloor: r.floor,
      });
    });

    equipment.forEach((e) => {
      list.push({
        uniqueKey: `equipment-${e.id}`,
        id: e.id,
        nameTh: e.nameTh,
        nameEn: e.nameEn,
        code: e.id,
        type: 'equipment',
        categoryLabel: 'อุปกรณ์การแพทย์ (Medical Equipment)',
      });
    });

    vehicles.forEach((v) => {
      list.push({
        uniqueKey: `vehicle-${v.id}`,
        id: v.id,
        nameTh: v.name,
        nameEn: v.vehicleType,
        code: v.id,
        type: 'vehicle',
        categoryLabel: 'ยานพาหนะ/AGV (Vehicle & AGV)',
      });
    });

    alerts.forEach((a) => {
      list.push({
        uniqueKey: `alert-${a.id}`,
        id: a.id,
        nameTh: a.titleTh,
        nameEn: a.titleEn,
        code: a.id,
        type: 'alert',
        buildingName: a.zoneName,
        categoryLabel: 'คำเตือน/เหตุการณ์ (Alert/Incident)',
      });
    });

    UDH_TELEPHONE_DIRECTORY.forEach((tel, idx) => {
      list.push({
        uniqueKey: `tel-${tel.id || `idx-${idx}`}`,
        id: tel.buildingId,
        targetId: tel.buildingId,
        nameTh: `${tel.nameTh} (ต่อ ${tel.telExtension})`,
        nameEn: `${tel.nameEn} · Ext ${tel.telExtension}`,
        code: tel.telExtension,
        type: 'building',
        buildingName: `${tel.buildingName} ชั้น ${tel.floor}`,
        categoryLabel: 'เบอร์ต่อภายใน UDH (Tel Ext)',
        targetFloor: tel.floor,
      });
    });

    return list;
  }, [buildings, departments, rooms, equipment, vehicles, alerts]);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allItems.filter((item) => {
      if (filterType !== 'all' && item.type !== filterType) return false;
      if (!q) return true;
      return (
        item.id.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q) ||
        item.nameTh.toLowerCase().includes(q) ||
        item.nameEn.toLowerCase().includes(q) ||
        (item.buildingName && item.buildingName.toLowerCase().includes(q))
      );
    });
  }, [allItems, query, filterType]);

  if (!isSearchOpen) return null;

  const handleSelectItem = (item: SearchResultItem) => {
    selectObject(item.targetId || item.id, item.type);
    if (item.targetFloor !== undefined) {
      setActiveFloor(item.targetFloor);
    }
    setSearchOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150">
        {/* Search Header */}
        <div className="p-3 sm:p-4 border-b border-slate-800 flex items-center gap-2.5 sm:gap-3">
          <Search className="w-5 h-5 text-sky-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ค้นหาอาคาร, แผนก, ห้อง, รหัสอุปกรณ์, รถพยาบาล..."
            className="flex-1 bg-transparent text-slate-100 placeholder-slate-500 text-base sm:text-sm outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-200 text-xs px-2 py-1 rounded-lg bg-slate-800 shrink-0"
            >
              ล้าง
            </button>
          )}
          <button
            onClick={() => setSearchOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors shrink-0 min-w-[36px] min-h-[36px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-slate-800/80 bg-slate-950/40 overflow-x-auto text-xs">
          {[
            { id: 'all', label: 'ทั้งหมด' },
            { id: 'building', label: 'อาคาร' },
            { id: 'department', label: 'แผนก' },
            { id: 'room', label: 'ห้อง/เตียง' },
            { id: 'equipment', label: 'อุปกรณ์' },
            { id: 'vehicle', label: 'ยานพาหนะ' },
            { id: 'alert', label: 'คำเตือน' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1 rounded-md transition-colors whitespace-nowrap ${
                filterType === tab.id
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              ไม่พบรายการที่ค้นหาตามคำค้นหา &ldquo;{query}&rdquo;
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.uniqueKey}
                onClick={() => handleSelectItem(item)}
                className="p-3 bg-slate-950/50 hover:bg-slate-800/80 cursor-pointer rounded-xl border border-slate-800/80 hover:border-sky-500/40 flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-sky-400 group-hover:border-sky-500/30 transition-colors">
                    {item.type === 'building' && <Building className="w-4 h-4" />}
                    {item.type === 'department' && <Layers className="w-4 h-4" />}
                    {item.type === 'room' && <MapPin className="w-4 h-4" />}
                    {item.type === 'equipment' && <Stethoscope className="w-4 h-4" />}
                    {item.type === 'vehicle' && <Truck className="w-4 h-4" />}
                    {item.type === 'alert' && <AlertTriangle className="w-4 h-4 text-red-400" />}
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-slate-200 group-hover:text-white flex items-center gap-2">
                      <span>{item.nameTh}</span>
                      <span className="text-[10px] font-mono-numbers text-slate-500">
                        {item.code}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>{item.nameEn}</span>
                      {item.buildingName && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>{item.buildingName}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500">{item.categoryLabel}</span>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-sky-400 transition-colors" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Note */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 text-[11px] text-amber-400/90 flex items-center justify-between">
          <span>* ผลการค้นหาและข้อมูลทั้งหมดเป็น SIMULATED DATA</span>
          <span className="text-slate-500">กด Esc เพื่อปิด</span>
        </div>
      </div>
    </div>
  );
};
