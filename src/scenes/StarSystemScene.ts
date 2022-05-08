import StellarBody from "../components/planet/StellarBody";
import DependentScene from "./DependentScene";
import {
  getStarSystem,
  StarSystemObject,
} from "../assets/data/repositories/StarSystemRepository";
import { buildStarSystemFromId } from "../assets/data/controllers/StarSystemController";
import Ship from "../components/player/Ship";
import { withProximity } from "../utility/Proximity";
import { paintStars } from "./utility/index";

const MAX_SYSTEM_SIZE = 2000;

export class StarSystemScene extends DependentScene {
  private sun: StellarBody;
  private ship: Ship;
  private playerGroup: Phaser.GameObjects.Group;
  private planetGroup: Phaser.GameObjects.Group;
  private focusedStellarBody: StellarBody;
  constructor() {
    super({
      key: "StarSystemScene",
    });
  }

  static spriteDependencies: SpriteDependency[] = [
    ...StellarBody.spriteDependencies,
    ...Ship.spriteDependencies,
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
    paintStars(
      this,
      { x: centerX, y: centerY },
      1000,
      MAX_SYSTEM_SIZE,
      MAX_SYSTEM_SIZE
    );
  }
  create(systemObject: StarSystemObject): void {
    const cursors = this.input.keyboard.createCursorKeys();

    cursors.space.addListener("down", () => {
      if (this.focusedStellarBody) {
        this.scene.sleep("StarSystemScene");

        this.scene.run("StellarBodyScene", {
          stellarBodyId: this.focusedStellarBody.id,
          referringSystemId: systemObject.id,
        });
      }
    });

    this.paintStars();
    this.sun = buildStarSystemFromId(this, systemObject.id);
    this.ship = new Ship({
      scene: this,
      x: this.sun.x - this.sun.distanceFromCenter / 1.5,
      y: this.sun.y - this.sun.distanceFromCenter / 1.5,
    });
    this.playerGroup = new Phaser.GameObjects.Group(this, [this.ship]);
    this.planetGroup = new Phaser.GameObjects.Group(this, this.sun.orbit);

    this.physics.add.overlap(
      this.playerGroup,
      this.planetGroup,
      (ship: Ship, planet: StellarBody) => {
        planet.setFocused(true);
        this.focusedStellarBody = planet;
        setTimeout(() => {
          if (!this.physics.overlap(ship, planet)) {
            this.focusedStellarBody = null;
            planet.setFocused(false);
          }
        }, 500);
      }
    );

    withProximity({
      scene: this,
      objectWithProximity: this.sun,
      groupToDetect: this.playerGroup,
      onEnter: () => {},
      onLeave: () => {
        this.scene.run("SystemSelectScene");
        this.scene.stop("StarSystemScene");
      },
      size: this.sun.getOrbitSize() / 150,
    });

    this.cameras.main.startFollow(this.ship);
  }

  update(time: number, delta: number): void {
    this.sun.update(time, delta);
  }
}
