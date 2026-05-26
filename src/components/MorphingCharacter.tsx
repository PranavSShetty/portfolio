"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createNoise3D } from "simplex-noise";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const vertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  uniform float uTime;
  uniform float uMorphProgress;
  
  void main() {
    vUv = uv;
    vPosition = position;
    
    // Add some noise/distortion to vertices based on morph progress
    vec3 pos = position;
    float noise = sin(pos.x * 10.0 + uTime) * sin(pos.y * 10.0 + uTime) * sin(pos.z * 10.0 + uTime);
    
    // As it morphs (uMorphProgress -> 1), it gets more glitchy/distorted
    pos += normal * noise * 0.2 * uMorphProgress;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  uniform float uTime;
  uniform float uMorphProgress;
  
  void main() {
    // Cyan Synaptic Glow (AI)
    vec3 colorA = vec3(0.0, 1.0, 1.0);
    
    // Crimson Glitch-Hex (Security)
    vec3 colorB = vec3(1.0, 0.0, 0.2);
    
    // Pattern blending
    float patternA = sin(vPosition.y * 20.0 + uTime * 2.0) * 0.5 + 0.5;
    
    // Hex/Glitch pattern
    float hex = step(0.5, sin(vPosition.x * 50.0) * sin(vPosition.y * 50.0));
    float glitch = step(0.95, fract(sin(dot(vUv.xy, vec2(12.9898, 78.233)) + uTime) * 43758.5453));
    float patternB = max(hex, glitch);
    
    // Final color and pattern interpolation
    vec3 finalColor = mix(colorA, colorB, uMorphProgress);
    float finalPattern = mix(patternA, patternB, uMorphProgress);
    
    // Add glow
    float glow = 1.0 - max(0.0, dot(vPosition, vPosition));
    
    gl_FragColor = vec4(finalColor * (finalPattern + glow), 0.8);
  }
`;

export default function MorphingCharacter({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  const noise3D = useMemo(() => createNoise3D(), []);
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMorphProgress: { value: 0 }
  }), []);

  const progressObj = useRef({ value: 0 });

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      onUpdate: (self) => {
        progressObj.current.value = self.progress;
      }
    });

    return () => {
      st.kill();
    };
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = time;
      // Morph progress follows scroll progress
      materialRef.current.uniforms.uMorphProgress.value = progressObj.current.value;
    }

    if (groupRef.current) {
      // Gentle, ultra-smooth autonomous floating using Perlin noise
      const nx = noise3D(time * 0.2, 0, 0) * 0.25;
      const ny = noise3D(0, time * 0.2, 0) * 0.25;
      const nz = noise3D(0, 0, time * 0.2) * 0.25;

      groupRef.current.position.set(
        position[0] + nx,
        position[1] + ny,
        position[2] + nz
      );
      
      // Rolling organic rotation
      groupRef.current.rotation.x = time * 0.15 + nx;
      groupRef.current.rotation.y = time * 0.2 + ny;
      groupRef.current.rotation.z = time * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh>
        <icosahedronGeometry args={[1, 4]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          wireframe={false}
        />
      </mesh>
    </group>
  );
}
