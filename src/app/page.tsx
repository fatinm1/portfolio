"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// More precise deterministic random function
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  const result = x - Math.floor(x);
  // Round to 4 decimal places to ensure consistency
  return Math.round(result * 10000) / 10000;
}

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Pre-calculate all particle data to ensure consistency
  const particles = Array.from({ length: 30 }, (_, i) => {
    const seed = i * 123.456;
    return {
      width: Math.round((seededRandom(seed) * 40 + 20) * 100) / 100,
      height: Math.round((seededRandom(seed + 1) * 40 + 20) * 100) / 100,
      top: Math.round(seededRandom(seed + 2) * 90 * 100) / 100,
      left: Math.round(seededRandom(seed + 3) * 90 * 100) / 100,
      yOffset: Math.round((seededRandom(seed + 4) * 40 - 20) * 100) / 100,
      xOffset: Math.round((seededRandom(seed + 5) * 40 - 20) * 100) / 100,
      duration: Math.round((seededRandom(seed + 6) * 6 + 4) * 100) / 100,
    };
  });

  // Don't render particles until client-side to prevent hydration issues
  if (!isClient) {
    return (
      <div className="relative flex flex-col items-center justify-center min-h-[80vh] overflow-hidden">
        {/* Static background without particles */}
        <div className="absolute inset-0 -z-10">
          <div className="w-full h-full bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#232526] opacity-80" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center max-w-2xl mx-auto"
        >
          <h1 className="text-4xl sm:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-300 drop-shadow-lg">
            Fatin Mojumder
          </h1>
          <h2 className="text-xl sm:text-2xl font-semibold mb-2 text-white/80">
            Senior CS Major at UMBC
          </h2>
          <p className="text-lg sm:text-xl mb-8 text-white/70">
            Building smart systems for real-world impact
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/projects" className="px-8 py-3 rounded-full bg-cyan-500/80 hover:bg-cyan-400 text-white font-bold shadow-lg transition-all backdrop-blur-md">
              View Projects
            </a>
            <a href="/contact" className="px-8 py-3 rounded-full bg-white/10 border border-cyan-400 text-cyan-200 font-bold shadow-lg hover:bg-cyan-400/20 hover:text-white transition-all backdrop-blur-md">
              Contact Me
            </a>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[80vh] overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 -z-10">
        <div className="w-full h-full bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#232526] opacity-80" />
        <div className="absolute inset-0 pointer-events-none">
          {/* Simple animated dots/particles */}
          {particles.map((particle, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full bg-white/10 blur-lg"
              style={{
                width: `${particle.width}px`,
                height: `${particle.height}px`,
                top: `${particle.top}%`,
                left: `${particle.left}%`,
              }}
              animate={{
                y: [0, particle.yOffset, 0],
                x: [0, particle.xOffset, 0],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center max-w-2xl mx-auto"
      >
        <h1 className="text-4xl sm:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-300 drop-shadow-lg">
          Fatin Mojumder
        </h1>
        <h2 className="text-xl sm:text-2xl font-semibold mb-2 text-white/80">
          Senior CS Major at UMBC
        </h2>
        <p className="text-lg sm:text-xl mb-8 text-white/70">
          Building smart systems for real-world impact
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/projects" className="px-8 py-3 rounded-full bg-cyan-500/80 hover:bg-cyan-400 text-white font-bold shadow-lg transition-all backdrop-blur-md">
            View Projects
          </a>
          <a href="/contact" className="px-8 py-3 rounded-full bg-white/10 border border-cyan-400 text-cyan-200 font-bold shadow-lg hover:bg-cyan-400/20 hover:text-white transition-all backdrop-blur-md">
            Contact Me
          </a>
        </div>
      </motion.div>
    </div>
  );
}
