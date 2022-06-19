import { COLOR_MAP } from "../../assets/data/stellar-bodies/Constants";
import { sparkImpact } from "../../scenes/StellarBodyScene/EnemyImpact";
import { WHITE } from "../../utility/Constants";
import { getRandomInt, getCanvasPosition } from "../../utility/Utility";
import Laser from "../player/Laser";
import EnemyLaser from "./EnemyLaser";
export default class LaserMine extends Phaser.Physics.Arcade.Sprite {
  private firingInterval: NodeJS.Timer;
  public currentHP: number;
  public maxHP: number;
  static spriteDependencies: SpriteDependency[] = [
    {
      frameHeight: 128,
      frameWidth: 128,
      key: "enemy",
      url: "/src/assets/sprites/enemy.png",
    },
    ...EnemyLaser.spriteDependencies,
  ];
  public enemyId: number;
  private movementPattern: [number, number][] = [];
  constructor({
    scene,
    x,
    y,
    onLaserFire,
    id,
  }: {
    scene: Phaser.Scene;
    x: number;
    y: number;
    onLaserFire: (laser: EnemyLaser) => void;
    id: number;
  }) {
    super(scene, x, y, "enemy", 0);
    this.enemyId = id;
    scene.physics.add.existing(this);
    scene.add.existing(this);
    this.setTint(WHITE.hex);
    this.setScale(0.3);
    this.createMovementPatterns();

    //TODO: Set HP from data
    this.currentHP = 100;
    this.maxHP = 100;

    this.firingInterval = setInterval(() => {
      const laser = new EnemyLaser({
        scene: this.scene,
        x: this.x,
        y: this.y,
        targetX: getRandomInt(
          0 - this.parentContainer.x + 0,
          this.scene.game.canvas.width - this.parentContainer.x - 0
        ),
        targetY: getRandomInt(
          0 - this.parentContainer.y + 0,
          this.scene.game.canvas.height - this.parentContainer.y - 0
        ),
        onReachDestination: (laser) => {
          onLaserFire(laser);
        },
      });

      this.parentContainer.add(laser);
    }, 1000);

    this.on("destroy", () => {
      clearTimeout(this.firingInterval);
    });
    this.beginMovement();
  }

  public takeDamage(
    damageToTake: number,
    impactCoords: { x: number; y: number },
    onResolvedHit: (isDestroyed: boolean) => void
  ) {
    this.currentHP = Math.max(0, this.currentHP - damageToTake);

    if (this.currentHP === 0) {
      this.explode(impactCoords);
      onResolvedHit(true);
    } else {
      sparkImpact(this.scene, WHITE.hex, getRandomInt(10, 20), impactCoords);
      onResolvedHit(false);
    }
  }

  public explode(impactCoords: Coords) {
    sparkImpact(this.scene, WHITE.hex, getRandomInt(30, 40), impactCoords, 30);
    this.scene.tweens.add({
      targets: this,
      scale: 0,
      duration: 500,
      alpha: 0,
      onComplete: () => {
        this.destroy();
      },
    });
  }

  private createMovementPatterns() {
    for (let i = 0; i <= 3; i++) {
      this.movementPattern.push([
        getRandomInt(this.x - 100, this.x + 100),
        getRandomInt(this.y - 100, this.y + 100),
      ]);
    }
  }

  beginMovement() {
    const randomPattern =
      this.movementPattern[getRandomInt(0, this.movementPattern.length)];
    this.scene?.add.tween({
      targets: this,
      y: randomPattern[1],
      x: randomPattern[0],
      ease: "Cubic.easeInOut",
      duration: 1000,
      angle: 180,
      onComplete: () => {
        this.beginMovement();
      },
    });
  }
}
