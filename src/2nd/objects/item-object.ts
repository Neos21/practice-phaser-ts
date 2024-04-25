import Phaser from 'phaser';

/** アイテムオブジェクト */
export default class ItemObject extends Phaser.Physics.Arcade.Image {
  /** テクスチャのキー名 : そら */
  public static readonly keyNameSora: string = 'item-sora';
  /** テクスチャのキー名 : えり */
  public static readonly keyNameEri: string  = 'item-eri';
  /** テクスチャのキー名 : 敵 (ザリガニ) */
  public static readonly keyNameEnemy: string = 'enemy';
  
  /** 各キャラ獲得時の点数を定義しておく */
  private static readonly points = {
    [this.keyNameSora] :  10,
    [this.keyNameEri]  :  20,
    [this.keyNameEnemy]: -50
  }
  
  /** 自身のキー名 */
  public keyName!: string;
  /** 自身のキー名に基づく得点を宣言する */
  public point!: number;
  
  /** コンストラクタ */
  constructor(scene: Phaser.Scene, x: number, y: number, keyName: string) {
    super(scene, x, y, keyName);
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    
    this.keyName = keyName;
    this.point = ItemObject.points[keyName];  // 本アイテムを獲得した際の得点を宣言しておく
    
    if(this.keyName === ItemObject.keyNameEnemy) {  // 敵アイテムの場合
      this.setVelocity(Phaser.Math.Between(800, 400), 0);  // ランダムな速度で右に流れるようにする
    }
    else {  // 通常のアイテムの場合
      this.setVelocity(Phaser.Math.Between(-600, -200), 0);  // ランダムな速度で左に流れるようにする
    }
  }
  
  /** プレイヤーに獲得された時の処理 : 音を鳴らす */
  public onCollectItem(): void {
    this.scene.sound.play(`sound-${this.keyName}`);
  }
}
