import 'pixi'
import 'p2'
import * as Phaser from 'phaser'

import MainState from './states/Main'
import config from './config'

class Game extends Phaser.Game {

  constructor () {
    super(config)
    this.state.add('Main', MainState, false)
  }

}

window.onload = () => {
  const game = new Game()
  game.state.start('Main')
}