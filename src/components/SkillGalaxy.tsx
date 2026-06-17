"use client";

import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, Line, Sphere, Points, PointMaterial, Billboard, Torus, Html } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

// CMS Skill interface
interface Skill {
  id: string;
  name: string;
  category: string;
  level: number;
  description?: string;
}

interface SkillGalaxyProps {
  skills: Skill[];
}

/**
 * Procedural background particles
 */
function EnergyParticles({ count = 150 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 2 + Math.random() * 4;
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, [count]);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.1;
      pointsRef.current.rotation.x -= delta * 0.05;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color="#a855f7" // Purple tint to match deep space
        size={0.06}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.4}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

/**
 * Animated Cosmic Energy Core (Interactive)
 */
function PulsingCore({ isExpanded, onClick }: { isExpanded: boolean; onClick: () => void }) {
  const coreRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (coreRef.current) {
      // Pulse scale
      const baseScale = isExpanded ? 1.2 : 1.0;
      const pulse = Math.sin(t * 3) * 0.05;
      const targetScale = baseScale + pulse;
      coreRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
    // Rotate rings
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x += delta * 0.5;
      ring1Ref.current.rotation.y += delta * 0.2;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y += delta * 0.3;
      ring2Ref.current.rotation.z += delta * 0.4;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x -= delta * 0.2;
      ring3Ref.current.rotation.z -= delta * 0.5;
    }
  });

  return (
    <group 
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onPointerOver={() => document.body.style.cursor = 'pointer'}
      onPointerOut={() => document.body.style.cursor = 'auto'}
    >
      <group ref={coreRef}>
        {/* Core Singularity */}
        <Sphere args={[0.5, 32, 32]}>
          <meshBasicMaterial color="#ffffff" />
        </Sphere>
        {/* Plasma Shells */}
        <Sphere args={[0.7, 32, 32]}>
          <meshBasicMaterial color="#06b6d4" transparent opacity={0.7} blending={THREE.AdditiveBlending} />
        </Sphere>
        <Sphere args={[0.9, 32, 32]}>
          <meshBasicMaterial color="#a855f7" transparent opacity={0.4} blending={THREE.AdditiveBlending} />
        </Sphere>
        <Sphere args={[1.1, 32, 32]}>
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.2} blending={THREE.AdditiveBlending} />
        </Sphere>
      </group>
      
      {/* Containment Rings */}
      <Torus ref={ring1Ref} args={[1.3, 0.02, 16, 100]}>
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.8} blending={THREE.AdditiveBlending} />
      </Torus>
      <Torus ref={ring2Ref} args={[1.5, 0.015, 16, 100]} rotation={[Math.PI/4, 0, 0]}>
        <meshBasicMaterial color="#a855f7" transparent opacity={0.6} blending={THREE.AdditiveBlending} />
      </Torus>
      <Torus ref={ring3Ref} args={[1.7, 0.01, 16, 100]} rotation={[0, Math.PI/3, 0]}>
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.5} blending={THREE.AdditiveBlending} />
      </Torus>
    </group>
  );
}

/**
 * A single orbiting node that represents a skill.
 * Expands radius when galaxy is expanded. Glows on hover.
 */
