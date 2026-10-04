'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { assistantCopy } from '@/content/assistant';
import type { BotMood } from '@/lib/assets';
import { BotAvatar } from './BotAvatar';
import { cn } from '@/lib/utils';

type Msg = { role: 'user' | 'assistant'; content: string };

const STORE_KEY = 'ask-razeen:v1';

/**
 * Content-first pages: project case studies (screenshots are evidence) and the content-heavy Trainer,
 * Credentials, Life and Running pages. There the trigger stays compact until the visitor opens it.
 */
const isQuietRoute = (path: string) => /^\/projects\/[^/]+/.test(path) || /^\/(trainer|credentials|life|running|journal)(\/|$)/.test(path);
const SLEEP_AFTER_MS = 60_000;

/** Turns relative site links (/projects/…) and URLs in plain-text answers into links. Old paths still redirect. */
function Linkified({ text }: { text: string }) {
  const parts = text.split(
    /(https?:\/\/[^\s)]+|(?<![\w/])\/(?:projects|journal|work|experience|trainer|life|about|resume|contact|running)(?:\/[\w-]+)?(?:#[\w-]+)?)/g,
  );
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

// Elements whose whole box counts as content when the launcher would sit on it.
const SOLID = 'img, video, svg, canvas, picture, input, select, textarea, button, table, iframe';

/**
 * True when a point sits on real content: the box of an image, control or table, or the actual glyph
 * boxes of text (never the empty end of a line). Pure DOM geometry (elementsFromPoint + Range rects),
 * so it behaves the same in Chromium, Firefox and WebKit. The launcher is made click-through first.
 */
function contentAt(x: number, y: number): boolean {
  const pad = 6;
  for (const el of document.elementsFromPoint(x, y)) {
    if (el.closest('[data-ask-widget]')) continue;
    if (el.closest(SOLID)) return true;
    // Text directly inside the topmost element (inline children such as links are topmost themselves).
    const range = document.createRange();
    for (const node of Array.from(el.childNodes)) {
      if (node.nodeType !== Node.TEXT_NODE || !node.textContent?.trim()) continue;
      range.selectNodeContents(node);
      for (const r of Array.from(range.getClientRects())) {
        if (x >= r.left - pad && x <= r.right + pad && y >= r.top - pad && y <= r.bottom + pad) return true;
      }
    }
    return false;
  }
  return false;
}

export function AskWidget() {
  const pathname = usePathname();
  const quiet = isQuietRoute(pathname ?? '');
  const [open, setOpen] = useState(false);
  const [teaser, setTeaser] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [pending, setPending] = useState(false);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Mascot state inputs
  const [hover, setHover] = useState(false);
  const [greeting, setGreeting] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [trouble, setTrouble] = useState(false);
  const [asleep, setAsleep] = useState(false);
  // Slid into the right gutter while the launcher would sit on text, links, images or controls.
  const [tucked, setTucked] = useState(false);
  const flash = (set: (v: boolean) => void, ms: number) => {
    set(true);
    setTimeout(() => set(false), ms);
  };

  // Wave hello once per visit.
  useEffect(() => {
    try {
      if (sessionStorage.getItem('ask-razeen:greeted')) return;
      sessionStorage.setItem('ask-razeen:greeted', '1');
    } catch {}
    const t = setTimeout(() => flash(setGreeting, 2600), 1200);
    return () => clearTimeout(t);
  }, []);

  // Doze off after a minute with no activity; any interaction wakes him up.
  useEffect(() => {
    let last = Date.now();
    const wake = () => {
      last = Date.now();
      setAsleep(false);
    };
    const events = ['pointermove', 'keydown', 'scroll', 'touchstart'] as const;
    events.forEach((e) => window.addEventListener(e, wake, { passive: true }));
    const id = setInterval(() => Date.now() - last > SLEEP_AFTER_MS && setAsleep(true), 5000);
    return () => {
      events.forEach((e) => window.removeEventListener(e, wake));
      clearInterval(id);
    };
  }, []);

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
  }, []);

  // The launcher is hidden while the panel is open: return focus to it after it re-renders on close.
  const wasOpen = useRef(false);
  useEffect(() => {
    if (wasOpen.current && !open) launcherRef.current?.focus();
    wasOpen.current = open;
  }, [open]);

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
        if (res.status === 429) {
          flash(setTrouble, 3000);
          return append('You have asked a lot of questions. Please try again in a few minutes.');
        }
        if (res.status === 503) {
          setAvailable(false);
          flash(setTrouble, 3000);
          return append(assistantCopy.offline);
        }
        if (!res.ok || !res.body) {
          flash(setTrouble, 3000);
          return append('Something went wrong. Please try again.');
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          append(decoder.decode(value, { stream: true }));
        }
        flash(setCelebrate, 2200);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          flash(setTrouble, 3000);
          append('Connection lost. Please try again.');
        }
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
    // Move focus into the dialog. With a mouse: the input, ready to type. On touch screens: the close
    // button, so the keyboard doesn't pop up over the suggested questions.
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    (finePointer && inputRef.current && !inputRef.current.disabled ? inputRef.current : closeRef.current)?.focus();

    // On phones the panel is a bottom sheet: stop the page behind it from scrolling while it's open.
    const sheet = window.matchMedia('(max-width: 767px)').matches;
    const root = document.documentElement;
    const previous = root.style.overflow;
    if (sheet) root.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      if (sheet) root.style.overflow = previous;
    };
  }, [open, close]);

  // One friendly nudge per visit, only when the assistant is online, and only once the visitor has
  // scrolled past the first screen (so it never sits on top of hero content such as the credentials).
  // Never on a content-first page (see isQuietRoute): there the trigger stays compact until opened.
  useEffect(() => {
    if (open || !available || quiet) {
      setTeaser(false);
      return;
    }
    try {
      if (sessionStorage.getItem('ask-razeen:teased')) return;
    } catch {}
    const start = Date.now();
    let hide: ReturnType<typeof setTimeout> | undefined;
    const onScroll = () => {
      if (window.scrollY < window.innerHeight * 0.8 || Date.now() - start < 5000) return;
      window.removeEventListener('scroll', onScroll);
      setTeaser(true);
      try {
        sessionStorage.setItem('ask-razeen:teased', '1');
      } catch {}
      hide = setTimeout(() => setTeaser(false), 14000);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (hide) clearTimeout(hide);
    };
  }, [open, available, quiet]);

  // Collision pass (every page): sample the launcher's resting footprint, including the head above the
  // pill. When it would cover content, slide it into the right gutter so only a sliver shows. It tucks
  // at once, but returns only after the area has been clear for a moment (no flicker while scrolling);
  // hover, keyboard focus and opening the panel always bring it back.
  useEffect(() => {
    if (open) {
      setTucked(false);
      return;
    }
    let frame = 0;
    let clearSince = 0;
    let lastScroll = 0;
    let settle: ReturnType<typeof setTimeout> | undefined;
    const check = () => {
      frame = 0;
      const btn = launcherRef.current;
      if (!btn) return;
      // Resting position: offsetWidth/offsetHeight ignore the tuck transform.
      // clientWidth/clientHeight exclude a classic scrollbar (Firefox and others on Windows), which is
      // what the fixed right/bottom offsets are measured from; innerWidth would shift the samples.
      const vw = document.documentElement.clientWidth;
      const vh = document.documentElement.clientHeight;
      const right = window.innerWidth >= 768 ? 24 : 16;
      const w = btn.offsetWidth;
      const h = btn.offsetHeight + 28;
      const x0 = vw - right - w;
      const y1 = vh - 16;
      const y0 = y1 - h;
      const previous = btn.style.pointerEvents;
      btn.style.pointerEvents = 'none';
      let hit = false;
      // Rows every ~10px, so a single line of small mono text cannot slip between two samples.
      for (const fx of [0.06, 0.3, 0.55, 0.8, 0.96]) {
        for (const fy of [0.03, 0.17, 0.31, 0.45, 0.59, 0.73, 0.87, 0.98]) {
          if (contentAt(x0 + w * fx, y0 + h * fy)) {
            hit = true;
            break;
          }
        }
        if (hit) break;
      }
      btn.style.pointerEvents = previous;
      if (hit) {
        clearSince = 0;
        setTucked(true);
      } else {
        // Only come back once scrolling has settled, so it never pops out mid-scroll.
        const now = performance.now();
        clearSince ||= now;
        if (now - clearSince >= 220 && now - lastScroll >= 260) setTucked(false);
        else {
          clearTimeout(settle);
          settle = setTimeout(schedule, 240);
        }
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    const onScroll = () => {
      lastScroll = performance.now();
      schedule();
    };
    schedule();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      clearTimeout(settle);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', schedule);
    };
  }, [pathname, open]);

  const offline = available === false;
  const last = messages[messages.length - 1];
  const streaming = pending && last?.role === 'assistant' && last.content.length > 0;
  const mood: BotMood = trouble
    ? 'confused'
    : pending
      ? streaming
        ? 'talking'
        : 'thinking'
      : celebrate
        ? 'happy'
        : hover || greeting
          ? 'wave'
          : open && offline
            ? 'confused'
            : asleep && !open
              ? 'sleeping'
              : 'idle';
  const showSuggestions = !messages.some((m) => m.role === 'user');

  return (
    <div data-print-hide data-ask-widget data-surface="dark" className="!bg-transparent">
      {/* Speech bubble nudge */}
      {teaser && !open && (
        <div
          role="status"
          className="ask-pop fixed bottom-[calc(5.25rem+env(safe-area-inset-bottom,0px))] right-4 z-[60] w-[16rem] border border-carbon bg-warm p-4 text-carbon shadow-[0_12px_40px_rgb(0_0_0/0.3)] md:right-6"
        >
          <button
            type="button"
            onClick={() => setTeaser(false)}
            aria-label="Dismiss"
            className="absolute right-2 top-1.5 px-1 text-sm text-carbon/60 hover:text-carbon"
          >
            ✕
          </button>
          <p className="pr-4 text-sm">Hi! Curious about Razeen&apos;s work? Ask me anything.</p>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="label mt-3 border-b border-current pb-0.5"
          >
            Ask a question →
          </button>
          {/* tail pointing at the launcher */}
          <span aria-hidden="true" className="absolute -bottom-[7px] right-10 h-3 w-3 rotate-45 border-b border-r border-carbon bg-warm" />
        </div>
      )}

      {/* Launcher */}
      <button
        ref={launcherRef}
        type="button"
        aria-expanded={open}
        aria-controls="ask-razeen"
        onClick={() => (open ? close() : setOpen(true))}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onFocus={() => setHover(true)}
        onBlur={() => setHover(false)}
        aria-label="Ask about me"
        className={cn(
          // Collapsed by default (R03: must not cover hero content); the label slides out on hover/focus or while open.
          'group fixed bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] right-4 z-[60] flex items-center rounded-full border border-line bg-carbon py-1.5 pr-3 text-warm shadow-[0_8px_30px_rgb(0_0_0/0.35)] transition-transform hover:-translate-y-0.5 motion-reduce:transition-none md:right-6',
          // Leaves quickly when it would cover content, returns gently.
          tucked && !hover ? 'duration-150' : 'duration-300',
          'pl-[3.75rem]',
          // Tucked: only a sliver stays in the page gutter (10px on phones, 14px from tablet up).
          tucked && !hover && 'translate-x-[calc(100%+6px)] md:translate-x-[calc(100%+10px)]',
          open && 'hidden', // the panel header has its own Close; one control, one Mini Razeen
        )}
      >
        {/* Mini Razeen peeks out of the pill; his pose follows the chat's state */}
        <span aria-hidden="true" className="absolute -top-7 left-1 h-[62px] w-[62px]">
          <BotAvatar mood={mood} size={62} className="drop-shadow-[0_4px_6px_rgb(0_0_0/0.35)]" />
          <span
            className={cn(
              'absolute bottom-1 right-1 h-2.5 w-2.5 rounded-full border-2 border-carbon',
              available ? 'bg-lime' : 'bg-grey',
            )}
          />
        </span>
        <span
          aria-hidden="true"
          className={cn(
            'label overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-300 motion-reduce:transition-none',
            hover ? 'max-w-[8rem] opacity-100' : 'max-w-0 opacity-0',
          )}
        >
          Ask about me
        </span>
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
            <BotAvatar mood={mood} size={36} className="overflow-hidden rounded-full bg-lime" />
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

        <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-4" aria-live="polite">
          <div className="flex items-end gap-3">
            <p className="max-w-[90%] pb-2 text-sm text-warm/90">{offline ? assistantCopy.offline : assistantCopy.greeting}</p>
          </div>

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
              className="min-w-0 flex-1 border border-line bg-transparent px-3 py-2 text-base text-warm placeholder:text-muted focus:border-lime focus:outline-none md:text-sm"
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
