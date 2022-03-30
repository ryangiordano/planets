import Block from "./Block";
import GridPlaceable from "../GridPlaceable";

export default class BlockStack extends GridPlaceable {
  constructor({ scene, x, y }: { scene: Phaser.Scene; x: number; y: number }) {
    super(scene, x, y, null);
    this.setAlpha(0);
  }

  addBlock(block: Block) {
    this.scene.add.existing(block);
    this.parentContainer.add(block);
    block.setX(this.x);
    block.setY(this.y + 9);
  }
}
