import DependentScene from "../DependentScene";
import {
  buildNotificationManagement,
  NotificationManager,
} from "./NotificationManagement";
import {
  buildResourceManagement,
  ResourceStateManager,
} from "./ResourceManagement";
import { buildShipManagement, ShipStatusManager } from "./ShipManagement";
import { getSaveData } from "../../assets/data/player/SaveController";

//TODO: Make this a function of the ship's upgrades
const RESOURCE_GATHER_SIZE = 0.25;

export class StateScene extends DependentScene {
  private systemLevel: number = 1;
  public resourceGatherSize: number = RESOURCE_GATHER_SIZE;
  public resourceManager: ResourceStateManager;
  public notificationManager: NotificationManager;
  public shipStatusManager: ShipStatusManager;
  constructor() {
    super({
      key: "StateScene",
    });
  }

  preload(): void {}

  create(): void {
    const save = getSaveData();
    this.resourceManager = buildResourceManagement(this);
    this.notificationManager = buildNotificationManagement(this);
    this.shipStatusManager = buildShipManagement(this, save.shipStatus);
  }

  public incrementSystemLevel() {
    this.systemLevel++;
  }

  public decrementSystemLevel() {
    this.systemLevel = Math.max(0, this.systemLevel - 1);
  }

  public getSystemLevel() {
    return this.systemLevel;
  }

  update(time: number, delta: number): void {}
}
