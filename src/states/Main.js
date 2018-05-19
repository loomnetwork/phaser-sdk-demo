/* globals __DEV__ */
import Phaser from 'phaser'

export default class extends Phaser.State {

  init() { }

  preload() {    

    this.load.image('sky', 'src/assets/sky.png');
    this.load.image('ground', 'src/assets/platform.png');
    this.load.image('star', 'src/assets/star.png');
    this.load.image('bomb', 'src/assets/bomb.png');
    this.load.spritesheet('dude', 'src/assets/dude.png', { frameWidth: 32, frameHeight: 48 });

    let text = this.add.text(this.world.centerX, this.world.centerY, 'loading fonts', { font: '16px Arial', fill: '#ffffff', align: 'center' })
  }

  create() {

    const bannerText = 'Phaser + ES6 + Webpack'
    let banner = this.add.text(this.world.centerX, this.game.height - 80, bannerText, {
      font: '40px Bangers',
      fill: '#77BFA3',
      smoothed: false
    })

    banner.padding.set(10, 16)
    banner.anchor.setTo(0.5)

  }


  render() {    
  }

}