import type { LLMModel, BenchmarkPreset, BenchmarkResult } from '../types/benchmark';

export const SUPPORTED_MODELS: LLMModel[] = [
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    inputPricePerM: 3.0,
    outputPricePerM: 15.0,
    avgTtftMs: 340,
    avgThroughput: 68,
    color: '#a855f7'
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    inputPricePerM: 2.5,
    outputPricePerM: 10.0,
    avgTtftMs: 290,
    avgThroughput: 82,
    color: '#10b981'
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o mini',
    provider: 'OpenAI',
    inputPricePerM: 0.15,
    outputPricePerM: 0.6,
    avgTtftMs: 180,
    avgThroughput: 115,
    color: '#06b6d4'
  },
  {
    id: 'gemini-1-5-flash',
    name: 'Gemini 1.5 Flash',
    provider: 'Google',
    inputPricePerM: 0.075,
    outputPricePerM: 0.3,
    avgTtftMs: 140,
    avgThroughput: 142,
    color: '#3b82f6'
  },
  {
    id: 'gemini-1-5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'Google',
    inputPricePerM: 1.25,
    outputPricePerM: 5.0,
    avgTtftMs: 420,
    avgThroughput: 54,
    color: '#6366f1'
  }
];

export const BENCHMARK_PRESETS: BenchmarkPreset[] = [
  {
    id: 'preset-code-gen',
    title: 'TypeScript アルゴリズム・コード生成',
    description: '型安全なLRUキャッシュクラス（ジェネリクス対応）の実装とユニットテスト',
    category: 'コード生成',
    systemPrompt: 'あなたはシニアTypeScriptエンジニアです。型安全性と実行効率を最優先した洗練されたコードを出力してください。',
    userPrompt: 'TypeScriptでジェネリクス対応のLRU (Least Recently Used) キャッシュクラスを実装してください。get, set, has, size メソッドおよびキャパシティ超過時の退避ロジックを含め、使用例コードも併せて記述してください。',
    sampleOutputs: {
      'claude-3-5-sonnet': `\`\`\`typescript
export class LRUCache<K, V> {
  private readonly capacity: number;
  private readonly cache = new Map<K, V>();

  constructor(capacity: number) {
    if (capacity <= 0) throw new Error("Capacity must be positive");
    this.capacity = capacity;
  }

  get(key: K): V | undefined {
    if (!this.cache.has(key)) return undefined;
    const value = this.cache.get(key)!;
    // 最新のアクセス順に更新
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  set(key: K, value: V): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      // 最古のキーを削除
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey !== undefined) this.cache.delete(oldestKey);
    }
    this.cache.set(key, value);
  }

  has(key: K): boolean {
    return this.cache.has(key);
  }

  get size(): number {
    return this.cache.size;
  }
}
\`\`\``,
      'gpt-4o': `\`\`\`typescript
class LRUCache<K, V> {
  private capacity: number;
  private map: Map<K, V> = new Map();

  constructor(capacity: number) {
    this.capacity = capacity;
  }

  get(key: K): V | undefined {
    if (!this.map.has(key)) return undefined;
    const val = this.map.get(key)!;
    this.map.delete(key);
    this.map.set(key, val);
    return val;
  }

  set(key: K, value: V): void {
    if (this.map.has(key)) this.map.delete(key);
    else if (this.map.size >= this.capacity) {
      const firstKey = this.map.keys().next().value;
      if (firstKey !== undefined) this.map.delete(firstKey);
    }
    this.map.set(key, value);
  }
}
\`\`\``
    }
  },
  {
    id: 'preset-summary',
    title: '長文技術ドキュメント要約',
    description: '約1,500トークンのシステム障害ポストモーテムを箇条書き3点に要約',
    category: '要約',
    systemPrompt: 'あなたはテクニカルライターです。長文レポートをエンジニアおよび経営陣向けに簡潔に要約してください。',
    userPrompt: '以下のデータベース接続プール枯渇インシデントのポストモーテムを読み、①根本原因、②影響範囲、③再発防止策 の3項目に絞って要約してください。\n\n[インシデント詳細]\n2026年10月5日 14:15〜14:48の間、コネクションプールの上限設定（Max 50）に対して、リトライ嵐（Exponential Backoffのジッター欠落）が発生しDB CPUが100%に張り付き、全APIリクエストの約12%がHTTP 504 Gateway Timeoutとなりました。直ちにオートスケーリング上限を緩和し、リトライジッターを導入したパッチをデプロイして復旧しました。',
    sampleOutputs: {
      'claude-3-5-sonnet': `### インシデント要約

1. **根本原因**: リトライ処理におけるジッター（Jitter）欠落による「リトライ嵐」が発生し、コネクションプール枯渇とDB CPU 100%飽和を引き起こした。
2. **影響範囲**: 33分間（14:15〜14:48）にわたり、全APIリクエストの約12%でHTTP 504タイムアウトが発生。
3. **再発防止策**: Exponential Backoffへのランダムジッター導入パッチの適用、および接続プールとオートスケーリング上限の動的調整見直し。`
    }
  },
  {
    id: 'preset-json-extract',
    title: 'JSON構造化データ抽出',
    description: '自由記述の問い合わせ文から顧客ID、要件、緊急度、カテゴリを厳格なJSONで抽出',
    category: 'JSON構造化',
    systemPrompt: 'あなたはJSON抽出APIです。説明文は出力せず、指定されたJSONスキーマのみを厳格に出力してください。',
    userPrompt: '「ID: CUST-9021の株式会社メトリクスです。昨晩からダッシュボードのCSV出力が500エラーで止まっており、本日の月次報告に間に合いません。至急調査をお願いします」\n\n以下のキーを持つJSONを出力してください: customerId, issueCategory, severity (HIGH/MEDIUM/LOW), deadline, summary',
    sampleOutputs: {
      'claude-3-5-sonnet': `{\n  "customerId": "CUST-9021",\n  "issueCategory": "EXPORT_ERROR",\n  "severity": "HIGH",\n  "deadline": "TODAY_MONTHLY_REPORT",\n  "summary": "ダッシュボードのCSV出力時に500エラーが発生し、本日の月次報告に影響が出ているため至急調査を要求"\n}`
    }
  },
  {
    id: 'preset-qa',
    title: 'アーキテクチャ比較Q&A',
    description: 'REST APIとGraphQLの使い分け基準をメリット・デメリット付きで回答',
    category: '一般的なQ&A',
    systemPrompt: 'あなたはシステムアーキテクトです。中立かつ実用的な視点で技術選定の判断軸を解説してください。',
    userPrompt: '新規SaaSプロダクトを開発する際、REST APIとGraphQLのどちらを採用すべきかの判断基準を、オーバーフェッチ防止・キャッシュ性・学習コストの観点から簡潔に教えてください。',
    sampleOutputs: {
      'claude-3-5-sonnet': `### REST vs GraphQL 選定基準

- **REST API が適しているケース**:
  - シンプルなCRUDが主体、CDN/HTTPキャッシュを活用したい場合。
  - エコシステムやOpenAPI等の標準ツールを素早く導入し、開発速度を最優先したい時。

- **GraphQL が適しているケース**:
  - 画面ごとに必要データが多岐にわたり、オーバーフェッチ/アンダーフェッチが致命的な場合。
  - モバイルアプリや複数クライアントで1回のリクエストで必要データを過不足なく集約したい時。`
    }
  }
];

