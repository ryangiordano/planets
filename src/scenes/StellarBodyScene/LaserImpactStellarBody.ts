import LargeStellarBody from "../../components/planet/LargeStellarBody";
import { LaserImpact } from "../../components/player/MiningLaser";

/** Establishes basic behavior on hitting a stellar body with a laser */
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
      if (stellarBody.noYieldLeft()) {
        //TODO: Fire off a notif
        console.log("No elements left");
      } else if (laserImpact.isActive) {
        onHitStellarBody(laserImpact, stellarBody);
      }
      laserImpact.handleImpact();
    }
  );
}
