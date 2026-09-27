'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Wordmark } from '@/components/v2/identity/Wordmark';
import { MiniRazeen } from '@/components/v2/identity/MiniRazeen';
import { Avatar } from '@/components/v2/identity/Avatar';
import { primaryNav, contactHref, resumeHref, isActive } from '@/lib/site';
import { profile } from '@/content/profile';
import { cn } from '@/lib/utils';

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Close on navigation.
  useEffect(() => setOpen(false), [pathname]);

  // Lock scroll and close on Escape while the mobile menu is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <header
      data-surface="dark"
      className="sticky top-0 z-50 border-b border-line"
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <a
        href="#main"
        className="label sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-lime focus:px-3 focus:py-2 focus:text-carbon"
      >
        Skip to content
      </a>

      <div className="page-container flex h-16 items-center justify-between gap-6">
        {/* [Mini Razeen] razeeniqbal. : the avatar supports the wordmark, never outweighs it (spec §9). */}
        <Link href="/" className="flex items-center gap-2.5 text-xl">
          <Avatar size={32} priority />
          <Wordmark />
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {primaryNav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'label flex items-center gap-2 py-2 transition-colors hover:text-ink',
                      active ? 'text-ink' : 'text-muted',
                    )}
                  >
                    {/* Dot + ink colour, so state isn't carried by colour alone. */}
                    <span
                      aria-hidden="true"
                      className={cn('h-1.5 w-1.5 rounded-full', active ? 'bg-lime' : 'bg-transparent')}
                    />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-6">
          <span className="label hidden text-muted xl:inline" aria-hidden="true">
            {profile.loops.system.join(' · ')}
          </span>
          <Link
            href={resumeHref}
            aria-current={isActive(pathname, resumeHref) ? 'page' : undefined}
            className={cn('label hidden py-2 transition-colors hover:text-ink md:inline-block', isActive(pathname, resumeHref) ? 'text-ink' : 'text-muted')}
          >
            Resume ↗
          </Link>
          <Link
            href={contactHref}
            aria-current={isActive(pathname, contactHref) ? 'page' : undefined}
            className="label hidden border border-line px-4 py-2 transition-colors hover:border-lime hover:text-lime md:inline-block"
          >
            Contact →
          </Link>
          <button
            ref={toggleRef}
            type="button"
            className="label py-2 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>

      {/* Mobile menu: a composed full-screen index, not a squeezed desktop nav. */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="fixed inset-x-0 bottom-0 top-[calc(4rem+env(safe-area-inset-top,0px))] overflow-y-auto bg-surface md:hidden"
      >
        <nav aria-label="Mobile" className="page-container flex min-h-full flex-col py-8">
          <ol className="border-t border-line">
            {[...primaryNav, { label: 'Resume', href: resumeHref }, { label: 'Contact', href: contactHref }].map((item, i) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href} className="border-b border-line">
                  <Link href={item.href} aria-current={active ? 'page' : undefined} className="flex items-baseline gap-4 py-4">
                    <span className="label w-6 text-muted">{String(i + 1).padStart(2, '0')}</span>
                    <span className="text-display-md">{item.label}</span>
                    {active && <span aria-hidden="true" className="ml-auto h-2.5 w-2.5 self-center rounded-full bg-lime" />}
                  </Link>
                </li>
              );
            })}
          </ol>
          <div className="mt-auto flex items-end justify-between pt-10">
            <div className="label space-y-1 text-muted">
              {profile.loops.system.map((s) => (
                <p key={s}>{s}</p>
              ))}
            </div>
            <MiniRazeen pose="exploring" height={96} />
          </div>
        </nav>
      </div>
    </header>
  );
}
