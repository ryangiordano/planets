import DependentScene from "./DependentScene";

export class StateScene extends DependentScene {
  constructor() {
    super({
      key: "StateScene",
    });
  }

  preload(): void {}

  create(): void {}

  update(time: number, delta: number): void {}
}
