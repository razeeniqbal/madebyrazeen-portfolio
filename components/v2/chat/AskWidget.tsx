'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { assistantCopy } from '@/content/assistant';
import { assets } from '@/lib/assets';
import { cn } from '@/lib/utils';

type Msg = { role: 'user' | 'assistant'; content: string };

const STORE_KEY = 'ask-razeen:v1';

/** Turns relative site links (/work/…) and URLs in plain-text answers into links. */
function Linkified({ text }: { text: string }) {
  const parts = text.split(/(https?:\/\/[^\s)]+|(?<![\w/])\/(?:work|about|resume|contact|lab|running|notes|archive)(?:\/[\w-]+)?(?:#[\w-]+)?)/g);
  return (
    <>
      {parts.map((p, i) =>
        /^https?:\/\//.test(p) ? (
          <a key={i} href={p} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
            {p}
          </a>
        ) : /^\//.test(p) ? (
          <Link key={i} href={p} className="underline underline-offset-2">
            {p}
          </Link>
        ) : (
          <Fragment key={i}>{p}</Fragment>
        ),
      )}
    </>
  );
}

export function AskWidget() {
  const [open, setOpen] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [pending, setPending] = useState(false);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Restore this tab's conversation.
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORE_KEY);
      if (saved) setMessages(JSON.parse(saved));
    } catch {}
  }, []);
  useEffect(() => {
    try {
      sessionStorage.setItem(STORE_KEY, JSON.stringify(messages));
    } catch {}
  }, [messages]);

  // Is the assistant configured (API key present)?
  useEffect(() => {
    fetch('/api/chat')
      .then((r) => r.json())
      .then((d) => setAvailable(Boolean(d.available)))
      .catch(() => setAvailable(false));
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, open]);

  const close = useCallback(() => {
    setOpen(false);
    launcherRef.current?.focus();
  }, []);

  const send = useCallback(
    async (question: string) => {
      const q = question.trim().slice(0, 600);
      if (!q || pending) return;
      const history: Msg[] = [...messages, { role: 'user', content: q }];
      setMessages([...history, { role: 'assistant', content: '' }]);
      setInput('');
      setPending(true);

      const append = (text: string) =>
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = { role: 'assistant', content: copy[copy.length - 1].content + text };
          return copy;
        });

      try {
        abortRef.current = new AbortController();
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: history }),
          signal: abortRef.current.signal,
        });
        if (res.status === 429) return append('You’ve asked a lot of questions. Please try again in a few minutes.');
        if (res.status === 503) {
          setAvailable(false);
          return append(assistantCopy.offline);
        }
        if (!res.ok || !res.body) return append('Something went wrong. Please try again.');

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          append(decoder.decode(value, { stream: true }));
        }
      } catch (err) {
        if ((err as Error).name !== 'AbortError') append('Connection lost. Please try again.');
      } finally {
        setPending(false);
        abortRef.current = null;
      }
    },
    [messages, pending],
  );

  // Open from anywhere (e.g. "Ask the assistant" buttons), optionally with a question.
  useEffect(() => {
    const onOpen = (e: Event) => {
      setOpen(true);
      const q = (e as CustomEvent<{ question?: string }>).detail?.question;
      if (q) void send(q);
    };
    window.addEventListener('ask-razeen:open', onOpen);
    return () => window.removeEventListener('ask-razeen:open', onOpen);
  }, [send]);

  useEffect(() => {
    if (!open) return;
    // Move focus into the dialog: the input, or the close button while offline.
    (inputRef.current && !inputRef.current.disabled ? inputRef.current : closeRef.current)?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, close]);

  const offline = available === false;
  const showSuggestions = !messages.some((m) => m.role === 'user');

  return (
    <div data-print-hide data-surface="dark" className="!bg-transparent">
      {/* Launcher */}
      <button
        ref={launcherRef}
        type="button"
        aria-expanded={open}
        aria-controls="ask-razeen"
        onClick={() => (open ? close() : setOpen(true))}
        className={cn(
          'fixed bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] right-4 z-[60] flex items-center gap-3 rounded-full border border-line bg-carbon py-1.5 pl-1.5 pr-4 text-warm shadow-[0_8px_30px_rgb(0_0_0/0.35)] transition-transform hover:-translate-y-0.5 md:right-6',
          open && 'max-md:hidden',
        )}
      >
        <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-lime">
          <Image src={assets.miniRazeen.neutral.src} alt="" width={30} height={35} className="mt-2" />
          {!offline && available && (
            <span aria-hidden="true" className="absolute right-0.5 top-0.5 h-2 w-2 rounded-full border border-carbon bg-lime" />
          )}
        </span>
        <span className="label">{open ? 'Close' : 'Ask about me'}</span>
      </button>

      {/* Panel */}
      <section
        id="ask-razeen"
        role="dialog"
        aria-label={assistantCopy.name}
        hidden={!open}
        className="fixed inset-x-0 bottom-0 z-[61] h-[85svh] flex-col [&:not([hidden])]:flex border-t border-line bg-carbon text-warm md:inset-x-auto md:bottom-20 md:right-6 md:h-[34rem] md:w-[24rem] md:border md:shadow-[0_20px_60px_rgb(0_0_0/0.45)]"
      >
        <header className="flex items-center justify-between border-b border-line px-4 py-3">
          <div className="flex items-center gap-3">
            <Image src={assets.miniRazeen.happy.src} alt="" width={28} height={33} />
            <div>
              <p className="text-sm font-semibold">{assistantCopy.name}</p>
              <p className="label flex items-center gap-1.5 text-muted">
                <span
                  aria-hidden="true"
                  className={offline ? 'h-1.5 w-1.5 rounded-full border border-muted' : 'h-1.5 w-1.5 rounded-full bg-lime'}
                />
                {offline ? 'Offline' : 'Answers from this site only'}
              </p>
            </div>
          </div>
          <button ref={closeRef} type="button" onClick={close} className="label px-2 py-1 hover:text-lime">
            Close ✕
          </button>
        </header>

        <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4" aria-live="polite">
          <p className="max-w-[90%] text-sm text-warm/90">{offline ? assistantCopy.offline : assistantCopy.greeting}</p>

          {messages.map((m, i) => (
            <div key={i} className={m.role === 'user' ? 'flex justify-end' : undefined}>
              <p
                className={cn(
                  'max-w-[90%] whitespace-pre-wrap text-sm',
                  m.role === 'user' ? 'bg-warm px-3 py-2 text-carbon' : 'text-warm/90',
                )}
              >
                {m.role === 'assistant' && !m.content && pending ? (
                  <span className="label text-muted">Thinking…</span>
                ) : m.role === 'assistant' ? (
                  <Linkified text={m.content} />
                ) : (
                  m.content
                )}
              </p>
            </div>
          ))}

          {showSuggestions && !offline && (
            <ul className="space-y-2 pt-2" aria-label="Suggested questions">
              {assistantCopy.suggestions.map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    onClick={() => void send(s)}
                    className="w-full border border-line px-3 py-2 text-left text-sm text-warm/90 transition-colors hover:border-lime hover:text-lime"
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void send(input);
          }}
          className="border-t border-line p-3"
        >
          <div className="flex items-center gap-2">
            <label htmlFor="ask-input" className="sr-only">
              Your question about Razeen
            </label>
            <input
              id="ask-input"
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={600}
              disabled={offline}
              placeholder={offline ? 'Assistant offline' : 'Ask about Razeen’s work…'}
              className="min-w-0 flex-1 border border-line bg-transparent px-3 py-2 text-sm text-warm placeholder:text-muted focus:border-lime focus:outline-none"
            />
            <button
              type="submit"
              disabled={pending || offline || !input.trim()}
              className="label bg-lime px-3 py-2 text-carbon disabled:opacity-40"
            >
              Send
            </button>
          </div>
          <p className="mt-2 text-[11px] text-muted">
            {assistantCopy.disclaimer}{' '}
            {messages.length > 0 && (
              <button type="button" onClick={() => setMessages([])} className="underline underline-offset-2">
                Clear chat
              </button>
            )}
          </p>
        </form>
      </section>
    </div>
  );
}
