"use client";

import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, Line, Points, PointMaterial, Billboard, Html } from "@react-three/drei";
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

/* ════════════════════════════════════════════════════════════
 * GLSL 3-D Simplex Noise  (Ashima Arts / Stefan Gustavson)
 * ════════════════════════════════════════════════════════════ */
const glslNoise = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(
    i.z+vec4(0.0,i1.z,i2.z,1.0))
    +i.y+vec4(0.0,i1.y,i2.y,1.0))
    +i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

/* ── Core plasma surface: vertex shader ── */
const coreVertexShader = /* glsl */ `
uniform float uTime;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vViewDir;
${glslNoise}
void main(){
  vNormal  = normalize(normalMatrix * normal);
  vPosition = position;
  float d  = snoise(position * 2.5 + uTime * 0.3) * 0.07
           + snoise(position * 5.0 + uTime * 0.5) * 0.035;
  vec3 pos = position + normal * d;
  vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
  vViewDir = normalize(-mvPos.xyz);
  gl_Position = projectionMatrix * mvPos;
}`;

/* ── Core plasma surface: fragment shader ── */
const coreFragmentShader = /* glsl */ `
uniform float uTime;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vViewDir;
${glslNoise}
void main(){
  float n1 = snoise(vPosition * 3.0 + uTime * 0.15);
  float n2 = snoise(vPosition * 6.0 - uTime * 0.2);
  float n3 = snoise(vPosition * 1.5 + uTime * 0.1);
  float veins = pow(abs(sin(n1 * 4.0 + uTime * 0.25)), 4.0);
  vec3 white  = vec3(0.95, 0.98, 1.0);
  vec3 cyan   = vec3(0.024, 0.714, 0.831);
  vec3 purple = vec3(0.659, 0.333, 0.969);
  vec3 blue   = vec3(0.231, 0.510, 0.961);
  vec3 col = mix(white, cyan, smoothstep(-0.2, 0.6, n1));
  col = mix(col, purple, smoothstep(0.1, 0.8, n2) * 0.4);
  col = mix(col, blue,   smoothstep(0.0, 0.7, n3) * 0.3);
  col += veins * cyan * 0.4;
  float fresnel = pow(1.0 - max(dot(vNormal, vViewDir), 0.0), 2.5);
  col += fresnel * mix(purple, cyan, sin(uTime * 0.4) * 0.5 + 0.5) * 0.8;
  col *= sin(uTime * 1.0) * 0.03 + 0.97;
  col *= 1.5;
  gl_FragColor = vec4(col, 1.0);
}`;

/* ── Outer plasma shell: vertex shader ── */
const shellVertexShader = /* glsl */ `
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vViewDir;
void main(){
  vNormal   = normalize(normalMatrix * normal);
  vPosition = position;
  vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
  vViewDir  = normalize(-mvPos.xyz);
  gl_Position = projectionMatrix * mvPos;
}`;

/* ── Outer plasma shell: fragment shader ── */
const shellFragmentShader = /* glsl */ `
uniform float uTime;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vViewDir;
${glslNoise}
void main(){
  float n = snoise(vPosition * 2.0 + uTime * 0.15);
  float fresnel = pow(1.0 - max(dot(vNormal, vViewDir), 0.0), 1.8);
  vec3 cyan   = vec3(0.024, 0.714, 0.831);
  vec3 purple = vec3(0.659, 0.333, 0.969);
  vec3 col = mix(cyan, purple, n * 0.5 + 0.5) * 1.8;
  float alpha = fresnel * (0.22 + n * 0.1);
  alpha *= sin(uTime * 0.8) * 0.04 + 0.96;
  gl_FragColor = vec4(col, alpha);
}`;

/**
 * Orbiting energy particles that swirl around the cosmic core
 */
function CoreOrbitingParticles({ count = 35 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const particleData = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        radius: 0.7 + Math.random() * 0.7,
        speed: 0.15 + Math.random() * 0.6,
        offset: Math.random() * Math.PI * 2,
        tilt: (Math.random() - 0.5) * Math.PI,
      })),
    [count],
  );

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    particleData.forEach((p, i) => {
      arr[i * 3] = Math.cos(p.offset) * p.radius;
      arr[i * 3 + 1] = Math.sin(p.offset) * p.radius * Math.sin(p.tilt);
      arr[i * 3 + 2] = Math.sin(p.offset) * p.radius * Math.cos(p.tilt);
    });
    return arr;
  }, [count, particleData]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    particleData.forEach((p, i) => {
      const angle = t * p.speed + p.offset;
      positions[i * 3] = Math.cos(angle) * p.radius;
      positions[i * 3 + 1] = Math.sin(angle) * p.radius * Math.sin(p.tilt);
      positions[i * 3 + 2] = Math.sin(angle) * p.radius * Math.cos(p.tilt);
    });
    if (ref.current) {
      ref.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color="#06b6d4"
        size={0.05}
        sizeAttenuation
        depthWrite={false}
        opacity={0.9}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

/**
 * Elegant cosmic dust/energy ring rotating around the core
 */
function CosmicDustRing({ 
  radius, 
  count = 45, 
  speed = 0.12, 
  color = "#06b6d4", 
  tiltX = 0,
  tiltZ = 0
}: { 
  radius: number; 
  count?: number; 
  speed?: number; 
  color?: string; 
  tiltX?: number;
  tiltZ?: number;
}) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.05;
      arr[i * 3] = Math.cos(angle) * radius;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 0.03; // very narrow height spread
      arr[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return arr;
  }, [count, radius]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ref.current) {
      ref.current.rotation.y = t * speed;
    }
  });

  return (
    <group rotation={[tiltX, 0, tiltZ]}>
      <Points ref={ref} positions={positions} stride={3}>
        <PointMaterial
          transparent
          color={color}
          size={0.035}
          sizeAttenuation
          depthWrite={false}
          opacity={0.55}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
}