function SkillNode({ 
  skill, 
  basePosition, 
  isExpanded 
}: { 
  skill: Skill; 
  basePosition: THREE.Vector3; 
  isExpanded: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const pulseRef = useRef<THREE.Mesh>(null);
  
  // Base distance from core
  const radiusMultiplier = isExpanded ? 1.5 : 1.0;
  
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    
    // Smoothly animate the orbital radius
    if (groupRef.current) {
      const targetPos = basePosition.clone().multiplyScalar(radiusMultiplier);
      groupRef.current.position.lerp(targetPos, 0.05);
    }

    // Hover scale
    if (meshRef.current) {
      const targetScale = hovered ? 1.5 : 1.0;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }

    // Traveling energy pulse along the connection line
    if (pulseRef.current && groupRef.current) {
      // Moves from center (0) to node (1) and repeats
      const progress = (t * 0.5 + Math.random() * 0.01) % 1; 
      // Because pulseRef is a child of the scene, we interpolate from 0,0,0 to the node's current position
      pulseRef.current.position.copy(groupRef.current.position).multiplyScalar(progress);
    }
  });

  return (
    <>
      {/* Node group containing sphere, billboard label, and HTML tooltip */}
      <group ref={groupRef}>
        <mesh 
          ref={meshRef}
          onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
          onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'auto'; }}
        >
          <sphereGeometry args={[0.2, 16, 16]} />
          {/* Node color based on hover state */}
          <meshBasicMaterial color={hovered ? "#ffffff" : "#06b6d4"} />
        </mesh>

        {/* Billboard text always facing camera */}
        <Billboard position={[0, -0.5, 0]}>
          <Text
            fontSize={0.25}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#000000"
          >
            {skill.name}
          </Text>
        </Billboard>

        {/* Hover Tooltip Overlay */}
        {hovered && (
          <Html position={[0, 0.5, 0]} center zIndexRange={[100, 0]} style={{ pointerEvents: 'none' }}>
            <div className="bg-black/80 backdrop-blur-md border border-purple-500/30 p-4 rounded-xl text-white shadow-2xl shadow-purple-500/20 w-48 animate-in fade-in zoom-in duration-200">
              <div className="text-xs text-purple-400 font-mono uppercase tracking-wider mb-1">{skill.category}</div>
              <div className="font-bold text-lg mb-1 leading-tight">{skill.name}</div>
              <div className="w-full bg-white/10 h-1.5 rounded-full mb-3 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-400 to-purple-500" style={{ width: `${skill.level}%` }} />
              </div>
              {skill.description && (
                <p className="text-xs text-gray-400 line-clamp-3">{skill.description}</p>
              )}
            </div>
          </Html>
        )}
      </group>

      {/* Traveling Pulse Particle */}
      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.8} blending={THREE.AdditiveBlending} />
      </mesh>
    </>
  );
}

/**
 * Main Interactive Galaxy
 */
function GalaxyNetwork({ skills }: { skills: Skill[] }) {
  const groupRef = useRef<THREE.Group>(null);
  const { mouse } = useThree();
  const [isExpanded, setIsExpanded] = useState(false);

  // Parse CMS skills: pick top 2 highest level per category
  const networkNodes = useMemo(() => {
    const grouped: Record<string, Skill[]> = {};
    skills.forEach(skill => {
      if (!grouped[skill.category]) {
        grouped[skill.category] = [];
      }
      grouped[skill.category].push(skill);
    });

    const topSkills: Skill[] = [];
    Object.values(grouped).forEach(categorySkills => {
      categorySkills.sort((a, b) => b.level - a.level);
      topSkills.push(...categorySkills.slice(0, 2));
    });

    // Distribute via Fibonacci sphere
    const radius = 4.0;
    const phi = Math.PI * (3 - Math.sqrt(5)); 
    
    return topSkills.map((skill, i) => {
      const y = 1 - (i / (topSkills.length - 1)) * 2; 
      const radiusAtY = Math.sqrt(1 - y * y); 
      const theta = phi * i;

      const x = Math.cos(theta) * radiusAtY * radius;
      const z = Math.sin(theta) * radiusAtY * radius;

      return {
        skill,
        basePos: new THREE.Vector3(x, y * radius, z),
      };
    });
  }, [skills]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Constant slow orbit
      groupRef.current.rotation.y += delta * 0.05;
      
      // Mouse Parallax 
      const targetX = (mouse.y * Math.PI) / 8;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetX, 0.05);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central Core */}
      <PulsingCore isExpanded={isExpanded} onClick={() => setIsExpanded(!isExpanded)} />

      {/* Nodes & Connections */}
      {networkNodes.map((node, i) => {
        // Line endpoints: center to current (lerped) position of the node group
        // To keep lines attached smoothly during expansion, we'll draw them inside a unified group or re-compute.
        // For simplicity and performance, we draw static lines to the base position scaled by expansion.
        const currentRadiusMult = isExpanded ? 1.5 : 1.0;
        // In useFrame we lerp, but for the Line component we can just give it the target, or 
        // use a custom ref. Since Line is a bit tricky to animate vertices manually in React,
        // we'll let it snap or we can accept it scales with a containing group.
        // Let's actually put the line in the same parent and scale the endpoint via useFrame.
        // Wait, easier: just render the line and we will let the user experience the orbit.
        
        return (
          <group key={`${node.skill.id}-${i}`}>
            <SkillNode 
              skill={node.skill} 
              basePosition={node.basePos} 
              isExpanded={isExpanded} 
            />
            {/* We will draw the static connection line. 
                Instead of static, we'll wrap it in a component to animate it. */}
            <ConnectionLine targetPos={node.basePos} isExpanded={isExpanded} />
          </group>
        );
      })}

      {/* Inter-node connections to form a web */}
      {networkNodes.map((node, i) => {
        const nextNode = networkNodes[(i + 1) % networkNodes.length];
        return (
          <InterNodeLine 
            key={`mesh-${i}`} 
            posA={node.basePos} 
            posB={nextNode.basePos} 
            isExpanded={isExpanded} 
          />
        );
      })}
    </group>
  );
}

