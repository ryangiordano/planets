import planets, { StellarBodyData } from "./planets";
import { StellarBodySize, CompositionType } from "./Types";

const inMemoryData = { ...planets };

export type StellarBodyObject = {
  name: string;
  distanceFromCenter?: number;
  rotationSpeed?: number;
  color?: number;
  orbit: StellarBodyObject[];
  size: StellarBodySize;
  id: number;
  composition?: CompositionType;
};

export function getStellarBodyData(stellarBodyId: number): StellarBodyData {
  const stellarBodyData = inMemoryData[stellarBodyId];
  if (!stellarBodyData)
    throw new Error(`StellarBody not found at id: ${stellarBodyId}`);

  return { ...stellarBodyData, id: stellarBodyId };
}

export function setStellarBodyData(sbd: StellarBodyData) {
  return (inMemoryData[sbd.id] = { ...sbd });
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
