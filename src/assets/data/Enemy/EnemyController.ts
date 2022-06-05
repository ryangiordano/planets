import LaserMine from "../../../components/enemies/LaserMine";
import {
  EnemyTemplateData,
  EnemyType,
  getEnemyById,
  getEnemyTemplateById,
  getStarSystemEnemiesById,
  getStarSystemEnemiesByStarSystemId,
  setEnemy,
  setStarSystemEnemies,
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

export function removeStarSystemEnemy(starSystemId: number, enemyId: number) {
  const starSystemEnemies = getStarSystemEnemiesByStarSystemId(starSystemId);

  starSystemEnemies.enemies = starSystemEnemies.enemies.filter(
    (id) => id !== enemyId
  );
}

export function addStarSystemEnemy(starSystemId: number, enemyId: number) {
  const starSystemEnemies = getStarSystemEnemiesByStarSystemId(starSystemId);
  const enemySet = new Set(starSystemEnemies.enemies);
  enemySet.add(enemyId);
  starSystemEnemies.enemies = Array.from(enemySet);
}

export function getStarSystemEnemies(starSystemId: number) {
  return getStarSystemEnemiesById(starSystemId);
}

export function createStarSystemEnemies(
  starSystemId: number,
  enemies: number[]
) {
  return setStarSystemEnemies(starSystemId, enemies);
}
