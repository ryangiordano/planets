import { Repository } from "./Repository";

export interface TestData {
  name: string;
  spriteKey: string; 
  maxHp: string; 
  maxMp: string; 
  level: string; 
  intellect: string; 
  dexterity: string; 
  wisdom: string; 
  stamina: string; 
  strength: string; 
  physicalResist: string; 
  magicalResist: string; 
  lootTable: string
  goldValue: string; 
  experiencePoints: string;
}

export class TestRepository extends Repository<TestData> {
  constructor(game: Phaser.Game) {
    const testData = game.cache.json.get('test-data')
    super(testData);
  }
}
