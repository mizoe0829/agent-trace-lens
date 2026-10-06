import React, { useState } from 'react';
import { Copy, Check, MessageSquare } from 'lucide-react';

interface OutputConsoleProps {
  output: string;
  isRunning: boolean;
}

export const OutputConsole: React.FC<OutputConsoleProps> = ({ output, isRunning }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-panel" style={{ padding: '20px 24px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MessageSquare size={16} color="var(--accent-indigo)" />
          <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>
            モデル生成レスポンス (Output)
          </h3>
          {isRunning && (
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span className="pulse-dot" /> 生成ストリーミング中...
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
            {output.length} 文字
          </span>
          <button
            className="btn btn-sm"
            onClick={handleCopy}
            disabled={!output}
            style={{ padding: '3px 8px', fontSize: '0.75rem' }}
          >
            {copied ? <Check size={12} color="var(--accent-emerald)" /> : <Copy size={12} />}
            <span>{copied ? 'コピー完了' : '出力コピー'}</span>
          </button>
        </div>
      </div>

      <pre className="code-block" style={{ minHeight: '140px', maxHeight: '420px', whiteSpace: 'pre-wrap' }}>
        {output || (
          <span style={{ color: 'var(--text-dim)', fontStyle: 'italic' }}>
            {isRunning ? '生成中...' : '（プロンプトを実行するとここに生成結果が表示されます）'}
          </span>
        )}
      </pre>
    </div>
  );
};
