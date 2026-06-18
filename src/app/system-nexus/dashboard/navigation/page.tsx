"use client";

import { useState, useEffect } from "react";
import { Save, Eye, EyeOff, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface Section {
  id: string;
  name: string;
  href: string;
  enabled: boolean;
  custom: boolean;
  navVisible: boolean;
  content: string;
}

export default function SectionManagerDashboard() {
  const [sections, setSections] = useState<Section[]>([]);
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/collection/sections")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d)) setSections(d);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const handleSave = async () => {
    setStatus("saving");
    try {
      const res = await fetch("/api/collection/sections/bulk", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sections),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
    setTimeout(() => setStatus("idle"), 3000);
  };

  const toggleVisibility = (id: string) => {
    if (id === "home") return; // Home cannot be hidden
    setSections((s) => s.map((x) => x.id === id ? { ...x, enabled: !x.enabled } : x));
  };

  const toggleNavVisibility = (id: string) => {
    setSections((s) => s.map((x) => x.id === id ? { ...x, navVisible: !x.navVisible } : x));
  };

  const moveUp = (idx: number) => {
    if (idx === 0) return;
    const updated = [...sections];
    [updated[idx - 1], updated[idx]] = [updated[idx], updated[idx - 1]];
    setSections(updated);
  };

  const moveDown = (idx: number) => {
    if (idx === sections.length - 1) return;
    const updated = [...sections];
    [updated[idx], updated[idx + 1]] = [updated[idx + 1], updated[idx]];
    setSections(updated);
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
        <h1 className="text-3xl font-bold text-white mb-1">Section Manager</h1>
        <p className="text-gray-400 text-sm">
          Reorder and toggle visibility for all portfolio sections. Changes apply immediately.
        </p>
      </div>

      <div className="space-y-3">
        {sections.map((section, idx) => (
          <div
            key={section.id}
            className={`flex items-center justify-between bg-white/[0.02] border rounded-2xl px-6 py-4 transition-all ${
              section.enabled ? "border-white/10" : "border-white/5 opacity-50"
            }`}
          >
            <div className="flex items-center gap-6">
              {/* Reorder buttons */}
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => moveUp(idx)}
                  disabled={idx === 0}
                  className="p-1 text-gray-600 hover:text-gray-300 disabled:opacity-30 transition-colors"
                  title="Move up"
                >
                  ▲
                </button>
                <button
                  onClick={() => moveDown(idx)}
                  disabled={idx === sections.length - 1}
                  className="p-1 text-gray-600 hover:text-gray-300 disabled:opacity-30 transition-colors"
                  title="Move down"
                >
                  ▼
                </button>
              </div>

              <div>
                <div className="text-base font-semibold text-white">{section.name}</div>
                <div className="text-xs text-purple-400 font-mono mt-1">ID: {section.id}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleNavVisibility(section.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                  section.navVisible !== false
                    ? "border-blue-500/50 bg-blue-500/10 text-blue-400"
                    : "border-white/10 bg-white/5 text-gray-500"
                }`}
              >
                Navbar: {section.navVisible !== false ? "Visible" : "Hidden"}
              </button>

              <button
                onClick={() => toggleVisibility(section.id)}
                disabled={section.id === "home"}
                className={`p-2.5 rounded-xl transition-colors ${
                  section.id === "home" ? "opacity-50 cursor-not-allowed" : ""
                } ${
                  section.enabled
                    ? "text-green-400 hover:bg-green-400/10"
                    : "text-gray-600 hover:bg-white/5"
                }`}
                title={section.enabled ? "Hide Section" : "Show Section"}
              >
                {section.enabled ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={status === "saving"}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {status === "saving" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {status === "saving" ? "Saving..." : "Save Layout Order"}
        </button>
        {status === "success" && <span className="flex items-center gap-1.5 text-green-400 text-sm"><CheckCircle2 className="w-4 h-4" /> Layout saved successfully</span>}
        {status === "error" && <span className="flex items-center gap-1.5 text-red-400 text-sm"><AlertCircle className="w-4 h-4" /> Failed to save layout</span>}
      </div>
    </div>
  );
}
