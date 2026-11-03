import Image from 'next/image';
import { trainerProfile } from '@/content/trainer';

/**
 * The trainer profile as a document: page 1 as a preview, then Preview (the browser's own PDF viewer,
 * which phones handle too) and Download. Both are plain links to the same file.
 */
export function TrainerProfileCard() {
  const p = trainerProfile;
  return (
    <div className="flex flex-col gap-6 border border-line p-5 sm:flex-row sm:items-start md:p-6">
      <a
        href={p.href}
        target="_blank"
        rel="noopener"
        aria-label="Preview the trainer profile (PDF, opens in a new tab)"
        className="group block w-36 shrink-0 self-center border border-line bg-white shadow-sm transition-transform hover:-translate-y-0.5 sm:w-40 sm:self-start"
      >
        <Image
          src={p.preview.src}
          width={p.preview.width}
          height={p.preview.height}
          sizes="160px"
          alt="First page of the trainer profile: name, professional summary and core expertise"
          className="h-auto w-full"
        />
      </a>
      <div className="min-w-0">
        <p className="label text-muted">Trainer profile · PDF · {p.pages} pages</p>
        <p className="mt-2 text-lg font-semibold">Ts. Mohamad Razeen Iqbal Roslan</p>
        <p className="mt-2 max-w-prose text-sm text-muted">
          Training experience, speaking, professional registration and certifications, in one document for organisers.
        </p>
        <p className="label mt-2 text-muted">Updated {p.updated}</p>
        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
          <a href={p.href} target="_blank" rel="noopener" className="label hit group inline-flex items-center gap-2 border-b border-current pb-1 hover:text-signal">
            Preview
            <span aria-hidden="true" className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
              ↗
            </span>
          </a>
          <a href={p.href} download={p.fileName} className="label hit group inline-flex items-center gap-2 border-b border-current pb-1 hover:text-signal">
            Download PDF
            <span aria-hidden="true" className="transition-transform group-hover:translate-y-0.5">
              ↓
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
