import { Directions } from "../Constants";
export default abstract class GridPlaceable extends Phaser.Physics.Arcade.Sprite {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: number
  ) {
    super(scene, x, y, texture, frame);
  }

  face(direction: Directions) {
    switch (direction) {
      case Directions.up:
        this.setFrame(3);
        break;
      case Directions.down:
        this.setFrame(0);
        break;
      case Directions.left:
        this.setFrame(6);
        break;
      case Directions.right:
        this.setFrame(6);
        this.setFlipX(true);
        break;
      default:
        break;
    }
  }
}
