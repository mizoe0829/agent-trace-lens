import React from 'react';
import type { BenchmarkResult } from '../types/benchmark';
import { Clock, Zap, Cpu, Coins, Activity } from 'lucide-react';

interface LatencyMetricsCardProps {
  latestResult: BenchmarkResult | null;
  isRunning: boolean;
  elapsedMs: number;
}

export const LatencyMetricsCard: React.FC<LatencyMetricsCardProps> = ({
  latestResult,
  isRunning,
  elapsedMs
}) => {
  if (!latestResult && !isRunning) {
    return (
      <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-dim)', marginBottom: '24px' }}>
        <Activity size={32} style={{ margin: '0 auto 8px', opacity: 0.4 }} />
        <p style={{ fontSize: '0.85rem' }}>上の「ベンチマーク計測を実行」をクリックすると、1プロンプトあたりの処理指標が表示されます</p>
      </div>
    );
  }

  const latency = isRunning ? elapsedMs : latestResult?.totalLatencyMs || 0;
  const ttft = latestResult?.ttftMs || 0;
  const throughput = latestResult?.throughputTokensPerSec || 0;
  const totalTokens = latestResult?.totalTokens || 0;
  const promptTokens = latestResult?.promptTokens || 0;
  const completionTokens = latestResult?.completionTokens || 0;
  const cost = latestResult?.costUsd || 0;

  return (
    <div style={{ marginBottom: '24px' }}>
      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Activity size={14} color="var(--accent-cyan)" />
        <span>プロンプト処理パフォーマンス指標</span>
        {latestResult && !isRunning && (
          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
            ({latestResult.modelName} / {latestResult.timestamp})
          </span>
        )}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '14px'
      }}>
        {/* Total Latency */}
        <div className="glass-panel" style={{ padding: '16px 20px', borderLeft: '3px solid var(--accent-cyan)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-dim)', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>総処理時間 (Latency)</span>
            <Clock size={16} color="var(--accent-cyan)" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#fff', fontFamily: 'var(--font-mono)' }}>
            {(latency / 1000).toFixed(3)}
            <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)', marginLeft: '4px' }}>s</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '2px' }}>
            {latency.toLocaleString()} ms {isRunning ? '(計測中...)' : ''}
          </div>
        </div>

        {/* TTFT */}
        <div className="glass-panel" style={{ padding: '16px 20px', borderLeft: '3px solid var(--accent-amber)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-dim)', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>初速 (TTFT)</span>
            <Zap size={16} color="var(--accent-amber)" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)' }}>
            {isRunning ? '---' : ttft}
            <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)', marginLeft: '4px' }}>ms</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '2px' }}>
            最初の1トークン到達時間
          </div>
        </div>

        {/* Throughput */}
        <div className="glass-panel" style={{ padding: '16px 20px', borderLeft: '3px solid var(--accent-emerald)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-dim)', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>生成速度 (Throughput)</span>
            <Activity size={16} color="var(--accent-emerald)" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>
            {isRunning ? '---' : throughput.toFixed(1)}
            <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)', marginLeft: '4px' }}>tok/s</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '2px' }}>
            1秒あたりのトークン生成数
          </div>
        </div>

        {/* Token Count */}
        <div className="glass-panel" style={{ padding: '16px 20px', borderLeft: '3px solid var(--accent-purple)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-dim)', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>消費トークン数</span>
            <Cpu size={16} color="var(--accent-purple)" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#fff', fontFamily: 'var(--font-mono)' }}>
            {isRunning ? '---' : totalTokens.toLocaleString()}
            <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)', marginLeft: '4px' }}>tok</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '2px' }}>
            In: {promptTokens} / Out: {completionTokens}
          </div>
        </div>

        {/* Cost */}
        <div className="glass-panel" style={{ padding: '16px 20px', borderLeft: '3px solid var(--accent-indigo)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-dim)', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>推論コスト</span>
            <Coins size={16} color="var(--accent-indigo)" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#818cf8', fontFamily: 'var(--font-mono)' }}>
            {isRunning ? '---' : `$${cost.toFixed(5)}`}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '2px' }}>
            約 ¥{(cost * 152).toFixed(3)} JPY
          </div>
        </div>
      </div>
    </div>
  );
};
