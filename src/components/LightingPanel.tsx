import React from 'react';
import {
  SunMedium,
  Sunset,
  Sunrise,
  Moon,
  AlertTriangle,
  RotateCcw,
  X,
  Sliders,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { TimeOfDay } from '../types/hospital';

export const LightingPanel: React.FC = () => {
  const isLightingOpen = useAppStore((s) => s.isLightingOpen);
  const lighting = useAppStore((s) => s.lighting);
  const setLightingOpen = useAppStore((s) => s.setLightingOpen);
  const setTimeOfDayPreset = useAppStore((s) => s.setTimeOfDayPreset);
  const updateLighting = useAppStore((s) => s.updateLighting);

  if (!isLightingOpen) return null;

  const presets: { id: TimeOfDay; labelTh: string; icon: React.ReactNode }[] = [
    { id: 'morning', labelTh: 'เช้าตรู่ (Morning)', icon: <Sunrise className="w-3.5 h-3.5 text-amber-400" /> },
    { id: 'daytime', labelTh: 'กลางวัน (Daytime)', icon: <SunMedium className="w-3.5 h-3.5 text-sky-400" /> },
    { id: 'evening', labelTh: 'ยามเย็น (Evening)', icon: <Sunset className="w-3.5 h-3.5 text-orange-400" /> },
    { id: 'night', labelTh: 'กลางคืน (Night)', icon: <Moon className="w-3.5 h-3.5 text-indigo-400" /> },
  ];

  return (
    <div className="fixed inset-x-3 bottom-20 sm:inset-x-auto sm:absolute sm:top-18 sm:right-12 sm:bottom-auto z-30 sm:w-80 max-h-[80vh] overflow-y-auto bg-slate-950/95 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-4 text-xs space-y-4 animate-in fade-in duration-150">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-amber-400" />
          <h2 className="font-bold text-slate-100">ปรับสภาพแวดล้อมและแสง</h2>
        </div>
        <button
          onClick={() => setLightingOpen(false)}
          className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Preset Buttons */}
      <div>
        <label className="text-slate-400 font-medium block mb-1.5">ช่วงเวลาจำลอง</label>
        <div className="grid grid-cols-2 gap-1.5">
          {presets.map((p) => (
            <button
              key={p.id}
              onClick={() => setTimeOfDayPreset(p.id)}
              className={`p-2 rounded-lg border text-left flex items-center gap-2 transition-colors ${
                lighting.timeOfDay === p.id && !lighting.emergencyLightPreview
                  ? 'bg-sky-500/20 text-sky-300 border-sky-500/50'
                  : 'bg-slate-900/80 text-slate-300 hover:text-white border-slate-800'
              }`}
            >
              {p.icon}
              <span className="font-medium text-[11px] truncate">{p.labelTh}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Sliders */}
      <div className="space-y-3 pt-1">
        <div>
          <div className="flex justify-between text-slate-400 mb-1">
            <span>มุมยกดวงอาทิตย์ (Elevation)</span>
            <span className="font-mono-numbers text-slate-200">{lighting.sunElevation}°</span>
          </div>
          <input
            type="range"
            min="2"
            max="85"
            value={lighting.sunElevation}
            onChange={(e) => updateLighting({ sunElevation: Number(e.target.value) })}
            className="w-full accent-sky-400 cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between text-slate-400 mb-1">
            <span>ทิศทางแสงแดด (Sun Azimuth)</span>
            <span className="font-mono-numbers text-slate-200">{lighting.sunAzimuth}°</span>
          </div>
          <input
            type="range"
            min="0"
            max="360"
            value={lighting.sunAzimuth}
            onChange={(e) => updateLighting({ sunAzimuth: Number(e.target.value) })}
            className="w-full accent-sky-400 cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between text-slate-400 mb-1">
            <span>ความเข้มแสงแดด (Sun Intensity)</span>
            <span className="font-mono-numbers text-slate-200">{lighting.sunlightIntensity.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="2.5"
            step="0.1"
            value={lighting.sunlightIntensity}
            onChange={(e) => updateLighting({ sunlightIntensity: Number(e.target.value) })}
            className="w-full accent-sky-400 cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between text-slate-400 mb-1">
            <span>แสงบรรยากาศ (Ambient Light)</span>
            <span className="font-mono-numbers text-slate-200">{lighting.ambientLightIntensity.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1.5"
            step="0.05"
            value={lighting.ambientLightIntensity}
            onChange={(e) => updateLighting({ ambientLightIntensity: Number(e.target.value) })}
            className="w-full accent-sky-400 cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between text-slate-400 mb-1">
            <span>การเปิดรับแสง (Exposure)</span>
            <span className="font-mono-numbers text-slate-200">{lighting.sceneExposure.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.6"
            max="1.8"
            step="0.05"
            value={lighting.sceneExposure}
            onChange={(e) => updateLighting({ sceneExposure: Number(e.target.value) })}
            className="w-full accent-sky-400 cursor-pointer"
          />
        </div>
      </div>

      {/* Emergency Light Preview */}
      <div className="p-3 bg-red-950/30 border border-red-500/30 rounded-xl space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-red-400 font-semibold text-xs">
            <AlertTriangle className="w-4 h-4" />
            <span>Emergency Light Preview</span>
          </div>
          <input
            type="checkbox"
            checked={lighting.emergencyLightPreview}
            onChange={(e) => updateLighting({ emergencyLightPreview: e.target.checked })}
            className="w-4 h-4 accent-red-500 rounded cursor-pointer"
          />
        </div>
        <p className="text-[10px] text-slate-400 leading-tight">
          จำลองระบบไฟส่องสว่างฉุกเฉินและสัญญาณเตือนไฟแดงรอบโรงพยาบาล (การแสดงผลจำลองเท่านั้น ไม่ใช่การควบคุมระบบไฟฟ้าจริง)
        </p>
      </div>

      {/* Reset Lighting Button */}
      <button
        onClick={() => setTimeOfDayPreset('daytime')}
        className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-800 flex items-center justify-center gap-1.5 transition-colors"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>รีเซ็ตค่าแสงเริ่มต้น</span>
      </button>
    </div>
  );
};
