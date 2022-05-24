import StellarBody from "../components/planet/StellarBody";
import DependentScene from "./DependentScene";
import {
  getStarSystem,
  StarSystemObject,
} from "../assets/data/star-systems/StarSystemRepository";
import { buildStarSystemFromId } from "../assets/data/star-systems/StarSystemController";
import Ship from "../components/player/Ship";
import { getRandomInt } from "../utility/Utility";
import { withProximity } from "../utility/Proximity";
import { paintStars } from "./utility/index";
import {
  getStellarBody,
  StellarBodyObject,
} from "../assets/data/stellar-bodies/StellarBodyRepository";
import LargeStellarBody from "../components/planet/LargeStellarBody";
import { setRemainingYield } from "../assets/data/stellar-bodies/StellarBodyRepository";
import { StateScene } from "./StateScene";

export class StellarBodyScene extends DependentScene {
  private stellarBodyContainer: Phaser.GameObjects.Container;
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
    const centerX = this.game.canvas.width / 2;
    const centerY = this.game.canvas.height / 2;
    this.stellarBodyContainer = this.add.container(centerX, centerY);

    this.renderStellarBody(stellarBodyObject);

    const esc = this.input.keyboard.addKey("ESC");

    esc.on("down", () => {
      this.scene.stop();
      this.scene.run("StarSystemScene", getStarSystem(referringSystemId));
    });
  }

  private renderStellarBody(
    stellarBodyObject: StellarBodyObject,
    centerX = 0,
    centerY = 0
  ) {
    const stellarBody = new LargeStellarBody({
      scene: this,
      x: centerX,
      y: centerY,
      size: stellarBodyObject.size,
      color: stellarBodyObject.color,
      maxYield: stellarBodyObject.maxYield,
      remainingYield: stellarBodyObject.remainingYield,
      onHarvest: ({ resourceType, remainingYield }) => {
        const stateScene = this.scene.get("StateScene") as StateScene;
        const totalMined = Math.min(
          remainingYield,
          stateScene.resourceGatherSize
        );
        stellarBody.decrementRemainingYield(totalMined);
        setRemainingYield(stellarBodyObject.id, totalMined);
        this.game.events.emit("resource-gathered", {
          resourceType,
          totalMined,
        });
      },
      onHarvestFailure: () => {
        //TODO: Fire off a notif
        console.log("No elements left");
      },
      resourceType: stellarBodyObject.resourceType,
    });

    this.stellarBodyContainer.add(stellarBody);
    if (stellarBodyObject.orbit) {
      stellarBodyObject.orbit.forEach((sbo) => {
        const moon = this.renderStellarBody(
          sbo,
          stellarBody.x + stellarBody.displayWidth,
          getRandomInt(-(stellarBody.height / 6), stellarBody.height / 6)
        );

        this.stellarBodyContainer.add(moon);

        this.startMoonOrbit(
          moon as LargeStellarBody,
          getRandomInt(0, 3) % 2 === 0,
          stellarBody.displayWidth * getRandomInt(2, 4),
          sbo.rotationSpeed
        );
      });
    }
    return stellarBody;
  }

  private startMoonOrbit(
    moon: LargeStellarBody,
    top: boolean = true,
    distance,
    rotationSpeed
  ) {
    if (top) {
      this.stellarBodyContainer.sendToBack(moon);
    } else {
      this.stellarBodyContainer.bringToTop(moon);
    }

    this.tweens.add({
      targets: [moon],
      ease: "Linear",
      duration: rotationSpeed * 150,
      x: top ? `-=${distance}` : `+=${distance}`,
      onComplete: () => {
        this.startMoonOrbit(moon, !top, distance, rotationSpeed);
      },
    });
  }

  update(time: number, delta: number): void {}
}
