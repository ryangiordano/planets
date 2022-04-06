import planets, { StellarBodyData } from "../staller-bodies/planets";
import { StellarBodySize } from "../../../components/planet/StellarBody";

export type StellarBodyObject = {
  name: string;
  distanceFromCenter?: number;
  rotationSpeed?: number;
  color?: number;
  orbit: StellarBodyObject[];
  size: StellarBodySize;
};

export function getStellarBodyData(stellarBodyId: number): StellarBodyData {
  const stellarBodyData = planets[stellarBodyId];

  if (!stellarBodyData)
    throw new Error(`StellarBody not found at id: ${stellarBodyId}`);

  return stellarBodyData;
}

export function mapToStellarBodyObject(
  stellarBodyData: StellarBodyData
): StellarBodyObject {
  const result = { ...stellarBodyData, orbit: [] };
  result.orbit.push(
    ...(stellarBodyData.orbit?.map((stellarBodyId) => {
      const stellarBodyData = getStellarBodyData(stellarBodyId);
      return mapToStellarBodyObject(stellarBodyData);
    }) ?? [])
  );

  return result;
}

export function getStellarBody(stellarBodyId: number): StellarBodyObject {
  return mapToStellarBodyObject(getStellarBodyData(stellarBodyId));
}
