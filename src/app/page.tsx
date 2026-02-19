"use client";

import { motion } from "framer-motion";
import Link from "next/link";

// Tools & technologies in moving headline
const TOOLS = [
  "UMBC", "GitHub", "React", "OpenAI", "LangChain", "MySQL",
  "Python", "C++", "Java", "JavaScript", "TypeScript", "Django", "Flask", "FastAPI",
  "Git", "Figma", "Jira", "VS Code", "PyCharm", "Docker", "PostgreSQL",
  "Next.js", "Tailwind", "Node.js", "MongoDB", "Jenkins", "GitHub Actions",
];

export default function Home() {
  return (
    <div>
    <div className="relative min-h-[85vh] flex flex-col justify-center px-6 sm:px-10">
      {/* Available to Work Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-[#C8FF00]/30">
          <span className="w-2 h-2 rounded-full bg-[#C8FF00] animate-pulse" />
          <span className="text-sm font-medium text-white/80 tracking-wide">AVAILABLE TO WORK</span>
        </div>
      </motion.div>

      {/* Hero Headline */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="max-w-4xl"
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
          <span className="text-white">Building &amp; Simplifying</span>
          <br />
          <span className="text-white font-serif" style={{ fontFamily: "var(--font-playfair), serif" }}>
            <span className="relative inline-block">
              smart systems
              <span className="absolute -inset-1 rounded-full border-2 border-[#C8FF00]/50 -z-10" />
            </span>
          </span>
          <br />
          <span className="text-[#C8FF00]">by design.</span>
        </h1>
        <p className="text-lg sm:text-xl text-white/70 max-w-2xl mb-12">
          Senior CS Major at UMBC. Translating complex technology into functional, cohesive systems with real-world impact.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            href="/projects" 
            className="inline-flex px-8 py-3 rounded-lg bg-[#C8FF00] text-black font-bold hover:bg-[#C8FF00]/90 transition-colors"
          >
            View Projects
          </Link>
          <Link 
            href="/contact" 
            className="inline-flex px-8 py-3 rounded-lg border-2 border-[#C8FF00] text-[#C8FF00] font-bold hover:bg-[#C8FF00]/10 transition-colors"
          >
            Contact Me
          </Link>
        </div>
      </motion.div>
    </div>

    {/* Moving Headline - Technologies & Platforms */}
    <section className="py-16 border-t border-white/10 overflow-hidden">
      <h2 className="text-sm font-medium tracking-[0.2em] text-white/60 text-center mb-10 uppercase">
        Technologies & Platforms
      </h2>
      <div className="relative">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...TOOLS, ...TOOLS].map((tool, i) => (
            <span
              key={`${tool}-${i}`}
              className="mx-6 sm:mx-10 text-white/50 text-lg sm:text-xl font-medium"
            >
              {tool}
            </span>
          ))}
        </div>
      </div>
    </section>
    </div>
  );
}
