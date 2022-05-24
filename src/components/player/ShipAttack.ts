import { throttle } from "lodash";
import Laser from "./Laser";
import Ship from "./Ship";

export function createShipAttackModule(
  ship: Ship,
  scene: Phaser.Scene,
  rate: number,
  onFire: (gameObject: Laser) => void
) {
  throttleFire(
    scene,
    () => {
      onFire(fireLaser(scene, ship.angle, ship.x, ship.y));
    },
    rate
  );
}

function throttleFire(
  scene: Phaser.Scene,
  handleFire: () => void,
  rate: number
) {
  const throttledAttack = throttle(handleFire, rate);
  scene.input.on("pointerdown", throttledAttack);
}

function fireLaser(
  scene: Phaser.Scene,
  angle: number,
  x: number,
  y: number
): Laser {
  return scene.add.existing(
    new Laser({ scene, angle: angle - 90, x, y })
  ) as Laser;
}
