"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ExternalLink,
  Mail,
  MapPin,
  Download,
  FileText,
  GraduationCap,
  Trophy,
  Award,
  Star,
  GitFork,
  Calendar,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Code,
  Monitor,
  Zap,
  Target,
  Cpu,
  Globe,
  Medal,
  Flame,
  BookOpen,
} from "lucide-react";

const ACHIEVEMENT_ICON_MAP: Record<string, React.ElementType> = {
  Award,
  Trophy,
  Code,
  Monitor,
  Star,
  Zap,
  Target,
  Cpu,
  Globe,
  Medal,
  Flame,
  BookOpen,
};

function AchievementIcon({ name, className }: { name?: string; className?: string }) {
  const Icon = ((name && ACHIEVEMENT_ICON_MAP[name]) ? ACHIEVEMENT_ICON_MAP[name] : Award) as React.ComponentType<{ className?: string }>;
  return <Icon className={className ?? ""} />;
}

/* ─────────────────────────────────────────────
   ICONS
───────────────────────────────────────────── */
const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

/* ─────────────────────────────────────────────
   FADE-IN ANIMATION WRAPPER
───────────────────────────────────────────── */
function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   SECTION HEADER
───────────────────────────────────────────── */
function SectionHeader({
  badge,
  title,
  subtitle,
}: {
  badge?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <FadeIn className="mb-10">
      {badge && (
        <span className="inline-block text-[11px] font-semibold tracking-[0.15em] uppercase text-blue-600 mb-3">
          {badge}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-base text-gray-500 max-w-xl">{subtitle}</p>
      )}
    </FadeIn>
  );
}

