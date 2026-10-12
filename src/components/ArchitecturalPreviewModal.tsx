import React from 'react';
import {
  X,
  Building2,
  Plane,
  Milestone,
  Tag,
  Eye,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Sun,
  Moon,
  Crown,
} from 'lucide-react';
import { useAppStore, CameraPresetType } from '../store/useAppStore';

export const ArchitecturalPreviewModal: React.FC = () => {
  const isOpen = useAppStore((s) => s.isArchitecturalPreviewOpen);
  const setOpen = useAppStore((s) => s.setArchitecturalPreviewOpen);
  const showFloatingLabels = useAppStore((s) => s.showFloatingLabels);
  const toggleFloatingLabels = useAppStore((s) => s.toggleFloatingLabels);
  const selectObject = useAppStore((s) => s.selectObject);
  const setCameraPreset = useAppStore((s) => s.setCameraPreset);
  const toggleDayNightMode = useAppStore((s) => s.toggleDayNightMode);
  const lighting = useAppStore((s) => s.lighting);

  if (!isOpen) return null;

  const handleNavigatePreset = (preset: CameraPresetType) => {
    setOpen(false);
    setCameraPreset(preset);
  };

  const isNight = lighting.timeOfDay === 'night';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400 shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  แบบจำลองผังสถาปัตยกรรม 3D โรงพยาบาลอุดรธานี
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-md">
                  VERIFIED DESIGN
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Architectural 3D Concept Master Plan · สไตล์มินิมอลขาว-เทา ป้ายชื่อลอย และลาน ฮ. ดาดฟ้า
              </p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="ปิดหน้าต่าง"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Visual Showcase Card */}
          <div className="relative rounded-xl overflow-hidden border border-slate-700/80 bg-gradient-to-b from-slate-800/80 to-slate-950 p-5 shadow-lg">
            {/* Architectural Visual Banner */}
            <div className="relative w-full h-48 sm:h-64 rounded-lg overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
              {/* Architectural Campus Isometric Schematic SVG */}
              <svg className="w-full h-full" viewBox="0 0 800 400" fill="none">
                <defs>
                  <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0f172a" />
                    <stop offset="100%" stopColor="#1e293b" />
                  </linearGradient>
                  <linearGradient id="bldFacade" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#f8fafc" />
                    <stop offset="100%" stopColor="#cbd5e1" />
                  </linearGradient>
                  <linearGradient id="glassWall" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#0284c7" stopOpacity="0.75" />
                  </linearGradient>
                  <linearGradient id="roadGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#334155" />
                    <stop offset="100%" stopColor="#1e293b" />
                  </linearGradient>
                </defs>

                {/* Sky background */}
                <rect width="800" height="400" fill="url(#skyGrad)" />

                {/* Subtle grid lines */}
                <path d="M 50 350 L 750 350 M 50 310 L 750 310 M 50 270 L 750 270" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />

                {/* Lawn ground */}
                <polygon points="40,360 760,360 720,230 80,230" fill="#1b3022" opacity="0.8" />

                {/* Front 2-Lane Boulevard (Pho Niyom Road) */}
                <polygon points="20,380 780,380 760,340 40,340" fill="url(#roadGrad)" />
                {/* Yellow center line */}
                <path d="M 40 360 L 760 360" stroke="#facc15" strokeWidth="2.5" strokeDasharray="14 10" />
                {/* Central median curb */}
                <rect x="250" y="356" width="300" height="7" rx="3" fill="#047857" stroke="#10b981" strokeWidth="0.8" />
                {/* White shoulder lines */}
                <path d="M 45 344 L 755 344" stroke="#ffffff" strokeWidth="1.5" />
                <path d="M 25 376 L 775 376" stroke="#ffffff" strokeWidth="1.5" />

                {/* Grand Hospital Entrance Arch */}
                <rect x="360" y="295" width="8" height="50" fill="#f8fafc" />
                <rect x="432" y="295" width="8" height="50" fill="#f8fafc" />
                <rect x="356" y="295" width="88" height="8" rx="2" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
                <text x="400" y="301" textAnchor="middle" fill="#38bdf8" fontSize="6" fontWeight="bold">
                  UDON THANI HOSPITAL
                </text>

                {/* Background Buildings (69Y, 96Y) */}
                <polygon points="120,240 180,210 240,240 180,270" fill="#cbd5e1" />
                <polygon points="120,240 180,270 180,140 120,110" fill="url(#bldFacade)" />
                <polygon points="180,270 240,240 240,110 180,140" fill="#94a3b8" />
                {/* Windows 69Y */}
                <rect x="130" y="130" width="40" height="90" fill="url(#glassWall)" opacity="0.75" />

                <polygon points="250,230 310,200 370,230 310,260" fill="#cbd5e1" />
                <polygon points="250,230 310,260 310,120 250,90" fill="url(#bldFacade)" />
                <polygon points="310,260 370,230 370,90 310,120" fill="#94a3b8" />
                {/* Windows 96Y */}
                <rect x="260" y="115" width="40" height="105" fill="url(#glassWall)" opacity="0.75" />

                {/* Main OPD & Administration Building (Center Right) */}
                <polygon points="460,280 570,235 680,280 570,325" fill="#e2e8f0" />
                <polygon points="460,280 570,325 570,180 460,135" fill="url(#bldFacade)" />
                <polygon points="570,325 680,280 680,135 570,180" fill="#94a3b8" />
                {/* Modern curtain glass ribbons */}
                <rect x="475" y="155" width="80" height="110" rx="4" fill="url(#glassWall)" opacity="0.85" />

                {/* ROOFTOP HELIPAD on OPD Building */}
                {/* Elevated deck */}
                <ellipse cx="570" cy="172" rx="38" ry="18" fill="#1e293b" stroke="#facc15" strokeWidth="1.5" />
                {/* Red touchdown ring */}
                <ellipse cx="570" cy="172" rx="26" ry="12" fill="none" stroke="#ef4444" strokeWidth="2.5" />
                {/* White 'H' */}
                <text x="570" y="177" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="bold" fontFamily="monospace">
                  H
                </text>
                {/* Blinking beacons */}
                <circle cx="534" cy="172" r="3" fill="#ef4444" className="animate-ping" />
                <circle cx="606" cy="172" r="3" fill="#ef4444" className="animate-ping" />

                {/* 3D Floating Labels Callouts */}
                {/* OPD Label */}
                <g transform="translate(570, 110)">
                  <rect x="-105" y="-16" width="210" height="30" rx="8" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
                  <polygon points="-6,14 0,22 6,14" fill="#0f172a" />
                  <text x="0" y="4" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold">
                    อาคารผู้ป่วยนอกและอำนวยการ
                  </text>
                  <circle cx="92" cy="-2" r="4" fill="#ef4444" />
                </g>

                {/* 69Y Label */}
                <g transform="translate(180, 85)">
                  <rect x="-80" y="-14" width="160" height="26" rx="6" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.2" />
                  <polygon points="-5,12 0,18 5,12" fill="#0f172a" />
                  <text x="0" y="3" textAnchor="middle" fill="#f8fafc" fontSize="10" fontWeight="bold">
                    อาคาร 69 ปี รพ.อุดรธานี
                  </text>
                </g>

                {/* Trees and Greenery */}
                {[
                  [70, 320], [130, 310], [210, 305], [330, 315],
                  [480, 330], [640, 335], [710, 325],
                ].map(([tx, ty], idx) => (
                  <g key={idx}>
                    <line x1={tx} y1={ty} x2={tx} y2={ty + 12} stroke="#452b14" strokeWidth="2" />
                    <circle cx={tx} cy={ty} r="8" fill="#15803d" />
                    <circle cx={tx + 3} cy={ty - 2} r="6" fill="#22c55e" opacity="0.8" />
                  </g>
                ))}
              </svg>

              {/* Badges Overlay */}
              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-900/90 border border-sky-500/50 text-sky-300 backdrop-blur-md">
                  ✨ สถาปัตยกรรมมินิมอลขาว-เทา
                </span>
                <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-900/90 border border-rose-500/50 text-rose-300 backdrop-blur-md">
                  🚁 ลานจอด ฮ. ดาดฟ้าตึกอำนวยการ
                </span>
                <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-900/90 border border-amber-500/50 text-amber-300 backdrop-blur-md">
                  🛣️ ถนน 2 เลนพร้อมเกาะกลาง
                </span>
              </div>
            </div>
          </div>

          {/* 5 Core Enhancements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* 1. Minimalist Architectural Tone & 3D Labels */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2.5 text-white font-semibold text-sm">
                <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
                  <Building2 className="w-4 h-4" />
                </div>
                <span>1. โทนสีมินิมอลขาว-เทา & ป้ายชื่อ 3D</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                ปรับปรุงผิวอาคารทั้ง 23 หลังเป็นสถาปัตยกรรมคอนกรีตขาว-เทาเรียบหรู พร้อมกระจกสะท้อนฟ้าสีครามใส และติดตั้งป้ายลอย 3D Billboard ระบุชื่อภาษาไทยและรหัสอาคารค้างไว้เหนือทุกตึกตลอดเวลา คำนวณขนาดย่อขยายตามระยะซูม
              </p>
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-slate-400">สถานะป้ายชื่อ 3D:</span>
                <button
                  onClick={toggleFloatingLabels}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-colors ${
                    showFloatingLabels
                      ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {showFloatingLabels ? '✓ แสดงป้ายชื่อตลอดเวลา' : 'ซ่อนป้ายชื่อ'}
                </button>
              </div>
            </div>

            {/* 2. Rooftop Helipad on Administration Building */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2.5 text-white font-semibold text-sm">
                <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
                  <Plane className="w-4 h-4" />
                </div>
                <span>2. ลานจอด ฮ. ดาดฟ้าตึกอำนวยการ</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                ติดตั้งโครงสร้างลานจอดเฮลิคอปเตอร์กู้ชีพฉุกเฉินมาตรฐานบนดาดฟ้า <b>อาคารผู้ป่วยนอกและอำนวยการ</b> (ชั้น 7) พร้อมแท่นยกพื้น วงแหวนนิรภัยสีแดง/เหลือง สัญลักษณ์อักษร 'H' และไฟสัญญาณกะพริบนำร่องการบิน 4 มุม
              </p>
              <button
                onClick={() => handleNavigatePreset('helipad')}
                className="inline-flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-medium pt-1 hover:underline"
              >
                <span>ซูมกล้องไปที่ลาน ฮ. ตึกอำนวยการ</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 3. Correct Master North-South Boulevard */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2.5 text-white font-semibold text-sm">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                  <Milestone className="w-4 h-4" />
                </div>
                <span>3. ถนนหลักแนวเหนือ-ใต้ (ถูกต้องตามจริง)</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                ปรับแนวถนนหลัก 2 เลนให้ถูกต้องตามผังจริง วิ่งในแนวเหนือ-ใต้ ผ่านหน้า <b>ตึกเวชกรรมสังคม</b>, <b>อาคารอำนวยการ</b>, และ <b>ตึก 96 ปี หลวงตามหาบัว</b> พร้อมเกาะกลางถนน ทางม้าลาย และซุ้มประตูใหญ่
              </p>
              <button
                onClick={() => handleNavigatePreset('panorama')}
                className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-medium pt-1 hover:underline"
              >
                <span>ดูแนวถนนหลักและผังโรงพยาบาล</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 4. Royal Monument Plaza in front of OPD */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2.5 text-white font-semibold text-sm">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                  <Crown className="w-4 h-4" />
                </div>
                <span>4. ลานพระรูป หน้าตึกผู้ป่วยนอก</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                สร้าง <b>ลานพระอนุสาวรีย์ กรมหลวงประจักษ์ศิลปาคม</b> บนแท่นหินอ่อนสีขาว 3 ชั้น ฉัตรทอง 7 ชั้น แปลงสวนไม้ดอกประดับหลากสี และลานคนเดินปูหินแกรนิตกว้างขวางเชื่อมตรงสู่ทางเข้าอาคารผู้ป่วยนอก
              </p>
              <button
                onClick={() => handleNavigatePreset('plaza')}
                className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-medium pt-1 hover:underline"
              >
                <span>ซูมกล้องไปที่ลานพระรูป & OPD</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 5. Nong Prajak Public Park & Yellow Duck Landmark */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 md:col-span-2 lg:col-span-2">
              <div className="flex items-center gap-2.5 text-white font-semibold text-sm">
                <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-400">
                  <span className="text-base leading-none">🦆</span>
                </div>
                <span>5. หนองประจักษ์ & เป็ดเหลืองยักษ์แลนด์มาร์ก (ฝั่งตรงข้าม รพ.)</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                สร้างผืนน้ำทะเลสาบหนองประจักษ์ศิลปาคมฝั่งขวาของถนนใหญ่ตรงข้ามโรงพยาบาล พร้อมลู่วิ่งยางสังเคราะห์สีฟ้า สวนสาธารณะร่มรื่น น้ำพุกลางน้ำ และ <b>แลนด์มาร์กเป็ดเหลืองยักษ์</b> ลอยน้ำกระเพื่อมตามระลอกคลื่นแบบเรียลไทม์ พร้อมปลดล็อกหมอกออกทั้งหมดเพื่อให้เห็นวิวมุมกว้างคมชัดระดับพาโนรามา
              </p>
              <button
                onClick={() => handleNavigatePreset('duck')}
                className="inline-flex items-center gap-1.5 text-xs text-yellow-400 hover:text-yellow-300 font-medium pt-1 hover:underline"
              >
                <span>ซูมกล้องไปที่หนองประจักษ์และเป็ดเหลือง</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Camera Navigation Bar */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div className="text-xs text-slate-300">
                <span className="font-semibold text-white">โมเดล 3D ผังแม่บทใหม่เปิดใช้งานแล้วในระบบ</span>
                <span className="text-slate-400 ml-1">· ไม่มีหมอกบดบังทัศนียภาพ สามารถคลิกเลือกมุมมองได้ทันที:</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
              <button
                onClick={() => handleNavigatePreset('panorama')}
                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-sky-600 hover:bg-sky-500 text-white shadow-lg transition-colors flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>วิวกว้างพาโนรามา</span>
              </button>
              <button
                onClick={() => handleNavigatePreset('plaza')}
                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-amber-600 hover:bg-amber-500 text-white shadow-lg transition-colors flex items-center gap-1"
              >
                <Crown className="w-3.5 h-3.5" />
                <span>ลานพระรูป</span>
              </button>
              <button
                onClick={() => handleNavigatePreset('duck')}
                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-yellow-500 hover:bg-yellow-400 text-slate-950 shadow-lg transition-colors flex items-center gap-1"
              >
                <span>🦆 หนองประจักษ์</span>
              </button>
              <button
                onClick={() => handleNavigatePreset('helipad')}
                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-rose-600 hover:bg-rose-500 text-white shadow-lg transition-colors flex items-center gap-1"
              >
                <span>🚁 ลาน ฮ. ดาดฟ้า</span>
              </button>
              <button
                onClick={toggleDayNightMode}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1"
                title="ทดสอบแสงกลางวัน/กลางคืน"
              >
                {isNight ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-400" />}
                <span>{isNight ? 'กลางวัน' : 'กลางคืน'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
