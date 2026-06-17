"use client";

import { motion } from "framer-motion";

interface AnimatedSectionProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  animation?: "fadeUp" | "fadeIn" | "scaleUp";
}

export default function AnimatedSection({ children, delay = 0, className = "", animation = "fadeUp" }: AnimatedSectionProps) {
  const variants: any = {
    fadeUp: {
      hidden: { opacity: 0, y: 50 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] } }
    },
    fadeIn: {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.8, delay, ease: "easeOut" } }
    },
    scaleUp: {
      hidden: { opacity: 0, scale: 0.95 },
      visible: { opacity: 1, scale: 1, transition: { duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] } }
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={variants[animation]}
      className={className}
    >
      {children}
    </motion.div>
  );
}
