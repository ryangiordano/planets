import MiningLaser, {
  LaserImpact,
  LaserTarget,
} from "../../components/player/MiningLaser";

/** Lasers, when hitting something, will leave an impact animation behind
 * This impact is added to a laserImpactGroup, where other entities can react
 * according to being struck by a laser.
 */
function setLaserLaserTargetCollision(
  scene: Phaser.Scene,
  laserGroup: Phaser.GameObjects.Group,
  laserTargetGroup: Phaser.GameObjects.Group,
  laserImpactGroup: Phaser.GameObjects.Group,
  onLaserImpact?: (laser: MiningLaser, laserTarget: LaserTarget) => void
) {
  scene.physics.add.overlap(
    laserGroup,
    laserTargetGroup,
    (laser: MiningLaser, laserTarget: LaserTarget) => {
      onLaserImpact?.(laser, laserTarget);
      laser.destroy();
      laserImpactGroup.add(
        new LaserImpact(scene, laserTarget.x, laserTarget.y)
      );
      laserTarget.destroy();
    }
  );
}

/** When called, player can fire lasers from alternating parts of the bottom of the screen */
export function buildFiringBehavior(
  scene: Phaser.Scene,
  laserGroup: Phaser.GameObjects.Group,
  laserTargetGroup: Phaser.GameObjects.Group,
  laserImpactGroup: Phaser.GameObjects.Group,
  onLaserImpact?: (laser: MiningLaser, laserTarget: LaserTarget) => void
) {
  let fireCount = 0;
  scene.input.on("pointerdown", (pointer) => {
    /** Alternating parts of the screen to fire from */
    fireCount++;
    const placeholderCoords = {
      x: scene.game.canvas.width / (fireCount % 2 ? 4 : 1.25),
      y: scene.game.canvas.height,
    };

    const miningLaser = new MiningLaser({
      scene: scene,
      ...placeholderCoords,
      targetX: pointer.x,
      targetY: pointer.y,
    });

    laserGroup.add(miningLaser);
    laserTargetGroup.add(new LaserTarget(scene, pointer.x, pointer.y));
  });

  setLaserLaserTargetCollision(
    scene,
    laserGroup,
    laserTargetGroup,
    laserImpactGroup,
    onLaserImpact
  );
}
