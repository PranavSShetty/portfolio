"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Physics, RigidBody, RapierRigidBody, InstancedRigidBodies, InstancedRigidBodyProps } from "@react-three/rapier";
import { Environment, Float, Instance, Instances, MeshTransmissionMaterial, Edges, Text, Sphere } from "@react-three/drei";
import { EffectComposer, Bloom, ChromaticAberration, Glitch } from "@react-three/postprocessing";
import { BlendFunction, GlitchMode } from "postprocessing";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import CameraPath from "./CameraPath";
import MorphingCharacter from "./MorphingCharacter";

// Station 1: Transformer Lab
function TransformerLab() {
  const nodesRef = useRef<THREE.InstancedMesh>(null);
  
  useFrame(({ clock }) => {
    if (nodesRef.current) {
      nodesRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group position={[5, 2, -10]}>
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <RigidBody type="fixed" colliders="ball">
          <mesh>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial color="#00ffff" emissive="#00aaaa" emissiveIntensity={2} wireframe />
          </mesh>
        </RigidBody>
      </Float>
      
      <Instances ref={nodesRef} range={50}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshBasicMaterial color="#00ffff" />
        {Array.from({ length: 50 }).map((_, i) => (
          <Instance
            key={i}
            position={[
              (Math.random() - 0.5) * 8,
              (Math.random() - 0.5) * 8,
              (Math.random() - 0.5) * 8
            ]}
          />
        ))}
      </Instances>
    </group>
  );
}

// Station 2: Adversarial Vault
function AdversarialVault() {
  return (
    <group position={[-5, -2, -30]}>
      {Array.from({ length: 20 }).map((_, i) => (
        <RigidBody key={i} type="dynamic" position={[
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10
        ]}>
          <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#ff0044" emissive="#550011" metalness={0.8} roughness={0.2} />
            <Edges scale={1} threshold={15} color="white" />
          </mesh>
        </RigidBody>
      ))}
    </group>
  );
}

// Station 3: Molecular Graph
function MolecularGraph() {
  return (
    <group position={[2, 5, -50]}>
      <Float speed={1.5} rotationIntensity={2}>
        <RigidBody type="fixed" colliders="hull">
          <mesh>
            <icosahedronGeometry args={[3, 1]} />
            <MeshTransmissionMaterial 
              backside 
              samples={4} 
              thickness={0.5} 
              chromaticAberration={1} 
              anisotropy={0.3} 
              distortion={0.5} 
              distortionScale={0.5} 
              temporalDistortion={0.1} 
              color="#00ff88" 
            />
            <Edges scale={1} threshold={15} color="#00ff88" />
          </mesh>
        </RigidBody>
      </Float>
    </group>
  );
}

// Station 4: Medical Node (AI Agents)
function MedicalNode() {
  return (
    <group position={[-4, 0, -70]}>
      <Float speed={3} rotationIntensity={2} floatIntensity={2}>
        <RigidBody type="fixed" colliders="hull">
          <mesh>
            <torusKnotGeometry args={[2, 0.5, 100, 16]} />
            <meshStandardMaterial color="#ff00aa" emissive="#aa0055" wireframe />
          </mesh>
        </RigidBody>
      </Float>
    </group>
  );
}

// Station 5: Command Center
function CommandCenter() {
  return (
    <group position={[4, -3, -90]}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Float key={i} speed={2} rotationIntensity={0.5} floatIntensity={1} position={[
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 8
        ]}>
          <RigidBody type="fixed">
            <mesh>
              <planeGeometry args={[4, 2.5]} />
              <meshBasicMaterial color="#aa00ff" transparent opacity={0.2} side={THREE.DoubleSide} />
              <Edges scale={1} threshold={15} color="#ff00ff" />
            </mesh>
          </RigidBody>
        </Float>
      ))}
    </group>
  );
}

// Station 6: Tech Stack Physics Cluster
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

import { Html } from "@react-three/drei";

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
    // Activate glitch effect towards the security sections (closer to end of scroll)
    const st = ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        // Sections B and E are Security related
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

        {/* Stations */}
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
