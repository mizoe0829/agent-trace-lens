import React from 'react';
import type { TraceStep } from '../types/trace';
import { Brain, Wrench, Database, MessageSquareCode, ShieldCheck, ArrowRight, CheckCircle2, AlertTriangle } from 'lucide-react';

interface TraceGraphProps {
  steps: TraceStep[];
  selectedStepId: string | null;
  onSelectStep: (stepId: string) => void;
  visibleStepsCount: number;
}

export const TraceGraph: React.FC<TraceGraphProps> = ({
  steps,
  selectedStepId,
  onSelectStep,
  visibleStepsCount,
}) => {
  const getStepIcon = (type: TraceStep['type']) => {
    switch (type) {
      case 'thought':
        return <Brain size={14} color="#c084fc" />;
      case 'tool_call':
        return <Wrench size={14} color="#22d3ee" />;
      case 'retrieval':
        return <Database size={14} color="#fbbf24" />;
      case 'llm_call':
        return <MessageSquareCode size={14} color="#818cf8" />;
      case 'evaluation':
        return <ShieldCheck size={14} color="#34d399" />;
      default:
        return <Brain size={14} color="#fff" />;
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '16px 20px', marginBottom: '24px', overflowX: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>エージェント実行パイプライン (DAG フロー)</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 400 }}>
            クリックでステップ詳細をインスペクト
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 'max-content', paddingBottom: '6px' }}>
        {steps.map((step, index) => {
          const isVisible = index < visibleStepsCount;
          const isSelected = selectedStepId === step.id;

          return (
            <React.Fragment key={step.id}>
              {/* Step Node */}
              <div
                onClick={() => isVisible && onSelectStep(step.id)}
                style={{
                  cursor: isVisible ? 'pointer' : 'not-allowed',
                  opacity: isVisible ? 1 : 0.35,
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: isSelected ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                  border: `1px solid ${isSelected ? 'var(--accent-indigo)' : 'var(--border-light)'}`,
                  boxShadow: isSelected ? '0 0 16px rgba(99, 102, 241, 0.3)' : 'none',
                  transition: 'all 0.2s ease',
                  minWidth: '180px',
                  maxWidth: '220px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {getStepIcon(step.type)}
                    <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-dim)' }}>
                      STEP {step.stepNumber}
                    </span>
                  </div>

                  {step.status === 'success' ? (
                    <CheckCircle2 size={13} color="var(--accent-emerald)" />
                  ) : step.status === 'fallback' ? (
                    <span title="Fallback trigger">
                      <AlertTriangle size={13} color="var(--accent-rose)" />
                    </span>
                  ) : (
                    <span className="pulse-dot" />
                  )}
                </div>

                <div style={{
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: isSelected ? '#fff' : 'var(--text-main)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {step.title}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                  <span>{step.durationMs}ms</span>
                  <span className={`badge badge-${step.type}`} style={{ fontSize: '0.65rem', padding: '1px 5px' }}>
                    {step.type}
                  </span>
                </div>
              </div>

              {/* Connecting Arrow */}
              {index < steps.length - 1 && (
                <ArrowRight
                  size={16}
                  color={index < visibleStepsCount - 1 ? 'var(--accent-indigo)' : 'var(--text-dim)'}
                  style={{ opacity: index < visibleStepsCount - 1 ? 0.8 : 0.3 }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
