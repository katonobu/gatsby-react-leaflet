# gatsby,react,leafletのサンプル
## 素のgatsby projectを生成/動作確認
```
$ gatsby new gatsby-react-leaflet https://github.com/gatsbyjs/gatsby-starter-hello-world
$ cd gatsby-react-leaflet
$ gatsby develop --host=0.0.0.0
```
## react-leafletのインストール
[本家](https://react-leaflet.js.org/docs/start-installation/)の指示に従い、
```
$ yarn add react react-dom leaflet
$ yarn add react-leaflet
```
うまくいかなかったので作戦変更

## gatsby-plugin-react-leafletを使う
[本家](https://github.com/dweirich/gatsby-plugin-react-leaflet)
```
$ yarn add gatsby-plugin-react-leaflet
```
gatsby-config.jsを修正
