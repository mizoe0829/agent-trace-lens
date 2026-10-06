import React, { useState } from 'react';
import type { TraceStep } from '../types/trace';
import { Brain, Wrench, Copy, Check, Terminal, CheckCircle2 } from 'lucide-react';

interface StepInspectorProps {
  step: TraceStep | null;
}

export const StepInspector: React.FC<StepInspectorProps> = ({ step }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'raw_json'>('details');

  if (!step) {
    return (
      <div style={{ flex: '1 1 45%', minWidth: '320px' }} className="glass-panel">
        <div style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--text-dim)' }}>
          <Terminal size={36} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
          <p style={{ fontSize: '0.9rem' }}>タイムラインまたはグラフからステップを選択してください</p>
        </div>
      </div>
    );
  }

  const handleCopy = (key: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div style={{ flex: '1 1 45%', minWidth: '320px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="glass-panel" style={{ padding: '20px 24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className={`badge badge-${step.type}`}>
                STEP {step.stepNumber} : {step.type}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                {step.durationMs}ms
              </span>
            </div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
              {step.title}
            </h2>
          </div>

          {/* View Mode Tabs */}
          <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-secondary)', padding: '3px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
            <button
              onClick={() => setActiveTab('details')}
              style={{
                background: activeTab === 'details' ? 'var(--accent-indigo)' : 'transparent',
                color: activeTab === 'details' ? '#fff' : 'var(--text-dim)',
                border: 'none',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '0.72rem',
                cursor: 'pointer'
              }}
            >
              詳細ビュー
            </button>
            <button
              onClick={() => setActiveTab('raw_json')}
              style={{
                background: activeTab === 'raw_json' ? 'var(--accent-indigo)' : 'transparent',
                color: activeTab === 'raw_json' ? '#fff' : 'var(--text-dim)',
                border: 'none',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '0.72rem',
                cursor: 'pointer'
              }}
            >
              Raw JSON
            </button>
          </div>
        </div>

        {activeTab === 'raw_json' ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '6px' }}>
              <button
                className="btn btn-sm"
                onClick={() => handleCopy('raw_step', JSON.stringify(step, null, 2))}
              >
                {copiedKey === 'raw_step' ? <Check size={12} color="var(--accent-emerald)" /> : <Copy size={12} />}
                <span>{copiedKey === 'raw_step' ? 'コピー完了' : 'JSONコピー'}</span>
              </button>
            </div>
            <pre className="code-block" style={{ maxHeight: '550px' }}>
              {JSON.stringify(step, null, 2)}
            </pre>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Thought / Reasoning Section */}
            {step.thought && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600, color: '#c084fc', marginBottom: '8px' }}>
                  <Brain size={14} />
                  <span>エージェント思考プロセス (Reasoning & Chain of Thought)</span>
                </div>
                <div style={{
                  background: 'rgba(168, 85, 247, 0.06)',
                  border: '1px solid rgba(168, 85, 247, 0.2)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px',
                  fontSize: '0.85rem',
                  lineHeight: '1.7',
                  color: '#e2e8f0',
                  whiteSpace: 'pre-wrap'
                }}>
                  {step.thought}
                </div>
              </div>
            )}

            {/* Tool Call Section */}
            {step.toolCall && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-cyan)' }}>
                    <Wrench size={14} />
                    <span>ツール呼出: {step.toolCall.toolName}()</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                    実行: {step.toolCall.durationMs}ms
                  </span>
                </div>

                {/* Tool Arguments */}
                <div style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 600 }}>引数 (Arguments):</span>
                    <button
                      className="btn btn-sm"
                      style={{ padding: '2px 6px', fontSize: '0.7rem' }}
                      onClick={() => handleCopy('args', JSON.stringify(step.toolCall?.arguments, null, 2))}
                    >
                      {copiedKey === 'args' ? <Check size={11} color="var(--accent-emerald)" /> : <Copy size={11} />}
                      <span>{copiedKey === 'args' ? 'コピー済' : 'コピー'}</span>
                    </button>
                  </div>
                  <pre className="code-block" style={{ maxHeight: '180px' }}>
                    {JSON.stringify(step.toolCall.arguments, null, 2)}
                  </pre>
                </div>

                {/* Tool Result */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={12} color="var(--accent-emerald)" />
                      返却結果 (Output):
                    </span>
                    <button
                      className="btn btn-sm"
                      style={{ padding: '2px 6px', fontSize: '0.7rem' }}
                      onClick={() => handleCopy('res', JSON.stringify(step.toolCall?.result, null, 2))}
                    >
                      {copiedKey === 'res' ? <Check size={11} color="var(--accent-emerald)" /> : <Copy size={11} />}
                      <span>{copiedKey === 'res' ? 'コピー済' : 'コピー'}</span>
                    </button>
                  </div>
                  <pre className="code-block" style={{ maxHeight: '200px' }}>
                    {typeof step.toolCall.result === 'string'
                      ? step.toolCall.result
                      : JSON.stringify(step.toolCall.result, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {/* Token & Resource Consumption */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-light)'
            }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>プロンプト入力</span>
                <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--accent-indigo)' }}>
                  {step.promptTokens.toLocaleString()} tok
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>生成出力</span>
                <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--accent-purple)' }}>
                  {step.completionTokens.toLocaleString()} tok
                </div>
              </div>
            </div>

            {/* Notes if any */}
            {step.notes && (
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', background: 'rgba(255, 255, 255, 0.02)', padding: '8px 12px', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--accent-emerald)' }}>
                ℹ️ {step.notes}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
