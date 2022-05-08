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
  private focusedHex: HexTile;
  private playerGroup: Phaser.GameObjects.Group;

  private hexGroup: Phaser.GameObjects.Group;
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
    const cursors = this.input.keyboard.createCursorKeys();

    cursors.space.addListener("down", () => {
      this.scene.sleep("SystemSelectScene");

      this.scene.run(
        "StarSystemScene",
        this.focusedHex.starSystem.systemObject
      );
    });
    this.paintStars();

    const hexMap = buildHexMap(this, 25);
    const save = getSaveData(0);

    const homeSystem = save.startingSystem;

    renderSystem(homeSystem, hexMap);

    this.ship = new Ship({ scene: this, x: 500, y: 500 });
    this.playerGroup = new Phaser.GameObjects.Group(this, [this.ship]);
    this.hexGroup = new Phaser.GameObjects.Group(this, [
      ...Object.keys(hexMap).map((k) => hexMap[k]),
    ]);

    this.physics.add.overlap(
      this.playerGroup,
      this.hexGroup,
      (player: Ship, hex: HexTile) => {
        this.focusedHex?.setSelected(false);
        hex.setSelected(true);
        this.focusedHex = hex;
      }
    );

    this.cameras.main.startFollow(this.ship);

    const startTile = hexMap[`9,10`];
    this.ship.setX(startTile.x);
    this.ship.setY(startTile.y);
  }

  update(time: number, delta: number): void {}
}
