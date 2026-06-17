"use client";

import { useState, useEffect } from "react";
import { Save } from "lucide-react";

interface SingletonEditorProps {
  endpoint: string;
  title: string;
  fields: { name: string; label: string; type: "text" | "textarea" | "list" }[];
}

export default function SingletonEditor({ endpoint, title, fields }: SingletonEditorProps) {
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(endpoint);
      const data = await res.json();
      setFormData(data || {});
      setLoading(false);
    }
    fetchData();
  }, [endpoint]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const submitData = { ...formData };
    fields.forEach(f => {
      if (f.type === "list" && typeof submitData[f.name] === "string") {
        submitData[f.name] = submitData[f.name].split("\n").filter((s: string) => s.trim() !== "");
      }
    });

    const res = await fetch(endpoint, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submitData),
    });

    if (res.ok) {
      alert("Saved successfully!");
    } else {
      alert("Error saving data");
    }
    setSaving(false);
  };

  if (loading) return <div className="text-gray-400">Loading {title}...</div>;

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">{title}</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white/5 border border-white/10 p-6 rounded-xl">
        {fields.map(f => (
          <div key={f.name}>
            <label className="block text-sm font-medium text-gray-400 mb-2">{f.label}</label>
            {f.type === "textarea" ? (
              <textarea 
                value={formData[f.name] || ""}
                onChange={e => setFormData({...formData, [f.name]: e.target.value})}
                className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-purple-500 outline-none"
                rows={4}
              />
            ) : f.type === "list" ? (
              <textarea 
                value={Array.isArray(formData[f.name]) ? formData[f.name].join("\n") : formData[f.name] || ""}
                onChange={e => setFormData({...formData, [f.name]: e.target.value})}
                className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-purple-500 outline-none"
                rows={6}
                placeholder="Enter one item per line"
              />
            ) : (
              <input 
                type="text"
                value={formData[f.name] || ""}
                onChange={e => setFormData({...formData, [f.name]: e.target.value})}
                className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-purple-500 outline-none"
              />
            )}
            {f.type === "list" && <p className="text-xs text-gray-500 mt-1">One item per line</p>}
          </div>
        ))}
        
        <button 
          type="submit" 
          disabled={saving}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-lg transition-colors font-medium disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
