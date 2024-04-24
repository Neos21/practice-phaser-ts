import Phaser from 'phaser';

import ItemObject from './item-object';

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
    // アイテムを追加し始める
    this.itemsTimerEvent = this.scene.time.addEvent({
      loop: true,   // `repeat: 0` で1回だけ実行される
      delay: 1000,
      callback: () => {
        // 敵 : たまにしか出ないようにする
        const isAddEnemy = Phaser.Math.Between(0, 10) > 8;
        if(isAddEnemy) this.items.add(new ItemObject(this.scene, -50, Phaser.Math.Between(25, 475), ItemObject.keyNameEnemy));
        
        // アイテム : 時々出ないようにする
        const isAddItem = Phaser.Math.Between(0, 10) > 1;
        if(isAddItem) {
          const keyName = Phaser.Math.Between(0, 1) === 0 ? ItemObject.keyNameSora : ItemObject.keyNameEri;  // どちらのキャラを出すか決める
          this.items.add(new ItemObject(this.scene, 1025, Phaser.Math.Between(25, 475), keyName));
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
