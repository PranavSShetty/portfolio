"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Physics, RigidBody, RapierRigidBody } from "@react-three/rapier";
import { Environment, Float, Instance, Instances, MeshTransmissionMaterial, Edges, Text, Html, Line } from "@react-three/drei";
import { EffectComposer, Bloom, ChromaticAberration, Glitch } from "@react-three/postprocessing";
import { BlendFunction, GlitchMode } from "postprocessing";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import CameraPath from "./CameraPath";
import MorphingCharacter from "./MorphingCharacter";

// Station 1: Transformer Lab (Layered Neural Network Architecture)
function TransformerLab() {
  const groupRef = useRef<THREE.Group>(null);
  
  // Arrange nodes in 3 distinct layers (Input, Attention, Output)
  const networkData = useMemo(() => {
    const inputLayer = Array.from({ length: 8 }).map((_, i) => new THREE.Vector3(-2, (i - 3.5) * 0.8, (Math.random() - 0.5) * 0.5));
    const hiddenLayer = Array.from({ length: 12 }).map((_, i) => new THREE.Vector3(0, (i - 5.5) * 0.6, (Math.random() - 0.5) * 0.5));
    const outputLayer = Array.from({ length: 8 }).map((_, i) => new THREE.Vector3(2, (i - 3.5) * 0.8, (Math.random() - 0.5) * 0.5));
    
    // Connections between layers
    const connections: [THREE.Vector3, THREE.Vector3][] = [];
    inputLayer.forEach((input) => {
      // Connect each input to 3 random hidden nodes
      for (let k = 0; k < 3; k++) {
        const target = hiddenLayer[Math.floor(Math.random() * hiddenLayer.length)];
        connections.push([input, target]);
      }
    });
    
    hiddenLayer.forEach((hidden) => {
      // Connect each hidden to 2 random output nodes
      for (let k = 0; k < 2; k++) {
        const target = outputLayer[Math.floor(Math.random() * outputLayer.length)];
        connections.push([hidden, target]);
      }
    });

    return { inputLayer, hiddenLayer, outputLayer, connections };
  }, []);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Gentle self-rotation to make it look 3D and dynamic
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.15;
    }
  });

  return (
    <group position={[5, 2, -10]} ref={groupRef}>
      {/* Central Attention Hub entity */}
      <Float speed={1.5} rotationIntensity={1} floatIntensity={1}>
        <RigidBody type="fixed" colliders="ball">
          <mesh>
            <sphereGeometry args={[0.8, 32, 32]} />
            <MeshTransmissionMaterial 
              samples={4}
              thickness={0.5}
              chromaticAberration={0.8}
              anisotropy={0.2}
              color="#00ffff"
              transparent
              opacity={0.7}
            />
            <Edges scale={1} threshold={15} color="#00ffff" />
          </mesh>
        </RigidBody>
      </Float>

      {/* Layer 1 Nodes (Input) */}
      {networkData.inputLayer.map((pos, i) => (
        <mesh key={`in-${i}`} position={pos}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshBasicMaterial color="#00ffff" />
        </mesh>
      ))}

      {/* Layer 2 Nodes (Hidden/Attention) */}
      {networkData.hiddenLayer.map((pos, i) => (
        <mesh key={`hid-${i}`} position={pos}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshBasicMaterial color="#00aaff" />
        </mesh>
      ))}

      {/* Layer 3 Nodes (Output) */}
      {networkData.outputLayer.map((pos, i) => (
        <mesh key={`out-${i}`} position={pos}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      ))}

      {/* Synaptic/Attention lines linking nodes */}
      {networkData.connections.map(([start, end], i) => (
        <Line 
          key={`line-${i}`}
          points={[start, end]}
          color={i % 2 === 0 ? "#00ffff" : "#0055ff"}
          lineWidth={1}
          opacity={0.3}
          transparent
        />
      ))}
    </group>
  );
}

