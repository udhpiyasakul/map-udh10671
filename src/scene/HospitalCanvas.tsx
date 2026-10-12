import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useAppStore } from '../store/useAppStore';
import { Building, Vehicle, Equipment, Alert } from '../types/hospital';
import {
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Layers,
  Sun,
  Moon,
  Tag,
  Sparkles,
  Compass,
  Eye,
  Crown,
} from 'lucide-react';
import {
  createBuildingMesh,
  createBuildingFloatingLabelSprite,
  updateFloatingLabelsScale,
  MeshUserData,
} from './HospitalBuildings';
import {
  createNongPrajakPark,
  createRoyalMonumentPlaza,
  createMasterHospitalBoulevard,
} from './NongPrajakPark';
import { CameraPresetType } from '../store/useAppStore';

export const HospitalCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Zustand state
  const buildings = useAppStore((s) => s.buildings);
  const equipment = useAppStore((s) => s.equipment);
  const vehicles = useAppStore((s) => s.vehicles);
  const alerts = useAppStore((s) => s.alerts);
  const selectedObjectId = useAppStore((s) => s.selectedObjectId);
  const cameraFocusTarget = useAppStore((s) => s.cameraFocusTarget);
  const activeFloor = useAppStore((s) => s.activeFloor);
  const activeLayer = useAppStore((s) => s.activeLayer);
  const cameraMode = useAppStore((s) => s.cameraMode);
  const autoRotate = useAppStore((s) => s.autoRotate);
  const lighting = useAppStore((s) => s.lighting);
  const isPlaying = useAppStore((s) => s.isPlaying);
  const theme = useAppStore((s) => s.theme);
  const showFloatingLabels = useAppStore((s) => s.showFloatingLabels);
  const toggleFloatingLabels = useAppStore((s) => s.toggleFloatingLabels);
  const setArchitecturalPreviewOpen = useAppStore((s) => s.setArchitecturalPreviewOpen);
  const activeCameraPreset = useAppStore((s) => s.activeCameraPreset);
  const setCameraPreset = useAppStore((s) => s.setCameraPreset);

  // Actions
  const selectObject = useAppStore((s) => s.selectObject);
  const tickSimulation = useAppStore((s) => s.tickSimulation);
  const toggleDayNightMode = useAppStore((s) => s.toggleDayNightMode);

  // State refs for animation loop (prevents scene recreation on state changes)
  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  const tickSimulationRef = useRef(tickSimulation);
  tickSimulationRef.current = tickSimulation;

  const cameraModeRef = useRef(cameraMode);
  cameraModeRef.current = cameraMode;

  const autoRotateRef = useRef(autoRotate);
  autoRotateRef.current = autoRotate;

  const cameraFocusTargetRef = useRef(cameraFocusTarget);
  cameraFocusTargetRef.current = cameraFocusTarget;

  const showFloatingLabelsRef = useRef(showFloatingLabels);
  showFloatingLabelsRef.current = showFloatingLabels;

  // Local state
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);
  const [hoveredBuildingId, setHoveredBuildingId] = useState<string | null>(null);
  const [isWebGLSupported, setIsWebGLSupported] = useState<boolean>(true);
  const [force2DMode, setForce2DMode] = useState<boolean>(false);
  const [svgZoom, setSvgZoom] = useState<number>(1);
  const [svgPan, setSvgPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDraggingSvg, setIsDraggingSvg] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Three.js internal refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  // Lighting refs
  const sunLightRef = useRef<THREE.DirectionalLight | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight | null>(null);
  const emergencyLightRef = useRef<THREE.PointLight | null>(null);

  // Object group refs for dynamic updates
  const buildingsGroupRef = useRef<THREE.Group>(new THREE.Group());
  const floatingLabelsGroupRef = useRef<THREE.Group>(new THREE.Group());
  const floatingLabelSpritesRef = useRef<THREE.Sprite[]>([]);
  const vehiclesGroupRef = useRef<THREE.Group>(new THREE.Group());
  const equipmentGroupRef = useRef<THREE.Group>(new THREE.Group());
  const alertsGroupRef = useRef<THREE.Group>(new THREE.Group());
  const environmentGroupRef = useRef<THREE.Group>(new THREE.Group());
  const duckUpdaterRef = useRef<((timeSec: number) => void) | null>(null);

  // Raycaster & interaction
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2(-999, -999));
  const clickableObjectsRef = useRef<THREE.Object3D[]>([]);

  // Wide panoramic perspective camera animation target (Super-wide panorama)
  const targetCamPos = useRef<THREE.Vector3>(new THREE.Vector3(220, 155, 195));
  const targetCamLook = useRef<THREE.Vector3>(new THREE.Vector3(75, 4, 0));
  const flythroughAngleRef = useRef<number>(0);

  // Mount Three.js Scene: ONLY runs once or when 2D mode changes
  useEffect(() => {
    if (force2DMode) return;
    const container = containerRef.current;
    if (!container) return;

    // Clear any previous child nodes cleanly
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    // Create a brand new canvas element
    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    canvas.style.outline = 'none';
    canvas.style.cursor = 'grab';
    container.appendChild(canvas);
    canvasRef.current = canvas;

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
      });
    } catch (err) {
      console.warn('WebGL context creation failed on hardware, switching to 2.5D Digital Twin view:', err);
    }

    if (!renderer) {
      setIsWebGLSupported(false);
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
      canvasRef.current = null;
      return;
    }

    rendererRef.current = renderer;
    setIsWebGLSupported(true);

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.5, 1800);
    camera.position.set(220, 155, 195);
    cameraRef.current = camera;

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    const controls = new OrbitControls(camera, canvas);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.04;
    controls.minDistance = 15;
    controls.maxDistance = 750;
    controls.target.set(75, 4, 0);

    const isInitialDay = lighting.timeOfDay === 'daytime' || lighting.timeOfDay === 'morning';
    scene.background = new THREE.Color(isInitialDay ? 0x93c5fd : 0x030712);
    // Fog removed completely as requested (เอาหมอกออก) for crystal clear panorama
    scene.fog = null;

    // Setup Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambient);
    ambientLightRef.current = ambient;

    const hemi = new THREE.HemisphereLight(0x93c5fd, 0x1e293b, 0.5);
    scene.add(hemi);
    hemiLightRef.current = hemi;

    const sun = new THREE.DirectionalLight(0xfff7ed, 1.8);
    sun.position.set(90, 110, 80);
    sun.castShadow = true;
    sun.shadow.mapSize.width = 2048;
    sun.shadow.mapSize.height = 2048;
    sun.shadow.camera.near = 10;
    sun.shadow.camera.far = 400;
    sun.shadow.camera.left = -160;
    sun.shadow.camera.right = 160;
    sun.shadow.camera.top = 160;
    sun.shadow.camera.bottom = -160;
    sun.shadow.bias = -0.0005;
    scene.add(sun);
    sunLightRef.current = sun;

    // Emergency backup amber/red point light
    const emergencyLight = new THREE.PointLight(0xef4444, 0, 160);
    emergencyLight.position.set(0, 30, 0);
    scene.add(emergencyLight);
    emergencyLightRef.current = emergencyLight;

    // Add Groups to Scene
    scene.add(environmentGroupRef.current);
    scene.add(buildingsGroupRef.current);
    scene.add(floatingLabelsGroupRef.current);
    scene.add(vehiclesGroupRef.current);
    scene.add(equipmentGroupRef.current);
    scene.add(alertsGroupRef.current);

    // Initial Campus Environment
    rebuildCampusEnvironment(
      environmentGroupRef.current,
      lighting.timeOfDay === 'daytime' || lighting.timeOfDay === 'morning',
      (updater) => {
        duckUpdaterRef.current = updater;
      }
    );

    // Animation Loop
    let lastTime = performance.now();
    let animationFrameId: number;

    const animate = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(animate);

      const deltaMs = currentTime - lastTime;
      lastTime = currentTime;
      const deltaSec = Math.min(deltaMs / 1000, 0.1);

      // Tick simulation engine in store via ref
      if (isPlayingRef.current) {
        tickSimulationRef.current(deltaSec);
      }

      // Animate Nong Prajak Lake, fountains, and Giant Yellow Duck bobbing
      if (duckUpdaterRef.current) {
        duckUpdaterRef.current(currentTime * 0.001);
      }

      // Camera transitions
      const currentCameraMode = cameraModeRef.current;
      const currentFocus = cameraFocusTargetRef.current;

      if (currentCameraMode === 'flythrough') {
        flythroughAngleRef.current += deltaSec * 0.12;
        const radius = 130;
        const camX = Math.cos(flythroughAngleRef.current) * radius;
        const camZ = Math.sin(flythroughAngleRef.current) * radius;
        const camY = 48 + Math.sin(flythroughAngleRef.current * 2) * 12;
        camera.position.lerp(new THREE.Vector3(camX, camY, camZ), 0.04);
        controls.target.lerp(new THREE.Vector3(0, 10, 0), 0.04);
      } else if (currentFocus) {
        const targetPos = new THREE.Vector3(
          currentFocus.position.x,
          currentFocus.position.y,
          currentFocus.position.z
        );
        const targetLook = new THREE.Vector3(
          currentFocus.target.x,
          currentFocus.target.y,
          currentFocus.target.z
        );
        camera.position.lerp(targetPos, 0.06);
        controls.target.lerp(targetLook, 0.06);
      } else if (currentCameraMode === 'overview') {
        camera.position.lerp(targetCamPos.current, 0.05);
        controls.target.lerp(targetCamLook.current, 0.05);
      }

      // Auto-rotate if requested
      if (autoRotateRef.current && currentCameraMode !== 'flythrough') {
        controls.autoRotate = true;
        controls.autoRotateSpeed = 1.0;
      } else {
        controls.autoRotate = false;
      }

      controls.update();

      // Dynamically scale 3D floating labels according to camera zoom distance
      if (camera && showFloatingLabelsRef.current && floatingLabelSpritesRef.current.length > 0) {
        updateFloatingLabelsScale(floatingLabelSpritesRef.current, camera);
      }

      // Blinking aviation obstruction lights on OPD Administration Building rooftop helipad
      const timeSec = currentTime * 0.003;
      buildingsGroupRef.current.children.forEach((bldObj) => {
        const helipad = bldObj.getObjectByName('rooftop-helipad');
        if (helipad) {
          const blink = Math.sin(timeSec * 8) > 0.15;
          helipad.traverse((child) => {
            if (child.name === 'helipad-beacon' && child instanceof THREE.Mesh) {
              (child.material as THREE.MeshStandardMaterial).emissiveIntensity = blink ? 1.6 : 0.15;
            }
          });
        }
      });

      // Flashing alert & emergency beacon indicators
      alertsGroupRef.current.children.forEach((beaconMesh) => {
        const scale = 1 + Math.sin(timeSec * 5) * 0.25;
        beaconMesh.scale.set(scale, scale, scale);
      });

      // Flashing ambulance sirens
      vehiclesGroupRef.current.children.forEach((vehObj) => {
        const siren = vehObj.getObjectByName('siren');
        if (siren && siren instanceof THREE.PointLight) {
          siren.intensity = Math.sin(timeSec * 10) > 0 ? 2.5 : 0.2;
        }
      });

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    // Resize handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (controlsRef.current) {
        controlsRef.current.dispose();
        controlsRef.current = null;
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
        rendererRef.current = null;
      }
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
      canvasRef.current = null;
      sceneRef.current = null;
    };
  }, [force2DMode]);

  // Update Campus Lighting and Environment when lighting settings change
  useEffect(() => {
    if (!rendererRef.current || !sunLightRef.current || !ambientLightRef.current || !hemiLightRef.current) return;

    const {
      timeOfDay,
      sunElevation,
      sunAzimuth,
      sunlightIntensity,
      ambientLightIntensity,
      sceneExposure,
      emergencyLightPreview,
    } = lighting;

    const isDay = timeOfDay === 'daytime' || timeOfDay === 'morning';

    // Rebuild campus ground materials if switching between day and night
    rebuildCampusEnvironment(environmentGroupRef.current, isDay, (updater) => {
      duckUpdaterRef.current = updater;
    });

    const phi = THREE.MathUtils.degToRad(90 - sunElevation);
    const theta = THREE.MathUtils.degToRad(sunAzimuth);
    const sunDist = 140;
    const x = sunDist * Math.sin(phi) * Math.sin(theta);
    const y = Math.max(2, sunDist * Math.cos(phi));
    const z = sunDist * Math.sin(phi) * Math.cos(theta);

    sunLightRef.current.position.set(x, y, z);
    sunLightRef.current.intensity = emergencyLightPreview ? 0.05 : sunlightIntensity;

    ambientLightRef.current.intensity = emergencyLightPreview ? 0.15 : ambientLightIntensity;
    rendererRef.current.toneMappingExposure = emergencyLightPreview ? 0.8 : sceneExposure;

    if (emergencyLightPreview) {
      if (sceneRef.current) {
        sceneRef.current.background = new THREE.Color(0x1a0505);
        sceneRef.current.fog = null;
      }
      if (emergencyLightRef.current) emergencyLightRef.current.intensity = 2.5;
    } else {
      if (emergencyLightRef.current) emergencyLightRef.current.intensity = 0;
      if (sceneRef.current) {
        // Fog removed completely (เอาหมอกออก) for crystal clear panorama
        sceneRef.current.fog = null;
        switch (timeOfDay) {
          case 'morning': {
            const morningColor = theme === 'clinical-light' ? 0xe2e8f0 : theme === 'navy-ops' ? 0x93c5fd : theme === 'dark-obsidian' ? 0x78716c : 0xa7f3d0;
            sceneRef.current.background = new THREE.Color(morningColor);
            sceneRef.current.fog = null;
            sunLightRef.current.color.setHex(0xfef08a);
            hemiLightRef.current.color.setHex(0xfde047);
            hemiLightRef.current.groundColor.setHex(0x64748b);
            break;
          }
          case 'daytime': {
            const dayColor = theme === 'clinical-light' ? 0xdbeafe : theme === 'navy-ops' ? 0x93c5fd : theme === 'dark-obsidian' ? 0x52525b : 0xccfbf1;
            sceneRef.current.background = new THREE.Color(dayColor);
            sceneRef.current.fog = null;
            sunLightRef.current.color.setHex(0xffffff);
            hemiLightRef.current.color.setHex(0xbae6fd);
            hemiLightRef.current.groundColor.setHex(0x334155);
            break;
          }
          case 'evening': {
            const eveColor = theme === 'clinical-light' ? 0xfecdd3 : theme === 'navy-ops' ? 0x1e1b4b : theme === 'dark-obsidian' ? 0x18181b : 0x134e4a;
            sceneRef.current.background = new THREE.Color(eveColor);
            sceneRef.current.fog = null;
            sunLightRef.current.color.setHex(0xf97316);
            hemiLightRef.current.color.setHex(0xfb923c);
            hemiLightRef.current.groundColor.setHex(0x1e1b4b);
            break;
          }
          case 'night': {
            const nightColor = theme === 'clinical-light' ? 0x334155 : theme === 'navy-ops' ? 0x050d1a : theme === 'dark-obsidian' ? 0x050507 : 0x04141c;
            sceneRef.current.background = new THREE.Color(nightColor);
            sceneRef.current.fog = null;
            sunLightRef.current.color.setHex(theme === 'dark-obsidian' ? 0xf59e0b : theme === 'navy-ops' ? 0x38bdf8 : 0x2dd4bf);
            hemiLightRef.current.color.setHex(theme === 'dark-obsidian' ? 0x27272a : theme === 'navy-ops' ? 0x1e293b : 0x134e4a);
            hemiLightRef.current.groundColor.setHex(nightColor);
            break;
          }
        }
      }
    }
  }, [lighting, theme]);

  // Build and render Buildings & 3D Floating Labels
  useEffect(() => {
    const bldGroup = buildingsGroupRef.current;
    const labelGroup = floatingLabelsGroupRef.current;
    bldGroup.clear();
    labelGroup.clear();
    floatingLabelSpritesRef.current = [];

    clickableObjectsRef.current = clickableObjectsRef.current.filter(
      (o) => (o.userData as MeshUserData)?.type !== 'building'
    );

    const isNight = lighting.timeOfDay === 'night';

    buildings.forEach((bld) => {
      const bldObject = createBuildingMesh(bld, selectedObjectId === bld.id, activeLayer, activeFloor, isNight);
      bldGroup.add(bldObject);
      clickableObjectsRef.current.push(bldObject);

      // Add persistent 3D floating label billboard
      if (showFloatingLabels) {
        const labelSprite = createBuildingFloatingLabelSprite(bld, isNight);
        labelGroup.add(labelSprite);
        floatingLabelSpritesRef.current.push(labelSprite);
        clickableObjectsRef.current.push(labelSprite);
      }
    });
  }, [buildings, selectedObjectId, activeLayer, activeFloor, lighting.timeOfDay, showFloatingLabels]);

  // Update dynamic vehicles in 3D
  useEffect(() => {
    const group = vehiclesGroupRef.current;
    group.clear();
    clickableObjectsRef.current = clickableObjectsRef.current.filter(
      (o) => (o.userData as MeshUserData)?.type !== 'vehicle'
    );

    vehicles.forEach((veh) => {
      const vehObj = createVehicleMesh(veh, selectedObjectId === veh.id);
      group.add(vehObj);
      clickableObjectsRef.current.push(vehObj);
    });
  }, [vehicles, selectedObjectId]);

  // Update equipment in 3D
  useEffect(() => {
    const group = equipmentGroupRef.current;
    group.clear();
    clickableObjectsRef.current = clickableObjectsRef.current.filter(
      (o) => (o.userData as MeshUserData)?.type !== 'equipment'
    );

    equipment.forEach((eq) => {
      const eqObj = createEquipmentMesh(eq, selectedObjectId === eq.id);
      group.add(eqObj);
      clickableObjectsRef.current.push(eqObj);
    });
  }, [equipment, selectedObjectId]);

  // Update Alert Beacons in 3D
  useEffect(() => {
    const group = alertsGroupRef.current;
    group.clear();

    alerts
      .filter((a) => a.status === 'active')
      .forEach((alert) => {
        const beacon = createAlertBeacon(alert);
        group.add(beacon);
      });
  }, [alerts]);

  // Track pointer down position and time for tap detection (prevents accidental selection on drag/orbit)
  const pointerDownInfo = useRef<{ x: number; y: number; time: number } | null>(null);

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    pointerDownInfo.current = { x: e.clientX, y: e.clientY, time: Date.now() };
  }, []);

  // Handle pointer up (Tap / Click selection)
  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!pointerDownInfo.current) return;
      const dx = e.clientX - pointerDownInfo.current.x;
      const dy = e.clientY - pointerDownInfo.current.y;
      const dt = Date.now() - pointerDownInfo.current.time;
      const dist = Math.sqrt(dx * dx + dy * dy);
      pointerDownInfo.current = null;

      // If dragged more than 8px or held longer than 600ms, it was an orbit/pan drag, NOT a tap
      if (dist > 8 || dt > 600) return;

      const container = containerRef.current;
      if (!cameraRef.current || !container) return;
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycasterRef.current.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);
      const intersects = raycasterRef.current.intersectObjects(clickableObjectsRef.current, true);

      if (intersects.length > 0) {
        let current: THREE.Object3D | null = intersects[0].object;
        let userData: MeshUserData | null = null;
        while (current && current !== sceneRef.current) {
          if (current.userData && current.userData.type) {
            userData = current.userData as MeshUserData;
            break;
          }
          current = current.parent;
        }

        if (userData && current) {
          const worldPos = new THREE.Vector3();
          current.getWorldPosition(worldPos);

          selectObject(userData.id, userData.type, {
            position: {
              x: worldPos.x + 25,
              y: worldPos.y + 20,
              z: worldPos.z + 30,
            },
            target: {
              x: worldPos.x,
              y: worldPos.y + 2,
              z: worldPos.z,
            },
          });
        }
      }
    },
    [selectObject]
  );

  // Handle pointer move (Hover raycast)
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!cameraRef.current || !container) return;
    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    mouseRef.current.set(x, y);

    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
    const intersects = raycasterRef.current.intersectObjects(clickableObjectsRef.current, true);

    if (intersects.length > 0) {
      let current: THREE.Object3D | null = intersects[0].object;
      let userData: MeshUserData | null = null;
      while (current && current !== sceneRef.current) {
        if (current.userData && current.userData.type) {
          userData = current.userData as MeshUserData;
          break;
        }
        current = current.parent;
      }
      if (userData) {
        setHoveredLabel(userData.name);
        if (canvasRef.current) {
          canvasRef.current.style.cursor = 'pointer';
        }
        return;
      }
    }
    setHoveredLabel(null);
    if (canvasRef.current) {
      canvasRef.current.style.cursor = 'grab';
    }
  }, []);

  // 2.5D SVG Map panning handlers
  const handleSvgMouseDown = (e: React.MouseEvent) => {
    setIsDraggingSvg(true);
    dragStartRef.current = { x: e.clientX - svgPan.x, y: e.clientY - svgPan.y };
  };

  const handleSvgMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingSvg) return;
    setSvgPan({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handleSvgMouseUp = () => {
    setIsDraggingSvg(false);
  };

  // Convert 3D world meters to SVG canvas coordinates
  const worldToSvg = useCallback((x: number, z: number) => {
    const svgX = 500 + x * 2.8;
    const svgY = 400 + z * 2.3;
    return { x: svgX, y: svgY };
  }, []);

  const is2DActive = !isWebGLSupported || force2DMode;
  const isDay = lighting.timeOfDay === 'daytime' || lighting.timeOfDay === 'morning';

  return (
    <div
      ref={containerRef}
      onPointerDown={is2DActive ? undefined : handlePointerDown}
      onPointerUp={is2DActive ? undefined : handlePointerUp}
      onPointerMove={is2DActive ? undefined : handlePointerMove}
      className={`relative w-full h-full overflow-hidden select-none transition-colors duration-500 ${
        isDay ? 'bg-sky-200' : 'bg-slate-950'
      }`}
    >
      {/* 2.5D Interactive Campus Digital Twin (Active when WebGL is unavailable or in safe mode) */}
      {is2DActive && (
        <div
          className={`absolute inset-0 w-full h-full overflow-hidden cursor-move transition-colors duration-500 ${
            isDay ? 'bg-slate-100 text-slate-800' : 'bg-slate-950 text-slate-100'
          }`}
          onMouseDown={handleSvgMouseDown}
          onMouseMove={handleSvgMouseMove}
          onMouseUp={handleSvgMouseUp}
          onMouseLeave={handleSvgMouseUp}
        >
          {/* Subtle Grid Pattern */}
          <div
            className={`absolute inset-0 [background-size:24px_24px] pointer-events-none ${
              isDay
                ? 'bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] opacity-60'
                : 'bg-[radial-gradient(#1e293b_1px,transparent_1px)] opacity-40'
            }`}
          />

          {/* SVG Campus Layout */}
          <svg
            className="w-full h-full"
            viewBox="0 0 1000 800"
            style={{
              transform: `translate(${svgPan.x}px, ${svgPan.y}px) scale(${svgZoom})`,
              transformOrigin: 'center center',
              transition: isDraggingSvg ? 'none' : 'transform 0.15s ease-out',
            }}
          >
            <defs>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Campus Boundary Outline */}
            <rect
              x="50"
              y="40"
              width="738"
              height="720"
              rx="20"
              fill={isDay ? '#f8fafc' : '#080e1a'}
              stroke="#0284c7"
              strokeWidth="1.5"
              strokeDasharray="6 6"
              opacity={isDay ? '0.7' : '0.35'}
            />

            {/* Master North-South Boulevard (ถนนเพาะนิยม/โพธิ์ศรี วิ่งผ่านหน้าเวชกรรมสังคม, OPD, 96ปี) */}
            <rect
              x="790"
              y="20"
              width="36"
              height="760"
              rx="4"
              fill={isDay ? '#334155' : '#1e293b'}
            />
            {/* Boulevard Central Median */}
            <rect
              x="806"
              y="20"
              width="4"
              height="760"
              fill="#10b981"
            />
            {/* Road Yellow Dashed Lane Dividers */}
            <line
              x1="798"
              y1="20"
              x2="798"
              y2="780"
              stroke="#eab308"
              strokeWidth="1.8"
              strokeDasharray="8 8"
            />
            <line
              x1="816"
              y1="20"
              x2="816"
              y2="780"
              stroke="#eab308"
              strokeWidth="1.8"
              strokeDasharray="8 8"
            />

            {/* Royal Monument Plaza in front of Old OPD (ลานพระรูปหน้าตึก OPD เก่า) */}
            <g transform="translate(707, 648)">
              <rect x="-32" y="-30" width="64" height="60" rx="8" fill={isDay ? '#ffffff' : '#1e293b'} stroke="#f59e0b" strokeWidth="2" />
              <rect x="-26" y="-24" width="52" height="48" rx="6" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
              <circle cx="0" cy="-2" r="12" fill="#fbbf24" fillOpacity="0.3" />
              <text x="0" y="2" textAnchor="middle" fontSize="13">👑</text>
              <text x="0" y="18" textAnchor="middle" fontSize="6.5" fontWeight="bold" fill="#78350f">
                ลานพระรูป (OPD เก่า)
              </text>
            </g>

            {/* Nong Prajak Public Park & Lake (สวนสาธารณะหนองประจักษ์ศิลปาคม ฝั่งตรงข้าม รพ.) */}
            {/* Park Greenery Lawn */}
            <rect
              x="830"
              y="40"
              width="155"
              height="720"
              rx="16"
              fill={isDay ? '#2d5a37' : '#0c2014'}
              opacity="0.9"
            />
            {/* Blue Tartan Running Track (ลู่วิ่งริมหนองประจักษ์) */}
            <rect
              x="838"
              y="55"
              width="14"
              height="690"
              rx="7"
              fill="#0284c7"
            />
            {/* Lake Water Body */}
            <rect
              x="858"
              y="55"
              width="125"
              height="690"
              rx="18"
              fill={isDay ? '#0ea5e9' : '#0369a1'}
              fillOpacity="0.88"
            />
            {/* Water Ripple Waves */}
            <path
              d="M 830 180 Q 860 170 890 180 T 950 180 M 830 320 Q 860 310 890 320 T 950 320 M 830 540 Q 860 530 890 540 T 950 540"
              stroke="#bae6fd"
              strokeWidth="1.5"
              strokeDasharray="4 6"
              fill="none"
              opacity="0.6"
            />

            {/* Iconic Giant Yellow Duck Landmark (เป็ดเหลือง หนองประจักษ์) */}
            <g transform="translate(885, 360)" className="cursor-pointer">
              <ellipse cx="0" cy="8" rx="28" ry="12" fill="#0284c7" fillOpacity="0.4" />
              <ellipse cx="0" cy="0" rx="24" ry="18" fill="#facc15" stroke="#ca8a04" strokeWidth="2" />
              {/* Duck Head */}
              <circle cx="-12" cy="-14" r="14" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
              {/* Orange Beak */}
              <polygon points="-24,-14 -34,-11 -24,-8" fill="#f97316" />
              {/* Eye */}
              <circle cx="-16" cy="-17" r="2.5" fill="#0f172a" />
              {/* Wing */}
              <ellipse cx="6" cy="-2" rx="12" ry="7" fill="#eab308" />
              {/* Plaque label */}
              <rect x="-42" y="24" width="84" height="18" rx="5" fill="#0f172a" fillOpacity="0.9" stroke="#facc15" strokeWidth="1" />
              <text x="0" y="36" textAnchor="middle" fill="#facc15" fontSize="8" fontWeight="bold">
                เป็ดเหลืองหนองประจักษ์
              </text>
            </g>

            {/* Campus Loop Roads */}
            <path
              d="M 680 515 L 400 515 L 400 240 L 680 240"
              fill="none"
              stroke={isDay ? '#94a3b8' : '#1e293b'}
              strokeWidth="16"
              strokeLinejoin="round"
            />
            <path
              d="M 220 515 L 220 320 L 400 320"
              fill="none"
              stroke={isDay ? '#94a3b8' : '#1e293b'}
              strokeWidth="14"
              strokeLinejoin="round"
            />

            {/* Connecting Skywalks */}
            <line x1="620" y1="460" x2="430" y2="560" stroke="#0284c7" strokeWidth="6" strokeOpacity="0.7" strokeDasharray="4 4" />
            <line x1="430" y1="230" x2="520" y2="280" stroke="#0284c7" strokeWidth="6" strokeOpacity="0.7" strokeDasharray="4 4" />

            {/* 23 Real Buildings Footprints */}
            {buildings.map((b) => {
              const svgCoord = worldToSvg(b.position.x, b.position.z);
              const isSelected = selectedObjectId === b.id;
              const isHovered = hoveredBuildingId === b.id;
              const w = Math.max(34, b.size.width * 1.5);
              const h = Math.max(28, b.size.depth * 1.5);
              const occRate = b.currentOccupancy / b.totalCapacity;

              let fillColor = b.color || '#0284c7';
              if (activeLayer === 'heatmap') {
                fillColor = occRate > 0.88 ? '#ef4444' : occRate > 0.75 ? '#f59e0b' : '#10b981';
              }

              return (
                <g
                  key={b.id}
                  transform={`translate(${svgCoord.x}, ${svgCoord.y})`}
                  className="cursor-pointer transition-transform"
                  onClick={(e) => {
                    e.stopPropagation();
                    selectObject(b.id, 'building');
                  }}
                  onMouseEnter={() => {
                    setHoveredBuildingId(b.id);
                    setHoveredLabel(b.nameTh);
                  }}
                  onMouseLeave={() => {
                    setHoveredBuildingId(null);
                    setHoveredLabel(null);
                  }}
                >
                  {/* Building Base Shadow */}
                  <rect
                    x={-w / 2 + 4}
                    y={-h / 2 + 4}
                    width={w}
                    height={h}
                    rx="8"
                    fill="#000000"
                    opacity={isDay ? '0.2' : '0.4'}
                  />

                  {/* Building Body */}
                  <rect
                    x={-w / 2}
                    y={-h / 2}
                    width={w}
                    height={h}
                    rx="8"
                    fill={fillColor}
                    fillOpacity={isSelected ? 0.95 : isHovered ? 0.85 : 0.75}
                    stroke={isSelected ? '#38bdf8' : isHovered ? '#ffffff' : isDay ? '#94a3b8' : '#334155'}
                    strokeWidth={isSelected ? 3 : 1.5}
                    filter={isSelected ? 'url(#glow)' : undefined}
                  />

                  {/* Floors Badge */}
                  <rect
                    x={w / 2 - 24}
                    y={-h / 2 + 4}
                    width="20"
                    height="14"
                    rx="3"
                    fill={isDay ? '#ffffff' : '#0f172a'}
                    fillOpacity="0.85"
                  />
                  <text
                    x={w / 2 - 14}
                    y={-h / 2 + 15}
                    textAnchor="middle"
                    fill={isDay ? '#0284c7' : '#94a3b8'}
                    fontSize="9"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    F{b.floorCount}
                  </text>

                  {/* Building Label */}
                  <text
                    x="0"
                    y="2"
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize={w > 60 ? '11' : '9'}
                    fontWeight="bold"
                    fontFamily="sans-serif"
                    className="pointer-events-none drop-shadow"
                  >
                    {b.nameTh.length > 18 ? b.nameTh.slice(0, 16) + '...' : b.nameTh}
                  </text>

                  {/* Occupancy Indicator */}
                  <text
                    x="0"
                    y="16"
                    textAnchor="middle"
                    fill={isDay ? '#f8fafc' : '#bae6fd'}
                    fontSize="8"
                    fontWeight="500"
                    fontFamily="monospace"
                    className="pointer-events-none"
                  >
                    {b.currentOccupancy}/{b.totalCapacity} คน
                  </text>
                </g>
              );
            })}

            {/* Animated Vehicles on 2.5D Campus */}
            {vehicles.map((v) => {
              const svgCoord = worldToSvg(v.position.x, v.position.z);
              const isAmb = v.vehicleType === 'ambulance';
              const isAgv = v.vehicleType === 'agv_cart';

              return (
                <g
                  key={v.id}
                  transform={`translate(${svgCoord.x}, ${svgCoord.y})`}
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    selectObject(v.id, 'vehicle');
                  }}
                  onMouseEnter={() => setHoveredLabel(v.name)}
                  onMouseLeave={() => setHoveredLabel(null)}
                >
                  <circle
                    r={isAmb ? 10 : 8}
                    fill={isAmb ? '#ef4444' : isAgv ? '#0284c7' : '#10b981'}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    className={isAmb ? 'animate-pulse' : ''}
                  />
                  <text
                    x="0"
                    y="3"
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="8"
                    fontWeight="bold"
                  >
                    {isAmb ? 'EMS' : isAgv ? 'AGV' : 'EV'}
                  </text>
                </g>
              );
            })}

            {/* Active Alert Pulses */}
            {alerts
              .filter((a) => a.status === 'active')
              .map((alert) => {
                const targetBld = buildings.find((b) => b.id === alert.zoneId) || buildings[0];
                const svgCoord = worldToSvg(targetBld.position.x, targetBld.position.z);

                return (
                  <g
                    key={alert.id}
                    transform={`translate(${svgCoord.x}, ${svgCoord.y - 24})`}
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      selectObject(alert.id, 'alert');
                    }}
                  >
                    <circle r="12" fill="#ef4444" fillOpacity="0.4" className="animate-ping" />
                    <circle r="7" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
                  </g>
                );
              })}
          </svg>

          {/* 2.5D View Controls */}
          <div className="absolute top-18 right-4 flex flex-col gap-2 z-20">
            <button
              onClick={() => setSvgZoom((z) => Math.min(2.5, z + 0.2))}
              className="p-2 rounded-lg bg-slate-900/90 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors shadow-lg"
              title="ซูมเข้า"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSvgZoom((z) => Math.max(0.6, z - 0.2))}
              className="p-2 rounded-lg bg-slate-900/90 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors shadow-lg"
              title="ซูมออก"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setSvgZoom(1);
                setSvgPan({ x: 0, y: 0 });
              }}
              className="p-2 rounded-lg bg-slate-900/90 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors shadow-lg"
              title="รีเซ็ตมุมมอง"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Quick Camera Preset Toolbar (Top Center) */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20 hidden md:flex items-center gap-1.5 p-1 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl shadow-2xl">
        <button
          onClick={() => setCameraPreset('panorama')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activeCameraPreset === 'panorama'
              ? 'bg-sky-500 text-white shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
          title="วิวกว้างพาโนรามา: วิวรวมโรงพยาบาลอุดรธานี ถนนใหญ่ และหนองประจักษ์"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>วิวกว้างพาโนรามา</span>
        </button>

        <button
          onClick={() => setCameraPreset('hospital')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activeCameraPreset === 'hospital'
              ? 'bg-sky-500 text-white shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
          title="ผังรวมโรงพยาบาลอุดรธานี 23 อาคาร"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>ผังโรงพยาบาล</span>
        </button>

        <button
          onClick={() => setCameraPreset('plaza')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activeCameraPreset === 'plaza'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
          title="ลานพระอนุสาวรีย์ กรมหลวงประจักษ์ศิลปาคม & ตึกอำนวยการ"
        >
          <Crown className="w-3.5 h-3.5 text-amber-300" />
          <span>ลานพระรูป</span>
        </button>

        <button
          onClick={() => setCameraPreset('duck')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activeCameraPreset === 'duck'
              ? 'bg-yellow-400 text-slate-950 font-bold shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
          title="หนองประจักษ์ & เป็ดเหลืองยักษ์แลนด์มาร์ก"
        >
          <span className="text-sm leading-none">🦆</span>
          <span>หนองประจักษ์</span>
        </button>

        <button
          onClick={() => setCameraPreset('helipad')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activeCameraPreset === 'helipad'
              ? 'bg-rose-500 text-white shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
          title="ลานจอดเฮลิคอปเตอร์ฉุกเฉินบนดาดฟ้า ตึกอำนวยการ"
        >
          <span className="text-sm leading-none">🚁</span>
          <span>ลาน ฮ. ดาดฟ้า</span>
        </button>
      </div>

      {/* Floating Controls: Mode Switcher, Labels Toggle, Preview & Day/Night Toggle (Top Right) */}
      <div className="absolute top-16 right-4 z-20 flex items-center gap-2">
        {/* Architectural 3D Preview Modal Toggle */}
        <button
          onClick={() => setArchitecturalPreviewOpen(true)}
          className="px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 shadow-lg backdrop-blur-md bg-emerald-500/20 border-emerald-400/50 text-emerald-300 hover:bg-emerald-500/30 transition-all"
          title="ดูแบบจำลองผังสถาปัตยกรรม 3D (Architectural Preview)"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">ตัวอย่างผัง 3D</span>
        </button>

        {/* 3D Floating Labels Toggle */}
        <button
          onClick={toggleFloatingLabels}
          className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 shadow-lg backdrop-blur-md transition-all ${
            showFloatingLabels
              ? 'bg-sky-500/20 border-sky-400/50 text-sky-300 hover:bg-sky-500/30'
              : 'bg-slate-900/90 border-slate-700 text-slate-400 hover:text-white'
          }`}
          title={showFloatingLabels ? 'ป้ายชื่ออาคาร 3D: แสดงค้างตลอดเวลา' : 'ป้ายชื่ออาคาร 3D: ซ่อน'}
        >
          <Tag className="w-3.5 h-3.5 text-sky-400" />
          <span className="hidden sm:inline">ป้ายชื่อ 3D</span>
          <span className={`w-1.5 h-1.5 rounded-full ${showFloatingLabels ? 'bg-sky-400' : 'bg-slate-500'}`} />
        </button>

        {/* Quick Day / Night Toggle */}
        <button
          onClick={toggleDayNightMode}
          className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 shadow-lg backdrop-blur-md transition-all ${
            isDay
              ? 'bg-amber-500/20 border-amber-500/40 text-amber-900 font-bold hover:bg-amber-500/30'
              : 'bg-slate-900/90 border-indigo-500/40 text-indigo-300 hover:bg-slate-800'
          }`}
          title={isDay ? 'สลับไปยังโหมดกลางคืน (Night Mode)' : 'สลับไปยังโหมดกลางวัน (Day Mode)'}
        >
          {isDay ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>โหมดกลางวัน</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400" />
              <span>โหมดกลางคืน</span>
            </>
          )}
        </button>

        {/* 3D vs 2.5D Mode Switcher */}
        {!isWebGLSupported ? (
          <div className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2 shadow-lg backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span>2.5D Safe Twin</span>
            <button
              onClick={() => {
                setIsWebGLSupported(true);
                setForce2DMode(false);
              }}
              className="ml-2 text-sky-400 hover:underline font-semibold"
            >
              เปิด 3D
            </button>
          </div>
        ) : (
          <button
            onClick={() => setForce2DMode(!force2DMode)}
            className="px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700 text-slate-300 hover:text-sky-300 text-xs font-medium flex items-center gap-1.5 shadow-lg backdrop-blur-md transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-sky-400" />
            <span>{force2DMode ? 'สลับสู่ 3D WebGL' : 'สลับสู่ 2.5D Twin'}</span>
          </button>
        )}
      </div>

      {/* Hover tooltip HUD */}
      {hoveredLabel && (
        <div className="pointer-events-none absolute bottom-16 left-1/2 -translate-x-1/2 px-4 py-2 bg-slate-900/90 backdrop-blur-md border border-sky-500/40 text-sky-300 text-xs font-semibold rounded-lg shadow-xl tracking-wide flex items-center gap-2 z-20 animate-in fade-in duration-150">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span>{hoveredLabel}</span>
          <span className="text-slate-400 font-normal">· คลิกเพื่อเปิดแผงข้อมูล</span>
        </div>
      )}
    </div>
  );
};

// ==========================================
// PROCEDURAL PROCEDURES FOR 3D HOSPITAL ASSETS
// ==========================================

// Helper to create architectural floor texture with clean concrete pavers and walkway grid lines
function createArchitecturalGroundTexture(isDay: boolean): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // Pure architectural off-white / light concrete surface
    ctx.fillStyle = isDay ? '#f8fafc' : '#0f172a';
    ctx.fillRect(0, 0, 512, 512);

    // Subtle concrete texture noise
    ctx.fillStyle = isDay ? 'rgba(203, 213, 225, 0.22)' : 'rgba(30, 41, 59, 0.35)';
    for (let i = 0; i < 350; i++) {
      const rx = (i * 47) % 512;
      const ry = (i * 79) % 512;
      ctx.fillRect(rx, ry, 2, 2);
    }

    // Concrete slab expansion joints (Modular grid lines every 64px)
    ctx.strokeStyle = isDay ? 'rgba(203, 213, 225, 0.85)' : 'rgba(51, 65, 85, 0.65)';
    ctx.lineWidth = 1.8;
    for (let i = 0; i <= 512; i += 64) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 512);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(512, i);
      ctx.stroke();
    }

    // Secondary interlocking paver block outlines (Subtle 32px paver tiles)
    ctx.strokeStyle = isDay ? 'rgba(226, 232, 240, 0.75)' : 'rgba(30, 41, 59, 0.5)';
    ctx.lineWidth = 1.0;
    for (let i = 32; i < 512; i += 64) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 512);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(512, i);
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(16, 24);
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

