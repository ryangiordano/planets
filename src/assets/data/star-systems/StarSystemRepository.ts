import starSystems, { StarSystemData } from "./star-systems";
import {
  getStellarBody,
  StellarBodyObject,
} from "../stellar-bodies/StellarBodyRepository";
import { EnemyObject, getEnemyObjectById } from "../enemy/EnemyController";
import { getStarSystemEnemiesById } from "../enemy/EnemyRepository";

const inMemoryData = { ...starSystems };

export type StarSystemObject = {
  id: number;
  sun: StellarBodyObject;
  system: StellarBodyObject[];
  coordinates: [number, number];
  enemies: EnemyObject[];
};
export function getStarSystemDataById(id: number): StarSystemData {
  const starSystem = inMemoryData[id];
  if (!starSystem) throw new Error(`StarSystem not found at id: ${id}`);
  return starSystem;
}

export function setStarSystemData(ssd: StarSystemData) {
  inMemoryData[ssd.id] = { ...ssd };
}
function _getStarSystemByCoordinate(coords: [number, number]): StarSystemData {
  const key = Object.keys(inMemoryData).find(
    (key) =>
      inMemoryData[key].coordinates[0] === coords[0] &&
      inMemoryData[key].coordinates[1] === coords[1]
  );
  if (inMemoryData[key]) {
    return inMemoryData[key];
  }
}

export function mapToStarSystemObject(
  starSystemData: StarSystemData
): StarSystemObject {
  const starSystemEnemies = getStarSystemEnemiesById(
    starSystemData.systemEnemies
  );
  return {
    id: starSystemData.id,
    sun: getStellarBody(starSystemData.sun),
    system: starSystemData.system.map((stellarBodyId) =>
      getStellarBody(stellarBodyId)
    ),
    coordinates: starSystemData.coordinates,
    enemies: starSystemEnemies.enemies.map((e) => getEnemyObjectById(e)),
  };
}

export function getStarSystem(starSystemId: number) {
  return mapToStarSystemObject(getStarSystemDataById(starSystemId));
}

function _getAllStarSystems() {
  return Object.keys(inMemoryData).map((key) => inMemoryData[key]);
}

export function getAllStarSystems() {
  return _getAllStarSystems().map((sd) => mapToStarSystemObject(sd));
}

export function getStarSystemByCoordinate(coords: [number, number]) {
  const s = _getStarSystemByCoordinate(coords);
  if (!s) {
    return undefined;
  }
  return mapToStarSystemObject(s);
}
