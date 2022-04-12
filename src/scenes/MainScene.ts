import StellarBody from "../components/planet/StellarBody";
import DependentScene from "./DependentScene";
import { getStarSystem } from "../assets/data/repositories/StarSystemRepository";
import { buildStarSystem } from "../assets/data/controllers/StarSystemController";
import Ship from "../components/player/Ship";
import { getRandomInt } from "../utility/Utility";
import { withProximity } from "../utility/Proximity";
import { paintStars } from "./utility/index";

const MAX_SYSTEM_SIZE = 2000;

export class MainScene extends DependentScene {
  private sun: StellarBody;
  private ship: Ship;
  private playerGroup: Phaser.GameObjects.Group;
  constructor() {
    super({
      key: "MainScene",
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
  create(): void {
    this.paintStars();
    this.sun = buildStarSystem(this, 0);

    this.ship = new Ship({ scene: this, x: 500, y: 500 });
    this.playerGroup = new Phaser.GameObjects.Group(this, [this.ship]);

    withProximity({
      scene: this,
      objectWithProximity: this.sun,
      groupToDetect: this.playerGroup,
      onEnter: () => {
        console.log("We entered");
      },
      onLeave: () => {
        //TODO: When we leave, we transition to the parent scene
        console.log("We left here");
      },
      // Need to get this from the sun object
      size: this.sun.getOrbitSize() / 150,
    });
    this.cameras.main.startFollow(this.ship);
  }

  update(time: number, delta: number): void {
    this.sun.update(time, delta);
  }
}
