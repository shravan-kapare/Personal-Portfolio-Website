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

import { execSync } from "child_process";

export async function writeData<T>(filename: string, data: T): Promise<void> {
  const filePath = path.join(DATA_DIR, filename);
  // Ensure the directory exists
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");

  // Auto-commit system
  try {
    const type = filename.replace(".json", "");
    const commitMsg = `feat(${type}): update ${type} content via CMS`;
    
    // Add only the changed JSON file
    execSync(`git add "${filePath}"`, { cwd: process.cwd(), stdio: 'ignore' });
    
    // Commit if there are changes
    try {
      execSync(`git commit -m "${commitMsg}"`, { cwd: process.cwd(), stdio: 'ignore' });
    } catch (e) {
      // Ignored: Git commit throws an error if there are no changes to commit
    }
  } catch (err) {
    console.error("Git auto-commit failed:", err);
  }
}
