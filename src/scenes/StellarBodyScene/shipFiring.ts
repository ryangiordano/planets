import LargeLaser, {
  LaserImpact,
  LaserTarget,
} from "../../components/player/LargeLaser";

/** Lasers, when hitting something, will leave an impact animation behind
 * This impact is added to a laserImpactGroup, where other entities can react
 * according to being struck by a laser.
 */
export function setLaserLaserTargetCollision(
  scene: Phaser.Scene,
  laserGroup: Phaser.GameObjects.Group,
  laserTargetGroup: Phaser.GameObjects.Group,
  laserImpactGroup: Phaser.GameObjects.Group,
  onLaserImpact?: (laser: LargeLaser, laserTarget: LaserTarget) => void
) {
  scene.physics.add.overlap(
    laserGroup,
    laserTargetGroup,
    (laser: LargeLaser, laserTarget: LaserTarget) => {
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
  onLaserImpact?: (laser: LargeLaser, laserTarget: LaserTarget) => void
) {
  let fireCount = 0;
  scene.input.on("pointerdown", (pointer) => {
    /** Alternating parts of the screen to fire from */
    fireCount++;
    fireLaser(
      scene,
      fireCount % 2
        ? getLeftLaserPosition(scene)
        : getRightLaserPosition(scene),
      scene.game.canvas.height,
      pointer,
      laserGroup,
      laserTargetGroup
    );
  });

  setLaserLaserTargetCollision(
    scene,
    laserGroup,
    laserTargetGroup,
    laserImpactGroup,
    onLaserImpact
  );
}

export function fireLaser(
  scene: Phaser.Scene,
  x: number,
  y: number,
  pointer: { x: number; y: number },
  laserGroup: Phaser.GameObjects.Group,
  laserTargetGroup: Phaser.GameObjects.Group
) {
  return new Promise<void>((resolve) => {
    const placeholderCoords = {
      x,
      y,
    };

    const miningLaser = new LargeLaser({
      scene: scene,
      ...placeholderCoords,
      targetX: pointer.x,
      targetY: pointer.y,
      onHitTarget: () => {
        resolve();
      },
    });

    laserGroup.add(miningLaser);
    laserTargetGroup.add(new LaserTarget(scene, pointer.x, pointer.y));
  });
}

export function getLeftLaserPosition(scene: Phaser.Scene) {
  return scene.game.canvas.width / 4;
}

export function getRightLaserPosition(scene: Phaser.Scene) {
  return scene.game.canvas.width / 1.25;
}
