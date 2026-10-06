import React from 'react';
import type { TraceSession } from '../types/trace';
import { Eye, Play, Pause, RotateCcw, Upload, Download, Sparkles } from 'lucide-react';

interface HeaderProps {
  sessions: TraceSession[];
  activeSession: TraceSession;
  onSelectSession: (session: TraceSession) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onResetReplay: () => void;
  onOpenImportModal: () => void;
  onExportMarkdown: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  sessions,
  activeSession,
  onSelectSession,
  isPlaying,
  onTogglePlay,
  onResetReplay,
  onOpenImportModal,
  onExportMarkdown,
}) => {
  return (
    <header style={{
      borderBottom: '1px solid var(--border-light)',
      background: 'rgba(10, 13, 20, 0.85)',
      backdropFilter: 'blur(20px)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '12px 24px',
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
          background: 'linear-gradient(135deg, #6366f1, #a855f7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 16px rgba(99, 102, 241, 0.5)'
        }}>
          <Eye size={22} color="#ffffff" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '1.15rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#fff' }}>
              Agent Trace Lens
            </h1>
            <span style={{
              fontSize: '0.65rem',
              fontWeight: 700,
              padding: '2px 6px',
              borderRadius: '4px',
              background: 'rgba(99, 102, 241, 0.2)',
              color: '#818cf8',
              border: '1px solid rgba(99, 102, 241, 0.3)'
            }}>
              v1.0 TS
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            AI Agent Observability & ReAct Trace Visualizer
          </p>
        </div>
      </div>

      {/* Preset Selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Sparkles size={14} color="#a855f7" /> プリセット:
        </span>
        <select
          value={activeSession.id}
          onChange={(e) => {
            const found = sessions.find((s) => s.id === e.target.value);
            if (found) onSelectSession(found);
          }}
          style={{
            background: 'var(--bg-secondary)',
            color: 'var(--text-main)',
            border: '1px solid var(--border-light)',
            padding: '7px 12px',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.825rem',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          {sessions.map((s) => (
            <option key={s.id} value={s.id}>
              [{s.category}] {s.name}
            </option>
          ))}
        </select>
      </div>

      {/* Actions & Replay Player */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          className="btn btn-sm"
          onClick={onTogglePlay}
          title={isPlaying ? 'トレース再生を一時停止' : 'ステップ順に自動再生'}
          style={{ borderColor: isPlaying ? 'var(--accent-amber)' : 'var(--border-light)' }}
        >
          {isPlaying ? <Pause size={14} color="var(--accent-amber)" /> : <Play size={14} color="var(--accent-emerald)" />}
          <span>{isPlaying ? '一時停止' : 'リプレイ再生'}</span>
        </button>

        <button
          className="btn btn-sm"
          onClick={onResetReplay}
          title="最初のステップに戻す"
        >
          <RotateCcw size={14} />
        </button>

        <div style={{ width: '1px', height: '24px', background: 'var(--border-light)', margin: '0 4px' }} />

        <button
          className="btn btn-sm"
          onClick={onOpenImportModal}
          title="自作のTrace JSONを取り込む"
        >
          <Upload size={14} />
          <span>JSONインポート</span>
        </button>

        <button
          className="btn btn-sm"
          onClick={onExportMarkdown}
          title="Markdown形式のレポートを出力"
        >
          <Download size={14} />
          <span>レポート出力</span>
        </button>
      </div>
    </header>
  );
};
