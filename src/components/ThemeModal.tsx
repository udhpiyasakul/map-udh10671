import React, { useState } from 'react';
import {
  Palette,
  Type,
  Check,
  X,
  Sparkles,
  Activity,
} from 'lucide-react';
import { useAppStore, AppTheme, AppFontStyle } from '../store/useAppStore';

export const ThemeModal: React.FC = () => {
  const isThemeModalOpen = useAppStore((s) => s.isThemeModalOpen);
  const setThemeModalOpen = useAppStore((s) => s.setThemeModalOpen);
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);
  const fontStyle = useAppStore((s) => s.fontStyle);
  const setFontStyle = useAppStore((s) => s.setFontStyle);

  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  if (!isThemeModalOpen) return null;

  const themes: {
    id: AppTheme;
    nameTh: string;
    nameEn: string;
    desc: string;
    badge: string;
    bgPreview: string;
    borderPreview: string;
    accentPreview: string;
    tagPreview: string;
    isDark: boolean;
  }[] = [
    {
      id: 'udh-teal',
      nameTh: 'เขียวทีล รพ.อุดรธานี (สธ.)',
      nameEn: 'UDH Smart Medical Teal',
      desc: 'สีเขียวมรกต-ทีล สัญลักษณ์การแพทย์ของ รพ.อุดรธานี และกระทรวงสาธารณสุข ผสานจอคอนโซลอัจฉริยะ',
      badge: 'แนะนำอย่างยิ่ง',
      bgPreview: 'from-[#041219] to-[#0a2731]',
      borderPreview: 'border-teal-500/50',
      accentPreview: 'bg-teal-500',
      tagPreview: 'text-teal-300 bg-teal-950/60 border-teal-500/40',
      isDark: true,
    },
    {
      id: 'navy-ops',
      nameTh: 'ศูนย์สั่งการกรมท่าไฮเทค',
      nameEn: 'Navy Command Center',
      desc: 'สีกรมท่าลึกตัดฟ้าอิเล็กทริก สไตล์ศูนย์บัญชาการเหตุฉุกเฉินและ Cyber Operations ควบคุมการบินและกู้ชีพ',
      badge: 'ศูนย์สั่งการ',
      bgPreview: 'from-[#050b14] to-[#0c1a2e]',
      borderPreview: 'border-sky-500/50',
      accentPreview: 'bg-sky-500',
      tagPreview: 'text-sky-300 bg-sky-950/60 border-sky-500/40',
      isDark: true,
    },
    {
      id: 'clinical-light',
      nameTh: 'คลินิกสว่าง สะอาดตา',
      nameEn: 'Clinical Clean Light',
      desc: 'โทนขาว-เทาสว่าง คลีน มินิมอล สไตล์เวชระเบียนและแดชบอร์ดคลินิกพรีเมียม สบายตาเมื่อใช้งานในที่สว่าง',
      badge: 'โหมดสว่างสบายตา',
      bgPreview: 'from-slate-100 to-white',
      borderPreview: 'border-teal-700/30',
      accentPreview: 'bg-teal-700',
      tagPreview: 'text-teal-800 bg-teal-50 border-teal-300',
      isDark: false,
    },
    {
      id: 'dark-obsidian',
      nameTh: 'ดำออบซิเดียน ไฮคอนทราสต์',
      nameEn: 'Dark Obsidian High-Contrast',
      desc: 'สีดำสนิทลุ่มลึก อัตราคอนทราสต์สูงสุด ลดแสงสะท้อนและประหยัดพลังงานหน้าจอ OLED',
      badge: 'คอนทราสต์สูง',
      bgPreview: 'from-[#09090b] to-[#18181b]',
      borderPreview: 'border-amber-500/40',
      accentPreview: 'bg-amber-500',
      tagPreview: 'text-amber-300 bg-amber-950/60 border-amber-500/40',
      isDark: true,
    },
  ];

  const fonts: {
    id: AppFontStyle;
    name: string;
    type: string;
    sampleTh: string;
    desc: string;
    cssClass: string;
  }[] = [
    {
      id: 'prompt',
      name: 'Prompt',
      type: 'ฟอนต์โมเดิร์น ไร้หัว (แนะนำ)',
      sampleTh: 'โรงพยาบาลอุดรธานี 3D Digital Twin — ศูนย์บริการผู้ป่วยนอก OPD',
      desc: 'ฟอนต์สมัยใหม่คมชัด ทันสมัย เข้ากับตัวเลขอักษรละตินและหน้าจอดิจิทัลทวินได้สวยงามที่สุด',
      cssClass: 'font-prompt',
    },
    {
      id: 'sarabun',
      name: 'Sarabun (สารบัญ)',
      type: 'มาตรฐาน สธ. และราชการ',
      sampleTh: 'โรงพยาบาลอุดรธานี 3D Digital Twin — ศูนย์อุบัติเหตุและฉุกเฉิน 1669',
      desc: 'ฟอนต์ทางการมาตรฐานกระทรวงสาธารณสุขและเอกสารราชการ สุภาพ ชัดเจน',
      cssClass: 'font-sarabun',
    },
    {
      id: 'kanit',
      name: 'Kanit (คณิต)',
      type: 'ร่วมสมัย โดดเด่น ทันสมัย',
      sampleTh: 'โรงพยาบาลอุดรธานี 3D Digital Twin — อาคารหลวงตาพระมหาบัว',
      desc: 'ฟอนต์ร่วมสมัย มีความโค้งมนและพลังขับเคลื่อน เหมาะกับแดชบอร์ดข้อมูลแบบไดนามิก',
      cssClass: 'font-kanit',
    },
    {
      id: 'system',
      name: 'Plus Jakarta Sans',
      type: 'ระบบสากลอินเตอร์เนชันแนล',
      sampleTh: 'Udon Thani Hospital Smart Operations Center Viewport',
      desc: 'ฟอนต์สากลระดับพรีเมียมสำหรับการแสดงผลตัวเลขและภาษาอังกฤษ',
      cssClass: 'font-system',
    },
  ];

  const handleSelectTheme = (id: AppTheme) => {
    setTheme(id);
    const found = themes.find((t) => t.id === id);
    setFeedbackMsg(`✓ เปลี่ยนเป็นธีม "${found?.nameTh}" เรียบร้อยแล้ว (มีผลทันที)`);
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const handleSelectFont = (id: AppFontStyle) => {
    setFontStyle(id);
    const found = fonts.find((f) => f.id === id);
    setFeedbackMsg(`✓ เปลี่ยนรูปแบบฟอนต์เป็น "${found?.name}" เรียบร้อยแล้ว`);
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const isLight = theme === 'clinical-light';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div
        className={`relative w-full max-w-3xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col border animate-in fade-in zoom-in-95 duration-200 transition-colors ${
          isLight
            ? 'bg-white text-slate-900 border-slate-300'
            : theme === 'navy-ops'
            ? 'bg-[#071326] text-slate-100 border-sky-500/40'
            : theme === 'dark-obsidian'
            ? 'bg-[#09090b] text-zinc-100 border-amber-500/40'
            : 'bg-[#04161f] text-teal-50 border-teal-500/40'
        }`}
      >
        {/* Modal Header */}
        <div
          className={`flex items-center justify-between px-5 py-4 border-b ${
            isLight
              ? 'bg-slate-50 border-slate-200'
              : theme === 'navy-ops'
              ? 'bg-[#050e1f] border-sky-500/30'
              : theme === 'dark-obsidian'
              ? 'bg-[#070709] border-amber-500/30'
              : 'bg-[#031118] border-teal-500/30'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm ${
                isLight
                  ? 'bg-teal-50 border-teal-300 text-teal-700'
                  : theme === 'navy-ops'
                  ? 'bg-sky-500/20 border-sky-400/40 text-sky-300'
                  : theme === 'dark-obsidian'
                  ? 'bg-amber-500/20 border-amber-400/40 text-amber-300'
                  : 'bg-teal-500/20 border-teal-400/40 text-teal-300'
              }`}
            >
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold tracking-tight">
                  ปรับสีสไตล์ & ฟอนต์การแสดงผล
                </h2>
                <span
                  className={`px-2 py-0.5 text-[11px] font-semibold rounded-full border ${
                    isLight
                      ? 'bg-teal-50 text-teal-800 border-teal-300'
                      : theme === 'navy-ops'
                      ? 'bg-sky-950/80 text-sky-300 border-sky-500/40'
                      : theme === 'dark-obsidian'
                      ? 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                      : 'bg-teal-950/80 text-teal-300 border-teal-500/40'
                  }`}
                >
                  Front UI Style
                </span>
              </div>
              <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                คลิกเลือกธีมสีหรือฟอนต์เพื่อเปลี่ยนรูปลักษณ์ทั้งระบบทันที
              </p>
            </div>
          </div>

          <button
            onClick={() => setThemeModalOpen(false)}
            className={`p-2 rounded-lg transition-colors ${
              isLight
                ? 'text-slate-400 hover:text-slate-900 hover:bg-slate-200'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            aria-label="ปิดหน้าต่าง"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Active confirmation toast notification */}
          {feedbackMsg && (
            <div
              className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-semibold animate-in fade-in slide-in-from-top-2 shadow-sm ${
                isLight
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : theme === 'navy-ops'
                  ? 'bg-sky-500/20 text-sky-200 border-sky-500/50'
                  : theme === 'dark-obsidian'
                  ? 'bg-amber-500/20 text-amber-200 border-amber-500/50'
                  : 'bg-teal-500/20 text-teal-200 border-teal-500/50'
              }`}
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{feedbackMsg}</span>
            </div>
          )}

          {/* Section 1: Themes */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-teal-500" />
                <h3 className="text-sm font-semibold">1. ธีมสีระบบ (System Color Theme)</h3>
              </div>
              <span className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                คลิกเพื่อเปลี่ยนทันที
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {themes.map((t) => {
                const isSelected = theme === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => handleSelectTheme(t.id)}
                    className={`relative text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                      isSelected
                        ? isLight
                          ? 'bg-teal-50/70 border-teal-600 ring-2 ring-teal-500/50 shadow-md'
                          : `bg-slate-800/90 ${t.borderPreview} ring-2 ring-teal-500/50 shadow-lg shadow-teal-950/50`
                        : isLight
                        ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                        : 'bg-slate-900/60 hover:bg-slate-800/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-lg bg-gradient-to-br ${t.bgPreview} border ${t.borderPreview} flex items-center justify-center shrink-0 shadow-sm`}
                        >
                          <div className={`w-3 h-3 rounded-full ${t.accentPreview}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold">{t.nameTh}</span>
                            {isSelected && (
                              <span
                                className={`w-4 h-4 rounded-full flex items-center justify-center ${
                                  isLight ? 'bg-teal-700 text-white' : 'bg-teal-500 text-slate-950'
                                }`}
                              >
                                <Check className="w-3 h-3 stroke-[3]" />
                              </span>
                            )}
                          </div>
                          <span
                            className={`text-[11px] font-medium block ${
                              isLight ? 'text-slate-500' : 'text-slate-400'
                            }`}
                          >
                            {t.nameEn}
                          </span>
                        </div>
                      </div>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${t.tagPreview}`}>
                        {t.badge}
                      </span>
                    </div>

                    <p
                      className={`text-xs leading-relaxed mb-3 ${
                        isLight ? 'text-slate-600' : 'text-slate-400'
                      }`}
                    >
                      {t.desc}
                    </p>

                    {/* Color Palette Preview Swatches */}
                    <div
                      className={`flex items-center gap-1.5 pt-2 border-t ${
                        isLight ? 'border-slate-200' : 'border-slate-800/80'
                      }`}
                    >
                      <div
                        className={`text-[10px] font-mono mr-1 ${
                          isLight ? 'text-slate-500' : 'text-slate-500'
                        }`}
                      >
                        ตัวอย่าง:
                      </div>
                      <div
                        className={`h-4 px-2.5 rounded text-[10px] font-medium flex items-center bg-gradient-to-r ${t.bgPreview} border ${t.borderPreview} ${
                          t.isDark ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        แถบเมนู
                      </div>
                      <div
                        className={`h-4 px-2 rounded text-[10px] font-medium flex items-center ${t.accentPreview} ${
                          t.isDark ? 'text-slate-950' : 'text-white'
                        }`}
                      >
                        ปุ่มกด
                      </div>
                      <div
                        className={`h-4 px-1.5 rounded text-[10px] font-medium flex items-center ${
                          t.isDark
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        สถานะ
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Section 2: Fonts */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Type className="w-4 h-4 text-teal-500" />
                <h3 className="text-sm font-semibold">2. ฟอนต์ตัวอักษรไทย-อังกฤษ (Typography)</h3>
              </div>
              <span className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                คลิกเพื่อเปลี่ยนฟอนต์ทันที
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {fonts.map((f) => {
                const isSelected = fontStyle === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => handleSelectFont(f.id)}
                    className={`text-left p-3.5 rounded-xl border transition-all ${
                      isSelected
                        ? isLight
                          ? 'bg-teal-50/70 border-teal-600 ring-2 ring-teal-500/40 shadow-sm'
                          : 'bg-slate-800/90 border-teal-500/60 ring-2 ring-teal-500/40 shadow-md'
                        : isLight
                        ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                        : 'bg-slate-900/60 hover:bg-slate-800/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`text-base font-bold ${f.cssClass}`}>{f.name}</span>
                        <span
                          className={`text-[11px] px-2 py-0.5 rounded border ${
                            isLight
                              ? 'bg-teal-50 text-teal-800 border-teal-200'
                              : 'bg-teal-950/60 text-teal-300 border-teal-500/30'
                          }`}
                        >
                          {f.type}
                        </span>
                      </div>
                      {isSelected && (
                        <span
                          className={`w-4 h-4 rounded-full flex items-center justify-center ${
                            isLight ? 'bg-teal-700 text-white' : 'bg-teal-500 text-slate-950'
                          }`}
                        >
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      )}
                    </div>

                    <div
                      className={`text-xs p-2 rounded-lg border mb-2 ${f.cssClass} ${
                        isLight
                          ? 'bg-white border-slate-200 text-slate-800'
                          : 'bg-slate-950/60 border-slate-800 text-slate-200'
                      }`}
                    >
                      {f.sampleTh}
                    </div>

                    <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                      {f.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Section 3: Live Preview Banner */}
          <section
            className={`border rounded-xl p-4 ${
              isLight
                ? 'bg-slate-50 border-teal-500/30'
                : 'bg-slate-950/70 border-teal-500/20'
            }`}
          >
            <div
              className={`flex items-center gap-2 text-xs font-semibold mb-2 ${
                isLight ? 'text-teal-700' : 'text-teal-300'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>ตัวอย่างการแสดงผลแบบเรียลไทม์ (Live System Preview)</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border ${
                  isLight
                    ? 'bg-teal-50 border-teal-300 text-teal-800'
                    : 'bg-teal-500/20 border-teal-400/40 text-teal-200'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>รพ.อุดรธานี 3D Digital Twin</span>
              </div>
              <div
                className={`px-2.5 py-1.5 rounded-lg text-xs font-mono-numbers border ${
                  isLight
                    ? 'bg-white border-slate-200 text-slate-800'
                    : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                เตียงพร้อมใช้:{' '}
                <span className="text-emerald-500 font-bold">142</span> / 168
              </div>
              <div
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border ${
                  isLight
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                }`}
              >
                อัตราครองเตียง: 84.5%
              </div>
              <div
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border ${
                  isLight
                    ? 'bg-sky-50 text-sky-800 border-sky-200'
                    : 'bg-sky-500/20 text-sky-300 border-sky-500/30'
                }`}
              >
                1669 กู้ชีพ: ปกติ
              </div>
            </div>
          </section>
        </div>

        {/* Modal Footer */}
        <div
          className={`flex items-center justify-between px-5 py-3.5 border-t ${
            isLight
              ? 'bg-slate-50 border-slate-200'
              : theme === 'navy-ops'
              ? 'bg-[#050e1f] border-sky-500/30'
              : theme === 'dark-obsidian'
              ? 'bg-[#070709] border-amber-500/30'
              : 'bg-[#031118] border-teal-500/30'
          }`}
        >
          <div className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            บันทึกการตั้งค่าลงเบราว์เซอร์โดยอัตโนมัติ (LocalStorage Persistent)
          </div>
          <button
            onClick={() => setThemeModalOpen(false)}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors shadow-md ${
              isLight
                ? 'bg-teal-700 hover:bg-teal-800 text-white'
                : 'bg-teal-400 hover:bg-teal-300 text-slate-950'
            }`}
          >
            เสร็จสิ้น & ใช้งานสไตล์นี้
          </button>
        </div>
      </div>
    </div>
  );
};
