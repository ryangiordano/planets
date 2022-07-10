import { WHITE } from "../../utility/Constants";
import { getRandomInt } from "../../utility/Utility";
import { StateScene } from "../StateScene";
import {
  addNotification,
  NotificationTypes,
} from "../StateScene/NotificationManagement";

interface Projectile {
  potency: number;
  x: number;
  y: number;
}

function tweenLostShields(scene: Phaser.Scene) {
  return new Promise<void>((resolve) => {
    const circle = scene.add.circle(
      scene.game.canvas.width / 2,
      scene.game.canvas.height / 2,
      scene.game.canvas.height,
      WHITE.hex
    );
    const tl = scene.tweens.createTimeline({
      targets: circle,
    });
    tl.add({
      targets: circle,
      ease: "Quint.easeOut",
      alpha: {
        from: 0,
        to: 0.5,
      },
      duration: 500,
    });
    tl.add({
      targets: circle,
      ease: "Quint.easeOut",
      scale: {
        from: 1,
        to: 0,
      },
      alpha: {
        from: 0.5,
        to: 0,
      },
      duration: 250,
      onComplete: () => {
        circle.destroy();
        resolve();
      },
    });
    tl.play();
  });
}

function tweenRegainShields(scene: Phaser.Scene) {
  return new Promise<void>((resolve) => {
    const circle = scene.add.circle(
      scene.game.canvas.width / 2,
      scene.game.canvas.height / 2,
      scene.game.canvas.height,
      WHITE.hex
    );
    const tl = scene.tweens.createTimeline({
      targets: circle,
    });
    tl.add({
      targets: circle,
      ease: "Quint.easeIn",
      scale: {
        from: 0,
        to: 1,
      },
      alpha: {
        from: 0,
        to: 0.5,
      },
      duration: 250,
    });
    tl.add({
      targets: circle,
      ease: "Quint.easeOut",
      alpha: {
        from: 0.5,
        to: 0,
      },
      duration: 500,
      onComplete: () => {
        circle.destroy();
        resolve();
      },
    });

    tl.play();
  });
}

function setOnLostShields(scene: Phaser.Scene) {
  scene.game.events.on(
    "player-shield-decrease",
    async ({ currentPercentage }) => {
      if (currentPercentage === 0) {
        await tweenLostShields(scene);
        addNotification(scene, "Shields down!", NotificationTypes.negative);
      }
    }
  );
}

function setOnRegainShields(scene: Phaser.Scene) {
  scene.game.events.on(
    "player-shield-increase",
    async ({ previousPercentage, currentPercentage }) => {
      if (previousPercentage === 0 && currentPercentage > 0) {
        await tweenRegainShields(scene);
        addNotification(scene, "Shields restored.", NotificationTypes.positive);
      }
    }
  );
}

function damageShip(scene: Phaser.Scene) {
  const stateScene = scene.scene.get("StateScene") as StateScene;
  const { shipStatusManager } = stateScene;
  if (shipStatusManager.shipStatus.shieldModule.currentValue) {
    const circle = scene.add.circle(
      getRandomInt(0, scene.game.canvas.width),
      getRandomInt(0, scene.game.canvas.height),
      getRandomInt(250, 500),
      WHITE.hex
    );
    circle.setScale(0);
    scene.add.tween({
      targets: circle,
      ease: "Quint.easeOut",
      scale: {
        from: 0,
        to: 1,
      },
      alpha: {
        from: 0,
        to: 0.08,
      },
      yoyo: true,
      duration: 250,
      onComplete: () => {
        circle.destroy();
      },
    });
  } else {
    //handle visual for ship damage
  }
  scene.cameras.main.shake(300, 0.008);
}

/** Managing the ship's shields, hull-health and damage taken */
export function buildShipHealth(scene: Phaser.Scene) {
  setOnLostShields(scene);
  setOnRegainShields(scene);

  return { damageShip };
}
