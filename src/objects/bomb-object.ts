import Phaser from 'phaser';

/** 爆弾オブジェクト */
export default class BombObject extends Phaser.Physics.Arcade.Sprite {
  /** テクスチャのキー名 */
  public static readonly keyName: string = 'bomb';
  
  /** コンストラクタ */
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, BombObject.keyName);
    // Scene の `physics.add.sprite()` 相当の処理を行う
    this.scene.add.existing(this);          // Scene への追加
    this.scene.physics.add.existing(this);  // Physics Manager への追加
    
    this.setCollideWorldBounds(true);  // 画面の枠に対する衝突判定を設ける
    this.setBounce(1);                 // バウンド率
    this.setVelocity(Phaser.Math.Between(-200, 200), 20);  // 移動速度
  }
}
