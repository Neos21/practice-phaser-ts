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


## Links

- [Neo's World](https://neos21.net/)
- [GitHub Pages - practice-phaser-ts : Practice Phaser + TypeScript](https://neos21.github.io/practice-phaser-ts)
