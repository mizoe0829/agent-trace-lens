export type StepType = 'thought' | 'tool_call' | 'retrieval' | 'llm_call' | 'evaluation' | 'fallback';

export type StepStatus = 'success' | 'running' | 'error' | 'warning' | 'fallback';

export interface ToolCallData {
  toolName: string;
  arguments: Record<string, any>;
  result: Record<string, any> | string;
  durationMs: number;
  status: 'success' | 'error';
}

export interface TraceStep {
  id: string;
  stepNumber: number;
  title: string;
  type: StepType;
  status: StepStatus;
  timestamp: string;
  durationMs: number;
  promptTokens: number;
  completionTokens: number;
  thought?: string;
  toolCall?: ToolCallData;
  error?: string;
  notes?: string;
}

export interface TraceSession {
  id: string;
  name: string;
  description: string;
  agentName: string;
  model: string;
  startTime: string;
  totalDurationMs: number;
  totalPromptTokens: number;
  totalCompletionTokens: number;
  estimatedCostUsd: number;
  category: '労務・法務AI' | 'GitHub・CI/CD' | 'マルチエージェント';
  status: 'completed' | 'in_progress' | 'failed';
  steps: TraceStep[];
}
