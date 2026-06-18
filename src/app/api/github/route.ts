import { NextResponse } from "next/server";
import { readData } from "@/lib/data";

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
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const returnAll = searchParams.get("all") === "true";
    const headers: HeadersInit = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "shravan-portfolio",
    };

    if (process.env.GITHUB_TOKEN) {
      headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    // Fetch live repos from GitHub
    let repos: any[] = [];
    let isOffline = false;

    try {
      const res = await fetch(
        `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=stars&per_page=100`,
        {
          headers,
          next: { revalidate: 3600 },
        }
      );

      if (!res.ok) {
        console.error(`GitHub API error: ${res.status} ${res.statusText}`);
        repos = FALLBACK_REPOS;
        isOffline = true;
      } else {
        const data = await res.json();
        repos = Array.isArray(data) ? data : [];
      }
    } catch {
      repos = FALLBACK_REPOS;
      isOffline = true;
    }

    // Load CMS overrides from github.json
    let cmsOverrides: any[] = [];
    try {
      const githubData = await readData<any>("github.json");
      cmsOverrides = githubData.repos || [];
    } catch {
      cmsOverrides = [];
    }

    // Build override lookup
    const overrideMap = cmsOverrides.reduce((acc: any, ov: any) => {
      acc[ov.name] = ov;
      return acc;
    }, {} as Record<string, any>);

    // Merge: apply CMS overrides to live GitHub data
    const mergedReposMap = new Map<string, any>();
    
    // Add live repos first
    repos.forEach((repo: any) => {
      const ov = overrideMap[repo.name];
      if (!ov) {
        mergedReposMap.set(repo.name, {
          ...repo,
          cmsStatus: "Hidden",
          cmsPinned: false,
          cmsSortOrder: 999,
          cmsDescription: "",
          cmsCategory: "",
          cmsThumbnail: "",
        });
      } else {
        mergedReposMap.set(repo.name, {
          ...repo,
          description: ov.customDescription || repo.description,
          cmsStatus: ov.status || "Hidden",
          cmsPinned: ov.pinned || false,
          cmsSortOrder: ov.sortOrder ?? 999,
          cmsDescription: ov.customDescription || "",
          cmsCategory: ov.customCategory || "",
          cmsThumbnail: ov.customThumbnail || "",
        });
      }
    });

    // Add any overrides that were NOT in the live GitHub data (e.g. private repos or removed repos)
    cmsOverrides.forEach((ov: any) => {
      if (!mergedReposMap.has(ov.name)) {
        mergedReposMap.set(ov.name, {
          id: ov.id || ov.name,
          name: ov.name,
          description: ov.customDescription || "",
          html_url: `https://github.com/${GITHUB_USERNAME}/${ov.name}`,
          stargazers_count: 0,
          forks_count: 0,
          language: ov.customCategory || "",
          cmsStatus: ov.status || "Hidden",
          cmsPinned: ov.pinned || false,
          cmsSortOrder: ov.sortOrder ?? 999,
          cmsDescription: ov.customDescription || "",
          cmsCategory: ov.customCategory || "",
          cmsThumbnail: ov.customThumbnail || "",
        });
      }
    });

    const mergedRepos = Array.from(mergedReposMap.values());

    // Filter: Only show Featured or Normal (not Archived, not Hidden)
    const visibleRepos = mergedRepos.filter(
      (r: any) => r.cmsStatus === "Featured" || r.cmsStatus === "Normal"
    );

    // Sort: Pinned Featured → Featured → Normal, then by sortOrder
    visibleRepos.sort((a: any, b: any) => {
      // Pinned first
      if (a.cmsPinned !== b.cmsPinned) return a.cmsPinned ? -1 : 1;
      // Featured before Normal
      if (a.cmsStatus === "Featured" && b.cmsStatus !== "Featured") return -1;
      if (a.cmsStatus !== "Featured" && b.cmsStatus === "Featured") return 1;
      // Then by sortOrder
      return (a.cmsSortOrder || 999) - (b.cmsSortOrder || 999);
    });

    // Load settings for maxGithubRepos
    let maxRepos = 6;
    try {
      const settings = await readData<any>("settings.json");
      maxRepos = settings.maxGithubRepos || 6;
    } catch {
      // keep default
    }

    // Limit to maxRepos
    const limitedRepos = visibleRepos.slice(0, maxRepos);

    if (returnAll) {
      // For CMS dashboard, we also sort mergedRepos so it's clean
      mergedRepos.sort((a: any, b: any) => {
        if (a.cmsPinned !== b.cmsPinned) return a.cmsPinned ? -1 : 1;
        if (a.cmsStatus === "Featured" && b.cmsStatus !== "Featured") return -1;
        if (a.cmsStatus !== "Featured" && b.cmsStatus === "Featured") return 1;
        return (a.cmsSortOrder || 999) - (b.cmsSortOrder || 999);
      });
      return NextResponse.json(
        { repos: mergedRepos, offline: isOffline },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { repos: limitedRepos, offline: isOffline },
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
