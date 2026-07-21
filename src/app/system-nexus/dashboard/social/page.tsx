"use client";

import { useState, useEffect } from "react";
import { Save, Plus, Trash2, Eye, EyeOff, CheckCircle2, AlertCircle, Loader2, GripVertical } from "lucide-react";
import SectionHeaderEditor from "@/components/admin/SectionHeaderEditor";

import { parseCollectionData } from "@/lib/cms-utils";

const PLATFORM_OPTIONS = [
  "GitHub", "LinkedIn", "Email", "Instagram", "LeetCode",
  "GeeksforGeeks", "X/Twitter", "YouTube", "Discord", "Portfolio Website",
];

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  visible: boolean;
  order: number;
}

export default function SocialDashboard() {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [settings, setSettings] = useState({ resumeLink: "", connectHeading: "" });
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [isLoading, setIsLoading] = useState(true);
  const [newLink, setNewLink] = useState({ platform: "GitHub", url: "" });
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/collection/social").then((r) => r.json()),
      fetch("/api/singleton/settings").then((r) => r.json())
    ])
      .then(([socialData, settingsData]) => {
        try {
          const parsedLinks = parseCollectionData(socialData);
          setLinks(parsedLinks.sort((a: any, b: any) => (a.order ?? 99) - (b.order ?? 99)));
        } catch (e: any) {
          console.error("Failed to parse social data:", e);
          setFetchError(e.message || "Failed to parse social links.");
        }
        
        if (settingsData && !settingsData.error) {
          setSettings({
            resumeLink: settingsData.resumeLink || "",
            connectHeading: settingsData.connectHeading || "Let's Connect"
          });
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const handleSave = async () => {
    setStatus("saving");
    try {
      // Save links
      await fetch("/api/collection/social/bulk", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(links),
      });
      // Save settings
      const currentSettings = await fetch("/api/singleton/settings").then(r => r.json());
      await fetch("/api/singleton/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...currentSettings, ...settings }),
      });
      setStatus("success");
    } catch {
      setStatus("error");
    }
    setTimeout(() => setStatus("idle"), 3000);
  };

  const addLink = () => {
    if (!newLink.url.trim()) return;
    const entry: SocialLink = {
      id: crypto.randomUUID(),
      platform: newLink.platform,
      url: newLink.url.trim(),
      visible: true,
      order: links.length + 1,
    };
    setLinks((l) => [...l, entry]);
    setNewLink({ platform: "GitHub", url: "" });
  };

  const removeLink = (id: string) => setLinks((l) => l.filter((x) => x.id !== id));

  const toggleVisibility = (id: string) =>
    setLinks((l) => l.map((x) => x.id === id ? { ...x, visible: !x.visible } : x));

  const updateUrl = (id: string, url: string) =>
    setLinks((l) => l.map((x) => x.id === id ? { ...x, url } : x));

  const moveUp = (idx: number) => {
    if (idx === 0) return;
    const updated = [...links];
    [updated[idx - 1], updated[idx]] = [updated[idx], updated[idx - 1]];
    setLinks(updated.map((x, i) => ({ ...x, order: i + 1 })));
  };

  const moveDown = (idx: number) => {
    if (idx === links.length - 1) return;
    const updated = [...links];
    [updated[idx], updated[idx + 1]] = [updated[idx + 1], updated[idx]];
    setLinks(updated.map((x, i) => ({ ...x, order: i + 1 })));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl pb-10">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Contact & Connect Configuration</h1>
        <p className="text-gray-400 text-sm">
          Manage the Contact section details, resume link, and your social accounts.
        </p>
      </div>

      {fetchError && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="font-medium text-sm">Data Synchronization Error</p>
            <p className="text-xs opacity-80 mt-1">{fetchError}</p>
          </div>
        </div>
      )}

      <SectionHeaderEditor sectionId="social" />

      {/* Global Contact Settings */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-6">Contact Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Connect Heading</label>
            <input
              type="text"
              value={settings.connectHeading}
              onChange={(e) => setSettings({ ...settings, connectHeading: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Resume Link URL</label>
            <input
              type="text"
              value={settings.resumeLink}
              onChange={(e) => setSettings({ ...settings, resumeLink: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end">
          <button
            onClick={handleSave}
            disabled={status === "saving"}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            {status === "saving" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Settings
          </button>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-6">Social Links</h2>
        <div className="space-y-3 mb-8">
          {links.map((link, idx) => (
            <div
              key={link.id}
              className={`flex items-center gap-3 bg-white/[0.02] border rounded-2xl px-4 py-3 transition-all ${
                link.visible ? "border-white/10" : "border-white/5 opacity-50"
              }`}
            >
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => moveUp(idx)}
                  disabled={idx === 0}
                  className="p-0.5 text-gray-600 hover:text-gray-300 disabled:opacity-30 transition-colors"
                  title="Move up"
                >
                  ▲
                </button>
                <button
                  onClick={() => moveDown(idx)}
                  disabled={idx === links.length - 1}
                  className="p-0.5 text-gray-600 hover:text-gray-300 disabled:opacity-30 transition-colors"
                  title="Move down"
                >
                  ▼
                </button>
              </div>
              <div className="w-32 text-sm font-medium text-purple-300 flex-shrink-0">{link.platform}</div>
              <input
                value={link.url}
                onChange={(e) => updateUrl(link.id, e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs font-mono focus:outline-none focus:border-purple-500/50 transition-colors"
              />
              <button
                onClick={() => toggleVisibility(link.id)}
                className={`p-2 rounded-lg transition-colors ${
                  link.visible ? "text-green-400 hover:bg-green-400/10" : "text-gray-600 hover:bg-white/5"
                }`}
                title={link.visible ? "Hide" : "Show"}
              >
                {link.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <button
                onClick={() => removeLink(link.id)}
                className="p-2 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-400/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {links.length === 0 && (
            <div className="text-center py-10 text-gray-600 text-sm border border-dashed border-white/10 rounded-2xl">
              No social links configured. Add one below.
            </div>
          )}
        </div>
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-purple-400 uppercase tracking-widest">Add New Link</h2>
          <div className="flex gap-3 flex-wrap">
            <select
              value={newLink.platform}
              onChange={(e) => setNewLink((l) => ({ ...l, platform: e.target.value }))}
              className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
            >
              {PLATFORM_OPTIONS.map((p) => (
                <option key={p} value={p} className="bg-gray-900">{p}</option>
              ))}
            </select>
            <input
              value={newLink.url}
              onChange={(e) => setNewLink((l) => ({ ...l, url: e.target.value }))}
              onKeyDown={(e) => e.key === "Enter" && addLink()}
              placeholder="https://..."
              className="flex-1 min-w-[200px] bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm font-mono focus:outline-none focus:border-purple-500/50 transition-colors"
            />
            <button
              onClick={addLink}
              className="flex items-center gap-2 px-4 py-2.5 bg-purple-600/30 border border-purple-500/30 rounded-xl text-purple-300 hover:bg-purple-600/50 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
        </div>
        <div className="mt-8 flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={status === "saving"}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {status === "saving" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {status === "saving" ? "Saving..." : "Save All Changes"}
          </button>
          {status === "success" && <span className="flex items-center gap-1.5 text-green-400 text-sm"><CheckCircle2 className="w-4 h-4" /> Saved successfully</span>}
          {status === "error" && <span className="flex items-center gap-1.5 text-red-400 text-sm"><AlertCircle className="w-4 h-4" /> Failed to save</span>}
        </div>
      </div>
    </div>
  );
}
