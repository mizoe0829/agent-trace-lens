import { describe, it, expect } from 'vitest';
import {
  estimateTokens,
  calculateCostUsd,
  calculateThroughput,
  simulateLatency
} from '../src/lib/benchmarkCalculator';
import { SUPPORTED_MODELS } from '../src/data/modelsAndPresets';

describe('Benchmark Calculator Unit Tests', () => {
  describe('estimateTokens', () => {
    it('空文字列の場合は0トークンを返すこと', () => {
      expect(estimateTokens('')).toBe(0);
      expect(estimateTokens('   ')).toBe(0);
    });

    it('文字数に応じたトークン概算が正しく計算されること', () => {
      const text = 'TypeScriptの型安全性と非同期処理';
      const estimated = estimateTokens(text);
      expect(estimated).toBeGreaterThan(0);
      expect(estimated).toBe(Math.round(text.length / 3.2));
    });
  });

  describe('calculateCostUsd', () => {
    it('Claude 3.5 Sonnetの価格レートで正確にUSDコストが計算されること', () => {
      // Input: $3.0/M, Output: $15.0/M
      const promptTokens = 1000;
      const completionTokens = 500;
      const cost = calculateCostUsd(promptTokens, completionTokens, 3.0, 15.0);

      // (1000 * 3.0 / 1000000) + (500 * 15.0 / 1000000) = 0.003 + 0.0075 = 0.0105
      expect(cost).toBeCloseTo(0.0105, 5);
    });

    it('GPT-4o miniの低価格レートで計算されること', () => {
      // Input: $0.15/M, Output: $0.6/M
      const cost = calculateCostUsd(2000, 1000, 0.15, 0.6);
      expect(cost).toBeCloseTo(0.0009, 5);
    });
  });

  describe('calculateThroughput', () => {
    it('1秒あたり50トークン生成された場合、スループットが50.0 tok/sと計算されること', () => {
      const tokens = 100;
      const durationMs = 2000; // 2 seconds
      expect(calculateThroughput(tokens, durationMs)).toBe(50.0);
    });

    it('経過時間が0の場合は0を返すこと (ゼロ除算防止)', () => {
      expect(calculateThroughput(100, 0)).toBe(0);
    });
  });

  describe('simulateLatency', () => {
    it('モデルのTTFTとスループットに基づき総レイテンシが正しくシミュレートされること', () => {
      const geminiFlash = SUPPORTED_MODELS.find((m) => m.id === 'gemini-1-5-flash')!;
      expect(geminiFlash).toBeDefined();

      const completionTokens = 142; // avgThroughput is 142 tok/s -> genTime should be ~1000ms
      const result = simulateLatency(geminiFlash, completionTokens);

      expect(result.ttftMs).toBe(geminiFlash.avgTtftMs);
      expect(result.generationTimeMs).toBe(1000);
      expect(result.totalLatencyMs).toBe(geminiFlash.avgTtftMs + 1000);
    });
  });
});
