import Phaser from 'phaser';

import MainScene, { gameHeight, gameWidth } from './scenes/main-scene';

/** ゲーム設定 */
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,  // デフォルトは WebGL・うまく動作しない場合は Canvas にフォールバックする
  width : gameWidth,
  height: gameHeight,
  parent: 'app',  // 親要素の `id` 属性を指定する
  scale: {
    autoCenter: Phaser.Scale.CENTER_HORIZONTALLY  // 画面の左右中央に揃える
  },
  physics: {
    default: 'arcade',  // デフォルトの物理演算システムを指定する
    arcade: {
      gravity: {
        x: 0,  // 横方向の重力はナシのため `0` で良い
        y: 0   // 縦方向の重量はデフォルトでナシにしておく
      },
      debug: false  // `true` にするとデバッグ用の枠が出る
    }
  },
  scene: [MainScene]
};

// ゲーム開始
new Phaser.Game(config);
