"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, RefreshCw, Pin, Eye, EyeOff } from "lucide-react";
import SectionHeaderEditor from "@/components/admin/SectionHeaderEditor";

export interface GithubConfig {
  mode: "automatic" | "manual";
  username: string;
  sortBy: "updated" | "stars" | "name";
  displayLimit: number;
  ignoreArchived: boolean;
  ignoreForks: boolean;
  showPrivate: boolean;
  cacheDuration: number;
  overrides: RepoOverride[];
  hasToken?: boolean;
  githubToken?: string;
}

export interface RepoOverride {
  repoId: number;
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

export default function GithubDashboard() {
  const [config, setConfig] = useState<GithubConfig>(DEFAULT_CONFIG);
  const [repos, setRepos] = useState<any[]>([]);
  const [totalFound, setTotalFound] = useState(0);
  const [filteredCount, setFilteredCount] = useState(0);
  const [status, setStatus] = useState<"idle" | "loading" | "saving" | "success" | "error">("loading");

  const fetchGithub = async () => {
    setStatus("loading");
    try {
      const res = await fetch("/api/github?all=true");
      if (!res.ok) throw new Error("Failed to fetch github");
      const data = await res.json();
      
      if (data.config) {
        setConfig({ ...DEFAULT_CONFIG, ...data.config });
      }
      setRepos(data.repos || []);
      setTotalFound(data.totalFound || 0);
      setFilteredCount(data.filteredCount || 0);
      setStatus("idle");
    } catch (e) {
      console.error(e);
      setStatus("error");
    }
  };

  useEffect(() => {
    fetchGithub();
  }, []);

  const handleSave = async () => {
    setStatus("saving");
    try {
      const res = await fetch("/api/singleton/github", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
    setTimeout(() => setStatus("idle"), 3000);
  };

  const updateConfig = (key: keyof GithubConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const updateOverride = (repoId: number, field: keyof RepoOverride, value: any) => {
    setConfig(prev => {
      const existing = prev.overrides.find(o => o.repoId === repoId);
      if (existing) {
        return {
          ...prev,
          overrides: prev.overrides.map(o => o.repoId === repoId ? { ...o, [field]: value } : o)
        };
      } else {
        return {
          ...prev,
          overrides: [
            ...prev.overrides,
            {
              repoId,
              visible: field === "visible" ? value : prev.mode === "automatic",
              pinned: field === "pinned" ? value : false,
              sortOrder: field === "sortOrder" ? value : 999,
              customDescription: field === "customDescription" ? value : "",
              customCategory: field === "customCategory" ? value : "",
              customThumbnail: field === "customThumbnail" ? value : "",
            }
          ]
        };
      }
    });
    
    // Also optimistically update the repos state for instant UI feedback
    setRepos(prevRepos => prevRepos.map(repo => {
      if (repo.id === repoId) {
        return { ...repo, [field]: value };
      }
      return repo;
    }));
  };

  if (status === "loading" && repos.length === 0) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl pb-10">
      <SectionHeaderEditor sectionId="github" />
      
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">GitHub Integration</h1>
          <p className="text-gray-400 text-sm mb-4">Direct synchronization with your live GitHub account.</p>
        </div>
        <div className="flex gap-3 mt-1">
          <button
            onClick={fetchGithub}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors text-sm"
          >
            <RefreshCw className="w-4 h-4" /> Refresh API
          </button>
          <button
            onClick={handleSave}
            disabled={status === "saving"}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold rounded-xl transition-all disabled:opacity-70"
          >
            {status === "saving" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </div>
      </div>

      {/* INTEGRATION SETTINGS */}
      <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-4 mb-4">
          <h2 className="text-lg font-bold text-white">API Configuration</h2>
          {!config.hasToken && (
            <span className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
              ⚠️ GitHub token not configured. Only public repositories are available.
            </span>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div>
            <label className="block text-xs text-gray-400 mb-1">GitHub Username</label>
            <input
              type="text"
              value={config.username}
              onChange={e => updateConfig("username", e.target.value)}
              className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Personal Access Token (PAT)</label>
            <input
              type="password"
              placeholder={config.hasToken ? "•••••••••••••••• (Configured)" : "ghp_..."}
              value={config.githubToken || ""}
              onChange={e => updateConfig("githubToken", e.target.value)}
              className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50 placeholder:text-gray-600"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Display Limit</label>
            <input
              type="number"
              value={config.displayLimit}
              onChange={e => updateConfig("displayLimit", parseInt(e.target.value) || 6)}
              className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Sort By</label>
            <select
              value={config.sortBy}
              onChange={e => updateConfig("sortBy", e.target.value)}
              className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50"
            >
              <option value="updated">Recently Updated</option>
              <option value="stars">Most Stars</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-x-8 gap-y-4 mb-6 pt-4 border-t border-white/5">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={config.ignoreArchived}
              onChange={e => updateConfig("ignoreArchived", e.target.checked)}
              className="accent-purple-500 w-4 h-4"
            />
            <span className="text-sm text-gray-300">Ignore Archived</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={config.ignoreForks}
              onChange={e => updateConfig("ignoreForks", e.target.checked)}
              className="accent-purple-500 w-4 h-4"
            />
            <span className="text-sm text-gray-300">Ignore Forks</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={config.showPrivate}
              onChange={e => updateConfig("showPrivate", e.target.checked)}
              className="accent-purple-500 w-4 h-4"
            />
            <span className="text-sm text-gray-300">Include Private (requires PAT)</span>
          </label>
        </div>
      </div>

      {/* MODE SELECTOR */}
      <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white mb-4">Display Mode</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div 
            onClick={() => updateConfig("mode", "automatic")}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${config.mode === 'automatic' ? 'bg-purple-500/10 border-purple-500/50' : 'bg-black/30 border-white/5 hover:border-white/20'}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${config.mode === 'automatic' ? 'border-purple-500' : 'border-gray-500'}`}>
                {config.mode === 'automatic' && <div className="w-2 h-2 bg-purple-500 rounded-full" />}
              </div>
              <h3 className="font-semibold text-white">Automatic Mode</h3>
            </div>
            <p className="text-sm text-gray-400 ml-6">Automatically display the top {config.displayLimit} repositories matching the filters above. No manual curation required.</p>
          </div>
          
          <div 
            onClick={() => updateConfig("mode", "manual")}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${config.mode === 'manual' ? 'bg-purple-500/10 border-purple-500/50' : 'bg-black/30 border-white/5 hover:border-white/20'}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${config.mode === 'manual' ? 'border-purple-500' : 'border-gray-500'}`}>
                {config.mode === 'manual' && <div className="w-2 h-2 bg-purple-500 rounded-full" />}
              </div>
              <h3 className="font-semibold text-white">Manual Selection</h3>
            </div>
            <p className="text-sm text-gray-400 ml-6">Hand-pick exactly which repositories to display by toggling their visibility below.</p>
          </div>
        </div>
      </div>

      {/* LIVE REPOSITORIES */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Live Repositories</h2>
          <div className="text-sm text-gray-400">
            Found <strong className="text-white">{totalFound}</strong> repos ({filteredCount} matching filters)
          </div>
        </div>

        <div className="space-y-4">
          {repos.map((repo) => (
            <div key={repo.id} className={`bg-white/[0.02] border rounded-2xl p-5 transition-all ${repo.visible ? "border-white/10" : "border-white/5 opacity-60"}`}>
              <div className="flex items-start gap-4">
                <div className="flex flex-col gap-2 border-r border-white/5 pr-4 w-32">
                  <button
                    onClick={() => updateOverride(repo.id, "visible", !repo.visible)}
                    disabled={config.mode === "automatic"}
                    className={`flex items-center justify-center gap-2 py-1.5 rounded-lg text-xs transition-colors ${
                      repo.visible 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'bg-white/5 text-gray-400 border border-transparent hover:bg-white/10'
                    } ${config.mode === "automatic" ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {repo.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    {repo.visible ? "Visible" : "Hidden"}
                  </button>

                  <button
                    onClick={() => updateOverride(repo.id, "pinned", !repo.pinned)}
                    className={`flex items-center justify-center gap-2 py-1.5 rounded-lg text-xs transition-colors ${
                      repo.pinned 
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                        : 'bg-white/5 text-gray-400 border border-transparent hover:bg-white/10'
                    }`}
                  >
                    <Pin className="w-3 h-3" /> {repo.pinned ? "Pinned" : "Pin Repo"}
                  </button>

                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-gray-500">Order:</span>
                    <input 
                      type="number" 
                      value={repo.sortOrder || 999} 
                      onChange={(e) => updateOverride(repo.id, "sortOrder", parseInt(e.target.value) || 999)}
                      className="w-12 bg-black/50 border border-white/10 rounded md px-1 py-1 text-xs text-white text-center"
                    />
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg text-white font-semibold">{repo.name}</h3>
                      {repo.private && <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-gray-500/20 text-gray-400 rounded-full border border-gray-500/30">Private</span>}
                      {repo.archived && <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded-full border border-amber-500/30">Archived</span>}
                      <a href={repo.html_url} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:underline">View on GitHub</a>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-1">{repo.githubDescription || "No description on GitHub."}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Custom Description Override</label>
                      <textarea
                        value={repo.customDescription || ""}
                        onChange={(e) => updateOverride(repo.id, "customDescription", e.target.value)}
                        placeholder="Leave empty to use GitHub description..."
                        rows={2}
                        className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-purple-500/50"
                      />
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Custom Category / Tag</label>
                        <input
                          value={repo.customCategory || ""}
                          onChange={(e) => updateOverride(repo.id, "customCategory", e.target.value)}
                          placeholder={repo.githubLanguage || "e.g. Machine Learning"}
                          className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-purple-500/50"
                        />
                      </div>
                      <div className="flex gap-4 text-xs text-gray-500 pt-2">
                        <span>⭐ {repo.stargazers_count}</span>
                        <span>🍴 {repo.forks_count}</span>
                        <span>Updated: {new Date(repo.updated_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
