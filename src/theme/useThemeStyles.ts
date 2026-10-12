import { useAppStore, AppTheme } from '../store/useAppStore';

export interface ThemeConfig {
  id: AppTheme;
  isLight: boolean;
  nameTh: string;
  nameEn: string;
  // App root background
  rootBg: string;
  // TopBar
  headerBg: string;
  headerBorder: string;
  brandIconBg: string;
  brandIconBorder: string;
  brandIconText: string;
  brandTitle: string;
  brandSubtitle: string;
  // Panels & Asides
  panelBg: string;
  panelBorder: string;
  cardBg: string;
  cardBorder: string;
  // Buttons
  btnBg: string;
  btnBorder: string;
  btnText: string;
  btnHover: string;
  btnActiveBg: string;
  btnActiveBorder: string;
  btnActiveText: string;
  // Primary Accents
  accentText: string;
  accentBadge: string;
  accentBtn: string;
  // Canvas Colors
  canvasNightBg: number;
  canvasDayBg: number;
}

export const THEME_CONFIGS: Record<AppTheme, ThemeConfig> = {
  'udh-teal': {
    id: 'udh-teal',
    isLight: false,
    nameTh: 'เขียวทีล รพ.อุดรธานี (สธ.)',
    nameEn: 'UDH Smart Medical Teal',
    rootBg: 'bg-[#041219] text-teal-50',
    headerBg: 'bg-[#04161f]/95 backdrop-blur-md border-b border-teal-500/30',
    headerBorder: 'border-teal-500/30',
    brandIconBg: 'bg-teal-500/20',
    brandIconBorder: 'border-teal-400/40',
    brandIconText: 'text-teal-300',
    brandTitle: 'text-white',
    brandSubtitle: 'text-teal-300/80',
    panelBg: 'bg-[#04161f]/95 backdrop-blur-md border border-teal-500/30 shadow-2xl shadow-teal-950/50 text-slate-100',
    panelBorder: 'border-teal-500/30',
    cardBg: 'bg-[#06242e]/85 border border-teal-500/25',
    cardBorder: 'border-teal-500/25',
    btnBg: 'bg-[#06242e] text-teal-100 border border-teal-500/30 hover:bg-[#0a3544]',
    btnBorder: 'border-teal-500/30',
    btnText: 'text-teal-100',
    btnHover: 'hover:bg-[#0a3544]',
    btnActiveBg: 'bg-teal-600 text-white font-semibold border border-teal-400 shadow-md shadow-teal-950/50',
    btnActiveBorder: 'border-teal-400',
    btnActiveText: 'text-white',
    accentText: 'text-teal-400',
    accentBadge: 'bg-teal-500/20 text-teal-300 border border-teal-500/40',
    accentBtn: 'bg-teal-600 hover:bg-teal-500 text-white',
    canvasNightBg: 0x04141c,
    canvasDayBg: 0x86efac,
  },
  'navy-ops': {
    id: 'navy-ops',
    isLight: false,
    nameTh: 'ศูนย์สั่งการกรมท่าไฮเทค',
    nameEn: 'Navy Command Center',
    rootBg: 'bg-[#050b14] text-slate-50',
    headerBg: 'bg-[#071326]/95 backdrop-blur-md border-b border-sky-500/30',
    headerBorder: 'border-sky-500/30',
    brandIconBg: 'bg-sky-500/20',
    brandIconBorder: 'border-sky-400/40',
    brandIconText: 'text-sky-300',
    brandTitle: 'text-white',
    brandSubtitle: 'text-sky-300/80',
    panelBg: 'bg-[#071326]/95 backdrop-blur-md border border-sky-500/30 shadow-2xl shadow-sky-950/50 text-slate-100',
    panelBorder: 'border-sky-500/30',
    cardBg: 'bg-[#0b1f3d]/85 border border-sky-500/25',
    cardBorder: 'border-sky-500/25',
    btnBg: 'bg-[#0b1f3d] text-slate-200 border border-sky-500/30 hover:bg-[#122e59]',
    btnBorder: 'border-sky-500/30',
    btnText: 'text-slate-200',
    btnHover: 'hover:bg-[#122e59]',
    btnActiveBg: 'bg-sky-600 text-white font-semibold border border-sky-400 shadow-md shadow-sky-950/50',
    btnActiveBorder: 'border-sky-400',
    btnActiveText: 'text-white',
    accentText: 'text-sky-400',
    accentBadge: 'bg-sky-500/20 text-sky-300 border border-sky-500/40',
    accentBtn: 'bg-sky-600 hover:bg-sky-500 text-white',
    canvasNightBg: 0x050d1a,
    canvasDayBg: 0x93c5fd,
  },
  'clinical-light': {
    id: 'clinical-light',
    isLight: true,
    nameTh: 'คลินิกสว่าง สะอาดตา',
    nameEn: 'Clinical Clean Light',
    rootBg: 'bg-slate-100 text-slate-900',
    headerBg: 'bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm text-slate-900',
    headerBorder: 'border-slate-200',
    brandIconBg: 'bg-teal-50',
    brandIconBorder: 'border-teal-200',
    brandIconText: 'text-teal-700',
    brandTitle: 'text-slate-900',
    brandSubtitle: 'text-teal-700',
    panelBg: 'bg-white/98 backdrop-blur-md border border-slate-200 shadow-xl text-slate-800',
    panelBorder: 'border-slate-200',
    cardBg: 'bg-slate-50 border border-slate-200 text-slate-800',
    cardBorder: 'border-slate-200',
    btnBg: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100',
    btnBorder: 'border-slate-200',
    btnText: 'text-slate-700',
    btnHover: 'hover:bg-slate-100',
    btnActiveBg: 'bg-teal-700 text-white font-semibold border border-teal-800 shadow-sm',
    btnActiveBorder: 'border-teal-800',
    btnActiveText: 'text-white',
    accentText: 'text-teal-700',
    accentBadge: 'bg-teal-50 text-teal-800 border border-teal-300 font-medium',
    accentBtn: 'bg-teal-700 hover:bg-teal-800 text-white',
    canvasNightBg: 0x334155,
    canvasDayBg: 0xdbeafe,
  },
  'dark-obsidian': {
    id: 'dark-obsidian',
    isLight: false,
    nameTh: 'ดำออบซิเดียน ไฮคอนทราสต์',
    nameEn: 'Dark Obsidian High-Contrast',
    rootBg: 'bg-[#09090b] text-zinc-100',
    headerBg: 'bg-[#09090b]/95 backdrop-blur-md border-b border-amber-500/30',
    headerBorder: 'border-amber-500/30',
    brandIconBg: 'bg-amber-500/20',
    brandIconBorder: 'border-amber-400/40',
    brandIconText: 'text-amber-400',
    brandTitle: 'text-white',
    brandSubtitle: 'text-amber-300/80',
    panelBg: 'bg-[#09090b]/95 backdrop-blur-md border border-amber-500/30 shadow-2xl shadow-black text-zinc-100',
    panelBorder: 'border-amber-500/30',
    cardBg: 'bg-[#141418]/90 border border-amber-500/25',
    cardBorder: 'border-amber-500/25',
    btnBg: 'bg-[#141418] text-zinc-200 border border-amber-500/30 hover:bg-[#1f1f26]',
    btnBorder: 'border-amber-500/30',
    btnText: 'text-zinc-200',
    btnHover: 'hover:bg-[#1f1f26]',
    btnActiveBg: 'bg-amber-500 text-slate-950 font-bold border border-amber-400 shadow-md shadow-amber-950/50',
    btnActiveBorder: 'border-amber-400',
    btnActiveText: 'text-slate-950',
    accentText: 'text-amber-400',
    accentBadge: 'bg-amber-500/20 text-amber-300 border border-amber-500/40',
    accentBtn: 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold',
    canvasNightBg: 0x050507,
    canvasDayBg: 0x475569,
  },
};

export const useThemeStyles = (): ThemeConfig => {
  const theme = useAppStore((s) => s.theme);
  return THEME_CONFIGS[theme] || THEME_CONFIGS['udh-teal'];
};
