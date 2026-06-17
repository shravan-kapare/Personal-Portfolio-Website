"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { useState, useRef, Suspense, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

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

// Deterministic version of inSphere — generates points uniformly inside a sphere
function deterministicInSphere(count: number, radius: number, seed: number): Float32Array {
  const rng = seededRandom(seed);
  const positions = new Float32Array(count * 3);
  
  for (let i = 0; i < count; i++) {
    // Spherical coordinates with uniform distribution inside the sphere
    const u = rng();
    const v = rng();
    const w = rng();
    
    const theta = u * 2 * Math.PI;
    const phi = Math.acos(2 * v - 1);
    const r = radius * Math.cbrt(w); // cbrt for uniform volume distribution
    
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  
  return positions;
}

function ParticleEnvironment() {
  const ref = useRef<any>(null);
  const [sphere] = useState(() => deterministicInSphere(5000, 25, 12345));

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 20;
      ref.current.rotation.y -= delta / 30;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#a855f7" // Purple
          size={0.03}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.6}
        />
      </Points>
    </group>
  );
}

function CameraController() {
  const { camera, scene } = useThree();
  
  useEffect(() => {
    const posAnim = gsap.to(camera.position, {
      z: -20,
      y: -5,
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      }
    });

    const rotAnim = gsap.to(camera.rotation, {
      z: Math.PI / 8,
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      }
    });

    // Color transitioning based on active section
    const visualState = {
      bgColor: "#020008",
      particleColor: "#a855f7",
    };

    const sections = [
      { id: "#home", bg: "#020008", particle: "#a855f7" },
      { id: "#about", bg: "#030012", particle: "#3b82f6" },
      { id: "#skills", bg: "#000511", particle: "#06b6d4" },
      { id: "#projects", bg: "#00060e", particle: "#3b82f6" },
      { id: "#education", bg: "#050010", particle: "#a855f7" },
      { id: "#evolution", bg: "#090400", particle: "#fbbf24" },
      { id: "#achievements", bg: "#090400", particle: "#fbbf24" },
      { id: "#certifications", bg: "#000511", particle: "#06b6d4" },
      { id: "#contact", bg: "#04000c", particle: "#a855f7" },
    ];

    const triggers: any[] = [];

    sections.forEach((sec) => {
      const el = document.getElementById(sec.id.replace("#", ""));
      if (el) {
        const trigger = gsap.to(visualState, {
          bgColor: sec.bg,
          particleColor: sec.particle,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top center",
            end: "bottom center",
            scrub: true,
            onUpdate: () => {
              if (scene.background instanceof THREE.Color) {
                scene.background.set(visualState.bgColor);
              }
              if (scene.fog) {
                scene.fog.color.set(visualState.bgColor);
              }
              scene.traverse((child) => {
                if (child instanceof THREE.Points && child.material) {
                  const mat = child.material as THREE.PointsMaterial;
                  if (mat.color) {
                    mat.color.set(visualState.particleColor);
                  }
                }
              });
            }
          }
        });
        triggers.push(trigger);
      }
    });

    return () => {
      posAnim.kill();
      rotAnim.kill();
      triggers.forEach((t) => t.kill());
    };
  }, [camera, scene]);

  return null;
}

import TechGalaxy from "./TechGalaxy";

export default function GlobalCanvas({ skills = [] }: { skills?: any[] }) {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-[-1] bg-black">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }} gl={{ antialias: false, powerPreference: "high-performance" }}>
        <color attach="background" args={["#020008"]} />
        <fog attach="fog" args={["#020008", 10, 30]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} />
        
        <Suspense fallback={null}>
          <ParticleEnvironment />
          {skills && skills.length > 0 && <TechGalaxy skills={skills} />}
          <CameraController />
        </Suspense>
      </Canvas>
    </div>
  );
}
