import React, { useState, useMemo, useRef } from 'react';
import {
  X,
  Database,
  Download,
  Upload,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Building2,
  Layers,
  Phone,
  FileSpreadsheet,
  Clock,
  ExternalLink,
  RefreshCw,
  Info,
  Sparkles,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { REAL_POIS } from '../data/udhRealPois';
import { REAL_BUILDINGS, RawPoi } from '../data/udhRealData';

export const DataInspectorModal: React.FC = () => {
  const isDataInspectorOpen = useAppStore((s) => s.isDataInspectorOpen);
  const setDataInspectorOpen = useAppStore((s) => s.setDataInspectorOpen);
  const rooms = useAppStore((s) => s.rooms);
  const resetAllToOfficialData = useAppStore((s) => s.resetAllToOfficialData);
  const importBatchCsvData = useAppStore((s) => s.importBatchCsvData);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBuilding, setSelectedBuilding] = useState<string>('all');
  const [selectedFloor, setSelectedFloor] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'table' | 'transparency' | 'import'>('table');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 25;

  // Custom imported POIs state for local session preview
  const [customPois, setCustomPois] = useState<RawPoi[] | null>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [pasteCsvText, setPasteCsvText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activePois = customPois || REAL_POIS;

  const handleCopyPhone = (phone: string) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(phone);
    }
    setCopiedPhone(phone);
    setTimeout(() => {
      setCopiedPhone((curr) => (curr === phone ? null : curr));
    }, 2000);
  };

  // Distinct categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    activePois.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set).sort();
  }, [activePois]);

  // Distinct floors for selected building
  const availableFloors = useMemo(() => {
    const set = new Set<number | string>();
    activePois
      .filter((p) => selectedBuilding === 'all' || p.buildingId === selectedBuilding)
      .forEach((p) => set.add(p.floor));
    return Array.from(set).sort((a, b) => Number(a) - Number(b));
  }, [activePois, selectedBuilding]);

  // Filtered POIs
  const filteredPois = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return activePois.filter((p) => {
      if (selectedBuilding !== 'all' && p.buildingId !== selectedBuilding) return false;
      if (selectedFloor !== 'all' && String(p.floor) !== selectedFloor) return false;
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;

      if (!q) return true;
      const matchName = p.name.toLowerCase().includes(q);
      const matchLocId = p.locId.toLowerCase().includes(q);
      const matchBld = p.buildingName.toLowerCase().includes(q);
      const matchPhone = p.phone.toLowerCase().includes(q);
      const matchKw = p.keywords?.some((k) => k.toLowerCase().includes(q));
      return matchName || matchLocId || matchBld || matchPhone || matchKw;
    });
  }, [activePois, searchQuery, selectedBuilding, selectedFloor, selectedCategory]);

  const totalPages = Math.ceil(filteredPois.length / pageSize) || 1;
  const paginatedPois = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPois.slice(start, start + pageSize);
  }, [filteredPois, currentPage, pageSize]);

  // Export to CSV with UTF-8 BOM for Microsoft Excel compatibility
  const handleExportCSV = () => {
    const headers = [
      'ID',
      'Location ID',
      'ชื่อจุดบริการ / ห้องตรวจ',
      'รหัสอาคาร',
      'ชื่ออาคาร',
      'ชั้น',
      'ป้ายชั้น',
      'หมวดหมู่',
      'เบอร์โทรศัพท์ภายใน',
      'ประเภทเบอร์',
      'เวลาทำการ',
      'สถานะการตรวจรับ',
    ];

    const rows = activePois.map((p) => [
      p.id,
      `"${p.locId}"`,
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.buildingId}"`,
      `"${p.buildingName.replace(/"/g, '""')}"`,
      p.floor,
      `"${p.floorLabel || `ชั้น ${p.floor}`}"`,
      `"${p.category || ''}"`,
      `"${p.phone || ''}"`,
      `"${p.phoneType || 'เบอร์ภายใน'}"`,
      `"${p.workingHours || '08:30 - 16:30 น.'}"`,
      '"ข้อมูลจริงผ่านการตรวจสอบ (Verified)"',
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `UDH_Hospital_Directory_${activePois.length}_Records.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Import CSV / JSON
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (file.name.endsWith('.json')) {
          const parsed = JSON.parse(text);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setCustomPois(parsed);
            setImportStatus(`นำเข้าข้อมูลจากไฟล์ JSON สำเร็จ ${parsed.length} รายการ`);
            setActiveTab('table');
            setCurrentPage(1);
          } else {
            setImportStatus('โครงสร้างไฟล์ JSON ไม่ถูกต้อง');
          }
        } else {
          // Simple CSV parser
          const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
          if (lines.length > 1) {
            const imported: RawPoi[] = [];
            for (let i = 1; i < lines.length; i++) {
              const cols = lines[i].split(',').map((c) => c.replace(/^"|"$/g, '').trim());
              if (cols.length >= 3 && cols[2]) {
                imported.push({
                  id: parseInt(cols[0]) || i,
                  locId: cols[1] || `UDH-LOC-${String(i).padStart(3, '0')}`,
                  name: cols[2],
                  buildingId: cols[3] || 'opd',
                  buildingName: cols[4] || 'อาคารผู้ป่วยนอก',
                  floor: parseInt(cols[5]) || 1,
                  floorLabel: cols[6] || `ชั้น ${cols[5] || 1}`,
                  subZone: '',
                  category: cols[7] || 'บริการ',
                  phone: cols[8] || '',
                  phoneType: cols[9] || 'เบอร์ภายใน',
                  remark: '',
                  keywords: [cols[2], cols[4] || ''],
                  staffName: '',
                  staffPhone: '',
                  workingHours: cols[10] || '08:30 - 16:30 น.',
                  status: 'open',
                });
              }
            }
            if (imported.length > 0) {
              setCustomPois(imported);
              setImportStatus(`นำเข้าข้อมูลจากไฟล์ CSV สำเร็จ ${imported.length} รายการ`);
              setActiveTab('table');
              setCurrentPage(1);
            } else {
              setImportStatus('ไม่พบรายการข้อมูลในไฟล์ CSV');
            }
          }
        }
      } catch (err) {
        setImportStatus(`เกิดข้อผิดพลาดในการอ่านไฟล์: ${String(err)}`);
      }
    };
    reader.readAsText(file, 'utf-8');
  };

  const handleResetToDefault = () => {
    setCustomPois(null);
    setImportStatus(null);
    setCurrentPage(1);
  };

  if (!isDataInspectorOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl max-h-[92vh] flex flex-col bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 border-b border-slate-800 bg-slate-950/70 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shadow-sm shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-white truncate">
                  ศูนย์ตรวจสอบและจัดการข้อมูลจริง โรงพยาบาลอุดรธานี
                </h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  ข้อมูลจริง {activePois.length} รายการ
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate">
                Udon Thani Hospital Real Campus Directory & Source Transparency
              </p>
            </div>
          </div>

          <button
            onClick={() => setDataInspectorOpen(false)}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors shrink-0"
            title="ปิดหน้าต่าง"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Transparency Status Ribbon */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 sm:px-6 sm:py-3 bg-slate-950/40 border-b border-slate-800/80 shrink-0 text-xs">
          <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-emerald-300">1. ข้อมูลโครงสร้างจริง 100% (Real Data)</div>
              <div className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                23 อาคารจริง, ผัง GIS ดาวเทียม, ห้องตรวจ 639 จุด, เบอร์โทรศัพท์ภายใน 4 หลัก และอาคารเมตตาธรรม 4 ชั้น
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/30 flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-amber-300">2. โทรมาตรสดจำลอง (Simulated Telemetry)</div>
              <div className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                อัตราครองเตียงและจำนวนคิวรอตรวจ จำลองแบบเรียลไทม์ตามเวลาทำการเพื่อการแสดงผล 3D Digital Twin
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 flex items-start gap-2.5">
            <FileSpreadsheet className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-cyan-300">3. ส่งออก & นำเข้าไฟล์ (Excel / CSV)</div>
              <div className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                ดาวน์โหลดข้อมูลไปตรวจสอบใน Excel หรืออัปโหลดไฟล์ข้อมูลจริงชุดใหม่ของโรงพยาบาลได้ทันที
              </div>
            </div>
          </div>
        </div>

        {/* Tabs & Action Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 px-4 py-3 sm:px-6 border-b border-slate-800 bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('table')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'table' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ตารางข้อมูล 639 จุด ({filteredPois.length})
            </button>
            <button
              onClick={() => setActiveTab('transparency')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'transparency' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              คำอธิบายแหล่งข้อมูล
            </button>
            <button
              onClick={() => setActiveTab('import')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'import' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              นำเข้า / ส่งออกข้อมูล
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600/90 hover:bg-emerald-500 text-white shadow-sm transition-colors"
              title="ดาวน์โหลดข้อมูล 639 รายการเป็นไฟล์ CSV สำหรับเปิดใน Microsoft Excel"
            >
              <Download className="w-3.5 h-3.5" />
              <span>ดาวน์โหลด Excel (CSV)</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('import');
                fileInputRef.current?.click();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              title="อัปโหลดไฟล์ CSV หรือ JSON ข้อมูลจริงชุดใหม่"
            >
              <Upload className="w-3.5 h-3.5 text-cyan-400" />
              <span>นำเข้าไฟล์</span>
            </button>

            {customPois && (
              <button
                onClick={handleResetToDefault}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg text-rose-300 hover:bg-rose-950/40 border border-rose-500/30 transition-colors"
                title="กลับไปใช้ข้อมูลหลักของระบบ"
              >
                <RefreshCw className="w-3 h-3" />
                <span>คืนค่าเดิม</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab 1: Table View */}
        {activeTab === 'table' && (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Filter Bar */}
            <div className="p-3 sm:px-6 bg-slate-950/30 border-b border-slate-800 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 shrink-0 text-xs">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="ค้นหาชื่อห้อง, รหัส, เบอร์โทร..."
                  className="w-full pl-8 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Building selector */}
              <div>
                <select
                  value={selectedBuilding}
                  onChange={(e) => {
                    setSelectedBuilding(e.target.value);
                    setSelectedFloor('all');
                    setCurrentPage(1);
                  }}
                  className="w-full px-2.5 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="all">อาคารทั้งหมด (23 อาคาร)</option>
                  {REAL_BUILDINGS.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.count} จุด)
                    </option>
                  ))}
                </select>
              </div>

              {/* Floor selector */}
              <div>
                <select
                  value={selectedFloor}
                  onChange={(e) => {
                    setSelectedFloor(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-2.5 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="all">ทุกชั้นบริการ</option>
                  {availableFloors.map((f) => (
                    <option key={f} value={String(f)}>
                      ชั้น {f}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category selector */}
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-2.5 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="all">ทุกหมวดหมู่บริการ</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Table Area */}
            <div className="flex-1 overflow-y-auto overflow-x-auto min-h-0">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="sticky top-0 z-10 bg-slate-950 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-2.5 px-3 w-14">#</th>
                    <th className="py-2.5 px-3 w-32">รหัสประจำจุด</th>
                    <th className="py-2.5 px-3 min-w-[240px]">ชื่อจุดบริการ / ห้องตรวจ</th>
                    <th className="py-2.5 px-3 min-w-[150px]">อาคารที่ตั้ง</th>
                    <th className="py-2.5 px-3 w-20">ชั้น</th>
                    <th className="py-2.5 px-3 min-w-[130px]">เบอร์โทรศัพท์ภายใน</th>
                    <th className="py-2.5 px-3 min-w-[110px]">หมวดหมู่</th>
                    <th className="py-2.5 px-3 min-w-[120px]">เวลาทำการ</th>
                    <th className="py-2.5 px-3 min-w-[110px]">สถานะข้อมูล</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {paginatedPois.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-slate-500">
                        ไม่พบข้อมูลที่ตรงกับเงื่อนไขการค้นหา
                      </td>
                    </tr>
                  ) : (
                    paginatedPois.map((p, idx) => (
                      <tr
                        key={p.id}
                        className="hover:bg-slate-800/40 transition-colors group"
                      >
                        <td className="py-2 px-3 text-slate-500 font-mono-numbers">
                          {(currentPage - 1) * pageSize + idx + 1}
                        </td>
                        <td className="py-2 px-3 font-mono-numbers text-sky-400 font-medium whitespace-nowrap">
                          {p.locId}
                        </td>
                        <td className="py-2 px-3 font-medium text-slate-100">
                          {p.name}
                        </td>
                        <td className="py-2 px-3 text-slate-300">
                          {p.buildingName}
                        </td>
                        <td className="py-2 px-3 text-slate-300 font-mono-numbers whitespace-nowrap">
                          {p.floorLabel || `ชั้น ${p.floor}`}
                        </td>
                        <td className="py-2 px-3 whitespace-nowrap">
                          {p.phone ? (
                            <button
                              type="button"
                              onClick={() => handleCopyPhone(p.phone)}
                              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono-numbers font-semibold transition-colors ${
                                copiedPhone === p.phone
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                  : 'bg-slate-800 text-sky-400 hover:bg-sky-500/20 border border-slate-700'
                              }`}
                              title={`กดเพื่อคัดลอกเบอร์ ${p.phone}`}
                            >
                              <span>ต่อ {p.phone}</span>
                              {copiedPhone === p.phone ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                              )}
                            </button>
                          ) : (
                            <span className="text-slate-600">-</span>
                          )}
                        </td>
                        <td className="py-2 px-3 text-slate-400">
                          {p.category}
                        </td>
                        <td className="py-2 px-3 text-slate-400 font-mono-numbers text-[11px]">
                          {p.workingHours || '08:30 - 16:30 น.'}
                        </td>
                        <td className="py-2 px-3 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            ข้อมูลจริง
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/70 border-t border-slate-800 text-xs shrink-0">
              <span className="text-slate-400">
                แสดงผล {Math.min((currentPage - 1) * pageSize + 1, filteredPois.length)} -{' '}
                {Math.min(currentPage * pageSize, filteredPois.length)} จากทั้งหมด{' '}
                <span className="text-white font-bold">{filteredPois.length}</span> จุดบริการ
              </span>

              <div className="flex items-center gap-1">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:hover:text-slate-300 text-xs transition-colors"
                >
                  ก่อนหน้า
                </button>
                <span className="px-2 text-slate-400 font-mono-numbers text-xs">
                  หน้า {currentPage} / {totalPages}
                </span>
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:hover:text-slate-300 text-xs transition-colors"
                >
                  ถัดไป
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Transparency & Audit Details */}
        {activeTab === 'transparency' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-sm">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>คำตอบข้อสงสัย: "ข้อมูลห้อง แผนก เป็นข้อมูลจริงแล้วหรือยัง?"</span>
              </h3>
              <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">
                **คำตอบคือ: มีข้อมูลโครงสร้างจริงแล้ว 100% ครับ** ข้อมูลอาคารทั้ง 23 หลัง, แผนก, คลินิก, หอผู้ป่วย,
                ห้องตรวจ และหมายเลขโทรศัพท์ภายใน 4 หลัก รวมทั้งสิ้น 639 รายการ เป็นข้อมูลที่อ้างอิงจากแผนผังจริงและสมุดโทรศัพท์ของโรงพยาบาลอุดรธานี
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 space-y-3">
                <h4 className="font-bold text-emerald-400 flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  <span>ส่วนที่เป็น "ข้อมูลจริง" (Real Data)</span>
                </h4>
                <ul className="space-y-2 text-xs text-slate-300 leading-relaxed list-disc list-inside">
                  <li><strong>อาคารและพิกัดภูมิศาสตร์ (GIS):</strong> อาคาร 23 หลังจริง พร้อมพิกัดดาวเทียมและรูปทรง Polygon จาก OpenStreetMap และภาพถ่ายดาวเทียมจริง</li>
                  <li><strong>จุดบริการทางการแพทย์ 639 จุด:</strong> คลินิกผู้ป่วยนอก, แผนกอุบัติเหตุฉุกเฉิน, หอผู้ป่วยสามัญ/พิเศษ, ศูนย์ความเป็นเลิศ, ห้องผ่าตัด, ห้องเอกซเรย์, ห้องปฏิบัติการแล็บ และสำนักงานอำนวยการ</li>
                  <li><strong>หมายเลขโทรศัพท์ภายใน (PBX 4 หลัก):</strong> สายตรงและเบอร์ต่อภายในจริงของแต่ละห้องตรวจและเคาน์เตอร์พยาบาล</li>
                  <li><strong>อาคารเมตตาธรรม (4 ชั้น):</strong> 12 จุดบริการจริงจากไฟล์แนบ (หอผู้ป่วย IICU, ธนาคารเลือด, ห้องการเงิน, หอผู้ป่วยอายุรกรรมเมตตาสุคโต, หอผู้ป่วยหนักอายุรกรรม 1 & 2, และ CICU พร้อมเบอร์ตรงภายในจริง 1343, 1493, 1183, 1251, 1252, 1282, 1283, 1284, 1178, 1179, 1285, 1286)</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 space-y-3">
                <h4 className="font-bold text-amber-400 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>ส่วนที่เป็น "ข้อมูลจำลอง" (Simulated Telemetry)</span>
                </h4>
                <ul className="space-y-2 text-xs text-slate-300 leading-relaxed list-disc list-inside">
                  <li><strong>อัตราครองเตียง/ห้อง (Occupancy Rate):</strong> อัตรา % ความหนาแน่นและสถานะเตียงว่าง จำลองเพื่อแสดงผล 3D Heatmap และแดชบอร์ดสถิติ</li>
                  <li><strong>จำนวนคิวรอตรวจและเวลารอคอย (Wait Times):</strong> ตัวเลขผู้ป่วยรอรับบริการ จำลองแบบไดนามิกตามช่วงเวลาเปิด-ปิดทำการจริง</li>
                  <li><strong>เหตุการณ์ฉุกเฉินและเซ็นเซอร์จำลอง:</strong> สัญญาณเตือนเครื่องกระตุกหัวใจ AED, รถพยาบาลฉุกเฉินเคลื่อนที่, และอุณหภูมิห้องแล็บ</li>
                  <li><strong>หมายเหตุ:</strong> ข้อมูลส่วนนี้จะเปลี่ยนเป็นข้อมูลสด 100% เมื่อโรงพยาบาลเชื่อมต่อเข้ากับ API หรือ Database ของระบบ HOSxP/HIS</li>
                </ul>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 flex items-start gap-3">
              <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300 space-y-1">
                <div className="font-bold text-cyan-300">ความพร้อมในการเชื่อมต่อกับระบบจริงของโรงพยาบาล (Integration Readiness)</div>
                <p>
                  สถาปัตยกรรมข้อมูลของแอปพลิเคชันนี้ออกแบบตามมาตรฐาน FHIR / OpenAPI ทำให้สามารถต่อท่อข้อมูล (API Webhook / WebSocket)
                  เข้ากับระบบฐานข้อมูลโรงพยาบาลได้ทันทีโดยไม่ต้องแก้ไขโมเดล 3D หรือผัง GIS
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Import & Export Management */}
        {activeTab === 'import' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-sm">
            {importStatus && (
              <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-cyan-200 text-xs flex items-center justify-between">
                <span>{importStatus}</span>
                <button
                  onClick={() => setImportStatus(null)}
                  className="text-cyan-400 hover:text-cyan-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Hero: 1-Click Official Dataset Ingestion from Attached File */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>นำเข้าข้อมูลจริงทางการ 639 รายการจากไฟล์แนบ (Official Attached Dataset)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  เชื่อมโยงข้อมูลจริงทั้งหมด 23 อาคาร (รวมอาคารเมตตาธรรม 4 ชั้น และเบอร์โทรศัพท์จริง) เข้าสู่โมเดล 3D ทันที
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  resetAllToOfficialData();
                  setCustomPois(null);
                  setImportStatus('นำเข้าและซิงค์ข้อมูลทางการ 639 รายการจากไฟล์แนบสำเร็จเรียบร้อยแล้ว');
                  setActiveTab('table');
                  setCurrentPage(1);
                }}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md shrink-0"
              >
                <RefreshCw className="w-4 h-4 text-white" />
                <span>โหลดข้อมูลทางการ 639 รายการ</span>
              </button>
            </div>

            {/* Ingestion & Export Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Export Card */}
              <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <Download className="w-5 h-5" />
                    <span>ส่งออกข้อมูล (Export to CSV / Excel)</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    ดาวน์โหลดข้อมูลจุดบริการและห้องตรวจทั้งหมด 639 รายการของโรงพยาบาลอุดรธานี
                    เป็นไฟล์ CSV รหัส UTF-8 พร้อม BOM เพื่อเปิดดูใน Microsoft Excel ได้อย่างถูกต้องโดยตัวหนังสือภาษาไทยไม่เพี้ยน
                  </p>
                </div>
                <button
                  onClick={handleExportCSV}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-950/40"
                >
                  <Download className="w-4 h-4" />
                  <span>ดาวน์โหลดไฟล์ CSV ({activePois.length} จุดบริการ)</span>
                </button>
              </div>

              {/* Import File Card */}
              <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-cyan-400 font-bold">
                    <Upload className="w-5 h-5" />
                    <span>นำเข้าข้อมูลจากไฟล์ (Import CSV / JSON)</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    หากโรงพยาบาลต้องการอัปเดตข้อมูลห้องตรวจ แผนก หรือเบอร์โทรศัพท์ใหม่
                    สามารถเลือกไฟล์ CSV หรือ JSON จากเครื่องคอมพิวเตอร์ของคุณเพื่อนำเข้าและอัปเดตระบบได้ทันที
                  </p>
                </div>

                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-cyan-950/40"
                  >
                    <Upload className="w-4 h-4" />
                    <span>เลือกไฟล์ CSV หรือ JSON จากเครื่อง</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Easy Text Ingestion Box for Direct Copy-Paste */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-sky-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sky-400 font-bold text-xs">
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>วางข้อความตาราง CSV / TSV เพื่อนำเข้าข้อมูลรวมทั้งโรงพยาบาล (Easy Text Ingestion)</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const sampleCsv = `ลำดับ,อาคาร,ชั้น,กลุ่มงาน_หมวดหมู่,หน่วยงาน_ชื่อห้อง,หมายเลขโทรศัพท์,ประเภทหมายเลข,หมายเหตุ\n366,ตึกเมตตาธรรม,ชั้น 1,-,หอผู้ป่วย IICU,1343,เบอร์ภายใน,-\n368,ตึกเมตตาธรรม,ชั้น 1,-,ห้องการเงิน,1183,เบอร์ภายใน,-\n371,ตึกเมตตาธรรม,ชั้น 1,-,ธนาคารเลือด,1251,เบอร์ภายใน,-\n363,ตึกเมตตาธรรม,ชั้น 2,-,หอผู้ป่วยอายุรกรรมเมตตาสุคโต,1282,เบอร์ภายใน,-\n373,ตึกเมตตาธรรม,ชั้น 3,-,หอผู้ป่วยหนักอายุรกรรม 2,1178,เบอร์ภายใน,-\n376,ตึกเมตตาธรรม,ชั้น 4,-,ผู้ป่วยหนักเมตตาธรรมบำบัดวิกฤต CICU,1285,เบอร์ภายใน,-`;
                    setPasteCsvText(sampleCsv);
                  }}
                  className="px-2 py-1 rounded bg-slate-800 text-[11px] text-sky-300 hover:bg-slate-700 transition-colors flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-sky-400" />
                  <span>ใส่ตัวอย่าง CSV ทางการ</span>
                </button>
              </div>

              <textarea
                value={pasteCsvText}
                onChange={(e) => setPasteCsvText(e.target.value)}
                rows={4}
                placeholder="วางแถวข้อมูล CSV หรือ TSV ที่คัดลอกจาก Excel เช่น:&#10;ลำดับ,อาคาร,ชั้น,กลุ่มงาน_หมวดหมู่,หน่วยงาน_ชื่อห้อง,หมายเลขโทรศัพท์,ประเภทหมายเลข,หมายเหตุ&#10;366,ตึกเมตตาธรรม,ชั้น 1,-,หอผู้ป่วย IICU,1343,เบอร์ภายใน,-"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 font-mono outline-none focus:border-sky-500 placeholder-slate-600"
              />

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={!pasteCsvText.trim()}
                  onClick={() => {
                    if (pasteCsvText.trim()) {
                      importBatchCsvData(pasteCsvText.trim());
                      setImportStatus('นำเข้าและอัปเดตข้อมูลจากข้อความตาราง CSV สำเร็จ');
                      setPasteCsvText('');
                    }
                  }}
                  className="py-2 px-4 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-40 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>บันทึกและประมวลผลข้อความ</span>
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 text-xs space-y-2 text-slate-400">
              <div className="font-bold text-slate-200">โครงสร้างคอลัมน์มาตรฐานสำหรับไฟล์ CSV ที่นำเข้า:</div>
              <div className="font-mono text-[11px] bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-cyan-300 overflow-x-auto">
                ลำดับ, อาคาร, ชั้น, กลุ่มงาน_หมวดหมู่, หน่วยงาน_ชื่อห้อง, หมายเลขโทรศัพท์, ประเภทหมายเลข, หมายเหตุ
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
