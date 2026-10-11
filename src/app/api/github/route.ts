import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const LOGIN = 'fatinm1';
const CACHE_MS = 6 * 60 * 60 * 1000; // 6 hours
const RETRY_MS = 10 * 60 * 1000; // after a failed refresh

const QUERY = `query($login: String!) {
  user(login: $login) {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionCount contributionLevel } }
      }
    }
  }
}`;

const LEVELS: Record<string, number> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

export interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

export interface ContributionCalendar {
  total: number;
  weeks: ContributionDay[][];
}

// Next's fetch cache skips POST requests with an Authorization header (which the GraphQL
// API requires), so cache in memory instead. Fine for a single-instance deployment.
let cached: { data: ContributionCalendar | null; refreshAt: number } = { data: null, refreshAt: 0 };
let inflight: Promise<ContributionCalendar | null> | null = null;

async function fetchCalendar(token: string): Promise<ContributionCalendar | null> {
  try {
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: { Authorization: `bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: QUERY, variables: { login: LOGIN } }),
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.error('GitHub contributions request failed:', res.status);
      return null;
    }
    const json = await res.json();
    const calendar = json?.data?.user?.contributionsCollection?.contributionCalendar;
    if (!calendar) {
      console.error('GitHub contributions response missing calendar:', json?.errors?.[0]?.message);
      return null;
    }
    return {
      total: calendar.totalContributions,
      weeks: calendar.weeks.map((week: { contributionDays: { date: string; contributionCount: number; contributionLevel: string }[] }) =>
        week.contributionDays.map((day) => ({
          date: day.date,
          count: day.contributionCount,
          level: LEVELS[day.contributionLevel] ?? 0,
        }))
      ),
    };
  } catch (error) {
    console.error('GitHub contributions error:', error);
    return null;
  }
}

export async function GET() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return NextResponse.json({ error: 'Unavailable' }, { status: 404 });
  }

  if (Date.now() >= cached.refreshAt) {
    inflight ??= fetchCalendar(token).finally(() => {
      inflight = null;
    });
    const fresh = await inflight;
    // On failure keep serving the last good calendar and retry sooner.
    cached = fresh
      ? { data: fresh, refreshAt: Date.now() + CACHE_MS }
      : { data: cached.data, refreshAt: Date.now() + RETRY_MS };
  }

  if (!cached.data) {
    return NextResponse.json({ error: 'Unavailable' }, { status: 503 });
  }
  return NextResponse.json(cached.data, {
    headers: { 'Cache-Control': 'public, max-age=3600, stale-while-revalidate=3600' },
  });
}
