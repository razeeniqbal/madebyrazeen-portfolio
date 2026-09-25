'use client';

/** Opens the browser print dialog; the print stylesheet turns /resume into a clean one-column CV. */
export function PrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className="label border-b border-current pb-1 hover:text-signal">
      Print / Save as PDF ⎙
    </button>
  );
}
