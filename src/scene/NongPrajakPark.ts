import * as THREE from 'three';

export interface NongPrajakElements {
  group: THREE.Group;
  yellowDuck: THREE.Group;
  waterMesh: THREE.Mesh;
  fountainJets: THREE.Mesh[];
  updateAnimation: (timeSec: number) => void;
}

/**
 * Creates Nong Prajak Public Park & Lake (สวนสาธารณะหนองประจักษ์ศิลปาคม)
 * Positioned on the East side of the main boulevard (X: 122 to 380, Z: -230 to +230)
 * Features:
 * - Shimmering natural lake with water ripples
 * - Iconic Giant Yellow Duck landmark floating on the lake with bobbing animation
 * - Tartan running track (ลู่วิ่งยางสังเคราะห์สีฟ้า/แดง) along the shoreline
 * - Landscaped lakeside park promenade, tropical palms, shade trees, park benches
 * - Aerating water fountain jets
 */
export function createNongPrajakPark(isDay: boolean): NongPrajakElements {
  const group = new THREE.Group();
  group.name = 'nong-prajak-park';

  // 1. Park Land Base (Shoreline and park greenery)
  const parkLandGeo = new THREE.PlaneGeometry(240, 480);
  const parkLandMat = new THREE.MeshStandardMaterial({
    color: isDay ? 0x2d5a37 : 0x0c2014,
    roughness: 0.88,
    metalness: 0.05,
  });
  const parkLand = new THREE.Mesh(parkLandGeo, parkLandMat);
  parkLand.rotation.x = -Math.PI / 2;
  parkLand.position.set(260, 0.02, 0);
  parkLand.receiveShadow = true;
  group.add(parkLand);

  // 2. Main Lake Body (Spacious water surface)
  const lakeWidth = 200;
  const lakeDepth = 420;
  const lakeGeo = new THREE.PlaneGeometry(lakeWidth, lakeDepth, 32, 32);
  const lakeMat = new THREE.MeshStandardMaterial({
    color: isDay ? 0x0284c7 : 0x082f49,
    roughness: 0.12,
    metalness: 0.88,
    transparent: true,
    opacity: 0.88,
  });
  const waterMesh = new THREE.Mesh(lakeGeo, lakeMat);
  waterMesh.rotation.x = -Math.PI / 2;
  waterMesh.position.set(272, 0.08, 0);
  waterMesh.receiveShadow = true;
  group.add(waterMesh);

  // Water reflection shimmer border
  const shoreCurbGeo = new THREE.BoxGeometry(3.5, 0.45, 422);
  const shoreCurbMat = new THREE.MeshStandardMaterial({
    color: isDay ? 0x94a3b8 : 0x334155,
    roughness: 0.6,
  });
  const westShoreCurb = new THREE.Mesh(shoreCurbGeo, shoreCurbMat);
  westShoreCurb.position.set(168, 0.22, 0);
  group.add(westShoreCurb);

  // 3. Tartan Running Track & Lakeside Jogging Promenade (ลู่วิ่งรอบหนองประจักษ์)
  // Track 1: Blue rubberized athletic track
  const trackWidth = 5.5;
  const trackGeo = new THREE.BoxGeometry(trackWidth, 0.28, 440);
  const trackMat = new THREE.MeshStandardMaterial({
    color: isDay ? 0x0284c7 : 0x0369a1, // Classic Nong Prajak azure track
    roughness: 0.85,
    metalness: 0.05,
  });
  const runningTrack = new THREE.Mesh(trackGeo, trackMat);
  runningTrack.position.set(160, 0.14, 0);
  runningTrack.receiveShadow = true;
  group.add(runningTrack);

  // Track white lane divider markings
  const laneDividerMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const laneGeo = new THREE.PlaneGeometry(0.2, 440);
  const lane1 = new THREE.Mesh(laneGeo, laneDividerMat);
  lane1.rotation.x = -Math.PI / 2;
  lane1.position.set(158.5, 0.29, 0);
  group.add(lane1);

  const lane2 = new THREE.Mesh(laneGeo, laneDividerMat);
  lane2.rotation.x = -Math.PI / 2;
  lane2.position.set(161.5, 0.29, 0);
  group.add(lane2);

  // Pedestrian Walkway (ทางเดินคอนกรีตเรียบริมน้ำ)
  const walkGeo = new THREE.BoxGeometry(6.0, 0.25, 440);
  const walkMat = new THREE.MeshStandardMaterial({
    color: isDay ? 0xe2e8f0 : 0x1e293b,
    roughness: 0.55,
  });
  const walk = new THREE.Mesh(walkGeo, walkMat);
  walk.position.set(151, 0.13, 0);
  walk.receiveShadow = true;
  group.add(walk);

  // 4. ICONIC GIANT YELLOW DUCK LANDMARK (แลนด์มาร์กเป็ดเหลืองหนองประจักษ์)
  const yellowDuck = new THREE.Group();
  yellowDuck.name = 'giant-yellow-duck';
  yellowDuck.position.set(225, 0.3, -20); // Floating naturally in the lake near shoreline view

  // Duck Materials
  const duckYellowMat = new THREE.MeshStandardMaterial({
    color: 0xfacc15, // Bright duck yellow
    roughness: 0.35,
    metalness: 0.1,
  });
  const duckOrangeMat = new THREE.MeshStandardMaterial({
    color: 0xf97316, // Orange beak
    roughness: 0.4,
    metalness: 0.1,
  });
  const duckEyeWhiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
  const duckEyeBlackMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.1 });

  // Floating pontoon base (water disturbance ring)
  const pontoonGeo = new THREE.CylinderGeometry(8.5, 9.2, 0.8, 32);
  const pontoonMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    transparent: true,
    opacity: 0.45,
  });
  const pontoon = new THREE.Mesh(pontoonGeo, pontoonMat);
  pontoon.position.y = 0.1;
  yellowDuck.add(pontoon);

  // Duck Body (Giant rounded ellipsoid)
  const bodyGeo = new THREE.SphereGeometry(7.2, 32, 24);
  const body = new THREE.Mesh(bodyGeo, duckYellowMat);
  body.scale.set(1.15, 0.95, 1.4);
  body.position.set(0, 4.8, 0);
  body.castShadow = true;
  body.receiveShadow = true;
  yellowDuck.add(body);

  // Duck Chest / Breast
  const breastGeo = new THREE.SphereGeometry(5.2, 24, 20);
  const breast = new THREE.Mesh(breastGeo, duckYellowMat);
  breast.scale.set(1.0, 1.0, 1.15);
  breast.position.set(0, 5.8, -3.8);
  yellowDuck.add(breast);

  // Duck Tail (Upturned pointed tail)
  const tailGeo = new THREE.ConeGeometry(3.6, 5.8, 20);
  const tail = new THREE.Mesh(tailGeo, duckYellowMat);
  tail.position.set(0, 6.2, 7.8);
  tail.rotation.x = 0.85;
  tail.scale.set(1.0, 1.0, 0.8);
  tail.castShadow = true;
  yellowDuck.add(tail);

  // Duck Neck
  const neckGeo = new THREE.CylinderGeometry(3.1, 4.0, 5.0, 24);
  const neck = new THREE.Mesh(neckGeo, duckYellowMat);
  neck.position.set(0, 8.5, -4.5);
  neck.rotation.x = -0.15;
  neck.castShadow = true;
  yellowDuck.add(neck);

  // Duck Head
  const headGeo = new THREE.SphereGeometry(4.4, 32, 24);
  const head = new THREE.Mesh(headGeo, duckYellowMat);
  head.position.set(0, 12.2, -5.2);
  head.castShadow = true;
  yellowDuck.add(head);

  // Duck Beak (Cute curved bill)
  const beakGeo = new THREE.BoxGeometry(3.4, 1.4, 4.2);
  const beak = new THREE.Mesh(beakGeo, duckOrangeMat);
  beak.position.set(0, 11.2, -8.6);
  beak.rotation.x = 0.08;
  beak.castShadow = true;
  yellowDuck.add(beak);

  // Beak rounded tip
  const beakTipGeo = new THREE.CylinderGeometry(1.7, 1.7, 1.4, 16);
  const beakTip = new THREE.Mesh(beakTipGeo, duckOrangeMat);
  beakTip.position.set(0, 11.2, -10.6);
  beakTip.rotation.y = Math.PI / 2;
  yellowDuck.add(beakTip);

  // Duck Left Eye
  const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.85, 16, 16), duckEyeWhiteMat);
  eyeL.position.set(-2.6, 13.0, -7.0);
  const pupilL = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), duckEyeBlackMat);
  pupilL.position.set(-2.8, 13.0, -7.5);
  yellowDuck.add(eyeL);
  yellowDuck.add(pupilL);

  // Duck Right Eye
  const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.85, 16, 16), duckEyeWhiteMat);
  eyeR.position.set(2.6, 13.0, -7.0);
  const pupilR = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), duckEyeBlackMat);
  pupilR.position.set(2.8, 13.0, -7.5);
  yellowDuck.add(eyeR);
  yellowDuck.add(pupilR);

  // Duck Wings (left & right plump curved wings)
  const wingGeo = new THREE.SphereGeometry(4.0, 20, 16);
  const wingL = new THREE.Mesh(wingGeo, duckYellowMat);
  wingL.scale.set(0.45, 0.9, 1.3);
  wingL.position.set(-7.0, 5.6, 1.2);
  wingL.rotation.z = -0.25;
  yellowDuck.add(wingL);

  const wingR = new THREE.Mesh(wingGeo, duckYellowMat);
  wingR.scale.set(0.45, 0.9, 1.3);
  wingR.position.set(7.0, 5.6, 1.2);
  wingR.rotation.z = 0.25;
  yellowDuck.add(wingR);

  // Landmark floating sign plaque
  const duckPlaque = createLandmarkPlaque(
    'เป็ดเหลือง หนองประจักษ์',
    'Nong Prajak Giant Yellow Duck Landmark',
    isDay
  );
  duckPlaque.position.set(0, 17.5, -5.2);
  yellowDuck.add(duckPlaque);

  // Rotate duck slightly to face hospital boulevard
  yellowDuck.rotation.y = -Math.PI / 2 + 0.35;
  group.add(yellowDuck);

  // Baby ducks accompanying the mother duck
  const baby1 = createBabyDuck(isDay);
  baby1.position.set(228, 0.25, -34);
  baby1.rotation.y = -Math.PI / 2 + 0.15;
  group.add(baby1);

  const baby2 = createBabyDuck(isDay);
  baby2.position.set(224, 0.25, -6);
  baby2.rotation.y = -Math.PI / 2 + 0.6;
  group.add(baby2);

  // 5. Lake Aerating Fountains (น้ำพุกลางหนองประจักษ์)
  const fountainJets: THREE.Mesh[] = [];
  const fountainCoords: [number, number][] = [
    [265, -80],
    [270, 45],
    [255, 120],
  ];

  const jetMat = new THREE.MeshStandardMaterial({
    color: isDay ? 0xbae6fd : 0x38bdf8,
    transparent: true,
    opacity: 0.75,
    roughness: 0.1,
  });

  fountainCoords.forEach(([fx, fz]) => {
    // Basin float
    const baseGeo = new THREE.CylinderGeometry(2.4, 2.6, 0.6, 16);
    const base = new THREE.Mesh(baseGeo, shoreCurbMat);
    base.position.set(fx, 0.3, fz);
    group.add(base);

    // Water plume jet cone
    const jetGeo = new THREE.ConeGeometry(2.8, 9.5, 16);
    const jet = new THREE.Mesh(jetGeo, jetMat);
    jet.position.set(fx, 5.0, fz);
    group.add(jet);
    fountainJets.push(jet);
  });

  // 6. Lush Shoreline Landscaping (Palms, Willow Trees, Park Benches, Lamps)
  const parkTreeCoords: [number, number][] = [
    [142, -190], [142, -150], [142, -110], [142, -70], [142, -30],
    [142, 10], [142, 50], [142, 90], [142, 130], [142, 170], [142, 210],
    // Deep park groves
    [185, -170], [195, -130], [180, 110], [190, 160], [185, 200],
  ];

  const palmTrunkGeo = new THREE.CylinderGeometry(0.32, 0.48, 5.6, 7);
  const palmTrunkMat = new THREE.MeshStandardMaterial({ color: 0x5a3e26, roughness: 0.9 });
  const palmCrownGeo = new THREE.DodecahedronGeometry(3.2);
  const palmCrownMat = new THREE.MeshStandardMaterial({
    color: isDay ? 0x15803d : 0x052e16,
    roughness: 0.75,
  });

  parkTreeCoords.forEach(([px, pz], i) => {
    const trunk = new THREE.Mesh(palmTrunkGeo, palmTrunkMat);
    trunk.position.set(px, 2.8, pz);
    trunk.castShadow = true;
    group.add(trunk);

    const crown = new THREE.Mesh(palmCrownGeo, palmCrownMat);
    crown.position.set(px, 5.6 + (i % 3) * 0.4, pz);
    crown.scale.set(1.1 + (i % 2) * 0.2, 0.9, 1.1 + (i % 3) * 0.2);
    crown.castShadow = true;
    group.add(crown);
  });

  // Park lakeside benches & lanterns
  for (let z = -170; z <= 170; z += 40) {
    // Bench
    const benchGeo = new THREE.BoxGeometry(2.4, 0.6, 1.1);
    const benchMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 });
    const bench = new THREE.Mesh(benchGeo, benchMat);
    bench.position.set(147, 0.45, z);
    bench.rotation.y = Math.PI / 2;
    group.add(bench);

    // Park lantern post
    const lanternPostGeo = new THREE.CylinderGeometry(0.12, 0.16, 4.8, 8);
    const lanternPostMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8 });
    const post = new THREE.Mesh(lanternPostGeo, lanternPostMat);
    post.position.set(146, 2.4, z + 8);
    group.add(post);

    const lanternGlobeGeo = new THREE.SphereGeometry(0.55, 8, 8);
    const lanternGlobeMat = new THREE.MeshStandardMaterial({
      color: isDay ? 0xf8fafc : 0xfef08a,
      emissive: isDay ? 0x000000 : 0xfef08a,
      emissiveIntensity: isDay ? 0 : 0.95,
    });
    const globe = new THREE.Mesh(lanternGlobeGeo, lanternGlobeMat);
    globe.position.set(146, 4.8, z + 8);
    group.add(globe);
  }

  // Animation handler
  const updateAnimation = (timeSec: number) => {
    // Giant Yellow Duck floating bobbing and subtle tilt
    const bob = Math.sin(timeSec * 2.2) * 0.35;
    const tilt = Math.cos(timeSec * 1.5) * 0.04;
    yellowDuck.position.y = 0.3 + bob;
    yellowDuck.rotation.z = tilt;
    yellowDuck.rotation.x = Math.sin(timeSec * 1.8) * 0.03;

    // Baby ducks bobbing slightly out of phase
    baby1.position.y = 0.25 + Math.sin(timeSec * 2.6 + 1.0) * 0.25;
    baby2.position.y = 0.25 + Math.sin(timeSec * 2.4 + 2.2) * 0.25;

    // Fountains pulsating spray
    fountainJets.forEach((jet, i) => {
      const scaleY = 1.0 + Math.sin(timeSec * 3.5 + i * 1.5) * 0.18;
      jet.scale.set(1, scaleY, 1);
    });
  };

  return {
    group,
    yellowDuck,
    waterMesh,
    fountainJets,
    updateAnimation,
  };
}

