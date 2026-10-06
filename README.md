# ⚡ LLM Prompt Latency & Cost Profiler

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x%20%2F%206.x-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646cff?logo=vite&logoColor=white)](https://vitejs.dev/)
[![AI Observability](https://img.shields.io/badge/LLM-Latency%20%26%20Cost%20Profiler-emerald)](https://github.com/mizoe0829/agent-trace-lens)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

> **「1つのプロンプト処理にどれくらい時間がかかり、いくらコストが発生するのか？」をリアルタイムに計測・モデル比較できる開発者向けプロファイラー**

---

## 💡 開発の背景

LLMを使ったプロダクト開発（AIチャット、要約、コード生成、AIエージェントのツール呼び出し）において、エンジニアが最も頻繁に直面する課題が **「レイテンシ（処理時間）とコストの最適化」** です。

- **「このプロンプト、実際にユーザーを何秒待たせるのか？」**
- **「最初の1文字が出るまでの初速（TTFT: Time to First Token）は？」**
- **「Claude 3.5 Sonnet、GPT-4o、Gemini 1.5 Flashで処理速度や費用はどう違う？」**

本ツールは、任意のプロンプトに対して **処理時間（秒/ms）、TTFT、生成スループット（tokens/sec）、トークン数、APIコスト（USD/JPY）** をワンクリックで計測・比較できる王道のLLMパフォーマンスプロファイラーです。

---

## ✨ 主な機能

- **⏱ 1プロンプトあたりのリアルタイム計測**:
  - **総処理時間 (Total Latency)**: 推論開始から完了までの実測時間
  - **初速 (TTFT: Time to First Token)**: 最初の1トークンが返ってくるまでの待機時間
  - **生成速度 (Throughput)**: 1秒あたりの出力トークン数 (`tokens/sec`)
  - **トークン数**: プロンプト入力トークン / 出力トークン の自動カウント
  - **APIコスト**: 最新価格レートに基づく推定費用（USD & JPY換算）
- **📊 主要モデル一括比較バー**:
  - 同じプロンプトに対する「Claude 3.5 Sonnet vs GPT-4o vs GPT-4o-mini vs Gemini 1.5 Flash vs Gemini 1.5 Pro」の処理速度・レイテンシ・コストを横並びで可視化。
- **🎯 実務でよく使う標準ベンチマークプリセット**:
  - **TypeScript コード生成**: アルゴリズム（LRUキャッシュ）実装とテスト
  - **長文技術ドキュメント要約**: システム障害ポストモーテムの箇条書き要約
  - **JSON 構造化データ抽出**: 問い合わせ文からのスキーマ抽出
  - **アーキテクチャ比較 Q&A**: REST vs GraphQLの選定基準
- **📝 計測ログ履歴 & CSVエクスポート**:
  - 過去のプロンプト計測結果をテーブル一覧で保持、CSVダウンロード対応。

---

## 🛠 技術スタック

- **言語**: TypeScript (100% Strict Type Safety, `verbatimModuleSyntax`)
- **フロントエンド**: React 19 + Vite 8
- **スタイリング**: Vanilla CSS Design System (CSS変数によるダークテーマ、Glassmorphism)
- **アイコン**: Lucide React

---

## 🚀 ローカル起動方法

```bash
# パッケージインストール
npm install

# 開発サーバー起動
npm run dev

# プロダクションビルド & 型検査
npm run build
```

---

## 📄 ライセンス

MIT License