// Station 2: Adversarial Vault (Cyber/Hacker Core with floating code matrix)
function AdversarialVault() {
  const codesRef = useRef<THREE.Group>(null);

  // Fake binary streams & hacker code tags
  const hackerTags = useMemo(() => [
    { text: "FILM-WGAN-CGAN", pos: [-3, 2, 0] },
    { text: "CRACKING HASHES...", pos: [3, -2, -1] },
    { text: "01000110 01001001 01001100 01001101", pos: [-2.5, -2.5, 1] },
    { text: "STATUS: ADVERSARIAL DRIFT", pos: [2.5, 2.5, 0.5] },
    { text: "KEY_SPACE: EXHAUSTED", pos: [-4, 0, -2] },
    { text: "n-gram coverage: 98.4%", pos: [3.5, 0.5, 1.5] },
    { text: "WGAN_LOSS: 0.0412", pos: [-1, 3.5, -0.5] },
    { text: "ATTACK SYSTEM INITIALIZED", pos: [1.2, -3.5, 0] }
  ], []);

  useFrame(({ clock }) => {
    if (codesRef.current) {
      // Floating matrix code motion
      codesRef.current.children.forEach((child, i) => {
        child.position.y += Math.sin(clock.getElapsedTime() + i) * 0.005;
      });
    }
  });

  return (
    <group position={[-5, -2, -30]}>
      {/* Central Cybersecurity Locked Core */}
      <Float speed={2} rotationIntensity={1.5}>
        <RigidBody type="fixed" colliders="hull">
          <mesh>
            <boxGeometry args={[2.5, 2.5, 2.5]} />
            <meshStandardMaterial color="#ff0033" emissive="#110000" roughness={0.1} metalness={0.9} />
            <Edges scale={1.05} threshold={15} color="#ff0033" />
          </mesh>
        </RigidBody>
      </Float>

      {/* Floating hacking debris representing cracking attempts */}
      {Array.from({ length: 15 }).map((_, i) => (
        <RigidBody key={i} type="dynamic" position={[
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 8
        ]}>
          <mesh>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial color="#ff3300" emissive="#220500" metalness={0.8} />
            <Edges scale={1.02} threshold={15} color="#ff3300" />
          </mesh>
        </RigidBody>
      ))}

      {/* Floating hacker code tags in 3D */}
      <group ref={codesRef}>
        {hackerTags.map((tag, i) => (
          <Text
            key={i}
            position={tag.pos as [number, number, number]}
            fontSize={0.25}
            color="#00ff44"
            maxWidth={4}
            anchorX="center"
            anchorY="middle"
          >
            {tag.text}
          </Text>
        ))}
      </group>

      {/* Holographic Hacker Console/Overlay */}
      <Html position={[0, -2, 2]} distanceFactor={8} transform occlude="blending">
        <div className="bg-black/85 border border-red-500/50 p-4 rounded-lg font-mono text-[9px] w-64 shadow-[0_0_20px_rgba(255,0,0,0.3)] select-none">
          <div className="flex justify-between border-b border-red-500/30 pb-1 mb-2 text-red-500 font-bold">
            <span>OPERATIVE ACCESS // TERMINAL</span>
            <span className="animate-pulse">● ACTIVE_ATTACK</span>
          </div>
          <div className="space-y-1 text-green-400">
            <div>$ bypass --policy=strict</div>
            <div>[OK] INTEGRATING FILM INJECTION...</div>
            <div>[CRACKING] 9,464 HASH CANDIDATES...</div>
            <div className="text-red-500 font-bold animate-pulse">$ SUCCESS: PASS_GEN STRUCT SECURED</div>
          </div>
          <div className="mt-3 w-full bg-red-950/50 h-1.5 rounded overflow-hidden border border-red-500/20">
            <div className="bg-red-500 h-full animate-[shimmer_2s_infinite]" style={{ width: '85%' }}></div>
          </div>
        </div>
      </Html>
    </group>
  );
}

// Station 3: Molecular Graph ( Procedural Node-and-Bond Chemical Molecule)
function MolecularGraph() {
  const groupRef = useRef<THREE.Group>(null);

  // Generate coordinates for a benzene-like ring with side chains
  const molecularStructure = useMemo(() => {
    const ringNodes: THREE.Vector3[] = [];
    const outerNodes: THREE.Vector3[] = [];
    const bonds: [THREE.Vector3, THREE.Vector3][] = [];

    // Ring (6 carbons)
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const pos = new THREE.Vector3(Math.cos(angle) * 1.8, Math.sin(angle) * 1.8, 0);
      ringNodes.push(pos);
    }

    // Connect carbon ring
    for (let i = 0; i < 6; i++) {
      bonds.push([ringNodes[i], ringNodes[(i + 1) % 6]]);
    }

    // Outer chains (hydrogens and function groups)
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      // Alternate between simple H and a small chain
      if (i % 2 === 0) {
        const pos = new THREE.Vector3(Math.cos(angle) * 2.8, Math.sin(angle) * 2.8, 0.3);
        outerNodes.push(pos);
        bonds.push([ringNodes[i], pos]);
      } else {
        const p1 = new THREE.Vector3(Math.cos(angle) * 2.7, Math.sin(angle) * 2.7, -0.3);
        const p2 = new THREE.Vector3(Math.cos(angle) * 3.4, Math.sin(angle) * 3.4, -0.1);
        outerNodes.push(p1);
        outerNodes.push(p2);
        bonds.push([ringNodes[i], p1]);
        bonds.push([p1, p2]);
      }
    }

    return { ringNodes, outerNodes, bonds };
  }, []);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.2;
      groupRef.current.rotation.x = clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <group position={[2, 5, -50]} ref={groupRef}>
      {/* Central Pharmacophore Core */}
      <Float speed={1} rotationIntensity={1.5}>
        <mesh>
          <icosahedronGeometry args={[0.7, 1]} />
          <MeshTransmissionMaterial 
            backside 
            samples={4} 
            thickness={0.5} 
            chromaticAberration={1} 
            color="#00ff88" 
          />
        </mesh>
      </Float>

      {/* Carbon Atoms (Ring Nodes) */}
      {molecularStructure.ringNodes.map((pos, i) => (
        <mesh key={`ring-${i}`} position={pos}>
          <sphereGeometry args={[0.24, 32, 32]} />
          <meshStandardMaterial color="#00ff88" emissive="#004411" metalness={0.9} roughness={0.1} />
        </mesh>
      ))}

      {/* Side Atoms (Outer Nodes) */}
      {molecularStructure.outerNodes.map((pos, i) => (
        <mesh key={`out-${i}`} position={pos}>
          <sphereGeometry args={[0.15, 32, 32]} />
          <meshStandardMaterial color="#ffffff" emissive="#333333" metalness={0.5} roughness={0.5} />
        </mesh>
      ))}

      {/* Covalent Bonds */}
      {molecularStructure.bonds.map(([start, end], i) => (
        <Line 
          key={`bond-${i}`}
          points={[start, end]}
          color="#00ff88"
          lineWidth={2}
          opacity={0.8}
          transparent
        />
      ))}
    </group>
  );
}

