import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import {
  X,
  ArrowLeft,
  Building,
  Navigation,
  Phone,
  Layers,
  Search,
  DoorOpen,
  Eye,
  Info,
  Globe,
  Map as MapIcon,
  Filter,
  Check,
  ChevronRight,
  Maximize2,
  SlidersHorizontal,
  Compass,
  Copy,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { HOSPITAL_GEO_COORDS } from '../data/demoHospital';
import { UDH_TELEPHONE_DIRECTORY } from '../data/udhDirectory';
import { REAL_BUILDINGS } from '../data/udhRealData';

type MapViewMode = 'gis' | 'indoor' | 'directory';
type MapBaseLayer = 'dark' | 'satellite' | 'streets';

export const MapPanel: React.FC = () => {
  const isMapOpen = useAppStore((s) => s.isMapOpen);
  const setMapOpen = useAppStore((s) => s.setMapOpen);
  const buildings = useAppStore((s) => s.buildings);
  const rooms = useAppStore((s) => s.rooms);
  const selectObject = useAppStore((s) => s.selectObject);
  const setActiveFloor = useAppStore((s) => s.setActiveFloor);

  const [viewMode, setViewMode] = useState<MapViewMode>('gis');
  const [baseLayer, setBaseLayer] = useState<MapBaseLayer>('satellite');
  const [selectedIndoorBld, setSelectedIndoorBld] = useState<string>('opd');
  const [selectedIndoorFloor, setSelectedIndoorFloor] = useState<number | string>(1);
  const [indoorSearchQuery, setIndoorSearchQuery] = useState<string>('');
  const [indoorCategoryFilter, setIndoorCategoryFilter] = useState<string>('all');

  // GIS Map interactive state
  const [selectedGisBuildingId, setSelectedGisBuildingId] = useState<string | null>(null);
  const [selectedGisFloor, setSelectedGisFloor] = useState<number | string>(1);

  // Mobile GIS View Tab ('map' | 'inspector')
  const [mobileGisTab, setMobileGisTab] = useState<'map' | 'inspector'>('map');
  const [mobileLegendOpen, setMobileLegendOpen] = useState<boolean>(false);

  // Directory state
  const [directorySearch, setDirectorySearch] = useState<string>('');
  const [directoryCategory, setDirectoryCategory] = useState<string>('all');
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

  const handleCopyPhone = (phone: string) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(phone);
    }
    setCopiedPhone(phone);
    setTimeout(() => {
      setCopiedPhone((curr) => (curr === phone ? null : curr));
    }, 2000);
  };

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);
  const polygonMapRef = useRef<Map<string, L.Polygon>>(new Map());

  // Definition of base tile layers
  const TILE_LAYERS: Record<MapBaseLayer, { url: string; attribution: string; maxZoom: number; subdomains?: string }> = {
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      maxZoom: 19,
    },
    dark: {
      url: 'https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 20,
      subdomains: 'abcd',
    },
    streets: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
      subdomains: 'abc',
    },
  };

  // Helper to switch base tile layer on existing map
  const switchBaseLayer = (layerKey: MapBaseLayer) => {
    setBaseLayer(layerKey);
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const cfg = TILE_LAYERS[layerKey];
    const newLayer = L.tileLayer(cfg.url, {
      attribution: cfg.attribution,
      maxZoom: cfg.maxZoom,
      subdomains: cfg.subdomains || 'abc',
    });
    newLayer.addTo(map);
    tileLayerRef.current = newLayer;
  };

  // Open full Indoor Blueprint tab for a specific building & floor
  const openIndoorForBuilding = (buildingId: string, floor: number | string) => {
    setSelectedIndoorBld(buildingId);
    setSelectedIndoorFloor(floor);
    setViewMode('indoor');
  };

  // Invalidate Leaflet map size on mode or mobile tab change
  useEffect(() => {
    if (viewMode === 'gis' && mapInstanceRef.current) {
      const timer = setTimeout(() => {
        mapInstanceRef.current?.invalidateSize();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [viewMode, mobileGisTab]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!isMapOpen || viewMode !== 'gis') return;
    const container = mapContainerRef.current;
    if (!container) return;

    // Clear previous Leaflet instance if any
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Hospital Center Coordinates [lat, lng]
    const centerLatLng: [number, number] = [
      HOSPITAL_GEO_COORDS.lat,
      HOSPITAL_GEO_COORDS.lng,
    ];

    const map = L.map(container, {
      center: centerLatLng,
      zoom: 17,
      minZoom: 15,
      maxZoom: 19,
      zoomControl: true,
      attributionControl: false,
    });
    mapInstanceRef.current = map;

    // Add current tile layer
    const cfg = TILE_LAYERS[baseLayer];
    const tileLayer = L.tileLayer(cfg.url, {
      attribution: cfg.attribution,
      maxZoom: cfg.maxZoom,
      subdomains: cfg.subdomains || 'abc',
    }).addTo(map);
    tileLayerRef.current = tileLayer;

    // Markers group
    const markersGroup = L.layerGroup().addTo(map);
    markersGroupRef.current = markersGroup;
    polygonMapRef.current.clear();

    // Campus boundary polygon
    const campusBoundaryCoords: [number, number][] = [
      [17.4172, 102.7782],
      [17.4174, 102.7818],
      [17.4146, 102.7821],
      [17.4143, 102.7785],
    ];

    L.polygon(campusBoundaryCoords, {
      color: '#0284c7',
      weight: 1.5,
      dashArray: '4, 6',
      fillColor: '#0284c7',
      fillOpacity: 0.04,
    }).addTo(map);

    // Connecting Walkway paths
    const walkwayLines: [number, number][][] = [
      [
        [17.4158, 102.7794],
        [17.4162, 102.7797],
        [17.4162, 102.7806],
      ],
      [
        [17.4158, 102.7794],
        [17.4152, 102.7793],
        [17.4151, 102.7802],
      ],
      [
        [17.4162, 102.7797],
        [17.4152, 102.7793],
      ],
      [
        [17.4162, 102.7806],
        [17.4151, 102.7802],
      ],
    ];

    walkwayLines.forEach((coords) => {
      L.polyline(coords, {
        color: '#fbbf24',
        weight: 3,
        dashArray: '3, 6',
        opacity: 0.8,
      }).addTo(map);
    });

    // Building markers and polygons with real UDH data
    REAL_BUILDINGS.forEach((rb) => {
      const latLngs: [number, number][] = rb.polygon.map(([pLng, pLat]) => [pLat, pLng]);

      // Footprint polygon
      const poly = L.polygon(latLngs, {
        color: rb.color || '#38bdf8',
        weight: 2,
        fillColor: rb.color || '#0284c7',
        fillOpacity: baseLayer === 'satellite' ? 0.35 : 0.28,
      }).addTo(map);

      polygonMapRef.current.set(rb.id, poly);

      poly.bindTooltip(`${rb.name} (${rb.floors.length} ชั้น, ${rb.count} จุดบริการ)`, {
        sticky: true,
        direction: 'top',
      });

      poly.on('click', () => {
        setSelectedGisBuildingId(rb.id);
        setSelectedGisFloor(rb.floors[0] || 1);
        selectObject(rb.id, 'building');
      });

      // Pin marker
      const customIcon = L.divIcon({
        className: 'custom-map-marker',
        html: `
          <div style="background-color: rgba(15, 23, 42, 0.9); backdrop-filter: blur(4px); border: 1.5px solid ${rb.color}; color: ${rb.color}; border-radius: 6px; padding: 2px 6px; font-size: 10px; font-weight: bold; white-space: nowrap; box-shadow: 0 4px 12px rgba(0,0,0,0.8); display: flex; align-items: center; gap: 4px; cursor: pointer;">
            <span style="display: inline-block; width: 7px; height: 7px; border-radius: 50%; background-color: ${rb.color}; box-shadow: 0 0 6px ${rb.color};"></span>
            ${rb.name.length > 15 ? rb.name.slice(0, 14) + '...' : rb.name}
          </div>
        `,
        iconSize: [110, 24],
        iconAnchor: [55, 12],
      });

      const marker = L.marker([rb.center[0], rb.center[1]], { icon: customIcon }).addTo(markersGroup);

      marker.on('click', () => {
        setSelectedGisBuildingId(rb.id);
        setSelectedGisFloor(rb.floors[0] || 1);
        selectObject(rb.id, 'building');
      });
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      tileLayerRef.current = null;
      markersGroupRef.current = null;
      polygonMapRef.current.clear();
    };
  }, [isMapOpen, viewMode, buildings, selectObject]);

  // Highlight selected building polygon on GIS map
  useEffect(() => {
    if (!selectedGisBuildingId || viewMode !== 'gis') return;
    polygonMapRef.current.forEach((poly, bldId) => {
      if (bldId === selectedGisBuildingId) {
        poly.setStyle({ weight: 4, color: '#38bdf8', fillOpacity: 0.6 });
      } else {
        const rb = REAL_BUILDINGS.find((b) => b.id === bldId);
        poly.setStyle({ weight: 2, color: rb?.color || '#38bdf8', fillOpacity: baseLayer === 'satellite' ? 0.35 : 0.28 });
      }
    });
  }, [selectedGisBuildingId, viewMode, baseLayer]);

  // Selected GIS building object
  const activeGisBuilding = useMemo(() => {
    return REAL_BUILDINGS.find((b) => b.id === selectedGisBuildingId) || null;
  }, [selectedGisBuildingId]);

  // Rooms in the selected GIS building and floor
  const activeGisRooms = useMemo(() => {
    if (!selectedGisBuildingId) return [];
    const flrNum = typeof selectedGisFloor === 'number' ? selectedGisFloor : parseInt(String(selectedGisFloor)) || 1;
    return rooms.filter((r) => r.buildingId === selectedGisBuildingId && (r.floor === flrNum || r.floor === selectedGisFloor));
  }, [rooms, selectedGisBuildingId, selectedGisFloor]);

  // Selected Indoor Building object
  const activeIndoorBuilding = useMemo(() => {
    return REAL_BUILDINGS.find((b) => b.id === selectedIndoorBld) || REAL_BUILDINGS[0];
  }, [selectedIndoorBld]);

  // Rooms in the selected Indoor building and floor
  const activeIndoorRooms = useMemo(() => {
    const flrNum = typeof selectedIndoorFloor === 'number' ? selectedIndoorFloor : parseInt(String(selectedIndoorFloor)) || 1;
    let list = rooms.filter(
      (r) => r.buildingId === selectedIndoorBld && (r.floor === flrNum || r.floor === selectedIndoorFloor)
    );

    if (indoorCategoryFilter !== 'all') {
      list = list.filter((r) => r.roomType === indoorCategoryFilter);
    }

    if (indoorSearchQuery.trim()) {
      const q = indoorSearchQuery.trim().toLowerCase();
      list = list.filter((r) => r.name.toLowerCase().includes(q) || r.id.toLowerCase().includes(q));
    }

    return list;
  }, [rooms, selectedIndoorBld, selectedIndoorFloor, indoorCategoryFilter, indoorSearchQuery]);

  // Filtered Telephone Directory
  const filteredDirectory = useMemo(() => {
    const q = directorySearch.trim().toLowerCase();
    return UDH_TELEPHONE_DIRECTORY.filter((entry) => {
      if (directoryCategory !== 'all' && entry.category !== directoryCategory) return false;
      if (!q) return true;
      return (
        entry.nameTh.toLowerCase().includes(q) ||
        entry.nameEn.toLowerCase().includes(q) ||
        entry.buildingName.toLowerCase().includes(q) ||
        entry.telExtension.includes(q) ||
        entry.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [directorySearch, directoryCategory]);

  if (!isMapOpen) return null;

  return (
    <div className="absolute inset-0 z-30 bg-slate-950/95 backdrop-blur-md flex flex-col animate-in fade-in duration-200">
      {/* Top Header */}
      <header className="flex flex-wrap items-center justify-between p-2.5 sm:p-3.5 bg-slate-900 border-b border-slate-800 gap-2 shrink-0">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={() => setMapOpen(false)}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white rounded-lg shadow transition-colors shrink-0 min-h-[36px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">กลับสู่ฉาก 3D</span>
            <span className="inline sm:hidden">3D</span>
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="text-xs sm:text-sm md:text-base font-bold text-white truncate">
                <span className="hidden sm:inline">ระบบแผนที่ GIS และผังอาคาร โรงพยาบาลอุดรธานี</span>
                <span className="inline sm:hidden">UDH GIS & ผังอาคาร</span>
              </h2>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-300 font-mono-numbers border border-teal-500/30 hidden md:inline-block">
                17.4158° N, 102.7798° E
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 truncate hidden xs:block">{HOSPITAL_GEO_COORDS.addressTh}</p>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 border border-slate-800 rounded-xl shrink-0">
          <button
            onClick={() => {
              setViewMode('gis');
              setTimeout(() => mapInstanceRef.current?.invalidateSize(), 100);
            }}
            className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors min-h-[34px] ${
              viewMode === 'gis'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">GIS Map แผนที่</span>
            <span className="inline sm:hidden">GIS</span>
          </button>

          <button
            onClick={() => setViewMode('indoor')}
            className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors min-h-[34px] ${
              viewMode === 'indoor'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">ผังห้องและเลือกชั้น</span>
            <span className="inline sm:hidden">ผังอาคาร</span>
          </button>

          <button
            onClick={() => setViewMode('directory')}
            className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors min-h-[34px] ${
              viewMode === 'directory'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">สมุดโทรศัพท์ UDH</span>
            <span className="inline sm:hidden">โทรศัพท์</span>
          </button>

          <button
            onClick={() => setMapOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors ml-0.5 min-w-[34px] min-h-[34px] flex items-center justify-center"
            title="ปิดหน้าต่างแผนที่"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Mode Body */}
      <div className="flex-1 relative overflow-hidden flex flex-col">
        {/* ================= MODE 1: GIS CAMPUS MAP WITH SATELLITE LAYER ================= */}
        {viewMode === 'gis' && (
          <div className="w-full h-full relative flex flex-col md:flex-row overflow-hidden">
            {/* Mobile Segmented Toggle Bar (GIS Map vs Building Inspector) */}
            <div className="flex md:hidden items-center justify-center p-1.5 bg-slate-950 border-b border-slate-800 shrink-0">
              <div className="flex items-center p-1 bg-slate-900 rounded-xl w-full max-w-sm border border-slate-800 gap-1">
                <button
                  onClick={() => {
                    setMobileGisTab('map');
                    setTimeout(() => mapInstanceRef.current?.invalidateSize(), 100);
                  }}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                    mobileGisTab === 'map'
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>แผนที่ GIS ดาวเทียม</span>
                </button>
                <button
                  onClick={() => setMobileGisTab('inspector')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                    mobileGisTab === 'inspector'
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Building className="w-3.5 h-3.5" />
                  <span>ข้อมูลอาคาร & เลือกชั้น</span>
                  {activeGisBuilding && (
                    <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse ml-0.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Left/Main: Leaflet GIS Map Canvas */}
            <div
              className={`flex-1 h-full relative ${
                mobileGisTab === 'inspector' ? 'hidden md:block' : 'block'
              }`}
            >
              <div ref={mapContainerRef} className="w-full h-full" />

              {/* Floating Layer Control on GIS Map */}
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-1000 bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-xl p-1.5 sm:p-2 shadow-2xl flex items-center gap-1">
                <span className="text-[10px] text-slate-400 px-1 sm:px-2 font-medium hidden sm:flex items-center gap-1">
                  <Layers className="w-3 h-3 text-sky-400" />
                  <span>ชั้นข้อมูล:</span>
                </span>

                <button
                  onClick={() => switchBaseLayer('satellite')}
                  className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                    baseLayer === 'satellite'
                      ? 'bg-emerald-600 text-white font-bold shadow'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">ภาพถ่ายดาวเทียม</span>
                  <span className="inline sm:hidden">ดาวเทียม</span>
                </button>

                <button
                  onClick={() => switchBaseLayer('dark')}
                  className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                    baseLayer === 'dark'
                      ? 'bg-sky-600 text-white font-bold shadow'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <MapIcon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">โหมดกลางคืน</span>
                  <span className="inline sm:hidden">มืด</span>
                </button>

                <button
                  onClick={() => switchBaseLayer('streets')}
                  className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                    baseLayer === 'streets'
                      ? 'bg-sky-600 text-white font-bold shadow'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">แผนที่ถนน</span>
                  <span className="inline sm:hidden">ถนน</span>
                </button>
              </div>

              {/* Floating Bottom Left Campus Legend (Collapsible on mobile) */}
              <div className="hidden sm:block absolute bottom-6 left-6 z-1000 max-w-sm p-3.5 bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-xl shadow-2xl text-xs space-y-2 pointer-events-auto">
                <div className="font-bold text-sky-400 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Navigation className="w-4 h-4" />
                    <span>ผังวิทยาเขตโรงพยาบาลอุดรธานี (GIS)</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono-numbers bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
                    {baseLayer.toUpperCase()} LAYER
                  </span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  คลิกที่อาคารใดก็ได้บนแผนที่เพื่อดูข้อมูลชั้น และรายชื่อห้องบริการทั้งหมดในอาคารนั้น
                </p>
                <div className="flex items-center gap-3 text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 inline-block"></span>
                    ทางเดินเชื่อม Walkways
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block"></span>
                    23 อาคารจริง
                  </span>
                </div>
              </div>

              {/* Floating Mobile Bottom Card when a building is selected */}
              {activeGisBuilding && (
                <div className="md:hidden absolute bottom-3 inset-x-3 z-1000 bg-slate-950/95 backdrop-blur-md border border-sky-500/40 rounded-2xl p-3 shadow-2xl flex items-center justify-between gap-3 animate-in slide-in-from-bottom duration-150">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: activeGisBuilding.color }} />
                      <h4 className="text-xs font-bold text-white truncate">{activeGisBuilding.name}</h4>
                    </div>
                    <p className="text-[11px] text-sky-400 mt-0.5 font-mono-numbers truncate">
                      ชั้น {selectedGisFloor} ({activeGisRooms.length} ห้อง) · รวม {activeGisBuilding.floors.length} ชั้น
                    </p>
                  </div>
                  <button
                    onClick={() => setMobileGisTab('inspector')}
                    className="px-3 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold shrink-0 flex items-center gap-1 shadow-md shadow-sky-600/30 min-h-[36px]"
                  >
                    <span>เลือกชั้น & ดูห้อง</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Right Side: Building & Floor Interactive Inspector Panel */}
            <div
              className={`w-full md:w-96 bg-slate-950/95 md:border-l border-slate-800 flex flex-col h-full shadow-2xl z-10 ${
                mobileGisTab === 'map' ? 'hidden md:flex' : 'flex'
              }`}
            >
              {/* Mobile Back Button to Map */}
              <div className="md:hidden p-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
                <button
                  onClick={() => {
                    setMobileGisTab('map');
                    setTimeout(() => mapInstanceRef.current?.invalidateSize(), 100);
                  }}
                  className="flex items-center gap-1.5 text-xs font-semibold text-sky-400 hover:text-sky-300 py-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>กลับไปดูแผนที่ GIS ดาวเทียม</span>
                </button>
                <span className="text-[11px] text-slate-400 font-mono-numbers">
                  23 อาคาร UDH
                </span>
              </div>

              {/* Inspector Header */}
              <div className="p-3.5 md:p-4 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between shrink-0">
                <div>
                  <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-sky-400" />
                    <span>ข้อมูลอาคารและเลือกชั้น (Floor & Rooms)</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">เลือกอาคารและชั้นเพื่อดูห้องบริการ</p>
                </div>
              </div>

              {/* Building Selector Dropdown */}
              <div className="p-3 border-b border-slate-800/80 bg-slate-900/30 space-y-1.5 shrink-0">
                <label className="text-[11px] text-slate-400 font-medium block">
                  เลือกอาคาร (ทั้งหมด 23 อาคาร):
                </label>
                <select
                  value={selectedGisBuildingId || ''}
                  onChange={(e) => {
                    const id = e.target.value;
                    setSelectedGisBuildingId(id || null);
                    if (id) {
                      const b = REAL_BUILDINGS.find((rb) => rb.id === id);
                      if (b) {
                        setSelectedGisFloor(b.floors[0] || 1);
                        selectObject(id, 'building');
                        // Pan map to center of building
                        if (mapInstanceRef.current) {
                          mapInstanceRef.current.panTo([b.center[0], b.center[1]], { animate: true });
                        }
                      }
                    }
                  }}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-100 text-xs rounded-xl px-3 py-2 outline-none focus:border-sky-500 font-medium min-h-[40px]"
                >
                  <option value="">-- คลิกเลือกอาคารบนแผนที่ หรือเลือกจากรายการนี้ --</option>
                  {REAL_BUILDINGS.map((rb) => (
                    <option key={rb.id} value={rb.id}>
                      {rb.name} ({rb.floors.length} ชั้น, {rb.count} จุดบริการ)
                    </option>
                  ))}
                </select>
              </div>

              {/* Selected Building Details */}
              {activeGisBuilding ? (
                <div className="flex-1 flex flex-col overflow-hidden p-3.5 space-y-3">
                  {/* Building Summary Banner */}
                  <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1.5 shrink-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-sky-400">{activeGisBuilding.name}</span>
                      <span
                        className="w-3 h-3 rounded-full inline-block"
                        style={{ backgroundColor: activeGisBuilding.color }}
                      />
                    </div>
                    <div className="text-[11px] text-slate-300 flex items-center justify-between">
                      <span>รหัส: {activeGisBuilding.id.toUpperCase()}</span>
                      <span>ทั้งหมด {activeGisBuilding.floors.length} ชั้น ({activeGisBuilding.count} จุดบริการ)</span>
                    </div>
                  </div>

                  {/* Floor Selector Pills */}
                  <div className="shrink-0">
                    <div className="flex items-center justify-between pb-1.5">
                      <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
                        <Layers className="w-3 h-3 text-sky-400" />
                        <span>เลือกชั้นที่ต้องการดู:</span>
                      </span>
                      <span className="text-[10px] text-sky-400 font-mono-numbers">
                        ชั้น {selectedGisFloor} จาก {activeGisBuilding.floors.length}
                      </span>
                    </div>

                    <div className="flex gap-1.5 overflow-x-auto no-scrollbar p-1.5 bg-slate-900/60 rounded-xl border border-slate-800/80">
                      {activeGisBuilding.floors.map((flr) => {
                        const isSelected = selectedGisFloor === flr;
                        return (
                          <button
                            key={flr}
                            onClick={() => setSelectedGisFloor(flr)}
                            className={`px-3 py-1.5 text-xs font-mono-numbers rounded-lg font-bold transition-all shrink-0 min-h-[34px] flex items-center justify-center ${
                              isSelected
                                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                            }`}
                          >
                            ชั้น {flr}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Room List on Selected Floor */}
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex items-center justify-between pb-1.5 shrink-0">
                      <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
                        <DoorOpen className="w-3.5 h-3.5 text-emerald-400" />
                        <span>ห้องบริการ ชั้น {selectedGisFloor} ({activeGisRooms.length} ห้อง):</span>
                      </span>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
                      {activeGisRooms.map((rm) => (
                        <div
                          key={rm.id}
                          onClick={() => {
                            selectObject(rm.id, 'room');
                            const flrNum = typeof selectedGisFloor === 'number' ? selectedGisFloor : parseInt(String(selectedGisFloor)) || 1;
                            setActiveFloor(flrNum);
                            setMapOpen(false); // jump straight to 3D!
                          }}
                          className="p-2.5 bg-slate-900/70 hover:bg-slate-800 border border-slate-800 hover:border-sky-500/50 rounded-xl cursor-pointer transition-colors group flex items-start justify-between min-h-[44px]"
                        >
                          <div>
                            <div className="text-xs font-bold text-slate-100 group-hover:text-sky-300 leading-snug">
                              {rm.name}
                            </div>
                            <div className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-2">
                              <span>รหัส {rm.id}</span>
                              <span aria-hidden="true">·</span>
                              <span>ความจุ {rm.capacity}</span>
                            </div>
                          </div>
                          <span className="text-[10px] text-sky-400 group-hover:opacity-100 opacity-70 transition-opacity font-medium shrink-0 ml-2">
                            ดู 3D &rarr;
                          </span>
                        </div>
                      ))}

                      {activeGisRooms.length === 0 && (
                        <div className="py-8 text-center text-slate-500 text-xs">
                          <DoorOpen className="w-6 h-6 mx-auto mb-1.5 text-slate-600" />
                          <span>ไม่พบห้องระบุในชั้นนี้</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom Action: Open Full Indoor Blueprint or 3D */}
                  <div className="pt-2 border-t border-slate-800 flex gap-2 shrink-0">
                    <button
                      onClick={() => openIndoorForBuilding(activeGisBuilding.id, selectedGisFloor)}
                      className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-sky-300 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 min-h-[38px]"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>เปิดแปลนเต็ม</span>
                    </button>

                    <button
                      onClick={() => {
                        selectObject(activeGisBuilding.id, 'building');
                        const flrNum = typeof selectedGisFloor === 'number' ? selectedGisFloor : parseInt(String(selectedGisFloor)) || 1;
                        setActiveFloor(flrNum);
                        setMapOpen(false);
                      }}
                      className="flex-1 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold shadow transition-colors flex items-center justify-center gap-1.5 min-h-[38px]"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>ตัดชั้น F{selectedGisFloor} ใน 3D</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-500 text-xs space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                    <Compass className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-300">คลิกที่อาคารใดก็ได้บนแผนที่</h4>
                    <p className="text-[11px] text-slate-500 mt-1 max-w-[220px]">
                      เพื่อเลือกดูข้อมูลทุกชั้นและรายชื่อห้องบริการทั้งหมดในอาคารนั้น
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= MODE 2: INDOOR FLOORPLAN VIEWER (ALL 23 BUILDINGS & FLOORS) ================= */}
        {viewMode === 'indoor' && (
          <div className="w-full h-full flex flex-col p-3 sm:p-4 md:p-6 overflow-y-auto">
            {/* Building & Floor Selector */}
            <div className="flex flex-col gap-3 pb-3 sm:pb-4 border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-2.5">
                <Building className="w-5 h-5 text-sky-400 shrink-0" />
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-white">
                    ผังอาคารในร่ม (23 อาคารโรงพยาบาลอุดรธานี)
                  </h3>
                  <p className="text-[11px] text-slate-400 hidden sm:block">
                    แปลนห้องบริการ จุดคัดกรอง เวชระเบียน ห้องยา หอผู้ป่วย และห้องตรวจทุกชั้น
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-xs text-slate-400 shrink-0">อาคาร:</span>
                  <select
                    value={selectedIndoorBld}
                    onChange={(e) => {
                      const newBldId = e.target.value;
                      setSelectedIndoorBld(newBldId);
                      const bld = REAL_BUILDINGS.find((b) => b.id === newBldId);
                      if (bld && bld.floors.length > 0) {
                        setSelectedIndoorFloor(bld.floors[0]);
                      } else {
                        setSelectedIndoorFloor(1);
                      }
                    }}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 outline-none font-medium min-h-[40px]"
                  >
                    {REAL_BUILDINGS.map((rb) => (
                      <option key={rb.id} value={rb.id}>
                        {rb.name} ({rb.floors.length} ชั้น, {rb.count} จุดบริการ)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 shrink-0">ชั้น:</span>
                  <div className="flex items-center gap-1 bg-slate-900 p-1 border border-slate-800 rounded-xl overflow-x-auto no-scrollbar max-w-full">
                    {activeIndoorBuilding.floors.map((flr) => {
                      const isSelected = selectedIndoorFloor === flr;
                      return (
                        <button
                          key={flr}
                          onClick={() => setSelectedIndoorFloor(flr)}
                          className={`px-3 py-1.5 text-xs font-mono-numbers rounded-lg font-bold transition-colors shrink-0 min-h-[34px] min-w-[40px] flex items-center justify-center ${
                            isSelected
                              ? 'bg-sky-600 text-white shadow-sm'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          F{flr}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Search and Category Filter Toolbar for Indoor View */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-3 shrink-0">
              <div className="flex items-center gap-2 w-full sm:max-w-sm bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2 text-xs">
                <Search className="w-4 h-4 text-sky-400 shrink-0" />
                <input
                  type="text"
                  value={indoorSearchQuery}
                  onChange={(e) => setIndoorSearchQuery(e.target.value)}
                  placeholder={`ค้นหาห้องในชั้น ${selectedIndoorFloor}...`}
                  className="bg-transparent text-slate-100 placeholder-slate-500 w-full outline-none text-base sm:text-xs"
                />
                {indoorSearchQuery && (
                  <button onClick={() => setIndoorSearchQuery('')} className="text-slate-400 hover:text-white px-1">
                    ล้าง
                  </button>
                )}
              </div>

              {/* Quick Type Filter */}
              <div className="flex items-center gap-1.5 text-xs overflow-x-auto no-scrollbar py-1">
                <span className="text-slate-400 text-[11px] mr-1 hidden sm:flex items-center gap-1">
                  <Filter className="w-3 h-3" />
                  <span>ประเภท:</span>
                </span>
                {[
                  { id: 'all', label: 'ทั้งหมด' },
                  { id: 'consultation', label: 'ห้องตรวจ/คลินิก' },
                  { id: 'ward', label: 'หอผู้ป่วย' },
                  { id: 'er_bay', label: 'ฉุกเฉิน ER' },
                  { id: 'or_suite', label: 'ผ่าตัด OR' },
                  { id: 'icu_bed', label: 'ไอซียู ICU' },
                  { id: 'pharmacy_counter', label: 'ห้องยา' },
                  { id: 'lab_bench', label: 'แล็บ' },
                  { id: 'scan_suite', label: 'เอกซเรย์' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setIndoorCategoryFilter(item.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap min-h-[32px] ${
                      indoorCategoryFilter === item.id
                        ? 'bg-sky-600 text-white font-bold'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Room Cards Grid */}
            <div className="flex-1 overflow-y-auto mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
                {activeIndoorRooms.map((rm) => (
                  <div
                    key={rm.id}
                    onClick={() => {
                      selectObject(rm.id, 'room');
                      const flrNum = typeof selectedIndoorFloor === 'number' ? selectedIndoorFloor : parseInt(String(selectedIndoorFloor)) || 1;
                      setActiveFloor(flrNum);
                      setMapOpen(false);
                    }}
                    className="p-3.5 bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-sky-500/50 rounded-2xl cursor-pointer transition-all flex flex-col justify-between group min-h-[90px]"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono-numbers px-2 py-0.5 rounded bg-slate-800 text-sky-400 border border-slate-700 font-semibold">
                          {rm.id}
                        </span>
                        <h4 className="text-xs font-bold text-slate-100 group-hover:text-sky-300 mt-1.5 leading-snug">
                          {rm.name}
                        </h4>
                      </div>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                          rm.status === 'available'
                            ? 'text-emerald-400 bg-emerald-500/10'
                            : 'text-amber-400 bg-amber-500/10'
                        }`}
                      >
                        {rm.status}
                      </span>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                      <span>ประเภท: {rm.roomType}</span>
                      <span className="text-sky-400 text-xs font-medium group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                        <span>ดูใน 3D</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {activeIndoorRooms.length === 0 && (
                <div className="py-16 text-center text-slate-500 text-xs">
                  <DoorOpen className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                  <span>ไม่พบห้องหรือคลินิกที่ตรงกับเงื่อนไขการค้นหาในชั้นนี้</span>
                </div>
              )}
            </div>

            {/* Bottom Info Bar */}
            <div className="pt-3 mt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-400 shrink-0">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-sky-400 shrink-0" />
                <span>
                  กำลังแสดง {activeIndoorRooms.length} ห้อง ใน {activeIndoorBuilding.name} (ชั้น {selectedIndoorFloor})
                </span>
              </div>
              <button
                onClick={() => {
                  const flrNum = typeof selectedIndoorFloor === 'number' ? selectedIndoorFloor : parseInt(String(selectedIndoorFloor)) || 1;
                  selectObject(activeIndoorBuilding.id, 'building');
                  setActiveFloor(flrNum);
                  setMapOpen(false);
                }}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold shadow transition-colors flex items-center justify-center gap-1.5 min-h-[38px]"
              >
                <Eye className="w-4 h-4" />
                <span>ตัดชั้น F{selectedIndoorFloor} ในฉาก 3D</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= MODE 3: TELEPHONE DIRECTORY ================= */}
        {viewMode === 'directory' && (
          <div className="w-full h-full p-3 sm:p-4 md:p-6 flex flex-col overflow-hidden">
            {/* Search & Category Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-2 w-full sm:max-w-md bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs">
                <Search className="w-4 h-4 text-sky-400 shrink-0" />
                <input
                  type="text"
                  value={directorySearch}
                  onChange={(e) => setDirectorySearch(e.target.value)}
                  placeholder="ค้นหาแผนก หรือเบอร์ต่อภายใน เช่น 1669, 1101, ห้องยา..."
                  className="bg-transparent text-slate-100 placeholder-slate-500 w-full outline-none text-base sm:text-xs"
                />
                {directorySearch && (
                  <button onClick={() => setDirectorySearch('')} className="text-slate-400 hover:text-white px-1">
                    ล้าง
                  </button>
                )}
              </div>

              {/* Category tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs py-1">
                {[
                  { id: 'all', label: 'ทั้งหมด' },
                  { id: 'emergency', label: 'ฉุกเฉิน (1669)' },
                  { id: 'outpatient', label: 'ผู้ป่วยนอก (OPD)' },
                  { id: 'inpatient', label: 'ผู้ป่วยใน (IPD)' },
                  { id: 'diagnostic', label: 'ชันสูตร & แล็บ' },
                  { id: 'support', label: 'บริการสนับสนุน' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setDirectoryCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap min-h-[34px] ${
                      directoryCategory === cat.id
                        ? 'bg-sky-600 text-white font-bold'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Directory Cards Table */}
            <div className="flex-1 overflow-y-auto mt-3 space-y-2">
              {filteredDirectory.map((entry) => (
                <div
                  key={entry.id}
                  className="p-3 sm:p-3.5 bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-sky-500/40 rounded-2xl flex items-center justify-between transition-colors gap-2"
                >
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <h4 className="text-xs font-bold text-slate-100 truncate">{entry.nameTh}</h4>
                        <span className="text-[10px] font-mono-numbers px-2 py-0.5 rounded-md bg-slate-800 text-sky-300 font-semibold border border-slate-700">
                          ต่อ {entry.telExtension}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 truncate">
                        <span>{entry.buildingName}</span>
                        <span aria-hidden="true"> · </span>
                        <span>ชั้น {entry.floor}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 truncate hidden xs:block">{entry.descriptionTh}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    {/* Direct Click-to-call link for mobile */}
                    <a
                      href={`tel:${entry.telExtension.length === 4 ? '042245555,' + entry.telExtension : entry.telExtension}`}
                      className="p-2 sm:px-2.5 sm:py-1.5 text-xs font-semibold bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 rounded-xl transition-colors flex items-center gap-1 min-h-[34px]"
                      title={`โทรต่อ ${entry.telExtension}`}
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span className="hidden xs:inline">โทร</span>
                    </a>

                    {/* Copy Phone Button */}
                    <button
                      onClick={() => handleCopyPhone(entry.telExtension)}
                      className={`px-2 sm:px-2.5 py-1.5 text-xs font-semibold rounded-xl transition-all flex items-center gap-1 min-h-[34px] ${
                        copiedPhone === entry.telExtension
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700'
                      }`}
                      title={`คัดลอกเบอร์ ${entry.telExtension}`}
                    >
                      {copiedPhone === entry.telExtension ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="hidden sm:inline">คัดลอกแล้ว</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 opacity-70" />
                          <span className="hidden sm:inline">คัดลอก</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        selectObject(entry.buildingId, 'building');
                        setActiveFloor(entry.floor);
                        setMapOpen(false);
                      }}
                      className="px-2.5 sm:px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-sky-600 text-sky-300 hover:text-white rounded-xl transition-colors flex items-center gap-1 min-h-[34px]"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">ดูใน 3D</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="pt-2.5 mt-2 border-t border-slate-800 text-[10px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-1 shrink-0">
              <span>* สมุดโทรศัพท์และรายนามแผนกอ้างอิงจากระบบ UDHMapIndoor</span>
              <span>โรงพยาบาลอุดรธานี โทรกลาง 042-245555</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
