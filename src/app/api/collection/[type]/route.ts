import { NextResponse } from "next/server";
import { readData, writeData } from "@/lib/data";
import { verifyApiAuth } from "@/lib/auth";

const ALLOWED_TYPES = ["projects", "skills", "achievements", "certifications", "education", "sections", "social"];

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

export async function POST(req: Request, { params }: { params: Promise<{ type: string }> }) {
  const isAuth = await verifyApiAuth(req as any);
  if (!isAuth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { type } = await params;
    if (!ALLOWED_TYPES.includes(type)) return NextResponse.json({ error: "Invalid type" }, { status: 400 });

    const body = await req.json();
    const data = await readData<any[]>(`${type}.json`);
    
    const newItem = {
      ...body,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };
    
    data.push(newItem);
    await writeData(`${type}.json`, data);

    // Auto-generate timeline events when enabled
    if (type === "skills" || type === "projects" || type === "achievements") {
      try {
        const settings = await readData<any>("settings.json");
        if (settings.autoGenerateTimelineEvents) {
          const evolution = await readData<any>("evolution.json");

          // Build event based on type
          let title = "";
          let description = "";
          let category = "Milestone";
          let color = "blue";
          let icon = "Flag";

          if (type === "skills") {
            title = `Started learning ${body.name}`;
            description = `Added ${body.name} to my skill repertoire.`;
            category = "Skill Acquired";
            color = "blue";
            icon = "Zap";
          } else if (type === "projects") {
            title = `Completed ${body.name} Project`;
            description = body.description || `Built and shipped the ${body.name} project.`;
            category = "Project";
            color = "green";
            icon = "Rocket";
          } else if (type === "achievements") {
            title = `Achieved ${body.title}`;
            description = body.description || `Earned the ${body.title} achievement.`;
            category = "Achievement";
            color = "amber";
            icon = "Trophy";
          }

          const newEvent = {
            id: crypto.randomUUID(),
            title,
            description,
            date: new Date().getFullYear().toString(),
            icon,
            category,
            color,
            visible: true,
            order: (evolution.timelineEntries?.length || 0)
          };
          
          if (!evolution.timelineEntries) evolution.timelineEntries = [];
          evolution.timelineEntries.push(newEvent);
          await writeData("evolution.json", evolution);
        }
      } catch (err) {
        console.error("Failed to auto-generate timeline event", err);
      }
    }
    
    return NextResponse.json(newItem, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
