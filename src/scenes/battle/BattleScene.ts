import { EnemyObject } from "../../assets/data/enemy/EnemyController";
import Combatant from "../../components/battle/Combatant";
import ResourceModule from "../../components/battle/ResourceModule";
import { asyncForEach, getRandomInt, wait } from "../../utility/Utility";
import { ShipStatusManager } from "../StateScene/ShipManagement";
import { StateScene } from "../StateScene/StateScene";
import { getEnemyTemplateById } from "../../assets/data/enemy/EnemyRepository";
import { Combatable } from "../../components/battle/Combatant";
import { addNotification } from "../StateScene/NotificationManagement";
import { buildShipHealth } from "../StellarBodyScene/shipHealth";
import {
  enemyExplode,
  fireIncomingLaser,
  flash,
  sparkImpact,
} from "../StellarBodyScene/EnemyImpact";
import { WHITE } from "../../utility/Constants";
import { getRightLaserPosition } from "../StellarBodyScene/shipFiring";
import {
  setLaserLaserTargetCollision,
  fireLaser,
  getLeftLaserPosition,
} from "../StellarBodyScene/shipFiring";
let turn = 0;
export enum TurnType {
  player,
  enemy,
}

export type TurnObject = {
  executor: Combatable;
  turnType: TurnType;
};

export type ExecutableTurn = {
  executor: Combatable;
  effects: (() => void)[];
};

export default class BattleScene extends Phaser.Scene {
  private battleOver = false;
  private enemies: Combatant[];
  private player: ShipStatusManager;
  private turns: TurnObject[] = [];
  private shipLogic: ReturnType<typeof buildShipHealth>;
  private laserGroup: Phaser.GameObjects.Group;
  private laserTargetGroup: Phaser.GameObjects.Group;
  private laserImpactGroup: Phaser.GameObjects.Group;
  constructor() {
    super({ key: "BattleScene" });
  }

  public create({ enemies }: { enemies: EnemyObject[] }) {
    this.laserGroup = this.add.group();
    this.laserTargetGroup = this.add.group();
    this.laserImpactGroup = this.add.group();
    setLaserLaserTargetCollision(
      this,
      this.laserGroup,
      this.laserTargetGroup,
      this.laserImpactGroup
    );

    const e = [
      { id: 0, level: 1, enemyTemplate: getEnemyTemplateById(0) },
      { id: 1, level: 1, enemyTemplate: getEnemyTemplateById(0) },
      { id: 2, level: 1, enemyTemplate: getEnemyTemplateById(0) },
    ];
    const { shipStatusManager } = this.scene.get("StateScene") as StateScene;
    this.player = shipStatusManager;
    this.shipLogic = buildShipHealth(this);

    this.populateEnemies(e);
    this.generateTurns(5);
    this.runTurn();
  }

  populateEnemies(enemies: EnemyObject[]) {
    this.enemies = enemies.map((e) => {
      const { shield, attack, health, speed, storage, texture } =
        e.enemyTemplate;
      return new Combatant({
        scene: this,
        x: getRandomInt(250, this.game.canvas.width - 250),
        y: getRandomInt(
          this.game.canvas.height / 4,
          this.game.canvas.height / 1.5
        ),
        texture,
        healthModule: new ResourceModule({
          upgradeableModule: {
            multiplier: health.multiplier,
            level: e.level,
          },
          currentValue: health.currentValue,
          baseValue: health.baseValue,
        }),
        shieldModule: new ResourceModule({
          upgradeableModule: {
            multiplier: shield.multiplier,
            level: e.level,
          },
          currentValue: shield.currentValue,
          baseValue: shield.baseValue,
        }),
        laserModule: { multiplier: attack, level: e.level },
        storageModule: {
          multiplier: storage,
          level: e.level,
        },
        engineModule: { multiplier: speed, level: e.level },
      });
    });
    this.enemies.forEach((enemy) => this.add.existing(enemy));
    this.setSelectEnemyListeners();
  }

  setSelectEnemyListeners() {
    this.enemies.forEach((e) =>
      e.addListener("pointerdown", () =>
        this.events.emit("target-selected", { target: e })
      )
    );
  }

