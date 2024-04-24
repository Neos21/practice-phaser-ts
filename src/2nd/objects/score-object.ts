import Phaser from 'phaser';

/** スコアオブジェクト */
export default class ScoreObject {
  /** 共用するテキストスタイル */
  private readonly textStyle: Phaser.Types.GameObjects.Text.TextStyle = { color: '#fff', fontSize: 30, fontFamily: 'sans-serif' };
  
  /** スコア */
  public score!: number;
  
  /** シーン */
  private scene!: Phaser.Scene;
  /** スコアテキスト */
  private scoreText!: Phaser.GameObjects.Text;
  /** スコアタイマーイベント */
  private scoreTimerEvent?: Phaser.Time.TimerEvent;
  
  /** コンストラクタ */
  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    // 「Score :」の固定文言・一度書いたら二度と動かさない
    this.scene.add.text(20, 530, 'Score :', this.textStyle);
    // 初期値を与える
    this.score = 0;
    // スコア表示
    this.scoreText = this.scene.add.text(250, 530, String(this.score), this.textStyle).setOrigin(1, 0);  // 右揃え
  }
  
  /** ゲームスタート時のタイマーを設定する */
  public createTimerEvent(): void {
    this.updateScore(0);  // リセットする
    this.scoreTimerEvent = this.scene.time.addEvent({
      loop: true,
      delay: 500,  // HP タイマーと同じタイミングにしておく
      callback: () => this.updateScore(this.score + 10),
      callbackScope: this
    });
  }
  
  /** ゲームオーバー時にタイマーを止める */
  public removeTimerEvent(): void {
    this.scene.time.removeEvent(this.scoreTimerEvent!);
    this.scoreTimerEvent = undefined;
  }
  
  /** スコアを更新する */
  public updateScore(newScore: number): void {
    this.score = newScore;
    this.scoreText.setText(String(newScore));
  }
}
