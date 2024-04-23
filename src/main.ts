import Phaser from 'phaser';

import TestScene from './scenes/test-scene';

/** ゲーム設定 */
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,  // デフォルトは WebGL・うまく動作しない場合は Canvas にフォールバックする
  width : 800,
  height: 600,
  parent: 'app',  // 親要素の `id` 属性を指定する
  physics: {
    default: 'arcade',  // デフォルトの物理演算システムを指定する
    arcade: {
      gravity: {
        x: 0,  // 横方向の重力はナシのため `0` で良い
        y: 300
      },
      debug: false  // `true` にするとデバッグ用の枠が出る
    }
  },
  scene: [TestScene]
};

// ゲーム開始
new Phaser.Game(config);
