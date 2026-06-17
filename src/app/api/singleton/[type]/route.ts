import { NextResponse } from "next/server";
import { readData, writeData } from "@/lib/data";
import { verifyApiAuth } from "@/lib/auth";

const ALLOWED_TYPES = ["about", "education", "githubFeatured"];

export async function GET(req: Request, { params }: { params: Promise<{ type: string }> }) {
  try {
    const { type } = await params;
    if (!ALLOWED_TYPES.includes(type)) return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    
    const data = await readData(`${type}.json`);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Failed to read data" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ type: string }> }) {
  const isAuth = await verifyApiAuth(req as any);
  if (!isAuth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { type } = await params;
    if (!ALLOWED_TYPES.includes(type)) return NextResponse.json({ error: "Invalid type" }, { status: 400 });

    const body = await req.json();
    const data = { ...body, updatedAt: new Date().toISOString() };
    
    await writeData(`${type}.json`, data);
    
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
