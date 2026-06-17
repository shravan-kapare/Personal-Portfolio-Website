"use client";

import GlobalCanvas from "@/components/GlobalCanvas";
import Navbar from "@/components/Navbar";
import GithubSection from "@/components/GithubSection";
import DeveloperPresence from "@/components/DeveloperPresence";
import Footer from "@/components/Footer";
import LoadingScreen from "@/components/LoadingScreen";
import SkillGalaxy from "@/components/SkillGalaxy";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowDown,
  ExternalLink,
  GitBranch,
  Award,
  BookOpen,
} from "lucide-react";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

import KnowledgeTimeline from "@/components/KnowledgeTimeline";
import AnimatedSection from "@/components/AnimatedSection";

interface ClientHomeProps {
  aboutData: any;
  skillsData: any[];
  projectsData: any[];
  educationData: any[];
  achievementsData: any[];
  certificationsData: any[];
  sectionsData: any[];
}

// Section divider component
function SectionDivider({ color = "purple" }: { color?: string }) {
  const gradients: Record<string, string> = {
    purple: "from-transparent via-purple-500/25 to-transparent",
    blue: "from-transparent via-blue-500/25 to-transparent",
    cyan: "from-transparent via-cyan-500/25 to-transparent",
    gold: "from-transparent via-amber-500/25 to-transparent",
  };

  const dots: Record<string, string> = {
    purple: "bg-purple-500/80 shadow-[0_0_12px_rgba(168,85,247,0.8)]",
    blue: "bg-blue-500/80 shadow-[0_0_12px_rgba(59,130,246,0.8)]",
    cyan: "bg-cyan-500/80 shadow-[0_0_12px_rgba(6,182,212,0.8)]",
    gold: "bg-amber-500/80 shadow-[0_0_12px_rgba(245,158,11,0.8)]",
  };

  return (
    <div className="relative py-12 flex items-center justify-center">
      <div className={`absolute h-[1px] w-full max-w-5xl bg-gradient-to-r ${gradients[color] || gradients.purple}`} />
      <div className={`w-1.5 h-1.5 rounded-full relative z-10 animate-pulse-glow ${dots[color] || dots.purple}`} />
    </div>
  );
}

