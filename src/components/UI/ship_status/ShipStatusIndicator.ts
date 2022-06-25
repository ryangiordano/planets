import { WHITE } from "../../../utility/Constants";
import { getCanvasPosition } from "../../../utility/Utility";

export class ShipStatusIndicator extends Phaser.GameObjects.Container {
  private emitter: Phaser.GameObjects.Particles.ParticleEmitter;

  constructor({ scene, x, y }: { scene: Phaser.Scene; x: number; y: number }) {
    super(scene, x, y);
    this.scene.add.existing(this);
    this.buildShip();
    this.buildShields();
    this.buildEngineExhaust();
  }

  buildShip() {
    const mainSquare = new Phaser.GameObjects.Rectangle(
      this.scene,
      0,
      0,
      65,
      65,
      WHITE.hex,
      0.5
    );

    const leftSquare = new Phaser.GameObjects.Rectangle(
      this.scene,
      -40,
      65,
      35,
      35,
      WHITE.hex,
      0.5
    );

    const rightSquare = new Phaser.GameObjects.Rectangle(
      this.scene,
      40,
      65,
      35,
      35,
      WHITE.hex,
      0.5
    );
    this.scene.add.existing(mainSquare);
    this.scene.add.existing(leftSquare);
    this.scene.add.existing(rightSquare);
    this.add([mainSquare, leftSquare, rightSquare]);
    this.setScale(0.6, 0.6);
  }

  buildShields() {
    const circleSize = 100;
    const firstLayerCircle = new Phaser.GameObjects.Ellipse(
      this.scene,
      0,
      0,
      circleSize,
      circleSize,
      WHITE.hex,
      0.1
    );

    const secondLayerCircle = new Phaser.GameObjects.Ellipse(
      this.scene,
      0,
      0,
      circleSize * 2,
      circleSize * 2,
      WHITE.hex,
      0.1
    );

    const thirdLayerCircle = new Phaser.GameObjects.Ellipse(
      this.scene,
      0,
      0,
      circleSize * 3,
      circleSize * 3,
      WHITE.hex,
      0.1
    );
    this.scene.add.existing(firstLayerCircle);
    this.scene.add.existing(secondLayerCircle);
    this.scene.add.existing(thirdLayerCircle);
    this.add([firstLayerCircle, secondLayerCircle, thirdLayerCircle]);
  }

  buildEngineExhaust() {
    const particles = this.scene.add.particles("ship", 1);

    const { x, y } = this.scene.cameras.main.getWorldPoint(this.x, this.y);
    this.emitter = particles.createEmitter({
      x,
      y: y + 65,
      scale: { start: 1.8, end: 0 },
      blendMode: "ADD",
      angle: 90,
      speed: 100,
      frequency: 300,
      alpha: 0.5,
    });
  }
}
