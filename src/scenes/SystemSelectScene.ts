import Ship from "../components/player/Ship";
import HexTile from "../components/system-select/HexTile";
import DependentScene from "./DependentScene";
import { paintStars } from "./utility";
import { buildHexMap } from "../assets/data/controllers/HexMapController";
import {
  renderSystem,
  renderSystemNeighbors,
} from "../assets/data/controllers/StarSystemController";
import { getSaveData } from "../assets/data/controllers/SaveController";

export class SystemSelectScene extends DependentScene {
  private ship: Ship;
  private playerGroup: Phaser.GameObjects.Group;

  constructor() {
    super({
      key: "SystemSelectScene",
    });
  }

  static spriteDependencies: SpriteDependency[] = [
    ...Ship.spriteDependencies,
    ...HexTile.spriteDependencies,
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
    paintStars(this, { x: centerX, y: centerY }, 4000, 2000, 2000);
  }
  create(): void {
    this.paintStars();

    const hexMap = buildHexMap(this, 25);
    const save = getSaveData(0);

    const homeSystem = save.startingSystem;

    renderSystem(homeSystem, hexMap);
    // renderSystemNeighbors(homeSystem, hexMap);

    this.ship = new Ship({ scene: this, x: 500, y: 500 });
    this.playerGroup = new Phaser.GameObjects.Group(this, [this.ship]);
    this.cameras.main.startFollow(this.ship);

    const startTile = hexMap[`9,10`];
    this.ship.setX(startTile.x);
    this.ship.setY(startTile.y);
  }

  update(time: number, delta: number): void {}
}
