"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useMemo } from "react";

// Deterministic seeded random number generator (mulberry32)
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Particle {
  width: number;
  height: number;
  color: string;
  left: string;
  top: string;
  duration: number;
  delay: number;
}

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Generate particles only on the client after mount
  const particles = useMemo<Particle[]>(() => {
    if (!mounted) return [];
    const rng = seededRandom(42);
    return Array.from({ length: 30 }, (_, i) => {
      const size = rng() * 3 + 1;
      return {
        width: size,
        height: size,
        color: i % 3 === 0 ? "#a855f7" : i % 3 === 1 ? "#3b82f6" : "#06b6d4",
        left: `${rng() * 100}%`,
        top: `${rng() * 100}%`,
        duration: 3 + rng() * 3,
        delay: rng() * 2,
      };
    });
  }, [mounted]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Accelerating progress curve
        const increment = prev < 60 ? 3 : prev < 85 ? 2 : 1;
        return Math.min(prev + increment, 100);
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      const timeout = setTimeout(() => setIsLoading(false), 400);
      return () => clearTimeout(timeout);
    }
  }, [progress]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ background: "linear-gradient(135deg, #020008 0%, #0a0018 50%, #020008 100%)" }}
        >
          {/* Floating particles in background — only rendered after mount */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((p, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: p.width,
                  height: p.height,
                  background: p.color,
                  left: p.left,
                  top: p.top,
                  opacity: 0.3,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.2, 0.6, 0.2],
                }}
                transition={{
                  duration: p.duration,
                  repeat: Infinity,
                  delay: p.delay,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          {/* Logo / Name */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="relative mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400">
                S.K.
              </span>
            </h1>
            {/* Glow behind text */}
            <div
              className="absolute inset-0 blur-3xl opacity-30"
              style={{ background: "radial-gradient(circle, #a855f7 0%, transparent 70%)" }}
            />
          </motion.div>

          {/* Progress bar */}
          <div className="w-48 md:w-64 relative">
            <div className="h-[2px] w-full bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: "linear-gradient(90deg, #a855f7, #3b82f6, #06b6d4)",
                  width: `${progress}%`,
                }}
                transition={{ duration: 0.1 }}
              />
            </div>

            {/* Progress text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center text-xs text-gray-500 mt-4 font-mono tracking-[0.3em] uppercase"
            >
              {progress < 100 ? "Initializing" : "Ready"}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
