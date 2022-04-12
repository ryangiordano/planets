import starSystems, { StarSystemData } from "../star-systems/star-systems";
import { getStellarBody, StellarBodyObject } from "./StellarBodyRepository";

export type StarSystemObject = {
  sun: StellarBodyObject;
  system: StellarBodyObject[];
  coordinates: [number, number];
};

export function getStarSystemById(id: number): StarSystemData {
  const starSystem = starSystems[id];
  if (!starSystem) throw new Error(`StarSystem not found at id: ${id}`);
  return starSystem;
}
export function _getStarSystemByCoordinate(
  coords: [number, number]
): StarSystemData {
  const key = Object.keys(starSystems).find(
    (key) =>
      starSystems[key].coordinates[0] === coords[0] &&
      starSystems[key].coordinats[1] === coords[1]
  );
  if (starSystems[key]) {
    return starSystems[key];
  }
}

export function mapToStarSystemObject(starSystemData: StarSystemData) {
  return {
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
export function getStarSystemByCoordinate(coords: [number, number]) {
  const s = _getStarSystemByCoordinate(coords);
  if (!s) {
    return undefined;
  }
  return mapToStarSystemObject(s);
}
