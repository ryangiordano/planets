import starSystems, { StarSystemData } from "../star-systems/star-systems";
import { getStellarBody, StellarBodyObject } from "./StellarBodyRepository";

export type StarSystemObject = {
  id: number;
  sun: StellarBodyObject;
  system: StellarBodyObject[];
  coordinates: [number, number];
};
 function getStarSystemById(id: number): StarSystemData {
  const starSystem = starSystems[id];
  if (!starSystem) throw new Error(`StarSystem not found at id: ${id}`);
  return starSystem;
}
function _getStarSystemByCoordinate(coords: [number, number]): StarSystemData {
  const key = Object.keys(starSystems).find(
    (key) =>
      starSystems[key].coordinates[0] === coords[0] &&
      starSystems[key].coordinates[1] === coords[1]
  );
  if (starSystems[key]) {
    return starSystems[key];
  }
}

export function mapToStarSystemObject(
  starSystemData: StarSystemData
): StarSystemObject {
  return {
    id: starSystemData.id,
    sun: getStellarBody(starSystemData.sun),
    system: starSystemData.system.map((stellarBodyId) =>
      getStellarBody(stellarBodyId)
    ),
    coordinates: starSystemData.coordinates,
  };
}

export function getStarSystem(starSystemId: number) {
  return mapToStarSystemObject(getStarSystemById(starSystemId));
}

function _getAllStarSystems() {
  return Object.keys(starSystems).map((key) => starSystems[key]);
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
