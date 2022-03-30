import { debounce, throttle } from "lodash";
import { Directions } from "../../Constants";
import { getRandomInt } from "../../utility/Utility";
import GridPlaceable from "../GridPlaceable";
import Missile from "../projectiles/Missile";

function useAttack(attackFrames: number[]) {
  let index = 0;
  function getNextAttackFrame() {
    index++;
    index = index > attackFrames.length - 1 ? 0 : index;
    return attackFrames[index];
  }
  return getNextAttackFrame;
}

export default class Player extends GridPlaceable {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private direction: Directions;
  private attackFrames: number[] = [];
  private primaryAttackCooldown: number = 300;
  constructor({
    scene,
    x,
    y,
    texture,
    direction,
  }: {
    scene;
    x: number;
    y: number;
    texture: string;
    direction: Directions;
  }) {
    super(scene, x, y, texture, 0);
    this.direction = direction;
    this.face(direction);
    this.scene.physics.add.existing(this);
    this.attackFrames = [10, 11];
  }

  /** Add listeners for player movement,
   * let callback handle any side effects of movement */
  public setInputs({
    movementHandler,
    primaryAttackHandler,
    secondaryAttackHandler,
  }: {
    movementHandler: (direction: Directions, moveable: GridPlaceable) => void;
    primaryAttackHandler: () => void;
    secondaryAttackHandler: () => void;
  }) {
    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.scene.input.keyboard.addKey("E").on("down", () => {
      secondaryAttackHandler();
    });

    const getNextAttackFrame = useAttack(this.attackFrames);

    const debouncedFaceFront = debounce(() => {
      this.face(this.direction);
    }, 200);

    const throttledPrimaryAttack = throttle(
      () => {
        const frame = getNextAttackFrame();
        this.setFrame(frame);
        debouncedFaceFront();

        primaryAttackHandler();
      },
      this.primaryAttackCooldown,
      { leading: true }
    );

    this.cursors.space.addListener("down", throttledPrimaryAttack);

    this.cursors.down.addListener("down", () =>
      movementHandler(Directions.down, this)
    );

    this.cursors.up.addListener("down", () =>
      movementHandler(Directions.up, this)
    );

    this.cursors.left.addListener("down", () =>
      movementHandler(Directions.left, this)
    );

    this.cursors.right.addListener("down", () =>
      movementHandler(Directions.right, this)
    );
  }

  static spriteDependencies: SpriteDependency[] = [
    {
      frameWidth: 64,
      frameHeight: 64,
      key: "yaya",
      url: "src/assets/sprites/yaya.png",
    },
    {
      frameWidth: 64,
      frameHeight: 64,
      key: "tuzi",
      url: "src/assets/sprites/tuzi.png",
    },
  ];
}
