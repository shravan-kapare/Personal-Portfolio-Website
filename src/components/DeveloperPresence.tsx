"use client";

import AnimatedSection from "./AnimatedSection";
import { ExternalLink } from "lucide-react";

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

// LeetCode icon (code brackets)
const LeetCodeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

// GeeksforGeeks-style icon (terminal/code)
const GFGIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polyline points="4 17 10 11 4 5" />
    <line x1="12" y1="19" x2="20" y2="19" />
  </svg>
);

const presenceLinks = [
  {
    name: "GitHub",
    href: "https://github.com/shravan-kapare",
    icon: GithubIcon,
    description: "Open Source Projects",
    color: "group-hover:text-white",
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/shravan-kapare",
    icon: LinkedinIcon,
    description: "Professional Network",
    color: "group-hover:text-blue-400",
  },
  {
    name: "LeetCode",
    href: "https://leetcode.com/u/shravan_kapare/",
    icon: LeetCodeIcon,
    description: "Problem Solving",
    color: "group-hover:text-amber-400",
  },
  {
    name: "GeeksforGeeks",
    href: "https://www.geeksforgeeks.org/profile/shravanka4ap7",
    icon: GFGIcon,
    description: "DSA Practice",
    color: "group-hover:text-green-400",
  },
];

/**
 * DeveloperPresence — shows coding platform links and developer identity
 * Placed after the Projects section in the portfolio layout.
 */
export default function DeveloperPresence({ sectionData }: { sectionData?: any }) {
  return (
    <section id="developer-presence" className="py-24 px-6 md:px-16 lg:px-24">
      <AnimatedSection animation="fadeUp">
        <div className="flex items-center gap-3 mb-4 justify-center">
          <div className="w-8 h-px bg-gradient-to-r from-transparent to-purple-500" />
          <span className="text-xs text-purple-400 uppercase tracking-[0.2em] font-mono">
            {sectionData?.badge || "Presence"}
          </span>
          <div className="w-8 h-px bg-gradient-to-r from-purple-500 to-transparent" />
        </div>
        <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center tracking-tight">
          {(sectionData?.name || "Developer Presence").split(" ")[0]}{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
            {(sectionData?.name || "Developer Presence").split(" ").slice(1).join(" ")}
          </span>
        </h2>
        {sectionData?.subtitle && (
          <p className="text-center text-gray-400 max-w-2xl mx-auto -mt-10 mb-16">
            {sectionData.subtitle}
          </p>
        )}
      </AnimatedSection>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
        {presenceLinks.map((link, idx) => {
          const Icon = link.icon;
          return (
            <AnimatedSection
              key={link.name}
              animation="scaleUp"
              delay={idx * 0.1}
              className="group"
            >
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white/[0.02] border border-white/[0.06] hover:border-purple-500/20 rounded-2xl p-6 transition-all duration-500 h-full relative overflow-hidden hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="relative z-10 text-center space-y-3">
                  <div className={`w-12 h-12 mx-auto rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 ${link.color} transition-colors duration-300`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                    {link.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {link.description}
                  </p>
                  <div className="flex items-center justify-center gap-1 text-[10px] text-gray-600 group-hover:text-purple-400 transition-colors uppercase tracking-widest">
                    <ExternalLink className="w-3 h-3" />
                    Visit Profile
                  </div>
                </div>
              </a>
            </AnimatedSection>
          );
        })}
      </div>
    </section>
  );
}
