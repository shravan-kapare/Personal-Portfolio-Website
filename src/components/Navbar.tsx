"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FileText, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLenis } from "lenis/react";

interface NavbarProps {
  sectionsData?: { id: string; name: string; href: string; enabled: boolean }[];
}

export default function Navbar({ sectionsData = [] }: NavbarProps) {
  const lenis = useLenis();
  const [active, setActive] = useState("#home");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = sectionsData.length > 0 
    ? sectionsData.filter(s => s.enabled)
    : [
        { name: "Home", href: "#home" },
        { name: "About", href: "#about" },
        { name: "Skills", href: "#skills" },
        { name: "Projects", href: "#projects" },
        { name: "Education", href: "#education" },
        { name: "Contact", href: "#contact" },
      ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const sections = links.map(
        (link) => document.querySelector(link.href) as HTMLElement
      );
      const scrollPos = window.scrollY + window.innerHeight / 2;

      let currentActive = "#home";
      sections.forEach((section) => {
        if (section && section.offsetTop <= scrollPos) {
          currentActive = `#${section.id}`;
        }
      });
      setActive(currentActive);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    setMobileOpen(false);
    if (lenis) {
      lenis.scrollTo(href);
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? "py-3 px-4 md:px-6"
            : "py-4 px-4 md:px-8"
        }`}
      >
        <div
          className={`max-w-7xl mx-auto flex justify-between items-center rounded-2xl transition-all duration-500 ${
            scrolled
              ? "bg-black/60 backdrop-blur-xl border border-white/[0.06] px-5 py-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
              : "px-2"
          }`}
        >
          {/* Logo */}
          <div
            className="font-bold tracking-tighter text-lg cursor-pointer group flex items-center gap-2"
            onClick={() => lenis?.scrollTo(0)}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 group-hover:from-purple-300 group-hover:to-cyan-400 transition-all duration-500">
              S. Kapare
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-0.5 bg-white/[0.03] backdrop-blur-md border border-white/[0.06] rounded-full px-1.5 py-1">
            {links.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`relative px-4 py-1.5 text-xs font-medium uppercase tracking-wider rounded-full transition-all duration-300 ${
                  active === link.href
                    ? "text-white"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {active === link.href && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 rounded-full bg-white/10 border border-white/[0.08]"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}
                <span className="relative z-10">{link.name}</span>
              </a>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600/80 to-blue-600/80 hover:from-purple-500 hover:to-blue-500 backdrop-blur-md rounded-full text-xs font-semibold text-white transition-all border border-white/10 hover:border-white/20 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Resume</span>
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-[#0a0012]/95 backdrop-blur-2xl border-l border-white/[0.06] md:hidden flex flex-col"
            >
              {/* Close */}
              <div className="flex justify-end p-6">
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
                  aria-label="Close menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Links */}
              <nav className="flex-1 px-6 space-y-1">
                {links.map((link, idx) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 + 0.1 }}
                    className={`block px-4 py-3.5 rounded-xl text-sm font-medium uppercase tracking-wider transition-all ${
                      active === link.href
                        ? "text-white bg-white/10 border border-white/[0.08]"
                        : "text-gray-500 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {link.name}
                  </motion.a>
                ))}
              </nav>

              {/* Mobile Resume Button */}
              <div className="p-6 border-t border-white/5">
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-sm font-semibold text-white"
                >
                  <FileText className="w-4 h-4" />
                  Download Resume
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
