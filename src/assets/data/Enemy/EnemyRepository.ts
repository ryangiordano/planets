import enemies from "./enemies";
import enemyTemplates from "./enemy-templates";
import systemEnemies from "./system-enemies";

export type EnemyData = {
  id: number;
  enemyTemplate: number;
};
export type EnemyTemplateData = {
  id: number;
  name: string;
  baseHP: number;
  fireRate: number;
  enemyType: EnemyType;
};

export type SystemEnemiesData = {
  id: number;
  /** Array of enemy ids */
  enemies: number[];
  /** id of the system the group of enemies belong to */
  system: number;
};

export enum EnemyType {
  laserMine,
}

const inMemoryEnemyData = { ...enemies };
const inMemoryStarSystemEnemiesData = { ...systemEnemies };

export function getEnemyTemplateById(id: number): EnemyTemplateData {
  if (!enemyTemplates[id]) {
    throw new Error(`Enemy Template not found at id: ${id}`);
  }
  return enemyTemplates[id];
}

export function getEnemyById(id: number): EnemyData {
  const enemy = inMemoryEnemyData[id];
  if (!enemy) throw new Error(`Enemy not found at id: ${id}`);
  return enemy;
}

export function setEnemy(enemyData: EnemyData) {
  inMemoryEnemyData[enemyData.id] = { ...enemyData };
}

export function getStarSystemEnemiesByStarSystemId(
  starSystemId: number
): SystemEnemiesData {
  const k = Object.keys(inMemoryStarSystemEnemiesData).find(
    (key) => inMemoryStarSystemEnemiesData[key].system === starSystemId
  );
  if (!k)
    throw new Error(
      `Star System Enemies not found for system id ${starSystemId}`
    );

  return inMemoryStarSystemEnemiesData[k];
}

export function getStarSystemEnemiesById(
  starSystemEnemiesId: number
): SystemEnemiesData {
  const k = Object.keys(inMemoryStarSystemEnemiesData).find(
    (key) => inMemoryStarSystemEnemiesData[key].id === starSystemEnemiesId
  );
  if (!k)
    throw new Error(
      `Star System Enemies not found for system id ${starSystemEnemiesId}`
    );

  return inMemoryStarSystemEnemiesData[k];
}

export function setStarSystemEnemies(
  starSystemId: number,
  enemies: number[]
): SystemEnemiesData {
  const id = Math.random();

  const starSystemEnemies = {
    id,
    system: starSystemId,
    enemies,
  };

  inMemoryStarSystemEnemiesData[starSystemEnemies.id] = {
    ...starSystemEnemies,
  };
  return starSystemEnemies;
}
