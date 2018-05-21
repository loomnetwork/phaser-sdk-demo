/* globals __DEV__ */
import Phaser from 'phaser'
import SimpleContract from '../SimpleContract'

export default class extends Phaser.State {

  init() {
    this.player
    this.stars
    this.bombs
    this.platforms
    this.spacing = this.world.height
    this.ground
    this.ledge
    this.cursors
    this.score = 0
    this.block
    this.isRunning = false
    this.gameOver = false
    this.scoreText
    this.contract = new SimpleContract()
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
    this.tileWidth = this.cache.getImage('block').width
    this.tileHeight = this.cache.getImage('block').height

    // Set the background colour
    this.stage.backgroundColor = 'AAB7FF'    

    this.platforms = this.add.group()
    this.platforms.enableBody = true
    this.platforms.createMultiple(250, 'block')

    this.ground = this.platforms.create(this.world.width/2 - 35, this.world.height/2, 'block')
    this.ground.body.immovable = true    

    // this.stars = this.add.group()
    // this.stars.enableBody = true

    // for (var i = 0; i < 12; i++)
    // {
    //   let star = this.stars.create(i * 70, 0, 'star')
    //   star.body.gravity.y = 300
    //   star.body.bounce.y = 0.7 + Math.random() * 0.2
    // }

    // Create the player character
    this.initPlayer()

    // Create inital platforms
    this.initPlatforms()

    //Create the score label
    this.createScore()

    // Create a platform every 2 seconds
    // this.timer = this.time.events.loop(2000, this.addPlatform, this)

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
      this.startGame()
      this.isRunning = true
    }

    if (this.cursors.left.isDown)
    {
      this.player.body.velocity.x = -150
      this.player.animations.play('left')
    }
    else if (this.cursors.right.isDown)
    {
      this.player.body.velocity.x = 150
      this.player.animations.play('right')
    }
    else
    {
      this.player.animations.stop()
      this.player.frame = 4
    }

    if (this.cursors.up.isDown && this.player.body.touching.down && hitPlatform)
    {
      this.player.body.velocity.y = -350
    }


  }


  startGame() {
    // Create a platform every 2 seconds
    this.timer = this.time.events.loop(2000, this.addPlatform, this)
    this.ground.body.velocity.y = 150
  }

  gameOver() {
    this.state.start('Main')
  }

  addTile(x, y) {

    let block = this.platforms.getFirstDead()

    //Reset it to the specified coordinates
    block.reset(x, y)
    block.body.velocity.y = 150
    block.body.immovable = true

    //When the tile leaves the screen, kill it
    block.checkWorldBounds = true
    block.outOfBoundsKill = true  
  }

  addPlatform(y){

    if(typeof(y) == "undefined"){
      y = -this.tileHeight
      //Increase the players score
      this.incrementScore()
    }

    //Work out how many tiles we need to fit across the whole screen
    let tilesNeeded = Math.ceil(this.world.width / this.tileWidth)

    //Add a hole randomly somewhere
    let hole = Math.floor(Math.random() * (tilesNeeded - 2)) + 1

    //Keep creating tiles next to each other until we have an entire row
    //Don't add tiles where the random hole is
    for (var i = 0; i < tilesNeeded; i++){
        if (i != hole && i != hole + 1){
          this.addTile(i * this.tileWidth, y) 
        }         
    }

  }

  initPlayer() {    

    const playerHeight = this.cache.getImage('dude').height
    this.player = this.add.sprite(this.world.centerX, this.world.centerY - playerHeight, 'dude')
    this.physics.arcade.enable(this.player)
    this.player.body.bounce.y = 0.2
    this.player.body.gravity.y = 300
    this.player.body.collideWorldBounds = true
    this.player.animations.add('left', [0, 1, 2, 3], 10, true)
    this.player.animations.add('right', [5, 6, 7, 8], 10, true);       
  }

  initPlatforms(){

    const bottom = this.world.height - this.tileHeight
    const top = this.tileHeight

    //Keep creating platforms until they reach (near) the top of the screen
    for(var y = bottom; y > top - this.tileHeight; y = y - this.spacing){
      this.addPlatform(y)
    }

  }

  createScore(){

    let scoreFont = "100px Arial"

    this.scoreLabel = this.add.text((this.world.centerX), 100, "0", {font: scoreFont, fill: "#fff"}) 
    this.scoreLabel.anchor.setTo(0.5, 0.5)
    this.scoreLabel.align = 'center'

  }

  incrementScore(){

    this.score += 1   
    this.scoreLabel.text = this.score    

  }


  render() {    
  }

}