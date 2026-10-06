import React from 'react';
import type { TraceSession } from '../types/trace';
import { Clock, Cpu, Coins, CheckCircle2, Bot } from 'lucide-react';

interface MetricsOverviewProps {
  session: TraceSession;
  visibleStepsCount: number;
}

export const MetricsOverview: React.FC<MetricsOverviewProps> = ({ session, visibleStepsCount }) => {
  const toolSteps = session.steps.filter((s) => s.type === 'tool_call' || s.type === 'retrieval');
  const successToolSteps = toolSteps.filter((s) => s.toolCall?.status === 'success');
  const toolSuccessRate = toolSteps.length > 0 ? Math.round((successToolSteps.length / toolSteps.length) * 100) : 100;

  const totalTokens = session.totalPromptTokens + session.totalCompletionTokens;
  const promptTokenPct = totalTokens > 0 ? Math.round((session.totalPromptTokens / totalTokens) * 100) : 0;

  return (
    <div style={{ marginBottom: '24px' }}>
      {/* Session Title & Metadata Card */}
      <div className="glass-panel" style={{ padding: '18px 24px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '10px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                {session.category}
              </span>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>
                {session.name}
              </h2>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              {session.description}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-light)',
              fontSize: '0.8rem',
              color: 'var(--text-main)'
            }}>
              <Bot size={15} color="#a855f7" />
              <span>{session.agentName}</span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-light)',
              fontSize: '0.8rem',
              color: 'var(--accent-cyan)',
              fontFamily: 'var(--font-mono)'
            }}>
              <Cpu size={15} />
              <span>{session.model}</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '16px'
      }}>
        {/* Total Latency */}
        <div className="glass-panel" style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-dim)', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>合計実行時間</span>
            <Clock size={16} color="var(--accent-cyan)" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff' }}>
            {(session.totalDurationMs / 1000).toFixed(2)}
            <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-muted)', marginLeft: '4px' }}>秒</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            {session.totalDurationMs.toLocaleString()} ms (P95 正常推移)
          </div>
        </div>

        {/* Tokens Usage */}
        <div className="glass-panel" style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-dim)', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>総トークン消費</span>
            <Cpu size={16} color="var(--accent-purple)" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff' }}>
            {totalTokens.toLocaleString()}
            <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)', marginLeft: '4px' }}>tok</span>
          </div>
          {/* Token Ratio Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
            <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden', display: 'flex' }}>
              <div style={{ width: `${promptTokenPct}%`, background: 'var(--accent-indigo)' }} title={`Prompt: ${session.totalPromptTokens}`} />
              <div style={{ width: `${100 - promptTokenPct}%`, background: 'var(--accent-purple)' }} title={`Completion: ${session.totalCompletionTokens}`} />
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
              In:{promptTokenPct}% / Out:{100 - promptTokenPct}%
            </span>
          </div>
        </div>

        {/* Estimated Cost */}
        <div className="glass-panel" style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-dim)', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>推定APIコスト</span>
            <Coins size={16} color="var(--accent-amber)" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-amber)' }}>
            ${session.estimatedCostUsd.toFixed(4)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            約 ¥{(session.estimatedCostUsd * 152).toFixed(2)} JPY
          </div>
        </div>

        {/* Steps & Tool Success */}
        <div className="glass-panel" style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-dim)', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>ステップ進捗 / ツール成功率</span>
            <CheckCircle2 size={16} color="var(--accent-emerald)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff' }}>
              {visibleStepsCount}
              <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-muted)' }}>/{session.steps.length}</span>
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-emerald)' }}>
              {toolSuccessRate}% OK
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            ツール呼出 {toolSteps.length} 回中 {successToolSteps.length} 回成功
          </div>
        </div>
      </div>
    </div>
  );
};