  async runTurn() {
    turn++;
    addNotification(this, `Turn ${turn}, start!`);
    await wait(250);

    const currentTurn = this.turns.shift();
    let executableTurn: ExecutableTurn;
    //await player input if player's turn  (In this case, clicking the mouse on an enemy)
    if (currentTurn.turnType === TurnType.player) {
      executableTurn = await this.getPlayerInput();
    } else {
      executableTurn = this.getEnemyTurn(currentTurn.executor);
    }
    //calculate results of player's input (level of player, power of laser vs enemy HP)
    // apply the results
    //enemies explode, player takes damage
    await this.executeTurnObject(executableTurn);
    // Generate the next turn in the queue based on the remaining enemies
    // Can also take into consideration player input once the battle system becomes more fleshed out.
    await wait(250);

    // Check the status of the battle scene
    this.checkBattleStatus(
      () => {
        this.generateTurns(1);
        this.runTurn();
      },
      () => {
        console.log("Victory");
      },
      () => {
        console.log("Game Over");
      }
    );
  }

  getEnemyTurn(executor: Combatable) {
    return {
      executor,
      effects: [
        async () => {
          const attackPower = executor.getAttackPower();
          await fireIncomingLaser(this, executor?.x, executor?.y);
          this.player.takeDamage(attackPower);
          this.shipLogic.damageShip(this);
        },
      ],
    };
  }

  getPlayerInput(): Promise<ExecutableTurn> {
    return new Promise<ExecutableTurn>(async (resolve) => {
      const target = await new Promise<Combatant>((resolve) => {
        this.events.once(
          "target-selected",
          ({ target }: { target: Combatant }) => resolve(target)
        );
      });

      resolve({
        executor: this.player.shipStatus,
        effects: [
          async () => {
            await Promise.all([
              fireLaser(
                this,
                getLeftLaserPosition(this),
                this.game.canvas.height,
                target,
                this.laserGroup,
                this.laserTargetGroup
              ),
              fireLaser(
                this,
                getRightLaserPosition(this),
                this.game.canvas.height,
                target,
                this.laserGroup,
                this.laserTargetGroup
              ),
            ]);
            // Turn this into a queryable effect
            const attackPower = this.player.shipStatus.getAttackPower();
            flash(this, target);
            await sparkImpact(
              this,
              WHITE.hex,
              getRandomInt(5, 10),
              target,
              15,
              150
            );
            target.takeDamage({
              potency: attackPower,
              onDamageHealth: () => {},
              onDamageShield: () => {},
              onDeath: () => {
                enemyExplode(this, target);
                this.enemies = this.enemies.filter((e) => e !== target);
                this.turns = this.turns.filter((t) => t.executor !== target);
                target.destroy();
              },
            });
          },
        ],
      });
    });
    // Player can select an enemy to attack

    // todo: Player can select energy bauble to fill

    // todo: player can select card and energize it or play it

    // return a standardized Turn object  that contains an optional series of effects
  }

  async executeTurnObject(turnObject: ExecutableTurn) {
    await asyncForEach(turnObject.effects, async (effect) => {
      await effect();
    });
  }

  /** generate array of turn objects given active combatants */
  generateTurns(next: number) {
    let playerTurn =
      this.turns[this.turns.length - 1]?.turnType !== TurnType.player;
    let enemyIndex = 0;
    for (let i = 0; i < next; i++) {
      if (playerTurn) {
        this.turns.push({
          executor: this.player.shipStatus,
          turnType: TurnType.player,
        });
      } else {
        this.turns.push({
          executor: this.enemies[enemyIndex],
          turnType: TurnType.enemy,
        });
        enemyIndex =
          enemyIndex === this.enemies.length - 1 ? 0 : enemyIndex + 1;
      }
      playerTurn = !playerTurn;
    }
  }

  checkBattleStatus(
    onContinue: () => void,
    onVictory: () => void,
    onDefeat: () => void
  ) {
    if (this.player.shipStatus.healthModule.currentValue <= 0) {
      return onDefeat();
    }

    if (this.enemies.length <= 0) {
      return onVictory();
    }

    return onContinue();
  }

  private renderEnemies(enemyObjects: EnemyObject[]) {
    enemyObjects.forEach((eo) => {});
  }
}