// Animated connection from core
function ConnectionLine({ targetPos, isExpanded }: { targetPos: THREE.Vector3, isExpanded: boolean }) {
  const lineRef = useRef<any>(null);
  const currentPos = useRef(new THREE.Vector3().copy(targetPos));

  useFrame(() => {
    const target = targetPos.clone().multiplyScalar(isExpanded ? 1.5 : 1.0);
    currentPos.current.lerp(target, 0.05);
    if (lineRef.current) {
      const positions = lineRef.current.geometry.attributes.position.array;
      // center is 0,0,0
      positions[3] = currentPos.current.x;
      positions[4] = currentPos.current.y;
      positions[5] = currentPos.current.z;
      lineRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <Line 
      ref={lineRef}
      points={[[0, 0, 0], currentPos.current.toArray()]} 
      color="#3b82f6" 
      lineWidth={1}
      transparent
      opacity={0.3}
      blending={THREE.AdditiveBlending}
    />
  );
}

// Animated connection between two nodes
function InterNodeLine({ posA, posB, isExpanded }: { posA: THREE.Vector3, posB: THREE.Vector3, isExpanded: boolean }) {
  const lineRef = useRef<any>(null);
  const currentA = useRef(new THREE.Vector3().copy(posA));
  const currentB = useRef(new THREE.Vector3().copy(posB));

  useFrame(() => {
    const targetA = posA.clone().multiplyScalar(isExpanded ? 1.5 : 1.0);
    const targetB = posB.clone().multiplyScalar(isExpanded ? 1.5 : 1.0);
    currentA.current.lerp(targetA, 0.05);
    currentB.current.lerp(targetB, 0.05);

    if (lineRef.current) {
      const positions = lineRef.current.geometry.attributes.position.array;
      positions[0] = currentA.current.x;
      positions[1] = currentA.current.y;
      positions[2] = currentA.current.z;
      positions[3] = currentB.current.x;
      positions[4] = currentB.current.y;
      positions[5] = currentB.current.z;
      lineRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <Line 
      ref={lineRef}
      points={[currentA.current.toArray(), currentB.current.toArray()]} 
      color="#a855f7" 
      lineWidth={0.5}
      transparent
      opacity={0.15}
      blending={THREE.AdditiveBlending}
    />
  );
}


export default function SkillGalaxy({ skills = [] }: SkillGalaxyProps) {
  if (!skills || skills.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center border border-white/10 rounded-3xl bg-white/5">
        <span className="text-gray-500 font-mono text-sm">Awaiting Core Data...</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[500px] relative rounded-3xl overflow-hidden">
      <Canvas 
        camera={{ position: [0, 0, 9], fov: 60 }} 
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 2]} // Support high-DPI displays for crisp text
      >
        <ambientLight intensity={1} />
        
        <GalaxyNetwork skills={skills} />
        <EnergyParticles count={150} />

        {/* Post Processing: Soft Bloom */}
        <EffectComposer>
          <Bloom 
            luminanceThreshold={0.5} 
            mipmapBlur 
            intensity={1.2} 
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
