'use client';

/** Opens the floating "Ask about me" assistant from anywhere on the page. */
export function AskButton({ question, children }: { question?: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent('ask-razeen:open', { detail: { question } }))}
      className="label group inline-flex items-center gap-3 border-b border-current pb-1 hover:text-signal"
    >
      {children}
      <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
        →
      </span>
    </button>
  );
}