function rebuildCampusEnvironment(
  envGroup: THREE.Group,
  isDay: boolean,
  onNongPrajakCreated?: (updater: (timeSec: number) => void) => void
) {
  envGroup.clear();

  // 1. Master Architectural Ground Plane (Clean light presentation tone / white architectural table)
  const masterGroundGeo = new THREE.PlaneGeometry(860, 860);
  const masterGroundMat = new THREE.MeshStandardMaterial({
    color: isDay ? 0xe2e8f0 : 0x090e17,
    roughness: 0.85,
    metalness: 0.05,
  });
  const masterGround = new THREE.Mesh(masterGroundGeo, masterGroundMat);
  masterGround.rotation.x = -Math.PI / 2;
  masterGround.receiveShadow = true;
  envGroup.add(masterGround);

  // 1.1 Hospital Campus White Concrete Podium / Apron Base (พื้นโทนขาวสถาปัตยกรรม ลายเส้นบล็อกทางเดิน)
  const campusTexture = createArchitecturalGroundTexture(isDay);
  const campusBaseGeo = new THREE.BoxGeometry(208, 0.18, 420);
  const campusBaseMat = new THREE.MeshStandardMaterial({
    color: isDay ? 0xf8fafc : 0x1e293b, // Bright white architectural concrete tone
    map: campusTexture,
    roughness: 0.32,
    metalness: 0.08,
  });
  const campusBase = new THREE.Mesh(campusBaseGeo, campusBaseMat);
  campusBase.position.set(3, 0.09, 0);
  campusBase.receiveShadow = true;
  envGroup.add(campusBase);

  // Crisp architectural perimeter curb along eastern boulevard edge
  const curbMat = new THREE.MeshStandardMaterial({
    color: isDay ? 0xcbd5e1 : 0x334155,
    roughness: 0.4,
  });
  const curbEast = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.32, 420), curbMat);
  curbEast.position.set(107, 0.16, 0);
  envGroup.add(curbEast);

  // 2. Main North-South Hospital Boulevard (ถนนเพาะนิยม/โพธิ์ศรี)
  // Accurately running North-South along X = +126, spanning from Z = +230 to Z = -230
  // Directly passes in front of:
  // - ตึกเวชกรรมสังคม (bldg-social-med, Z ≈ +138)
  // - อาคารผู้ป่วยนอกเดิม และ ลานพระรูป (bldg-opd-old & plaza, Z ≈ +108)
  // - อาคารผู้ป่วยนอกและอำนวยการ (opd, Z ≈ +50)
  // - อาคารสูติ-นรีเวชกรรม (bldg-obgyn, Z ≈ -96)
  // - อาคาร 96 ปี หลวงตามหาบัว (bldg-96y, Z ≈ -140)
  const boulevard = createMasterHospitalBoulevard(isDay);
  envGroup.add(boulevard);

  // 3. Royal Monument Plaza (ลานพระรูปหน้าตึก OPD เก่า)
  // Situated at X = 74, Z = 108 directly in front of Old OPD building
  const royalPlaza = createRoyalMonumentPlaza(isDay);
  envGroup.add(royalPlaza);

  // 4. Nong Prajak Public Park & Lake (สวนสาธารณะหนองประจักษ์ศิลปาคม)
  // Positioned directly opposite the hospital on the East/Right side of the main boulevard (X >= 146)
  // Features spacious lake waters, tartan running track, and iconic Giant Yellow Duck landmark
  const nongPrajak = createNongPrajakPark(isDay);
  envGroup.add(nongPrajak.group);
  if (onNongPrajakCreated) {
    onNongPrajakCreated(nongPrajak.updateAnimation);
  }

  // 5. Hospital Grand Entrance Gateway (ซุ้มประตูทางเข้าหลักโรงพยาบาลอุดรธานี)
  const archGroup = new THREE.Group();
  archGroup.position.set(107, 0, 51);
  archGroup.rotation.y = Math.PI / 2; // Facing the boulevard

  const pierGeo = new THREE.BoxGeometry(2.4, 9.5, 2.4);
  const pierMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.3,
    metalness: 0.1,
  });

  const leftPier = new THREE.Mesh(pierGeo, pierMat);
  leftPier.position.set(-14, 4.75, 0);
  leftPier.castShadow = true;
  archGroup.add(leftPier);

  const rightPier = new THREE.Mesh(pierGeo, pierMat);
  rightPier.position.set(14, 4.75, 0);
  rightPier.castShadow = true;
  archGroup.add(rightPier);

  const beamGeo = new THREE.BoxGeometry(31, 1.8, 2.2);
  const beamMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.4,
    metalness: 0.7,
  });
  const beam = new THREE.Mesh(beamGeo, beamMat);
  beam.position.set(0, 8.8, 0);
  beam.castShadow = true;
  archGroup.add(beam);

  const signGeo = new THREE.PlaneGeometry(24, 1.1);
  const signMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x0284c7,
    emissiveIntensity: isDay ? 0.2 : 0.9,
  });
  const signMesh = new THREE.Mesh(signGeo, signMat);
  signMesh.position.set(0, 8.8, 1.12);
  archGroup.add(signMesh);

  envGroup.add(archGroup);

  // 6. Hospital Internal Campus Loop Roads & Drop-off Drives (Clean Architectural Slate)
  const roadMat = new THREE.MeshStandardMaterial({
    color: isDay ? 0x475569 : 0x1e293b,
    roughness: 0.65,
  });

  // West Loop Road (North-South through heart of campus)
  const loopRoad1 = new THREE.Mesh(new THREE.PlaneGeometry(12, 320), roadMat);
  loopRoad1.rotation.x = -Math.PI / 2;
  loopRoad1.position.set(2, 0.1, 0);
  loopRoad1.receiveShadow = true;
  envGroup.add(loopRoad1);

  // Far West Loop Road
  const loopRoad2 = new THREE.Mesh(new THREE.PlaneGeometry(12, 320), roadMat);
  loopRoad2.rotation.x = -Math.PI / 2;
  loopRoad2.position.set(-52, 0.1, 0);
  loopRoad2.receiveShadow = true;
  envGroup.add(loopRoad2);

  // Cross Connector Roads (East-West)
  const crossRoad1 = new THREE.Mesh(new THREE.PlaneGeometry(160, 12), roadMat);
  crossRoad1.rotation.x = -Math.PI / 2;
  crossRoad1.position.set(26, 0.1, 51);
  crossRoad1.receiveShadow = true;
  envGroup.add(crossRoad1);

  const crossRoad2 = new THREE.Mesh(new THREE.PlaneGeometry(160, 12), roadMat);
  crossRoad2.rotation.x = -Math.PI / 2;
  crossRoad2.position.set(26, 0.1, -70);
  crossRoad2.receiveShadow = true;
  envGroup.add(crossRoad2);

  // 7. Connecting Elevated Pedestrian Skywalk Bridges between Hospital Buildings
  const skywalkMat = new THREE.MeshStandardMaterial({
    color: isDay ? 0x94a3b8 : 0x0284c7,
    roughness: 0.2,
    metalness: 0.8,
    transparent: true,
    opacity: 0.85,
    emissive: isDay ? 0x000000 : 0x0284c7,
    emissiveIntensity: isDay ? 0 : 0.45,
  });

  // Skywalk Bridge 1: OPD Building to EXCELLENT CENTER
  const bridge1Geo = new THREE.BoxGeometry(98, 3.0, 3.4);
  const bridge1 = new THREE.Mesh(bridge1Geo, skywalkMat);
  bridge1.position.set(18, 11.5, 74);
  bridge1.rotation.y = 0.50;
  envGroup.add(bridge1);

  // Skywalk Bridge 2: Building 69Y to Surgery Building
  const bridge2Geo = new THREE.BoxGeometry(46, 2.8, 3.4);
  const bridge2 = new THREE.Mesh(bridge2Geo, skywalkMat);
  bridge2.position.set(2, 12.5, -74);
  bridge2.rotation.y = 1.48;
  envGroup.add(bridge2);

  // 8. Internal Campus Streetlights & Garden Foliage
  const internalLamps: [number, number][] = [
    [26, 40], [26, 0], [26, -40], [26, -80], [26, -120],
    [-38, 40], [-38, 0], [-38, -40], [-38, -80], [-38, -120],
    [50, 80], [50, 110], [50, -120],
  ];

  const inPostGeo = new THREE.CylinderGeometry(0.18, 0.24, 5.8, 8);
  const inPostMat = new THREE.MeshStandardMaterial({ color: isDay ? 0x64748b : 0x1e293b, metalness: 0.8 });
  const inLanternGeo = new THREE.SphereGeometry(0.65, 8, 8);
  const inLanternMat = new THREE.MeshStandardMaterial({
    color: isDay ? 0xf8fafc : 0xfef08a,
    emissive: isDay ? 0x000000 : 0xfef08a,
    emissiveIntensity: isDay ? 0 : 0.95,
  });

  internalLamps.forEach(([lx, lz]) => {
    const post = new THREE.Mesh(inPostGeo, inPostMat);
    post.position.set(lx, 2.9, lz);
    envGroup.add(post);

    const lantern = new THREE.Mesh(inLanternGeo, inLanternMat);
    lantern.position.set(lx, 5.8, lz);
    envGroup.add(lantern);
  });

  // Internal campus garden trees
  const inTrees: [number, number][] = [
    [10, 15], [35, 85], [-15, -20], [-60, 20], [-60, -60],
    [45, -25], [70, -45], [45, 130], [-10, 130],
  ];

  const inTrunkGeo = new THREE.CylinderGeometry(0.28, 0.42, 3.6, 6);
  const inTrunkMat = new THREE.MeshStandardMaterial({ color: 0x452b14, roughness: 0.9 });
  const inFoliageGeo = new THREE.DodecahedronGeometry(2.5);
  const inFoliageMat = new THREE.MeshStandardMaterial({
    color: isDay ? 0x15803d : 0x052e16,
    roughness: 0.8,
  });

  inTrees.forEach(([tx, tz], i) => {
    const trunk = new THREE.Mesh(inTrunkGeo, inTrunkMat);
    trunk.position.set(tx, 1.8, tz);
    trunk.castShadow = true;
    envGroup.add(trunk);

    const foliage = new THREE.Mesh(inFoliageGeo, inFoliageMat);
    foliage.position.set(tx, 4.2 + (i % 3) * 0.3, tz);
    foliage.scale.set(1.1 + (i % 2) * 0.2, 1.15, 1.1 + (i % 3) * 0.2);
    foliage.castShadow = true;
    envGroup.add(foliage);
  });
}

