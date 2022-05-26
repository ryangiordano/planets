import enemies from "./enemies";
import enemyTemplates from "./enemy-templates";

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

export enum EnemyType {
  laserMine,
}

const inMemoryData = { ...enemies };

export function getEnemyTemplateById(id: number): EnemyTemplateData {
  if (!enemyTemplates[id]) {
    throw new Error(`Enemy Template not found at id: ${id}`);
  }
  return enemyTemplates[id];
}

export function getEnemyById(id: number): EnemyData {
  const enemy = inMemoryData[id];
  if (!enemy) throw new Error(`Enemy not found at id: ${id}`);
  return enemy;
}

export function setEnemy(enemyData: EnemyData) {
  inMemoryData[enemyData.id] = { ...enemyData };
}
