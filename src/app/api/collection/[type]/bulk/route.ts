import { NextResponse } from "next/server";
import { writeData } from "@/lib/data";
import { verifyApiAuth } from "@/lib/auth";

const ALLOWED_TYPES = ["social", "sections"];

export async function PUT(req: Request, { params }: { params: Promise<{ type: string }> }) {
  const isAuth = await verifyApiAuth(req as any);
  if (!isAuth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { type } = await params;
    if (!ALLOWED_TYPES.includes(type)) return NextResponse.json({ error: "Invalid type" }, { status: 400 });

    const body = await req.json();
    if (!Array.isArray(body)) return NextResponse.json({ error: "Expected an array" }, { status: 400 });

    const { readData } = await import("@/lib/data");
    let currentData = await readData<any>(`${type}.json`).catch(() => ([]));
    
    if (Array.isArray(currentData)) {
      await writeData(`${type}.json`, body);
    } else {
      currentData.items = body;
      await writeData(`${type}.json`, currentData);
    }
    
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update bulk" }, { status: 500 });
  }
}
