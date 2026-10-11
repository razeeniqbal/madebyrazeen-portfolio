'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * QualityPlus in four steps, played on a tiny illustrative table: deterministic checks score it, the
 * failures become the work, AI suggests fixes (only where it is confident, as the real remediation
 * prompt does), and a person decides. The AI switch shows the principle: with AI off, the quality check
 * still completes; only the suggestions disappear.
 */

type Step = 'check' | 'find' | 'assist' | 'review';
const steps: { id: Step; label: string; zone: 'Deterministic' | 'AI assistance' | 'Human review' }[] = [
  { id: 'check', label: 'Check', zone: 'Deterministic' },
  { id: 'find', label: 'Find', zone: 'Deterministic' },
  { id: 'assist', label: 'Assist', zone: 'AI assistance' },
  { id: 'review', label: 'Review', zone: 'Human review' },
];

const columns = [
  { name: 'Well ID', rule: 'Unique' },
  { name: 'Status', rule: 'Complete' },
  { name: 'Lift type', rule: 'In reference list' },
  { name: 'Depth (m)', rule: 'Range 0 to 6,000' },
];

// Illustrative values only. Failures: a duplicate key, a blank, a value outside the reference list, a negative depth.
const rows = [
  ['W-101', 'ACTIVE', 'ESP', '2,140'],
  ['W-102', 'ACTIVE', 'GL', '1,880'],
  ['W-102', 'SUSPENDED', 'ESP', '2,010'],
  ['W-104', '', 'GL', '1,960'],
  ['W-105', 'ACTIVE', 'ESPP', '-420'],
];

type Failure = { row: number; col: number; reason: string; suggestion?: { value: string; confidence: string }; decision: { ai: string; manual: string } };
const failures: Failure[] = [
  { row: 2, col: 0, reason: 'Duplicate key', decision: { ai: 'Renamed by a person: W-103', manual: 'Renamed by a person: W-103' } },
  { row: 3, col: 1, reason: 'Missing value', decision: { ai: 'Filled by a person: INACTIVE', manual: 'Filled by a person: INACTIVE' } },
  {
    row: 4,
    col: 2,
    reason: 'Not in reference list',
    suggestion: { value: 'ESP', confidence: '0.93' },
    decision: { ai: 'AI suggestion accepted: ESP', manual: 'Corrected by a person: ESP' },
  },
  {
    row: 4,
    col: 3,
    reason: 'Outside range',
    suggestion: { value: '420', confidence: '0.71' },
    decision: { ai: 'AI suggestion modified: 4,200', manual: 'Corrected by a person: 4,200' },
  },
];
const failAt = (r: number, c: number) => failures.find((f) => f.row === r && f.col === c);
const total = rows.length * columns.length;
const passed = total - failures.length;

