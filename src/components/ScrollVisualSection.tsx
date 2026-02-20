"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import type { Group } from "three";

const matProps = {
  color: "#1a1a1a",
  metalness: 0.7,
  roughness: 0.3,
  emissive: "#C8FF00",
  emissiveIntensity: 0.1,
};

function HumanWithWave({ scrollTrigger }: { scrollTrigger: number }) {
  const waveArmRef = useRef<Group>(null);
  const wavePhaseRef = useRef(0);

  useEffect(() => {
    wavePhaseRef.current = 0.01;
  }, [scrollTrigger]);

  useFrame((_, delta) => {
    if (!waveArmRef.current) return;
    if (wavePhaseRef.current > 0 && wavePhaseRef.current < 1) {
      wavePhaseRef.current = Math.min(1, wavePhaseRef.current + delta * 3);
      if (wavePhaseRef.current >= 1) wavePhaseRef.current = 0;
    }
    const t = wavePhaseRef.current;
    const wave = t > 0 ? Math.sin(t * Math.PI) * 0.7 : 0;
    waveArmRef.current.rotation.x = -0.6 + wave;
    waveArmRef.current.rotation.z = 0.25 + wave * 0.4;
  });

  return (
    <group scale={1.5} position={[0, -0.5, 0]}>
      {/* Head */}
      <mesh position={[0, 1.1, 0]}>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshPhysicalMaterial {...matProps} />
      </mesh>
      {/* Torso */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.2, 0.25, 0.6, 16]} />
        <meshPhysicalMaterial {...matProps} />
      </mesh>
      {/* Left arm - down */}
      <group position={[-0.35, 0.7, 0]} rotation={[0, 0, 0.3]}>
        <mesh>
          <cylinderGeometry args={[0.05, 0.05, 0.5, 8]} />
          <meshPhysicalMaterial {...matProps} />
        </mesh>
      </group>
      {/* Right arm - waving */}
      <group ref={waveArmRef} position={[0.35, 0.75, 0]} rotation={[-0.5, 0, 0.3]}>
        <mesh position={[0.15, -0.2, 0]} rotation={[0, 0, -0.5]}>
          <cylinderGeometry args={[0.05, 0.05, 0.35, 8]} />
          <meshPhysicalMaterial {...matProps} />
        </mesh>
        {/* Hand */}
        <mesh position={[0.28, -0.35, 0]}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshPhysicalMaterial {...matProps} emissiveIntensity={0.2} />
        </mesh>
      </group>
      {/* Legs */}
      <mesh position={[-0.12, -0.2, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.5, 8]} />
        <meshPhysicalMaterial {...matProps} />
      </mesh>
      <mesh position={[0.12, -0.2, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.5, 8]} />
        <meshPhysicalMaterial {...matProps} />
      </mesh>
    </group>
  );
}

function Scene({ scrollTrigger }: { scrollTrigger: number }) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <directionalLight position={[-5, 5, 5]} intensity={0.6} />
      <pointLight position={[0, 0, 4]} intensity={1} color="#ffffff" />
      <pointLight position={[0, 1, 2]} intensity={1.5} color="#C8FF00" decay={2} />
      <Environment preset="night" />
      <HumanWithWave scrollTrigger={scrollTrigger} />
    </>
  );
}

export default function ScrollVisualSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);
  const [scrollTrigger, setScrollTrigger] = useState(0);
  const lastScrollRef = useRef(0);

  const { scrollY } = useScroll();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 0.5], [60, 0]);

  useMotionValueEvent(scrollY, "change", (v) => {
    const delta = v - lastScrollRef.current;
    lastScrollRef.current = v;
    if (Math.abs(delta) > 10) setScrollTrigger((t) => t + 1);
  });

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
        className="relative w-full max-w-md aspect-square mx-auto"
      >
        {mounted && (
          <div className="absolute inset-0 w-full h-full">
            <Canvas
              camera={{ position: [0, 0, 4], fov: 45 }}
              gl={{ antialias: true, alpha: true }}
              className="w-full h-full"
            >
              <Scene scrollTrigger={scrollTrigger} />
            </Canvas>
          </div>
        )}
      </motion.div>
    </motion.section>
  );
}
