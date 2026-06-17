"use client";

import { useState, useEffect, useCallback } from "react";
import { Star, GitBranch, GitFork, Loader2, RefreshCw, Check, X } from "lucide-react";

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
};

export default function GithubReposAdmin() {
  const [allRepos, setAllRepos] = useState<Repo[]>([]);
  const [featured, setFeatured] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRepos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [reposRes, featuredRes] = await Promise.all([
        fetch("/api/github"),
        fetch("/api/singleton/githubFeatured"),
      ]);

      const reposData = await reposRes.json();
      setAllRepos(reposData.repos || []);

      if (featuredRes.ok) {
        const featuredData = await featuredRes.json();
        setFeatured(featuredData.repos || []);
      }
    } catch (err) {
      setError("Failed to load repositories.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRepos();
  }, [fetchRepos]);

  const toggleFeatured = (repoName: string) => {
    setFeatured((prev) =>
      prev.includes(repoName)
        ? prev.filter((r) => r !== repoName)
        : [...prev, repoName]
    );
    setSaved(false);
  };

  const saveSelection = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/singleton/githubFeatured", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repos: featured }),
      });
      if (!res.ok) throw new Error("Save failed");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert("Failed to save selection.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">GitHub — Featured Repos</h1>
          <p className="text-gray-500 text-sm mt-1">
            Select up to 4 repositories to feature on the public portfolio.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchRepos}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 text-sm text-gray-300 transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button
            onClick={saveSelection}
            disabled={saving}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-60 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : saved ? (
              <Check className="w-4 h-4" />
            ) : null}
            {saved ? "Saved!" : saving ? "Saving..." : "Save Selection"}
          </button>
        </div>
      </div>

      {/* Selected count badge */}
      <div className="mb-6 flex items-center gap-2">
        <span className="text-sm text-gray-400">
          {featured.length} repo{featured.length !== 1 ? "s" : ""} selected
        </span>
        {featured.length > 4 && (
          <span className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
            ⚠ Only first 4 will be shown
          </span>
        )}
        {featured.length > 0 && (
          <button
            onClick={() => {
              setFeatured([]);
              setSaved(false);
            }}
            className="text-xs text-gray-500 hover:text-gray-300 underline transition-colors ml-2"
          >
            Clear all
          </button>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-3 text-gray-400">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading repositories...
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {allRepos.map((repo) => {
            const isFeatured = featured.includes(repo.name);
            return (
              <button
                key={repo.id}
                onClick={() => toggleFeatured(repo.name)}
                className={`text-left p-5 rounded-2xl border transition-all duration-300 ${
                  isFeatured
                    ? "border-purple-500/40 bg-purple-500/10 shadow-[0_0_20px_rgba(168,85,247,0.1)]"
                    : "border-white/[0.06] bg-white/[0.02] hover:border-white/10"
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <GitBranch className={`w-4 h-4 flex-shrink-0 ${isFeatured ? "text-purple-400" : "text-gray-600"}`} />
                    <h3 className={`font-semibold text-sm ${isFeatured ? "text-purple-200" : "text-white"}`}>
                      {repo.name}
                    </h3>
                  </div>
                  {isFeatured && (
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                  {repo.description || "No description"}
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-600">
                  {repo.language && (
                    <span className="flex items-center gap-1.5">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: langColors[repo.language] || "#a855f7" }}
                      />
                      {repo.language}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3" /> {repo.stargazers_count}
                  </span>
                  <span className="flex items-center gap-1">
                    <GitFork className="w-3 h-3" /> {repo.forks_count}
                  </span>
                </div>
              </button>
            );
          })}
          {allRepos.length === 0 && (
            <div className="col-span-2 p-8 text-center text-gray-500">
              No repositories found from GitHub API.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
