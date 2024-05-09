import Phaser from 'phaser';

import HpObject from '../objects/hp-object';
import ScoreObject from '../objects/score-object';
import ItemsObject from '../objects/items-object';
import ItemObject from '../objects/item-object';
import PlayerObject from '../objects/player-object';

/** ゲームの状態定義 */
export type State = 'PLAY' | 'GAME_OVER';

/** メインシーン */
export default class MainScene extends Phaser.Scene {
  /** 背景テクスチャのキー名 */
  private static readonly keyNameBackground: string = 'background';
  /** ステータスバーテクスチャのキー名 */
  private static readonly keyNameStatusBar: string = 'status-bar';
  /** ゲームスタートサウンドのキー名 */
  private static readonly keyNameGameStart: string = 'game-start';
  /** ゲームオーバーサウンドのキー名 */
  private static readonly keyNameGameOver: string = 'game-over';
  
  /** 背景スプライト (横スクロールできるようにする) */
  private background!: Phaser.GameObjects.TileSprite;
  /** メッセージ */
  private message!: Phaser.GameObjects.Text;
  
  /** HP オブジェクト */
  private hpObject!: HpObject;
  /** スコアオブジェクト */
  private scoreObject!: ScoreObject;
  /** アイテム群オブジェクト */
  private itemsObject!: ItemsObject;
  /** プレイヤー */
  private player!: PlayerObject;
  
  /** スペースキー */
  private spaceKey!: Phaser.Input.Keyboard.Key;
  /** ゲームの状態 */
  private state: State = 'GAME_OVER';
  
  /** プリロード */
  public preload(): void {
    this.load.image(MainScene.keyNameBackground, `./${MainScene.keyNameBackground}.png`);
    this.load.image(MainScene.keyNameStatusBar , `./${MainScene.keyNameStatusBar}.png`);
    this.load.image(PlayerObject.keyName       , `./${PlayerObject.keyName}.png`);
    this.load.image(ItemObject.keyNameSora     , `./${ItemObject.keyNameSora}.png`);
    this.load.image(ItemObject.keyNameEri      , `./${ItemObject.keyNameEri}.png`);
    this.load.image(ItemObject.keyNameUnknown  , `./${ItemObject.keyNameUnknown}.png`);
    this.load.image(ItemObject.keyNameEnemy    , `./${ItemObject.keyNameEnemy}.png`);
    this.load.image(ItemObject.keyNameBomb     , `./${ItemObject.keyNameBomb}.png`);
    this.load.audio(`sound-${MainScene.keyNameGameStart}`, `./sound-${MainScene.keyNameGameStart}.mp3`);
    this.load.audio(`sound-${MainScene.keyNameGameOver}` , `./sound-${MainScene.keyNameGameOver}.mp3`);
    this.load.audio(`sound-${ItemObject.keyNameSora}`    , `./sound-${ItemObject.keyNameSora}.mp3`);
    this.load.audio(`sound-${ItemObject.keyNameEri}`     , `./sound-${ItemObject.keyNameEri}.mp3`);
    this.load.audio(`sound-${ItemObject.keyNameUnknown}` , `./sound-${ItemObject.keyNameUnknown}.mp3`);
    this.load.audio(`sound-${ItemObject.keyNameEnemy}`   , `./sound-${ItemObject.keyNameEnemy}.mp3`);
    this.load.audio(`sound-${ItemObject.keyNameBomb}`    , `./sound-${ItemObject.keyNameBomb}.mp3`);
  }
  
  /** 初期化処理 */
  public create(): void {
    // 背景 (横スクロールさせる) を配置する
    this.background = this.add.tileSprite(0, 0, 1000, 500, MainScene.keyNameBackground).setOrigin(0, 0);
    // ステータスバーを配置する (`refreshBody()` で `setOrigin()` による当たり判定のズレを修正する)
    this.physics.add.staticImage(0, 500, MainScene.keyNameStatusBar).setOrigin(0, 0).refreshBody();
    // 初期状態のテキストを表示する (`setOrigin()` で中央揃えになるようにする)
    this.message = this.add.text(500, 250, 'スペースキーでスタート', { color: '#f09', fontSize: 30, fontFamily: 'sans-serif', backgroundColor: '#fff', align: 'center' }).setOrigin(0.5, 0);
    
    this.hpObject = new HpObject(this);             // HP 表示
    this.scoreObject = new ScoreObject(this);       // スコア表示
    this.itemsObject = new ItemsObject(this);       // アイテム群
    this.player = new PlayerObject(this, 50, 250);  // プレイヤーを用意する
    
    // プレイヤーをカーソルに追従させる処理
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => this.player.onPointerMove(pointer, this.state, this.hpObject.hp));
    // プレイヤーとアイテムが重なった時の処理
    this.physics.add.overlap(this.player, this.itemsObject.items, (player, item) => this.onCollectItem(player as PlayerObject, item as ItemObject), undefined, this);
    // スペースキーの押下をチェックする
    this.spaceKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    // カーソルを調整する
    this.input.setDefaultCursor('crosshair');
  }
  
  /** メインループ */
  public update(): void {
    if(this.state === 'GAME_OVER') {
      if(this.spaceKey.isDown) {  // スペースキーで開始する
        this.hpObject.createTimerEvent();     // HP 監視を開始する
        this.scoreObject.createTimerEvent();  // スコア計測を開始する
        this.itemsObject.createTimerEvent();  // アイテム群の初期化・タイマー処理を開始する
        
        this.sound.play(`sound-${MainScene.keyNameGameStart}`, { volume: 0.5 });
        this.message.setVisible(false).setText('Game Over\nスペースキーでリトライ');  // メッセージを非表示にしつつ2回目以降のメッセージを設定しておく
        this.state = 'PLAY';
      }
    }
    else if(this.state === 'PLAY') {
      this.background.tilePositionX += 10;  // 背景を横スクロールさせる
      
      if(this.hpObject.hp <= 0) {  // HP が 0 になったらプレイヤー落下開始
        this.player.setVelocityY(50);  // 直前までの Tween による挙動は残した方が面白そう・プレイヤー落下開始
        
        // プレイヤーが地面に付いたらゲームオーバー
        if(this.player.y >= 475) {
          this.player.setVelocityY(0);          // プレイヤーを止める
          this.hpObject.removeTimerEvent();     // HP タイマーを停止する
          this.scoreObject.removeTimerEvent();  // スコアタイマーを停止する
          this.itemsObject.removeTimerEvent();  // アイテムを止める
          
          this.sound.play(`sound-${MainScene.keyNameGameOver}`, { volume: 0.5 });
          this.message.setVisible(true).depth = 100;  // 重なり順を一番上にするための指定 (値はテキトーだがコレで最前面表示にできているのでよしとする)
          this.state = 'GAME_OVER';
        }
      }
      else {
        this.player.setVelocityY(0);  // HP 0 からの復帰時に重力を戻す
      }
    }
  }
  
  /** プレイヤーがアイテムを取得した時の処理 */
  private onCollectItem(player: PlayerObject, item: ItemObject): void {
    player.onCollectItem(item);                       // プレイヤーの点滅処理
    item.onCollectItem();                             // サウンド再生
    this.itemsObject.items.remove(item, true, true);  // アイテムを消す
    this.hpObject.updateHp(Math.max(this.hpObject.hp + item.point, 0));  // HP を回復 or 減少させる (負数にならないようにする)
    
    if(item.keyName === ItemObject.keyNameBomb) player.setY(475);  // 爆弾を取った時に地面にぶつける = HP を減少させたことと合わせて即死にする
  }
}
