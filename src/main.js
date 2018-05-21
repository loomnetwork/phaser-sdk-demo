import 'pixi'
import 'p2'
import * as Phaser from 'phaser'

import GameState from './states/Game'
import config from './config'

class Game extends Phaser.Game {

  constructor () {
    super(config)
    this.state.add('Game', GameState, false)
  }

}

window.onload = () => {
  const game = new Game()
  game.state.start('Game')
}