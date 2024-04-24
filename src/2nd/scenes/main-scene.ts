import Phaser from 'phaser';

import PlayerObject from '../objects/player-object';
import ItemObject from '../objects/item-object';

/** ゲームの状態定義 */
export type State = 'PLAY' | 'GAME_OVER';

/** メインシーン */
export default class MainScene extends Phaser.Scene {
  /** HP デフォルト値 */
  private readonly defaultHp: number = 200;
  
  /** 背景スプライト (横スクロールできるようにする) */
  private background!: Phaser.GameObjects.TileSprite;
  /** ステータスバー (当たり判定を設けるため控えておく) */
  private statusBar!: Phaser.Types.Physics.Arcade.ImageWithStaticBody;
  /** メッセージ */
  private message!: Phaser.GameObjects.Text;
  
  /** HP */
  private hp: number = this.defaultHp;
  /** HP テキスト */
  private hpText!: Phaser.GameObjects.Text;
  /** HP タイマーイベント */
  private hpTimerEvent?: Phaser.Time.TimerEvent;
  
  /** スコア */
  private score: number = 0;
  /** スコアテキスト */
  private scoreText!: Phaser.GameObjects.Text;
  /** スコアタイマーイベント */
  private scoreTimerEvent?: Phaser.Time.TimerEvent;
  
  /** プレイヤー */
  private player!: PlayerObject;
  
  /** アイテムたち */
  private items!: Phaser.GameObjects.Group;
  /** アイテムタイマーイベント */
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
    
    const statusBarTextStyle = { color: '#fff', fontSize: 30, fontFamily: 'sans-serif' };
    
    // HP 表示
    this.add.text(840, 555, 'HP :', statusBarTextStyle);
    this.hpText = this.add.text(980, 555, '0', statusBarTextStyle).setOrigin(1, 0);  // 右揃え
    // スコア表示
    this.add.text(20, 530, 'Score :', statusBarTextStyle);
    this.scoreText = this.add.text(200, 530, '0', statusBarTextStyle).setOrigin(1, 0);  // 右揃え
    
    // プレイヤーを用意する
    this.player = new PlayerObject(this, 50, 250);
    this.physics.add.collider(this.player, this.statusBar);
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => this.player.onPointerMove(pointer, this.state));
    
    // アイテム用のグループを用意する
    this.items = this.add.group();
    this.physics.add.overlap(this.player, this.items, (player, item) => this.onCollectItem(player as PlayerObject, item as ItemObject), undefined, this);
    
    // スペースキーの押下をチェックする
    this.spaceKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }
  
  /** メインループ */
  public update(): void {
    if(this.state === 'GAME_OVER') {
      if(this.spaceKey.isDown) {
        this.state = 'PLAY';
        this.message.setVisible(false).setText('Game Over\nスペースキーでリトライ');  // メッセージを非表示にしつつ2回目以降のメッセージを設定しておく
        
        // HP 監視を開始する
        this.updateHp(this.defaultHp);  // デフォルト値を与える
        this.hpTimerEvent = this.time.addEvent({
          loop: true,  // 停止するまで永遠にループする
          delay: 500,  // 処理間隔
          callback: () => {  // 時間経過で減少する
            this.updateHp(Math.max(this.hp - 10, 0));  // 負数が出ないようにする
          },
          callbackScope: this
        });
        // スコア計測を開始する
        this.updateScore(0);  // リセットする
        this.scoreTimerEvent = this.time.addEvent({
          loop: true,
          delay: 500,  // HP タイマーと同じタイミングにしておく
          callback: () => this.updateScore(this.score + 10),
          callbackScope: this
        });
        
        // アイテムを空にする
        this.items.clear(true, true);
        // アイテムを追加し始める
        this.itemsTimerEvent = this.time.addEvent({
          loop: true,  // `repeat: 0` で1回だけ実行される
          delay: 1000,  // TODO : コレだと等間隔に出現してつまらないので要調整
          callback: () => {
            this.items.add(new ItemObject(this, 1025, Phaser.Math.Between(25, 475)));
          },
          callbackScope: this
        });
      }
    }
    else if(this.state === 'PLAY') {
      this.background.tilePositionX += 10;  // 背景を横スクロールさせる
      
      // HP を監視する
      if(this.hp <= 0) {
        this.state = 'GAME_OVER';
        this.message.setVisible(true).depth = 100;  // 重なり順を一番上にするための指定 (テキトー)
        
        // HP タイマーを停止する
        this.time.removeEvent(this.hpTimerEvent!);
        this.hpTimerEvent = undefined;
        // スコアタイマーを停止する
        this.time.removeEvent(this.scoreTimerEvent!);
        this.scoreTimerEvent = undefined;
        
        // 場にあるアイテムを止める
        this.items.children.iterate(child => {
          (child as ItemObject).setVelocityX(0);
          return true;
        });
        // アイテムタイマーを停止する
        this.time.removeEvent(this.itemsTimerEvent!);
        this.itemsTimerEvent = undefined;
        
        return;
      }
      
      // TODO : アイテムを流す … 加点数が異なるアイテムを3種類くらいランダムに流したい
      // TODO : 敵を流す … 敵は左から右へ流れるようにする
    }
  }
  
  /** HP を更新する */
  private updateHp(newHp: number): void {
    this.hp = newHp;
    this.hpText.setText(String(newHp));
  }
  
  /** スコアを更新する */
  private updateScore(newScore: number): void {
    this.score = newScore;
    this.scoreText.setText(String(newScore));
  }
  
  /** プレイヤーがアイテムを取得した時の処理 */
  private onCollectItem(_player: PlayerObject, item: ItemObject): void {
    this.items.remove(item, true, true);  // アイテムを消す
    this.updateHp(this.hp + 10);  // HP を回復させる TODO : アイテムによって異なる回復量にしたい
  }
}