import React, { useState } from 'react';
import type { LLMModel, BenchmarkPreset } from '../types/benchmark';
import { SUPPORTED_MODELS, BENCHMARK_PRESETS } from '../data/modelsAndPresets';
import { Play, Sparkles, Sliders, RefreshCw } from 'lucide-react';

interface PromptRunnerProps {
  selectedModel: LLMModel;
  onSelectModel: (model: LLMModel) => void;
  userPrompt: string;
  onChangeUserPrompt: (text: string) => void;
  systemPrompt: string;
  onChangeSystemPrompt: (text: string) => void;
  onRunBenchmark: () => void;
  isRunning: boolean;
  elapsedMs: number;
}

export const PromptRunner: React.FC<PromptRunnerProps> = ({
  selectedModel,
  onSelectModel,
  userPrompt,
  onChangeUserPrompt,
  systemPrompt,
  onChangeSystemPrompt,
  onRunBenchmark,
  isRunning,
  elapsedMs
}) => {
  const [showSystemPrompt, setShowSystemPrompt] = useState(false);

  // Approximate token estimation (1 token ~= 3.5 chars for Japanese, 4 chars for English)
  const approxPromptTokens = Math.max(1, Math.round((userPrompt.length + systemPrompt.length) / 3.2));

  const handleApplyPreset = (preset: BenchmarkPreset) => {
    onChangeUserPrompt(preset.userPrompt);
    onChangeSystemPrompt(preset.systemPrompt);
  };

  return (
    <div className="glass-panel" style={{ padding: '20px 24px', marginBottom: '24px' }}>
      {/* Top Bar: Presets & Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={16} color="var(--accent-purple)" />
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            標準ベンチマーク・プリセット:
          </span>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {BENCHMARK_PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => handleApplyPreset(p)}
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  color: 'var(--text-main)',
                  border: '1px solid var(--border-light)',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {p.title}
              </button>
            ))}
          </div>
        </div>

        <button
          className="btn btn-sm"
          onClick={() => setShowSystemPrompt(!showSystemPrompt)}
          style={{ fontSize: '0.75rem' }}
        >
          <Sliders size={13} />
          <span>System Prompt {showSystemPrompt ? '閉じる' : '設定'}</span>
        </button>
      </div>

      {/* Model Selection Tabs */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600, marginBottom: '8px' }}>
          対象LLMモデル選択:
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px' }}>
          {SUPPORTED_MODELS.map((model) => {
            const isSelected = selectedModel.id === model.id;
            return (
              <div
                key={model.id}
                onClick={() => onSelectModel(model)}
                style={{
                  cursor: 'pointer',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-md)',
                  background: isSelected ? 'rgba(99, 102, 241, 0.18)' : 'rgba(255, 255, 255, 0.02)',
                  border: `1px solid ${isSelected ? model.color : 'var(--border-light)'}`,
                  boxShadow: isSelected ? `0 0 12px ${model.color}40` : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: isSelected ? '#fff' : 'var(--text-main)' }}>
                    {model.name}
                  </span>
                  <span style={{ fontSize: '0.65rem', color: model.color, fontWeight: 700 }}>
                    {model.provider}
                  </span>
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                  目安TTFT: ~{model.avgTtftMs}ms | 速度: ~{model.avgThroughput} tok/s
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Optional System Prompt */}
      {showSystemPrompt && (
        <div style={{ marginBottom: '14px' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 600, marginBottom: '4px' }}>
            System Prompt (前提指示):
          </div>
          <textarea
            value={systemPrompt}
            onChange={(e) => onChangeSystemPrompt(e.target.value)}
            rows={2}
            style={{
              width: '100%',
              background: 'var(--bg-code)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-md)',
              padding: '10px',
              color: '#e5e7eb',
              fontSize: '0.825rem',
              fontFamily: 'var(--font-mono)',
              outline: 'none',
              resize: 'vertical'
            }}
          />
        </div>
      )}

      {/* User Prompt Input Area */}
      <div style={{ marginBottom: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600 }}>
            User Prompt (プロンプト本文):
          </span>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
            入力推定: 約 <strong style={{ color: 'var(--accent-indigo)' }}>{approxPromptTokens}</strong> トークン ({userPrompt.length}文字)
          </span>
        </div>
        <textarea
          value={userPrompt}
          onChange={(e) => onChangeUserPrompt(e.target.value)}
          rows={4}
          placeholder="プロンプトを入力または上のプリセットを選択してください..."
          style={{
            width: '100%',
            background: 'var(--bg-code)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-md)',
            padding: '12px',
            color: '#fff',
            fontSize: '0.875rem',
            lineHeight: '1.6',
            outline: 'none',
            resize: 'vertical'
          }}
        />
      </div>

      {/* Execution Action & Timer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
            実行モデル: <strong style={{ color: selectedModel.color }}>{selectedModel.name}</strong>
          </span>
          {isRunning && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: 'var(--accent-emerald)',
              fontSize: '0.8rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 600
            }}>
              <span className="pulse-dot" />
              <span>計測中: {(elapsedMs / 1000).toFixed(3)}s</span>
            </div>
          )}
        </div>

        <button
          className="btn btn-primary"
          onClick={onRunBenchmark}
          disabled={isRunning || !userPrompt.trim()}
          style={{
            padding: '10px 20px',
            fontSize: '0.9rem',
            opacity: isRunning || !userPrompt.trim() ? 0.6 : 1,
            cursor: isRunning || !userPrompt.trim() ? 'not-allowed' : 'pointer'
          }}
        >
          {isRunning ? (
            <>
              <RefreshCw size={16} className="animate-spin" />
              <span>推論計測中...</span>
            </>
          ) : (
            <>
              <Play size={16} />
              <span>ベンチマーク計測を実行</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
