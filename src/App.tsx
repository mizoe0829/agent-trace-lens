import React, { useState, useEffect } from 'react';
import { SAMPLE_TRACES } from './data/sampleTraces';
import type { TraceSession } from './types/trace';
import { Header } from './components/Header';
import { MetricsOverview } from './components/MetricsOverview';
import { TraceGraph } from './components/TraceGraph';
import { TraceTimeline } from './components/TraceTimeline';
import { StepInspector } from './components/StepInspector';
import { JsonImportModal } from './components/JsonImportModal';

export const App: React.FC = () => {
  const [sessions, setSessions] = useState<TraceSession[]>(SAMPLE_TRACES);
  const [activeSession, setActiveSession] = useState<TraceSession>(SAMPLE_TRACES[0]);
  const [selectedStepId, setSelectedStepId] = useState<string | null>(SAMPLE_TRACES[0].steps[0]?.id || null);
  const [visibleStepsCount, setVisibleStepsCount] = useState<number>(SAMPLE_TRACES[0].steps.length);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Switch session handler
  const handleSelectSession = (session: TraceSession) => {
    setActiveSession(session);
    setSelectedStepId(session.steps[0]?.id || null);
    setVisibleStepsCount(session.steps.length);
    setIsPlaying(false);
  };

  // Step Replay Player logic
  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      if (visibleStepsCount >= activeSession.steps.length) {
        setVisibleStepsCount(1);
        setSelectedStepId(activeSession.steps[0]?.id || null);
      } else {
        timer = setInterval(() => {
          setVisibleStepsCount((prev) => {
            const next = prev + 1;
            if (next <= activeSession.steps.length) {
              setSelectedStepId(activeSession.steps[next - 1]?.id || null);
              return next;
            } else {
              setIsPlaying(false);
              return prev;
            }
          });
        }, 1200);
      }
    }
    return () => clearInterval(timer);
  }, [isPlaying, visibleStepsCount, activeSession]);

  const handleTogglePlay = () => {
    if (visibleStepsCount >= activeSession.steps.length) {
      setVisibleStepsCount(1);
      setSelectedStepId(activeSession.steps[0]?.id || null);
    }
    setIsPlaying(!isPlaying);
  };

  const handleResetReplay = () => {
    setIsPlaying(false);
    setVisibleStepsCount(activeSession.steps.length);
    setSelectedStepId(activeSession.steps[0]?.id || null);
  };

  const handleImportSession = (newSession: TraceSession) => {
    setSessions((prev) => [newSession, ...prev]);
    handleSelectSession(newSession);
    showToast('新しいTrace JSONを取り込みました！');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Markdown Export Report
  const handleExportMarkdown = () => {
    const mdLines = [
      `# 🔍 Agent Execution Trace Report: ${activeSession.name}`,
      `> **Agent**: \`${activeSession.agentName}\` | **Model**: \`${activeSession.model}\` | **Category**: ${activeSession.category}`,
      `> **Duration**: ${(activeSession.totalDurationMs / 1000).toFixed(2)}s | **Tokens**: ${(activeSession.totalPromptTokens + activeSession.totalCompletionTokens).toLocaleString()} tok | **Est. Cost**: $${activeSession.estimatedCostUsd.toFixed(4)}`,
      '',
      `## 概要`,
      activeSession.description,
      '',
      `## 実行ステップ一覧 (${activeSession.steps.length} Steps)`,
      ''
    ];

    activeSession.steps.forEach((s) => {
      mdLines.push(`### Step ${s.stepNumber}: [${s.type.toUpperCase()}] ${s.title}`);
      mdLines.push(`- **Status**: ${s.status} | **Duration**: ${s.durationMs}ms | **Tokens**: ${s.promptTokens + s.completionTokens} tok`);
      if (s.thought) {
        mdLines.push(`- **Reasoning**:`);
        mdLines.push('```text');
        mdLines.push(s.thought);
        mdLines.push('```');
      }
      if (s.toolCall) {
        mdLines.push(`- **Tool Call**: \`${s.toolCall.toolName}()\``);
        mdLines.push('```json');
        mdLines.push(JSON.stringify(s.toolCall.arguments, null, 2));
        mdLines.push('```');
      }
      mdLines.push('');
    });

    const fullMd = mdLines.join('\n');
    navigator.clipboard.writeText(fullMd);
    showToast('Markdown形式のレポートをクリップボードにコピーしました！');
  };

  const selectedStep = activeSession.steps.find((s) => s.id === selectedStepId) || null;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: 'rgba(16, 185, 129, 0.9)',
          backdropFilter: 'blur(10px)',
          color: '#ffffff',
          padding: '10px 18px',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.875rem',
          fontWeight: 600,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
          zIndex: 300,
          animation: 'fadeIn 0.2s ease-out'
        }}>
          ✨ {toastMessage}
        </div>
      )}

      {/* Sticky Header */}
      <Header
        sessions={sessions}
        activeSession={activeSession}
        onSelectSession={handleSelectSession}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onResetReplay={handleResetReplay}
        onOpenImportModal={() => setIsImportModalOpen(true)}
        onExportMarkdown={handleExportMarkdown}
      />

      {/* Main Body */}
      <main style={{ maxWidth: '1440px', width: '100%', margin: '0 auto', padding: '24px 24px 48px' }}>
        {/* KPI Metrics */}
        <MetricsOverview session={activeSession} visibleStepsCount={visibleStepsCount} />

        {/* DAG Flow Graph */}
        <TraceGraph
          steps={activeSession.steps}
          selectedStepId={selectedStepId}
          onSelectStep={(id) => setSelectedStepId(id)}
          visibleStepsCount={visibleStepsCount}
        />

        {/* Dual Column: Timeline & Step Inspector */}
        <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <TraceTimeline
            steps={activeSession.steps}
            selectedStepId={selectedStepId}
            onSelectStep={(id) => setSelectedStepId(id)}
            visibleStepsCount={visibleStepsCount}
          />

          <StepInspector step={selectedStep} />
        </div>
      </main>

      {/* JSON Import Modal */}
      <JsonImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImportSession}
      />
    </div>
  );
};

export default App;
