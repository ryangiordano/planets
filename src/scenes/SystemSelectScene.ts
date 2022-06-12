import Ship from "../components/player/Ship";
import HexTile from "../components/system-select/HexTile";
import DependentScene from "./DependentScene";
import { paintStars } from "./utility";
import {
  buildHexMap,
  unlockHexTile,
} from "../assets/data/star-systems/HexMapController";
import {
  renderSystem,
  renderSystemNeighbors,
} from "../assets/data/star-systems/StarSystemController";
import { getSaveData } from "../assets/data/player/SaveController";
import { StateScene } from "./StateScene/StateScene";
import { NotificationTypes } from "./StateScene/NotificationManagement";
import { getRandomInt } from "../utility/Utility";

export class SystemSelectScene extends DependentScene {
  private ship: Ship;
  private focusedHex: HexTile;
  private playerGroup: Phaser.GameObjects.Group;
  private stars: Phaser.GameObjects.Sprite[];

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
    this.stars = paintStars(this, { x: centerX, y: centerY }, 4000, 2000, 2000);
  }
  create(): void {
    const cursors = this.input.keyboard.createCursorKeys();
    const stateScene = this.scene.get("StateScene") as StateScene;
    const hexMap = buildHexMap(this, 25);
    const save = getSaveData();

    const homeSystem = save.startingSystem;
    renderSystem(homeSystem, hexMap, true, stateScene.getSystemLevel());

    cursors.space.addListener("down", async () => {
      const hex = this.focusedHex;
      if (hex.playerHasAccess) {
        await this.zoomInToStarSystem();
        this.scene.sleep("SystemSelectScene");
        this.scene.run("StarSystemScene", {
          starSystemId: hex.starSystem.starSystemObject.id,
        });
        return;
      }

      const stateScene = this.scene.get("StateScene") as StateScene;

      unlockHexTile(
        hex,
        stateScene.resourceManager.getAllResources(),
        (remainingBalance) => {
          stateScene.incrementSystemLevel();
          renderSystemNeighbors(
            hex.starSystem.starSystemObject,
            hexMap,
            stateScene.getSystemLevel()
          );
          remainingBalance.forEach((resource) => {
            this.game.events.emit("set-resource", resource);
          });
        }
      );
    });

    this.events.on("wake", async () => {
      await this.zoomOutFromStarSystem();
    });

    this.initialZoom();

    this.paintStars();

    this.ship = new Ship({ scene: this, x: 500, y: 500, canFire: false });
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

    const startTile = hexMap[`10,10`];
    this.ship.setX(startTile.x);
    this.ship.setY(startTile.y);
  }

  private initialZoom() {
    return new Promise<void>((resolve) => {
      this.cameras.main.setZoom(0.8);
      this.cameras.main.zoomTo(1, 2500, "Power4", true, (_, progress) => {
        if (progress === 1) {
          resolve();
        }
      });
    });
  }

  private zoomOutFromStarSystem() {
    return new Promise<void>((resolve) => {
      this.cameras.main.fadeIn(350, 56, 56, 56);

      this.cameras.main.setZoom(1.5);
      this.cameras.main.zoomTo(1, 500, "Quint.easeOut", true, (_, progress) => {
        if (progress === 1) {
          resolve();
        }
      });
    });
  }

  private zoomInToStarSystem() {
    return new Promise<void>((resolve) => {
      this.cameras.main.fadeOut(650, 56, 56, 56);

      this.cameras.main.zoomTo(
        1.5,
        500,
        "Quint.easeIn",
        true,
        (_, progress) => {
          if (progress === 1) {
            resolve();
          }
        }
      );
    });
  }

  update(time: number, delta: number): void {
    this.ship.update();
  }
}