export function QualityWorkflowDemo({ className }: { className?: string }) {
  const [step, setStep] = useState<Step>('check');
  const [ai, setAi] = useState(true);
  const at = steps.findIndex((s) => s.id === step);
  const seen = (s: Step) => at >= steps.findIndex((x) => x.id === s);

  const caption: Record<Step, string> = {
    check: `Rules run the same way every time. ${passed} of ${total} cells pass: ${Math.round((passed / total) * 100)}%.`,
    find: `The ${failures.length} failed cells are kept, each with the rule it broke. They become the work.`,
    assist: ai
      ? 'AI proposes fixes with a confidence, only where it is confident. Two cells get a suggestion; the rest are left for a person.'
      : 'AI is switched off. Nothing breaks: the failed cells simply wait for a person.',
    review: ai
      ? 'A person accepts, modifies or rejects each suggestion. Every change records whether it came from the AI or a person.'
      : 'A person corrects every cell. The score, the findings and the approval all worked without AI.',
  };

  return (
    <div className={cn('border border-line bg-surface', className)}>
      {/* Controls: the four steps and the AI switch */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-3">
        <div role="tablist" aria-label="Workflow step" className="flex flex-wrap gap-1">
          {steps.map((s, i) => {
            const skipped = s.id === 'assist' && !ai;
            return (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={s.id === step}
                onClick={() => setStep(s.id)}
                className={cn(
                  'label flex items-center gap-2 border px-3 py-2 transition-colors',
                  s.id === step ? 'border-ink bg-ink text-surface' : 'border-line text-muted hover:border-ink hover:text-ink',
                  skipped && s.id !== step && 'line-through opacity-50',
                )}
              >
                <span>{String(i + 1).padStart(2, '0')}</span>
                {s.label}
                {s.id === 'assist' && <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-lime" />}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={ai}
          onClick={() => setAi((v) => !v)}
          className="label flex items-center gap-2 text-muted hover:text-ink"
        >
          AI assistance
          <span className={cn('relative h-5 w-9 rounded-full border transition-colors', ai ? 'border-ink bg-lime' : 'border-line bg-ink/10')}>
            <span className={cn('absolute top-0.5 h-3.5 w-3.5 rounded-full bg-carbon transition-[left]', ai ? 'left-[1.1rem]' : 'left-0.5')} />
          </span>
          <span className="w-6 text-ink">{ai ? 'On' : 'Off'}</span>
        </button>
      </div>

      {/* The table */}
      <div className="overflow-x-auto p-3">
        <table className="w-full min-w-[30rem] border-collapse text-sm">
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c.name} scope="col" className="border-b border-line px-2 pb-2 text-left align-bottom font-semibold">
                  {c.name}
                  <span className={cn('label mt-1 block font-normal transition-colors', seen('check') ? 'text-muted' : 'text-transparent')}>{c.rule}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => (
              <tr key={ri}>
                {r.map((v, ci) => {
                  const f = failAt(ri, ci);
                  const failed = f && seen('find');
                  const suggested = f?.suggestion && ai && seen('assist');
                  const decided = f && step === 'review';
                  return (
                    <td key={ci} className="border-b border-line px-2 py-1.5 align-top">
                      <span
                        className={cn(
                          'inline-flex min-h-[1.5rem] min-w-[3.5rem] items-center gap-1.5 px-1.5 font-mono text-[0.8125rem] transition-colors',
                          failed && !decided && 'outline outline-1 outline-ink',
                          decided && 'bg-ink/10',
                        )}
                      >
                        {decided ? (f!.suggestion && ai ? f!.decision.ai : f!.decision.manual).split(': ')[1] : v || <span className="text-muted">blank</span>}
                        {failed && !decided && <span aria-hidden="true">×</span>}
                        {decided && <span aria-hidden="true">✓</span>}
                      </span>
                      {failed && step === 'find' && <span className="label mt-1 block text-muted">{f!.reason}</span>}
                      {suggested && step === 'assist' && (
                        <span className="label mt-1 flex items-center gap-1.5 text-ink">
                          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-lime" />
                          {f!.suggestion!.value} · {f!.suggestion!.confidence}
                        </span>
                      )}
                      {decided && (
                        <span className="label mt-1 block text-muted">{(f!.suggestion && ai ? f!.decision.ai : f!.decision.manual).split(':')[0]}</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* What is happening, and who is doing it */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-t border-line p-3">
        <p aria-live="polite" className="max-w-prose text-sm">
          <span className="label mr-2 text-muted">{steps[at].zone}</span>
          {caption[step]}
        </p>
        {at < steps.length - 1 ? (
          <button type="button" onClick={() => setStep(steps[at + 1].id)} className="label border-b border-current pb-0.5 hover:text-signal">
            Next: {steps[at + 1].label} →
          </button>
        ) : (
          <button type="button" onClick={() => setStep('check')} className="label border-b border-current pb-0.5 hover:text-signal">
            Start again ↺
          </button>
        )}
      </div>
      <p className="label border-t border-line px-3 py-2 text-muted">Illustrative sample data · not a QualityPlus capture</p>
    </div>
  );
}
