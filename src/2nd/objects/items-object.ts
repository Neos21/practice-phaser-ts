import Phaser from 'phaser';

import ItemObject from './item-object';

/** レベル定義 */
type Level = 'easy' | 'hard' | 'zarigani';

/** アイテム群を抱えるオブジェクト */
export default class ItemsObject {
  /** アイテム群 */
  public items!: Phaser.GameObjects.Group;
  
  /** シーン */
  private scene!: Phaser.Scene;
  /** アイテムタイマーイベント */
  private itemsTimerEvent?: Phaser.Time.TimerEvent;
  
  /** コンストラクタ */
  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.items = this.scene.add.group();
  }
  
  /** ゲームスタート時のタイマーを設定する */
  public createTimerEvent(): void {
    // アイテムを空にする
    this.items.clear(true, true);
    
    // レベル選択 (セレクトボックス)
    const level: Level = (document.getElementById('level') as any).value || 'easy';  // `value` で良いだろ
    
    // アイテムを追加し始める
    this.itemsTimerEvent = this.scene.time.addEvent({
      loop: true,   // `repeat: 0` で1回だけ実行される
      delay: level === 'hard' ? 500 : level === 'zarigani' ? 250 : 800,
      callback: () => {
        // アイテム・敵ごとに出現率を調整して出現させる
        
        // アイテム
        const isAddItem = (() => {
          const value = Phaser.Math.Between(0, 10);
          if(level === 'zarigani') return value > 5;  // `zarigani` モードでは少なめ
          return value > 1;  // `easy`・`hard` 時の割合
        })();
        if(isAddItem) {
          const keyName = Phaser.Math.Between(0, 1) === 0 ? ItemObject.keyNameSora : ItemObject.keyNameEri;  // どちらのキャラを出すか決める
          this.items.add(new ItemObject(this.scene, 1025, Phaser.Math.Between(25, 475), Phaser.Math.Between(-700, -400), keyName));
        }
        
        // レアアイテム
        const isAddRareItem = Phaser.Math.Between(0, 50) === 0;
        if(isAddRareItem) {
          this.items.add(new ItemObject(this.scene, 1025, Phaser.Math.Between(25, 475), Phaser.Math.Between(-1400, -1000), ItemObject.keyNameUnknown));
        }
        
        // 敵
        const isAddEnemy = (() => {
          const value = Phaser.Math.Between(0, 10);
          if(level === 'easy' || level === 'hard') return value > 2;
          return value > 1;  // `zarigani` モードはさらに出やすく
        })();
        if(isAddEnemy) this.items.add(new ItemObject(this.scene, -50, Phaser.Math.Between(25, 475), Phaser.Math.Between(1000, 600), ItemObject.keyNameEnemy));
        
        // 爆弾
        const isAddBomb = Phaser.Math.Between(0, 20) === 0;
        if(isAddBomb) {
          this.items.add(new ItemObject(this.scene, -50, Phaser.Math.Between(25, 475), Phaser.Math.Between(1400, 900), ItemObject.keyNameBomb));
        }
        
        // 画面外に消えたオブジェクトを削除する
        const itemsToRemove: Array<ItemObject> = [];
        this.items.children.iterate(child => {
          const item = child as ItemObject;
          if(item.keyName === ItemObject.keyNameEnemy && item.x > 1050) itemsToRemove.push(item);  // 敵が右端に消えた場合
          if(item.keyName !== ItemObject.keyNameEnemy && item.x <  -50) itemsToRemove.push(item);  // アイテムが左端に消えた場合
          return true;
        });
        itemsToRemove.forEach(item => this.items.remove(item));
      },
      callbackScope: this
    });
  }
  
  /** ゲームオーバー時にタイマーを止める */
  public removeTimerEvent(): void {
    this.items.children.iterate(child => {
      (child as ItemObject).setVelocityX(0);  // 場にあるアイテムを止める
      return true;
    });
    this.scene.time.removeEvent(this.itemsTimerEvent!);
    this.itemsTimerEvent = undefined;
  }
}
