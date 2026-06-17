import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { verifyApiAuth } from "@/lib/auth";

export async function POST(req: Request) {
  const isAuth = await verifyApiAuth(req as any);
  if (!isAuth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const publicDir = path.join(process.cwd(), "public");
    
    // Ensure public folder exists
    await fs.mkdir(publicDir, { recursive: true });
    
    const filePath = path.join(publicDir, "resume.pdf");
    await fs.writeFile(filePath, buffer);

    return NextResponse.json({ success: true, url: "/resume.pdf" });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
