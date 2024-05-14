import Phaser from 'phaser';

/** アイテムオブジェクト */
export default class ItemObject extends Phaser.Physics.Arcade.Image {
  /** テクスチャのキー名 : そら */
  public static readonly keyNameSora: string = 'item-sora';
  /** テクスチャのキー名 : えり */
  public static readonly keyNameEri: string  = 'item-eri';
  /** テクスチャのキー名 : 庵野雲 */
  public static readonly keyNameUnknown: string  = 'item-unknown';
  /** テクスチャのキー名 : 敵 (ザリガニ) */
  public static readonly keyNameEnemy: string = 'enemy';
  /** テクスチャのキー名 : 爆弾 (みどり) */
  public static readonly keyNameBomb: string  = 'bomb';
  
  /** 各キャラ獲得時の点数を定義しておく */
  private static readonly points = {
    [this.keyNameSora]   :    10,
    [this.keyNameEri]    :    20,
    [this.keyNameUnknown]:   200,
    [this.keyNameEnemy]  :   -50,
    [this.keyNameBomb]   : -9999
  };
  
  /** 自身のキー名 */
  public keyName!: string;
  /** 自身のキー名に基づく得点を宣言する */
  public point!: number;
  
  /** コンストラクタ */
  constructor(scene: Phaser.Scene, x: number, y: number, velocityX: number, keyName: string) {
    super(scene, x, y, keyName);
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    
    this.keyName = keyName;
    this.point = ItemObject.points[keyName];  // 本アイテムを獲得した際の得点を宣言しておく
    
    this.setVelocityX(velocityX);  // 流れる方向を決める
    
    if(keyName === ItemObject.keyNameEnemy) this.setBodySize(50, 50, false);  // 敵なな子の当たり判定を調整する
  }
  
  /** プレイヤーに獲得された時の処理 : 音を鳴らす */
  public onCollectItem(): void {
    this.scene.sound.play(`sound-${this.keyName}`);
  }
}
