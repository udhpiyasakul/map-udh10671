import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  SunMedium,
  Sun,
  Moon,
  MapPin,
  Search,
  ShieldAlert,
  Layers,
  Flame,
  Activity,
  Truck,
  Stethoscope,
  Menu,
  X,
  Clock,
  Sparkles,
  Palette,
  Check,
  Database,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export const TopBar: React.FC = () => {
  const activeLayer = useAppStore((s) => s.activeLayer);
  const audioEnabled = useAppStore((s) => s.audioEnabled);
  const isLightingOpen = useAppStore((s) => s.isLightingOpen);
  const isMapOpen = useAppStore((s) => s.isMapOpen);
  const isKpiOpen = useAppStore((s) => s.isKpiOpen);
  const lighting = useAppStore((s) => s.lighting);
  const theme = useAppStore((s) => s.theme);
  const fontStyle = useAppStore((s) => s.fontStyle);
  const setThemeModalOpen = useAppStore((s) => s.setThemeModalOpen);
  const setTheme = useAppStore((s) => s.setTheme);

  // Actions
  const setActiveLayer = useAppStore((s) => s.setActiveLayer);
  const toggleAudio = useAppStore((s) => s.toggleAudio);
  const setLightingOpen = useAppStore((s) => s.setLightingOpen);
  const setMapOpen = useAppStore((s) => s.setMapOpen);
  const setSearchOpen = useAppStore((s) => s.setSearchOpen);
  const setPrivacyModalOpen = useAppStore((s) => s.setPrivacyModalOpen);
  const setKpiOpen = useAppStore((s) => s.setKpiOpen);
  const toggleDayNightMode = useAppStore((s) => s.toggleDayNightMode);
  const setTimeOfDayPreset = useAppStore((s) => s.setTimeOfDayPreset);
  const setArchitecturalPreviewOpen = useAppStore((s) => s.setArchitecturalPreviewOpen);
  const setDataInspectorOpen = useAppStore((s) => s.setDataInspectorOpen);

  // Mobile menu drawer state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Local Bangkok clock
  const [bkkTime, setBkkTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setBkkTime(
        now.toLocaleTimeString('th-TH', {
          timeZone: 'Asia/Bangkok',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between gap-2 px-3 py-2 sm:px-4 sm:py-3 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
        {/* Zone 1: Brand & Official Logo Badge */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-teal-950/40 border border-teal-500/40 p-1 flex items-center justify-center shadow-md shadow-teal-950/50 shrink-0">
            <img
              src="/logo.png"
              alt="ตราสัญลักษณ์โรงพยาบาลอุดรธานี"
              className="w-full h-full object-contain filter drop-shadow"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-xs sm:text-sm md:text-base font-bold text-white tracking-tight whitespace-nowrap">
                <span className="hidden sm:inline">โรงพยาบาลอุดรธานี</span>
                <span className="inline sm:hidden">รพ.อุดรธานี</span>
              </span>
              <span className="text-[10px] sm:text-xs font-semibold text-teal-400 tracking-wider">
                <span className="hidden sm:inline">3D DIGITAL TWIN</span>
                <span className="inline sm:hidden">3D TWIN</span>
              </span>
            </div>
            <div
              onClick={() => setDataInspectorOpen(true)}
              className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-400 cursor-pointer hover:text-slate-200 transition-colors"
              title="แตะเพื่อตรวจสอบข้อมูลจริงของอาคารและจุดบริการ"
            >
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="hidden xs:inline">23 อาคารจริง</span>
                <span className="inline xs:hidden">ผังจริง</span>
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-sky-300 font-medium">อาคารเมตตาธรรม 4 ชั้น</span>
              <span aria-hidden="true" className="hidden sm:inline text-slate-600">·</span>
              <span className="hidden sm:inline text-teal-300/80">รพ.อุดรธานี</span>
            </div>
          </div>
        </div>

        {/* Zone 2: Visualization Layers (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1 p-1 bg-slate-900/90 border border-slate-800 rounded-lg">
          <button
            onClick={() => setActiveLayer('all')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeLayer === 'all'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="แสดงโมเดลสถาปัตยกรรมทุกอาคาร"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>โมเดล 3D อาคาร</span>
          </button>

          <button
            onClick={() => setActiveLayer('vehicles')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeLayer === 'vehicles'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="รถพยาบาลฉุกเฉินและหุ่นยนต์ขนส่ง AGV"
          >
            <Truck className="w-3.5 h-3.5" />
            <span>ยานพาหนะ & AGV</span>
          </button>

          <button
            onClick={() => setActiveLayer('equipment')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeLayer === 'equipment'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="อุปกรณ์การแพทย์สำคัญ"
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>อุปกรณ์การแพทย์</span>
          </button>
        </nav>

        {/* Zone 3: Actions & Quick Status */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Quick 4-Theme Direct Switcher */}
          <div className="hidden xl:flex items-center gap-1 p-1 bg-slate-900/90 border border-slate-800 rounded-lg shrink-0">
            {[
              { id: 'udh-teal', label: '🌿 เขียวทีล', desc: 'รพ.อุดรธานี & สธ.' },
              { id: 'navy-ops', label: '🌊 กรมท่า', desc: 'ศูนย์สั่งการไฮเทค' },
              { id: 'clinical-light', label: '☀️ คลินิกสว่าง', desc: 'คลีน มินิมอล' },
              { id: 'dark-obsidian', label: '⬛ ออบซิเดียน', desc: 'คอนทราสต์สูง' },
            ].map((th) => (
              <button
                key={th.id}
                onClick={() => setTheme(th.id as any)}
                className={`px-2.5 py-1 text-xs rounded-md transition-all font-medium whitespace-nowrap ${
                  theme === th.id
                    ? 'bg-teal-600 text-white font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                }`}
                title={`สลับธีม: ${th.desc}`}
              >
                {th.label}
              </button>
            ))}
          </div>

          {/* Theme & Style Selector Button */}
          <button
            onClick={() => setThemeModalOpen(true)}
            className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5 text-xs font-medium rounded-lg border transition-all whitespace-nowrap shadow-sm min-w-[36px] min-h-[36px] sm:min-h-0 justify-center bg-teal-500/20 text-teal-300 border-teal-500/40 hover:bg-teal-500/30"
            title="ปรับสีสไตล์ และฟอนต์ภาษาไทย (Front Style & Theme)"
          >
            <Palette className="w-4 h-4 text-teal-400" />
            <span className="hidden md:inline font-semibold">สไตล์ & ฟอนต์</span>
          </button>

          {/* Search button */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5 text-xs text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-colors whitespace-nowrap min-w-[36px] min-h-[36px] sm:min-h-0 justify-center"
            title="ค้นหาอาคาร แผนก ห้อง อุปกรณ์ และยานพาหนะ"
          >
            <Search className="w-4 h-4 text-sky-400" />
            <span className="hidden sm:inline">ค้นหาระบบ</span>
          </button>

          {/* GIS Map Toggle */}
          <button
            onClick={() => setMapOpen(!isMapOpen)}
            className={`flex items-center gap-1 p-2 sm:px-2.5 sm:py-1.5 text-xs rounded-lg border transition-colors whitespace-nowrap min-w-[36px] min-h-[36px] sm:min-h-0 justify-center ${
              isMapOpen
                ? 'bg-teal-600 text-white border-teal-400 shadow-sm'
                : 'bg-slate-900 text-slate-300 hover:text-white border-slate-700/80'
            }`}
            title="เปิดแผนที่ภูมิศาสตร์จริง Udon Thani GIS Map"
          >
            <MapPin className="w-4 h-4 text-teal-300" />
            <span className="hidden md:inline">GIS Map</span>
          </button>

          {/* Day / Night Mode Toggle */}
          <button
            onClick={toggleDayNightMode}
            className={`flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5 text-xs font-semibold rounded-lg border transition-all whitespace-nowrap shadow-sm min-w-[36px] min-h-[36px] sm:min-h-0 justify-center ${
              lighting.timeOfDay === 'night'
                ? 'bg-indigo-950/80 text-indigo-300 border-indigo-500/50 hover:bg-indigo-900/80'
                : 'bg-amber-500/20 text-amber-300 border-amber-500/50 hover:bg-amber-500/30'
            }`}
            title={lighting.timeOfDay === 'night' ? 'สลับเป็นโหมดกลางวัน' : 'สลับเป็นโหมดกลางคืน'}
          >
            {lighting.timeOfDay === 'night' ? (
              <>
                <Moon className="w-4 h-4 text-indigo-400 fill-indigo-400/40" />
                <span className="hidden sm:inline">กลางคืน</span>
              </>
            ) : (
              <>
                <Sun className="w-4 h-4 text-amber-400 fill-amber-400/30" />
                <span className="hidden sm:inline">กลางวัน</span>
              </>
            )}
          </button>

          {/* Desktop-only secondary tools */}
          <div className="hidden lg:flex items-center gap-1.5">
            {/* Lighting & Environment Panel Toggle */}
            <button
              onClick={() => setLightingOpen(!isLightingOpen)}
              className={`p-1.5 text-xs rounded-lg border transition-colors ${
                isLightingOpen
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-900 text-slate-300 hover:text-white border-slate-700/80'
              }`}
              title="ปรับสภาพแวดล้อมและแสงแบบละเอียด"
            >
              <SunMedium className="w-4 h-4" />
            </button>

            {/* Audio ambient sound toggle */}
            <button
              onClick={toggleAudio}
              className={`p-1.5 text-xs rounded-lg border transition-colors ${
                audioEnabled
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border-slate-700/80'
              }`}
              title={audioEnabled ? 'ปิดเสียงบรรยากาศ' : 'เปิดเสียงบรรยากาศ'}
            >
              {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* KPI Panel visibility toggle */}
            <button
              onClick={() => setKpiOpen(!isKpiOpen)}
              className={`flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-lg border transition-colors whitespace-nowrap ${
                isKpiOpen
                  ? 'bg-slate-800 text-sky-400 border-sky-500/40'
                  : 'bg-slate-900 text-slate-400 border-slate-700/80'
              }`}
              title="ซ่อน/แสดง สรุปสถานะภาพรวม KPI"
            >
              <span>KPIs</span>
            </button>

            {/* Bangkok Time Clock */}
            <div className="hidden xl:flex items-center px-2.5 py-1 bg-slate-900/90 border border-slate-800 rounded-lg text-xs font-mono-numbers text-slate-300">
              <span className="text-slate-500 mr-1.5">BKK:</span>
              <span>{bkkTime || '00:00:00'}</span>
            </div>

            {/* Privacy Notice Modal Trigger */}
            <button
              onClick={() => setPrivacyModalOpen(true)}
              className="p-1.5 text-xs bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-500/30 rounded-lg transition-colors"
              title="ข้อกำหนดความปลอดภัยและความเป็นส่วนตัว"
            >
              <ShieldAlert className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Button (Hamburger) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-300 hover:text-white bg-slate-900 border border-slate-700/80 rounded-lg transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
            title="เปิดเมนูการจัดการบนมือถือ"
          >
            {mobileMenuOpen ? <X className="w-4 h-4 text-rose-400" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer / Sheet Backdrop and Modal */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden animate-in fade-in duration-200"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="absolute top-14 inset-x-3 max-h-[85vh] bg-slate-900/95 border border-slate-800 rounded-2xl p-4 shadow-2xl overflow-y-auto space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <img
                  src="/logo.png"
                  alt="ตราสัญลักษณ์ รพ.อุดรธานี"
                  className="w-6 h-6 object-contain"
                />
                <span className="text-sm font-bold text-white">ระบบ 3D รพ.อุดรธานี</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Theme & Typography Fast-Switcher */}
            <div className="p-3 bg-slate-950/80 border border-teal-500/30 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-teal-400" />
                  <span className="text-xs font-bold text-white">สไตล์สี & ฟอนต์ (Theme & Font)</span>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setThemeModalOpen(true);
                  }}
                  className="text-[11px] text-teal-300 underline font-medium"
                >
                  ปรับละเอียด
                </button>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'udh-teal', label: 'เขียวทีล รพ.', dot: 'bg-teal-500' },
                  { id: 'navy-ops', label: 'กรมท่าไฮเทค', dot: 'bg-sky-500' },
                  { id: 'clinical-light', label: 'คลินิกสว่าง', dot: 'bg-teal-700' },
                  { id: 'dark-obsidian', label: 'ดำออบซิเดียน', dot: 'bg-amber-500' },
                ].map((th) => (
                  <button
                    key={th.id}
                    onClick={() => setTheme(th.id as any)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs transition-all ${
                      theme === th.id
                        ? 'bg-teal-500/20 text-teal-200 border-teal-500/50 font-semibold'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${th.dot}`} />
                    <span className="truncate">{th.label}</span>
                    {theme === th.id && <Check className="w-3 h-3 text-teal-400 ml-auto" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Section 1: Layer Selection */}
            <div>
              <span className="text-xs font-semibold text-slate-400 block mb-2">
                เลเยอร์แสดงผลในฉาก 3D:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setActiveLayer('all');
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all ${
                    activeLayer === 'all'
                      ? 'bg-sky-500/20 text-sky-300 border-sky-500/40 shadow-sm'
                      : 'bg-slate-950/60 text-slate-400 border-slate-800'
                  }`}
                >
                  <Layers className="w-4 h-4 text-sky-400" />
                  <span>ทั้งหมด</span>
                </button>


                <button
                  onClick={() => {
                    setActiveLayer('vehicles');
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all ${
                    activeLayer === 'vehicles'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                      : 'bg-slate-950/60 text-slate-400 border-slate-800'
                  }`}
                >
                  <Truck className="w-4 h-4 text-emerald-400" />
                  <span>ยานพาหนะ & AGV</span>
                </button>

                <button
                  onClick={() => {
                    setActiveLayer('equipment');
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all ${
                    activeLayer === 'equipment'
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-sm'
                      : 'bg-slate-950/60 text-slate-400 border-slate-800'
                  }`}
                >
                  <Stethoscope className="w-4 h-4 text-purple-400" />
                  <span>อุปกรณ์การแพทย์</span>
                </button>
              </div>
            </div>

            {/* Section 2: Environment & Lighting Presets */}
            <div>
              <span className="text-xs font-semibold text-slate-400 block mb-2">
                สภาพแสงและช่วงเวลา:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'morning', label: 'เช้าตรู่', icon: <Sun className="w-3.5 h-3.5 text-amber-400" /> },
                  { id: 'daytime', label: 'กลางวัน', icon: <SunMedium className="w-3.5 h-3.5 text-sky-400" /> },
                  { id: 'evening', label: 'ยามเย็น', icon: <SunMedium className="w-3.5 h-3.5 text-orange-400" /> },
                  { id: 'night', label: 'กลางคืน', icon: <Moon className="w-3.5 h-3.5 text-indigo-400" /> },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setTimeOfDayPreset(p.id as any);
                    }}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-xs transition-colors ${
                      lighting.timeOfDay === p.id
                        ? 'bg-sky-500/20 text-sky-300 border-sky-500/40 font-semibold'
                        : 'bg-slate-950/60 text-slate-400 border-slate-800'
                    }`}
                  >
                    {p.icon}
                    <span>{p.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Section 3: Tools & Toggles */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-slate-400 block mb-1">
                การทำงานเพิ่มเติม:
              </span>

              {/* Hospital Real Data Directory Inspector */}
              <button
                onClick={() => {
                  setDataInspectorOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold bg-cyan-500/20 text-cyan-300 border-cyan-500/40 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-cyan-400" />
                  <span>ศูนย์ข้อมูลจริง 639 จุดบริการ (Excel / CSV)</span>
                </div>
                <span className="text-[10px] text-cyan-400 font-bold">เปิดดู</span>
              </button>

              {/* Architectural 3D Preview */}
              <button
                onClick={() => {
                  setArchitecturalPreviewOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold bg-emerald-500/20 text-emerald-300 border-emerald-500/40 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>ตัวอย่างผัง 3D และทัศนียภาพสถาปัตยกรรม</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold">ดูผัง 3D</span>
              </button>

              {/* KPI Panel toggle */}
              <button
                onClick={() => {
                  setKpiOpen(!isKpiOpen);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-medium transition-colors ${
                  isKpiOpen
                    ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                    : 'bg-slate-950/60 text-slate-300 border-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-sky-400" />
                  <span>สรุปภาพรวม KPI โรงพยาบาล</span>
                </div>
                <span className="text-[10px] text-slate-400">
                  {isKpiOpen ? 'เปิดอยู่ (แตะเพื่อปิด)' : 'ปิดอยู่ (แตะเพื่อเปิด)'}
                </span>
              </button>

              {/* Audio toggle */}
              <button
                onClick={toggleAudio}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-medium transition-colors ${
                  audioEnabled
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-950/60 text-slate-300 border-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  {audioEnabled ? (
                    <Volume2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-slate-400" />
                  )}
                  <span>เสียงบรรยากาศจำลองโรงพยาบาล</span>
                </div>
                <span className="text-[10px] text-slate-400">
                  {audioEnabled ? 'เปิดเสียงอยู่' : 'ปิดเสียง'}
                </span>
              </button>

              {/* Privacy Modal trigger */}
              <button
                onClick={() => {
                  setPrivacyModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-amber-400 text-xs font-medium hover:bg-slate-900"
              >
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span>ข้อกำหนดความปลอดภัย & PDPA</span>
                </div>
                <span className="text-[10px] text-slate-500">ดูข้อมูล</span>
              </button>
            </div>

            {/* Footer time */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>เวลาประเทศไทย (BKK):</span>
              </span>
              <span className="font-mono-numbers text-slate-300 font-semibold">{bkkTime}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