/**
 * Creates Baby Duck companion
 */
function createBabyDuck(isDay: boolean): THREE.Group {
  const group = new THREE.Group();
  const duckYellowMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.35 });
  const duckOrangeMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.4 });

  // Body
  const body = new THREE.Mesh(new THREE.SphereGeometry(2.2, 16, 12), duckYellowMat);
  body.scale.set(1.1, 0.9, 1.3);
  body.position.y = 1.8;
  body.castShadow = true;
  group.add(body);

  // Head
  const head = new THREE.Mesh(new THREE.SphereGeometry(1.4, 16, 12), duckYellowMat);
  head.position.set(0, 3.8, -1.5);
  head.castShadow = true;
  group.add(head);

  // Beak
  const beak = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.5, 1.3), duckOrangeMat);
  beak.position.set(0, 3.6, -2.6);
  group.add(beak);

  return group;
}

/**
 * Creates floating 3D text/emblem billboard banner for major landmark
 */
function createLandmarkPlaque(titleTh: string, titleEn: string, isNight: boolean): THREE.Sprite {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 140;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Rounded banner badge
    const x = 20;
    const y = 14;
    const w = 472;
    const h = 88;
    const r = 24;

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 4;

    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.fillStyle = isNight ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.96)';
    ctx.fill();
    ctx.restore();

    ctx.lineWidth = 3;
    ctx.strokeStyle = '#eab308'; // Golden yellow border
    ctx.stroke();

    // Icon duck dot
    ctx.beginPath();
    ctx.arc(x + 36, y + 44, 14, 0, Math.PI * 2);
    ctx.fillStyle = '#facc15';
    ctx.fill();

    // Title Thai
    ctx.font = 'bold 26px "Prompt", sans-serif';
    ctx.fillStyle = isNight ? '#f8fafc' : '#0f172a';
    ctx.fillText(titleTh, x + 66, y + 42);

    // Subtitle English
    ctx.font = '500 15px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText(titleEn, x + 66, y + 68);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  const spriteMat = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: true,
  });

  const sprite = new THREE.Sprite(spriteMat);
  sprite.scale.set(22, 6.0, 1);
  return sprite;
}