export const INITIAL_HISTORY: BenchmarkResult[] = [
  {
    id: 'res-001',
    timestamp: '15:20:12',
    modelId: 'gemini-1-5-flash',
    modelName: 'Gemini 1.5 Flash',
    promptTitle: 'JSON構造化データ抽出',
    userPrompt: '「ID: CUST-9021の株式会社メトリクスです...」',
    output: '{\n  "customerId": "CUST-9021",\n  "severity": "HIGH"\n}',
    totalLatencyMs: 380,
    ttftMs: 140,
    generationTimeMs: 240,
    throughputTokensPerSec: 148,
    promptTokens: 180,
    completionTokens: 52,
    totalTokens: 232,
    costUsd: 0.00003
  },
  {
    id: 'res-002',
    timestamp: '15:22:45',
    modelId: 'claude-3-5-sonnet',
    modelName: 'Claude 3.5 Sonnet',
    promptTitle: 'TypeScript アルゴリズム・コード生成',
    userPrompt: 'TypeScriptでジェネリクス対応のLRUキャッシュクラスを実装してください...',
    output: 'export class LRUCache<K, V> { ... }',
    totalLatencyMs: 1840,
    ttftMs: 320,
    generationTimeMs: 1520,
    throughputTokensPerSec: 72,
    promptTokens: 240,
    completionTokens: 380,
    totalTokens: 620,
    costUsd: 0.00642
  },
  {
    id: 'res-003',
    timestamp: '15:24:02',
    modelId: 'gpt-4o',
    modelName: 'GPT-4o',
    promptTitle: '長文技術ドキュメント要約',
    userPrompt: '以下のデータベース接続プール枯渇インシデントのポストモーテムを読み...',
    output: '### インシデント要約\n1. 根本原因: リトライ嵐...',
    totalLatencyMs: 980,
    ttftMs: 260,
    generationTimeMs: 720,
    throughputTokensPerSec: 86,
    promptTokens: 420,
    completionTokens: 160,
    totalTokens: 580,
    costUsd: 0.00265
  }
];
