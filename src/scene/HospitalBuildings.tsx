import * as THREE from 'three';
import { Building } from '../types/hospital';

export interface MeshUserData {
  type: 'building' | 'department' | 'room' | 'equipment' | 'vehicle' | 'alert';
  id: string;
  name: string;
  floor?: number;
}

// Cache canvas textures for 3D floating labels to optimize memory & performance
const labelTextureCache = new Map<string, THREE.CanvasTexture>();

/**
 * Creates high-resolution 2D Canvas Sprite for persistent 3D floating labels.
 * Always faces the camera, features crisp Thai building name, floor tag, and status dot.
 */
/**
 * Creates high-resolution 2D Canvas Sprite for persistent 3D floating labels.
 * Bangkok BTS Style Pin Label (ป้ายการ์ดขาวขอบมน ตัวหนังสือหนาใหญ่ชัดเจน เสาเส้นตรงพร้อมจุดพินสีน้ำเงิน):
 * - Clean white rounded card (#ffffff) with royal blue border & soft shadow
 * - Bold royal blue code pill (e.g. [ OPD ], [ 96Y ], [ SURG ]) with white text
 * - Large, prominent, bold Thai building name (font: 22px bold) easily readable from any distance
 * - Royal blue vertical pin stem line extending straight down
 * - Blue locator pin base dot (●) anchoring on the rooftop center
 */
export function createBuildingFloatingLabelSprite(
  bld: Building,
  isNight: boolean
): THREE.Sprite {
  const cacheKey = `${bld.id}_${isNight ? 'night' : 'day'}_bts_v1`;
  let texture = labelTextureCache.get(cacheKey);

  if (!texture) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 160;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Card dimensions (Wide, prominent card with large legible typography)
      const w = 420;
      const h = 74;
      const x = (512 - w) / 2; // 46px centered
      const y = 14;
      const r = 20;

      // Draw soft drop shadow
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
      ctx.shadowBlur = 14;
      ctx.shadowOffsetY = 6;

      // Background rounded card (Pure crisp white in day, deep navy-slate in night)
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, r);
      ctx.fillStyle = isNight ? '#0f172a' : '#ffffff';
      ctx.fill();
      ctx.restore();

      // Card border in royal blue
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = isNight ? '#38bdf8' : '#0284c7';
      ctx.stroke();

      // 1. Blue Station/Building Code Pill (Left) - Bangkok BTS Style
      const tagW = 68;
      const tagH = 38;
      const tagX = x + 14;
      const tagY = y + 18;
      ctx.beginPath();
      ctx.roundRect(tagX, tagY, tagW, tagH, 10);
      ctx.fillStyle = '#0284c7'; // Iconic Royal Blue
      ctx.fill();

      ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      const codeText = bld.code || (bld.id.length > 5 ? `F${bld.floorCount}` : bld.id.toUpperCase());
      ctx.fillText(codeText, tagX + tagW / 2, tagY + 24);
      ctx.textAlign = 'left';

      // 2. Large Bold Thai Building Name (ตัวหนังสือหนาใหญ่ ชัดเจน อ่านง่ายมาก)
      ctx.font = 'bold 22px "Prompt", "Sarabun", sans-serif';
      ctx.fillStyle = isNight ? '#f8fafc' : '#0f172a';

      // Truncate cleanly if string is too wide
      const maxTextWidth = w - tagW - 64;
      let displayName = bld.nameTh;
      if (ctx.measureText(displayName).width > maxTextWidth) {
        while (ctx.measureText(displayName + '...').width > maxTextWidth && displayName.length > 4) {
          displayName = displayName.slice(0, -1);
        }
        displayName += '...';
      }
      ctx.fillText(displayName, tagX + tagW + 16, y + 44);

      // 3. Operational Status Dot (Right)
      const dotX = x + w - 20;
      const dotY = y + 37;
      ctx.beginPath();
      ctx.arc(dotX, dotY, 5.5, 0, Math.PI * 2);
      ctx.fillStyle = bld.id === 'opd' ? '#ef4444' : '#10b981';
      ctx.fill();

      // 4. Slender Royal Blue Pin Stem Line
      const stemX = x + w / 2;
      ctx.beginPath();
      ctx.moveTo(stemX, y + h);
      ctx.lineTo(stemX, 146);
      ctx.strokeStyle = isNight ? '#38bdf8' : '#0284c7';
      ctx.lineWidth = 3.0;
      ctx.stroke();

      // 5. Blue Pin Base Circle (จุดพินวงกลมสีน้ำเงินที่ฐาน)
      ctx.beginPath();
      ctx.arc(stemX, 148, 7.5, 0, Math.PI * 2);
      ctx.fillStyle = '#0284c7';
      ctx.fill();

      // White inner dot for high visibility
      ctx.beginPath();
      ctx.arc(stemX, 148, 3.0, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    }

    texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;
    labelTextureCache.set(cacheKey, texture);
  }

  const spriteMat = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: true,
    depthWrite: false,
  });

  const sprite = new THREE.Sprite(spriteMat);
  // Anchor at the very bottom tip of the pin base dot
  sprite.center.set(0.5, 0.0);

  // Position elevated above the building roof
  const isOpd = bld.id === 'opd';
  const pinElevHeight = isOpd ? 18.0 : 14.0;
  const labelY = bld.size.height + pinElevHeight;
  sprite.position.set(bld.position.x, labelY, bld.position.z);

  // Large prominent base scale
  sprite.scale.set(18.0, 5.62, 1);
  sprite.userData = {
    type: 'building',
    id: bld.id,
    name: bld.nameTh,
    baseY: labelY,
  } as MeshUserData & { baseY: number };

  return sprite;
}

