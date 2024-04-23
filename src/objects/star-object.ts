import Phaser from 'phaser';

/** スターオブジェクト */
export default class StarObject extends Phaser.Physics.Arcade.Image {
  /** テクスチャのキー名 */
  public static readonly keyName: string = 'star';
  
  /** コンストラクタ */
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, StarObject.keyName);
    // Scene の `physics.add.group()` 相当の処理を行う
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    
    // バウンド率
    this.setBounce(Phaser.Math.FloatBetween(0.4, 0.8));
  }
}
