import type { LLMModel } from '../types/benchmark';

/**
 * Approximate token count for Japanese and English mixture.
 * ~3.2 characters per token.
 */
export function estimateTokens(text: string): number {
  if (!text || text.trim().length === 0) return 0;
  return Math.max(1, Math.round(text.length / 3.2));
}

/**
 * Calculate inference cost in USD based on input/output token pricing per 1M tokens.
 */
export function calculateCostUsd(
  promptTokens: number,
  completionTokens: number,
  inputPricePerM: number,
  outputPricePerM: number
): number {
  const inputCost = (promptTokens * inputPricePerM) / 1_000_000;
  const outputCost = (completionTokens * outputPricePerM) / 1_000_000;
  return Number((inputCost + outputCost).toFixed(7));
}

/**
 * Calculate generation speed (tokens per second) given completion tokens and duration in ms.
 */
export function calculateThroughput(completionTokens: number, durationMs: number): number {
  if (durationMs <= 0 || completionTokens <= 0) return 0;
  const seconds = durationMs / 1000;
  return Math.round((completionTokens / seconds) * 10) / 10;
}

/**
 * Simulate total latency (TTFT + generation time) based on model characteristics.
 */
export function simulateLatency(
  model: LLMModel,
  completionTokens: number
): { totalLatencyMs: number; ttftMs: number; generationTimeMs: number } {
  const genTimeMs = Math.round((completionTokens / model.avgThroughput) * 1000);
  const totalLatencyMs = model.avgTtftMs + genTimeMs;
  return {
    totalLatencyMs,
    ttftMs: model.avgTtftMs,
    generationTimeMs: genTimeMs
  };
}