/**
 * Animated Cosmic Energy Core — a living miniature star.
 * Custom GLSL shaders produce noise-displaced plasma surface,
 * energy veins, fresnel edge glow, and breathing pulse.
 */
function PulsingCore({ isExpanded, onClick }: { isExpanded: boolean; onClick: () => void }) {
  const coreRef = useRef<THREE.Group>(null);
  const coreMtlRef = useRef<THREE.ShaderMaterial>(null);
  const shellMtlRef = useRef<THREE.ShaderMaterial>(null);

  const coreUniforms = useMemo(() => ({ uTime: { value: 0 } }), []);
  const shellUniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (coreMtlRef.current) coreMtlRef.current.uniforms.uTime.value = t;
    if (shellMtlRef.current) shellMtlRef.current.uniforms.uTime.value = t;
    if (coreRef.current) {
      const base = isExpanded ? 1.15 : 1.0;
      const pulse = Math.sin(t * 1.0) * 0.015; // Slow breathing, lower amplitude
      const s = base + pulse;
      coreRef.current.scale.lerp(new THREE.Vector3(s, s, s), 0.08);
      coreRef.current.rotation.y += 0.001; // Stable slow rotation
    }
  });

  return (
    <group
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "auto")}
    >
      <group ref={coreRef}>
        {/* ── Inner Plasma Core (custom shader) ── */}
        <mesh>
          <sphereGeometry args={[0.55, 64, 64]} />
          <shaderMaterial
            ref={coreMtlRef}
            vertexShader={coreVertexShader}
            fragmentShader={coreFragmentShader}
            uniforms={coreUniforms}
          />
        </mesh>

        {/* ── Outer Plasma Shell (fresnel glow shader) ── */}
        {/* Separated to 0.88 to avoid z-fighting with core or glow layers */}
        <mesh>
          <sphereGeometry args={[0.88, 48, 48]} />
          <shaderMaterial
            ref={shellMtlRef}
            vertexShader={shellVertexShader}
            fragmentShader={shellFragmentShader}
            uniforms={shellUniforms}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            side={THREE.FrontSide}
          />
        </mesh>

        {/* ── Cosmic Dust / Energy Rings (Elegant, Slow-rotating) ── */}
        <CosmicDustRing radius={1.15} count={50} speed={0.08} color="#06b6d4" tiltX={Math.PI / 5} tiltZ={Math.PI / 8} />
        <CosmicDustRing radius={1.35} count={40} speed={-0.06} color="#a855f7" tiltX={-Math.PI / 4} tiltZ={-Math.PI / 6} />

        {/* ── Volumetric Glow Layers (distinctly separated radii to prevent z-fighting) ── */}
        <mesh>
          <sphereGeometry args={[1.22, 32, 32]} />
          <meshBasicMaterial color="#a855f7" transparent opacity={0.1} depthWrite={false} blending={THREE.AdditiveBlending} />
        </mesh>
        <mesh>
          <sphereGeometry args={[1.55, 32, 32]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.05} depthWrite={false} blending={THREE.AdditiveBlending} />
        </mesh>

        {/* ── Orbiting Energy Particles ── */}
        <CoreOrbitingParticles count={35} />
      </group>
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
  isExpanded,
  index
}: { 
  skill: Skill; 
  basePosition: THREE.Vector3; 
  isExpanded: boolean;
  index: number;
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
      // Replaced Math.random() with a deterministic phase offset using the node's index
      const phaseOffset = index * 0.15;
      const progress = (t * 0.35 + phaseOffset) % 1; 
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
              index={i}
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

        {/* Post Processing: Soft Cinematic Bloom */}
        <EffectComposer>
          <Bloom 
            luminanceThreshold={0.2} 
            mipmapBlur 
            intensity={0.65} 
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
