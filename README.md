# 🔍 Agent Trace Lens (エージェント・トレース・レンズ)

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x%20%2F%206.x-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646cff?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Observability](https://img.shields.io/badge/AI_Agent-Observability-emerald)](https://github.com/mizoe0829/agent-trace-lens)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

> **LLM / 自律型AIエージェントの思考プロセス・ツール呼び出し・トークン消費・フォールバックを直感的に可視化するモダン・トレースビューア**

---

## 💡 開発の背景と課題

生成AIや自律エージェント（ReActループ、Multi-Agent協調）の実務開発において最大のペインとなるのが、**「裏でAIがどう推論し、どのツールをどんな引数で呼び出し、どこで失敗したかがブラックボックス化すること」** です。

`Agent Trace Lens` は、LangfuseやOpenTelemetryのようにエージェントの実行コンテキストを即座に分解し、
1. **思考プロセス (Reasoning / Chain of Thought)**
2. **ツール呼び出し (Tool Calling / I/O Arguments & Payloads)**
3. **自己修復 (Self-healing Fallbacks)**
4. **トークン消費量・レイテンシ・APIコスト**

を直感的なDAGフローとタイムラインでデバッグ・監査・共有可能にする開発者向けWebツールです。

---

## ✨ 主な機能

- **⚡ インタラクティブなDAG実行フロー**:
  - ステップ間の遷移を有向非巡回グラフ（DAG）形式でシーケンシャルに可視化。
  - 各ノードのステータス（成功、自己修復フォールバック、実行中）とレイテンシを俯瞰。
- **⏱ 実行タイムライン & フィルタリング**:
  - `Thought`, `Tool Call`, `RAG照会`, `Evaluation`, `Fallback` のカテゴリ別フィルタリング。
- **🔬 ディープ・インスペクター**:
  - ツールの入出力JSON（Arguments / Output）のフォーマット表示とワンクリッククリップボードコピー。
  - プロンプトトークン vs 完了トークンのリアルタイム消費比率バー。
- **▶️ ステップ・リプレイ再生**:
  - エージェントの実行順序を1ステップずつアニメーションで追体験できるシミュレーション機能。
- **📥 トレースJSONインポート & 📝 Markdownレポート出力**:
  - 外部のLangfuse / LangChainログ形式のJSONを取り込み可能。
  - チーム共有やIssue・PRにそのまま貼れるMarkdownレポートを自動生成。

---

## 🎯 収録プリセット・シナリオ

実務のリアルなAIエージェント運用を想定したプリセットデータを標準搭載しています：

| シナリオ | 概要 | 主なツール呼び出し |
| :--- | :--- | :--- |
| **労務相談AI (36協定・特別条項)** | 社員の残業上限判定、法適合性チェックおよび特別条項発動要件の自動照会 | `vector_search_labor_agreements`, `fetch_employee_attendance_metrics`, `generate_advisory_response` |
| **GitHub Issue 自動トリアージ** | バグ再現コード生成・AST影響範囲特定・自己修復パッチ生成・PR起票 | `ripgrep_codebase_symbol`, `run_isolated_test_runner` (Fallback発動), `create_github_pull_request` |
| **マルチエージェント監査** | Planner・Coder・SecurityReviewerの3自律エージェント協調パイプライン | `generate_code_artifact`, `security_ast_audit` |

---

## 🛠 技術スタック

- **言語**: TypeScript (100% Strict Type Safety, `verbatimModuleSyntax`)
- **UIフレームワーク**: React 19 + Vite 8
- **スタイリング**: Vanilla CSS Design System (独自CSS変数トークン、Glassmorphism、ダークモード標準)
- **アイコン**: Lucide React

---

## 🚀 ローカル起動方法

```bash
# 依存パッケージのインストール
npm install

# 開発サーバーの起動 (Vite)
npm run dev

# プロダクションビルド & 型検査
npm run build
```

---

## 📄 ライセンス

MIT License