export default function ClientHome({
  aboutData,
  skillsData,
  projectsData,
  educationData,
  achievementsData,
  certificationsData,
  sectionsData,
}: ClientHomeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const isSectionEnabled = (sectionId: string) => {
    if (!sectionsData || sectionsData.length === 0) {
      if (sectionId === "achievements" || sectionId === "certifications") return false;
      return true;
    }
    const sec = sectionsData.find((s: any) => s.id === sectionId);
    return sec ? sec.enabled : false;
  };

  // Client-only year to prevent hydration mismatch at timezone/year boundaries
  const [currentYear, setCurrentYear] = useState(2026);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  // Group skills by category
  const skillsByCategory = skillsData.reduce((acc: any, skill: any) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  // Separate featured and other projects
  const featuredProjects = projectsData.filter((p: any) => p.featured);
  const otherProjects = projectsData.filter((p: any) => !p.featured);

  return (
    <main
      ref={containerRef}
      className="relative w-full selection:bg-purple-500/30 selection:text-white text-white"
      style={{ fontFamily: "var(--font-space), sans-serif" }}
    >
      <LoadingScreen />
      <GlobalCanvas skills={skillsData} />
      <Navbar sectionsData={sectionsData} />

      <div className="relative z-10">
        {/* ================================================================ */}
        {/* HERO SECTION                                                     */}
        {/* ================================================================ */}
        <section
          id="home"
          className="min-h-screen flex flex-col items-center justify-center relative px-6 text-center"
        >
          {/* Ambient glow behind hero */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none opacity-20"
            style={{
              background:
                "radial-gradient(circle, rgba(168,85,247,0.3) 0%, transparent 60%)",
              filter: "blur(80px)",
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
            className="space-y-8 relative"
          >
            {/* Overline */}
            <motion.p
              initial={{ opacity: 0, letterSpacing: "0.5em" }}
              animate={{ opacity: 1, letterSpacing: "0.3em" }}
              transition={{ delay: 2.2, duration: 0.8 }}
              className="text-xs md:text-sm text-gray-500 uppercase tracking-[0.3em] font-mono"
            >
              Portfolio / {currentYear}
            </motion.p>

            {/* Main heading */}
            <h1 className="text-6xl sm:text-7xl md:text-9xl font-bold tracking-[-0.04em] leading-[0.9]">
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.0, duration: 0.8 }}
                className="block text-transparent bg-clip-text"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.6) 100%)",
                }}
              >
                Shravan
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.2, duration: 0.8 }}
                className="block text-gradient animate-gradient bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500"
              >
                Kapare.
              </motion.span>
            </h1>

            {/* Subtitle with typing reveal */}
            <div className="text-lg md:text-2xl text-gray-400 font-light max-w-lg mx-auto leading-relaxed min-h-[2rem]">
              {(aboutData.heading || "Computer Science Engineer").split("").map((char: string, i: number) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    delay: 2.5 + i * 0.03,
                    duration: 0.1,
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </div>

            {/* Tags with staggered float animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.8 }}
              className="flex gap-3 justify-center mt-6 flex-wrap"
            >
              {["AR Developer", "ML Enthusiast", "IoT Innovator"].map(
                (tag, i) => (
                  <motion.span
                    key={tag}
                    initial={{ opacity: 0, y: 15, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      delay: 2.8 + i * 0.15,
                      duration: 0.6,
                      type: "spring",
                      stiffness: 100,
                    }}
                    className="px-4 py-2 bg-white/[0.03] border border-white/[0.06] rounded-full text-xs text-gray-400 font-medium tracking-wider uppercase backdrop-blur-sm hover:bg-white/[0.06] hover:border-purple-500/20 hover:text-gray-300 transition-all duration-300 cursor-default animate-float shadow-lg"
                    style={{ animationDelay: `${i * 1.5}s` }}
                  >
                    {tag}
                  </motion.span>
                )
              )}
            </motion.div>
          </motion.div>

          {/* Premium Mouse Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.5, duration: 0.8 }}
            className="absolute bottom-10 flex flex-col items-center gap-3 cursor-pointer"
            onClick={() => {
              const aboutSec = document.getElementById("about");
              if (aboutSec) aboutSec.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <span className="text-[9px] text-gray-500 uppercase tracking-[0.4em] font-mono">
              Scroll Down
            </span>
            <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center p-1 relative">
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-purple-400"
                animate={{
                  y: [0, 12, 0],
                  opacity: [1, 0.2, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
          </motion.div>
        </section>

        <SectionDivider color="purple" />

        {/* ================================================================ */}
        {/* ABOUT SECTION                                                    */}
        {/* ================================================================ */}
        {isSectionEnabled("about") && (
          <>
            <section
              id="about"
              className="min-h-screen flex items-center px-6 md:px-16 lg:px-24 py-24"
            >
              <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">
                
                {/* Left Column: Text & Stats */}
                <AnimatedSection className="w-full space-y-8 bg-white/[0.02] backdrop-blur-xl p-8 md:p-14 rounded-3xl border border-white/[0.06] relative overflow-hidden">
                  {/* Decorative corner glow */}
                  <div
                    className="absolute -top-20 -right-20 w-40 h-40 rounded-full pointer-events-none"
                    style={{
                      background: "radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)",
                      filter: "blur(40px)",
                    }}
                  />

                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-px bg-gradient-to-r from-purple-500 to-transparent" />
                    <span className="text-xs text-purple-400 uppercase tracking-[0.2em] font-mono">
                      About
                    </span>
                  </div>

                  <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                    Identity{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                      Core
                    </span>
                  </h2>

                  <div className="space-y-4 text-base md:text-lg text-gray-400 leading-relaxed">
                    {aboutData.paragraphs?.map((p: string, idx: number) => (
                      <p key={idx}>{p}</p>
                    )) || <p>No about data found.</p>}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-white/[0.06]">
                    {[
                      { value: `${projectsData.length}+`, label: "Projects" },
                      { value: `${achievementsData.length}+`, label: "Achievements" },
                      { value: `${skillsData.length}`, label: "Technologies" },
                      { value: "∞", label: "Curiosity" },
                    ].map((stat, i) => (
                      <div key={i} className="text-center md:text-left">
                        <div className="text-2xl md:text-3xl font-bold text-white">
                          {stat.value}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 uppercase tracking-wider">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </AnimatedSection>

                {/* Right Column: 3D Visualization */}
                <AnimatedSection animation="fadeIn" delay={0.2} className="w-full h-[500px] lg:h-[600px] relative">
                  <SkillGalaxy skills={skillsData} />
                </AnimatedSection>

              </div>
            </section>
            <SectionDivider color="blue" />
          </>
        )}



        {/* ================================================================ */}
        {/* SKILLS SECTION                                                   */}
        {/* ================================================================ */}
        {isSectionEnabled("skills") && (
          <>
            <section
              id="skills"
              className="min-h-screen flex flex-col justify-center px-6 md:px-16 lg:px-24 py-24"
            >
          <AnimatedSection animation="fadeUp">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-gradient-to-r from-blue-500 to-transparent" />
              <span className="text-xs text-blue-400 uppercase tracking-[0.2em] font-mono">
                Expertise
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-16 tracking-tight">
              Skills{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                Laboratory
              </span>
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Object.keys(skillsByCategory).map((category, idx) => (
              <AnimatedSection
                key={idx}
                animation="scaleUp"
                delay={idx * 0.1}
                className="group"
              >
                <div className="relative bg-white/[0.02] backdrop-blur-lg p-7 rounded-2xl h-full border border-white/[0.06] hover:border-purple-500/20 transition-all duration-500 overflow-hidden">
                  {/* Hover glow */}
                  <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  <h3 className="text-sm font-semibold mb-6 text-purple-400 uppercase tracking-widest relative z-10">
                    {category}
                  </h3>
                  <ul className="space-y-3 relative z-10">
                    {skillsByCategory[category].map((skill: any) => (
                      <li
                        key={skill.id}
                        className="flex items-center justify-between group/item"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-400/60 group-hover/item:bg-blue-400 transition-colors" />
                          <span className="text-sm text-gray-300 group-hover/item:text-white transition-colors">
                            {skill.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                              style={{ width: `${skill.level}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-gray-600 font-mono w-7 text-right">
                            {skill.level}%
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            ))}
          </div>
            </section>
            <SectionDivider color="cyan" />
          </>
        )}



        {/* ================================================================ */}
        {/* PROJECTS SECTION                                                 */}
        {/* ================================================================ */}
        {isSectionEnabled("projects") && (
          <>
            <section
              id="projects"
              className="min-h-screen py-24 px-6 md:px-16 lg:px-24"
            >
          <AnimatedSection animation="fadeUp">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-gradient-to-r from-cyan-500 to-transparent" />
              <span className="text-xs text-cyan-400 uppercase tracking-[0.2em] font-mono">
                Work
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-16 tracking-tight">
              Innovation{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                Command Center
              </span>
            </h2>
          </AnimatedSection>

          {/* Featured Projects */}
          {featuredProjects.length > 0 && (
            <div className="space-y-16 mb-20">
              {featuredProjects.map((project: any, idx: number) => (
                <AnimatedSection
                  key={project.id}
                  animation="fadeUp"
                  delay={0.2}
                >
                  <div
                    className={`grid md:grid-cols-2 gap-8 md:gap-12 items-center`}
                  >
                    <div
                      className={`aspect-video rounded-2xl flex flex-col items-center justify-center overflow-hidden relative group border border-white/[0.06] ${
                        idx % 2 !== 0 ? "md:order-2" : ""
                      }`}
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(168,85,247,0.03) 0%, rgba(6,182,212,0.03) 100%)",
                      }}
                    >
                      {/* High-tech mesh grid in CSS */}
                      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px] group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-transparent to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                      
                      {/* Glowing center orb */}
                      <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-500/20 to-cyan-500/20 filter blur-xl group-hover:scale-125 transition-transform duration-700 animate-pulse-glow" />
                      
                      {/* Featured badge */}
                      <div className="absolute top-4 left-4 px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-[10px] text-purple-300 uppercase tracking-widest font-semibold z-10">
                        ★ Featured Project
                      </div>

                      <div className="relative z-10 flex flex-col items-center gap-2">
                        <span className="text-[10px] text-purple-400 font-mono tracking-widest uppercase opacity-80">
                          HOLOGRAPHIC DATA SYSTEM
                        </span>
                        <span className="text-xs text-gray-500 tracking-wider font-light">
                          Mainframe Interface Online
                        </span>
                      </div>
                    </div>

                    <div
                      className={`space-y-5 ${
                        idx % 2 !== 0 ? "md:order-1" : ""
                      }`}
                    >
                      <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
                        {project.name}
                      </h3>
                      <p className="text-gray-400 leading-relaxed">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies?.map((tech: string) => (
                          <span
                            key={tech}
                            className="px-3 py-1 bg-white/[0.03] border border-white/[0.06] rounded-lg text-xs text-gray-400 font-mono hover:border-purple-500/30 hover:text-purple-300 hover:shadow-[0_0_10px_rgba(168,85,247,0.15)] transition-all duration-300"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      {(project.githubUrl || project.demoUrl) && (
                        <div className="flex gap-4 pt-2">
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors group/link"
                            >
                              <GitBranch className="w-4 h-4" />
                              <span className="border-b border-transparent group-hover/link:border-white transition-all">
                                Source Code
                              </span>
                            </a>
                          )}
                          {project.demoUrl && (
                            <a
                              href={project.demoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors group/link"
                            >
                              <ExternalLink className="w-4 h-4" />
                              <span className="border-b border-transparent group-hover/link:border-purple-300 transition-all">
                                Live Demo
                              </span>
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          )}

          {/* Other Projects Grid */}
          {otherProjects.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {otherProjects.map((project: any, idx: number) => (
                <AnimatedSection
                  key={project.id}
                  animation="scaleUp"
                  delay={idx * 0.1}
                  className="group"
                >
                  <div className="bg-white/[0.01] border border-white/[0.06] rounded-2xl p-6 h-full hover:border-purple-500/30 hover:-translate-y-1.5 transition-all duration-500 relative overflow-hidden group shadow-lg">
                    <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    
                    {/* Glowing corner dot */}
                    <div className="absolute -top-10 -right-10 w-20 h-20 rounded-full bg-purple-500/10 filter blur-md opacity-0 group-hover:opacity-100 transition-all duration-500" />

                    <div className="relative z-10">
                      <h3 className="text-lg font-bold mb-2 group-hover:text-purple-300 transition-colors">
                        {project.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {project.technologies
                          ?.slice(0, 3)
                          .map((tech: string) => (
                            <span
                              key={tech}
                              className="px-2 py-0.5 bg-white/[0.03] border border-white/[0.06] rounded text-[10px] text-gray-500 font-mono group-hover:border-purple-500/20 group-hover:text-purple-300/80 transition-all duration-300"
                            >
                              {tech}
                            </span>
                          ))}
                      </div>
                      <div className="flex gap-3">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-gray-500 hover:text-white transition-colors"
                          >
                            GitHub →
                          </a>
                        )}
                        {project.demoUrl && (
                          <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                          >
                            Demo →
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          )}

          {projectsData.length === 0 && (
            <p className="text-gray-500 text-center">
              No projects added yet. Mainframe waiting for initialization.
            </p>
          )}
            </section>
            <SectionDivider color="blue" />
          </>
        )}

        {/* ================================================================ */}
        {/* DEVELOPER PRESENCE SECTION                                       */}
        {/* ================================================================ */}
        <DeveloperPresence />
        <SectionDivider color="cyan" />



        {/* ================================================================ */}
        {/* EDUCATION SECTION                                                */}
        {/* ================================================================ */}
        {isSectionEnabled("education") && (
          <>
            <section
              id="education"
              className="min-h-screen flex flex-col justify-center px-6 md:px-16 lg:px-24 py-24"
            >
          <AnimatedSection animation="fadeUp">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-gradient-to-r from-blue-500 to-transparent" />
              <span className="text-xs text-blue-400 uppercase tracking-[0.2em] font-mono">
                Education
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-16 tracking-tight">
              Timeline{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Corridor
              </span>
            </h2>
          </AnimatedSection>

          <AnimatedSection
            animation="fadeUp"
            delay={0.2}
            className="max-w-2xl border-l-2 border-white/10 ml-4 pl-8 space-y-16"
          >
            {educationData.map((edu: any) => (
              <div key={edu.id} className="relative">
                <div className="absolute -left-[41px] top-2 w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 ring-4 ring-black shadow-[0_0_15px_rgba(59,130,246,0.4)]" />
                <div className="flex items-center gap-2 mb-1">
                  <BookOpen className="w-4 h-4 text-blue-400" />
                  <span className="text-xs text-blue-400 uppercase tracking-widest font-mono">
                    Degree
                  </span>
                </div>
                <h3 className="text-2xl font-bold mt-2">
                  {edu.degree || "Degree"}
                </h3>
                <p className="text-lg text-gray-400 mt-1">
                  {edu.institution || "Institution"}
                </p>
                <p className="text-sm text-purple-400 mt-1 font-mono">
                  {edu.timeline || "Timeline"}
                </p>
                {edu.coursework &&
                  edu.coursework.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {edu.coursework.map(
                        (course: string, i: number) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-white/[0.04] border border-white/[0.06] rounded-lg text-xs text-gray-400"
                          >
                            {course}
                          </span>
                        )
                      )}
                    </div>
                  )}
              </div>
            ))}
            {educationData.length === 0 && (
              <p className="text-gray-500">No education history added yet.</p>
            )}
          </AnimatedSection>
            </section>
            <SectionDivider color="gold" />
          </>
        )}



        {/* ================================================================ */}
        {/* KNOWLEDGE EVOLUTION SECTION                                      */}
        {/* ================================================================ */}
        <section id="evolution" className="min-h-screen py-24 px-6 md:px-16 lg:px-24">
          <AnimatedSection animation="fadeUp">
            <div className="flex items-center gap-3 mb-4 justify-center">
              <div className="w-8 h-px bg-gradient-to-r from-transparent to-gold-500" />
              <span className="text-xs text-amber-400 uppercase tracking-[0.2em] font-mono">
                Journey
              </span>
              <div className="w-8 h-px bg-gradient-to-r from-amber-500 to-transparent" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center tracking-tight">
              Knowledge{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
                Evolution
              </span>
            </h2>
          </AnimatedSection>
          <AnimatedSection animation="fadeUp" delay={0.2}>
            <KnowledgeTimeline
              skills={skillsData}
              projects={projectsData}
              achievements={achievementsData}
              certifications={certificationsData}
            />
          </AnimatedSection>
        </section>

        <SectionDivider color="purple" />

        {/* ================================================================ */}
        {/* ACHIEVEMENTS SECTION                                             */}
        {/* ================================================================ */}
        {isSectionEnabled("achievements") && (
          <>
            <section
              id="achievements"
              className="min-h-screen flex items-center justify-center px-6 md:px-16 lg:px-24 py-24"
            >
          <div className="max-w-5xl w-full">
            <AnimatedSection animation="fadeUp">
              <div className="flex items-center gap-3 mb-4 justify-center">
                <div className="w-8 h-px bg-gradient-to-r from-transparent to-amber-500" />
                <span className="text-xs text-amber-400 uppercase tracking-[0.2em] font-mono">
                  Recognition
                </span>
                <div className="w-8 h-px bg-gradient-to-r from-amber-500 to-transparent" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center tracking-tight">
                Achievement{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">
                  Vault
                </span>
              </h2>
            </AnimatedSection>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
              {achievementsData.map((achievement: any, idx: number) => {
                const themes = [
                  {
                    gradient: "from-yellow-500/10",
                    border: "hover:border-yellow-500/20",
                    icon: "text-yellow-400",
                    glow: "rgba(234,179,8,0.1)",
                  },
                  {
                    gradient: "from-blue-500/10",
                    border: "hover:border-blue-500/20",
                    icon: "text-blue-400",
                    glow: "rgba(59,130,246,0.1)",
                  },
                  {
                    gradient: "from-green-500/10",
                    border: "hover:border-green-500/20",
                    icon: "text-green-400",
                    glow: "rgba(34,197,94,0.1)",
                  },
                  {
                    gradient: "from-purple-500/10",
                    border: "hover:border-purple-500/20",
                    icon: "text-purple-400",
                    glow: "rgba(168,85,247,0.1)",
                  },
                  {
                    gradient: "from-pink-500/10",
                    border: "hover:border-pink-500/20",
                    icon: "text-pink-400",
                    glow: "rgba(236,72,153,0.1)",
                  },
                ];
                const theme = themes[idx % themes.length];

                return (
                  <AnimatedSection
                    key={achievement.id}
                    animation="scaleUp"
                    delay={idx * 0.1}
                    className="group"
                  >
                    <div
                      className={`bg-gradient-to-b ${theme.gradient} to-transparent bg-white/[0.01] p-6 rounded-2xl border border-white/[0.06] ${theme.border} text-center transition-all duration-500 relative overflow-hidden h-full`}
                    >
                      <div
                        className={`w-14 h-14 mx-auto rounded-xl flex items-center justify-center mb-4 ${theme.icon} bg-black/40 border border-current/20`}
                      >
                        <Award className="w-6 h-6" />
                      </div>
                      <h3 className="text-base font-bold mb-2 group-hover:text-white transition-colors">
                        {achievement.title}
                      </h3>
                      <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                        {achievement.description}
                      </p>
                      <span
                        className={`text-[10px] ${theme.icon} font-mono uppercase tracking-wider`}
                      >
                        {achievement.date}
                      </span>
                    </div>
                  </AnimatedSection>
                );
              })}
              {achievementsData.length === 0 && (
                <p className="text-gray-500 col-span-3 text-center">
                  No achievements added yet.
                </p>
              )}
            </div>
          </div>
            </section>
            <SectionDivider color="blue" />
          </>
        )}

        {/* ================================================================ */}
        {/* CERTIFICATIONS SECTION                                           */}
        {/* ================================================================ */}
        {isSectionEnabled("certifications") && certificationsData.length > 0 && (
          <>
            <section
              id="certifications"
              className="py-24 px-6 md:px-16 lg:px-24"
            >
            <AnimatedSection animation="fadeUp">
              <div className="flex items-center gap-3 mb-4 justify-center">
                <div className="w-8 h-px bg-gradient-to-r from-transparent to-cyan-500" />
                <span className="text-xs text-cyan-400 uppercase tracking-[0.2em] font-mono">
                  Credentials
                </span>
                <div className="w-8 h-px bg-gradient-to-r from-cyan-500 to-transparent" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center tracking-tight">
                Certification{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                  Archive
                </span>
              </h2>
            </AnimatedSection>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
              {certificationsData.map((cert: any, idx: number) => (
                <AnimatedSection
                  key={cert.id}
                  animation="scaleUp"
                  delay={idx * 0.1}
                  className="group"
                >
                  <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 hover:border-cyan-500/20 transition-all duration-500 relative overflow-hidden h-full">
                    <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    <div className="relative z-10">
                      <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4 text-cyan-400">
                        📜
                      </div>
                      <h3 className="text-base font-bold mb-1 group-hover:text-cyan-300 transition-colors">
                        {cert.name}
                      </h3>
                      <p className="text-xs text-gray-500 mb-1">
                        {cert.organization}
                      </p>
                      <p className="text-xs text-gray-600 font-mono">
                        {cert.date}
                      </p>
                      {cert.credentialUrl && (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-4 inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Verify Credential
                        </a>
                      )}
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
            </section>
            <SectionDivider color="purple" />
          </>
        )}



        {/* ================================================================ */}
        {/* GITHUB SECTION                                                   */}
        {/* ================================================================ */}
        {sectionsData && sectionsData.filter((s: any) => s.custom && s.enabled).map((sec: any) => (
          <div key={sec.id}>
            <section id={sec.href.replace("#", "")} className="min-h-screen flex items-center px-6 md:px-16 lg:px-24 py-24">
              <AnimatedSection className="max-w-3xl space-y-8 bg-white/[0.02] backdrop-blur-xl p-8 md:p-14 rounded-3xl border border-white/[0.06] relative overflow-hidden">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-px bg-gradient-to-r from-purple-500 to-transparent" />
                  <span className="text-xs text-purple-400 uppercase tracking-[0.2em] font-mono">
                    {sec.name}
                  </span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                  {sec.name}
                </h2>
                <div className="space-y-4 text-base md:text-lg text-gray-400 leading-relaxed whitespace-pre-line">
                  {sec.content}
                </div>
              </AnimatedSection>
            </section>
            <SectionDivider color="purple" />
          </div>
        ))}

        <GithubSection username="shravan-kapare" />
        <SectionDivider color="blue" />

        {/* ================================================================ */}
        {/* CONTACT SECTION                                                  */}
        {/* ================================================================ */}
        <section
          id="contact"
          className="min-h-screen flex items-center justify-center px-6 py-24"
        >
          <AnimatedSection
            animation="scaleUp"
            className="max-w-md w-full relative"
          >
            {/* Background glow */}
            <div
              className="absolute -inset-20 rounded-full pointer-events-none opacity-30"
              style={{
                background:
                  "radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 60%)",
                filter: "blur(60px)",
              }}
            />

            <div className="relative bg-white/[0.02] backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-white/[0.06]">
              <div className="flex items-center gap-3 mb-2 justify-center">
                <div className="w-8 h-px bg-gradient-to-r from-transparent to-purple-500" />
                <span className="text-xs text-purple-400 uppercase tracking-[0.2em] font-mono">
                  Contact
                </span>
                <div className="w-8 h-px bg-gradient-to-r from-purple-500 to-transparent" />
              </div>

              <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center tracking-tight">
                Communication{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                  Terminal
                </span>
              </h2>

              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Designation / Name"
                  className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.05] transition-all duration-300"
                />
                <input
                  type="email"
                  placeholder="Signal Origin (Email)"
                  className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.05] transition-all duration-300"
                />
                <textarea
                  placeholder="Message Payload"
                  rows={4}
                  className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.05] transition-all duration-300 resize-none"
                />
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-sm font-semibold py-3 rounded-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Transmit Signal
                </button>
              </form>
            </div>
          </AnimatedSection>
        </section>

        {/* ================================================================ */}
        {/* FOOTER                                                           */}
        {/* ================================================================ */}
        <Footer />
      </div>
    </main>
  );
}
