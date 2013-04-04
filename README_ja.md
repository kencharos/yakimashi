yakimashi
==========

写真のプリント整理アプリ  
定期的に写真のプリントを行うと時間がかかるので、改善のため個人的な目的で作ったものです。  
家庭内のLAN内で使うことを想定していますので、ログイン機能などを持ちません。

自身の学習のため以下の製品やサービスを使っています。
+ Play Framework 2.1(Scala) with play-salat plug-in
+ mongoDB

herokuでのサンプルは[こちら](http://yakimashi.herokuapp.com/ "sample")

使い方
------
***導入方法***  
+ 当プロジェクトの取得
+ play frameworkのインストール
+ mondoDBのインストールまたはクラウド等のサービスから取得
+ conf/application.conf の以下のプロパティを自身のmongoDBの設定に置き換える。
  ` mongodb.default.uri="mongodb://127.0.0.1:27017/yakimashi" `
+ `$ play run`
+ `http://localhost:9000` にアクセス

***アルバムの追加***
+ 雑な運用だが、`public/album` にディレクトリを作成しファイルを格納することでアルバムを追加する。

ライセンス
----------
Distributed under the [MIT License][mit].  

[MIT]: http://www.opensource.org/licenses/mit-license.php