/**
 * Dynamically scales 3D floating labels in real-time according to camera distance,
 * maintaining large, bold, highly legible labels as seen in the BTS map.
 */
export function updateFloatingLabelsScale(
  labels: THREE.Sprite[],
  camera: THREE.PerspectiveCamera
): void {
  const camPos = camera.position;
  const aspect = 512 / 160;

  for (let i = 0; i < labels.length; i++) {
    const sprite = labels[i];
    const dist = camPos.distanceTo(sprite.position);

    // Large bold readable scaling
    const clampedHeight = THREE.MathUtils.clamp(dist * 0.072, 5.0, 16.5);
    const clampedWidth = clampedHeight * aspect;

    sprite.scale.set(clampedWidth, clampedHeight, 1);
  }
}

/**
 * Creates standard rooftop helipad on Administration Building (อาคารผู้ป่วยนอกและอำนวยการ)
 * Includes raised deck structure, aviation markings, red circular pad, white 'H',
 * perimeter lighting, and blinking aviation hazard beacons.
 */
export function createRooftopHelipad(roofY: number, bldWidth: number, bldDepth: number): THREE.Group {
  const helipadGroup = new THREE.Group();
  helipadGroup.name = 'rooftop-helipad';

  // Position slightly offset towards central-east portion of OPD roof
  const offsetX = Math.min(8, bldWidth * 0.18);
  const offsetZ = 0;
  const baseElev = roofY + 1.2;

  // 1. Heavy structural steel pillars elevating the platform above rooftop MEP/roof
  const pillarMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    metalness: 0.85,
    roughness: 0.3,
  });

  const pillarCoords = [
    [-6.5, -6.5], [6.5, -6.5],
    [-6.5, 6.5], [6.5, 6.5],
    [0, -7], [0, 7],
  ];

  pillarCoords.forEach(([px, pz]) => {
    const colGeo = new THREE.BoxGeometry(0.55, 1.4, 0.55);
    const col = new THREE.Mesh(colGeo, pillarMat);
    col.position.set(offsetX + px, baseElev - 0.7, offsetZ + pz);
    col.castShadow = true;
    col.receiveShadow = true;
    helipadGroup.add(col);
  });

  // 2. Elevated Main Helipad Deck (Beveled octagonal platform)
  const padRadius = 9.2;
  const padGeo = new THREE.CylinderGeometry(padRadius, padRadius + 0.3, 0.5, 16);
  const padMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b, // Minimalist Slate Graphite Tarmac
    roughness: 0.7,
    metalness: 0.15,
  });
  const deck = new THREE.Mesh(padGeo, padMat);
  deck.position.set(offsetX, baseElev, offsetZ);
  deck.receiveShadow = true;
  helipadGroup.add(deck);

  // 3. Safety Netting & Perimeter Rim Border (10° angled outward)
  const rimGeo = new THREE.TorusGeometry(padRadius + 0.35, 0.18, 8, 32);
  const rimMat = new THREE.MeshStandardMaterial({
    color: 0xfacc15, // Caution yellow rim
    roughness: 0.4,
    metalness: 0.6,
  });
  const rim = new THREE.Mesh(rimGeo, rimMat);
  rim.rotation.x = Math.PI / 2;
  rim.position.set(offsetX, baseElev + 0.28, offsetZ);
  helipadGroup.add(rim);

  // 4. Red Central Touchdown Circle Ring
  const redRingGeo = new THREE.RingGeometry(6.4, 7.8, 32);
  const redRingMat = new THREE.MeshBasicMaterial({
    color: 0xef4444,
    side: THREE.DoubleSide,
  });
  const redRing = new THREE.Mesh(redRingGeo, redRingMat);
  redRing.rotation.x = -Math.PI / 2;
  redRing.position.set(offsetX, baseElev + 0.27, offsetZ);
  helipadGroup.add(redRing);

  // 5. Outer Yellow Warning Circle Ring
  const yellowRingGeo = new THREE.RingGeometry(8.1, 8.5, 32);
  const yellowRingMat = new THREE.MeshBasicMaterial({
    color: 0xfacc15,
    side: THREE.DoubleSide,
  });
  const yellowRing = new THREE.Mesh(yellowRingGeo, yellowRingMat);
  yellowRing.rotation.x = -Math.PI / 2;
  yellowRing.position.set(offsetX, baseElev + 0.27, offsetZ);
  helipadGroup.add(yellowRing);

  // 6. Bold White 'H' Standard Aviation Symbol
  const hMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
  });

  // Vertical bar left
  const bar1Geo = new THREE.PlaneGeometry(1.2, 5.8);
  const bar1 = new THREE.Mesh(bar1Geo, hMat);
  bar1.rotation.x = -Math.PI / 2;
  bar1.position.set(offsetX - 2.0, baseElev + 0.28, offsetZ);
  helipadGroup.add(bar1);

  // Vertical bar right
  const bar2Geo = new THREE.PlaneGeometry(1.2, 5.8);
  const bar2 = new THREE.Mesh(bar2Geo, hMat);
  bar2.rotation.x = -Math.PI / 2;
  bar2.position.set(offsetX + 2.0, baseElev + 0.28, offsetZ);
  helipadGroup.add(bar2);

  // Center crossbar
  const crossGeo = new THREE.PlaneGeometry(4.0, 1.2);
  const cross = new THREE.Mesh(crossGeo, hMat);
  cross.rotation.x = -Math.PI / 2;
  cross.position.set(offsetX, baseElev + 0.28, offsetZ);
  helipadGroup.add(cross);

  // 7. Max Weight Limit Marking (e.g. "UDH 12T")
  // 8. 4 Corner Elevated Aviation Hazard Warning Strobe Lights
  const beaconCoords = [
    [-padRadius * 0.72, -padRadius * 0.72],
    [padRadius * 0.72, -padRadius * 0.72],
    [-padRadius * 0.72, padRadius * 0.72],
    [padRadius * 0.72, padRadius * 0.72],
  ];

  beaconCoords.forEach(([bx, bz]) => {
    // Stanchion pole
    const stanchionGeo = new THREE.CylinderGeometry(0.08, 0.1, 0.7, 8);
    const stanchionMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8 });
    const stanchion = new THREE.Mesh(stanchionGeo, stanchionMat);
    stanchion.position.set(offsetX + bx, baseElev + 0.45, offsetZ + bz);
    helipadGroup.add(stanchion);

    // Hazard beacon dome
    const beaconDomeGeo = new THREE.SphereGeometry(0.24, 8, 8);
    const beaconDomeMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xef4444,
      emissiveIntensity: 0.95,
    });
    const dome = new THREE.Mesh(beaconDomeGeo, beaconDomeMat);
    dome.position.set(offsetX + bx, baseElev + 0.85, offsetZ + bz);
    dome.name = 'helipad-beacon';
    helipadGroup.add(dome);

    // PointLight for aviation glow
    const beaconLight = new THREE.PointLight(0xef4444, 0.9, 14);
    beaconLight.position.set(offsetX + bx, baseElev + 1.0, offsetZ + bz);
    helipadGroup.add(beaconLight);
  });

  // 9. Windsock Assembly on Northeast Corner
  const poleGeo = new THREE.CylinderGeometry(0.06, 0.08, 3.2, 8);
  const poleMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9 });
  const pole = new THREE.Mesh(poleGeo, poleMat);
  pole.position.set(offsetX + padRadius * 0.85, baseElev + 1.6, offsetZ - padRadius * 0.4);
  helipadGroup.add(pole);

  // Windsock cone
  const sockGeo = new THREE.ConeGeometry(0.4, 1.8, 8);
  const sockMat = new THREE.MeshStandardMaterial({
    color: 0xf97316,
    roughness: 0.7,
  });
  const sock = new THREE.Mesh(sockGeo, sockMat);
  sock.rotation.z = Math.PI / 2 + 0.2;
  sock.position.set(offsetX + padRadius * 0.85 + 0.9, baseElev + 3.0, offsetZ - padRadius * 0.4);
  helipadGroup.add(sock);

  // 10. Access Stairway and Safety Catwalk connecting roof elevator to helipad deck
  const stairGeo = new THREE.BoxGeometry(2.4, 0.4, 3.6);
  const stairMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.7 });
  const stair = new THREE.Mesh(stairGeo, stairMat);
  stair.position.set(offsetX - 7.5, baseElev - 0.4, offsetZ);
  stair.rotation.z = 0.22;
  helipadGroup.add(stair);

  return helipadGroup;
}