// Station 4: Medical Node (AI Agents - Heartbeat pulsing Torus knot)
function MedicalNode() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      // Simulate Heartbeat pulse sequence (lub-dub rhythm)
      const time = clock.getElapsedTime() * 1.5; // adjust pulse speed
      const beat = Math.sin(time * Math.PI);
      const lub = Math.pow(Math.max(0, beat), 8) * 0.18;
      const dub = Math.pow(Math.max(0, Math.sin((time - 0.25) * Math.PI)), 8) * 0.12;
      const pulseFactor = 1 + lub + dub;

      meshRef.current.scale.set(pulseFactor, pulseFactor, pulseFactor);
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.4;
    }
  });

  return (
    <group position={[-4, 0, -70]}>
      <Float speed={2} rotationIntensity={1} floatIntensity={1}>
        <RigidBody type="fixed" colliders="hull">
          <mesh ref={meshRef}>
            <torusKnotGeometry args={[1.8, 0.45, 120, 16]} />
            <meshStandardMaterial color="#ff0066" emissive="#770022" emissiveIntensity={1} wireframe />
          </mesh>
        </RigidBody>
      </Float>
    </group>
  );
}

// Station 5: Command Center (Curved Futuristic Hacker Multi-Monitor Station)
function CommandCenter() {
  // Screen angles/positions forming a futuristic curved HUD console
  const screens = useMemo(() => [
    { pos: [-3.5, 0.8, -1], rot: [0, 0.5, 0], title: "SEC_METRIC", color: "#aa00ff", items: ["VULN_SCAN: 0", "IPS: BLOCKED", "PORTS: HARMONIZED"] },
    { pos: [0, 1.2, -2], rot: [0.1, 0, 0], title: "CORE_MONITOR", color: "#ff00ff", items: ["DB_SESSIONS: SECURE", "HOST: SAHYADRI_PROD", "SSL: ACTIVE"] },
    { pos: [3.5, 0.8, -1], rot: [0, -0.5, 0], title: "TORSECURE_LLP", color: "#00aaff", items: ["ROLE: WEB_CYBER_INTERN", "DEPLOY: HOSTED_OK", "AUDIT: COMPLIANT"] }
  ], []);

  return (
    <group position={[4, -3, -90]}>
      {screens.map((scr, i) => (
        <Float key={i} speed={1.5} rotationIntensity={0.3} floatIntensity={0.5} position={scr.pos as [number, number, number]}>
          <RigidBody type="fixed">
            <group rotation={scr.rot as [number, number, number]}>
              {/* Curved Hologram Screen Backing */}
              <mesh>
                <planeGeometry args={[2.8, 1.8]} />
                <meshBasicMaterial color={scr.color} transparent opacity={0.12} side={THREE.DoubleSide} />
                <Edges scale={1} threshold={15} color={scr.color} />
              </mesh>
              {/* Display text directly on terminal screen */}
              <Text
                position={[-1.2, 0.6, 0.05]}
                fontSize={0.14}
                color={scr.color}
                anchorX="left"
              >
                {`[ ${scr.title} ]`}
              </Text>
              {scr.items.map((item, idx) => (
                <Text
                  key={idx}
                  position={[-1.2, 0.2 - idx * 0.3, 0.05]}
                  fontSize={0.1}
                  color="#ffffff"
                  anchorX="left"
                >
                  {`> ${item}`}
                </Text>
              ))}
            </group>
          </RigidBody>
        </Float>
      ))}
    </group>
  );
}

