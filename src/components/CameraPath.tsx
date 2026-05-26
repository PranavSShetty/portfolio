"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function CameraPath() {
  const { camera } = useThree();
  
  // 3D Spline passing through 9 sections
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 10),      // 0: Hero
      new THREE.Vector3(5, 2, -10),     // 1: Section A (Transformer Lab)
      new THREE.Vector3(-5, -2, -30),   // 2: Section B (Adversarial Vault)
      new THREE.Vector3(2, 5, -50),     // 3: Section C (Molecular Cluster)
      new THREE.Vector3(-4, 0, -70),    // 4: Section D (Medical Node)
      new THREE.Vector3(4, -3, -90),    // 5: Section E (Command Center)
      new THREE.Vector3(-3, 2, -110),   // 6: Section F (Forensics Lab)
      new THREE.Vector3(0, 0, -130),    // 7: Section G (Tech Stack Physics Cluster)
      new THREE.Vector3(0, 0, -150),    // 8: Section H (Contact Page)
    ], false, "catmullrom", 0.5);
  }, []);

  const progressObj = useRef({ value: 0 });

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: 1, // Smooth scrubbing
      onUpdate: (self) => {
        progressObj.current.value = self.progress;
      }
    });

    return () => {
      st.kill();
    };
  }, []);

  const lookAtTarget = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const t = progressObj.current.value;
    
    // Position the camera along the curve
    const position = curve.getPointAt(t);
    camera.position.lerp(position, 0.1);

    // Look slightly ahead on the curve to create a dolly zoom / cinematic effect
    const lookAtT = Math.min(t + 0.05, 1);
    const lookAtPos = curve.getPointAt(lookAtT);
    
    if (t > 0.95) {
      // Prevent the camera from looking at itself by forcing the look target forward
      lookAtPos.z -= 10;
    }
    
    lookAtTarget.lerp(lookAtPos, 0.1);
    camera.lookAt(lookAtTarget);
  });

  return null;
}
