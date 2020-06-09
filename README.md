# Nasi

過去に作成していたWebGLライブラリthree.jsのラッパーライブラリ。

主に学生時代の卒業制作のAR作品のために使用。

[tempフォルダ](https://github.com/nasikusa/Nasi/tree/master/src/temp)の中にあります、３つのファイルが最初に作成したものであり、
こちらが今のところ本体です。
( モジュールシステムを使用した形式に変更しようと思ったのですが、元コード量が非常に多すぎたため途中にて断念 )

JavaScriptのモジュールシステムに対しての理解が薄いときに作成したものであり、内部ファイルの構造が甘いですが、かなりコード量が多くなっており、
いろいろな勉強になったライブラリでありました。

JSのthisやbindなどいろいろな勉強になったライブラリ。

## 構成

### [base](https://github.com/nasikusa/Nasi/blob/master/src/temp/base.js)

諸々の設定値、カラー、ベースとなる関数を保持

### [main](https://github.com/nasikusa/Nasi/blob/master/src/temp/main.js)

メインとなる処理が記述されている。

### [dev](https://github.com/nasikusa/Nasi/blob/master/src/temp/dev.js)

主にGUIによる場面の管理を担当。

現在のところ、色の管理のみを担当。
