"use client";

import { Mail, Code, Terminal, ArrowRight } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

// --- Icon Mapper ---
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

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
  </svg>
);

const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.97C18.88 4 12 4 12 4s-6.88 0-8.59.45A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.97C5.12 20 12 20 12 20s6.88 0 8.59-.45a2.78 2.78 0 0 0 1.95-1.97A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
  </svg>
);

const DiscordIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" {...props}>
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
  </svg>
);

function getPlatformIcon(platform: string) {
  const p = platform.toLowerCase();
  if (p === "github") return GithubIcon;
  if (p === "linkedin") return LinkedinIcon;
  if (p === "instagram") return InstagramIcon;
  if (p === "twitter" || p === "x" || p === "x/twitter") return TwitterIcon;
  if (p === "youtube") return YoutubeIcon;
  if (p === "discord") return DiscordIcon;
  if (p === "leetcode") return Code;
  if (p === "geeksforgeeks") return Terminal;
  return Mail; // Default fallback for Email and unknown
}

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  visible: boolean;
  order: number;
}

interface ConnectSectionProps {
  socialData?: SocialLink[];
  settingsData?: any;
}

const DEFAULT_SOCIAL: SocialLink[] = [
  { id: "github", platform: "GitHub", url: "https://github.com/shravan-kapare", visible: true, order: 1 },
  { id: "linkedin", platform: "LinkedIn", url: "https://www.linkedin.com/in/shravan-kapare", visible: true, order: 2 },
  { id: "email", platform: "Email", url: "mailto:shravankapare2004@gmail.com", visible: true, order: 3 },
  { id: "leetcode", platform: "LeetCode", url: "https://leetcode.com/u/shravan_kapare/", visible: true, order: 4 },
  { id: "geeksforgeeks", platform: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/profile/shravanka4ap7", visible: true, order: 5 },
  { id: "instagram", platform: "Instagram", url: "https://www.instagram.com/shravan_kapare", visible: true, order: 6 },
];

export default function ConnectSection({ socialData, settingsData }: ConnectSectionProps) {
  const resolvedData = (socialData && socialData.length > 0 ? socialData : DEFAULT_SOCIAL)
    .filter((s) => s.visible !== false)
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));

  const linkedIn = resolvedData.find((s) => s.platform.toLowerCase() === "linkedin");
  const secondaryLinks = resolvedData.filter((s) => s.platform.toLowerCase() !== "linkedin");

  const connectHeadingParts = (settingsData?.connectHeading || "Let's Connect").split(" ");
  const connectFirstPart = connectHeadingParts[0];
  const connectSecondPart = connectHeadingParts.slice(1).join(" ") || "Connect";

  return (
    <section id="contact" className="min-h-screen flex items-center justify-center px-6 py-24 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-64 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl w-full relative z-10">
        <AnimatedSection animation="fadeUp" className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-blue-500" />
            <span className="text-sm text-blue-400 uppercase tracking-[0.3em] font-mono font-medium">Network</span>
            <div className="w-12 h-px bg-gradient-to-r from-blue-500 to-transparent" />
          </div>
          <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
            {connectFirstPart}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400">
              {connectSecondPart}
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Open to internships, collaborations, technical discussions, and innovative opportunities.
          </p>
        </AnimatedSection>

        <div className="flex flex-col gap-8">
          {/* PRIMARY: LinkedIn (or first visible link if LinkedIn hidden) */}
          {linkedIn && (
            <AnimatedSection animation="scaleUp" delay={0.2} className="w-full">
              <a
                href={linkedIn.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block w-full bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] hover:border-blue-500/50 rounded-3xl p-8 md:p-10 transition-all duration-500 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative flex flex-col md:flex-row items-center md:justify-between gap-6 md:gap-10">
                  <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 text-center md:text-left">
                    <div className="w-20 h-20 md:w-24 md:h-24 mx-auto md:mx-0 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 p-[1px] shadow-[0_0_40px_rgba(59,130,246,0.3)] group-hover:shadow-[0_0_60px_rgba(59,130,246,0.5)] transition-shadow duration-500 flex-shrink-0">
                      <div className="w-full h-full bg-[#0a0012] rounded-2xl flex items-center justify-center">
                        <LinkedinIcon className="w-10 h-10 md:w-12 md:h-12 text-blue-400 group-hover:scale-110 transition-transform duration-500" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Connect on LinkedIn</h3>
                      <p className="text-gray-400 text-sm md:text-base max-w-md">
                        My preferred platform for professional networking, internships, collaborations, and career opportunities.
                      </p>
                    </div>
                  </div>
                  <div className="flex mx-auto md:mx-0 items-center justify-center w-12 h-12 rounded-full bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-500 flex-shrink-0">
                    <ArrowRight className="w-6 h-6 -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                  </div>
                </div>
              </a>
            </AnimatedSection>
          )}

          {/* SECONDARY GRID */}
          {secondaryLinks.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {secondaryLinks.map((link, i) => {
                const Icon = getPlatformIcon(link.platform);
                return (
                  <AnimatedSection key={link.id} animation="fadeUp" delay={0.3 + i * 0.1}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative flex flex-col items-center justify-center gap-4 bg-white/[0.02] backdrop-blur-md border border-white/[0.05] hover:border-white/[0.15] hover:bg-white/[0.04] rounded-2xl p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                    >
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors duration-300" />
                      </div>
                      <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors duration-300 text-center">
                        {link.platform}
                      </span>
                    </a>
                  </AnimatedSection>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
