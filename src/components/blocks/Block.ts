import { RED, BLUE, YELLOW } from "../../utility/Constants";
import { BlockType } from "./blocks_data";
import GridPlaceable from "../GridPlaceable";
import { noop } from "lodash";
export enum Blocks {
  red,
  blue,
  yellow,
}

export default class Block extends GridPlaceable {
  //TODO: design a loot system
  private loot: any;
  private blockType: Blocks;
  private maxHp: number;
  private currentHp: number;
  constructor({
    scene,
    x,
    y,
    block,
  }: {
    scene: Phaser.Scene;
    x: number;
    y: number;
    block: BlockType;
  }) {
    super(scene, x, y, "block");
    this.scene.physics.add.existing(this);
    this.blockType = block.type;
    this.maxHp = block.hp;
    this.setTint(block.color);
  }

  face = noop;

  static spriteDependencies: SpriteDependency[] = [
    {
      frameWidth: 64,
      frameHeight: 64,
      key: "block",
      url: "src/assets/sprites/block.png",
    },
  ];
}
