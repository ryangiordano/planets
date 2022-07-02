import { debounce, throttle } from "lodash";
import { WHITE } from "../../../utility/Constants";

const shieldsUp = (
  scene: Phaser.Scene,
  shields: Phaser.GameObjects.Ellipse[]
) => {
  scene.add.tween({
    targets: shields,
    scale: {
      from: 0,
      to: 1,
    },
    alpha: {
      from: 0,
      to: 1,
    },
    duration: 500,
    ease: "Quart.easeOut",
  });
};

const shieldsDown = (
  scene: Phaser.Scene,
  shields: Phaser.GameObjects.Ellipse[]
) => {
  scene.add.tween({
    targets: shields,
    scale: {
      from: 1,
      to: 0,
    },
    alpha: {
      from: 1,
      to: 0,
    },
    duration: 500,
    ease: "Quart.easeOut",
  });
};

export class ShipShieldsIndicator extends Phaser.GameObjects.Container {
  private firstCircle: Phaser.GameObjects.Ellipse;
  private secondCircle: Phaser.GameObjects.Ellipse;
  private thirdCircle: Phaser.GameObjects.Ellipse;
  private currentPercentage: number = 0;
  constructor({
    scene,
    x,
    y,
    currentPercentage,
  }: {
    scene: Phaser.Scene;
    x: number;
    y: number;
    currentPercentage: number;
  }) {
    super(scene, x, y);
    this.scene.add.existing(this);
    this.buildShields();
    this.setShieldPercentage(currentPercentage);
  }

  private getShields() {
    return [this.firstCircle, this.secondCircle, this.thirdCircle];
  }
  private buildShields() {
    const circleSize = 100;
    this.firstCircle = new Phaser.GameObjects.Ellipse(
      this.scene,
      0,
      0,
      circleSize,
      circleSize,
      WHITE.hex,
      0.1
    );

    this.secondCircle = new Phaser.GameObjects.Ellipse(
      this.scene,
      0,
      0,
      circleSize * 2,
      circleSize * 2,
      WHITE.hex,
      0.1
    );

    this.thirdCircle = new Phaser.GameObjects.Ellipse(
      this.scene,
      0,
      0,
      circleSize * 3,
      circleSize * 3,
      WHITE.hex,
      0.1
    );
    this.setScale(0.6, 0.6);
    /** Set shields invisible on first build */
    this.getShields().forEach((s) => {
      s.setAlpha(0);
      s.setScale(0);
      this.add(s);
    });
  }

  setShieldPercentage(shieldPercentage: number) {
    if (shieldPercentage > this.currentPercentage) {
      this.shieldsUp(shieldPercentage);
    } else {
      this.shieldsDown(shieldPercentage);
    }
    this.currentPercentage = shieldPercentage;
  }

  private shieldsUp(percentage: number) {
    const shields = [];
    if (percentage >= 0.7 && this.thirdCircle.alpha === 0) {
      shields.push(this.thirdCircle);
    }
    if (percentage >= 0.5 && this.secondCircle.alpha === 0) {
      shields.push(this.secondCircle);
    }
    if (percentage >= 0.3 && this.firstCircle.alpha === 0) {
      shields.push(this.firstCircle);
    }
    shields.forEach((s) => shieldsUp(this.scene, s));
    shieldsUp(this.scene, shields);
  }
  private shieldsDown(percentage: number) {
    const shields = [];
    if (percentage < 0.7 && this.thirdCircle.alpha === 1) {
      shields.push(this.thirdCircle);
    }
    if (percentage < 0.5 && this.secondCircle.alpha === 1) {
      shields.push(this.secondCircle);
    }
    if (percentage < 0.3 && this.firstCircle.alpha === 1) {
      shields.push(this.firstCircle);
    }
    shields.forEach((s) => shieldsDown(this.scene, s));
    shieldsDown(this.scene, shields);
  }
}

export class ShipHullIndicator extends Phaser.GameObjects.Container {
  private currentPercentage: number;
  constructor({
    scene,
    x,
    y,
    currentPercentage,
  }: {
    scene: Phaser.Scene;
    x: number;
    y: number;
    currentPercentage: number;
  }) {
    super(scene, x, y);
    this.scene.add.existing(this);
    this.buildHull();
    this.setScale(0.6, 0.6);
    this.currentPercentage = currentPercentage;
  }
  buildHull() {
    const mainSquare = new Phaser.GameObjects.Rectangle(
      this.scene,
      0,
      0,
      65,
      65,
      WHITE.hex,
      0.5
    );

    const leftSquare = new Phaser.GameObjects.Rectangle(
      this.scene,
      -40,
      65,
      35,
      35,
      WHITE.hex,
      0.5
    );

    const rightSquare = new Phaser.GameObjects.Rectangle(
      this.scene,
      40,
      65,
      35,
      35,
      WHITE.hex,
      0.5
    );
    this.scene.add.existing(mainSquare);
    this.scene.add.existing(leftSquare);
    this.scene.add.existing(rightSquare);
    this.add([mainSquare, leftSquare, rightSquare]);
  }
}

export class ShipStatusIndicator extends Phaser.GameObjects.Container {
  public shieldsIndicator: ShipShieldsIndicator;
  public hullIndicator: ShipHullIndicator;
  constructor({
    scene,
    x,
    y,
    shieldPercentage,
    healthPercentage,
  }: {
    scene: Phaser.Scene;
    x: number;
    y: number;
    shieldPercentage: number;
    healthPercentage: number;
  }) {
    super(scene, x, y);
    this.scene.add.existing(this);
    this.shieldsIndicator = new ShipShieldsIndicator({
      scene,
      x: 0,
      y: 0,
      currentPercentage: shieldPercentage,
    });
    this.hullIndicator = new ShipHullIndicator({
      scene,
      x: 0,
      y: 0,
      currentPercentage: healthPercentage,
    });
    this.add([this.shieldsIndicator, this.hullIndicator]);
    this.buildEngineExhaust();
  }

  buildEngineExhaust() {
    const particles = this.scene.add.particles("ship", 1);

    const { x, y } = this.scene.cameras.main.getWorldPoint(this.x, this.y);
    const emitter = particles.createEmitter({
      x,
      y: y + 65,
      scale: { start: 1.8, end: 0 },
      blendMode: "ADD",
      angle: 90,
      speed: 100,
      frequency: 300,
      alpha: 0.5,
    });
  }
}