function createVehicleMesh(veh: Vehicle, isSelected: boolean): THREE.Group {
  const group = new THREE.Group();
  group.position.set(veh.position.x, veh.position.y, veh.position.z);
  group.rotation.y = veh.rotationY;
  group.userData = {
    type: 'vehicle',
    id: veh.id,
    name: veh.name,
  } as MeshUserData;

  if (veh.vehicleType === 'ambulance') {
    const bodyGeo = new THREE.BoxGeometry(2.6, 2.2, 5.8);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.3,
      metalness: 0.2,
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 1.3;
    body.castShadow = true;
    group.add(body);

    const stripeGeo = new THREE.BoxGeometry(2.62, 0.5, 5.6);
    const stripeMat = new THREE.MeshStandardMaterial({ color: 0xef4444 });
    const stripe = new THREE.Mesh(stripeGeo, stripeMat);
    stripe.position.y = 1.2;
    group.add(stripe);

    const glassGeo = new THREE.BoxGeometry(2.4, 0.9, 1.4);
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.1,
      metalness: 0.9,
    });
    const glass = new THREE.Mesh(glassGeo, glassMat);
    glass.position.set(0, 1.8, 1.8);
    group.add(glass);

    const sirenGeo = new THREE.BoxGeometry(1.6, 0.3, 0.6);
    const sirenMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xef4444,
      emissiveIntensity: 0.8,
    });
    const siren = new THREE.Mesh(sirenGeo, sirenMat);
    siren.position.set(0, 2.5, 0.5);
    group.add(siren);

    const sirenLight = new THREE.PointLight(0xef4444, 1.5, 15);
    sirenLight.name = 'siren';
    sirenLight.position.set(0, 2.8, 0.5);
    group.add(sirenLight);
  } else if (veh.vehicleType === 'agv_cart') {
    const agvGeo = new THREE.BoxGeometry(1.6, 0.8, 2.0);
    const agvMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.4,
      metalness: 0.6,
    });
    const agv = new THREE.Mesh(agvGeo, agvMat);
    agv.position.y = 0.5;
    agv.castShadow = true;
    group.add(agv);

    const boxGeo = new THREE.BoxGeometry(1.4, 1.0, 1.6);
    const boxMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.2,
    });
    const box = new THREE.Mesh(boxGeo, boxMat);
    box.position.y = 1.3;
    group.add(box);

    const safetyLight = new THREE.PointLight(0xf59e0b, 1.2, 8);
    safetyLight.name = 'siren';
    safetyLight.position.set(0, 1.9, 0);
    group.add(safetyLight);
  } else {
    const shuttleGeo = new THREE.BoxGeometry(2.4, 2.0, 5.0);
    const shuttleMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      roughness: 0.4,
    });
    const shuttle = new THREE.Mesh(shuttleGeo, shuttleMat);
    shuttle.position.y = 1.1;
    shuttle.castShadow = true;
    group.add(shuttle);
  }

  if (isSelected) {
    const haloGeo = new THREE.RingGeometry(3.0, 3.4, 20);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.rotation.x = -Math.PI / 2;
    halo.position.y = 0.05;
    group.add(halo);
  }

  return group;
}

