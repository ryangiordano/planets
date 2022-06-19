import { setRemainingYield } from "../../assets/data/stellar-bodies/StellarBodyRepository";
import LargeStellarBody from "../../components/planet/LargeStellarBody";
import { LaserImpact } from "../../components/player/LargeLaser";
import { BLACK } from "../../utility/Constants";
import { getRandomInt } from "../../utility/Utility";
import { StateScene } from "../StateScene/StateScene";

export function handleHarvest(
  scene: Phaser.Scene,
  laserImpact: LaserImpact,
  stellarBody: LargeStellarBody,
  onStellarBodyYieldExhausted: (stellarBodyId: number) => void
) {
  const totalMined = harvestStellarBody(
    scene,
    stellarBody,
    onStellarBodyYieldExhausted
  );
  spawnElementDebris(scene, stellarBody.color, totalMined * 50, laserImpact);
}

function harvestStellarBody(
  scene: Phaser.Scene,
  stellarBody: LargeStellarBody,
  onStellarBodyYieldExhausted: (stellarBodyId: number) => void
) {
  const { remainingYield, resourceType } = stellarBody;
  const stateScene = scene.scene.get("StateScene") as StateScene;
  const totalMined = Math.min(remainingYield, stateScene.resourceGatherSize);
  stellarBody.decrementRemainingYield(totalMined);

  setRemainingYield(
    stellarBody.stellarBodyId,
    Math.max(0, remainingYield - totalMined)
  );

  if (stellarBody.remainingYield <= 0) {
    onStellarBodyYieldExhausted(stellarBody.stellarBodyId);
  }
  scene.game.events.emit("resource-gathered", {
    resourceType,
    totalMined,
  });

  return totalMined;
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
