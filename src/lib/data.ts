import fs from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

export async function readData<T>(filename: string): Promise<T> {
  try {
    const filePath = path.join(DATA_DIR, filename);
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data) as T;
  } catch (error: any) {
    if (error.code === "ENOENT") {
      // Return empty array/object based on common usage
      if (filename.includes("education") || filename.includes("about")) {
        return {} as T;
      }
      return [] as unknown as T;
    }
    throw error;
  }
}

export async function writeData<T>(filename: string, data: T): Promise<void> {
  const content = JSON.stringify(data, null, 2);
  const type = filename.replace(".json", "");
  const commitMsg = `feat(${type}): update ${type} content via CMS`;

  // 1. Try to write locally (Works in dev, and provides a temporary cache in Vercel prod lambda)
  try {
    const filePath = path.join(DATA_DIR, filename);
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(filePath, content, "utf-8");
  } catch (e) {
    // Expected in Vercel Production due to read-only filesystem (EROFS)
    console.warn(`Could not write ${filename} locally (Vercel Prod Environment). Relying on GitHub API.`);
  }

  // 2. Commit directly to GitHub using the API
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_REPO_OWNER || "shravan-kapare";
  const repo = process.env.GITHUB_REPO_NAME || "Personal-Portfolio-Website";

  if (token) {
    try {
      const gitPath = `data/${filename}`;
      const url = `https://api.github.com/repos/${owner}/${repo}/contents/${gitPath}`;
      
      // Fetch the current file to get its SHA (required by GitHub API for updates)
      let sha = "";
      const getRes = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
      });

      if (getRes.ok) {
        const fileData = await getRes.json();
        sha = fileData.sha;
      }

      // Upload the new file content
      const putRes = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: commitMsg,
          content: Buffer.from(content, 'utf-8').toString('base64'),
          sha: sha || undefined,
        }),
      });

      if (!putRes.ok) {
        const errorData = await putRes.json();
        console.error("GitHub API Error details:", errorData);
        throw new Error(`GitHub API Error: ${putRes.status} ${putRes.statusText}`);
      }
      
      console.log(`Successfully committed ${filename} to GitHub.`);
    } catch (err) {
      console.error("Failed to commit to GitHub:", err);
      // Bubble the error up to the API route so it returns HTTP 500
      throw err; 
    }
  } else if (process.env.NODE_ENV === "production") {
     console.warn("GITHUB_TOKEN is not configured. Changes cannot be permanently saved to the repository.");
  }
}