/* ─────────────────────────────────────────────
   PROFESSIONAL NAVBAR
───────────────────────────────────────────── */
function ProfessionalNavbar({
  links,
  resumeLink,
  allowVisitorSwitching,
  onThemeSwitch,
}: {
  links: { name: string; href: string }[];
  resumeLink: string;
  allowVisitorSwitching?: boolean;
  onThemeSwitch?: (theme: "cosmic" | "professional") => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState("#home");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    const sectionIds = links.map((l) => l.href.replace("#", ""));
    const ratioMap = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) =>
          ratioMap.set(`#${e.target.id}`, e.intersectionRatio)
        );
        let max = 0;
        let maxId = "#home";
        ratioMap.forEach((r, id) => {
          if (r > max) {
            max = r;
            maxId = id;
          }
        });
        if (max > 0) setActive(maxId);
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1], rootMargin: "-20% 0px -50% 0px" }
    );

    sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean)
      .forEach((el) => observer.observe(el!));

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, [links]);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-xl border-b border-gray-200/80 shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => scrollTo("#home")}
            className="text-sm font-semibold text-gray-900 tracking-tight hover:text-blue-600 transition-colors"
          >
            Shravan Kapare
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollTo(link.href)}
                className={`text-sm font-medium transition-colors ${
                  active === link.href
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {link.name}
              </button>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {allowVisitorSwitching && onThemeSwitch && (
              <button
                onClick={() => onThemeSwitch("cosmic")}
                className="hidden md:flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100"
                title="Switch to Cosmic Theme"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Cosmic Mode
              </button>
            )}
            <a
              href={resumeLink}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-sm font-semibold text-white bg-gray-900 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Resume</span>
            </a>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <span
                className={`block w-5 h-0.5 bg-gray-700 transition-all ${mobileOpen ? "rotate-45 translate-y-2" : ""}`}
              />
              <span
                className={`block w-5 h-0.5 bg-gray-700 transition-all ${mobileOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`block w-5 h-0.5 bg-gray-700 transition-all ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="fixed top-16 inset-x-0 z-40 bg-white border-b border-gray-200 shadow-lg md:hidden"
        >
          <nav className="flex flex-col px-6 py-4 gap-1">
            {links.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollTo(link.href)}
                className={`text-left text-sm font-medium py-2.5 transition-colors ${
                  active === link.href ? "text-blue-600" : "text-gray-700"
                }`}
              >
                {link.name}
              </button>
            ))}
            {allowVisitorSwitching && onThemeSwitch && (
              <button
                onClick={() => { onThemeSwitch("cosmic"); setMobileOpen(false); }}
                className="flex items-center gap-2 text-sm text-gray-600 py-2.5 mt-2 border-t border-gray-100"
              >
                <Sparkles className="w-4 h-4" /> Switch to Cosmic Mode
              </button>
            )}
          </nav>
        </motion.div>
      )}
    </>
  );
}

/* ─────────────────────────────────────────────
   PROPS INTERFACE
───────────────────────────────────────────── */
interface ProfessionalHomeProps {
  heroData?: any;
  settingsData?: any;
  aboutData: any;
  skillsData: { meta: any; items: any[] };
  projectsData: { meta: any; items: any[] };
  educationData: { meta: any; items: any[] };
  achievementsData: { meta: any; items: any[] };
  certificationsData: { meta: any; items: any[] };
  sectionsData: any[];
  socialData?: { meta: any; items: any[] };
  evolutionData?: any;
  githubData?: any;
  counts: {
    projects: number;
    achievements: number;
    technologies: number;
  };
  currentTheme: "cosmic" | "professional";
  onThemeSwitch?: (theme: "cosmic" | "professional") => void;
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function ProfessionalHome({
  heroData,
  settingsData,
  aboutData,
  skillsData,
  projectsData,
  educationData,
  achievementsData,
  certificationsData,
  sectionsData,
  socialData,
  evolutionData,
  githubData,
  counts,
  currentTheme,
  onThemeSwitch,
}: ProfessionalHomeProps) {
  const isSectionEnabled = (sectionId: string) =>
    settingsData?.sectionVisibility?.[sectionId]?.professional !== false;

  // Derive nav links from enabled sections
  const navLinks = (
    sectionsData.length > 0
      ? sectionsData.filter(
          (s) => s.enabled && s.navVisible !== false && isSectionEnabled(s.id)
        )
      : [
          { id: "home", name: "Home", href: "#home" },
          { id: "about", name: "About", href: "#about" },
          { id: "skills", name: "Skills", href: "#skills" },
          { id: "projects", name: "Projects", href: "#projects" },
          { id: "education", name: "Education", href: "#education" },
          { id: "contact", name: "Contact", href: "#contact" },
        ]
  ).map((s: any) => ({ name: s.name, href: s.href }));

  // Skills grouped by category
  const skillsByCategory = skillsData.items.reduce((acc: any, skill: any) => {
    const cat = skill.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  // Category icon map
  const categoryIcons: Record<string, string> = {
    Languages: "💻",
    "Programming Languages": "💻",
    Frameworks: "⚙️",
    "AI / ML": "🤖",
    "AI/ML": "🤖",
    Tools: "🛠️",
    Databases: "🗄️",
    Cloud: "☁️",
    Other: "📦",
  };

  const featuredProjects = projectsData.items.filter((p: any) => p.featured);
  const otherProjects = projectsData.items.filter((p: any) => !p.featured);

  // Social links
  const linkedIn = socialData?.items?.find((s: any) =>
    s.platform?.toLowerCase().includes("linkedin")
  );
  const github = socialData?.items?.find((s: any) =>
    s.platform?.toLowerCase().includes("github")
  );
  const email = socialData?.items?.find((s: any) =>
    s.platform?.toLowerCase().includes("email")
  );

  const resumeLink = settingsData?.resumeLink || "/resume.pdf";

  // GitHub repos
  const [repos, setRepos] = useState<any[]>([]);
  useEffect(() => {
    if (!isSectionEnabled("github")) return;
    fetch("/api/github?returnAll=true")
      .then((r) => r.json())
      .then((d) => {
        const list = (d.repos || [])
          .filter((r: any) => r.cmsStatus !== "Hidden")
          .slice(0, 6);
        setRepos(list);
      })
      .catch(() => {});
  }, []);

  const langColors: Record<string, string> = {
    TypeScript: "#3178c6",
    JavaScript: "#f1e05a",
    Python: "#3572A5",
    Java: "#b07219",
    "C++": "#f34b7d",
    HTML: "#e34c26",
    CSS: "#563d7c",
    Dart: "#00B4AB",
    Kotlin: "#A97BFF",
  };

  return (
    <div
      className="min-h-screen antialiased"
      style={{
        background: "linear-gradient(135deg, #f8f9fb 0%, #ffffff 50%, #f0f4ff 100%)",
        color: "#111827",
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      {/* Subtle background pattern */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(37,99,235,0.04) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(99,102,241,0.04) 0%, transparent 50%)",
        }}
      />

      {/* ──────── NAVBAR ──────── */}
      <ProfessionalNavbar
        links={navLinks}
        resumeLink={resumeLink}
        allowVisitorSwitching={settingsData?.allowVisitorSwitching}
        onThemeSwitch={onThemeSwitch}
      />

      {/* ──────── CONTENT ──────── */}
      <main className="relative">
        {/* ═══════════════════════════════════════
            HERO
        ═══════════════════════════════════════ */}
        {isSectionEnabled("home") && (
          <section
            id="home"
            className="min-h-screen flex flex-col justify-center pt-16"
          >
            <div className="max-w-6xl mx-auto px-6 md:px-10 py-24 md:py-32">
              <FadeIn delay={0}>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-medium mb-8">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                  {heroData?.portfolioLabel || "Open to opportunities"}
                </div>
              </FadeIn>

              <FadeIn delay={0.08}>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-gray-900 tracking-tighter leading-none mb-6">
                  {heroData?.mainName
                    ? heroData.mainName.replace("\\n", " ")
                    : "Shravan Kapare"}
                </h1>
              </FadeIn>

              <FadeIn delay={0.14}>
                <p className="text-xl md:text-2xl font-medium text-gray-600 mb-4 max-w-2xl">
                  {heroData?.tagline || "Computer Science Engineer · AI/ML · Full-Stack"}
                </p>
              </FadeIn>

              <FadeIn delay={0.18}>
                <p className="text-base text-gray-500 max-w-lg leading-relaxed mb-10">
                  {heroData?.description ||
                    "Building intelligent systems and elegant user experiences. Passionate about AI/ML, full-stack development, and solving real-world problems."}
                </p>
              </FadeIn>

              <FadeIn delay={0.22} className="flex flex-wrap gap-3">
                {linkedIn?.url && (
                  <a
                    href={linkedIn.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0077B5] hover:bg-[#006197] text-white font-semibold text-sm transition-all shadow-sm hover:shadow-md"
                  >
                    <LinkedinIcon className="w-4 h-4" />
                    LinkedIn
                  </a>
                )}
                {github?.url && (
                  <a
                    href={github.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gray-900 hover:bg-gray-700 text-white font-semibold text-sm transition-all shadow-sm hover:shadow-md"
                  >
                    <GithubIcon className="w-4 h-4" />
                    GitHub
                  </a>
                )}
                <a
                  href={resumeLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 text-gray-800 font-semibold text-sm transition-all shadow-sm hover:shadow-md"
                >
                  <Download className="w-4 h-4" />
                  Download Resume
                </a>
              </FadeIn>

              {/* Stats strip */}
              <FadeIn delay={0.28} className="mt-16 pt-10 border-t border-gray-200">
                <div className="flex flex-wrap gap-10">
                  {[
                    { value: counts.projects || "10+", label: "Projects Built" },
                    { value: counts.achievements || "8+", label: "Achievements" },
                    { value: counts.technologies || "20+", label: "Technologies" },
                    {
                      value:
                        educationData.items[0]?.cgpa || "8.5+",
                      label: "CGPA",
                    },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <div className="text-3xl font-bold text-gray-900 tracking-tight">
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-500 mt-0.5">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </FadeIn>
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════
            ABOUT
        ═══════════════════════════════════════ */}
        {isSectionEnabled("about") && (
          <section id="about" className="scroll-mt-16 py-24 bg-white">
            <div className="max-w-6xl mx-auto px-6 md:px-10">
              <SectionHeader
                badge={aboutData?.sectionBadge || "ABOUT ME"}
                title={aboutData?.sectionTitle || "Who I Am"}
                subtitle={aboutData?.sectionSubtitle}
              />

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
                {/* Text */}
                <div className="lg:col-span-3 space-y-5">
                  {(aboutData?.paragraphs || []).map(
                    (para: string, idx: number) => (
                      <FadeIn key={idx} delay={idx * 0.05}>
                        <p className="text-base text-gray-600 leading-relaxed">
                          {para}
                        </p>
                      </FadeIn>
                    )
                  )}
                </div>

                {/* Highlights */}
                <div className="lg:col-span-2 space-y-3">
                  <FadeIn>
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                      Quick Highlights
                    </h3>
                  </FadeIn>
                  {[
                    {
                      icon: <MapPin className="w-4 h-4" />,
                      label: "Location",
                      value: aboutData?.location || "India",
                    },
                    {
                      icon: <Mail className="w-4 h-4" />,
                      label: "Email",
                      value: email?.url?.replace("mailto:", "") || "shravankapare2004@gmail.com",
                      href: email?.url || "mailto:shravankapare2004@gmail.com",
                    },
                    {
                      icon: <GraduationCap className="w-4 h-4" />,
                      label: "Degree",
                      value:
                        educationData.items[0]?.degree ||
                        "B.E. Computer Science",
                    },
                    {
                      icon: <Trophy className="w-4 h-4" />,
                      label: "CGPA",
                      value: educationData.items[0]?.cgpa || "—",
                    },
                  ].map((item, idx) => (
                    <FadeIn key={idx} delay={0.05 + idx * 0.04}>
                      <div className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-100 bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                          {item.icon}
                        </div>
                        <div className="min-w-0">
                          <div className="text-[10px] uppercase font-semibold tracking-wider text-gray-400">
                            {item.label}
                          </div>
                          {item.href ? (
                            <a
                              href={item.href}
                              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors truncate block"
                            >
                              {item.value}
                            </a>
                          ) : (
                            <div className="text-sm font-medium text-gray-700">
                              {item.value}
                            </div>
                          )}
                        </div>
                      </div>
                    </FadeIn>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════
            SKILLS
        ═══════════════════════════════════════ */}
        {isSectionEnabled("skills") && (
          <section id="skills" className="scroll-mt-16 py-24">
            <div className="max-w-6xl mx-auto px-6 md:px-10">
              <SectionHeader
                badge={skillsData?.meta?.sectionBadge || "EXPERTISE"}
                title={skillsData?.meta?.sectionTitle || "Technical Skills"}
                subtitle={
                  skillsData?.meta?.sectionSubtitle ||
                  "A comprehensive overview of my technical capabilities."
                }
              />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(skillsByCategory).map(
                  ([category, skills]: [string, any], catIdx) => (
                    <FadeIn key={category} delay={catIdx * 0.06}>
                      <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-blue-200 hover:shadow-md transition-all duration-300">
                        <div className="flex items-center gap-2 mb-5">
                          <span className="text-lg">
                            {categoryIcons[category] || "📦"}
                          </span>
                          <h3 className="text-sm font-semibold text-gray-900">
                            {category}
                          </h3>
                        </div>
                        <div className="space-y-3.5">
                          {skills.map((skill: any) => (
                            <div key={skill.id}>
                              <div className="flex justify-between items-center mb-1.5">
                                <span className="text-sm font-medium text-gray-700">
                                  {skill.name}
                                </span>
                                <span className="text-xs font-mono text-gray-400">
                                  {skill.level}%
                                </span>
                              </div>
                              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <motion.div
                                  className="h-full rounded-full"
                                  style={{
                                    background:
                                      "linear-gradient(90deg, #2563eb, #6366f1)",
                                  }}
                                  initial={{ width: 0 }}
                                  whileInView={{
                                    width: `${skill.level}%`,
                                  }}
                                  viewport={{ once: true }}
                                  transition={{
                                    duration: 0.8,
                                    delay: catIdx * 0.06 + 0.2,
                                    ease: "easeOut",
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </FadeIn>
                  )
                )}
              </div>
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════
            PROJECTS
        ═══════════════════════════════════════ */}
        {isSectionEnabled("projects") && (
          <section id="projects" className="scroll-mt-16 py-24 bg-white">
            <div className="max-w-6xl mx-auto px-6 md:px-10">
              <SectionHeader
                badge={projectsData?.meta?.sectionBadge || "WORK"}
                title={projectsData?.meta?.sectionTitle || "Featured Projects"}
                subtitle={
                  projectsData?.meta?.sectionSubtitle ||
                  "Selected projects demonstrating my engineering capabilities."
                }
              />

              {/* Featured Projects */}
              {featuredProjects.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                  {featuredProjects.map((project: any, idx: number) => (
                    <FadeIn key={project.id} delay={idx * 0.08}>
                      <article className="group flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-blue-300 hover:shadow-lg transition-all duration-300 h-full">
                        {project.image && (
                          <div className="relative aspect-video bg-gray-100 overflow-hidden">
                            <img
                              src={project.image}
                              alt={project.name}
                              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-3 right-3">
                              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-1 bg-blue-600 text-white rounded-md">
                                Featured
                              </span>
                            </div>
                          </div>
                        )}
                        <div className="flex flex-col flex-1 p-6">
                          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                            {project.name}
                          </h3>
                          <p className="text-sm text-gray-500 leading-relaxed flex-1 mb-4">
                            {project.description}
                          </p>
                          <div className="flex flex-wrap gap-1.5 mb-5">
                            {(project.technologies || []).map(
                              (tech: string, i: number) => (
                                <span
                                  key={i}
                                  className="text-xs font-medium px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg"
                                >
                                  {tech}
                                </span>
                              )
                            )}
                          </div>
                          <div className="flex gap-4 pt-4 border-t border-gray-100">
                            {project.githubUrl && (
                              <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                              >
                                <GithubIcon className="w-4 h-4" />
                                Source
                              </a>
                            )}
                            {project.demoUrl && (
                              <a
                                href={project.demoUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors ml-auto"
                              >
                                Live Demo
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        </div>
                      </article>
                    </FadeIn>
                  ))}
                </div>
              )}

              {/* Other Projects */}
              {otherProjects.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                    Other Projects
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {otherProjects.map((project: any, idx: number) => (
                      <FadeIn key={project.id} delay={idx * 0.05}>
                        <article className="flex flex-col bg-gray-50 border border-gray-200 rounded-xl p-5 hover:border-blue-200 hover:bg-white hover:shadow-sm transition-all duration-300 h-full">
                          <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                            {project.name}
                          </h4>
                          <p className="text-xs text-gray-500 leading-relaxed flex-1 mb-4 line-clamp-3">
                            {project.description}
                          </p>
                          <div className="flex gap-4 text-xs font-medium">
                            {project.githubUrl && (
                              <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-gray-600 hover:text-gray-900 flex items-center gap-1"
                              >
                                <GithubIcon className="w-3 h-3" /> Code
                              </a>
                            )}
                            {project.demoUrl && (
                              <a
                                href={project.demoUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 hover:text-blue-800 ml-auto flex items-center gap-1"
                              >
                                Demo <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </article>
                      </FadeIn>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════
            EDUCATION
        ═══════════════════════════════════════ */}
        {isSectionEnabled("education") && (
          <section id="education" className="scroll-mt-16 py-24">
            <div className="max-w-6xl mx-auto px-6 md:px-10">
              <SectionHeader
                badge={educationData?.meta?.sectionBadge || "EDUCATION"}
                title={educationData?.meta?.sectionTitle || "Academic Background"}
                subtitle={educationData?.meta?.sectionSubtitle}
              />

              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-5 top-0 bottom-0 w-px bg-gray-200 hidden md:block" />
                <div className="space-y-8">
                  {educationData.items.map((edu: any, idx: number) => (
                    <FadeIn key={edu.id} delay={idx * 0.08}>
                      <div className="flex gap-6 md:gap-10">
                        {/* Timeline dot */}
                        <div className="hidden md:flex flex-col items-center flex-shrink-0">
                          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md z-10">
                            <GraduationCap className="w-5 h-5" />
                          </div>
                        </div>
                        {/* Content */}
                        <div className="flex-1 bg-white border border-gray-200 rounded-2xl p-6 hover:border-blue-200 hover:shadow-md transition-all">
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 mb-3">
                            <div>
                              <h3 className="text-lg font-bold text-gray-900">
                                {edu.degree}
                              </h3>
                              <p className="text-sm font-semibold text-blue-600 mt-0.5">
                                {edu.institution}
                              </p>
                            </div>
                            <div className="flex flex-col items-start md:items-end gap-1.5 flex-shrink-0">
                              <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                                <Calendar className="w-3.5 h-3.5" />
                                {edu.timeline}
                              </span>
                              {edu.cgpa && (
                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                                  <CheckCircle2 className="w-3 h-3" />
                                  CGPA: {edu.cgpa}
                                </span>
                              )}
                            </div>
                          </div>
                          {edu.description && (
                            <p className="text-sm text-gray-500 leading-relaxed mb-3">
                              {edu.description}
                            </p>
                          )}
                          {edu.coursework && edu.coursework.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {edu.coursework.map(
                                (course: string, i: number) => (
                                  <span
                                    key={i}
                                    className="text-[11px] font-medium bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg"
                                  >
                                    {course}
                                  </span>
                                )
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </FadeIn>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════
            ACHIEVEMENTS
        ═══════════════════════════════════════ */}
        {isSectionEnabled("achievements") && (
          <section id="achievements" className="scroll-mt-16 py-24 bg-white">
            <div className="max-w-6xl mx-auto px-6 md:px-10">
              <SectionHeader
                badge={achievementsData?.meta?.sectionBadge || "ACHIEVEMENTS"}
                title={achievementsData?.meta?.sectionTitle || "Recognition & Milestones"}
                subtitle={achievementsData?.meta?.sectionSubtitle}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievementsData.items.map((ach: any, idx: number) => (
                  <FadeIn key={ach.id} delay={idx * 0.06}>
                    <div className="flex gap-4 items-start p-5 bg-gray-50 border border-gray-200 rounded-2xl hover:border-amber-200 hover:bg-amber-50/30 hover:shadow-sm transition-all duration-300">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-500 flex-shrink-0">
                        <AchievementIcon name={ach.icon} className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="font-semibold text-gray-900 text-sm leading-snug">
                            {ach.title}
                          </h3>
                          {ach.date && (
                            <span className="text-[10px] text-gray-400 whitespace-nowrap font-medium flex-shrink-0 mt-0.5">
                              {ach.date}
                            </span>
                          )}
                        </div>
                        {ach.category && (
                          <span className="inline-block text-[10px] uppercase tracking-wider font-semibold text-blue-600 mt-1 mb-1.5">
                            {ach.category}
                          </span>
                        )}
                        {ach.description && (
                          <p className="text-xs text-gray-500 leading-relaxed">
                            {ach.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════
            CERTIFICATIONS
        ═══════════════════════════════════════ */}
        {isSectionEnabled("certifications") && (
          <section id="certifications" className="scroll-mt-16 py-24">
            <div className="max-w-6xl mx-auto px-6 md:px-10">
              <SectionHeader
                badge={certificationsData?.meta?.sectionBadge || "CREDENTIALS"}
                title={certificationsData?.meta?.sectionTitle || "Certifications"}
                subtitle={certificationsData?.meta?.sectionSubtitle}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {certificationsData.items.map((cert: any, idx: number) => (
                  <FadeIn key={cert.id} delay={idx * 0.05}>
                    <div className="group flex gap-4 items-start p-5 bg-white border border-gray-200 rounded-2xl hover:border-blue-200 hover:shadow-md transition-all duration-300 h-full">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0">
                        <Award className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-1">
                          {cert.name}
                        </h3>
                        <p className="text-xs text-gray-500 font-medium mb-0.5">
                          {cert.organization}
                        </p>
                        <p className="text-[10px] text-gray-400 font-mono mb-2">
                          {cert.date}
                        </p>
                        {cert.credentialUrl && (
                          <a
                            href={cert.credentialUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            Verify
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════
            KNOWLEDGE EVOLUTION TIMELINE
        ═══════════════════════════════════════ */}
        {isSectionEnabled("evolution") && evolutionData?.timelineEntries?.length > 0 && (
          <section id="evolution" className="scroll-mt-16 py-24 bg-white">
            <div className="max-w-6xl mx-auto px-6 md:px-10">
              <SectionHeader
                badge={evolutionData?.meta?.sectionBadge || "JOURNEY"}
                title={evolutionData?.meta?.sectionTitle || "Learning Journey"}
                subtitle={evolutionData?.meta?.sectionSubtitle}
              />
              <div className="relative max-w-2xl">
                <div className="absolute left-3 top-0 bottom-0 w-px bg-gray-200" />
                <div className="space-y-8">
                  {(evolutionData?.timelineEntries || [])
                    .filter((e: any) => e.visible !== false)
                    .sort((a: any, b: any) => (a.order ?? 99) - (b.order ?? 99))
                    .map((entry: any, idx: number) => (
                      <FadeIn key={entry.id} delay={idx * 0.06}>
                        <div className="flex gap-6 items-start">
                          <div className="w-6 h-6 rounded-full bg-blue-600 border-2 border-white shadow flex-shrink-0 mt-1 z-10" />
                          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-4 hover:border-blue-200 transition-colors">
                            <div className="flex items-start justify-between gap-3 mb-1">
                              <h4 className="font-semibold text-gray-900 text-sm">
                                {entry.title}
                              </h4>
                              <span className="text-[10px] font-mono text-gray-400 flex-shrink-0">
                                {entry.date}
                              </span>
                            </div>
                            {entry.category && (
                              <span className="text-[10px] uppercase tracking-wider font-semibold text-blue-600">
                                {entry.category}
                              </span>
                            )}
                            {entry.description && (
                              <p className="text-xs text-gray-500 leading-relaxed mt-1.5">
                                {entry.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </FadeIn>
                    ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════
            GITHUB / OPEN SOURCE
        ═══════════════════════════════════════ */}
        {isSectionEnabled("github") && repos.length > 0 && (
          <section id="github" className="scroll-mt-16 py-24">
            <div className="max-w-6xl mx-auto px-6 md:px-10">
              <SectionHeader
                badge="OPEN SOURCE"
                title="GitHub Projects"
                subtitle="Open-source work and public repositories."
              />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {repos.map((repo: any, idx: number) => (
                  <FadeIn key={repo.id || repo.name} delay={idx * 0.05}>
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex flex-col p-5 bg-white border border-gray-200 rounded-2xl hover:border-gray-900 hover:shadow-md transition-all duration-300 h-full"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-9 h-9 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-700 group-hover:bg-gray-900 group-hover:text-white transition-all">
                          <GithubIcon className="w-4 h-4" />
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors opacity-0 group-hover:opacity-100" />
                      </div>
                      <h4 className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-blue-600 transition-colors">
                        {repo.name}
                      </h4>
                      <p className="text-xs text-gray-500 leading-relaxed flex-1 mb-4 line-clamp-2">
                        {repo.description || "No description provided."}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        {repo.language && (
                          <span className="flex items-center gap-1.5">
                            <span
                              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                              style={{
                                background:
                                  langColors[repo.language] || "#94a3b8",
                              }}
                            />
                            {repo.language}
                          </span>
                        )}
                        <span className="flex items-center gap-1 ml-auto">
                          <Star className="w-3.5 h-3.5" />
                          {repo.stargazers_count || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <GitFork className="w-3.5 h-3.5" />
                          {repo.forks_count || 0}
                        </span>
                      </div>
                    </a>
                  </FadeIn>
                ))}
              </div>
              {github?.url && (
                <FadeIn delay={0.2} className="mt-8">
                  <a
                    href={github.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors border border-gray-300 hover:border-gray-900 rounded-xl px-5 py-2.5 bg-white hover:shadow-sm"
                  >
                    <GithubIcon className="w-4 h-4" />
                    View all on GitHub
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </FadeIn>
              )}
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════
            CONTACT / LET'S CONNECT
        ═══════════════════════════════════════ */}
        {isSectionEnabled("contact") && (
          <section id="contact" className="scroll-mt-16 py-24 bg-gray-900">
            <div className="max-w-6xl mx-auto px-6 md:px-10">
              <FadeIn>
                <div className="text-center max-w-xl mx-auto mb-12">
                  <span className="inline-block text-[11px] font-semibold tracking-[0.15em] uppercase text-blue-400 mb-3">
                    CONTACT
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-3">
                    Let's Connect
                  </h2>
                  <p className="text-gray-400 text-base">
                    Open to full-time roles, internships, and collaboration. Reach out through any channel below.
                  </p>
                </div>
              </FadeIn>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl mx-auto">
                {[
                  linkedIn && {
                    icon: <LinkedinIcon className="w-6 h-6" />,
                    label: "LinkedIn",
                    sublabel: "Connect professionally",
                    href: linkedIn.url,
                    color: "#0077B5",
                    bg: "rgba(0,119,181,0.15)",
                  },
                  github && {
                    icon: <GithubIcon className="w-6 h-6" />,
                    label: "GitHub",
                    sublabel: "View my code",
                    href: github.url,
                    color: "#ffffff",
                    bg: "rgba(255,255,255,0.08)",
                  },
                  email && {
                    icon: <Mail className="w-6 h-6" />,
                    label: "Email",
                    sublabel: "Send a message",
                    href: email.url,
                    color: "#6366f1",
                    bg: "rgba(99,102,241,0.15)",
                  },
                  {
                    icon: <FileText className="w-6 h-6" />,
                    label: "Resume",
                    sublabel: "Download PDF",
                    href: resumeLink,
                    color: "#10b981",
                    bg: "rgba(16,185,129,0.15)",
                  },
                ]
                  .filter(Boolean)
                  .map((item: any, idx) => (
                    <FadeIn key={item.label} delay={idx * 0.07}>
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex flex-col items-center gap-3 p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.03] text-center"
                        style={{ background: item.bg }}
                      >
                        <div style={{ color: item.color }}>{item.icon}</div>
                        <div>
                          <div
                            className="font-semibold text-sm"
                            style={{ color: item.color }}
                          >
                            {item.label}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {item.sublabel}
                          </div>
                        </div>
                      </a>
                    </FadeIn>
                  ))}
              </div>
            </div>
          </section>
        )}

        {/* ─── FOOTER ─── */}
        <footer className="py-8 bg-gray-950 border-t border-white/5">
          <div className="max-w-6xl mx-auto px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Shravan Kapare. All rights reserved.
            </p>
            {onThemeSwitch && settingsData?.allowVisitorSwitching && (
              <button
                onClick={() => onThemeSwitch("cosmic")}
                className="text-xs text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Switch to Cosmic Experience
              </button>
            )}
          </div>
        </footer>
      </main>
    </div>
  );
}