function createEquipmentMesh(eq: Equipment, isSelected: boolean): THREE.Group {
  const group = new THREE.Group();
  group.position.set(eq.position.x, eq.position.y, eq.position.z);
  group.userData = {
    type: 'equipment',
    id: eq.id,
    name: eq.nameTh,
  } as MeshUserData;

  if (eq.equipmentType === 'ct_scanner' || eq.equipmentType === 'mri') {
    const torusGeo = new THREE.TorusGeometry(1.6, 0.6, 12, 24);
    const gantryMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.2,
      metalness: 0.3,
    });
    const gantry = new THREE.Mesh(torusGeo, gantryMat);
    gantry.position.y = 1.8;
    group.add(gantry);

    const couchGeo = new THREE.BoxGeometry(1.2, 0.5, 4.0);
    const couchMat = new THREE.MeshStandardMaterial({ color: 0x64748b });
    const couch = new THREE.Mesh(couchGeo, couchMat);
    couch.position.set(0, 0.5, 1.5);
    group.add(couch);
  } else {
    const standGeo = new THREE.BoxGeometry(0.8, 1.6, 0.8);
    const standMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8 });
    const stand = new THREE.Mesh(standGeo, standMat);
    stand.position.y = 0.9;
    group.add(stand);
  }

  if (isSelected) {
    const pinGeo = new THREE.ConeGeometry(0.5, 1.5, 8);
    const pinMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const pin = new THREE.Mesh(pinGeo, pinMat);
    pin.rotation.x = Math.PI;
    pin.position.y = 3.6;
    group.add(pin);
  }

  return group;
}

