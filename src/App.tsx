import React, { useEffect } from 'react';
import { HospitalCanvas } from './scene/HospitalCanvas';
import { TopBar } from './components/TopBar';
import { KpiDashboard } from './components/KpiDashboard';
import { ControlDock } from './components/ControlDock';
import { DetailPanel } from './components/DetailPanel';
import { LightingPanel } from './components/LightingPanel';
import { MapPanel } from './components/MapPanel';
import { SearchModal } from './components/SearchModal';
import { PrivacyNotice } from './components/PrivacyNotice';
import { ThemeModal } from './components/ThemeModal';
import { ArchitecturalPreviewModal } from './components/ArchitecturalPreviewModal';
import { DataInspectorModal } from './components/DataInspectorModal';
import { useAppStore } from './store/useAppStore';

export default function App() {
  const isPlaying = useAppStore((s) => s.isPlaying);
  const setPlaying = useAppStore((s) => s.setPlaying);
  const setSpeedMultiplier = useAppStore((s) => s.setSpeedMultiplier);
  const setSearchOpen = useAppStore((s) => s.setSearchOpen);
  const setCameraMode = useAppStore((s) => s.setCameraMode);
  const clearSelection = useAppStore((s) => s.clearSelection);
  const theme = useAppStore((s) => s.theme);
  const fontStyle = useAppStore((s) => s.fontStyle);

  // Apply Theme and Font classes to both root html and body
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    // Remove old theme classes
    root.classList.remove('theme-udh-teal', 'theme-navy-ops', 'theme-clinical-light', 'theme-dark-obsidian');
    body.classList.remove('theme-udh-teal', 'theme-navy-ops', 'theme-clinical-light', 'theme-dark-obsidian');

    // Add active theme class
    root.classList.add(`theme-${theme}`);
    body.classList.add(`theme-${theme}`);

    // Dark/Light mode toggles
    if (theme === 'clinical-light') {
      root.classList.remove('dark');
      body.classList.remove('dark');
      body.classList.remove('bg-slate-950');
      body.classList.add('bg-slate-100');
    } else {
      root.classList.add('dark');
      body.classList.add('dark');
      body.classList.remove('bg-slate-100');
      body.classList.add('bg-slate-950');
    }

    // Font classes
    root.classList.remove('font-prompt', 'font-sarabun', 'font-kanit', 'font-system');
    body.classList.remove('font-prompt', 'font-sarabun', 'font-kanit', 'font-system');
    root.classList.add(`font-${fontStyle}`);
    body.classList.add(`font-${fontStyle}`);
  }, [theme, fontStyle]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        if (e.key === 'Escape') {
          setSearchOpen(false);
        }
        return;
      }

      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        setPlaying(!isPlaying);
      } else if (e.key === '1') {
        setSpeedMultiplier(1);
      } else if (e.key === '2') {
        setSpeedMultiplier(3);
      } else if (e.key === '3') {
        setSpeedMultiplier(8);
      } else if (e.key === '/' || (e.key === 'k' && (e.metaKey || e.ctrlKey))) {
        e.preventDefault();
        setSearchOpen(true);
      } else if (e.key === 'o' || e.key === 'O') {
        setCameraMode('overview');
      } else if (e.key === 'Escape') {
        clearSelection();
        setSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, setPlaying, setSpeedMultiplier, setSearchOpen, setCameraMode, clearSelection]);

  return (
    <div
      className={`relative w-screen h-screen overflow-hidden select-none font-${fontStyle} ${
        theme === 'clinical-light'
          ? 'bg-slate-100 text-slate-900'
          : theme === 'navy-ops'
          ? 'bg-[#050b14] text-slate-100'
          : theme === 'dark-obsidian'
          ? 'bg-[#09090b] text-zinc-100'
          : 'bg-[#041219] text-slate-100'
      }`}
    >
      {/* 1. Main Top Navigation Bar */}
      <TopBar />

      {/* 2. Top-Left Live KPI Dashboard */}
      <KpiDashboard />

      {/* 3. Main 3D WebGL Digital Twin Viewport */}
      <main className="w-full h-full">
        <HospitalCanvas />
      </main>

      {/* 4. Bottom Floating Simulation & Camera Control Dock */}
      <ControlDock />

      {/* 5. Right Slide-in Entity Details Panel */}
      <DetailPanel />

      {/* 6. Lighting & Sun Environment Modal / Panel */}
      <LightingPanel />

      {/* 7. GIS Real Geographic Leaflet Map */}
      <MapPanel />

      {/* 8. Global Search Modal */}
      <SearchModal />

      {/* 9. Privacy, PDPA & Safety Compliance Modal */}
      <PrivacyNotice />

      {/* 10. Front Style, Theme & Thai Font Customizer Modal */}
      <ThemeModal />

      {/* 11. Architectural 3D Concept Master Plan Preview Modal */}
      <ArchitecturalPreviewModal />

      {/* 12. Hospital Real Data Directory & Source Inspector Modal */}
      <DataInspectorModal />
    </div>
  );
}
