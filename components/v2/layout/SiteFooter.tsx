import Link from 'next/link';
import { Wordmark } from '@/components/v2/identity/Wordmark';
import { Trajectory } from '@/components/v2/system/Trajectory';
import { primaryNav, utilityNav } from '@/lib/site';
import { profile, contact } from '@/content/profile';

// Verified channels only (the same ones the Contact page lists).
const elsewhere = [
  { label: 'Email', href: `mailto:${contact.email}` },
  { label: 'LinkedIn', href: contact.linkedin },
  { label: 'GitHub', href: contact.github },
];

/** A compact index of the site, not a second copy of it: sections, utilities, channels. */
export function SiteFooter() {
  return (
    <footer data-surface="dark" className="border-t border-line pb-10 pt-16">
      <div className="page-grid gap-y-10">
        <div className="col-span-full lg:col-span-4">
          <Wordmark withUmbrella className="text-3xl" />
        </div>

        <nav aria-label="Footer sections" className="col-span-2 lg:col-span-2 lg:col-start-7">
          <ul className="label space-y-0.5">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="inline-block py-1.5 hover:text-lime">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Footer utilities" className="col-span-2 lg:col-span-2">
          <ul className="label space-y-0.5">
            {utilityNav.map((u) => (
              <li key={u.href}>
                <Link href={u.href} className="inline-block py-1.5 hover:text-lime">
                  {u.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <ul aria-label="Elsewhere" className="label col-span-2 space-y-0.5 lg:col-span-2">
          {elsewhere.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                className="inline-block py-1.5 hover:text-lime"
                {...(s.href.startsWith('http') && { target: '_blank', rel: 'noopener noreferrer' })}
              >
                {s.label} <span aria-hidden="true">↗</span>
              </a>
            </li>
          ))}
        </ul>

        <div className="col-span-full flex flex-col gap-4 border-t border-line pt-6 md:flex-row md:items-center md:justify-between">
          <Trajectory steps={profile.loops.journey} />
          <p className="label text-muted">© {new Date().getFullYear()} Razeen Iqbal · Made by Razeen</p>
        </div>
      </div>
    </footer>
  );
}
