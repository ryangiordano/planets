import DependentScene from "./DependentScene";
import { getStarSystem } from "../assets/data/star-systems/StarSystemRepository";
import Ship from "../components/player/Ship";
import { getRandomInt } from "../utility/Utility";
import { paintStars } from "./utility/index";
import LargeStellarBody from "../components/planet/LargeStellarBody";
import {
  setRemainingYield,
  StellarBodyObject,
  getStellarBody,
} from "../assets/data/stellar-bodies/StellarBodyRepository";
import { StateScene } from "./StateScene";
import { LaserImpact, LaserTarget } from "../components/player/MiningLaser";
import MiningLaser from "../components/player/MiningLaser";
import { BLACK } from "../utility/Constants";
import { UIScene } from "./UIScene";

export class StellarBodyScene extends DependentScene {
  private stellarBodyContainer: Phaser.GameObjects.Container;
  private laserTargetGroup: Phaser.GameObjects.Group;
  private laserImpactGroup: Phaser.GameObjects.Group;
  private laserGroup: Phaser.GameObjects.Group;
  private stellarBodyGroup: Phaser.GameObjects.Group;

  constructor() {
    super({
      key: "StellarBodyScene",
    });
  }

  static spriteDependencies: SpriteDependency[] = [
    ...LargeStellarBody.spriteDependencies,
    ...Ship.spriteDependencies,
    ...MiningLaser.spriteDependencies,
    ...LaserImpact.spriteDependencies,
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
    this.laserTargetGroup = new Phaser.GameObjects.Group(this, []);
    this.laserImpactGroup = new Phaser.GameObjects.Group(this, []);
    this.laserGroup = new Phaser.GameObjects.Group(this, []);
    this.stellarBodyGroup = new Phaser.GameObjects.Group(this, []);

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

    let fireCount = 0;
    this.input.on("pointerdown", (pointer) => {
      /** Alternating parts of the screen to fire from */
      fireCount++;
      const placeholderCoords = {
        x: this.game.canvas.width / (fireCount % 2 ? 4 : 1.25),
        y: this.game.canvas.height,
      };

      const miningLaser = new MiningLaser({
        scene: this,
        ...placeholderCoords,
        targetX: pointer.x,
        targetY: pointer.y,
      });
      this.laserGroup.add(miningLaser);
      this.laserTargetGroup.add(new LaserTarget(this, pointer.x, pointer.y));
    });

    this.physics.add.overlap(
      this.laserImpactGroup,
      this.stellarBodyGroup,
      (laserImpact: LaserImpact, stellarBody: LargeStellarBody) => {
        if (stellarBody.noYieldLeft()) {
          //TODO: Fire off a notif
          console.log("No elements left");
        } else if (laserImpact.isActive) {
          this.handleHarvest(laserImpact, stellarBody);
        }
        laserImpact.handleImpact();

      }
    );

    this.physics.add.overlap(
      this.laserGroup,
      this.laserTargetGroup,
      (laser: MiningLaser, laserTarget: LaserTarget) => {
        laser.destroy();
        this.laserImpactGroup.add(
          new LaserImpact(this, laserTarget.x, laserTarget.y)
        );
        laserTarget.destroy();
      }
    );
  }

  private handleHarvest(
    laserImpact: LaserImpact,
    stellarBody: LargeStellarBody
  ) {
    const totalMined = this.harvestStellarBody(stellarBody);
    spawnElementDebris(this, stellarBody.color, totalMined * 50, laserImpact);
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
      resourceType: stellarBodyObject.resourceType,
      stellarBodyId: stellarBodyObject.id,
    });

    this.stellarBodyGroup.add(stellarBody);
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

  private harvestStellarBody(stellarBody: LargeStellarBody) {
    const { remainingYield, resourceType } = stellarBody;
    const stateScene = this.scene.get("StateScene") as StateScene;
    const totalMined = Math.min(remainingYield, stateScene.resourceGatherSize);
    stellarBody.decrementRemainingYield(totalMined);

    setRemainingYield(
      stellarBody.stellarBodyId,
      Math.max(0, remainingYield - totalMined)
    );
    this.game.events.emit("resource-gathered", {
      resourceType,
      totalMined,
    });

    return totalMined;
  }
}

function spawnElementDebris(
  scene: Phaser.Scene,
  color: number,
  numberToSpawn: number,
  coords: { x: number; y: number }
) {
  for (let i = 0; i <= numberToSpawn; i++) {
    const circle = scene.add.circle(
      coords.x,
      coords.y,
      getRandomInt(5, 10),
      color
    );

    circle.setStrokeStyle(3, BLACK.hex);
    scene.tweens.add({
      targets: [circle],
      x: { from: coords.x, to: getRandomInt(coords.x - 100, coords.x + 100) },
      y: { from: coords.y, to: getRandomInt(coords.y - 100, coords.y + 100) },
      duration: getRandomInt(300, 500),
      ease: "Power4",
      onComplete: () => {
        const randomX = getRandomInt(-270, -170);
        const randomY = getRandomInt(-150, -100);
        scene.tweens.add({
          targets: [circle],
          x: {
            from: circle.x,
            to: scene.game.canvas.width + randomX,
          },
          y: {
            from: circle.y,
            to: scene.game.canvas.height + randomY,
          },
          scale: { from: 1, to: 3 },
          duration: getRandomInt(500, 800),
          alpha: { from: 1, to: 0.3 },
          // ease: "Power4",
          onComplete: () => {
            circle.destroy();
          },
        });
      },
    });
  }
}
