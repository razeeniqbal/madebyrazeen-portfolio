import motion from '@/content/data/sepang-motion.json';
import { TechnicalLabel } from '@/components/v2/system/TechnicalLabel';
import { QualityWorkflowDemo } from '@/components/v2/work/QualityWorkflowDemo';
import { SepangMotionDemo, type SepangMotion } from './SepangMotionDemo';

/** Interactive demos a case study can place as a block. Each one is built from real data or labels itself. */
export function CaseStudyDemo({ demo, caption }: { demo: 'sepang-motion' | 'quality-workflow'; caption?: string }) {
  return (
    <figure data-reveal>
      {demo === 'sepang-motion' ? <SepangMotionDemo data={motion as unknown as SepangMotion} /> : <QualityWorkflowDemo />}
      {caption && (
        <figcaption className="mt-4">
          <TechnicalLabel>{caption}</TechnicalLabel>
        </figcaption>
      )}
    </figure>
  );
}
