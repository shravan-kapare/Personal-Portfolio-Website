import { useMemo } from "react";

interface TimelineItem {
  id: string;
  type: "Project" | "Skill" | "Achievement" | "Certification";
  title: string;
  date: Date;
}

interface KnowledgeTimelineProps {
  skills: any[];
  projects: any[];
  achievements: any[];
  certifications: any[];
}

// Strict UTC-aware date formatter — identical output on server and client
const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

export default function KnowledgeTimeline({ skills, projects, achievements, certifications }: KnowledgeTimelineProps) {
  const timelineData = useMemo(() => {
    const items: TimelineItem[] = [];
    
    skills.forEach(s => items.push({ id: `s-${s.id}`, type: "Skill", title: `Learned ${s.name}`, date: new Date(s.createdAt) }));
    projects.forEach(p => items.push({ id: `p-${p.id}`, type: "Project", title: `Built ${p.name}`, date: new Date(p.createdAt) }));
    achievements.forEach(a => items.push({ id: `a-${a.id}`, type: "Achievement", title: `Achieved ${a.title}`, date: new Date(a.createdAt) }));
    certifications.forEach(c => items.push({ id: `c-${c.id}`, type: "Certification", title: `Certified in ${c.name}`, date: new Date(c.createdAt) }));
    
    // Sort descending
    items.sort((a, b) => b.date.getTime() - a.date.getTime());
    
    // Group by year — use UTC to match the formatter
    const grouped: Record<string, TimelineItem[]> = {};
    items.forEach(item => {
      const year = item.date.getUTCFullYear().toString();
      if (!grouped[year]) grouped[year] = [];
      grouped[year].push(item);
    });
    
    return grouped;
  }, [skills, projects, achievements, certifications]);

  const years = Object.keys(timelineData).sort((a, b) => parseInt(b) - parseInt(a));

  return (
    <div className="max-w-3xl mx-auto border-l-2 border-white/10 ml-4 md:ml-0 md:pl-8 space-y-12">
      {years.map(year => (
        <div key={year} className="relative">
          <div className="absolute -left-[41px] md:-left-[49px] top-0 bg-black text-purple-400 font-bold py-1 px-2 rounded border border-white/20 text-sm">
            {year}
          </div>
          <div className="space-y-6 pt-2 pl-6 md:pl-0">
            {timelineData[year].map(item => (
              <div key={item.id} className="flex items-start gap-4 group">
                <div className="mt-1 flex-shrink-0">
                  {item.type === "Skill" && <span className="text-blue-400">⚡</span>}
                  {item.type === "Project" && <span className="text-green-400">🚀</span>}
                  {item.type === "Achievement" && <span className="text-yellow-400">🏆</span>}
                  {item.type === "Certification" && <span className="text-purple-400">📜</span>}
                </div>
                <div>
                  <p className="text-lg text-gray-200 group-hover:text-white transition-colors">{item.title}</p>
                  <p className="text-sm text-gray-500">{dateFormatter.format(item.date)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      
      {years.length === 0 && <p className="text-gray-500">Timeline begins when you add your first entry.</p>}
    </div>
  );
}
