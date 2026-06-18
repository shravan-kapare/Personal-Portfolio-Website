import { getSession, logout } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Folder, Terminal, Award, FileBadge, GraduationCap, User, LogOut, FileText, Compass, Home, Settings, Globe, Share2 } from "lucide-react";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  
  if (!session) {
    redirect("/system-nexus");
  }

  const navItems = [
    { name: "Hero", href: "/system-nexus/dashboard/hero", icon: Home },
    { name: "About", href: "/system-nexus/dashboard/about", icon: User },
    { name: "Skills", href: "/system-nexus/dashboard/skills", icon: Terminal },
    { name: "Projects", href: "/system-nexus/dashboard/projects", icon: Folder },
    { name: "Education", href: "/system-nexus/dashboard/education", icon: GraduationCap },
    { name: "Achievements", href: "/system-nexus/dashboard/achievements", icon: Award },
    { name: "Certifications", href: "/system-nexus/dashboard/certifications", icon: FileBadge },
    { name: "Knowledge Evolution", href: "/system-nexus/dashboard/evolution", icon: Terminal },
    { name: "Open Source Core", href: "/system-nexus/dashboard/github", icon: Folder },
    { name: "Social Links", href: "/system-nexus/dashboard/social", icon: Share2 },
    { name: "Resume", href: "/system-nexus/dashboard/resume", icon: FileText },
    { name: "Navigation", href: "/system-nexus/dashboard/navigation", icon: Compass },
    { name: "Settings", href: "/system-nexus/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-[#050505] text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-black border-r border-white/10 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-bold tracking-widest text-purple-400">NEXUS CORE</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <form action={async () => { "use server"; await logout(); redirect("/system-nexus"); }}>
            <button type="submit" className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors">
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
