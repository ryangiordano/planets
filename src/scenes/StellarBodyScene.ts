import StellarBody from "../components/planet/StellarBody";
import DependentScene from "./DependentScene";
import {
  getStarSystem,
  StarSystemObject,
} from "../assets/data/repositories/StarSystemRepository";
import { buildStarSystem } from "../assets/data/controllers/StarSystemController";
import Ship from "../components/player/Ship";
import { getRandomInt } from "../utility/Utility";
import { withProximity } from "../utility/Proximity";
import { paintStars } from "./utility/index";
import {
  getStellarBody,
  StellarBodyObject,
} from "../assets/data/repositories/StellarBodyRepository";
import LargeStellarBody from "../components/planet/LargeStellarBody";

export class StellarBodyScene extends DependentScene {
  constructor() {
    super({
      key: "StellarBodyScene",
    });
  }

  static spriteDependencies: SpriteDependency[] = [
    ...LargeStellarBody.spriteDependencies,
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
    paintStars(this, { x: centerX, y: centerY }, 500, 2000, 2000);
  }
  create({ stellarBodyId, referringSystemId }): void {
    const stellarBodyObject = getStellarBody(stellarBodyId);
    if (!stellarBodyObject) {
      throw new Error(`Stellar Body does not exist at ${stellarBodyId}`);
    }
    this.paintStars();

    this.renderStellarBody(stellarBodyObject);

    const esc = this.input.keyboard.addKey("ESC");

    esc.on("down", () => {
      this.scene.stop();
      this.scene.run("MainScene", getStarSystem(referringSystemId));
    });
  }

  private renderStellarBody(stellarBodyObject: StellarBodyObject) {
    const centerX = this.game.canvas.width / 2;
    const centerY = this.game.canvas.height / 2;
    console.log(stellarBodyObject);
    const stellarBody = new LargeStellarBody({
      scene: this,
      x: centerX,
      y: centerY,
      size: stellarBodyObject.size,
      color: stellarBodyObject.color,
      id: stellarBodyObject.id,
      onHarvest: (payload) => {
        /** Add payload to state
         * Update UI based on state updates.
         */
        console.log(payload.content[0]);
      },
      composition: stellarBodyObject.composition,
    });
    this.add.existing(stellarBody);
  }

  update(time: number, delta: number): void {}
}
