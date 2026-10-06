import React, { useState, useRef } from 'react';
import type { LLMModel, BenchmarkResult } from './types/benchmark';
import { SUPPORTED_MODELS, BENCHMARK_PRESETS, INITIAL_HISTORY } from './data/modelsAndPresets';
import { BenchHeader } from './components/BenchHeader';
import { PromptRunner } from './components/PromptRunner';
import { LatencyMetricsCard } from './components/LatencyMetricsCard';
import { ModelCompareBar } from './components/ModelCompareBar';
import { OutputConsole } from './components/OutputConsole';
import { HistoryTable } from './components/HistoryTable';

export const App: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<LLMModel>(SUPPORTED_MODELS[0]);
  const [userPrompt, setUserPrompt] = useState<string>(BENCHMARK_PRESETS[0].userPrompt);
  const [systemPrompt, setSystemPrompt] = useState<string>(BENCHMARK_PRESETS[0].systemPrompt);
  const [output, setOutput] = useState<string>(
    BENCHMARK_PRESETS[0].sampleOutputs['claude-3-5-sonnet'] || ''
  );
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [elapsedMs, setElapsedMs] = useState<number>(0);
  const [latestResult, setLatestResult] = useState<BenchmarkResult | null>(INITIAL_HISTORY[1]);
  const [history, setHistory] = useState<BenchmarkResult[]>(INITIAL_HISTORY);
  const [showComparison, setShowComparison] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<any>(null);

  const approxPromptTokens = Math.max(1, Math.round((userPrompt.length + systemPrompt.length) / 3.2));
  const estCompletionTokens = Math.max(20, Math.round(approxPromptTokens * 0.8));

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Run benchmark simulation with streaming effect
  const handleRunBenchmark = () => {
    if (isRunning) return;
    setIsRunning(true);
    setElapsedMs(0);
    setOutput('');

    startTimeRef.current = performance.now();

    // High frequency timer for millisecond display
    timerRef.current = setInterval(() => {
      setElapsedMs(Math.round(performance.now() - startTimeRef.current));
    }, 25);

    // Pick target text
    const matchedPreset = BENCHMARK_PRESETS.find((p) => p.userPrompt === userPrompt);
    const targetText =
      (matchedPreset && matchedPreset.sampleOutputs[selectedModel.id]) ||
      (matchedPreset && Object.values(matchedPreset.sampleOutputs)[0]) ||
      `// [${selectedModel.name} による生成結果]\n// プロンプト処理が完了しました。\n\n{\n  "status": "success",\n  "model": "${selectedModel.id}",\n  "promptLength": ${userPrompt.length},\n  "tokensEstimated": ${approxPromptTokens}\n}`;

    // Target duration based on model speed
    const simulatedCompletionTokens = Math.max(40, Math.round(targetText.length / 3.0));
    const genTimeMs = Math.round((simulatedCompletionTokens / selectedModel.avgThroughput) * 1000);

    // Simulate streaming after TTFT
    setTimeout(() => {
      let charIndex = 0;
      const chunkSize = Math.max(2, Math.round(targetText.length / 15));
      const streamInterval = setInterval(() => {
        charIndex += chunkSize;
        if (charIndex >= targetText.length) {
          clearInterval(streamInterval);
          setOutput(targetText);

          // Finish run
          clearInterval(timerRef.current);
          const finalDuration = Math.round(performance.now() - startTimeRef.current);
          setElapsedMs(finalDuration);
          setIsRunning(false);

          const cost =
            (approxPromptTokens * selectedModel.inputPricePerM) / 1_000_000 +
            (simulatedCompletionTokens * selectedModel.outputPricePerM) / 1_000_000;

          const now = new Date();
          const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

          const newResult: BenchmarkResult = {
            id: `res-${Date.now()}`,
            timestamp: timeStr,
            modelId: selectedModel.id,
            modelName: selectedModel.name,
            promptTitle: matchedPreset ? matchedPreset.title : userPrompt.slice(0, 30) + '...',
            userPrompt,
            output: targetText,
            totalLatencyMs: finalDuration,
            ttftMs: selectedModel.avgTtftMs,
            generationTimeMs: finalDuration - selectedModel.avgTtftMs,
            throughputTokensPerSec: Math.round((simulatedCompletionTokens / ((finalDuration - selectedModel.avgTtftMs) / 1000)) * 10) / 10,
            promptTokens: approxPromptTokens,
            completionTokens: simulatedCompletionTokens,
            totalTokens: approxPromptTokens + simulatedCompletionTokens,
            costUsd: cost
          };

          setLatestResult(newResult);
          setHistory((prev) => [newResult, ...prev]);
          showToast(`計測完了: ${finalDuration}ms / ${newResult.throughputTokensPerSec} tok/s`);
        } else {
          setOutput(targetText.slice(0, charIndex));
        }
      }, Math.max(30, Math.round(genTimeMs / 15)));
    }, selectedModel.avgTtftMs);
  };

  const handleExportCsv = () => {
    if (history.length === 0) {
      showToast('出力する履歴がありません');
      return;
    }
    const headers = 'ID,時刻,モデル名,プロンプト,総処理時間(ms),TTFT(ms),生成速度(tok/s),入力トークン,出力トークン,総トークン,コスト(USD)\n';
    const rows = history
      .map(
        (h) =>
          `"${h.id}","${h.timestamp}","${h.modelName}","${h.promptTitle.replace(/"/g, '""')}",${h.totalLatencyMs},${h.ttftMs},${h.throughputTokensPerSec},${h.promptTokens},${h.completionTokens},${h.totalTokens},${h.costUsd}`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `llm_benchmark_history_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('CSVファイルをダウンロードしました');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Toast Alert */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: 'rgba(16, 185, 129, 0.95)',
          backdropFilter: 'blur(10px)',
          color: '#ffffff',
          padding: '10px 18px',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.875rem',
          fontWeight: 600,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
          zIndex: 300
        }}>
          ✨ {toastMessage}
        </div>
      )}

      {/* Header */}
      <BenchHeader
        onExportCsv={handleExportCsv}
        showComparison={showComparison}
        onToggleComparison={() => setShowComparison(!showComparison)}
      />

      {/* Main Container */}
      <main style={{ maxWidth: '1440px', width: '100%', margin: '0 auto', padding: '24px 24px 60px' }}>
        {/* Prompt Input & Model Selector */}
        <PromptRunner
          selectedModel={selectedModel}
          onSelectModel={setSelectedModel}
          userPrompt={userPrompt}
          onChangeUserPrompt={setUserPrompt}
          systemPrompt={systemPrompt}
          onChangeSystemPrompt={setSystemPrompt}
          onRunBenchmark={handleRunBenchmark}
          isRunning={isRunning}
          elapsedMs={elapsedMs}
        />

        {/* 1プロンプトあたりの処理時間指標 (KPI) */}
        <LatencyMetricsCard
          latestResult={latestResult}
          isRunning={isRunning}
          elapsedMs={elapsedMs}
        />

        {/* モデル一括比較バー (Optional toggle) */}
        {showComparison && (
          <ModelCompareBar
            promptTokens={approxPromptTokens}
            estCompletionTokens={estCompletionTokens}
          />
        )}

        {/* 出力レスポンスビューア */}
        <OutputConsole output={output} isRunning={isRunning} />

        {/* 計測履歴ログ */}
        <HistoryTable
          history={history}
          onClearHistory={() => setHistory([])}
          onSelectResult={(item) => {
            setLatestResult(item);
            setOutput(item.output);
          }}
        />
      </main>
    </div>
  );
};

export default App;
