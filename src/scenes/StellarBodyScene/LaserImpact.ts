import LargeStellarBody from "../../components/planet/LargeStellarBody";
import { LaserImpact } from "../../components/player/LargeLaser";

/** Establishes basic behavior on hitting a stellar body with a la */
export function buildLaserImpactStellarBodyBehavior(
  scene: Phaser.Scene,
  laserImpactGroup: Phaser.GameObjects.Group,
  stellarBodyGroup: Phaser.GameObjects.Group,
  onHitStellarBody: (
    laserImpact: LaserImpact,
    stellarBody: LargeStellarBody
  ) => void
) {
  scene.physics.add.overlap(
    laserImpactGroup,
    stellarBodyGroup,
    (laserImpact: LaserImpact, stellarBody: LargeStellarBody) => {
      if (laserImpact.isActive) {
        onHitStellarBody(laserImpact, stellarBody);
      }
      laserImpact.handleImpact();
    }
  );
}

