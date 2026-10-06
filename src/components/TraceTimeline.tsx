import React, { useState } from 'react';
import type { TraceStep, StepType } from '../types/trace';
import { Brain, Wrench, Database, MessageSquareCode, ShieldCheck, ChevronRight, Clock, Cpu, Filter } from 'lucide-react';

interface TraceTimelineProps {
  steps: TraceStep[];
  selectedStepId: string | null;
  onSelectStep: (stepId: string) => void;
  visibleStepsCount: number;
}

export const TraceTimeline: React.FC<TraceTimelineProps> = ({
  steps,
  selectedStepId,
  onSelectStep,
  visibleStepsCount,
}) => {
  const [filterType, setFilterType] = useState<string>('all');

  const visibleSteps = steps.slice(0, visibleStepsCount);
  const filteredSteps = filterType === 'all'
    ? visibleSteps
    : visibleSteps.filter((s) => s.type === filterType);

  const getStepIcon = (type: StepType) => {
    switch (type) {
      case 'thought':
        return <Brain size={16} color="#c084fc" />;
      case 'tool_call':
        return <Wrench size={16} color="#22d3ee" />;
      case 'retrieval':
        return <Database size={16} color="#fbbf24" />;
      case 'llm_call':
        return <MessageSquareCode size={16} color="#818cf8" />;
      case 'evaluation':
        return <ShieldCheck size={16} color="#34d399" />;
      case 'fallback':
        return <ShieldCheck size={16} color="#fb7185" />;
      default:
        return <Brain size={16} color="#fff" />;
    }
  };

  return (
    <div style={{ flex: '1 1 55%', minWidth: '320px' }}>
      {/* Filter Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Filter size={14} color="var(--text-muted)" />
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            実行トレース・タイムライン ({filteredSteps.length}件)
          </span>
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          {[
            { id: 'all', label: 'すべて' },
            { id: 'thought', label: '思考 (Thought)' },
            { id: 'tool_call', label: 'ツール (Tool)' },
            { id: 'retrieval', label: 'RAG照会' },
            { id: 'evaluation', label: '検証' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              style={{
                background: filterType === tab.id ? 'var(--accent-indigo)' : 'var(--bg-subtle)',
                color: filterType === tab.id ? '#fff' : 'var(--text-dim)',
                border: '1px solid',
                borderColor: filterType === tab.id ? 'var(--accent-indigo)' : 'var(--border-light)',
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.75rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Step Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filteredSteps.map((step) => {
          const isSelected = selectedStepId === step.id;

          return (
            <div
              key={step.id}
              onClick={() => onSelectStep(step.id)}
              className="glass-panel"
              style={{
                padding: '14px 18px',
                cursor: 'pointer',
                borderColor: isSelected ? 'var(--accent-indigo)' : 'var(--border-light)',
                background: isSelected ? 'rgba(99, 102, 241, 0.12)' : 'var(--bg-card)',
                boxShadow: isSelected ? '0 0 20px rgba(99, 102, 241, 0.25)' : 'var(--shadow-sm)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Left Accent Stripe when selected */}
              {isSelected && (
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: '4px',
                  background: 'var(--gradient-brand)'
                }} />
              )}

              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1 }}>
                  {/* Step Icon */}
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid var(--border-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {getStepIcon(step.type)}
                  </div>

                  {/* Title & Preview */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)' }}>
                        #{step.stepNumber}
                      </span>
                      <span className={`badge badge-${step.type}`}>
                        {step.type}
                      </span>
                      {step.status === 'fallback' && (
                        <span className="badge badge-fallback">Self-healing</span>
                      )}
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                        {step.timestamp}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff', marginBottom: '6px' }}>
                      {step.title}
                    </h3>

                    {/* Short snippet */}
                    {step.thought && (
                      <p style={{
                        fontSize: '0.8rem',
                        color: 'var(--text-muted)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '90%'
                      }}>
                        💭 {step.thought}
                      </p>
                    )}

                    {step.toolCall && (
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: 'rgba(6, 182, 212, 0.08)',
                        border: '1px solid rgba(6, 182, 212, 0.2)',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        color: 'var(--accent-cyan)',
                        fontFamily: 'var(--font-mono)'
                      }}>
                        ⚙️ {step.toolCall.toolName}()
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Metrics & Arrow */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', flexShrink: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                    <Clock size={12} />
                    <span>{step.durationMs}ms</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                    <Cpu size={12} />
                    <span>{step.promptTokens + step.completionTokens} tok</span>
                  </div>

                  <ChevronRight size={16} color={isSelected ? 'var(--accent-indigo)' : 'var(--text-dim)'} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
