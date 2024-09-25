# Practice Phaser + TypeScript

__[Enter The WebSite](https://neos21.github.io/practice-phaser-ts/)__


## Setup

Phaser.js を TypeScript で書くため Vite で環境構築しています。

```bash
# Vite で Vanilla TS 環境を構築する
$ npm init vite@latest
Need to install the following packages:
create-vite@5.2.3
Ok to proceed? (y) y
✔ Project name: … practice-phaser-ts
✔ Select a framework: › Vanilla
✔ Select a variant: › TypeScript

Scaffolding project in /home/neo/Documents/Dev/Sandboxes/practice-phaser-ts...

Done. Now run:

  cd practice-phaser-ts
  npm install
  npm run dev

# - 初期ファイルを適宜調整する
# - vite.config.ts
# - .github/workflows/deploy-github-pages.yaml

# Phaser.js をインストールする
$ npm install --save phaser
```


## References

- 1st Game
  - [【作業ログ】【Phaser】【Typescript】「Making your first Phaser 3 game」](https://zenn.dev/oneichan/scraps/b1cea52cc7f95e)
  - [dominik-selmeci/making-your-first-phaser-3-game-with-typescript: My approach to official tutorial from Phaser 3 with Typescript](https://github.com/dominik-selmeci/making-your-first-phaser-3-game-with-typescript)
- Vite Multi Page Build
  - [Add a way to control output paths of HTML entries in multi-page apps · Issue #15612 · vitejs/vite](https://github.com/vitejs/vite/issues/15612)
  - [【Vite】複数ページある場合の設定を考える - UGA Boxxx](https://uga-box.hatenablog.com/entry/2022/05/03/000000)
- 2nd Game
  - [phaserjs/template-vite-ts: A Phaser 3 project template that uses TypeScript and Vite for bundling](https://github.com/phaserjs/template-vite-ts)
  - [Continuous Side Scrolling in a Phaser Game with Tile Sprites](https://www.thepolyglotdeveloper.com/2020/08/continuous-side-scrolling-phaser-game-tile-sprites/)
  - [setOrigin(0, 0) is not in sync with Arcade Physics body · Issue #5079 · phaserjs/phaser](https://github.com/phaserjs/phaser/issues/5079#issuecomment-613483608)
  - [Control your cross platform HTML5 game with keyboard, mouse or touch input with an all-in-one TypeScript code, powered by Phaser | Emanuele Feronato](https://www.emanueleferonato.com/2021/10/03/control-your-cross-platform-html5-game-with-keyboard-mouse-or-touch-input-with-an-all-in-one-typescript-code-powered-by-phaser/)
  - [Follow mouse/pointer with smooth acceleration/declaration - Phaser 3 - Phaser](https://phaser.discourse.group/t/follow-mouse-pointer-with-smooth-acceleration-declaration/4153/3)
  - [Phaser 3 | テキストの各パラメータ一覧と指定方法 | 1 NOTES](https://1-notes.com/add-text-set-parameter/)
  - [How to remove text - Phaser 3 - Phaser](https://phaser.discourse.group/t/how-to-remove-text/742)
  - [Phaser 3 | 基準値を指定してテキストを中央に揃える方法 | 1 NOTES](https://1-notes.com/add-text-set-align-to-center/)
  - [Phaser3でタイマーイベントを使う - 頑張らないために頑張る](https://ysko909.github.io/posts/use-timer-event-with-phaserjs/)
  - [Time.addEvent remove won't actually REMOVE it - Phaser 3 - Phaser](https://phaser.discourse.group/t/time-addevent-remove-wont-actually-remove-it/9757)
  - [santa/src/scenes/MyScene.ts at main · babu-ch/santa](https://github.com/babu-ch/santa/blob/main/src/scenes/MyScene.ts)
  - [Phaser 3 : depthで重なり順の制御 - ゲームプログラミングノート](https://gpnotes.hatenablog.jp/entry/2019/01/16/170100)


## Links

- [Neo's World](https://neos21.net/)
- [GitHub - Neos21](https://github.com/Neos21)
- [GitHub - practice-phaser-ts](https://github.com/Neos21/practice-phaser-ts)
- [GitHub Pages - practice-phaser-ts : Practice Phaser + TypeScript](https://neos21.github.io/practice-phaser-ts)
