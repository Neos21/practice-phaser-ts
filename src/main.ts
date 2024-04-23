import Phaser from 'phaser';

import TestScene from './scenes/test-scene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,  // デフォルトは WebGL・うまく動作しない場合は Canvas にフォールバックする
  width: 800,
  height: 600,
  parent: 'app',  // 親要素の `id` 属性を指定する
  physics: {
    default: 'arcade',  // デフォルトの物理演算システムを指定する
    arcade: {
      gravity: {
        y: 300
      },
      debug: false
    }
  },
  scene: [TestScene]
};

new Phaser.Game(config);
