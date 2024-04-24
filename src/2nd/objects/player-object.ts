import Phaser from 'phaser';

import { State } from '../scenes/main-scene';

/** プレイヤーオブジェクト */
export default class PlayerObject extends Phaser.Physics.Arcade.Sprite {
  /** テクスチャのキー名 */
  public static readonly keyName: string = 'player';
  
  /** コンストラクタ */
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, PlayerObject.keyName);
    // Scene の `physics.add.sprite()` 相当の処理を行う
    this.scene.add.existing(this);          // Scene への追加
    this.scene.physics.add.existing(this);  // Physics Manager への追加
    
    this.setCollideWorldBounds(true);  // 画面の枠に対する衝突判定を設ける
  }
  
  /** プレイヤーをマウスに追従させる */
  public onPointerMove(pointer: Phaser.Input.Pointer, state: State): void {
    if(state !== 'PLAY') return;  // 操作可能な状態でなければ何もしない
    
    // TODO : ゲームオーバー時に即時停止できるようにする
    this.scene.tweens.add({
      targets: this,
      x: pointer.x,
      y: Math.min(pointer.y, 475),  // 500 - (50 / 2) : ステータスバーに対して Collision が効かないのでココで制御する
      duration: 500,
      ease: 'Sine.easeOut'
    });
  }
}
