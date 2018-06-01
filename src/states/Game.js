/* globals __DEV__ */
import Phaser from 'phaser'
import createContract from '../SimpleContract'

export default class extends Phaser.State {

  init() {
    this.player
    this.stars
    this.bombs
    this.platforms
    this.spacing = 300
    this.ground
    this.ledge
    this.cursors
    this.score = 0
    this.block
    this.scoreText    
  }

  preload() {
    this.load.image('sky', 'src/assets/sky.png')
    this.load.image('ground', 'src/assets/platform.png')
    this.load.image('star', 'src/assets/star.png')
    this.load.image('bomb', 'src/assets/bomb.png')
    this.load.image('block', 'src/assets/block.png')
    this.load.spritesheet('dude', 'src/assets/dude.png', 32, 48)
  }

  create() {

    // Enable Arcade physics
    this.physics.startSystem(Phaser.Physics.ARCADE)

    // Get the dimensions of the block we are using
    this.blockWidth = this.cache.getImage('block').width
    this.blockHeight = this.cache.getImage('block').height

    // Set the background colour
    this.add.sprite(0, 0, 'sky')

    // Create a group for solid objects
    this.platforms = this.add.group()

    // Enable physics on any object within the group
    this.platforms.enableBody = true
    this.platforms.createMultiple(250, 'block')

    this.initStars() 
    this.initPlayer()
    this.initPlatforms()
    this.createScore()

    // Create events that will fire every x milliseconds
    this.time.events.loop(2000, this.addPlatform, this)
    this.time.events.loop(10000, this.addStars, this)

    // Enable cursor keys for controls
    this.cursors = this.input.keyboard.createCursorKeys()

  }

  update() {
    let hitPlatform = this.physics.arcade.collide(this.player, this.platforms)
    this.physics.arcade.collide(this.stars, this.platforms)
    this.physics.arcade.overlap(this.player, this.stars, this.collectStar, null, this)
    this.player.body.velocity.x = 0

    if(!this.isRunning && this.cursors.up.isDown)
    {
      this.isRunning = true
    }

    if(this.cursors.left.isDown)
    {
      this.player.body.velocity.x = -150
      this.player.animations.play('left')
    }
    else if(this.cursors.right.isDown)
    {
      this.player.body.velocity.x = 150
      this.player.animations.play('right')
    }
    else
    {
      this.player.animations.stop()
      this.player.frame = 4
    }

    if(this.cursors.up.isDown && this.player.body.touching.down && hitPlatform)
    {
      this.player.body.velocity.y = -450
    }

    if(this.cursors.down.isDown && !this.player.body.touching.down && !hitPlatform)
    {
      this.player.body.velocity.y = 700
    }

    if(this.player.y > this.world.height) this.gameOver()

  }

  gameOver() {
    this.state.start('ScoreBoard')
  }

  addBlock(x, y) {
    let block = this.platforms.getFirstDead()
    block.reset(x, y)
    block.body.velocity.y = 150
    block.body.immovable = true
    block.checkWorldBounds = true
    block.outOfBoundsKill = true  
  }

  addPlatform(y){

    if(typeof(y) == "undefined"){
      y = -this.blockHeight
      this.incrementScore(1)
    }

    let blocksNeeded = Math.ceil(this.world.width / this.blockWidth)

    let hole = Math.floor(Math.random() * (blocksNeeded - 2)) + 1

    for (var i = 0; i < blocksNeeded; i++){
      if (i != hole && i != hole + 1){
        this.addBlock(i * this.blockWidth, y) 
      }         
    }

  }

  addStars() {
    for(var i = 0; i < 12; i++)
    {
      let star = this.stars.create(i * 70, 0, 'star')
      star.body.gravity.y = 300
      star.body.bounce.y = 0.7 + Math.random() * 0.2
    }
  }


  initStars() {
    this.stars = this.add.group()
    this.stars.enableBody = true
  }

  initPlayer() {    
    const playerHeight = this.cache.getImage('dude').height
    this.player = this.add.sprite(this.blockWidth * 1, this.world.centerY - playerHeight, 'dude')
    this.physics.arcade.enable(this.player)
    this.player.body.bounce.y = 0.1
    this.player.body.gravity.y = 400

    this.player.body.collideWorldBounds = false
    this.player.animations.add('left', [0, 1, 2, 3], 10, true)
    this.player.animations.add('right', [5, 6, 7, 8], 10, true);       
  }

  initPlatforms(){
    const bottom = this.world.height - this.blockHeight
    const top = this.blockHeight    
    for(var y = bottom; y > top - this.blockHeight; y = y - this.spacing){
      this.addPlatform(y)
    }
  }

  createScore(){
    let scoreFont = "100px Arial"
    this.scoreLabel = this.add.text((this.world.centerX), 100, "0", {font: scoreFont, fill: "#fff"}) 
    this.scoreLabel.anchor.setTo(0.5, 0.5)
    this.scoreLabel.align = 'center'
  }

  incrementScore(value) {
    this.score += value
    this.scoreLabel.text = this.score
    const stringScore = this.score.toString()
    
    // Write to the Blockchain (please see SimpleContract.js)
    this.game.contract.store('score', stringScore)
  }

  collectStar(player, star) { 
    star.kill()
    this.incrementScore(10)
  }

  render() {    
  }

}
