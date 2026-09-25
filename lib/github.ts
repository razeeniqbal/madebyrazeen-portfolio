// GitHub API utilities
const GITHUB_USERNAME = 'razeeniqbal';
const GITHUB_API = 'https://api.github.com';
const GITHUB_GRAPHQL = 'https://api.github.com/graphql';

export interface GitHubStats {
  repos: number;
  followers: number;
  following: number;
  totalStars: number;
  contributions: number;
  topLanguages: { [key: string]: number };
  contributionCalendar?: {
    totalContributions: number;
    weeks: Array<{
      contributionDays: Array<{
        contributionCount: number;
        date: string;
      }>;
    }>;
  };
}

export async function fetchGitHubStats(token?: string): Promise<GitHubStats | null> {
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    // Fetch user data
    const userResponse = await fetch(`${GITHUB_API}/users/${GITHUB_USERNAME}`, { headers });
    if (!userResponse.ok) throw new Error('Failed to fetch user data');
    const userData = await userResponse.json();

    // Fetch repositories
    const reposResponse = await fetch(
      `${GITHUB_API}/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`,
      { headers }
    );
    if (!reposResponse.ok) throw new Error('Failed to fetch repositories');
    const repos = await reposResponse.json();

    // Calculate total stars
    const totalStars = repos.reduce((acc: number, repo: any) => acc + (repo.stargazers_count || 0), 0);

    // Calculate top languages
    const languages: { [key: string]: number } = {};
    repos.forEach((repo: any) => {
      if (repo.language) {
        languages[repo.language] = (languages[repo.language] || 0) + 1;
      }
    });

    // Sort languages by count
    const sortedLanguages = Object.entries(languages)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .reduce((acc, [lang, count]) => ({ ...acc, [lang]: count }), {});

    // Fetch contribution data using GraphQL (if token is available)
    let contributionCalendar;
    let totalContributions = 0;

    if (token) {
      try {
        const graphqlQuery = {
          query: `
            query($userName:String!) {
              user(login: $userName){
                contributionsCollection {
                  contributionCalendar {
                    totalContributions
                    weeks {
                      contributionDays {
                        contributionCount
                        date
                      }
                    }
                  }
                }
              }
            }
          `,
          variables: { userName: GITHUB_USERNAME }
        };

        const graphqlResponse = await fetch(GITHUB_GRAPHQL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(graphqlQuery),
        });

        if (graphqlResponse.ok) {
          const graphqlData = await graphqlResponse.json();
          contributionCalendar = graphqlData.data?.user?.contributionsCollection?.contributionCalendar;
          totalContributions = contributionCalendar?.totalContributions || 0;
        }
      } catch (error) {
        console.error('Error fetching contribution calendar:', error);
      }
    }

    return {
      repos: userData.public_repos || 0,
      followers: userData.followers || 0,
      following: userData.following || 0,
      totalStars,
      contributions: totalContributions,
      topLanguages: sortedLanguages,
      contributionCalendar,
    };
  } catch (error) {
    // No invented fallback numbers (PRD §58): callers show an "unavailable" state instead.
    console.error('Error fetching GitHub stats:', error);
    return null;
  }
}
