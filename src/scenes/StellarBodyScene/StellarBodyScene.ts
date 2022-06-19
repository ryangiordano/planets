import DependentScene from "../DependentScene";
import { getStarSystem } from "../../assets/data/star-systems/StarSystemRepository";
import Ship from "../../components/player/Ship";
import { getRandomInt } from "../../utility/Utility";
import { paintStars, warpOutStar, warpInStar } from "../utility/index";
import LargeStellarBody from "../../components/planet/LargeStellarBody";
import { getStellarBody } from "../../assets/data/stellar-bodies/StellarBodyRepository";
import { LaserImpact } from "../../components/player/LargeLaser";
import LargeLaser from "../../components/player/LargeLaser";
import { buildFiringBehavior } from "./Firing";
import { buildLaserImpactStellarBodyBehavior } from "./LaserImpact";
import { handleHarvest } from "./HarvestStellarBody";
import { renderStellarBody } from "./RenderStellarBody";
import { StateScene } from "../StateScene";
import {
  addNotification,
  NotificationTypes,
} from "../StateScene/NotificationManagement";
import LaserMine from "../../components/enemies/LaserMine";
import { WHITE } from "../../utility/Constants";
import { sparkImpact } from "./EnemyImpact";
import {
  removeStellarEnemy,
  EnemyObject,
  EnemyTypeMap,
} from "../../assets/data/enemy/EnemyController";

/** Scene where the action takes place in the game.
 * Currently players can mine planets and moons.
 * - TODO:
 * - planetary shield generators to fire through
 * - planetary orbital batteries that fire lasers and missiles
 * - blockade ships/large battleships to negotiate with or take down
 * - waves of enemies from the planet to attack player
 */
export class StellarBodyScene extends DependentScene {
  private stars: Phaser.GameObjects.Sprite[];
  private stellarBodyContainer: Phaser.GameObjects.Container;
  private laserTargetGroup: Phaser.GameObjects.Group;
  private laserImpactGroup: Phaser.GameObjects.Group;
  private laserGroup: Phaser.GameObjects.Group;
  private stellarBodyGroup: Phaser.GameObjects.Group;
  private enemyTargetGroup: Phaser.GameObjects.Group;

  constructor() {
    super({
      key: "StellarBodyScene",
    });
  }

  static spriteDependencies: SpriteDependency[] = [
    ...LargeStellarBody.spriteDependencies,
    ...Ship.spriteDependencies,
    ...LargeLaser.spriteDependencies,
    ...LaserImpact.spriteDependencies,
    {
      frameHeight: 128,
      frameWidth: 128,
      key: "star",
      url: "/src/assets/sprites/star.png",
    },
  ];
  static audioDependencies: AudioDependency[] = [];

  preload(): void {}

  private paintStars() {
    const centerX = this.game.canvas.width / 2;
    const centerY = this.game.canvas.height / 2;
    this.stars = paintStars(this, { x: centerX, y: centerY }, 500, 2000, 2000);
  }
  async create({ stellarBodyId, referringSystemId }): Promise<void> {
    const centerX = this.game.canvas.width / 2;
    const centerY = this.game.canvas.height / 2;
    this.stellarBodyGroup = new Phaser.GameObjects.Group(this, []);
    this.laserImpactGroup = new Phaser.GameObjects.Group(this, []);
    this.laserGroup = new Phaser.GameObjects.Group(this, []);
    this.laserTargetGroup = new Phaser.GameObjects.Group(this, []);
    this.enemyTargetGroup = new Phaser.GameObjects.Group(this, []);
    this.paintStars();
    this.stellarBodyContainer = this.add.container(centerX, centerY);

    this.setSceneKeyEvents(referringSystemId);

    const stellarBodyObject = getStellarBody(stellarBodyId);
    buildLaserImpactStellarBodyBehavior(
      this,
      this.laserImpactGroup,
      this.stellarBodyGroup,
      (laserImpact, stellarBody) =>
        !stellarBody.noYieldLeft() &&
        handleHarvest(this, laserImpact, stellarBody, () => {
          const sbi = getStellarBody(stellarBody.stellarBodyId);
          stellarBody.bodyExhausted();
          addNotification(
            this,
            `${sbi.name}'s resources completely mined!`,
            NotificationTypes.positive
          );
        })
    );

    this.physics.add.overlap(
      this.laserImpactGroup,
      this.enemyTargetGroup,
      (laserImpact: LaserImpact, laserMine: LaserMine) => {
        laserMine.takeDamage(
          laserImpact.potency,
          laserImpact,
          (isDestroyed: boolean) => {
            if (isDestroyed) {
              removeStellarEnemy(stellarBodyId, laserMine["enemyId"]);
            }
          }
        );
        laserImpact.destroy();
      }
    );

    renderStellarBody({
      scene: this,
      stellarBodyGroup: this.stellarBodyGroup,
      stellarBodyContainer: this.stellarBodyContainer,
      stellarBodyObject: getStellarBody(stellarBodyId),
      centerX: 0,
      centerY: 0,
    });

    this.renderEnemies(stellarBodyObject.stellarEnemies);

    await this.warpIn();

    this.approachStellarBody();
    setTimeout(() => {
      addNotification(this, `Approaching  ${stellarBodyObject.name}`);
    }, 500);
    if (this.enemyTargetGroup.getLength()) {
      setTimeout(() => {
        addNotification(this, `Hostiles present`, NotificationTypes.urgent);
      }, 1000);
    }
  }

