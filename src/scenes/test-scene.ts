import Phaser from 'phaser';

export default class TestScene extends Phaser.Scene {
  constructor(config: Phaser.Types.Scenes.SettingsConfig) {
    super(config);
  }
  
  public preload(): void {
    this.load.image('sky'       , 'assets-1st/sky.png');
    this.load.image('ground'    , 'assets-1st/platform.png');
    this.load.image('star'      , 'assets-1st/star.png');
    this.load.image('bomb'      , 'assets-1st/bomb.png');
    this.load.spritesheet('dude', 'assets-1st/dude.png', { frameWidth: 32, frameHeight: 48 });
  }
  
  public create(): void {
    this.add.image(400, 300, 'sky');
  }
  
  public update(): void {
    // TODO
  }
}
