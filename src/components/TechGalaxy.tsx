"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { Text, Line } from "@react-three/drei";

interface TechGalaxyProps {
  skills: any[];
}

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

// Simple string hash to create a seed from a skill name + id
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return Math.abs(hash);
}

export default function TechGalaxy({ skills }: TechGalaxyProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Create nodes with deterministic positions within a sphere, clustered by category
  const nodes = useMemo(() => {
    const categories = Array.from(new Set(skills.map(s => s.category)));
    
    return skills.map((skill, i) => {
      const categoryIndex = categories.indexOf(skill.category);
      // Base position for the cluster
      const angle = (categoryIndex / categories.length) * Math.PI * 2;
      const radius = 10;
      const clusterX = Math.cos(angle) * radius;
      const clusterY = Math.sin(angle) * radius;
      
      // Deterministic offset within the cluster using skill-specific seed
      const rng = seededRandom(hashString(`${skill.name}-${skill.id}-${i}`));
      const x = clusterX + (rng() - 0.5) * 5;
      const y = clusterY + (rng() - 0.5) * 5;
      const z = (rng() - 0.5) * 5 - 15; // Placed at z: -15, where the camera travels
      
      return { ...skill, position: [x, y, z] };
    });
  }, [skills]);

  // Create connections between skills in the same category
  const connections = useMemo(() => {
    const lines: { start: number[], end: number[] }[] = [];
    
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].category === nodes[j].category) {
          lines.push({ start: nodes[i].position, end: nodes[j].position });
        }
      }
    }
    return lines;
  }, [nodes]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05;
      groupRef.current.rotation.z += delta * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Render Connections */}
      {connections.map((line, idx) => (
        <Line 
          key={idx} 
          points={[line.start as [number, number, number], line.end as [number, number, number]]} 
          color="#a855f7" 
          lineWidth={0.5} 
          transparent 
          opacity={0.2} 
        />
      ))}

      {/* Render Planets/Nodes */}
      {nodes.map((node) => (
        <group key={node.id} position={node.position as [number, number, number]}>
          <mesh>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshBasicMaterial color="#d8b4fe" />
          </mesh>
          <Text 
            position={[0, -0.6, 0]} 
            fontSize={0.4} 
            color="white" 
            anchorX="center" 
            anchorY="middle"
          >
            {node.name}
          </Text>
        </group>
      ))}
    </group>
  );
}
