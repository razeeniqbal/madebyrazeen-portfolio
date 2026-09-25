import Link from 'next/link';
import { Wordmark } from '@/components/v2/identity/Wordmark';
import { Trajectory } from '@/components/v2/system/Trajectory';
import { primaryNav } from '@/lib/site';
import { profile, contact } from '@/content/profile';

const socials = [
  { label: 'Email', href: `mailto:${contact.email}` },
  { label: 'LinkedIn', href: contact.linkedin },
  { label: 'GitHub', href: contact.github },
];

export function SiteFooter() {
  return (
    <footer data-surface="dark" className="border-t border-line pb-10 pt-16">
      <div className="page-grid gap-y-10">
        <div className="col-span-full lg:col-span-4">
          <Wordmark withUmbrella className="text-3xl" />
        </div>

        <ul className="label col-span-2 space-y-0.5 text-muted lg:col-span-2" aria-label="Operating loop">
          {profile.loops.system.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>

        <nav aria-label="Footer" className="col-span-2 lg:col-span-2">
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

        <ul className="label col-span-2 space-y-0.5 lg:col-span-2">
          {socials.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                className="inline-block py-1.5 hover:text-lime"
                {...(s.href.startsWith('http') && { target: '_blank', rel: 'noopener noreferrer' })}
              >
                {s.label} ↗
              </a>
            </li>
          ))}
        </ul>

        <ul className="label col-span-2 space-y-0.5 lg:col-span-2">
          <li>
            <Link href="/resume" className="inline-block py-1.5 hover:text-lime">
              Resume
            </Link>
          </li>
          <li>
            <Link href="/archive" className="inline-block py-1.5 hover:text-lime">
              Archive
            </Link>
          </li>
        </ul>

        <div className="col-span-full flex flex-col gap-4 border-t border-line pt-6 md:flex-row md:items-center md:justify-between">
          <Trajectory steps={profile.loops.journey} />
          <p className="label text-muted">© {new Date().getFullYear()} Razeen Iqbal · Made by Razeen</p>
        </div>
      </div>
    </footer>
  );
}
