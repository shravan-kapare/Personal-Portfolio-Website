"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Edit2, Trash2, X, Upload, Loader2, Image as ImageIcon, AlertTriangle } from "lucide-react";
import { parseCollectionData } from "@/lib/cms-utils";

type FieldType = "text" | "textarea" | "number" | "boolean" | "list" | "image";

interface Field {
  name: string;
  label: string;
  type: FieldType;
  hint?: string;
}

interface CrudTableProps {
  endpoint: string;
  title: string;
  fields: Field[];
}

// Image upload widget — uploads to Cloudinary via our secure API route
function ImageUploadField({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (url: string) => void;
  label: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const body = new FormData();
      body.append("file", file);

      const res = await fetch("/api/upload/cloudinary", {
        method: "POST",
        body,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      onChange(data.url);
    } catch (err: any) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      {/* URL input for manual entry or pasting Cloudinary URLs */}
      <input
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://res.cloudinary.com/... or paste any image URL"
        className="w-full bg-black border border-white/10 rounded-lg p-3 text-white text-sm focus:border-purple-500 outline-none"
      />

      {/* File upload button */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-lg text-xs text-purple-300 transition-all duration-200 disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Upload className="w-3.5 h-3.5" />
          )}
          {uploading ? "Uploading..." : "Upload Image"}
        </button>
        {error && <span className="text-xs text-red-400">{error}</span>}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />
      </div>

      {/* Preview */}
      {value && (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-white/10 bg-black/40">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt={label}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 p-1 bg-black/70 hover:bg-black rounded-full text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

// Validate featured project has required fields
function validateFeaturedProject(
  formData: any,
  fields: Field[]
): string[] {
  const errors: string[] = [];
  if (!formData.featured) return errors;

  const requiredForFeatured: Record<string, string> = {
    name: "Project Name",
    description: "Short Description",
    technologies: "Technologies",
    image: "Project Image",
    githubUrl: "GitHub URL",
  };

  for (const [fieldName, label] of Object.entries(requiredForFeatured)) {
    // Only validate if the field exists in the schema
    const fieldExists = fields.some((f) => f.name === fieldName);
    if (!fieldExists) continue;

    const value = formData[fieldName];
    if (!value || (Array.isArray(value) && value.length === 0) || (typeof value === "string" && value.trim() === "")) {
      errors.push(`${label} is required for featured projects`);
    }
  }

  return errors;
}

export default function CrudTable({ endpoint, title, fields }: CrudTableProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await fetch(endpoint);
      const result = await res.json();
      const parsedItems = parseCollectionData(result);
      setData(parsedItems);
    } catch (err: any) {
      console.error("Failed to parse collection data:", err);
      setFetchError(err.message || "Failed to load data.");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint]);

  const handleOpenModal = (item?: any) => {
    setValidationErrors([]);
    if (item) {
      setEditingId(item.id);
      setFormData(item);
    } else {
      setEditingId(null);
      const initial: any = {};
      fields.forEach((f) => {
        initial[f.name] =
          f.type === "boolean"
            ? false
            : f.type === "list"
            ? []
            : f.type === "number"
            ? 0
            : "";
      });
      setFormData(initial);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setValidationErrors([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate featured projects
    const errors = validateFeaturedProject(formData, fields);
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }
    setValidationErrors([]);

    const url = editingId ? `${endpoint}/${editingId}` : endpoint;
    const method = editingId ? "PUT" : "POST";

    // Convert list strings back to arrays if needed
    const submitData = { ...formData };
    fields.forEach((f) => {
      if (f.type === "list" && typeof submitData[f.name] === "string") {
        submitData[f.name] = submitData[f.name]
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean);
      }
    });

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submitData),
    });

    if (res.ok) {
      handleCloseModal();
      fetchData();
    } else {
      alert("Error saving data");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    const res = await fetch(`${endpoint}/${id}`, { method: "DELETE" });
    if (res.ok) {
      fetchData();
    } else {
      alert("Error deleting data");
    }
  };

  const renderField = (f: Field) => {
    if (f.type === "image") {
      return (
        <ImageUploadField
          value={formData[f.name] || ""}
          onChange={(url) => setFormData({ ...formData, [f.name]: url })}
          label={f.label}
        />
      );
    }
    if (f.type === "textarea") {
      return (
        <textarea
          value={formData[f.name] || ""}
          onChange={(e) =>
            setFormData({ ...formData, [f.name]: e.target.value })
          }
          className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-purple-500 outline-none"
          rows={4}
        />
      );
    }
    if (f.type === "boolean") {
      return (
        <label className="flex items-center gap-3 cursor-pointer">
          <div
            onClick={() =>
              setFormData({ ...formData, [f.name]: !formData[f.name] })
            }
            className={`relative w-11 h-6 rounded-full transition-all duration-300 cursor-pointer ${
              formData[f.name] ? "bg-purple-600" : "bg-white/10"
            }`}
          >
            <div
              className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${
                formData[f.name] ? "left-6" : "left-1"
              }`}
            />
          </div>
          <span className="text-sm text-gray-300">
            {formData[f.name] ? "Yes" : "No"}
          </span>
        </label>
      );
    }
    return (
      <input
        type={f.type === "number" ? "number" : "text"}
        value={
          f.type === "list" && Array.isArray(formData[f.name])
            ? formData[f.name].join(", ")
            : formData[f.name] || ""
        }
        onChange={(e) =>
          setFormData({
            ...formData,
            [f.name]:
              f.type === "number" ? Number(e.target.value) : e.target.value,
          })
        }
        className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-purple-500 outline-none"
      />
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{title}</h1>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" /> Add New
        </button>
      </div>

      {fetchError ? (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-xl flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="font-medium text-sm">Data Synchronization Error</p>
            <p className="text-xs opacity-80 mt-1">{fetchError}</p>
          </div>
        </div>
      ) : loading ? (
        <div className="flex items-center gap-3 text-gray-400">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading data...
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-black/50 border-b border-white/10">
              <tr>
                {fields.slice(0, 3).map((f) => (
                  <th key={f.name} className="p-4 font-medium text-gray-400">
                    {f.label}
                  </th>
                ))}
                <th className="p-4 font-medium text-gray-400 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {data.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-white/5 transition-colors"
                >
                  {fields.slice(0, 3).map((f) => (
                    <td key={f.name} className="p-4 max-w-[200px]">
                      {f.type === "boolean" ? (
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-mono ${
                            item[f.name]
                              ? "bg-purple-500/20 text-purple-300"
                              : "bg-white/5 text-gray-500"
                          }`}
                        >
                          {item[f.name] ? "Yes" : "No"}
                        </span>
                      ) : f.type === "image" ? (
                        item[f.name] ? (
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <ImageIcon className="w-3.5 h-3.5 text-purple-400" />
                            <span className="truncate">Uploaded</span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-600">—</span>
                        )
                      ) : f.type === "list" ? (
                        <span className="text-sm text-gray-400 truncate block">
                          {Array.isArray(item[f.name])
                            ? item[f.name].slice(0, 3).join(", ")
                            : item[f.name]}
                        </span>
                      ) : (
                        <span className="text-sm truncate block">
                          {item[f.name]?.toString() || "—"}
                        </span>
                      )}
                    </td>
                  ))}
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => handleOpenModal(item)}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="p-8 text-center text-gray-500"
                  >
                    No {title.toLowerCase()} found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ================================================================ */}
      {/* MODAL — Scrollable with sticky header/footer                     */}
      {/* ================================================================ */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start justify-center overflow-y-auto"
          onClick={(e) => {
            // Close on backdrop click
            if (e.target === e.currentTarget) handleCloseModal();
          }}
        >
          <div
            className="bg-[#0e0e0e] border border-white/10 rounded-2xl w-full max-w-2xl my-8 mx-4 flex flex-col"
            style={{ maxHeight: "90vh" }}
          >
            {/* ── Sticky Header ── */}
            <div className="flex justify-between items-center px-6 py-5 border-b border-white/10 flex-shrink-0 rounded-t-2xl">
              <h2 className="text-xl font-bold">
                {editingId
                  ? `Edit ${title.slice(0, -1)}`
                  : `New ${title.slice(0, -1)}`}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* ── Scrollable Form Body ── */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col flex-1 min-h-0"
            >
              <div
                className="flex-1 overflow-y-auto p-6 space-y-5"
                style={{
                  overscrollBehavior: "contain",
                  WebkitOverflowScrolling: "touch",
                }}
              >
                {/* Validation Errors */}
                {validationErrors.length > 0 && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 space-y-1">
                    <div className="flex items-center gap-2 text-red-400 text-sm font-medium mb-1">
                      <AlertTriangle className="w-4 h-4" />
                      Featured projects require the following:
                    </div>
                    {validationErrors.map((err, i) => (
                      <p key={i} className="text-xs text-red-400/80 ml-6">
                        • {err}
                      </p>
                    ))}
                  </div>
                )}

                {fields.map((f) => (
                  <div key={f.name}>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                      {f.label}
                    </label>
                    {renderField(f)}
                    {f.hint && (
                      <p className="text-xs text-gray-500 mt-1">{f.hint}</p>
                    )}
                    {f.type === "list" && (
                      <p className="text-xs text-gray-500 mt-1">
                        Comma-separated values (e.g. React, TypeScript, Node.js)
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* ── Sticky Footer ── */}
              <div className="flex justify-end gap-3 px-6 py-4 border-t border-white/10 flex-shrink-0 rounded-b-2xl bg-[#0e0e0e]">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold transition-colors"
                >
                  Save {title.slice(0, -1)}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
