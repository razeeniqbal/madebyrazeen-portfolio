import { NextResponse } from 'next/server';
import { fetchGitHubStats } from '@/lib/github';

// Cache duration: 1 hour
export const revalidate = 3600;

export async function GET() {
  try {
    const token = process.env.GITHUB_TOKEN;
    const stats = await fetchGitHubStats(token);
    if (!stats) {
      return NextResponse.json({ error: 'GitHub data unavailable' }, { status: 503 });
    }
    return NextResponse.json(stats);
  } catch (error) {
    console.error('GitHub API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch GitHub data' },
      { status: 500 }
    );
  }
}
