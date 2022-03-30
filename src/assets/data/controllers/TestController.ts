import { TestRepository } from "../repositories/TestRepository";

export interface CombatEntityData {
  entityId: number;
}
export class TestController {
  private testRepository: TestRepository;
  constructor(game: Phaser.Game) {
    this.testRepository = new TestRepository(game);
  }
  public getTestDataById(testId: number) {
    const enemyFromDb = this.testRepository.getById(testId);
    // Handle mapping to game object here.
    return enemyFromDb;
  }
}
