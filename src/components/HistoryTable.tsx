import React from 'react';
import type { BenchmarkResult } from '../types/benchmark';
import { History, Trash2 } from 'lucide-react';

interface HistoryTableProps {
  history: BenchmarkResult[];
  onClearHistory: () => void;
  onSelectResult: (result: BenchmarkResult) => void;
}

export const HistoryTable: React.FC<HistoryTableProps> = ({
  history,
  onClearHistory,
  onSelectResult
}) => {
  return (
    <div className="glass-panel" style={{ padding: '20px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <History size={16} color="var(--accent-purple)" />
          <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>
            計測ログ履歴 ({history.length}件)
          </h3>
        </div>

        {history.length > 0 && (
          <button
            className="btn btn-sm"
            onClick={onClearHistory}
            style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}
          >
            <Trash2 size={12} />
            <span>履歴クリア</span>
          </button>
        )}
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-dim)', textAlign: 'left' }}>
              <th style={{ padding: '8px 10px' }}>時刻</th>
              <th style={{ padding: '8px 10px' }}>モデル</th>
              <th style={{ padding: '8px 10px' }}>プロンプト</th>
              <th style={{ padding: '8px 10px' }}>総処理時間</th>
              <th style={{ padding: '8px 10px' }}>初速 (TTFT)</th>
              <th style={{ padding: '8px 10px' }}>速度 (tok/s)</th>
              <th style={{ padding: '8px 10px' }}>トークン数</th>
              <th style={{ padding: '8px 10px' }}>コスト</th>
            </tr>
          </thead>
          <tbody>
            {history.map((h) => (
              <tr
                key={h.id}
                onClick={() => onSelectResult(h)}
                style={{
                  borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <td style={{ padding: '10px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                  {h.timestamp}
                </td>
                <td style={{ padding: '10px', fontWeight: 600, color: '#fff' }}>
                  {h.modelName}
                </td>
                <td style={{ padding: '10px', color: 'var(--text-muted)', maxWidth: '240px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {h.promptTitle || h.userPrompt}
                </td>
                <td style={{ padding: '10px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                  {(h.totalLatencyMs / 1000).toFixed(2)}s ({h.totalLatencyMs}ms)
                </td>
                <td style={{ padding: '10px', color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)' }}>
                  {h.ttftMs}ms
                </td>
                <td style={{ padding: '10px', color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>
                  {h.throughputTokensPerSec.toFixed(1)}
                </td>
                <td style={{ padding: '10px', color: 'var(--text-main)' }}>
                  {h.totalTokens} (In:{h.promptTokens} / Out:{h.completionTokens})
                </td>
                <td style={{ padding: '10px', color: '#818cf8', fontFamily: 'var(--font-mono)' }}>
                  ${h.costUsd.toFixed(5)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
