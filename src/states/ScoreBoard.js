/* globals __DEV__ */
import Phaser from 'phaser'
import SimpleContract from '../SimpleContract'

export default class extends Phaser.State {

  init() {
    this.score
    this.scoreLabel
    this.contract
    this.enterKey
  }

  preload() {
  }

  create() {
    this.cursors = this.input.keyboard.createCursorKeys()
    this.contract = new SimpleContract()

    this.createScore()

    // Read from the Blockchain (please see SimpleContract.js)
		this.contract.load('score').then((results) => {
		  this.scoreLabel.text = "Your score is " + results + "\n Press enter to try again"
		}).catch((error) => {
		  console.log("Promise Rejected", error);
		})

		this.enterKey = this.input.keyboard.addKey(Phaser.Keyboard.ENTER);

  }

  update() {
    if(this.enterKey.isDown)
    {
			this.state.start('Game')
			this.state.clearCurrentState()    	
    }
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