/**
 * Creates Royal Monument Plaza (ลานพระรูป) in front of OPD & Administration Building
 * Situated at X: 72 to 88, Z: 36 to 64
 * Features:
 * - Raised Italian White Marble Plinth & Steps (แท่นประดิษฐานหินอ่อนสีขาวนวล)
 * - Cast Bronze Royal Monument Statue of Prince Prajak Silpakom (พระอนุสาวรีย์ กรมหลวงประจักษ์ศิลปาคม)
 * - Golden Tiered Umbrellas (ฉัตร 7 ชั้น สีทอง) & Ceremonial Offering Vessels
 * - Symmetrical Ornamental Floral Gardens (สวนดอกไม้ทรงเรขาคณิต) with vibrant floral beds
 * - Polished Granite Promenade Walkways & Decorative Illumination
 */
export function createRoyalMonumentPlaza(isDay: boolean): THREE.Group {
  const plazaGroup = new THREE.Group();
  plazaGroup.name = 'royal-monument-plaza';
  // Positioned in the spacious avenue courtyard directly in front of Old OPD building (bldg-opd-old is at x: 32, z: 108)
  plazaGroup.position.set(74, 0, 108);

  // 1. Broad Paved White Carrara Marble Plaza Ground (ลานคนเดินปูหินอ่อนสีขาวนวล)
  const plazaBaseGeo = new THREE.BoxGeometry(30, 0.22, 32);
  const plazaBaseMat = new THREE.MeshStandardMaterial({
    color: isDay ? 0xf8fafc : 0x1e293b,
    roughness: 0.28,
    metalness: 0.12,
  });
  const plazaBase = new THREE.Mesh(plazaBaseGeo, plazaBaseMat);
  plazaBase.position.y = 0.11;
  plazaBase.receiveShadow = true;
  plazaGroup.add(plazaBase);

  // Plaza curb border in polished charcoal slate
  const curbMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.3,
  });
  const curbNorth = new THREE.Mesh(new THREE.BoxGeometry(30.4, 0.32, 0.4), curbMat);
  curbNorth.position.set(0, 0.16, -16.1);
  plazaGroup.add(curbNorth);

  const curbSouth = new THREE.Mesh(new THREE.BoxGeometry(30.4, 0.32, 0.4), curbMat);
  curbSouth.position.set(0, 0.16, 16.1);
  plazaGroup.add(curbSouth);

  const curbWest = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.32, 32.4), curbMat);
  curbWest.position.set(-15.1, 0.16, 0);
  plazaGroup.add(curbWest);

  const curbEast = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.32, 32.4), curbMat);
  curbEast.position.set(15.1, 0.16, 0);
  plazaGroup.add(curbEast);

  // Connecting paved walkway from Plaza westward directly to Old OPD building entrance (X: 32)
  const walkWestGeo = new THREE.BoxGeometry(26, 0.16, 6);
  const walkMat = new THREE.MeshStandardMaterial({
    color: isDay ? 0xe2e8f0 : 0x334155,
    roughness: 0.45,
  });
  const walkWest = new THREE.Mesh(walkWestGeo, walkMat);
  walkWest.position.set(-27, 0.08, 0);
  walkWest.receiveShadow = true;
  plazaGroup.add(walkWest);

  // Connecting paved walkway eastward towards the main boulevard sidewalk (X: 110)
  const walkEastGeo = new THREE.BoxGeometry(26, 0.16, 6);
  const walkEast = new THREE.Mesh(walkEastGeo, walkMat);
  walkEast.position.set(27, 0.08, 0);
  walkEast.receiveShadow = true;
  plazaGroup.add(walkEast);

  // 2. Multi-tier Royal Pedestal Platform (แท่นประดิษฐาน 3 ชั้น)
  const marbleMat = new THREE.MeshStandardMaterial({
    color: 0xffffff, // Pure white Carrara marble
    roughness: 0.18,
    metalness: 0.1,
  });
  const goldAccentMat = new THREE.MeshStandardMaterial({
    color: 0xfbbf24, // Royal polished gold
    roughness: 0.22,
    metalness: 0.92,
  });

  // Tier 1 Base Step
  const tier1Geo = new THREE.BoxGeometry(10.5, 0.45, 10.5);
  const tier1 = new THREE.Mesh(tier1Geo, marbleMat);
  tier1.position.y = 0.4;
  tier1.castShadow = true;
  tier1.receiveShadow = true;
  plazaGroup.add(tier1);

  // Tier 2 Middle Step with gold beveled molding
  const tier2Geo = new THREE.BoxGeometry(8.2, 0.5, 8.2);
  const tier2 = new THREE.Mesh(tier2Geo, marbleMat);
  tier2.position.y = 0.85;
  tier2.castShadow = true;
  tier2.receiveShadow = true;
  plazaGroup.add(tier2);

  const moldingGeo = new THREE.BoxGeometry(8.4, 0.1, 8.4);
  const molding = new THREE.Mesh(moldingGeo, goldAccentMat);
  molding.position.y = 1.12;
  plazaGroup.add(molding);

  // Tier 3 Top Pedestal Shaft
  const tier3Geo = new THREE.BoxGeometry(4.8, 1.8, 4.8);
  const tier3 = new THREE.Mesh(tier3Geo, marbleMat);
  tier3.position.y = 2.05;
  tier3.castShadow = true;
  tier3.receiveShadow = true;
  plazaGroup.add(tier3);

  // Royal Inscription Plaque (Gold plate facing main road / east)
  const plaqueGeo = new THREE.PlaneGeometry(3.2, 1.1);
  const plaque = new THREE.Mesh(plaqueGeo, goldAccentMat);
  plaque.position.set(2.42, 2.05, 0);
  plaque.rotation.y = Math.PI / 2;
  plazaGroup.add(plaque);

  // 3. Royal Bronze Statue (พระรูปจำลองหล่อบรอนซ์รมดำ พลตรีพระเจ้าบรมวงศ์เธอ กรมหลวงประจักษ์ศิลปาคม)
  const bronzeMat = new THREE.MeshStandardMaterial({
    color: 0x27272a, // Patinated dark cast bronze
    metalness: 0.85,
    roughness: 0.35,
  });

  // Torso & Royal Uniform
  const torsoGeo = new THREE.CylinderGeometry(0.75, 0.9, 2.2, 12);
  const torso = new THREE.Mesh(torsoGeo, bronzeMat);
  torso.position.y = 4.0;
  torso.castShadow = true;
  plazaGroup.add(torso);

  // Head & Ceremonial Headdress
  const headGeo = new THREE.SphereGeometry(0.55, 16, 16);
  const head = new THREE.Mesh(headGeo, bronzeMat);
  head.position.y = 5.4;
  head.castShadow = true;
  plazaGroup.add(head);

  // Ceremonial Sash & Medals (Gold accent)
  const sashGeo = new THREE.TorusGeometry(0.85, 0.08, 8, 16);
  const sash = new THREE.Mesh(sashGeo, goldAccentMat);
  sash.rotation.x = 0.8;
  sash.position.set(0, 4.2, 0);
  plazaGroup.add(sash);

  // 4. Royal Tiered Umbrellas (ฉัตรทอง 7 ชั้น ขนาบซ้าย-ขวา)
  const umbrellaCoords = [
    [0, -3.8],
    [0, 3.8],
  ];

  umbrellaCoords.forEach(([ux, uz]) => {
    const poleGeo = new THREE.CylinderGeometry(0.08, 0.1, 5.2, 8);
    const pole = new THREE.Mesh(poleGeo, goldAccentMat);
    pole.position.set(ux, 2.6, uz);
    plazaGroup.add(pole);

    for (let tier = 0; tier < 7; tier++) {
      const radius = 1.2 - tier * 0.13;
      const height = 0.28;
      const yPos = 3.6 + tier * 0.35;
      const coneGeo = new THREE.ConeGeometry(radius, height, 16);
      const cone = new THREE.Mesh(coneGeo, goldAccentMat);
      cone.position.set(ux, yPos, uz);
      plazaGroup.add(cone);
    }
  });

  // 4.1 Ceremonial Dual Flagpoles (เสาธงคู่: ธงชาติไทย & ธงประจำพระองค์)
  const flagCoords = [
    [10.5, -9.5],
    [10.5, 9.5],
  ];
  flagCoords.forEach(([fx, fz], idx) => {
    const fPoleGeo = new THREE.CylinderGeometry(0.08, 0.12, 9.5, 8);
    const fPoleMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.95 });
    const fPole = new THREE.Mesh(fPoleGeo, fPoleMat);
    fPole.position.set(fx, 4.75, fz);
    plazaGroup.add(fPole);

    // Finial sphere
    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 8), goldAccentMat);
    ball.position.set(fx, 9.6, fz);
    plazaGroup.add(ball);

    // Flag fabric
    const flagGeo = new THREE.PlaneGeometry(2.4, 1.5);
    const flagMat = new THREE.MeshStandardMaterial({
      color: idx === 0 ? 0xef4444 : 0xfacc15,
      side: THREE.DoubleSide,
    });
    const flagMesh = new THREE.Mesh(flagGeo, flagMat);
    flagMesh.position.set(fx - 1.2, 8.6, fz);
    plazaGroup.add(flagMesh);
  });

  // 5. Symmetrical Floral Gardens (แปลงไม้ดอกประดับล้อมรอบลานพระรูป)
  const flowerBedCoords: [number, number, number][] = [
    [-8.5, -11, 0xef4444], // Red salvia blooms
    [-8.5, 11, 0xfacc15],  // Golden marigolds (ดาวเรืองสีเหลือง)
    [8.5, -11, 0x8b5cf6],  // Purple blossoms
    [8.5, 11, 0xec4899],   // Pink roses
  ];

  flowerBedCoords.forEach(([bx, bz, flowerHex]) => {
    const bedBorderGeo = new THREE.CylinderGeometry(3.6, 3.8, 0.4, 20);
    const bedBorder = new THREE.Mesh(bedBorderGeo, curbMat);
    bedBorder.position.set(bx, 0.35, bz);
    bedBorder.receiveShadow = true;
    plazaGroup.add(bedBorder);

    const soilGeo = new THREE.CircleGeometry(3.4, 20);
    const soilMat = new THREE.MeshStandardMaterial({
      color: isDay ? 0x166534 : 0x052e16,
      roughness: 0.9,
    });
    const soil = new THREE.Mesh(soilGeo, soilMat);
    soil.rotation.x = -Math.PI / 2;
    soil.position.set(bx, 0.56, bz);
    plazaGroup.add(soil);

    const flowerMat = new THREE.MeshStandardMaterial({
      color: flowerHex,
      roughness: 0.5,
    });
    for (let fi = 0; fi < 12; fi++) {
      const angle = (fi / 12) * Math.PI * 2;
      const dist = 1.2 + (fi % 3) * 0.7;
      const fx = bx + Math.cos(angle) * dist;
      const fz = bz + Math.sin(angle) * dist;
      const bud = new THREE.Mesh(new THREE.DodecahedronGeometry(0.35), flowerMat);
      bud.position.set(fx, 0.78, fz);
      plazaGroup.add(bud);
    }
  });

  // 6. Plaza Decorative Light Bollards & Monument Spotlight
  const bollardPositions: [number, number][] = [
    [-13, -14], [-13, 0], [-13, 14],
    [13, -14], [13, 0], [13, 14],
  ];

  const bollardGeo = new THREE.CylinderGeometry(0.18, 0.22, 1.6, 8);
  const bollardMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8 });
  const lampCapGeo = new THREE.SphereGeometry(0.35, 8, 8);
  const lampCapMat = new THREE.MeshStandardMaterial({
    color: isDay ? 0xf8fafc : 0xfef08a,
    emissive: isDay ? 0x000000 : 0xfef08a,
    emissiveIntensity: isDay ? 0 : 0.9,
  });

  bollardPositions.forEach(([lx, lz]) => {
    const post = new THREE.Mesh(bollardGeo, bollardMat);
    post.position.set(lx, 0.9, lz);
    plazaGroup.add(post);

    const cap = new THREE.Mesh(lampCapGeo, lampCapMat);
    cap.position.set(lx, 1.8, lz);
    plazaGroup.add(cap);
  });

  // Night Monument Spotlight
  if (!isDay) {
    const spot = new THREE.SpotLight(0xfef08a, 2.5, 20, Math.PI / 4, 0.3);
    spot.position.set(6, 1.5, 0);
    spot.target = torso;
    plazaGroup.add(spot);
  }

  // 7. 3D Floating Title Tag for Royal Monument Plaza in front of Old OPD
  const plazaTag = createLandmarkPlaque(
    'ลานพระอนุสาวรีย์ หน้าตึก OPD เก่า',
    'Prince Prajak Silpakom Royal Monument Plaza',
    isDay
  );
  plazaTag.position.set(0, 8.2, 0);
  plazaGroup.add(plazaTag);

  return plazaGroup;
}

