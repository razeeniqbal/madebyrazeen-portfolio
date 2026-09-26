/**
 * About page story, told as a journal. Edit: admin → About · story, or content/data/story.json.
 * DRAFT WORDING: facts come from the site's own data; the first-person voice is a draft to rewrite.
 */
import { assets, resolveAsset, type ImageAsset, type MiniRazeenPose } from '@/lib/assets';
import data from './data/story.json';

export interface StoryChapter {
  period: string;
  title: string;
  body: string[];
  photo?: { image: ImageAsset; caption: string };
  credential?: { title: string; issuer: string; date: string; url?: string };
  pose?: MiniRazeenPose;
}

const isPose = (p: string): p is MiniRazeenPose => p in assets.miniRazeen;

export const storyIntro = data.intro;

export const chapters: StoryChapter[] = data.chapters.map((c) => {
  const image = resolveAsset(c.photo);
  return {
    period: c.period,
    title: c.title,
    body: c.body,
    photo: image ? { image, caption: c.photoCaption } : undefined,
    credential: c.credentialTitle
      ? { title: c.credentialTitle, issuer: c.credentialIssuer, date: c.credentialDate, url: c.credentialUrl || undefined }
      : undefined,
    pose: isPose(c.pose) ? c.pose : undefined,
  };
});

/** Hero path diagram: Civil engineering → Data → AI → Systems. */
export const storyPath = data.path;

/** "How I work" loop. DRAFT WORDING. */
export const principles = data.principles;

export const storyOutro = data.outro;