// Station 6: Tech Stack Physics Cluster (Dynamic interactive spheres)
const TECH_STACK = [
  "Python", "TensorFlow", "PyTorch", "React", "Next.js", 
  "Node.js", "Java", "SQL", "Docker", "AWS", "Tailwind", 
  "Transformers", "GANs", "Linux", "TypeScript"
];

function TechStackCluster() {
  const center = new THREE.Vector3(0, 0, -115);
  return (
    <group>
      {TECH_STACK.map((tech, i) => (
        <PhysicsBall key={i} tech={tech} index={i} center={center} />
      ))}
    </group>
  );
}

function PhysicsBall({ tech, index, center }: { tech: string, index: number, center: THREE.Vector3 }) {
  const api = useRef<RapierRigidBody>(null);
  
  const initialPos = useMemo(() => [
    center.x + (Math.random() - 0.5) * 15,
    center.y + (Math.random() - 0.5) * 15,
    center.z + (Math.random() - 0.5) * 10
  ] as [number, number, number], [center]);

  useFrame(() => {
    if (api.current) {
      const pos = api.current.translation();
      const currentPos = new THREE.Vector3(pos.x, pos.y, pos.z);
      const direction = new THREE.Vector3(center.x, center.y, center.z).sub(currentPos);
      const distance = direction.length();
      
      direction.normalize().multiplyScalar(distance * 0.05); 
      api.current.applyImpulse({ x: direction.x, y: direction.y, z: direction.z }, true);
      
      api.current.setAngularDamping(1.5);
      api.current.setLinearDamping(0.8);
    }
  });

  const handlePointerEnter = () => {
    if (api.current) {
      const scatterDir = new THREE.Vector3(
        (Math.random() - 0.5) * 35,
        (Math.random() - 0.5) * 35,
        (Math.random() - 0.5) * 35
      );
      api.current.applyImpulse(scatterDir, true);
    }
  };

  return (
    <RigidBody ref={api} type="dynamic" colliders="ball" position={initialPos} restitution={0.8}>
      <mesh onPointerEnter={handlePointerEnter} onPointerMove={handlePointerEnter}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <MeshTransmissionMaterial 
          samples={4}
          thickness={0.2}
          chromaticAberration={0.5}
          anisotropy={0.1}
          distortion={0}
          distortionScale={0}
          temporalDistortion={0}
          color={index % 2 === 0 ? "#00ffff" : "#ff00ff"}
          opacity={0.8}
          transparent
        />
      </mesh>
      <Html distanceFactor={10} position={[0, 0, 0]} pointerEvents="none">
        <div className="select-none text-[10px] font-bold bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full border border-white/20 whitespace-nowrap">
          {tech}
        </div>
      </Html>
    </RigidBody>
  );
}

export default function Experience() {
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        // Sections B and E are Security related (Glitch triggers on security sections)
        if ((self.progress > 0.25 && self.progress < 0.35) || (self.progress > 0.6 && self.progress < 0.7)) {
          setGlitchActive(true);
        } else {
          setGlitchActive(false);
        }
      }
    });

    return () => st.kill();
  }, []);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1} />
      
      <Physics gravity={[0, 0, 0]}>
        <CameraPath />
        
        <MorphingCharacter position={[0, 0, 8]} />

        {/* Dynamic Interactive Redesigned Stations */}
        <TransformerLab />
        <AdversarialVault />
        <MolecularGraph />
        <MedicalNode />
        <CommandCenter />
        <TechStackCluster />
      </Physics>

      <EffectComposer multisampling={4}>
        <Bloom luminanceThreshold={0.2} mipmapBlur intensity={1.5} />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={new THREE.Vector2(0.002, 0.002)}
          radialModulation={false}
          modulationOffset={0}
        />
        <Glitch
          delay={new THREE.Vector2(1.5, 3.5)}
          duration={new THREE.Vector2(0.1, 0.3)}
          strength={new THREE.Vector2(0.1, 0.5)}
          mode={GlitchMode.SPORADIC}
          active={glitchActive}
          ratio={0.5}
        />
      </EffectComposer>
      
      <Environment preset="city" />
      
      <Instances range={200}>
        <boxGeometry args={[0.1, 0.1, 0.1]} />
        <meshBasicMaterial color="#ffffff" opacity={0.3} transparent />
        {Array.from({ length: 200 }).map((_, i) => (
          <Instance
            key={i}
            position={[
              (Math.random() - 0.5) * 50,
              (Math.random() - 0.5) * 50,
              (Math.random() - 0.5) * 150
            ]}
          />
        ))}
      </Instances>
    </>
  );
}
