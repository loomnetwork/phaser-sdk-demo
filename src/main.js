import 'pixi'
import 'p2'
import * as Phaser from 'phaser'

import GameState from './states/Game'
import ScoreBoard  from './states/ScoreBoard'

class Game extends Phaser.Game {

  constructor () {
    super(400, 700, Phaser.CANVAS, 'content', null)
    this.state.add('Game', GameState, false)
    this.state.add('ScoreBoard', ScoreBoard, false)
  }

}

window.onload = () => {
  const game = new Game()
  game.state.start('Game')
}