import React from 'react';
import { Gauge, Download, Layers } from 'lucide-react';

interface BenchHeaderProps {
  onExportCsv: () => void;
  showComparison: boolean;
  onToggleComparison: () => void;
}

export const BenchHeader: React.FC<BenchHeaderProps> = ({
  onExportCsv,
  showComparison,
  onToggleComparison
}) => {
  return (
    <header style={{
      borderBottom: '1px solid var(--border-light)',
      background: 'rgba(10, 13, 20, 0.9)',
      backdropFilter: 'blur(20px)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '14px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
      flexWrap: 'wrap'
    }}>
      {/* Brand & Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 16px rgba(99, 102, 241, 0.4)'
        }}>
          <Gauge size={22} color="#ffffff" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '1.2rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#fff' }}>
              LLM Prompt Latency & Cost Profiler
            </h1>
            <span style={{
              fontSize: '0.65rem',
              fontWeight: 700,
              padding: '2px 6px',
              borderRadius: '4px',
              background: 'rgba(6, 182, 212, 0.15)',
              color: '#22d3ee',
              border: '1px solid rgba(6, 182, 212, 0.3)'
            }}>
              TypeScript
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            1プロンプトあたりの処理時間（TTFT・スループット）とトークン・APIコストのリアルタイム計測ツール
          </p>
        </div>
      </div>

      {/* Header Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          className="btn btn-sm"
          onClick={onToggleComparison}
          style={{
            background: showComparison ? 'rgba(99, 102, 241, 0.2)' : 'var(--bg-secondary)',
            borderColor: showComparison ? 'var(--accent-indigo)' : 'var(--border-light)'
          }}
        >
          <Layers size={14} color={showComparison ? 'var(--accent-indigo)' : 'var(--text-dim)'} />
          <span>{showComparison ? 'モデル比較表示中' : 'モデル一括比較'}</span>
        </button>

        <button className="btn btn-sm" onClick={onExportCsv} title="計測履歴をCSVエクスポート">
          <Download size={14} />
          <span>履歴CSV出力</span>
        </button>
      </div>
    </header>
  );
};
