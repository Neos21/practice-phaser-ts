import Phaser from 'phaser';

/** プレイヤーオブジェクト */
export default class PlayerObject extends Phaser.Physics.Arcade.Sprite {
  /** テクスチャのキー名 */
  public static readonly keyName: string = 'dude';
  /** アニメーションのキー名 : Left */
  private static readonly animKeyNameLeft: string = 'left';
  /** アニメーションのキー名 : Turn */
  private static readonly animKeyNameTurn: string = 'turn';
  /** アニメーションのキー名 : Right */
  private static readonly animKeyNameRight: string = 'right';
  
  /** カーソルキー */
  private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
  
  /** コンストラクタ */
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, PlayerObject.keyName);
    // Scene の `physics.add.sprite()` 相当の処理を行う
    this.scene.add.existing(this);          // Scene への追加
    this.scene.physics.add.existing(this);  // Physics Manager への追加
    
    this.setCollideWorldBounds(true);  // 画面の枠に対する衝突判定を設ける
    this.setBounce(0.2);               // バウンド率
    
    // アニメーションを定義する
    this.scene.anims.create({
      key: PlayerObject.animKeyNameLeft,
      frames: this.anims.generateFrameNumbers(PlayerObject.keyName, { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });
    this.scene.anims.create({
      key: PlayerObject.animKeyNameTurn,
      frames: [{ key: PlayerObject.keyName, frame: 4 }],
      frameRate: 20
    });
    this.scene.anims.create({
      key: PlayerObject.animKeyNameRight,
      frames: this.anims.generateFrameNumbers(PlayerObject.keyName, { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
    });
    
    // カーソル情報を取得しておく
    this.cursorKeys = this.scene.input.keyboard!.createCursorKeys();
  }
  
  /** プレイヤーの Update 処理 */
  public updatePlayer(): void {
    // 左右・停止状態
    if(this.cursorKeys.left.isDown) {
      this.setVelocityX(-160);
      this.anims.play(PlayerObject.animKeyNameLeft, true);
    }
    else if(this.cursorKeys.right.isDown) {
      this.setVelocityX(160);
      this.anims.play(PlayerObject.animKeyNameRight, true);
    }
    else {
      this.setVelocityX(0);
      this.anims.play(PlayerObject.animKeyNameTurn);
    }
    
    // ジャンプ
    if(this.cursorKeys.up.isDown && this.body!.touching.down) {
      this.setVelocityY(-330);
    }
  }
  
  /** プレイヤーが爆弾に当たった時のプレイヤーの処理 */
  public onHitBombPlayer(): void {
    this.setTint(0xff0000);  // 赤色にする
    this.anims.play(PlayerObject.animKeyNameTurn);
  }
}
