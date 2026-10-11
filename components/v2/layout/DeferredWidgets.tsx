'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import type { JumpItem } from './CommandMenu';

// The chat widget and the quick-jump menu are on every page but never part of the first paint, so their
// code loads on the visitor's first interaction (scroll, touch, pointer, key), or after a few seconds,
// not with the page itself, so it never competes with the first paint.
const loadAsk = () => import('@/components/v2/chat/AskWidget');
const loadMenu = () => import('./CommandMenu');
const AskWidget = dynamic(() => loadAsk().then((m) => m.AskWidget), { ssr: false });
const CommandMenu = dynamic(() => loadMenu().then((m) => m.CommandMenu), { ssr: false });

export function DeferredWidgets({ items }: { items: JumpItem[] }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const firstTouch = ['pointerdown', 'pointermove', 'scroll', 'touchstart', 'wheel'] as const;
    // Ctrl/⌘ K before the menu has loaded: load it, then open it. Once loaded, the menu handles the keys.
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        go();
        loadMenu().then(() => window.setTimeout(() => window.dispatchEvent(new Event('open-command-menu')), 100));
      }
    };
    // An "Ask" button pressed before the chat is mounted (the press itself is often the first interaction):
    // load it, then pass the question on. Listens until the chat has had time to mount.
    const replayed = new WeakSet<Event>();
    const onAsk = (e: Event) => {
      if (replayed.has(e)) return;
      go();
      const again = new CustomEvent('ask-razeen:open', { detail: (e as CustomEvent).detail });
      replayed.add(again);
      loadAsk().then(() => window.setTimeout(() => window.dispatchEvent(again), 150));
    };
    let askTimer = 0;
    const onFirst = () => go();
    const detach = () => {
      window.clearTimeout(timer);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('keydown', onFirst);
      firstTouch.forEach((t) => window.removeEventListener(t, onFirst));
    };
    const go = () => {
      detach();
      setReady(true);
      if (!askTimer) loadAsk().then(() => (askTimer = window.setTimeout(() => window.removeEventListener('ask-razeen:open', onAsk), 1000)));
    };
    const timer = window.setTimeout(go, 10_000);
    window.addEventListener('keydown', onKey);
    window.addEventListener('keydown', onFirst);
    window.addEventListener('ask-razeen:open', onAsk);
    firstTouch.forEach((t) => window.addEventListener(t, onFirst, { passive: true }));
    return () => {
      detach();
      window.clearTimeout(askTimer);
      window.removeEventListener('ask-razeen:open', onAsk);
    };
  }, []);

  if (!ready) return null;
  return (
    <>
      <AskWidget />
      <CommandMenu items={items} />
    </>
  );
}
