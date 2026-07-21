import { NextResponse } from "next/server";
import { readData } from "@/lib/data";

interface GithubConfig {
  mode: "automatic" | "manual";
  username: string;
  sortBy: "updated" | "stars" | "name";
  displayLimit: number;
  ignoreArchived: boolean;
  ignoreForks: boolean;
  showPrivate: boolean;
  cacheDuration: number;
  overrides: RepoOverride[];
  githubToken?: string;
}

interface RepoOverride {
  repoId: number; // GitHub numeric repo ID — stable even on rename
  visible: boolean;
  pinned: boolean;
  sortOrder: number;
  customDescription: string;
  customCategory: string;
  customThumbnail: string;
}

const DEFAULT_CONFIG: GithubConfig = {
  mode: "automatic",
  username: "shravan-kapare",
  sortBy: "updated",
  displayLimit: 6,
  ignoreArchived: true,
  ignoreForks: true,
  showPrivate: false,
  cacheDuration: 3600,
  overrides: [],
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const returnAll = searchParams.get("all") === "true";

    // Load config from github.json
    let config: GithubConfig = DEFAULT_CONFIG;
    try {
      const raw = await readData<any>("github.json");
      config = { ...DEFAULT_CONFIG, ...raw };
      if (!Array.isArray(config.overrides)) config.overrides = [];
    } catch {
      // use defaults
    }

    const headers: HeadersInit = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "shravan-portfolio",
    };

    const token = config.githubToken || process.env.GITHUB_TOKEN;
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // Fetch all repos from GitHub (paginate to handle > 30)
    let allRepos: any[] = [];
    let pageNum = 1;
    while (true) {
      const url = token
        ? `https://api.github.com/user/repos?per_page=100&page=${pageNum}&affiliation=owner`
        : `https://api.github.com/users/${config.username}/repos?per_page=100&page=${pageNum}&type=owner`;

      const res = await fetch(url, {
        headers,
        next: { revalidate: config.cacheDuration || 3600 },
      });

      if (!res.ok) {
        console.error(`GitHub API error: ${res.status} ${res.statusText}`);
        return NextResponse.json(
          { error: `GitHub API error: ${res.status}`, repos: [] },
          { status: 502 }
        );
      }

      const batch = await res.json();
      if (!Array.isArray(batch) || batch.length === 0) break;
      allRepos = allRepos.concat(batch);
      if (batch.length < 100) break;
      pageNum++;
    }

    // Apply config filters
    const filtered = allRepos.filter((repo) => {
      if (config.ignoreArchived && repo.archived) return false;
      if (config.ignoreForks && repo.fork) return false;
      if (!config.showPrivate && repo.private) return false;
      return true;
    });

    // Build override map by numeric GitHub repo ID (stable across renames)
    const overrideMap = new Map<number, RepoOverride>();
    for (const ov of config.overrides) {
      if (ov.repoId) overrideMap.set(ov.repoId, ov);
    }

    // Merge overrides with live GitHub data
    const mergedRepos = filtered.map((repo) => {
      const ov = overrideMap.get(repo.id);
      return {
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        description: ov?.customDescription || repo.description || "",
        githubDescription: repo.description || "",
        html_url: repo.html_url,
        stargazers_count: repo.stargazers_count ?? 0,
        forks_count: repo.forks_count ?? 0,
        language: ov?.customCategory || repo.language || null,
        githubLanguage: repo.language || null,
        updated_at: repo.updated_at,
        pushed_at: repo.pushed_at,
        private: repo.private,
        archived: repo.archived,
        fork: repo.fork,
        // Override fields (ID-based)
        visible: ov ? ov.visible : config.mode === "automatic",
        pinned: ov?.pinned ?? false,
        sortOrder: ov?.sortOrder ?? 999,
        customDescription: ov?.customDescription ?? "",
        customCategory: ov?.customCategory ?? "",
        customThumbnail: ov?.customThumbnail ?? "",
        hasOverride: !!ov,
      };
    });

    // Sort function
    const sortFn = (a: any, b: any): number => {
      if (config.sortBy === "stars") return b.stargazers_count - a.stargazers_count;
      if (config.sortBy === "name") return a.name.localeCompare(b.name);
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    };

    // Prepare public config without exposing the token
    const { githubToken, ...publicConfig } = config;
    const clientConfig = { ...publicConfig, hasToken: !!githubToken };

    // For CMS dashboard: return all repos with full override metadata
    if (returnAll) {
      const cmsSorted = [...mergedRepos].sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        if (a.visible !== b.visible) return a.visible ? -1 : 1;
        if ((a.sortOrder || 999) !== (b.sortOrder || 999))
          return (a.sortOrder || 999) - (b.sortOrder || 999);
        return sortFn(a, b);
      });

      return NextResponse.json({
        repos: cmsSorted,
        config: clientConfig,
        totalFound: allRepos.length,
        filteredCount: filtered.length,
      });
    }

    // Portfolio display
    let displayRepos: any[];

    if (config.mode === "automatic") {
      displayRepos = [...mergedRepos]
        .sort((a, b) => {
          if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
          return sortFn(a, b);
        })
        .slice(0, config.displayLimit || 6);
    } else {
      // Manual mode: only show repos explicitly set to visible
      displayRepos = mergedRepos
        .filter((r) => r.visible === true)
        .sort((a, b) => {
          if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
          if ((a.sortOrder || 999) !== (b.sortOrder || 999))
            return (a.sortOrder || 999) - (b.sortOrder || 999);
          return sortFn(a, b);
        })
        .slice(0, config.displayLimit || 6);
    }

    return NextResponse.json(
      { repos: displayRepos, config: clientConfig },
      {
        status: 200,
        headers: {
          "Cache-Control": `s-maxage=${config.cacheDuration || 3600}, stale-while-revalidate=60`,
        },
      }
    );
  } catch (error) {
    console.error("GitHub fetch error:", error);
    return NextResponse.json(
      { error: "GitHub API request failed", repos: [] },
      { status: 500 }
    );
  }
}
