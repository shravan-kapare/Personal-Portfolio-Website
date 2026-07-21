"use client";

import { useState, useEffect } from "react";
import { Save, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export default function SettingsDashboard() {
  const [data, setData] = useState<any>({
    portfolioTitle: "Shravan Kapare - Portfolio",
    resumeLink: "/resume.pdf",
    primaryColor: "#a855f7",
    secondaryColor: "#3b82f6",
    globalTheme: "dark",
    skillGalaxyTitle: "Skill Galaxy",
    skillGalaxySubtitle: "A visual map of my technical expertise",
    autoGenerateTimelineEvents: false,
    maxGithubRepos: 6,
    portfolioMode: "visitor-choice",
    showExperienceSelector: true,
    allowVisitorSwitching: true,
    defaultExperience: "cosmic",
    sectionVisibility: {
      home: { cosmic: true, professional: true },
      about: { cosmic: true, professional: true },
      skills: { cosmic: true, professional: true },
      projects: { cosmic: true, professional: true },
      education: { cosmic: true, professional: true },
      achievements: { cosmic: true, professional: true },
      certifications: { cosmic: true, professional: true },
      evolution: { cosmic: true, professional: true },
      github: { cosmic: true, professional: true },
      contact: { cosmic: true, professional: true }
    }
  });
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/singleton/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d && !d.error) setData((prev: any) => ({ ...prev, ...d }));
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const handleSave = async () => {
    setStatus("saving");
    try {
      const res = await fetch("/api/singleton/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
    setTimeout(() => setStatus("idle"), 3000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Global Settings</h1>
        <p className="text-gray-400 text-sm">Configure portfolio-wide settings. Color changes apply at runtime without a rebuild.</p>
      </div>

      {/* Portfolio Settings */}
      <div className="space-y-5 bg-white/[0.02] border border-white/10 rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-purple-400 uppercase tracking-widest">Portfolio</h2>
        <div>
          <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">Portfolio Title (browser tab)</label>
          <input
            value={data.portfolioTitle}
            onChange={(e) => setData((d: any) => ({ ...d, portfolioTitle: e.target.value }))}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">Resume URL</label>
          <input
            value={data.resumeLink}
            onChange={(e) => setData((d: any) => ({ ...d, resumeLink: e.target.value }))}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-colors font-mono"
          />
        </div>
      </div>

      {/* Skill Galaxy */}
      <div className="space-y-5 bg-white/[0.02] border border-white/10 rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-purple-400 uppercase tracking-widest">Skill Galaxy</h2>
        <div>
          <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">Galaxy Section Title</label>
          <input
            value={data.skillGalaxyTitle}
            onChange={(e) => setData((d: any) => ({ ...d, skillGalaxyTitle: e.target.value }))}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">Galaxy Subtitle</label>
          <input
            value={data.skillGalaxySubtitle}
            onChange={(e) => setData((d: any) => ({ ...d, skillGalaxySubtitle: e.target.value }))}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
          />
        </div>
      </div>

      {/* Theme */}
      <div className="space-y-5 bg-white/[0.02] border border-white/10 rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-purple-400 uppercase tracking-widest">Theme Colors</h2>
        <p className="text-xs text-gray-500">Changes apply via CSS variable injection — no rebuild required.</p>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-xs text-gray-400 mb-3 uppercase tracking-wider">Primary Color</label>
            <div className="flex gap-3 items-center">
              <input
                type="color"
                value={data.primaryColor}
                onChange={(e) => setData((d: any) => ({ ...d, primaryColor: e.target.value }))}
                className="w-12 h-12 rounded-xl border border-white/10 bg-transparent cursor-pointer"
              />
              <input
                value={data.primaryColor}
                onChange={(e) => setData((d: any) => ({ ...d, primaryColor: e.target.value }))}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm font-mono focus:outline-none focus:border-purple-500/50"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-3 uppercase tracking-wider">Secondary Color</label>
            <div className="flex gap-3 items-center">
              <input
                type="color"
                value={data.secondaryColor}
                onChange={(e) => setData((d: any) => ({ ...d, secondaryColor: e.target.value }))}
                className="w-12 h-12 rounded-xl border border-white/10 bg-transparent cursor-pointer"
              />
              <input
                value={data.secondaryColor}
                onChange={(e) => setData((d: any) => ({ ...d, secondaryColor: e.target.value }))}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm font-mono focus:outline-none focus:border-purple-500/50"
              />
            </div>
          </div>
        </div>
        {/* Live Preview */}
        <div className="rounded-xl p-4 border border-white/10 bg-white/[0.02] flex gap-4 items-center">
          <div className="w-8 h-8 rounded-full" style={{ background: data.primaryColor, boxShadow: `0 0 15px ${data.primaryColor}60` }} />
          <div className="w-8 h-8 rounded-full" style={{ background: data.secondaryColor, boxShadow: `0 0 15px ${data.secondaryColor}60` }} />
          <span className="text-xs text-gray-500 ml-2">Live color preview</span>
          <div className="ml-auto px-4 py-1.5 rounded-full text-xs font-medium text-white" style={{ background: `linear-gradient(135deg, ${data.primaryColor}, ${data.secondaryColor})` }}>
            Gradient Preview
          </div>
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="space-y-5 bg-white/[0.02] border border-white/10 rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-purple-400 uppercase tracking-widest">Advanced Features</h2>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-white text-sm font-medium">Auto Generate Timeline Events</div>
            <div className="text-gray-500 text-xs mt-1">Automatically create Knowledge Evolution timeline entries when adding new skills.</div>
          </div>
          <button
            onClick={() => setData((d: any) => ({ ...d, autoGenerateTimelineEvents: !d.autoGenerateTimelineEvents }))}
            className={`w-12 h-6 rounded-full transition-colors relative ${data.autoGenerateTimelineEvents ? 'bg-purple-500' : 'bg-gray-700'}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${data.autoGenerateTimelineEvents ? 'left-7' : 'left-1'}`} />
          </button>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div>
            <div className="text-white text-sm font-medium">Max Open Source Repositories</div>
            <div className="text-gray-500 text-xs mt-1">Maximum number of GitHub repositories to show in the Open Source Core section.</div>
          </div>
          <input
            type="number"
            min="1"
            max="30"
            value={data.maxGithubRepos || 6}
            onChange={(e) => setData((d: any) => ({ ...d, maxGithubRepos: parseInt(e.target.value) || 6 }))}
            className="w-20 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500/50 text-center"
          />
        </div>
      </div>

      {/* Portfolio Experience Settings */}
      <div className="space-y-5 bg-white/[0.02] border border-white/10 rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-purple-400 uppercase tracking-widest">Portfolio Experience Settings</h2>
        
        <div>
          <label className="block text-xs text-gray-400 mb-3 uppercase tracking-wider">Portfolio Mode</label>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
              <input
                type="radio"
                name="portfolioMode"
                value="cosmic"
                checked={data.portfolioMode === "cosmic"}
                onChange={(e) => setData({ ...data, portfolioMode: e.target.value })}
                className="accent-purple-500"
              />
              Cosmic Only
            </label>
            <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
              <input
                type="radio"
                name="portfolioMode"
                value="professional"
                checked={data.portfolioMode === "professional"}
                onChange={(e) => setData({ ...data, portfolioMode: e.target.value })}
                className="accent-purple-500"
              />
              Professional Only
            </label>
            <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
              <input
                type="radio"
                name="portfolioMode"
                value="visitor-choice"
                checked={data.portfolioMode === "visitor-choice"}
                onChange={(e) => setData({ ...data, portfolioMode: e.target.value })}
                className="accent-purple-500"
              />
              Let Visitor Choose
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div>
            <div className="text-white text-sm font-medium">Show Experience Selector</div>
            <div className="text-gray-500 text-xs mt-1">If enabled, visitors will see an option screen on entry.</div>
          </div>
          <button
            onClick={() => setData({ ...data, showExperienceSelector: !data.showExperienceSelector })}
            className={`w-12 h-6 rounded-full transition-colors relative ${data.showExperienceSelector ? 'bg-purple-500' : 'bg-gray-700'}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${data.showExperienceSelector ? 'left-7' : 'left-1'}`} />
          </button>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div>
            <div className="text-white text-sm font-medium">Allow Visitor Switching</div>
            <div className="text-gray-500 text-xs mt-1">Allow visitors to toggle themes from the navbar switcher.</div>
          </div>
          <button
            onClick={() => setData({ ...data, allowVisitorSwitching: !data.allowVisitorSwitching })}
            className={`w-12 h-6 rounded-full transition-colors relative ${data.allowVisitorSwitching ? 'bg-purple-500' : 'bg-gray-700'}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${data.allowVisitorSwitching ? 'left-7' : 'left-1'}`} />
          </button>
        </div>

        <div className="pt-4 border-t border-white/5">
          <label className="block text-xs text-gray-400 mb-3 uppercase tracking-wider">Default Experience</label>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
              <input
                type="radio"
                name="defaultExperience"
                value="cosmic"
                checked={data.defaultExperience === "cosmic"}
                onChange={(e) => setData({ ...data, defaultExperience: e.target.value })}
                className="accent-purple-500"
              />
              Cosmic
            </label>
            <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
              <input
                type="radio"
                name="defaultExperience"
                value="professional"
                checked={data.defaultExperience === "professional"}
                onChange={(e) => setData({ ...data, defaultExperience: e.target.value })}
                className="accent-purple-500"
              />
              Professional
            </label>
          </div>
        </div>
      </div>

      {/* Section Theme Visibility */}
      <div className="space-y-5 bg-white/[0.02] border border-white/10 rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-purple-400 uppercase tracking-widest">Theme Content Visibility</h2>
        <p className="text-xs text-gray-500">Toggle section visibility for Cosmic and Professional experiences.</p>
        
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-4 pb-2 border-b border-white/10 text-xs text-gray-400 uppercase font-mono">
            <div>Section</div>
            <div className="text-center">Cosmic Theme</div>
            <div className="text-center">Professional Theme</div>
          </div>

          {[
            { key: "home", label: "Home" },
            { key: "about", label: "About Me" },
            { key: "skills", label: "Skill Galaxy / Skills Grid" },
            { key: "projects", label: "Featured Work" },
            { key: "education", label: "Academic Journey" },
            { key: "achievements", label: "Milestones / Achievements" },
            { key: "certifications", label: "Certifications" },
            { key: "evolution", label: "Knowledge Evolution / Timeline" },
            { key: "github", label: "Open Source Core / GitHub" },
            { key: "contact", label: "Let's Connect" },
          ].map((sec) => {
            const visibility = data.sectionVisibility?.[sec.key] || { cosmic: true, professional: true };
            const updateVisibility = (theme: "cosmic" | "professional", val: boolean) => {
              setData({
                ...data,
                sectionVisibility: {
                  ...data.sectionVisibility,
                  [sec.key]: {
                    ...visibility,
                    [theme]: val
                  }
                }
              });
            };

            return (
              <div key={sec.key} className="grid grid-cols-3 gap-4 items-center py-1 text-sm border-b border-white/5">
                <div className="text-white font-medium">{sec.label}</div>
                <div className="flex justify-center">
                  <input
                    type="checkbox"
                    checked={visibility.cosmic}
                    onChange={(e) => updateVisibility("cosmic", e.target.checked)}
                    className="w-4 h-4 rounded border-white/10 bg-white/5 accent-purple-500 cursor-pointer"
                  />
                </div>
                <div className="flex justify-center">
                  <input
                    type="checkbox"
                    checked={visibility.professional}
                    onChange={(e) => updateVisibility("professional", e.target.checked)}
                    className="w-4 h-4 rounded border-white/10 bg-white/5 accent-purple-500 cursor-pointer"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={status === "saving"}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {status === "saving" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {status === "saving" ? "Saving..." : "Save Settings"}
        </button>
        {status === "success" && <span className="flex items-center gap-1.5 text-green-400 text-sm"><CheckCircle2 className="w-4 h-4" /> Settings saved</span>}
        {status === "error" && <span className="flex items-center gap-1.5 text-red-400 text-sm"><AlertCircle className="w-4 h-4" /> Failed to save</span>}
      </div>
    </div>
  );
}
