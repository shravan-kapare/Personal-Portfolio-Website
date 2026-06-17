import { NextResponse } from "next/server";

const GITHUB_USERNAME = "shravan-kapare";

// Fallback repos when API is unreachable or rate-limited
const FALLBACK_REPOS = [
  {
    id: -1,
    name: "Shravan-Portfolio",
    description: "Personal portfolio website built with Next.js, Three.js, and TypeScript",
    html_url: "https://github.com/shravan-kapare",
    stargazers_count: 0,
    forks_count: 0,
    language: "TypeScript",
    featured: true,
  },
  {
    id: -2,
    name: "AR-Navigation",
    description: "Augmented Reality navigation system using ARCore and Unity",
    html_url: "https://github.com/shravan-kapare",
    stargazers_count: 0,
    forks_count: 0,
    language: "C#",
    featured: true,
  },
  {
    id: -3,
    name: "ML-Research",
    description: "Machine Learning research projects and experiments",
    html_url: "https://github.com/shravan-kapare",
    stargazers_count: 0,
    forks_count: 0,
    language: "Python",
    featured: true,
  },
  {
    id: -4,
    name: "IoT-Dashboard",
    description: "Real-time IoT monitoring dashboard with sensor data visualization",
    html_url: "https://github.com/shravan-kapare",
    stargazers_count: 0,
    forks_count: 0,
    language: "JavaScript",
    featured: true,
  },
];

export async function GET() {
  try {
    const headers: HeadersInit = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "shravan-portfolio",
    };

    if (process.env.GITHUB_TOKEN) {
      headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=stars&per_page=100`,
      {
        headers,
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!res.ok) {
      console.error(`GitHub API error: ${res.status} ${res.statusText}`);
      return NextResponse.json(
        { repos: FALLBACK_REPOS, offline: true },
        { status: 200 }
      );
    }

    const repos = await res.json();

    // Sort by stars descending and take top repos
    const sorted = Array.isArray(repos)
      ? repos
          .filter((r: any) => !r.fork) // exclude forks
          .sort((a: any, b: any) => b.stargazers_count - a.stargazers_count)
      : [];

    return NextResponse.json(
      { repos: sorted, offline: false },
      {
        status: 200,
        headers: {
          "Cache-Control": "s-maxage=3600, stale-while-revalidate=600",
        },
      }
    );
  } catch (error) {
    console.error("GitHub fetch error:", error);
    return NextResponse.json(
      { repos: FALLBACK_REPOS, offline: true },
      { status: 200 }
    );
  }
}