function createAlertBeacon(alert: Alert): THREE.Group {
  const group = new THREE.Group();

  let x = 61.9;
  let z = 50.7;
  let y = 16;

  if (alert.zoneId === 'excellent') {
    x = -25;
    z = 97;
    y = 18;
  } else if (alert.zoneId === 'dept-opd-triage' || alert.zoneId === 'opd') {
    x = 61.9;
    z = 50.7;
    y = 14;
  }

  group.position.set(x, y, z);
  group.userData = {
    type: 'alert',
    id: alert.id,
    name: alert.titleTh,
  } as MeshUserData;

  const beaconGeo = new THREE.OctahedronGeometry(1.4, 0);
  const beaconMat = new THREE.MeshBasicMaterial({
    color: alert.severity === 'critical' ? 0xef4444 : 0xf59e0b,
    wireframe: true,
  });
  const beacon = new THREE.Mesh(beaconGeo, beaconMat);
  group.add(beacon);

  const innerGeo = new THREE.SphereGeometry(0.7, 12, 12);
  const innerMat = new THREE.MeshBasicMaterial({
    color: alert.severity === 'critical' ? 0xef4444 : 0xf59e0b,
  });
  const inner = new THREE.Mesh(innerGeo, innerMat);
  group.add(inner);

  const beaconLight = new THREE.PointLight(
    alert.severity === 'critical' ? 0xef4444 : 0xf59e0b,
    2.2,
    22
  );
  group.add(beaconLight);

  return group;
}
