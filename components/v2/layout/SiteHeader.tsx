'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Wordmark } from '@/components/v2/identity/Wordmark';
import { MiniRazeen } from '@/components/v2/identity/MiniRazeen';
import { Avatar } from '@/components/v2/identity/Avatar';
import { openCommandMenu } from './CommandMenu';
import { primaryNav, utilityNav, contactHref, isActive, isSectionActive } from '@/lib/site';
import { profile } from '@/content/profile';
import { cn } from '@/lib/utils';

/**
 * Global header. Three widths, three compositions (not one layout shrunk):
 * - ≥1024: wordmark · six primary sections · utilities (Resume ↗, Contact →) behind a hairline.
 * - 768–1023: wordmark · Contact → · Menu. Six sections do not fit beside the wordmark with room to read.
 * - <768: wordmark · Menu.
 * The menu panel separates the primary sections from the utilities.
 * Active state: ink text plus a short lime rule under the label, so it is never colour alone.
 */
export function SiteHeader() {
  const pathname = usePathname();
  // The menu belongs to the page it was opened on: navigating elsewhere closes it, with no effect needed.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  // While the menu is open: lock scroll, move focus into it, make the page behind it inert (Tab stays in
  // the header and menu), close on Escape (focus returns to the toggle).
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const behind = [...document.querySelectorAll<HTMLElement>('#main, footer, [data-ask-widget]')];
    behind.forEach((el) => el.setAttribute('inert', ''));
    firstLinkRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenOn(null);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      behind.forEach((el) => el.removeAttribute('inert'));
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const contactActive = isActive(pathname, contactHref);

  return (
    <header data-surface="dark" className="sticky top-0 z-50 border-b border-line" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
      <a
        href="#main"
        className="label sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-lime focus:px-3 focus:py-2 focus:text-carbon"
      >
        Skip to content
      </a>

      {/* ≥1024: a three-column grid, so the six sections sit centred between identity and utilities. */}
      <div className="page-container flex h-16 items-center justify-between gap-6 lg:grid lg:grid-cols-[1fr_auto_1fr]">
        {/* [Mini Razeen] razeeniqbal. : the avatar supports the wordmark, never outweighs it (spec §9). */}
        <Link href="/" className="flex shrink-0 items-center gap-2.5 justify-self-start text-xl">
          <Avatar size={32} priority />
          <Wordmark />
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-5 xl:gap-8">
            {primaryNav.map((item) => {
              const active = isSectionActive(pathname, item);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn('label relative block py-2 transition-colors hover:text-ink', active ? 'text-ink' : 'text-muted')}
                  >
                    {item.label}
                    <span
                      aria-hidden="true"
                      className={cn('absolute inset-x-0 bottom-0 h-0.5 bg-lime transition-opacity', active ? 'opacity-100' : 'opacity-0')}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Utilities: set apart on the right, smaller in weight than the sections they follow. */}
        <nav aria-label="Utilities" className="hidden justify-self-end lg:block">
          <ul className="flex items-center gap-5 xl:gap-6">
            <li>
              {/* Quick jump (Ctrl/⌘ K): every page, project and journal entry. */}
              <button
                type="button"
                onClick={openCommandMenu}
                aria-label="Quick jump to a page, project or article (Ctrl K)"
                className="label flex items-center gap-2 py-2 text-muted transition-colors hover:text-ink"
              >
                Jump
                <kbd className="border border-line px-1.5 py-0.5 font-mono text-[0.625rem]">Ctrl K</kbd>
              </button>
            </li>
            {utilityNav.map((u) => {
              const active = isActive(pathname, u.href);
              return (
                <li key={u.href}>
                  <Link
                    href={u.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'label inline-block transition-colors',
                      u.href === contactHref
                        ? cn('border px-4 py-2 hover:border-lime hover:text-lime', active ? 'border-lime text-lime' : 'border-line')
                        : cn(
                            'py-2 hover:text-ink',
                            active ? 'text-ink underline decoration-lime decoration-2 underline-offset-[6px]' : 'text-muted',
                          ),
                    )}
                  >
                    {u.label} <span aria-hidden="true">{u.arrow}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-6 lg:hidden">
          <Link
            href={contactHref}
            aria-current={contactActive ? 'page' : undefined}
            className={cn(
              'label hidden border px-4 py-2 transition-colors hover:border-lime hover:text-lime md:inline-block',
              contactActive ? 'border-lime text-lime' : 'border-line',
            )}
          >
            Contact <span aria-hidden="true">→</span>
          </Link>
          <button
            ref={toggleRef}
            type="button"
            className="label py-2"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpenOn(open ? null : pathname)}
          >
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>

      {/* Menu panel (below 1024): a composed index of the six sections, then the two utilities. */}
      <div
        id="site-menu"
        hidden={!open}
        className="fixed inset-x-0 bottom-0 top-[calc(4rem+env(safe-area-inset-top,0px))] overflow-y-auto bg-surface lg:hidden"
      >
        <div className="page-container flex min-h-full flex-col py-8">
          <nav aria-labelledby="menu-primary">
            <p id="menu-primary" className="label mb-3 text-muted">
              Primary
            </p>
            <ol className="border-t border-line">
              {primaryNav.map((item, i) => {
                const active = isSectionActive(pathname, item);
                return (
                  <li key={item.href} className="border-b border-line">
                    <Link
                      ref={i === 0 ? firstLinkRef : undefined}
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      className="flex items-baseline gap-4 py-3.5"
                    >
                      <span className="label w-6 text-muted">{item.index}</span>
                      <span className="text-display-md">{item.label}</span>
                      {active && <span aria-hidden="true" className="ml-auto h-2.5 w-2.5 self-center rounded-full bg-lime" />}
                    </Link>
                  </li>
                );
              })}
            </ol>
          </nav>

          <nav aria-labelledby="menu-utility" className="mt-8">
            <p id="menu-utility" className="label mb-3 text-muted">
              Utility
            </p>
            <ul className="flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-4">
              {utilityNav.map((u) => (
                <li key={u.href}>
                  <Link
                    href={u.href}
                    aria-current={isActive(pathname, u.href) ? 'page' : undefined}
                    className="label inline-block border-b border-current pb-1"
                  >
                    {u.label} <span aria-hidden="true">{u.arrow}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* pb clears the fixed chat launcher (bottom-right, about 3.5rem tall), so Mini Razeen sits above it. */}
          <div className="mt-auto flex items-end justify-between pb-20 pt-10">
            <div className="label space-y-1 text-muted">
              {profile.loops.system.map((s) => (
                <p key={s}>{s}</p>
              ))}
            </div>
            <MiniRazeen pose="exploring" height={96} />
          </div>
        </div>
      </div>
    </header>
  );
}
