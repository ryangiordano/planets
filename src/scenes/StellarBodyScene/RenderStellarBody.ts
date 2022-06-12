import { StellarBodyObject } from "../../assets/data/stellar-bodies/StellarBodyRepository";
import LargeStellarBody from "../../components/planet/LargeStellarBody";
import { getRandomPointOnCircle, getRandomInt } from "../../utility/Utility";

/** Recursively render stellar bodies and those in orbit of the body. */
export function renderStellarBody({
  scene,
  stellarBodyGroup,
  stellarBodyContainer,
  stellarBodyObject,
  centerX,
  centerY,
}: {
  scene: Phaser.Scene;
  stellarBodyGroup: Phaser.GameObjects.Group;
  stellarBodyContainer: Phaser.GameObjects.Container;
  stellarBodyObject: StellarBodyObject;
  centerX: number;
  centerY: number;
}) {
  const stellarBody = new LargeStellarBody({
    scene: scene,
    x: centerX,
    y: centerY,
    size: stellarBodyObject.size,
    color: stellarBodyObject.color,
    maxYield: stellarBodyObject.maxYield,
    remainingYield: stellarBodyObject.remainingYield,
    resourceType: stellarBodyObject.resourceType,
    stellarBodyId: stellarBodyObject.id,
  });

  stellarBodyGroup.add(stellarBody);
  stellarBodyContainer.add(stellarBody);
  if (stellarBodyObject.orbit) {
    stellarBodyObject.orbit.forEach((sbo) => {
      const { x, y } = getRandomPointOnCircle(
        { x: centerX, y: centerY },
        stellarBody.displayWidth * getRandomInt(1, 2.5)
      );
      const moon = renderStellarBody({
        scene,
        stellarBodyGroup,
        stellarBodyContainer,
        stellarBodyObject: sbo,
        centerX: x,
        centerY: y,
      });

      stellarBodyContainer.add(moon);
    });
  }
  return stellarBody;
}
