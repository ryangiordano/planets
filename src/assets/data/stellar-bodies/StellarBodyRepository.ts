import { EnemyObject, getEnemyObjectById } from "../enemy/EnemyController";
import planets, { StellarBodyData } from "./planets";
import { StellarBodySize, MineableResourceType } from "./Types";
import { getStellarEnemiesById } from "../enemy/EnemyRepository";

const inMemoryData = { ...planets };

export type StellarBodyObject = {
  name: string;
  distanceFromCenter?: number;
  remainingYield: number;
  maxYield: number;
  rotationSpeed?: number;
  color?: number;
  orbit: StellarBodyObject[];
  size: StellarBodySize;
  id: number;
  resourceType: MineableResourceType;
  stellarEnemies?: EnemyObject[];
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
  const result = {
    ...stellarBodyData,
    orbit: [],
    stellarEnemies: stellarBodyData.stellarEnemies
      ? getStellarEnemiesById(stellarBodyData.stellarEnemies)?.enemies.map(
          (id) => getEnemyObjectById(id)
        )
      : [],
  };
  result.orbit.push(
    ...(stellarBodyData.orbit?.map((stellarBodyId) => {
      const stellarBodyData = getStellarBodyData(stellarBodyId);
      return mapToStellarBodyObject(stellarBodyData);
    }) ?? [])
  );

  return result;
}

export function setRemainingYield(id: number, remainingYield: number) {
  const sbd = getStellarBodyData(id);
  sbd.remainingYield = remainingYield;
  setStellarBodyData(sbd);
}

export function getStellarBody(stellarBodyId: number): StellarBodyObject {
  return mapToStellarBodyObject(getStellarBodyData(stellarBodyId));
}
