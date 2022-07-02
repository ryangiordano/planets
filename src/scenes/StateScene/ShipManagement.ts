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

  function incrementHP(value: number) {
    shipStatus.healthModule.currentValue = Math.min(
      shipStatus.healthModule.getMaxValue(),
      shipStatus.healthModule.currentValue + value
    );

    scene.game.events.emit("player-health-increase", {
      currentPercentage:
        shipStatus.healthModule.currentValue /
        shipStatus.healthModule.getMaxValue(),
    });
  }

  function decrementHP(value: number) {
    shipStatus.healthModule.currentValue = Math.max(
      0,
      shipStatus.healthModule.currentValue - value
    );

    scene.game.events.emit("player-health-decrease", {
      currentPercentage:
        shipStatus.healthModule.currentValue /
        shipStatus.healthModule.getMaxValue(),
    });
  }

  function incrementShields(value: number) {
    shipStatus.shieldModule.currentValue = Math.min(
      shipStatus.shieldModule.getMaxValue(),
      shipStatus.shieldModule.currentValue + value
    );

    scene.game.events.emit("player-shield-increase", {
      currentPercentage:
        shipStatus.shieldModule.currentValue /
        shipStatus.shieldModule.getMaxValue(),
    });
  }

  function decrementShields(value: number) {
    shipStatus.shieldModule.currentValue = Math.max(
      0,
      shipStatus.shieldModule.currentValue - value
    );

    scene.game.events.emit("player-shield-decrease", {
      currentPercentage:
        shipStatus.shieldModule.currentValue /
        shipStatus.shieldModule.getMaxValue(),
    });
  }

  function increaseModuleLevel(module: ShipModules, value: number) {
    shipStatus.moduleMap.get(module).level += value;
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
    if (
      shipStatus.shieldModule.currentValue <= 0 &&
      shipStatus.healthModule.currentValue - potency <= 0
    ) {
      scene.game.events.emit("game-over");
    } else if (shipStatus.shieldModule.currentValue <= 0) {
      decrementHP(potency);
    } else {
      decrementShields(potency);
    }
  }

  return {
    takeDamage,
    incrementXP,
    increaseModuleLevel,
    shipStatus,
  };
}

export type ShipStatusManager = ReturnType<typeof buildShipManagement>;
