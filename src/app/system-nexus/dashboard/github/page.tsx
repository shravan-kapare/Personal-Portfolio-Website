"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, RefreshCw, Pin } from "lucide-react";

export interface GithubRepoOverride {
  id: string; // the node ID from Github or name
  name: string;
  status: "Featured" | "Normal" | "Archived" | "Hidden";
  pinned: boolean;
  sortOrder: number;
  customDescription: string;
  customCategory: string;
  customThumbnail: string;
}

export default function GithubDashboard() {
  const [repos, setRepos] = useState<any[]>([]);
  const [overrides, setOverrides] = useState<Record<string, GithubRepoOverride>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "saving" | "success" | "error">("loading");
  
  const fetchGithub = async () => {
    setStatus("loading");
    try {
      const res = await fetch("/api/github?all=true");
      if (!res.ok) throw new Error("Failed to fetch github");
      const { repos: githubData } = await res.json();
      
      const overridesRes = await fetch("/api/singleton/github");
      const overridesData = await overridesRes.json().catch(() => ({ repos: [] }));
      const ovList: GithubRepoOverride[] = overridesData.repos || [];
      const ovMap = ovList.reduce((acc, curr) => ({ ...acc, [curr.name]: curr }), {} as Record<string, GithubRepoOverride>);
      
      // Auto-detect new repos
      githubData.forEach((repo: any) => {
        if (!ovMap[repo.name]) {
          ovMap[repo.name] = {
            id: repo.node_id || repo.id?.toString(),
            name: repo.name,
            status: "Hidden", // Default state for new repos
            pinned: false,
            sortOrder: 999,
            customDescription: "",
            customCategory: "",
            customThumbnail: "",
          };
        }
      });
      
      setRepos(githubData);
      setOverrides(ovMap);
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
      const reposArray = Object.values(overrides);
      const res = await fetch("/api/singleton/github", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repos: reposArray }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
    setTimeout(() => setStatus("idle"), 3000);
  };

  const updateOverride = (name: string, field: keyof GithubRepoOverride, value: any) => {
    setOverrides(prev => ({
      ...prev,
      [name]: { ...prev[name], [field]: value }
    }));
  };

  const toggleStatus = (name: string, newStatus: "Featured" | "Normal" | "Archived" | "Hidden") => {
    updateOverride(name, "status", newStatus);
  };

  if (status === "loading" && repos.length === 0) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
      </div>
    );
  }

  // Sort logic for the CMS display
  const sortedRepos = [...repos].sort((a, b) => {
    const ovA = overrides[a.name];
    const ovB = overrides[b.name];
    if (ovA?.pinned !== ovB?.pinned) return ovA?.pinned ? -1 : 1;
    if (ovA?.status === "Featured" && ovB?.status !== "Featured") return -1;
    if (ovA?.status !== "Featured" && ovB?.status === "Featured") return 1;
    return (ovA?.sortOrder || 999) - (ovB?.sortOrder || 999);
  });

  return (
    <div className="space-y-8 max-w-6xl pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Open Source Core</h1>
          <p className="text-gray-400 text-sm">Manage visibility, features, and descriptions for your GitHub repositories.</p>
        </div>
        <div className="flex gap-3">
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

      <div className="space-y-4">
        {sortedRepos.map(repo => {
          const ov = overrides[repo.name] || {};
          return (
            <div key={repo.id} className={`bg-white/[0.02] border rounded-2xl p-5 transition-all ${ov.status !== "Hidden" ? "border-white/10" : "border-white/5 opacity-60"}`}>
              <div className="flex items-start gap-4">
                <div className="flex flex-col gap-2 border-r border-white/5 pr-4 w-32">
                  <span className="text-xs text-gray-500 uppercase font-mono">Status</span>
                  <select 
                    value={ov.status}
                    onChange={(e) => toggleStatus(repo.name, e.target.value as any)}
                    className="bg-black/50 border border-white/10 rounded-lg text-sm text-white px-2 py-1.5 focus:outline-none focus:border-purple-500"
                  >
                    <option value="Featured">Featured</option>
                    <option value="Normal">Normal</option>
                    <option value="Archived">Archived</option>
                    <option value="Hidden">Hidden</option>
                  </select>

                  <button
                    onClick={() => updateOverride(repo.name, "pinned", !ov.pinned)}
                    className={`flex items-center justify-center gap-2 py-1.5 rounded-lg text-xs transition-colors ${ov.pinned ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-white/5 text-gray-400 border border-transparent'}`}
                  >
                    <Pin className="w-3 h-3" /> {ov.pinned ? "Pinned" : "Pin Repo"}
                  </button>

                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-gray-500">Order:</span>
                    <input 
                      type="number" 
                      value={ov.sortOrder} 
                      onChange={(e) => updateOverride(repo.name, "sortOrder", parseInt(e.target.value) || 0)}
                      className="w-12 bg-black/50 border border-white/10 rounded md px-1 py-1 text-xs text-white text-center"
                    />
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg text-white font-semibold">{repo.name}</h3>
                      <a href={repo.html_url} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:underline">View on GitHub</a>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-1">{repo.description || "No description on GitHub."}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Custom Description Override</label>
                      <textarea
                        value={ov.customDescription || ""}
                        onChange={(e) => updateOverride(repo.name, "customDescription", e.target.value)}
                        placeholder="Leave empty to use GitHub description..."
                        rows={2}
                        className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-purple-500/50"
                      />
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Custom Category / Tag</label>
                        <input
                          value={ov.customCategory || ""}
                          onChange={(e) => updateOverride(repo.name, "customCategory", e.target.value)}
                          placeholder="e.g. Machine Learning"
                          className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-purple-500/50"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Custom Thumbnail URL</label>
                        <input
                          value={ov.customThumbnail || ""}
                          onChange={(e) => updateOverride(repo.name, "customThumbnail", e.target.value)}
                          placeholder="https://..."
                          className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-purple-500/50"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
