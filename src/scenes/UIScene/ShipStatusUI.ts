import { ShipStatusIndicator } from "../../components/UI/ship_status/ShipStatusIndicator";

export function buildShipStatusUI(scene: Phaser.Scene) {
  const shipStatusIndicator = new ShipStatusIndicator({
    scene,
    x: scene.game.canvas.width - 550,
    y: scene.game.canvas.height - 180,
    healthPercentage: 1,
    shieldPercentage: 1,
  });


  scene.game.events.on("player-shield-increase", () => {});
  scene.game.events.on("player-shield-decrease", () => {});
  scene.game.events.on("player-health-increase", () => {});
  scene.game.events.on("player-health-decrease", () => {});

  return shipStatusIndicator;
}
