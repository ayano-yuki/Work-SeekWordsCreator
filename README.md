# SeekWords Creator
## 背景
失語症とは事故や脳梗塞などによって言語中枢の一部を損害されることにより、いったん獲得した言語機能が障害される高次機能障害の一つである。聞く、話す、読む、書く、計算するといった脳の機能が障害される。失語症は完治することは難しいが、リハビリテーション（以下、リハビリ）によって症状が軽減できるといわれている。

## 実験内容
本実験では失語症患者向けリハビリテーションアプリを開発する。また、失語症患者向けの教材は認知症患者や発達障碍児への適応も期待される。そこで、本実験では、言語機能訓練を目的として「シークワーズ」または「シークワーズ答え探し」をWEBアプリとして実装する。

## 実装する機能
- [ ] シークワーズのサイズ
  - [ ] 7×7、または9×9
  - [ ]  可変長
- [ ]  文字は平仮名のみ
  - [ ]  指定したテーマ（ファイル）の解答を必ず含める
- [ ]  文字数は2文字から5文字
- [ ]  文字の並びは単語の先頭から縦・横・斜めの全方向で、途中で折り曲がらない
- [ ]  シークワーズ：生成したゲームを画面に表示する
- [ ]  シークワーズ答え探し：回答結果を画面に表示する
- [ ]  生成したシークワーズをPDFでダウンロードできるようにする

# システム概要
- NEXT.js14
- 