/**
 * Creates Main North-South Hospital Boulevard
 * Running accurately along X = +104 from Z = +230 to Z = -230!
 * Directly traverses past:
 * 1. ตึกเวชกรรมสังคม (bldg-social-med, Z ≈ +135)
 * 2. อาคารผู้ป่วยนอกและอำนวยการ (opd, Z ≈ +50)
 * 3. อาคารสูติ-นรีเวชกรรม (bldg-obgyn, Z ≈ -96)
 * 4. อาคาร 96 ปี หลวงตามหาบัว (bldg-96y, Z ≈ -140)
 */
export function createMasterHospitalBoulevard(isDay: boolean): THREE.Group {
  const roadGroup = new THREE.Group();
  roadGroup.name = 'master-hospital-boulevard';

  const roadCenterLineX = 126; // Set east of hospital front row (X <= 103) and west of Nong Prajak (X >= 146)
  const roadLengthZ = 460;     // Extends from Z: -230 to Z: +230
  const roadWidthX = 32;       // Wide 2-lane dual carriageway (16m northbound, 16m southbound)

  const asphaltMat = new THREE.MeshStandardMaterial({
    color: isDay ? 0x1e293b : 0x0f172a,
    roughness: 0.8,
  });

  // 1. Asphalt Roadbed
  const roadbedGeo = new THREE.PlaneGeometry(roadWidthX, roadLengthZ);
  const roadbed = new THREE.Mesh(roadbedGeo, asphaltMat);
  roadbed.rotation.x = -Math.PI / 2;
  roadbed.position.set(roadCenterLineX, 0.05, 0);
  roadbed.receiveShadow = true;
  roadGroup.add(roadbed);

  // 2. Raised Landscaped Central Median Island (เกาะกลางถนน)
  const medianWidth = 3.6;
  const medianGeo = new THREE.BoxGeometry(medianWidth, 0.38, roadLengthZ);
  const medianMat = new THREE.MeshStandardMaterial({
    color: isDay ? 0x1e3a24 : 0x09140d,
    roughness: 0.9,
  });
  const median = new THREE.Mesh(medianGeo, medianMat);
  median.position.set(roadCenterLineX, 0.19, 0);
  median.receiveShadow = true;
  roadGroup.add(median);

  // Median curb edges
  const curbMat = new THREE.MeshStandardMaterial({
    color: isDay ? 0x94a3b8 : 0x334155,
    roughness: 0.5,
  });
  const curbWest = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.38, roadLengthZ), curbMat);
  curbWest.position.set(roadCenterLineX - medianWidth / 2, 0.2, 0);
  roadGroup.add(curbWest);

  const curbEast = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.38, roadLengthZ), curbMat);
  curbEast.position.set(roadCenterLineX + medianWidth / 2, 0.2, 0);
  roadGroup.add(curbEast);

  // 3. Road Lane Markings
  // Yellow dashed lane dividers along both carriageways
  const lineMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
  for (let z = -220; z < 220; z += 12) {
    // West Carriageway (Southbound lane towards social med)
    const dashW = new THREE.Mesh(new THREE.PlaneGeometry(0.35, 5.2), lineMat);
    dashW.rotation.x = -Math.PI / 2;
    dashW.position.set(roadCenterLineX - 7.5, 0.07, z);
    roadGroup.add(dashW);

    // East Carriageway (Northbound lane towards Luang Ta Maha Bua 96Y)
    const dashE = new THREE.Mesh(new THREE.PlaneGeometry(0.35, 5.2), lineMat);
    dashE.rotation.x = -Math.PI / 2;
    dashE.position.set(roadCenterLineX + 7.5, 0.07, z);
    roadGroup.add(dashE);
  }

  // Solid white outer road edge lines
  const whiteLineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const solidLineGeo = new THREE.PlaneGeometry(0.35, roadLengthZ);

  const edgeWest = new THREE.Mesh(solidLineGeo, whiteLineMat);
  edgeWest.rotation.x = -Math.PI / 2;
  edgeWest.position.set(roadCenterLineX - roadWidthX / 2 + 0.6, 0.07, 0);
  roadGroup.add(edgeWest);

  const edgeEast = new THREE.Mesh(solidLineGeo, whiteLineMat);
  edgeEast.rotation.x = -Math.PI / 2;
  edgeEast.position.set(roadCenterLineX + roadWidthX / 2 - 0.6, 0.07, 0);
  roadGroup.add(edgeEast);

  // 4. Pedestrian Sidewalks on West (Hospital side) and East (Nong Prajak side)
  const sidewalkMat = new THREE.MeshStandardMaterial({
    color: isDay ? 0x64748b : 0x1e293b,
    roughness: 0.65,
  });

  const sidewalkWest = new THREE.Mesh(
    new THREE.BoxGeometry(4.2, 0.28, roadLengthZ),
    sidewalkMat
  );
  sidewalkWest.position.set(roadCenterLineX - roadWidthX / 2 - 2.1, 0.14, 0);
  sidewalkWest.receiveShadow = true;
  roadGroup.add(sidewalkWest);

  const sidewalkEast = new THREE.Mesh(
    new THREE.BoxGeometry(4.2, 0.28, roadLengthZ),
    sidewalkMat
  );
  sidewalkEast.position.set(roadCenterLineX + roadWidthX / 2 + 2.1, 0.14, 0);
  sidewalkEast.receiveShadow = true;
  roadGroup.add(sidewalkEast);

  // 5. Zebra Crossings across the Boulevard
  // At OPD & Grand Gateway (Z ≈ 51)
  // At 96Y Building Grand Entrance (Z ≈ -140)
  // At Social Medicine Building (Z ≈ 135)
  const zebraCrossingsZ = [51, -140, 135];
  for (const crossZ of zebraCrossingsZ) {
    for (let stripeOffset = -5; stripeOffset <= 5; stripeOffset += 1.8) {
      // West lane stripe
      const sW = new THREE.Mesh(new THREE.PlaneGeometry(12, 1.0), whiteLineMat);
      sW.rotation.x = -Math.PI / 2;
      sW.position.set(roadCenterLineX - 8.5, 0.08, crossZ + stripeOffset);
      roadGroup.add(sW);

      // East lane stripe
      const sE = new THREE.Mesh(new THREE.PlaneGeometry(12, 1.0), whiteLineMat);
      sE.rotation.x = -Math.PI / 2;
      sE.position.set(roadCenterLineX + 8.5, 0.08, crossZ + stripeOffset);
      roadGroup.add(sE);
    }
  }

  // 6. Boulevard Median Trees & Ornamental Shrubs
  const treeTrunkGeo = new THREE.CylinderGeometry(0.25, 0.35, 3.2, 6);
  const treeTrunkMat = new THREE.MeshStandardMaterial({ color: 0x452b14, roughness: 0.9 });
  const treeFoliageGeo = new THREE.DodecahedronGeometry(2.0);
  const treeFoliageMat = new THREE.MeshStandardMaterial({
    color: isDay ? 0x22c55e : 0x065f46,
    roughness: 0.8,
  });

  for (let z = -210; z <= 210; z += 24) {
    // Avoid blocking zebra crossings
    if (Math.abs(z - 51) < 10 || Math.abs(z - (-140)) < 10 || Math.abs(z - 135) < 10) continue;

    const trunk = new THREE.Mesh(treeTrunkGeo, treeTrunkMat);
    trunk.position.set(roadCenterLineX, 1.7, z);
    trunk.castShadow = true;
    roadGroup.add(trunk);

    const foliage = new THREE.Mesh(treeFoliageGeo, treeFoliageMat);
    foliage.position.set(roadCenterLineX, 3.8, z);
    foliage.scale.set(1.1, 1.25, 1.1);
    foliage.castShadow = true;
    roadGroup.add(foliage);
  }

  // 7. Boulevard Streetlights (Double-arm modern luminaire posts along median)
  const lampPostGeo = new THREE.CylinderGeometry(0.2, 0.28, 7.8, 8);
  const lampPostMat = new THREE.MeshStandardMaterial({
    color: isDay ? 0x64748b : 0x334155,
    metalness: 0.8,
  });
  const luminaireGeo = new THREE.BoxGeometry(2.8, 0.25, 0.8);
  const luminaireMat = new THREE.MeshStandardMaterial({
    color: isDay ? 0xf8fafc : 0xfef08a,
    emissive: isDay ? 0x000000 : 0xfef08a,
    emissiveIntensity: isDay ? 0 : 0.95,
  });

  for (let z = -200; z <= 200; z += 40) {
    const post = new THREE.Mesh(lampPostGeo, lampPostMat);
    post.position.set(roadCenterLineX, 3.9, z);
    roadGroup.add(post);

    const luminaire = new THREE.Mesh(luminaireGeo, luminaireMat);
    luminaire.position.set(roadCenterLineX, 7.8, z);
    roadGroup.add(luminaire);
  }

  // 8. Connecting Entrance Gates and Hospital Driveways
  // Gate 1: Front of OPD & Grand Entrance (Z ≈ 51)
  const opdDriveway = new THREE.Mesh(
    new THREE.PlaneGeometry(24, 24),
    asphaltMat
  );
  opdDriveway.rotation.x = -Math.PI / 2;
  opdDriveway.position.set(98, 0.05, 51);
  roadGroup.add(opdDriveway);

  // Gate 2: Front of Building 96Y Luang Ta Maha Bua (Z ≈ -140)
  const bldg96Driveway = new THREE.Mesh(
    new THREE.PlaneGeometry(22, 16),
    asphaltMat
  );
  bldg96Driveway.rotation.x = -Math.PI / 2;
  bldg96Driveway.position.set(99, 0.05, -140);
  roadGroup.add(bldg96Driveway);

  // Gate 3: Front of Social Medicine Building (Z ≈ 138)
  const socialMedDriveway = new THREE.Mesh(
    new THREE.PlaneGeometry(22, 16),
    asphaltMat
  );
  socialMedDriveway.rotation.x = -Math.PI / 2;
  socialMedDriveway.position.set(99, 0.05, 138);
  roadGroup.add(socialMedDriveway);

  return roadGroup;
}
