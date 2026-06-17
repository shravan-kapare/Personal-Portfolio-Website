"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { GitBranch, Star, GitFork, Activity, Loader2, WifiOff, RefreshCw } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

interface Repo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
}

const langColors: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  "C#": "#178600",
  Java: "#b07219",
  Dart: "#00B4AB",
  HTML: "#e34c26",
  CSS: "#563d7c",
  "C++": "#f34b7d",
  Kotlin: "#A97BFF",
  Swift: "#F05138",
};

export default function GithubSection({
  username = "shravan-kapare",
  featuredRepoNames = [],
}: {
  username?: string;
  featuredRepoNames?: string[];
}) {
  const [allRepos, setAllRepos] = useState<Repo[]>([]);
  const [displayRepos, setDisplayRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOfflineData, setIsOfflineData] = useState(false);
  const [retrying, setRetrying] = useState(false);

  // Track whether we've already fetched to prevent duplicate calls
  const hasFetched = useRef(false);

  const fetchGithubData = useCallback(async (isRetry = false) => {
    try {
      if (isRetry) {
        setRetrying(true);
        setIsOfflineData(false);
      }
      setLoading(true);

      const res = await fetch("/api/github");
      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();
      const repos: Repo[] = data.repos || [];
      setAllRepos(repos);
      setIsOfflineData(data.offline === true);
      setLoading(false);
      setRetrying(false);
    } catch (err) {
      console.error("GitHub fetch error:", err);
      setIsOfflineData(true);
      setLoading(false);
      setRetrying(false);
    }
  }, []);

  // Fetch once on mount — useCallback deps are [] so fetchGithubData is stable
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchGithubData();
  }, [fetchGithubData]);

  // Filter to featured repos if specified, otherwise show top 4 by stars
  // Serialize featuredRepoNames to avoid re-runs when parent re-creates the array
  const featuredKey = JSON.stringify(featuredRepoNames);
  useEffect(() => {
    if (allRepos.length === 0) return;

    if (featuredRepoNames && featuredRepoNames.length > 0) {
      const featured = featuredRepoNames
        .map((name) => allRepos.find((r) => r.name === name))
        .filter(Boolean) as Repo[];
      setDisplayRepos(featured.length > 0 ? featured : allRepos.slice(0, 4));
    } else {
      setDisplayRepos(allRepos.slice(0, 4));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allRepos, featuredKey]);

  return (
    <section
      id="github"
      className="min-h-[80vh] flex flex-col justify-center px-6 md:px-16 lg:px-24 py-24 relative z-10"
    >
      <AnimatedSection animation="fadeUp">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-px bg-gradient-to-r from-purple-500 to-transparent" />
          <span className="text-xs text-purple-400 uppercase tracking-[0.2em] font-mono">
            Open Source
          </span>
        </div>
        <div className="flex items-center gap-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Open Source{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              Core
            </span>
          </h2>
        </div>
      </AnimatedSection>

      {loading && !retrying ? (
        <div className="flex flex-col justify-center items-center h-48 gap-4">
          <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
          <p className="text-xs text-gray-600 font-mono uppercase tracking-widest">
            Connecting to GitHub
          </p>
        </div>
      ) : (
        <>
          {/* Offline status banner */}
          {isOfflineData && (
            <AnimatedSection animation="fadeIn">
              <div className="flex items-center justify-between bg-amber-500/5 border border-amber-500/10 text-amber-400/80 px-5 py-3 rounded-xl text-sm mb-6">
                <div className="flex items-center gap-2">
                  <WifiOff className="w-4 h-4 flex-shrink-0" />
                  <span className="text-xs font-mono">
                    Showing offline cache (API limit reached)
                  </span>
                </div>
                <button
                  onClick={() => fetchGithubData(true)}
                  disabled={retrying}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 rounded-lg text-xs text-amber-300 hover:text-amber-200 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`w-3 h-3 ${retrying ? "animate-spin" : ""}`} />
                  {retrying ? "Retrying..." : "Retry Connection"}
                </button>
              </div>
            </AnimatedSection>
          )}

          <div className="grid sm:grid-cols-2 gap-5">
            {displayRepos.map((repo, idx) => (
              <AnimatedSection
                key={repo.id}
                animation="scaleUp"
                delay={idx * 0.1}
                className="group"
              >
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-white/[0.02] border border-white/[0.06] hover:border-purple-500/20 rounded-2xl p-6 transition-all duration-500 h-full relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors truncate">
                        {repo.name}
                      </h3>
                      <GitBranch className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                    </div>

                    <p className="text-sm text-gray-500 line-clamp-2 min-h-[40px] leading-relaxed">
                      {repo.description || "No description provided."}
                    </p>

                    <div className="flex items-center gap-5 mt-5 pt-4 border-t border-white/[0.04] text-xs text-gray-600">
                      {repo.language && (
                        <span className="flex items-center gap-1.5">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{
                              backgroundColor:
                                langColors[repo.language] || "#a855f7",
                            }}
                          />
                          {repo.language}
                        </span>
                      )}
                      <span className="flex items-center gap-1 group-hover:text-yellow-400/80 transition-colors">
                        <Star className="w-3.5 h-3.5" /> {repo.stargazers_count}
                      </span>
                      <span className="flex items-center gap-1 group-hover:text-blue-400/80 transition-colors">
                        <GitFork className="w-3.5 h-3.5" /> {repo.forks_count}
                      </span>
                    </div>
                  </div>
                </a>
              </AnimatedSection>
            ))}
          </div>
        </>
      )}

      <AnimatedSection animation="fadeUp" delay={0.4}>
        <div className="mt-12 flex items-center justify-center">
          <a
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-purple-500/20 rounded-full text-xs font-medium transition-all duration-300 text-gray-400 hover:text-white uppercase tracking-wider"
          >
            <Activity className="w-3.5 h-3.5" />
            View Full Contribution Matrix
          </a>
        </div>
      </AnimatedSection>
    </section>
  );
}
