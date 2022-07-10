import enemies from "./enemies";
import enemyTemplates from "./enemy-templates";
import stellarEnemies from "./stellar-enemies";
import {
  ResourceModuleObject,
  UpgradeableModule,
} from "../../../components/battle/ResourceModule";

export type EnemyData = {
  id: number;
  level: number;
  enemyTemplate: number;
};
export type EnemyTemplateData = {
  id: number;
  name: string;
  enemyType: EnemyType;
  XP: number;
  texture: string;
  health: { multiplier: number; currentValue: number; baseValue: number };
  shield: { multiplier: number; currentValue: number; baseValue: number };
  attack: number;
  speed: number;
  storage: number;
};

export type StellarEnemiesData = {
  id: number;
  /** Array of enemy ids */
  enemies: number[];
  /** id of the stellar body the group of enemies belong to */
  stellarBody: number;
};

export enum EnemyType {
  laserMine,
}

const inMemoryEnemyData = { ...enemies };
const inMemoryStellarEnemiesData = { ...stellarEnemies };

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

export function getStellarEnemiesByStellarBodyId(
  stellarBodyId: number
): StellarEnemiesData {
  const k = Object.keys(inMemoryStellarEnemiesData).find(
    (key) => inMemoryStellarEnemiesData[key].stellarBody === stellarBodyId
  );
  if (!k)
    throw new Error(`Stellar Enemies not found for system id ${stellarBodyId}`);

  return inMemoryStellarEnemiesData[k];
}

export function getStellarEnemiesById(
  stellarEnemiesId: number
): StellarEnemiesData {
  const k = Object.keys(inMemoryStellarEnemiesData).find(
    (key) => inMemoryStellarEnemiesData[key].id === stellarEnemiesId
  );
  if (!k)
    throw new Error(
      `Stellar Enemies not found for stellar enemies id ${stellarEnemiesId}`
    );

  return inMemoryStellarEnemiesData[k];
}

export function setStellarEnemies(
  stellarBodyId: number,
  enemies: number[]
): StellarEnemiesData {
  const id = Math.random();

  const stellarEnemies = {
    id,
    stellarBody: stellarBodyId,
    enemies,
  };

  inMemoryStellarEnemiesData[stellarEnemies.id] = {
    ...stellarEnemies,
  };
  return stellarEnemies;
}
