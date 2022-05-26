import LaserMine from "../../../components/enemies/LaserMine";
import {
  EnemyTemplateData,
  EnemyType,
  getEnemyById,
  getEnemyTemplateById,
  setEnemy,
} from "./EnemyRepository";

export type EnemyObject = {
  id: number;
  enemyTemplate: EnemyTemplateData;
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
