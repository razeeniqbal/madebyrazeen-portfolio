'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import type { JumpItem } from './CommandMenu';

// The chat widget and the quick-jump menu are on every page but never part of the first paint, so their
// code loads once the page is idle (or on the first key press), not with the page itself.
const loadAsk = () => import('@/components/v2/chat/AskWidget');
const loadMenu = () => import('./CommandMenu');
const AskWidget = dynamic(() => loadAsk().then((m) => m.AskWidget), { ssr: false });
const CommandMenu = dynamic(() => loadMenu().then((m) => m.CommandMenu), { ssr: false });

export function DeferredWidgets({ items }: { items: JumpItem[] }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const hasIdle = 'requestIdleCallback' in window;
    // Ctrl/⌘ K before the menu has loaded: load it, then open it. Once loaded, the menu handles the keys.
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        go();
        loadMenu().then(() => window.setTimeout(() => window.dispatchEvent(new Event('open-command-menu')), 100));
      }
    };
    // An "Ask" button pressed before the chat has loaded: load it, then pass the question on.
    const onAsk = (e: Event) => {
      go();
      const detail = (e as CustomEvent).detail;
      loadAsk().then(() => window.setTimeout(() => window.dispatchEvent(new CustomEvent('ask-razeen:open', { detail })), 100));
    };
    const go = () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('ask-razeen:open', onAsk);
      setReady(true);
    };
    const idle = hasIdle ? window.requestIdleCallback(go, { timeout: 3000 }) : window.setTimeout(go, 1500);
    window.addEventListener('keydown', onKey);
    window.addEventListener('ask-razeen:open', onAsk);
    return () => {
      if (hasIdle) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      window.removeEventListener('keydown', onKey);
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
