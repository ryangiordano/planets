import LaserMine from "../../../components/enemies/LaserMine";
import {
  EnemyTemplateData,
  EnemyType,
  getEnemyById,
  getEnemyTemplateById,
  getStellarEnemiesById,
  getStellarEnemiesByStellarBodyId,
  setEnemy,
  setStellarEnemies,
} from "./EnemyRepository";

export type EnemyObject = {
  id: number;
  enemyTemplate: EnemyTemplateData;
};

export type SystemEnemiesObject = {
  id: number;
  /** Array of enemy objects */
  enemies: EnemyObject[];
  /** id of the system the group of enemies belong to */
  system: number;
};

export type EnemyTypes = typeof LaserMine;

export const EnemyTypeMap = new Map<EnemyType, EnemyTypes>([
  [EnemyType.laserMine, LaserMine],
]);

export function randomlyCreateEnemyData(templateId: number): EnemyObject {
  const enemyData = {
    id: Math.random(),
    enemyTemplate: templateId,
  };

  setEnemy(enemyData);

  const enemyObject = {
    ...enemyData,
    enemyTemplate: getEnemyTemplateById(templateId),
  };
  return enemyObject;
}

export function getEnemyObjectById(enemyId: number): EnemyObject {
  const enemyData = getEnemyById(enemyId);
  return {
    ...enemyData,
    enemyTemplate: getEnemyTemplateById(enemyData.enemyTemplate),
  };
}

export function removeStellarEnemy(stellarBodyId: number, enemyId: number) {
  const stellarEnemies = getStellarEnemiesByStellarBodyId(stellarBodyId);

  stellarEnemies.enemies = stellarEnemies.enemies.filter(
    (id) => id !== enemyId
  );
}

export function addStellarEnemy(stellarBodyId: number, enemyId: number) {
  const stellarEnemies = getStellarEnemiesByStellarBodyId(stellarBodyId);
  const enemySet = new Set(stellarEnemies.enemies);
  enemySet.add(enemyId);
  stellarEnemies.enemies = Array.from(enemySet);
}

export function getstellarEnemies(stellarBodyId: number) {
  return getStellarEnemiesById(stellarBodyId);
}

export function createstellarEnemies(stellarBodyId: number, enemies: number[]) {
  return setStellarEnemies(stellarBodyId, enemies);
}
