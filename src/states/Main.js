/* globals __DEV__ */
import Phaser from 'phaser'
import SimpleContract from '../blockchain'

export default class extends Phaser.State {

  init() {
    this.player
    this.stars
    this.bombs
    this.platforms
    this.ground
    this.ledge
    this.cursors
    this.score = 0
    this.gameOver = false
    this.scoreText
    this.contract = new SimpleContract()
  }

  preload() {
    this.load.image('sky', 'src/assets/sky.png')
    this.load.image('ground', 'src/assets/platform.png')
    this.load.image('star', 'src/assets/star.png')
    this.load.image('bomb', 'src/assets/bomb.png')
    this.load.spritesheet('dude', 'src/assets/dude.png', 32, 48)
    let text = this.add.text(this.world.centerX, this.world.centerY, 'loading fonts', { font: '16px Arial', fill: '#ffffff', align: 'center' })
  }

  create() {

    this.physics.startSystem(Phaser.Physics.ARCADE)

    this.add.sprite(0, 0, 'sky')

    this.platforms = this.add.group()
    this.platforms.enableBody = true

    this.ground = this.platforms.create(0, this.world.height - 64, 'ground')
    this.ground.scale.setTo(2, 2)
    this.ground.body.immovable = true

    this.ledge = this.platforms.create(400, 400, 'ground')
    this.ledge.body.immovable = true;

    this.ledge = this.platforms.create(-150, 250, 'ground')
    this.ledge.body.immovable = true

    this.player = this.add.sprite(32, this.world.height - 150, 'dude')
    this.physics.arcade.enable(this.player)
    this.player.body.bounce.y = 0.2
    this.player.body.gravity.y = 300
    this.player.body.collideWorldBounds = true
    this.player.animations.add('left', [0, 1, 2, 3], 10, true)
    this.player.animations.add('right', [5, 6, 7, 8], 10, true);   

    this.stars = this.add.group()
    this.stars.enableBody = true

    for (var i = 0; i < 12; i++)
    {
      let star = this.stars.create(i * 70, 0, 'star')
      star.body.gravity.y = 300
      star.body.bounce.y = 0.7 + Math.random() * 0.2
    }

    this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    this.cursors = this.input.keyboard.createCursorKeys()

    const bannerText = 'Phaser + Loom Dappchain'
    let banner = this.add.text(this.world.centerX, this.game.height - 80, bannerText, {
      font: '40px Bangers',
      fill: '#77BFA3',
      smoothed: false
    })

    banner.padding.set(10, 16)
    banner.anchor.setTo(0.5)

  }

  update() {

    let hitPlatform = this.physics.arcade.collide(this.player, this.platforms)

    this.physics.arcade.collide(this.stars, this.platforms)
    this.physics.arcade.overlap(this.player, this.stars, this.collectStar, null, this)

    this.player.body.velocity.x = 0

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

  collectStar(player, star) {
    
    star.kill()

    this.score += 10
    this.scoreText.text = 'Score: ' + this.score
        
    const stringScore = this.score.toString() 

    // Wtite to Blockchain
    this.contract.store('score', stringScore).then(function(results) {
      console.log("Promise Resolved", results);
    }).catch(function(error) {
      console.log("Promise Rejected", error);
    });

    // Read from Blockchain
    setTimeout(function(){      
      this.contract.load('score').then(function(results) {
        console.log("Promise Resolved", results);
      }).catch(function(error) {
        console.log("Promise Rejected", error);
      });
     }, 2000);


  }


  render() {    
  }

}