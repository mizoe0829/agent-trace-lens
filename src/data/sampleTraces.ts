import type { TraceSession } from '../types/trace';

export const SAMPLE_TRACES: TraceSession[] = [
  {
    id: 'trace-labor-agent-001',
    name: '労務相談AI: 36協定特別条項の適用上限判定',
    description: '社員の月間時間外労働が80時間を超過する見込みとなった際の、法適合性チェックおよび特別条項発動要件の自動照会プロセス',
    agentName: 'LaborComplianceAgent v2.4',
    model: 'claude-3-5-sonnet',
    startTime: '2026-10-06 09:14:22',
    totalDurationMs: 2840,
    totalPromptTokens: 3120,
    totalCompletionTokens: 890,
    estimatedCostUsd: 0.0227,
    category: '労務・法務AI',
    status: 'completed',
    steps: [
      {
        id: 'step-1',
        stepNumber: 1,
        title: '相談内容のインテント解析と法務エンティティ抽出',
        type: 'thought',
        status: 'success',
        timestamp: '09:14:22.100',
        durationMs: 320,
        promptTokens: 450,
        completionTokens: 140,
        thought:
          'ユーザーからの問い合わせ: 「営業部A氏の今月の残業が82時間になりそうです。特別条項は適用できますか？手続きはどうすれば良いですか？」\n\n法務論点の整理:\n1. 労基法第36条（特別条項の限度時間: 月100時間未満、年720時間以内、複数月平均80時間以内）の抵触判定が必要。\n2. 当該企業の就業規則・36協定協定届（特別条項付き）の締結内容および「特別の事情」の該当性確認が必要。\n3. 直近6ヶ月の特別条項適用回数（年間6回上限ルール）の確認が必要。',
        notes: 'インテント: 勤怠違反防止・労務規定照会'
      },
      {
        id: 'step-2',
        stepNumber: 2,
        title: '就業規則・36協定届ベクトルDB検索 (RAG)',
        type: 'retrieval',
        status: 'success',
        timestamp: '09:14:22.420',
        durationMs: 460,
        promptTokens: 520,
        completionTokens: 80,
        thought: '社内規程ストアから「特別条項」「限度時間」「手続き」に関する最新の協定内容を抽出する。',
        toolCall: {
          toolName: 'vector_search_labor_agreements',
          arguments: {
            companyId: 'corp-osaka-8821',
            query: '36協定 特別条項 上限時間 特別な事情 手続き',
            topK: 3
          },
          result: {
            agreementType: '特別条項付き36協定（2026年度届出済）',
            monthlyLimit: '通常45時間 / 特別条項適用時: 月85時間まで',
            annualLimit: '年720時間以内',
            maxMonthsPerYear: 6,
            specialConditions: ['決算・棚卸業務', '大規模システム障害対応', '突発的な顧客納品対応'],
            requiredProcess: '労働者代表への事前通知および協議'
          },
          durationMs: 440,
          status: 'success'
        }
      },
      {
        id: 'step-3',
        stepNumber: 3,
        title: '勤怠実績システム連携 (月次累計・特別条項利用履歴取得)',
        type: 'tool_call',
        status: 'success',
        timestamp: '09:14:22.880',
        durationMs: 510,
        promptTokens: 680,
        completionTokens: 110,
        thought: '社員A氏の過去の特別条項適用履歴と、2〜6ヶ月平均の時間外労働実績を取得して複数月平均80時間超過（過労死ライン）に抵触しないかを検証する。',
        toolCall: {
          toolName: 'fetch_employee_attendance_metrics',
          arguments: {
            employeeId: 'EMP-4091',
            targetMonth: '2026-10',
            estimatedHours: 82.0
          },
          result: {
            currentFiscalYearUsedMonths: 2,
            availableMonthsRemaining: 4,
            trailing2MonthAvg: 71.5,
            trailing3MonthAvg: 68.2,
            trailing6MonthAvg: 59.0,
            status: 'compliant_with_margin'
          },
          durationMs: 490,
          status: 'success'
        }
      },
      {
        id: 'step-4',
        stepNumber: 4,
        title: '法的妥当性・特別理由の合致性バリデーション',
        type: 'evaluation',
        status: 'success',
        timestamp: '09:14:23.390',
        durationMs: 630,
        promptTokens: 810,
        completionTokens: 260,
        thought:
          '評価結果:\n1. 時間外労働82時間は、貴社36協定の特別条項上限（月85時間）および法廷上限（月100時間未満）の範囲内。\n2. 過去の適用月数は2回/年（上限6回まで残り4回）。回数上限はクリア。\n3. 2〜6ヶ月平均も80時間未満を維持可能。\n4. ただし、特別条項発動には「協定に定めた事由」への合致と「労働者代表への事前通知」が必須であるため、回答文面にて確実なアクション指示を提示する必要がある。',
        notes: 'コンプライアンスチェック完了 (Pass)'
      },
      {
        id: 'step-5',
        stepNumber: 5,
        title: '安心を届ける労務アドバイザリー回答の構造化生成',
        type: 'llm_call',
        status: 'success',
        timestamp: '09:14:24.020',
        durationMs: 920,
        promptTokens: 660,
        completionTokens: 300,
        thought: '専門用語をわかりやすく解説し、人事担当者がすぐに経営陣や現場上長に展開できるToDo形式で最終回答を出力。',
        toolCall: {
          toolName: 'generate_advisory_response',
          arguments: {
            format: 'structured_markdown',
            riskLevel: 'LOW_CAUTION',
            actionItemsCount: 3
          },
          result: {
            summary: '82時間の時間外労働は、特別条項の手続きを行うことで適法に適用可能です。',
            actionItems: [
              '1. 特別条項発動事由（突発的案件等）の記録・確認',
              '2. 労働者代表への事前通知および健康配慮措置の確認',
              '3. 医師による面接指導対象（月80時間超）の該当前通知'
            ],
            confidence: 0.99
          },
          durationMs: 910,
          status: 'success'
        }
      }
    ]
  },
  {
    id: 'trace-triage-agent-002',
    name: 'GitHub Issue 自動トリアージ & PR起票エージェント',
    description: '新着Issueの内容をAST解析し、Gemini構造化出力でバグ再現コード生成・自動修正プルリクエストを作成するパイプライン',
    agentName: 'TriageOpsAgent v1.9',
    model: 'gemini-1.5-pro',
    startTime: '2026-10-06 08:32:10',
    totalDurationMs: 3410,
    totalPromptTokens: 4280,
    totalCompletionTokens: 1120,
    estimatedCostUsd: 0.0152,
    category: 'GitHub・CI/CD',
    status: 'completed',
    steps: [
      {
        id: 'step-201',
        stepNumber: 1,
        title: '新着Issueのペイロード解析 & 再現度判定',
        type: 'thought',
        status: 'success',
        timestamp: '08:32:10.050',
        durationMs: 290,
        promptTokens: 580,
        completionTokens: 130,
        thought:
          'Issue #42: 「APIレスポンスのnull安全ガードが漏れており、ステータス未設定時にクライアント側でTypeErrorが発生する」\n再現条件がコードスニペット付きで明記されているため、自動修正候補の生成プロセスへ遷移可能と判定。',
        notes: 'Confidence Score: 0.96'
      },
      {
        id: 'step-202',
        stepNumber: 2,
        title: 'リポジトリAST検索 & 影響箇所特定',
        type: 'tool_call',
        status: 'success',
        timestamp: '08:32:10.340',
        durationMs: 820,
        promptTokens: 950,
        completionTokens: 180,
        thought: 'TypeScriptの型定義およびAPIレスポンスハンドラ（src/handlers/status.ts）の該当関数を検索。',
        toolCall: {
          toolName: 'ripgrep_codebase_symbol',
          arguments: {
            symbol: 'normalizeTaskStatus',
            pathPattern: 'src/**/*.ts'
          },
          result: {
            targetFile: 'src/lib/transformers.ts',
            lineRange: 'L42-L68',
            matchedSnippet: 'export function normalizeTaskStatus(status?: string) { return status.toUpperCase(); }',
            issueDiagnosis: 'statusがundefined/nullの場合にオプショナルチェイニングまたはフォールバック値が欠落'
          },
          durationMs: 800,
          status: 'success'
        }
      },
      {
        id: 'step-203',
        stepNumber: 3,
        title: '修正パッチ生成 & Vitest自動テスト実行',
        type: 'tool_call',
        status: 'fallback',
        timestamp: '08:32:11.160',
        durationMs: 1200,
        promptTokens: 1420,
        completionTokens: 480,
        thought: '第1案のパッチでテストを実行したが、レガシー型との互換性エラーが発生。フォールバック設計により代替パッチへ自動自己修復。',
        toolCall: {
          toolName: 'run_isolated_test_runner',
          arguments: {
            testCommand: 'npm run test:unit',
            patchVariant: 'v2_nullish_coalescing'
          },
          result: {
            testsPassed: 18,
            testsFailed: 0,
            coverage: '98.4%',
            diff: '- return status.toUpperCase();\n+ return (status ?? "PENDING").toUpperCase();'
          },
          durationMs: 1180,
          status: 'success'
        },
        notes: '自己修復 (Self-healing fallback) が正常発動'
      },
      {
        id: 'step-204',
        stepNumber: 4,
        title: 'GitHub Pull Request & CHANGELOG 起票',
        type: 'tool_call',
        status: 'success',
        timestamp: '08:32:12.360',
        durationMs: 1100,
        promptTokens: 1330,
        completionTokens: 330,
        thought: 'PRドラフトを自動生成し、Issue #42との関連付けおよびレビュー担当者（@maintainer）を自動アサイン。',
        toolCall: {
          toolName: 'create_github_pull_request',
          arguments: {
            branch: 'fix/issue-42-null-safe-status',
            title: 'fix(core): ensure null-safe fallback in normalizeTaskStatus (#42)',
            labels: ['bug', 'automated-fix', 'ai-agent']
          },
          result: {
            prNumber: 43,
            prUrl: 'https://github.com/org/repo/pull/43',
            ciStatus: 'queued'
          },
          durationMs: 1080,
          status: 'success'
        }
      }
    ]
  },
  {
    id: 'trace-multiagent-003',
    name: 'マルチエージェント監査: 仕様策定 → 実装 → QAレビュー',
    description: 'Planner・Coder・SecurityReviewer の3つの自律エージェントが協調して新機能を実装・監査するワークフロー',
    agentName: 'MultiAgentOrchestrator v3.0',
    model: 'gpt-4o',
    startTime: '2026-10-06 07:15:00',
    totalDurationMs: 4620,
    totalPromptTokens: 5890,
    totalCompletionTokens: 1640,
    estimatedCostUsd: 0.0418,
    category: 'マルチエージェント',
    status: 'completed',
    steps: [
      {
        id: 'step-301',
        stepNumber: 1,
        title: '[PlannerAgent] 要求仕様の分解とタスクグラフ生成',
        type: 'thought',
        status: 'success',
        timestamp: '07:15:00.120',
        durationMs: 840,
        promptTokens: 1200,
        completionTokens: 380,
        thought: 'ユーザー要求「CSVエクスポート時の個人情報マスキング機能の追加」\n\nタスクDAG:\n1. マスキングポリシー定義（氏名・電話番号・メールアドレス・給与情報）\n2. ストリーミングCSV変換処理の実装（メモリ枯渇防止）\n3. 監査ログ（ExportAuditLog）の永続化'
      },
      {
        id: 'step-302',
        stepNumber: 2,
        title: '[CoderAgent] メモリ効率の高いストリーミング変換実装',
        type: 'tool_call',
        status: 'success',
        timestamp: '07:15:00.960',
        durationMs: 1650,
        promptTokens: 2100,
        completionTokens: 620,
        thought: 'Node.js Transform Streamを用いたパイプラインコードを生成。',
        toolCall: {
          toolName: 'generate_code_artifact',
          arguments: {
            module: 'src/services/maskingStream.ts',
            useCryptoMasking: true
          },
          result: {
            linesAdded: 142,
            functions: ['createMaskingPipeline', 'sanitizePIIField'],
            unitTestGenerated: true
          },
          durationMs: 1630,
          status: 'success'
        }
      },
      {
        id: 'step-303',
        stepNumber: 3,
        title: '[SecurityReviewer] OWASP & 個人情報保護法 適合性スキャン',
        type: 'evaluation',
        status: 'success',
        timestamp: '07:15:02.610',
        durationMs: 1120,
        promptTokens: 1540,
        completionTokens: 390,
        thought: '生成コードに対して静的セキュリティ解析および正規表現のReDoS脆弱性を検証。',
        toolCall: {
          toolName: 'security_ast_audit',
          arguments: {
            targetFile: 'src/services/maskingStream.ts',
            checkCwe: ['CWE-1333', 'CWE-209', 'CWE-312']
          },
          result: {
            vulnerabilitiesFound: 0,
            privacyScore: 'A+',
            complianceCertification: 'JIS Q 15001 & GDPR Art. 32'
          },
          durationMs: 1100,
          status: 'success'
        }
      },
      {
        id: 'step-304',
        stepNumber: 4,
        title: '[Orchestrator] 最終パイプライン承認 & デプロイ可能パッケージング',
        type: 'llm_call',
        status: 'success',
        timestamp: '07:15:03.730',
        durationMs: 1010,
        promptTokens: 1050,
        completionTokens: 250,
        thought: '全3エージェントの検証パスを確認。マージ承認とリリースノートのドラフトを確定。',
        notes: 'All 3 agents consensus achieved (100%)'
      }
    ]
  }
];