/**
 * Creates 3D Building Mesh with Minimalist White-Gray Architectural Aesthetics.
 * Clean white/light-gray facades, sleek aluminum mullions, azure-tinted reflective curtain glass,
 * rooftop HVAC units, and Rooftop Helipad for OPD building.
 */
export function createBuildingMesh(
  bld: Building,
  isSelected: boolean,
  activeLayer: string,
  activeFloor: number | null,
  isNight: boolean
): THREE.Group {
  const group = new THREE.Group();
  group.position.set(bld.position.x, 0, bld.position.z);
  group.userData = {
    type: 'building',
    id: bld.id,
    name: bld.nameTh,
  } as MeshUserData;

  const floorHeight = bld.size.height / bld.floorCount;

  // Minimalist Architectural Palette (Bangkok BTS Style: White Architectural Model & Sky-Blue Glass)
  const facadeWhiteColor = isNight ? 0xd1d5db : 0xffffff;
  const facadeAccentColor = isNight ? 0x94a3b8 : 0xf8fafc;
  const slabColor = isNight ? 0x1e293b : 0xffffff;
  const mullionColor = isNight ? 0x0f172a : 0xe2e8f0;

  // Build each floor with architectural slab and curtain glass
  for (let floor = 1; floor <= bld.floorCount; floor++) {
    const isFloorActive = activeFloor === null || activeFloor === floor;
    const floorY = (floor - 0.5) * floorHeight;

    // 1. Concrete Floor Slab (Crisp white architectural horizontal bands)
    const floorSlabGeo = new THREE.BoxGeometry(bld.size.width + 0.3, 0.45, bld.size.depth + 0.3);
    const floorSlabMat = new THREE.MeshStandardMaterial({
      color: slabColor,
      roughness: 0.3,
      metalness: 0.05,
    });
    const slab = new THREE.Mesh(floorSlabGeo, floorSlabMat);
    slab.position.y = (floor - 1) * floorHeight + 0.22;
    slab.receiveShadow = true;
    group.add(slab);

    // 2. Structural Corner Pillars (Crisp white architectural columns)
    const colWidth = Math.min(2.0, bld.size.width * 0.12);
    const colDepth = Math.min(2.0, bld.size.depth * 0.12);
    const colHeight = floorHeight - 0.45;

    const colGeo = new THREE.BoxGeometry(colWidth, colHeight, colDepth);
    const colMat = new THREE.MeshStandardMaterial({
      color: facadeWhiteColor,
      roughness: 0.35,
      metalness: 0.05,
    });

    const corners = [
      [-bld.size.width / 2 + colWidth / 2, -bld.size.depth / 2 + colDepth / 2],
      [bld.size.width / 2 - colWidth / 2, -bld.size.depth / 2 + colDepth / 2],
      [-bld.size.width / 2 + colWidth / 2, bld.size.depth / 2 - colDepth / 2],
      [bld.size.width / 2 - colWidth / 2, bld.size.depth / 2 - colDepth / 2],
    ];

    corners.forEach(([cx, cz]) => {
      const col = new THREE.Mesh(colGeo, colMat);
      col.position.set(cx, floorY, cz);
      col.castShadow = isFloorActive;
      col.receiveShadow = true;
      group.add(col);
    });

    // 3. Modern Reflective Curtain Glass Wall (Sky / Ice Blue Reflected Glass)
    const wallGeo = new THREE.BoxGeometry(
      bld.size.width - 0.2,
      floorHeight - 0.45,
      bld.size.depth - 0.2
    );

    // Color logic (Clean architectural glass with royal blue selection)
    const glassColor = isSelected
      ? new THREE.Color(0x0284c7)
      : isNight
      ? new THREE.Color(0x1e293b)
      : new THREE.Color(0x38bdf8);

    // Warm clinical interior illumination at night
    const emissiveColor = isSelected
      ? 0x0284c7
      : isNight
      ? (floor % 2 === 0 ? 0xfef08a : 0x7dd3fc)
      : 0x000000;

    const emissiveInt = isSelected ? 0.45 : isNight ? 0.48 : 0;

    const wallMat = new THREE.MeshStandardMaterial({
      color: glassColor,
      roughness: isNight ? 0.25 : 0.15,
      metalness: isNight ? 0.4 : 0.75,
      transparent: true,
      opacity: isFloorActive ? (isSelected ? 0.95 : 0.88) : 0.15,
      emissive: emissiveColor,
      emissiveIntensity: emissiveInt,
    });

    const wall = new THREE.Mesh(wallGeo, wallMat);
    wall.position.y = floorY;
    wall.castShadow = isFloorActive;
    wall.receiveShadow = true;
    wall.userData = {
      type: 'building',
      id: bld.id,
      name: `${bld.nameTh} ชั้น ${floor}`,
      floor,
    };
    group.add(wall);

    // 4. Sleek Horizontal Window Mullions
    const mullionGeo = new THREE.BoxGeometry(bld.size.width + 0.1, 0.18, bld.size.depth + 0.1);
    const mullionMat = new THREE.MeshStandardMaterial({
      color: mullionColor,
      metalness: 0.85,
      roughness: 0.3,
    });
    const mullion = new THREE.Mesh(mullionGeo, mullionMat);
    mullion.position.y = floorY + floorHeight * 0.15;
    group.add(mullion);
  }

  // 5. Roof Structure & Parapet Cornice
  const roofY = bld.size.height;
  const roofGeo = new THREE.BoxGeometry(bld.size.width + 0.8, 0.85, bld.size.depth + 0.8);
  const roofMat = new THREE.MeshStandardMaterial({
    color: facadeAccentColor,
    roughness: 0.45,
    metalness: 0.2,
  });
  const roof = new THREE.Mesh(roofGeo, roofMat);
  roof.position.y = roofY;
  roof.receiveShadow = true;
  group.add(roof);

  // Parapet safety border
  const parapetGeo = new THREE.BoxGeometry(bld.size.width + 0.9, 0.4, bld.size.depth + 0.9);
  const parapetMat = new THREE.MeshStandardMaterial({
    color: mullionColor,
    metalness: 0.7,
  });
  const parapet = new THREE.Mesh(parapetGeo, parapetMat);
  parapet.position.y = roofY + 0.6;
  group.add(parapet);

  // 6. Rooftop Mechanical Penthouse / HVAC Units
  const hvacGeo = new THREE.BoxGeometry(
    Math.min(9, bld.size.width * 0.35),
    2.6,
    Math.min(9, bld.size.depth * 0.35)
  );
  const hvacMat = new THREE.MeshStandardMaterial({
    color: isNight ? 0x1e293b : 0x64748b,
    metalness: 0.6,
    roughness: 0.4,
  });
  const hvac = new THREE.Mesh(hvacGeo, hvacMat);
  // Position opposite the helipad if OPD, or corner if other
  const hvacX = bld.id === 'opd' ? -bld.size.width * 0.25 : -bld.size.width / 4;
  const hvacZ = bld.id === 'opd' ? -bld.size.depth * 0.25 : -bld.size.depth / 4;
  hvac.position.set(hvacX, roofY + 1.5, hvacZ);
  group.add(hvac);

  // 7. ROOFTOP HELIPAD ON ADMINISTRATION BUILDING (อาคารผู้ป่วยนอกและอำนวยการ)
  if (bld.id === 'opd') {
    const helipad = createRooftopHelipad(roofY, bld.size.width, bld.size.depth);
    group.add(helipad);
  }

  // 7.1 Elevated Architectural Pin Stanchion (เสาเข็มหมุดมินิมอลยกสูง ชี้ตำแหน่งอาคาร)
  const isOpd = bld.id === 'opd';
  const pinElevHeight = isOpd ? 16.0 : 12.5;
  const pinPoleGeo = new THREE.CylinderGeometry(0.08, 0.1, pinElevHeight, 8);
  const pinPoleMat = new THREE.MeshStandardMaterial({
    color: isNight ? 0x94a3b8 : 0x64748b,
    metalness: 0.95,
    roughness: 0.25,
  });
  const pinPole = new THREE.Mesh(pinPoleGeo, pinPoleMat);
  pinPole.position.set(0, roofY + pinElevHeight / 2, 0);
  pinPole.castShadow = true;
  group.add(pinPole);

  const pinTipGeo = new THREE.SphereGeometry(0.3, 12, 12);
  const pinTipMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x0284c7,
    emissiveIntensity: isNight ? 1.0 : 0.6,
  });
  const pinTip = new THREE.Mesh(pinTipGeo, pinTipMat);
  pinTip.position.set(0, roofY + pinElevHeight, 0);
  group.add(pinTip);

  // 8. Selection Bounding Halo & Glowing Ice-Blue Accent
  if (isSelected) {
    const haloRadius = Math.max(bld.size.width, bld.size.depth) * 0.68;
    const ringGeo = new THREE.RingGeometry(haloRadius, haloRadius + 1.2, 36);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.14;
    group.add(ring);

    // Glowing vertical corner brackets
    const bracketMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const bHeight = bld.size.height + 1;
    const bCorners: [number, number][] = [
      [-bld.size.width / 2, -bld.size.depth / 2],
      [bld.size.width / 2, -bld.size.depth / 2],
      [-bld.size.width / 2, bld.size.depth / 2],
      [bld.size.width / 2, bld.size.depth / 2],
    ];
    bCorners.forEach(([cx, cz]) => {
      const pinGeo = new THREE.CylinderGeometry(0.12, 0.12, bHeight, 6);
      const pin = new THREE.Mesh(pinGeo, bracketMat);
      pin.position.set(cx, bHeight / 2, cz);
      group.add(pin);
    });
  }

  return group;
}
