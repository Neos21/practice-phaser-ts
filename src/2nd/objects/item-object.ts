import Phaser from 'phaser';

/** アイテムオブジェクト */
export default class ItemObject extends Phaser.Physics.Arcade.Image {
  /** テクスチャのキー名 */
  public static readonly keyName: string = 'item-sora';
  
  /** コンストラクタ */
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, ItemObject.keyName);
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    
    this.setVelocity(Phaser.Math.Between(-600, -200), 0);  // 左に流れるようにする
  }
}
