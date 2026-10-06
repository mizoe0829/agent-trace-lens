import React from 'react';
import { SUPPORTED_MODELS } from '../data/modelsAndPresets';
import { BarChart3 } from 'lucide-react';

interface ModelCompareBarProps {
  promptTokens: number;
  estCompletionTokens: number;
}

export const ModelCompareBar: React.FC<ModelCompareBarProps> = ({
  promptTokens,
  estCompletionTokens
}) => {
  // Calculate simulated latency and cost for all models
  const comparisonData = SUPPORTED_MODELS.map((m) => {
    const genTimeMs = Math.round((estCompletionTokens / m.avgThroughput) * 1000);
    const totalLatencyMs = m.avgTtftMs + genTimeMs;
    const costUsd =
      (promptTokens * m.inputPricePerM) / 1_000_000 +
      (estCompletionTokens * m.outputPricePerM) / 1_000_000;

    return {
      model: m,
      totalLatencyMs,
      throughput: m.avgThroughput,
      costUsd
    };
  });

  const maxLatency = Math.max(...comparisonData.map((d) => d.totalLatencyMs));

  return (
    <div className="glass-panel" style={{ padding: '20px 24px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BarChart3 size={16} color="var(--accent-indigo)" />
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>
            主要LLMモデル別の処理時間＆コスト比較シミュレーション
          </h3>
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
          入力 {promptTokens} tok ＋ 出力想定 {estCompletionTokens} tok の場合
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {comparisonData.map(({ model, totalLatencyMs, throughput, costUsd }) => {
          const latencyPct = Math.round((totalLatencyMs / maxLatency) * 100);

          return (
            <div
              key={model.id}
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 16px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: model.color,
                    boxShadow: `0 0 8px ${model.color}`
                  }} />
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fff' }}>
                    {model.name}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                    ({model.provider})
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.75rem' }}>
                  <span style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                    ⏱ {(totalLatencyMs / 1000).toFixed(2)}s ({totalLatencyMs}ms)
                  </span>
                  <span style={{ color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>
                    ⚡ {throughput} tok/s
                  </span>
                  <span style={{ color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)' }}>
                    💰 ${costUsd.toFixed(5)} (約¥{(costUsd * 152).toFixed(2)})
                  </span>
                </div>
              </div>

              {/* Visual Latency Bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', width: '60px' }}>処理時間</span>
                <div style={{ flex: 1, height: '8px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${latencyPct}%`,
                      height: '100%',
                      background: model.color,
                      transition: 'width 0.4s ease'
                    }}
                  />
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', width: '45px', textAlign: 'right' }}>
                  {totalLatencyMs}ms
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
