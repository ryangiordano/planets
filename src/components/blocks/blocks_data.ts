import { RED, BLUE, YELLOW } from "../../utility/Constants";
import { Blocks } from "./Block";

export const BlockColors = new Map<Blocks, number>([
  [Blocks.red, RED.hex],
  [Blocks.blue, BLUE.hex],
  [Blocks.yellow, YELLOW.hex],
]);

export type BlockType  = {
  hp: number;
  type: Blocks;
  color: number;
}

export const blocks = {
  [Blocks.red]: {
    hp: 100,
    type: Blocks.red,
    color: BlockColors.get(Blocks.red),
  },

  [Blocks.blue]: {
    hp: 100,
    type: Blocks.blue,
    color: BlockColors.get(Blocks.blue),
  },

  [Blocks.yellow]: {
    hp: 100,
    type: Blocks.yellow,
    color: BlockColors.get(Blocks.yellow),
  },
};
