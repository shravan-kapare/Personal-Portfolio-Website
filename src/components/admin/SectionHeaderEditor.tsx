"use client";

import { useState, useEffect } from "react";
import { Loader2, Save, CheckCircle2 } from "lucide-react";

interface SectionHeaderEditorProps {
  sectionId: string;
}

export default function SectionHeaderEditor({ sectionId }: SectionHeaderEditorProps) {
  const [data, setData] = useState({ badge: "", name: "", subtitle: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const collections = ["skills", "projects", "education", "achievements", "certifications", "social"];
    const singletons = ["hero", "about", "github", "evolution"];

    if (collections.includes(sectionId)) {
      fetch(`/api/collection/${sectionId}`)
        .then((res) => res.json())
        .then((resData) => {
          if (resData && resData.meta) {
            setData({
              badge: resData.meta.sectionBadge || "",
              name: resData.meta.sectionTitle || "",
              subtitle: resData.meta.sectionSubtitle || "",
            });
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else if (singletons.includes(sectionId)) {
      fetch(`/api/singleton/${sectionId}`)
        .then((res) => res.json())
        .then((resData) => {
          const meta = resData.meta || resData;
          setData({
            badge: meta.sectionBadge || meta.sectionLabel || "",
            name: meta.sectionTitle || meta.sectionName || "",
            subtitle: meta.sectionSubtitle || meta.heading || "",
          });
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      fetch("/api/collection/sections")
        .then((res) => res.json())
        .then((sections) => {
          const sec = sections.find((s: any) => s.id === sectionId);
          if (sec) {
            setData({
              badge: sec.badge || "",
              name: sec.name || "",
              subtitle: sec.subtitle || "",
            });
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [sectionId]);

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    try {
      const collections = ["skills", "projects", "education", "achievements", "certifications", "social"];
      const singletons = ["hero", "about", "github", "evolution"];

      let res;
      if (collections.includes(sectionId)) {
        res = await fetch(`/api/collection/${sectionId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            meta: {
              sectionBadge: data.badge,
              sectionTitle: data.name,
              sectionSubtitle: data.subtitle,
            }
          }),
        });
      } else if (singletons.includes(sectionId)) {
        const getRes = await fetch(`/api/singleton/${sectionId}`);
        const existing = await getRes.json();
        
        let bodyToSave;
        if (sectionId === "about") {
          bodyToSave = {
            ...existing,
            sectionBadge: data.badge,
            sectionTitle: data.name,
            sectionSubtitle: data.subtitle,
          };
        } else {
          bodyToSave = {
            ...existing,
            meta: {
              sectionBadge: data.badge,
              sectionTitle: data.name,
              sectionSubtitle: data.subtitle,
            }
          };
        }

        res = await fetch(`/api/singleton/${sectionId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bodyToSave),
        });
      } else {
        res = await fetch(`/api/collection/sections/${sectionId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      }

      if (res && res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8 flex justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
      </div>
    );
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Section Headers</h2>
          <p className="text-sm text-gray-400">Manage the global title, badge, and subtitle for this section.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : success ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {success ? "Saved!" : "Save Headers"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Section Badge</label>
          <input
            type="text"
            value={data.badge}
            onChange={(e) => setData({ ...data, badge: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500 transition-colors"
            placeholder="e.g. SKILLS"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Section Title</label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500 transition-colors"
            placeholder="e.g. Skill Galaxy"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-gray-300">Section Subtitle</label>
          <input
            type="text"
            value={data.subtitle}
            onChange={(e) => setData({ ...data, subtitle: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500 transition-colors"
            placeholder="e.g. A visual map of my technical expertise"
          />
        </div>
      </div>
    </div>
  );
}
