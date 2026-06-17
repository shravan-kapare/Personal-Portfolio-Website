"use client";

import { useState } from "react";
import { Upload, FileText, CheckCircle2, AlertCircle } from "lucide-react";

export default function ResumeAdmin() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== "application/pdf") {
        setStatus({ type: "error", message: "Only PDF files are allowed." });
        setFile(null);
      } else {
        setStatus(null);
        setFile(selectedFile);
      }
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setStatus(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload/resume", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (res.ok) {
        setStatus({ type: "success", message: "Resume uploaded successfully! It is now live at /resume.pdf." });
        setFile(null);
      } else {
        setStatus({ type: "error", message: result.error || "Failed to upload resume." });
      }
    } catch (err) {
      setStatus({ type: "error", message: "An unexpected error occurred during upload." });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-3xl font-bold mb-8">Manage Resume</h1>

      <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-6">
        <div className="flex items-center gap-4 p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
          <FileText className="w-8 h-8 text-purple-400" />
          <div>
            <h3 className="font-semibold text-white">Current Active Resume</h3>
            <p className="text-sm text-gray-400">Available at <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">/resume.pdf</a></p>
          </div>
        </div>

        <form onSubmit={handleUpload} className="space-y-4">
          <label className="block border-2 border-dashed border-white/10 hover:border-purple-500/50 rounded-xl p-8 text-center cursor-pointer transition-colors">
            <input 
              type="file" 
              accept=".pdf" 
              className="hidden" 
              onChange={handleFileChange} 
            />
            <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
            <span className="block text-sm font-medium text-gray-300">
              {file ? file.name : "Click to select a new Resume PDF"}
            </span>
            <span className="block text-xs text-gray-500 mt-1">PDF format only (Max 5MB)</span>
          </label>

          {status && (
            <div className={`flex items-center gap-3 p-4 rounded-xl text-sm ${
              status.type === "success" ? "bg-green-500/10 border border-green-500/20 text-green-300" : "bg-red-500/10 border border-red-500/20 text-red-300"
            }`}>
              {status.type === "success" ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
              <span>{status.message}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={!file || uploading}
            className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? "Uploading..." : "Upload New Resume"}
          </button>
        </form>
      </div>
    </div>
  );
}
