import { NextResponse } from "next/server";
import { readData, writeData } from "@/lib/data";
import { verifyApiAuth } from "@/lib/auth";

const ALLOWED_TYPES = ["projects", "skills", "achievements", "certifications", "education", "sections", "social"];

export async function PUT(req: Request, { params }: { params: Promise<{ type: string, id: string }> }) {
  const isAuth = await verifyApiAuth(req as any);
  if (!isAuth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { type, id } = await params;
    if (!ALLOWED_TYPES.includes(type)) return NextResponse.json({ error: "Invalid type" }, { status: 400 });

    const body = await req.json();
    let data = await readData<any>(`${type}.json`);
    
    let items = Array.isArray(data) ? data : (data?.items || []);
    const index = items.findIndex((item: any) => item.id === id);
    if (index === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
    
    items[index] = { ...items[index], ...body, updatedAt: new Date().toISOString() };
    
    if (Array.isArray(data)) {
      data = items;
    } else {
      data.items = items;
    }
    
    await writeData(`${type}.json`, data);
    
    return NextResponse.json(items[index]);
  } catch (err) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ type: string, id: string }> }) {
  const isAuth = await verifyApiAuth(req as any);
  if (!isAuth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { type, id } = await params;
    if (!ALLOWED_TYPES.includes(type)) return NextResponse.json({ error: "Invalid type" }, { status: 400 });

    let data = await readData<any>(`${type}.json`);
    
    let items = Array.isArray(data) ? data : (data?.items || []);
    const initialLength = items.length;
    items = items.filter((item: any) => item.id !== id);
    
    if (items.length === initialLength) return NextResponse.json({ error: "Not found" }, { status: 404 });
    
    if (Array.isArray(data)) {
      data = items;
    } else {
      data.items = items;
    }
    
    await writeData(`${type}.json`, data);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
