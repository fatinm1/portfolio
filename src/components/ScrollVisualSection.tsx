"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import type { Mesh } from "three";

function MetallicBlob({ scrollProgress }: { scrollProgress: number }) {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    meshRef.current.rotation.x = t * 0.15 + scrollProgress * Math.PI * 0.5;
    meshRef.current.rotation.y = t * 0.2 + scrollProgress * Math.PI;
    meshRef.current.position.y = Math.sin(t * 0.5) * 0.1;
  });

  return (
    <mesh ref={meshRef} scale={2.2}>
      <torusKnotGeometry args={[0.6, 0.2, 128, 32]} />
      <meshPhysicalMaterial
        color="#0a0a0a"
        metalness={0.95}
        roughness={0.1}
        envMapIntensity={1.2}
        clearcoat={0.3}
        clearcoatRoughness={0.2}
      />
    </mesh>
  );
}

function Scene({ scrollProgress }: { scrollProgress: number }) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} />
      <directionalLight position={[-5, -5, 5]} intensity={0.8} />
      <pointLight position={[0, 0, 5]} intensity={1} color="#ffffff" />
      <Environment preset="night" />
      <MetallicBlob scrollProgress={scrollProgress} />
    </>
  );
}

export default function ScrollVisualSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);
  const [scrollValue, setScrollValue] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const scrollProgress = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 0.5], [60, 0]);

  useMotionValueEvent(scrollProgress, "change", (v) => setScrollValue(v));

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <motion.section
      ref={sectionRef}
      style={{ y }}
      className="relative min-h-[70vh] w-full flex items-center justify-center overflow-hidden border-t border-white/10"
    >
      <motion.div
        style={{ opacity, scale }}
        className="relative w-full max-w-2xl aspect-square mx-auto"
      >
        {mounted && (
          <div className="absolute inset-0 w-full h-full">
            <Canvas
              camera={{ position: [0, 0, 4], fov: 45 }}
              gl={{ antialias: true, alpha: true }}
              className="w-full h-full"
            >
              <Scene scrollProgress={scrollValue} />
            </Canvas>
          </div>
        )}
      </motion.div>
    </motion.section>
  );
}
