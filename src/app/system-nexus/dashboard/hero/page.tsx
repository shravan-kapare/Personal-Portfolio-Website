"use client";

import { useState, useEffect } from "react";
import { Save, Plus, Trash2, GripVertical, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export default function HeroDashboard() {
  const [data, setData] = useState({
    portfolioLabel: "Portfolio",
    portfolioYear: "2026",
    mainName: "Shravan\nKapare.",
    subtitle: "Architecting the Future",
    tags: ["AR Developer", "ML Enthusiast", "IoT Innovator"],
    description: "",
  });
  const [newTag, setNewTag] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/singleton/hero")
      .then((r) => r.json())
      .then((d) => {
        if (d && !d.error) setData((prev) => ({ ...prev, ...d }));
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const handleSave = async () => {
    setStatus("saving");
    try {
      const res = await fetch("/api/singleton/hero", {
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

  const addTag = () => {
    const trimmed = newTag.trim();
    if (trimmed && !data.tags.includes(trimmed)) {
      setData((d) => ({ ...d, tags: [...d.tags, trimmed] }));
      setNewTag("");
    }
  };

  const removeTag = (tag: string) => {
    setData((d) => ({ ...d, tags: d.tags.filter((t) => t !== tag) }));
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
        <h1 className="text-3xl font-bold text-white mb-1">Hero Section</h1>
        <p className="text-gray-400 text-sm">Manage the content displayed in the hero / landing section.</p>
      </div>

      <div className="space-y-6 bg-white/[0.02] border border-white/10 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-purple-400 uppercase tracking-widest text-sm">Labels</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">Portfolio Label</label>
            <input
              value={data.portfolioLabel}
              onChange={(e) => setData((d) => ({ ...d, portfolioLabel: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">Portfolio Year</label>
            <input
              value={data.portfolioYear}
              onChange={(e) => setData((d) => ({ ...d, portfolioYear: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">Main Name (use \n for line break)</label>
          <input
            value={data.mainName}
            onChange={(e) => setData((d) => ({ ...d, mainName: e.target.value }))}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-colors font-mono"
            placeholder="e.g. Shravan\nKapare."
          />
          <p className="text-xs text-gray-600 mt-1">Line 1 appears white. Line 2 appears in purple/blue gradient.</p>
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider">Subtitle / Typewriter Text</label>
          <input
            value={data.subtitle}
            onChange={(e) => setData((d) => ({ ...d, subtitle: e.target.value }))}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
          />
        </div>
      </div>

      <div className="space-y-4 bg-white/[0.02] border border-white/10 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-purple-400 uppercase tracking-widest text-sm">Hero Tags</h2>
        <div className="flex flex-col gap-3">
          {data.tags.map((tag, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (idx === 0) return;
                  const newTags = [...data.tags];
                  [newTags[idx - 1], newTags[idx]] = [newTags[idx], newTags[idx - 1]];
                  setData((d) => ({ ...d, tags: newTags }));
                }}
                disabled={idx === 0}
                className="text-gray-500 hover:text-white disabled:opacity-30 transition-colors"
              >
                ▲
              </button>
              <button
                onClick={() => {
                  if (idx === data.tags.length - 1) return;
                  const newTags = [...data.tags];
                  [newTags[idx], newTags[idx + 1]] = [newTags[idx + 1], newTags[idx]];
                  setData((d) => ({ ...d, tags: newTags }));
                }}
                disabled={idx === data.tags.length - 1}
                className="text-gray-500 hover:text-white disabled:opacity-30 transition-colors"
              >
                ▼
              </button>
              <input
                value={tag}
                onChange={(e) => {
                  const newTags = [...data.tags];
                  newTags[idx] = e.target.value;
                  setData((d) => ({ ...d, tags: newTags }));
                }}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
              />
              <button onClick={() => removeTag(tag)} className="p-2 text-purple-400 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-4 pt-4 border-t border-white/10">
          <input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTag()}
            placeholder="Add new tag..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
          />
          <button
            onClick={addTag}
            className="flex items-center gap-2 px-4 py-2.5 bg-purple-600/30 border border-purple-500/30 rounded-xl text-purple-300 hover:bg-purple-600/50 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={status === "saving"}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {status === "saving" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {status === "saving" ? "Saving..." : "Save Changes"}
        </button>
        {status === "success" && <span className="flex items-center gap-1.5 text-green-400 text-sm"><CheckCircle2 className="w-4 h-4" /> Saved successfully</span>}
        {status === "error" && <span className="flex items-center gap-1.5 text-red-400 text-sm"><AlertCircle className="w-4 h-4" /> Failed to save</span>}
      </div>
    </div>
  );
}
