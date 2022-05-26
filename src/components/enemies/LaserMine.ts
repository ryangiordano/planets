import { COLOR_MAP } from "../../assets/data/stellar-bodies/Constants";
import { getRandomInt } from "../../utility/Utility";
import Laser from "../player/Laser";
export default class LaserMine extends Phaser.Physics.Arcade.Sprite {
  private firingInterval: NodeJS.Timer;
  static spriteDependencies: SpriteDependency[] = [
    {
      frameHeight: 64,
      frameWidth: 64,
      key: "enemy",
      url: "/src/assets/sprites/enemy.png",
    },
    ...Laser.spriteDependencies,
  ];
  public enemyId: number;
  constructor({
    scene,
    x,
    y,
    onFire,
    id,
  }: {
    scene: Phaser.Scene;
    x: number;
    y: number;
    onFire: (laser: Laser) => void;
    id: number;
  }) {
    super(scene, x, y, "enemy", 0);
    this.enemyId = id;
    scene.physics.add.existing(this);

    this.setTint(COLOR_MAP.red[0]);

    this.firingInterval = setInterval(() => {
      const randomAngle = getRandomInt(0, 361);
      onFire(
        new Laser({
          scene: this.scene,
          x: this.x,
          y: this.y,
          angle: randomAngle,
        })
      );
    }, 1000);

    this.on("destroy", () => {
      clearTimeout(this.firingInterval);
    });
  }
}
