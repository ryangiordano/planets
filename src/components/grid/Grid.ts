import { TILE_SIZE } from "../../Constants";

export class Grid extends Phaser.GameObjects.Container {
  public gridSquares: GridSquare[][];
  private padding: number = 4;
  constructor({ scene, x, y }: { scene: Phaser.Scene; x: number; y: number }) {
    super(scene, x, y);
    this.scene.add.existing(this);
  }

  build() {
    this.gridSquares = [];
    for (let y = 0; y < 3; y++) {
      const row = [];
      for (let x = 0; x < 3; x++) {
        const gridSquare = new GridSquare({
          scene: this.scene,
          x: x * TILE_SIZE + this.padding,
          y: y * TILE_SIZE + this.padding,
          coords: { x, y },
        });
        row.push(gridSquare);
        this.add(gridSquare);
      }
      this.gridSquares.push(row);
    }
  }

  isSquareEmptyAt({ x, y }: Coords) {
    const square = this.getSquareAt({ x, y });
    if (square) {
      return !square.getOccupant();
    }
  }

  squareExistsAt({ x, y }: Coords) {
    return !!this.getSquareAt({ x, y });
  }

  getSquareAt({ x, y }: Coords) {
    if (this.gridSquares[y] && this.gridSquares[y][x]) {
      return this.gridSquares[y][x];
    }
  }
  setOccupantAt({ x, y }: Coords, occupant: Phaser.GameObjects.Sprite | null) {
    if (this.isSquareEmptyAt({ x, y }) && this.squareExistsAt({ x, y })) {
      const currentSquare = this.getSquareAt(
        this.getSquareCoordsOfOccupant(occupant)
      );
      currentSquare?.setOccupant(null);
      const square = this.getSquareAt({ x, y });
      square.setOccupant(occupant);
      occupant.setX(square.x);
      occupant.setY(square.y - occupant.height / 3);
    }
  }
  emptyOccupantAt({ x, y }) {
    this.setOccupantAt({ x, y }, null);
  }

  getSquareCoordsOfOccupant(occupant: Phaser.GameObjects.Sprite | null) {
    for (let y = 0; y < this.gridSquares.length; y++) {
      for (let x = 0; x < this.gridSquares[y].length; x++) {
        if (
          this.squareExistsAt({ x, y }) &&
          this.gridSquares[y][x].getOccupant() === occupant
        ) {
          return { x, y };
        }
      }
    }
    return { x: -1, y: -1 };
  }

  /** Return an empty coordinate if one exists, else return null */
  public findEmptyCoord(): Coords | null {
    const { x, y } = this.getSquareCoordsOfOccupant(null);
    if (x === -1 && y === -1) {
      return null;
    }
    return { x, y };
  }
}

export class GridSquare extends Phaser.GameObjects.Sprite {
  private occupant: Phaser.GameObjects.Sprite | null = null;
  public getOccupant() {
    return this.occupant;
  }
  public setOccupant(occupant: Phaser.GameObjects.Sprite | null) {
    this.occupant = occupant;
  }

  constructor({
    scene,
    x,
    y,
  }: {
    scene: Phaser.Scene;
    x: number;
    y: number;
    coords: Coords;
  }) {
    super(scene, x, y, "tile", 0);
    scene.add.existing(this);
  }

  static spriteDependencies: SpriteDependency[] = [
    {
      frameWidth: 64,
      frameHeight: 64,
      key: "tile",
      url: "src/assets/sprites/tile.png",
    },
  ];
  static audioDependencies: AudioDependency[] = [];
}
