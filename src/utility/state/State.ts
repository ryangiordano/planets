export class State {
  /**
   *  Handles the state of the game.
   */
  private static instance: State;
  private game: Phaser.Game;
  private constructor() {}

  static getInstance() {
    if (!State.instance) {
      State.instance = new State();
    }
    return this.instance;
  }
  initialize(game: Phaser.Game) {}
}
