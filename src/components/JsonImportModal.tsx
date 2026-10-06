import React, { useState } from 'react';
import type { TraceSession } from '../types/trace';
import { X, Upload, FileText, AlertCircle } from 'lucide-react';

interface JsonImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (session: TraceSession) => void;
}

export const JsonImportModal: React.FC<JsonImportModalProps> = ({ isOpen, onClose, onImport }) => {
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleImportSubmit = () => {
    try {
      setError(null);
      const parsed = JSON.parse(jsonText);
      if (!parsed.id || !parsed.name || !Array.isArray(parsed.steps)) {
        throw new Error('必須プロパティ（id, name, steps）が見つかりません');
      }
      onImport(parsed as TraceSession);
      onClose();
      setJsonText('');
    } catch (e: any) {
      setError(e.message || '有効なJSONフォーマットではありません');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 200,
      padding: '16px'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '620px',
        padding: '24px',
        background: 'var(--bg-secondary)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.8)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Upload size={18} color="var(--accent-indigo)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
              Trace JSON インポート
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
          Langfuse / OpenTelemetry / LangChain形式などのエージェント実行ログJSONを貼り付けることで、タイムラインとグラフを描画します。
        </p>

        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(244, 63, 94, 0.12)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '10px 14px',
            color: '#fb7185',
            fontSize: '0.8rem',
            marginBottom: '12px'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <textarea
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          placeholder={`{\n  "id": "custom-trace-001",\n  "name": "Custom Agent Run",\n  "description": "...",\n  "agentName": "MyAgent",\n  "model": "gpt-4o",\n  "steps": [...]\n}`}
          rows={10}
          style={{
            width: '100%',
            background: 'var(--bg-code)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-md)',
            padding: '12px',
            color: '#e5e7eb',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            outline: 'none',
            resize: 'vertical',
            marginBottom: '16px'
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button className="btn" onClick={onClose}>
            キャンセル
          </button>
          <button className="btn btn-primary" onClick={handleImportSubmit}>
            <FileText size={14} />
            インポート実行
          </button>
        </div>
      </div>
    </div>
  );
};
