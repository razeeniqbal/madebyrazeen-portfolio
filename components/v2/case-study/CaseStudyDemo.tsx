import motion from '@/content/data/sepang-motion.json';
import { TechnicalLabel } from '@/components/v2/system/TechnicalLabel';
import { QualityWorkflowDemo } from '@/components/v2/work/QualityWorkflowDemo';
import { SepangMotionDemo, type SepangMotion } from './SepangMotionDemo';
import { LoopVideo } from '@/components/v2/system/LoopVideo';
import { videos } from '@/lib/assets';

/** Interactive demos a case study can place as a block. Each one is built from real data or labels itself. */
export function CaseStudyDemo({ demo, caption }: { demo: 'sepang-motion' | 'quality-workflow' | 'vsb-preview'; caption?: string }) {
  return (
    <figure data-reveal>
      {demo === 'sepang-motion' ? (
        <SepangMotionDemo data={motion as unknown as SepangMotion} />
      ) : demo === 'vsb-preview' ? (
        <LoopVideo {...videos.vsbPreview} />
      ) : (
        <QualityWorkflowDemo />
      )}
      {caption && (
        <figcaption className="mt-4">
          <TechnicalLabel>{caption}</TechnicalLabel>
        </figcaption>
      )}
    </figure>
  );
}
