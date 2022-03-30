import { Grid, GridSquare } from "./grid/Grid";
import Player from "./player/Player";
import { Directions } from "../Constants";
import Enemy from "./enemy/Enemy";
import GridPlaceable from "./GridPlaceable";
import Block from "./blocks/Block";
import BlockStack from "./blocks/BlockStack";

export default class GridController {
  private scene: Phaser.Scene;
  private grid: Grid;
  constructor({ scene, grid }: { scene: Phaser.Scene; grid: Grid }) {
    this.scene = scene;
    this.grid = grid;
  }
  init() {
    this.grid.build();
  }

  public moveToCenter(placeable: GridPlaceable) {
    this.moveToCoord({ x: 1, y: 1 }, placeable);
  }

  public moveToCoord({ x, y }: Coords, placeable: GridPlaceable) {
    this.grid.setOccupantAt({ x, y }, placeable);
  }

  public addToGrid(placeable: GridPlaceable, coords?: Coords) {
    if (coords && this.grid.isSquareEmptyAt(coords)) {
      this.grid.add(placeable);
      this.moveToCoord(coords, placeable);
      return;
    }
    const emptyCoord = this.findEmptyCoord();
    if (emptyCoord) {
      this.grid.add(placeable);
      this.moveToCoord(emptyCoord, placeable);
    } else {
      throw new Error("No room on the grid for entity");
    }
    return;
  }

  public addBlockToGrid(block: Block, coords?: Coords) {
    const coordsActual = coords || this.grid.findEmptyCoord();
    if (!coordsActual) {
      return;
    }
    if (this.grid.isSquareEmptyAt(coordsActual)) {
      const blockStack = new BlockStack({
        scene: this.scene,
        x: 0,
        y: 0,
      });
      this.addToGrid(blockStack, coordsActual);
      this.moveToCoord(coordsActual, blockStack);
      blockStack.addBlock(block);
      return;
    }

    const desiredSquare = coordsActual && this.grid.getSquareAt(coordsActual);
    const occupant = desiredSquare?.getOccupant();
    const isBlockStack = occupant?.hasOwnProperty("blocks");
    if (desiredSquare && isBlockStack) {
      const blockStack = occupant as unknown as BlockStack;
      blockStack.addBlock(block);
    }
  }

  private findEmptyCoord() {
    return this.grid.findEmptyCoord();
  }

  /** Use this function to register movements on the GridController from the placeable */
  public handleMove(direction: Directions, placeable: GridPlaceable) {
    const { x, y } = this.grid.getSquareCoordsOfOccupant(placeable);
    if (x === -1 || y === -1) {
      return;
    }
    switch (direction) {
      case Directions.down:
        this.moveToCoord({ x, y: y + 1 }, placeable);
        break;
      case Directions.up:
        this.moveToCoord({ x, y: y - 1 }, placeable);

        break;
      case Directions.left:
        this.moveToCoord({ x: x - 1, y }, placeable);

        break;
      case Directions.right:
        this.moveToCoord({ x: x + 1, y }, placeable);
        break;
    }
  }
}
