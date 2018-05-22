import 'pixi'
import 'p2'
import * as Phaser from 'phaser'

import GameState from './states/Game'
import ScoreBoard  from './states/ScoreBoard'
import config from './config'

class Game extends Phaser.Game {

  constructor () {
    super(config)
    this.state.add('Game', GameState, false)
    this.state.add('ScoreBoard', ScoreBoard, false)
  }

}

window.onload = () => {
  const game = new Game()
  game.state.start('Game')
}