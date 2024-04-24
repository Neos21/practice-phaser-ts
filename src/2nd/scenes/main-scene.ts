import Phaser from 'phaser';

import PlayerObject from '../objects/player-object';

/** ゲームの状態定義 */
export type State = 'INIT' | 'PLAY' | 'GAME_OVER';

/** メインシーン */
export default class MainScene extends Phaser.Scene {
  /** 背景スプライト (横スクロールできるようにする) */
  private background!: Phaser.GameObjects.TileSprite;
  /** ステータスバー (当たり判定を設けるため控えておく) */
  private statusBar!: Phaser.Types.Physics.Arcade.ImageWithStaticBody;
  /** 初期状態のテキスト */
  private initText!: Phaser.GameObjects.Text;
  /** プレイヤー */
  private player!: PlayerObject;
  
  /** スペースキー */
  private spaceKey!: Phaser.Input.Keyboard.Key;
  
  /** ゲームの状態 */
  private state: State = 'INIT';
  
  /** プリロード */
  public preload(): void {
    this.load.image('sky'       , `./sky.png`);
    this.load.image('status-bar', `./status-bar.png`);
    this.load.image(PlayerObject.keyName, `./${PlayerObject.keyName}.png`);
  }
  
  /** 初期化処理 */
  public create(): void {
    // 背景 (横スクロールさせる) を配置する
    this.background = this.add.tileSprite(0, 0, 1000, 500, 'sky').setOrigin(0, 0);
    // ステータスバーを配置する (`refreshBody()` で `setOrigin()` による当たり判定のズレを修正する)
    this.statusBar = this.physics.add.staticImage(0, 500, 'status-bar').setOrigin(0, 0).refreshBody();
    // 初期状態のテキストを表示する (`setOrigin()` で中央揃えになるようにする)
    this.initText = this.add.text(500, 250, 'スペースキーでスタート').setOrigin(0.5, 0).setColor('#f09').setFontSize(30).setFontFamily('Arial').setBackgroundColor('#fff');
    
    // プレイヤーを用意する
    this.player = new PlayerObject(this, 50, 250);
    this.physics.add.collider(this.player, this.statusBar);
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => this.player.onPointerMove(pointer, this.state));
    
    // スペースキーの押下をチェックする
    this.spaceKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }
  
  /** メインループ */
  public update(): void {
    if(this.state === 'INIT') {
      if(this.spaceKey.isDown) {  // ゲームスタート
        this.initText.setVisible(false);
        this.state = 'PLAY';
      }
      return;
    }
    else if(this.state === 'PLAY') {
      this.background.tilePositionX += 10;  // 背景を横スクロールさせる
      // TODO : 体力ゲージを用意する … 時間経過で減っていく・アイテム獲得で加点・敵と衝突で減点
      // TODO : アイテムを流す … 加点数が異なるアイテムを3種類くらいランダムに流したい
      // TODO : 敵を流す … 敵は左から右へ流れるようにする？
      // TODO : スコアを表示する … 時間経過で加算される
      return;
    }
    else if(this.state === 'GAME_OVER') {
      if(this.spaceKey.isDown) {  // ゲーム再スタート
        this.state = 'PLAY';
      }
      return;
    }
  }
}
