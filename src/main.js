import 'pixi'
import 'p2'
import * as Phaser from 'phaser'
import createContract from './SimpleContract'
import GameState from './states/Game'
import ScoreBoard  from './states/ScoreBoard'



class Game extends Phaser.Game {

  constructor(contract) {  	
    super(400, 700, Phaser.CANVAS, 'content', null)
    this.contract = contract
    this.state.add('Game', GameState, false)
    this.state.add('ScoreBoard', ScoreBoard, false)
  }

}


window.onload = async () => {
	const contract = await createContract()
  const game = new Game(contract)
  game.state.start('Game')
}
