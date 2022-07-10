import { ShipStatus, ShipModules } from "./ShipStatus";
import { ShipStatusObject } from "./types";

export function buildShipManagement(
  scene: Phaser.Scene,
  shipStatusObject: ShipStatusObject
) {
  const shipStatus = new ShipStatus(shipStatusObject, (currentLevel) => {
    scene.game.events.emit("player-level-up", {
      currentLevel,
      currentXP: shipStatus.xpGainedThisLevel,
      maxXP: shipStatus.getXPToNextLevel(),
    });
  });

  function increaseModuleLevel(module: ShipModules, value: number) {
    shipStatus.increaseModuleLevel(module, value);
    scene.game.events.emit("player-module-level-increase", {
      module,
      level: shipStatus.moduleMap.get(module).level,
    });
  }

  function incrementXP(value: number) {
    shipStatus.incrementXP(value);
    scene.game.events.emit("player-xp-increase", {
      currentXP: shipStatus.xpGainedThisLevel,
      maxXP: shipStatus.getXPToNextLevel(),
    });
  }

  function takeDamage(potency: number) {
    shipStatus.takeDamage({
      potency,
      onDamageShield: () => {
        scene.game.events.emit("player-shield-decrease", {
          currentPercentage: shipStatus.shieldModule.getPercentage(),
        });
      },
      onDamageHealth: () => {
        scene.game.events.emit("player-health-decrease", {
          currentPercentage: shipStatus.healthModule.getPercentage(),
        });
      },
      onDeath: () => {
        scene.game.events.emit("game-over");
      },
    });
  }

  function recoverShield(potency: number) {
    const prevPercentage = shipStatus.shieldModule.getPercentage();
    shipStatus.recoverShield(potency);
    scene.game.events.emit("player-shield-increase", {
      previousPercentage: prevPercentage,
      currentPercentage: shipStatus.shieldModule.getPercentage(),
    });
  }

  function recoverHealth(potency: number) {
    shipStatus.recoverHealth(potency);
    scene.game.events.emit("player-health-increase", {
      currentPercentage: shipStatus.healthModule.getPercentage(),
    });
  }

  return {
    takeDamage,
    incrementXP,
    increaseModuleLevel,
    shipStatus,
    recoverShield,
    recoverHealth,
  };
}

export type ShipStatusManager = ReturnType<typeof buildShipManagement>;
