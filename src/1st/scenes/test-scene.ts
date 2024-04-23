import Phaser from 'phaser';

import PlayerObject from '../objects/player-object';
import StarObject from '../objects/star-object';
import BombObject from '../objects/bomb-object';

/** テストシーン */
export default class TestScene extends Phaser.Scene {
  /** 背景テクスチャのキー名 */
  private static readonly keyNameSky: string = 'sky';
  /** 地面テクスチャのキー名 */
  private static readonly keyNamePlatform: string = 'platform';
  
  /** 地面たち */
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  /** プレイヤー */
  private player!: PlayerObject;
  /** スターたち */
  private stars!: Phaser.GameObjects.Group;
  /** 爆弾たち */
  private bombs!: Phaser.GameObjects.Group;
  /** スコア表示 */
  private scoreText!: Phaser.GameObjects.Text;
  
  /** スコア */
  private score: number = 0;
  /** ゲームオーバーか否か */
  private isGameOver: boolean = false;
  
  /** コンストラクタ */
  constructor(config: Phaser.Types.Scenes.SettingsConfig) {
    super(config);
  }
  
  /** 画像の事前ロードなどを行う */
  public preload(): void {
    // `./src/1st/` と `./public/1st/` のディレクトリ名を揃えることで、ビルド後に `./dist/1st/` 内で相対パスとして解決できるようにする
    this.load.image(TestScene.keyNameSky      , `./${TestScene.keyNameSky}.png`);
    this.load.image(TestScene.keyNamePlatform , `./${TestScene.keyNamePlatform}.png`);
    this.load.image(StarObject.keyName        , `./${StarObject.keyName}.png`);
    this.load.image(BombObject.keyName        , `./${BombObject.keyName}.png`);
    this.load.spritesheet(PlayerObject.keyName, `./${PlayerObject.keyName}.png`, { frameWidth: 32, frameHeight: 48 });
  }
  
  /** スプライトなどを作成する */
  public create(): void {
    // 背景画像・画面サイズの中央を基準に配置する
    this.add.image(400, 300, TestScene.keyNameSky);
    
    // 地面を追加する
    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(400, 568, TestScene.keyNamePlatform).setScale(2).refreshBody();
    this.platforms.create(600, 400, TestScene.keyNamePlatform);
    this.platforms.create( 50, 250, TestScene.keyNamePlatform);
    this.platforms.create(750, 220, TestScene.keyNamePlatform);
    
    // プレイヤーを追加する
    this.player = new PlayerObject(this, 100, 450);
    this.physics.add.collider(this.player, this.platforms);  // 地面とプレイヤーとの衝突判定を設ける
    
    // スターを追加する
    this.stars = this.add.group();
    for(let i = 0; i < 12; i++) {  // 12個のスターを 70px ずつ間隔を開けて配置する : `physics.add.group()` の `repeat` と `setXY` 相当
      this.stars.add(new StarObject(this, 12 + (i * 70), 0));
    }
    this.physics.add.collider(this.stars, this.platforms);  // 地面とスターたちとの衝突判定を設ける
    this.physics.add.overlap(this.player, this.stars, (player, star) => this.onCollectStar(player as PlayerObject, star as StarObject), undefined, this);  // スター取得処理を定義する
    
    // 爆弾を用意する
    this.bombs = this.physics.add.group();
    this.physics.add.collider(this.bombs, this.platforms);  // 地面と爆弾たとの衝突判定を設ける
    this.physics.add.collider(this.player, this.bombs, player => this.onHitBomb(player as PlayerObject), undefined, this);  // 爆弾との衝突時の処理を定義する
    
    // スコア表示を追加する
    this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', color: '#f09' });
  }
  
  /** ゲームループ中に呼ばれる関数 */
  public update(): void {
    if(this.isGameOver) return;  // ゲームオーバーになったら何もしない
    
    this.player.updatePlayer();
  }
  
  /** スターを取得した時の処理 */
  private onCollectStar(player: PlayerObject, star: StarObject): void {
    // 触れたスターを削除する
    star.disableBody(true, true);
    
    // 残りスターが0個になった時
    if(this.stars.countActive(true) === 0) {
      // スターたちを復活させる
      this.stars.children.iterate((child) => {
        const star = child as StarObject;
        star.enableBody(true, star.x, 0, true, true);
        return true;  // `iterate()` を続行させるために必要
      });
      
      // 第2ラウンドからは爆弾を1個ずつ追加していく
      const bombX = player.x < 400 ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
      this.bombs.add(new BombObject(this, bombX, 16));
    }
    
    // スコアを更新する
    this.score += 10;
    this.scoreText.setText(`Score: ${this.score}`);
  }
  
  /** 爆弾に当たった時の処理 */
  private onHitBomb(player: PlayerObject): void {
    player.onHitBombPlayer();
    this.physics.pause();  // 停止する
    this.isGameOver = true;  // ゲームオーバーにする
  }
}
