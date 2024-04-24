import Phaser from 'phaser';

import PlayerObject from '../objects/player-object';

/** ゲームの状態定義 */
export type State = 'PLAY' | 'GAME_OVER';

/** メインシーン */
export default class MainScene extends Phaser.Scene {
  /** HP デフォルト値 */
  private readonly defaultHp: number = 100;
  
  /** 背景スプライト (横スクロールできるようにする) */
  private background!: Phaser.GameObjects.TileSprite;
  /** ステータスバー (当たり判定を設けるため控えておく) */
  private statusBar!: Phaser.Types.Physics.Arcade.ImageWithStaticBody;
  /** メッセージ */
  private message!: Phaser.GameObjects.Text;
  /** プレイヤー */
  private player!: PlayerObject;
  
  /** HP */
  private hp: number = this.defaultHp;
  /** HP テキスト */
  private hpText!: Phaser.GameObjects.Text;
  /** HP タイマーイベント */
  private hpTimerEvent?: Phaser.Time.TimerEvent;
  
  /** アイテムたち */  // @ts-ignore TODO
  private items!: Phaser.GameObjects.Group;
  /** アイテムタイマーイベント */  // @ts-ignore TODO
  private itemsTimerEvent?: Phaser.Time.TimerEvent;
  
  /** スペースキー */
  private spaceKey!: Phaser.Input.Keyboard.Key;
  /** ゲームの状態 */
  private state: State = 'GAME_OVER';
  
  /** プリロード */
  public preload(): void {
    this.load.image('sky'       , `./sky.png`);
    this.load.image('status-bar', `./status-bar.png`);
    this.load.image(PlayerObject.keyName, `./${PlayerObject.keyName}.png`);
    this.load.image('item-sora', './item-sora.png');
    this.load.image('item-eri' , './item-eri.png');
    this.load.image('enemy'    , './enemy.png');
  }
  
  /** 初期化処理 */
  public create(): void {
    // 背景 (横スクロールさせる) を配置する
    this.background = this.add.tileSprite(0, 0, 1000, 500, 'sky').setOrigin(0, 0);
    // ステータスバーを配置する (`refreshBody()` で `setOrigin()` による当たり判定のズレを修正する)
    this.statusBar = this.physics.add.staticImage(0, 500, 'status-bar').setOrigin(0, 0).refreshBody();
    // 初期状態のテキストを表示する (`setOrigin()` で中央揃えになるようにする)
    this.message = this.add.text(500, 250, 'スペースキーでスタート', { color: '#f09', fontSize: 30, fontFamily: 'sans-serif', backgroundColor: '#fff', align: 'center' }).setOrigin(0.5, 0);
    
    // プレイヤーを用意する
    this.player = new PlayerObject(this, 50, 250);
    this.physics.add.collider(this.player, this.statusBar);
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => this.player.onPointerMove(pointer, this.state));
    
    // HP 表示
    this.add.text(840, 555, 'HP :', { color: '#fff', fontSize: 30, fontFamily: 'sans-serif'});
    this.hpText = this.add.text(980, 555, '0', { color: '#fff', fontSize: 30, fontFamily: 'sans-serif' }).setOrigin(1, 0);  // 右揃え表示
    
    // アイテム用のグループを用意する
    this.items = this.add.group();
    
    // スペースキーの押下をチェックする
    this.spaceKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }
  
  /** メインループ */
  public update(): void {
    if(this.state === 'GAME_OVER') {
      if(this.spaceKey.isDown) {
        this.state = 'PLAY';
        this.message.setVisible(false).setText('Game Over\nスペースキーでリトライ');  // メッセージを非表示にしつつ2回目以降のメッセージを設定しておく
        
        // HP 設定を開始する
        this.hpText.setText(String(this.hp = this.defaultHp));  // デフォルト値を与える
        this.hpTimerEvent = this.time.addEvent({
          loop: true,  // 停止するまで永遠にループする
          delay: 500,  // 処理間隔
          callback: () => this.hpText.setText(String(this.hp -= 10)),  // 時間経過で減少する
          callbackScope: this
        });
        
        // アイテムを追加し始める
        this.itemsTimerEvent = this.time.addEvent({
          repeat: 0,
          delay: 1000,
          callback: () => console.log('ITEM TIMER'),  // TODO
          callbackScope: this
        });
      }
    }
    else if(this.state === 'PLAY') {
      this.background.tilePositionX += 10;  // 背景を横スクロールさせる
      
      // HP を監視する
      if(this.hp <= 0) {
        this.state = 'GAME_OVER';
        this.message.setVisible(true);
        
        // ループタイマーを停止する
        this.time.removeEvent(this.hpTimerEvent!);
        this.hpTimerEvent = undefined;
        
        return;
      }
      
      // TODO : アイテムを流す … 加点数が異なるアイテムを3種類くらいランダムに流したい
      // TODO : 敵を流す … 敵は左から右へ流れるようにする
      // TODO : スコアを表示する … 時間経過で加算される
    }
  }
}