  private renderEnemies(enemyObjects: EnemyObject[]) {
    console.log(enemyObjects);

    enemyObjects.forEach((eo) => {
      const cls = EnemyTypeMap.get(eo.enemyTemplate.enemyType);
      const enemy = this.add.existing(
        new cls({
          scene: this,
          x: getRandomInt(-200, 200),
          y: getRandomInt(-200, 200),
          onLaserFire: (laser) => {
            laser.destroy();
          },
          id: eo.id,
        })
      );
      this.enemyTargetGroup.add(enemy);
      this.stellarBodyContainer.add(enemy);
    });
  }

  /** Set escape and firing behavior */
  private setSceneKeyEvents(referringSystemId: number) {
    const esc = this.input.keyboard.addKey("ESC");
    esc.on("down", async () => {
      await this.warpOut();
      this.returnToPreviouseScene(referringSystemId);
    });

    buildFiringBehavior(
      this,
      this.laserGroup,
      this.laserTargetGroup,
      this.laserImpactGroup,
      () => {}
    );
  }

  private returnToPreviouseScene(referringSystemId: number) {
    this.scene.stop();
    this.scene.run("StarSystemScene", getStarSystem(referringSystemId));
  }

  private warpIn() {
    const centerX = this.game.canvas.width / 2;
    const centerY = this.game.canvas.height / 2;

    this.cameras.main.fadeIn(250, 56, 56, 56);
    this.stars.forEach((star) =>
      warpInStar(
        this,
        { x: centerX, y: centerY },
        star,
        getRandomInt(500, 1500),
        "Power1"
      )
    );
    return new Promise<void>((resolve) => {
      this.add.tween({
        targets: [this.stellarBodyContainer],
        scale: {
          from: 0,
          to: 1,
        },
        duration: 1000,
        ease: "Power4",
        onComplete: () => {
          resolve();
        },
      });
    });
  }

  private warpOut() {
    const centerX = this.game.canvas.width / 2;
    const centerY = this.game.canvas.height / 2;
    this.cameras.main.fadeOut(1000, 56, 56, 56);

    this.stars.forEach((star) =>
      warpOutStar(
        this,
        { x: centerX, y: centerY },
        star,
        getRandomInt(500, 1000),
        "Sine.easeIn"
      )
    );
    return new Promise<void>((resolve) => {
      this.add.tween({
        targets: [this.stellarBodyContainer],
        scale: {
          from: this.stellarBodyContainer.scale,
          to: 0,
        },
        duration: 1000,
        ease: "Power4",
        onComplete: () => {
          resolve();
        },
      });
    });
  }

  private approachStellarBody() {
    return this.add.tween({
      targets: [this.stellarBodyContainer],
      scale: {
        from: 1,
        to: 2,
      },
      duration: 20000,
      ease: "Quad.easeOut",
      onCompleted: () => {},
    });
  }
}
