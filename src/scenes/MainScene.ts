/**
 * @author       Digitsensitive <digit.sensitivee@gmail.com>
 * @copyright    2018 - 2019 digitsensitive
 * @license      {@link https://github.com/digitsensitive/phaser3-typescript/blob/master/LICENSE.md | MIT License}
 */

import Enemy from "../components/enemy/Enemy";
import { Grid, GridSquare } from "../components/grid/Grid";
import GridController from "../components/GridController";
import Player from "../components/player/Player";
import Missile from "../components/projectiles/Missile";
import { Directions } from "../Constants";
import DependentScene from "./DependentScene";
import Bullet from "../components/projectiles/Bullet";
import { Projectible } from "../components/projectiles/Projectible";
import Impact from "../components/projectiles/Impact";
import { characterDamage } from "../utility/tweens/character";
import { getRandomInt } from "../utility/Utility";
import Block, { Blocks } from "../components/blocks/Block";
import { blocks } from "../components/blocks/blocks_data";

export class MainScene extends DependentScene {
  private projectiles: Phaser.GameObjects.Group;
  private boardEntites: Phaser.GameObjects.Group;
  constructor() {
    super({
      key: "MainScene",
    });
  }

  static spriteDependencies: SpriteDependency[] = [
    ...GridSquare.spriteDependencies,
    ...Player.spriteDependencies,
    ...Missile.spriteDependencies,
    ...Impact.spriteDependencies,
    ...Block.spriteDependencies,
  ];
  static audioDependencies: AudioDependency[] = [];

  preload(): void {}

  create(): void {
    this.projectiles = new Phaser.GameObjects.Group(this);
    this.boardEntites = new Phaser.GameObjects.Group(this);
    this.populatePlayer();
    this.populateEnemies();

    this.physics.add.overlap(
      this.boardEntites,
      this.projectiles,
      (entity: Phaser.Physics.Arcade.Sprite, projectile: Bullet | Missile) => {
        if (projectile.shooter !== entity) {
          projectile.destroy();
          const randX = getRandomInt(entity.x - 20, entity.x + 20);
          const randY = getRandomInt(entity.y - 20, entity.y + 20);
          const impact = new Impact({ scene: this, x: randX, y: randY });
          entity.parentContainer.add(impact);
          impact.init();
          characterDamage(entity, 0, this, () => {}).play();
        }
      }
    );
  }

  private populatePlayer() {
    const grid = new Grid({ scene: this, x: 230, y: 240 });
    const player = new Player({
      scene: this,
      x: 0,
      y: 0,
      texture: "yaya",
      direction: Directions.right,
    });
    const heroGridController = new GridController({
      scene: this,
      grid,
    });

    heroGridController.init();
    heroGridController.addToGrid(player);
    heroGridController.moveToCenter(player);

    player.setInputs({
      movementHandler: (direction, player) =>
        heroGridController.handleMove(direction, player),
      primaryAttackHandler: () => {
        const bullet = new Missile({
          scene: this,
          x: player.x,
          y: player.y,
          velocity: { x: 1200, y: 0 },
          frame: 3,
          shooter: player,
        });
        bullet.init();
        player.parentContainer.add(bullet);
        player.parentContainer.bringToTop(bullet);
        this.projectiles.add(bullet);
      },
      secondaryAttackHandler: () => {
        const missile = new Missile({
          scene: this,
          x: player.x,
          y: player.y,
          velocity: { x: 500, y: 0 },
          shooter: player,
        });
        missile.init();
        player.parentContainer.add(missile);
        player.parentContainer.bringToTop(missile);
      },
    });
    this.boardEntites.add(player);
  }

  private populateEnemies() {
    const enemyGrid = new Grid({ scene: this, x: 440, y: 240 });
    const enemy = new Enemy({ scene: this, x: 0, y: 0, texture: "tuzi" });
    const enemyGridController = new GridController({
      scene: this,
      grid: enemyGrid,
    });
    enemyGridController.init();
    enemyGridController.addToGrid(enemy);
    enemy.face(Directions.left);
    this.boardEntites.add(enemy);
  }
}
