/* globals __DEV__ */
import Phaser from 'phaser'

export default class extends Phaser.State {

  init() {
    this.score
    this.scoreLabel
    this.contract
    this.enterKey
    this.contract
  }

  preload() {
  }

  create() {
    this.cursors = this.input.keyboard.createCursorKeys()
    this.createScore()
    this.loadScore()
		this.enterKey = this.input.keyboard.addKey(Phaser.Keyboard.ENTER);
  }

  update() {
    if(this.enterKey.isDown)
    {
			this.state.start('Game')
			this.state.clearCurrentState()    	
    }
  }

  async loadScore() {
    // Read from the Blockchain (please see SimpleContract.js)
    this.score = await this.game.contract.load('score')
    this.scoreLabel.text = "Your score is " + this.score + "\n Press enter to try again"
  }


  createScore(){
    let scoreFont = "24px Arial"
    this.scoreLabel = this.add.text((this.world.centerX), 100, "0", {font: scoreFont, fill: "#fff"})
    this.scoreLabel.anchor.setTo(0.5, 0.5)
    this.scoreLabel.align = 'center'
  }

  render() {    
  }

}