"use client";

import { useState, useEffect } from "react";
import { Save, Plus, Trash2, Eye, EyeOff, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import SectionHeaderEditor from "@/components/admin/SectionHeaderEditor";

interface TimelineEntry {
  id: string;
  title: string;
  description: string;
  date: string;
  icon: string;
  category: string;
  color: string;
  visible: boolean;
  order: number;
}

interface EvolutionData {
  sectionLabel: string;
  sectionTitle: string;
  sectionSubtitle: string;
  timelineEntries: TimelineEntry[];
}

export default function EvolutionDashboard() {
  const [data, setData] = useState<EvolutionData>({
    sectionLabel: "Journey",
    sectionTitle: "Knowledge Evolution",
    sectionSubtitle: "",
    timelineEntries: [],
  });
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/singleton/evolution")
      .then((r) => r.json())
      .then((d) => {
        if (d && !d.error) {
          setData({
            ...d,
            timelineEntries: d.timelineEntries?.sort((a: any, b: any) => a.order - b.order) || [],
          });
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const handleSave = async () => {
    setStatus("saving");
    try {
      const res = await fetch("/api/singleton/evolution", {
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

  const addEntry = () => {
    const newEntry: TimelineEntry = {
      id: crypto.randomUUID(),
      title: "New Event",
      description: "Event description",
      date: new Date().getFullYear().toString(),
      icon: "Code",
      category: "Milestone",
      color: "blue",
      visible: true,
      order: data.timelineEntries.length,
    };
    setData((d) => ({ ...d, timelineEntries: [newEntry, ...d.timelineEntries].map((e, i) => ({ ...e, order: i })) }));
  };

  const updateEntry = (id: string, field: keyof TimelineEntry, value: any) => {
    setData((d) => ({
      ...d,
      timelineEntries: d.timelineEntries.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    }));
  };

  const removeEntry = (id: string) => {
    setData((d) => ({
      ...d,
      timelineEntries: d.timelineEntries.filter((e) => e.id !== id).map((e, i) => ({ ...e, order: i })),
    }));
  };

  const moveUp = (idx: number) => {
    if (idx === 0) return;
    setData((d) => {
      const arr = [...d.timelineEntries];
      [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
      return { ...d, timelineEntries: arr.map((e, i) => ({ ...e, order: i })) };
    });
  };

  const moveDown = (idx: number) => {
    setData((d) => {
      const arr = [...d.timelineEntries];
      if (idx === arr.length - 1) return d;
      [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
      return { ...d, timelineEntries: arr.map((e, i) => ({ ...e, order: i })) };
    });
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
      <SectionHeaderEditor sectionId="evolution" />

      {/* Timeline Entries */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-purple-400 uppercase tracking-widest">Timeline Entries</h2>
          <button
            onClick={addEntry}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600/30 border border-purple-500/30 rounded-xl text-purple-300 hover:bg-purple-600/50 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" /> Add Event
          </button>
        </div>

        {data.timelineEntries.map((entry, idx) => (
          <div
            key={entry.id}
            className={`flex gap-4 bg-white/[0.02] border rounded-2xl p-5 transition-all ${
              entry.visible ? "border-white/10" : "border-white/5 opacity-60"
            }`}
          >
            <div className="flex flex-col gap-1 pt-1">
              <button onClick={() => moveUp(idx)} disabled={idx === 0} className="text-gray-600 hover:text-white disabled:opacity-30">▲</button>
              <button onClick={() => moveDown(idx)} disabled={idx === data.timelineEntries.length - 1} className="text-gray-600 hover:text-white disabled:opacity-30">▼</button>
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <input
                    value={entry.title}
                    onChange={(e) => updateEntry(entry.id, "title", e.target.value)}
                    placeholder="Event Title"
                    className="w-full bg-transparent border-b border-white/10 px-2 py-1 text-white font-medium focus:outline-none focus:border-purple-500/50"
                  />
                </div>
                <div className="w-32">
                  <input
                    value={entry.date}
                    onChange={(e) => updateEntry(entry.id, "date", e.target.value)}
                    placeholder="Date/Year"
                    className="w-full bg-transparent border-b border-white/10 px-2 py-1 text-purple-300 text-sm focus:outline-none focus:border-purple-500/50"
                  />
                </div>
              </div>
              <div>
                <textarea
                  value={entry.description}
                  onChange={(e) => updateEntry(entry.id, "description", e.target.value)}
                  placeholder="Event Description"
                  rows={2}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-gray-300 text-sm focus:outline-none focus:border-purple-500/50"
                />
              </div>
              <div className="flex gap-4">
                <div className="w-1/3">
                  <label className="block text-[10px] text-gray-500 mb-1 uppercase">Event Type</label>
                  <select
                    value={entry.category}
                    onChange={(e) => {
                      const cat = e.target.value;
                      const colorMap: Record<string, string> = {
                        Learning: "blue",
                        Achievement: "amber",
                        Project: "green",
                        Competition: "red",
                        Certification: "purple",
                        Milestone: "cyan",
                        "Skill Acquired": "blue",
                      };
                      updateEntry(entry.id, "category", cat);
                      updateEntry(entry.id, "color", colorMap[cat] || "blue");
                    }}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-2 py-1.5 text-gray-300 text-xs focus:outline-none focus:border-purple-500/50"
                  >
                    <option value="Learning">Learning</option>
                    <option value="Achievement">Achievement</option>
                    <option value="Project">Project</option>
                    <option value="Competition">Competition</option>
                    <option value="Certification">Certification</option>
                    <option value="Milestone">Milestone</option>
                    <option value="Skill Acquired">Skill Acquired</option>
                  </select>
                </div>
                <div className="w-1/3">
                  <label className="block text-[10px] text-gray-500 mb-1 uppercase">Color</label>
                  <select
                    value={entry.color}
                    onChange={(e) => updateEntry(entry.id, "color", e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-2 py-1.5 text-gray-300 text-xs focus:outline-none focus:border-purple-500/50"
                  >
                    <option value="blue">Blue</option>
                    <option value="purple">Purple</option>
                    <option value="green">Green</option>
                    <option value="amber">Amber</option>
                    <option value="red">Red</option>
                    <option value="cyan">Cyan</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 border-l border-white/10 pl-4">
              <button
                onClick={() => updateEntry(entry.id, "visible", !entry.visible)}
                className={`p-2 rounded-xl transition-colors ${entry.visible ? "text-green-400 bg-green-400/10" : "text-gray-500 bg-white/5"}`}
                title={entry.visible ? "Hide Event" : "Show Event"}
              >
                {entry.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <button
                onClick={() => removeEntry(entry.id)}
                className="p-2 rounded-xl text-red-400 hover:bg-red-400/10 transition-colors"
                title="Delete Event"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 pt-4 border-t border-white/10">
        <button
          onClick={handleSave}
          disabled={status === "saving"}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {status === "saving" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {status === "saving" ? "Saving..." : "Save Evolution"}
        </button>
        {status === "success" && <span className="flex items-center gap-1.5 text-green-400 text-sm"><CheckCircle2 className="w-4 h-4" /> Saved successfully</span>}
        {status === "error" && <span className="flex items-center gap-1.5 text-red-400 text-sm"><AlertCircle className="w-4 h-4" /> Failed to save</span>}
      </div>
    </div>
  );
}
