import starSystems, { StarSystemData } from "../star-systems/star-systems";
import { getStellarBody, StellarBodyObject } from "./StellarBodyRepository";

export type StarSystemObject = {
  sun: StellarBodyObject;
  system: StellarBodyObject[];
};

export function getStarSystemById(id: number): StarSystemData {
  const starSystem = starSystems[id];
  if (!starSystem) throw new Error(`StarSystem not found at id: ${id}`);
  return starSystem;
}

export function mapToStarSystemObject(starSystemData: StarSystemData) {
  return {
    sun: getStellarBody(starSystemData.sun),
    system: starSystemData.system.map((stellarBodyId) =>
      getStellarBody(stellarBodyId)
    ),
  };
}

export function getStarSystem(starSystemId: number) {
  return mapToStarSystemObject(getStarSystemById(starSystemId));
}
