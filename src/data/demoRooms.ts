import { Room } from '../types/hospital';
import { UDH_OFFICIAL_ROOMS } from './udhOfficialRooms';
import { loadImportedRoomsFromStorage, realRoomToStoreRoom } from './udhBuildingCatalog';

/**
 * Loads all 639 official real hospital rooms provided by UDH team.
 * User-imported custom overrides from localStorage are overlaid on top.
 */
export function getInitialRooms(): Room[] {
  // 1. Official 639 real rooms
  const officialRooms: Room[] = [...UDH_OFFICIAL_ROOMS];

  // 2. Check for any user overrides in localStorage
  const importedMap = loadImportedRoomsFromStorage();
  const customRooms: Room[] = [];
  Object.values(importedMap).forEach((rList) => {
    rList.forEach((r) => {
      customRooms.push(realRoomToStoreRoom(r));
    });
  });

  if (customRooms.length === 0) {
    return officialRooms;
  }

  // Replace official rooms with user overrides for buildings that have custom imports
  const overriddenBuildingIds = new Set(customRooms.map((r) => r.buildingId));
  const remainingOfficial = officialRooms.filter((r) => !overriddenBuildingIds.has(r.buildingId));
  return [...remainingOfficial, ...customRooms];
}

export const INITIAL_ROOMS: Room[] = getInitialRooms();
