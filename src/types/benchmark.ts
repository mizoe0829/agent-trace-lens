export interface LLMModel {
  id: string;
  name: string;
  provider: 'Anthropic' | 'OpenAI' | 'Google' | 'Meta';
  inputPricePerM: number; // USD per 1M tokens
  outputPricePerM: number; // USD per 1M tokens
  avgTtftMs: number;
  avgThroughput: number; // tokens/sec
  color: string;
}

export interface BenchmarkPreset {
  id: string;
  title: string;
  description: string;
  category: '要約' | 'コード生成' | 'JSON構造化' | '一般的なQ&A';
  systemPrompt: string;
  userPrompt: string;
  sampleOutputs: Record<string, string>;
}

export interface BenchmarkResult {
  id: string;
  timestamp: string;
  modelId: string;
  modelName: string;
  promptTitle: string;
  userPrompt: string;
  output: string;
  totalLatencyMs: number;
  ttftMs: number; // Time to First Token
  generationTimeMs: number;
  throughputTokensPerSec: number;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  costUsd: number;
}
