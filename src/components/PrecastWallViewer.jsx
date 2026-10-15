'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Center } from '@react-three/drei';
import * as THREE from 'three';

// 1. Procedural Concrete Texture Generator
function createConcreteTexture(baseColor = '#cccccc') {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 35000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const opacity = Math.random() * 0.12;
    const color = Math.random() > 0.5 ? 255 : 0;
    ctx.fillStyle = `rgba(${color},${color},${color},${opacity})`;
    ctx.fillRect(x, y, 1.5, 1.5);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  return texture;
}

// 2. Custom Scalloped Top Wave Plank Geometry
function WavyTopPlank({ width, height, thickness, material }) {
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    const halfW = width / 2;
    const baseH = height - 0.15;

    shape.moveTo(-halfW, 0);
    shape.lineTo(halfW, 0);
    shape.lineTo(halfW, baseH);

    // Sinusoidal top curve (3 wave arches per panel)
    const segments = 60;
    for (let i = 0; i <= segments; i++) {
      const x = halfW - (i / segments) * width;
      const progress = (i / segments) * Math.PI * 6;
      const y = baseH + Math.abs(Math.sin(progress)) * 0.12;
      shape.lineTo(x, y);
    }

    shape.lineTo(-halfW, 0);

    const extrudeSettings = {
      depth: thickness,
      bevelEnabled: true,
      bevelSegments: 2,
      bevelSize: 0.005,
      bevelThickness: 0.005,
    };

    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geom.center();
    return geom;
  }, [width, height, thickness]);

  return <mesh geometry={geometry} material={material} castShadow receiveShadow />;
}

// 3. Complete Precast Wall Assembly Matching the Schematic
function PrecastWallAssembly() {
  const modelRef = useRef();
  const timer = useMemo(() => new THREE.Timer(), []);

  const textureLight = useMemo(() => createConcreteTexture('#F2F2F2'), []);
  const textureFooting = useMemo(() => createConcreteTexture('#F2F2F2'), []);

  // Materials strictly reflecting the schematic colors
  const materials = useMemo(
    () => ({
      plank: new THREE.MeshStandardMaterial({ map: textureLight, roughness: 0.85 }),
      post: new THREE.MeshStandardMaterial({ color: '#F2F2F2', roughness: 0.7 }),
      footing: new THREE.MeshStandardMaterial({ map: textureFooting, roughness: 0.9 }),
      ground: new THREE.MeshStandardMaterial({ color: '#191d24', roughness: 0.95 }), // Dark blue-charcoal ground base layer
      joint: new THREE.MeshStandardMaterial({ color: '#787878', roughness: 0.9 }),
    }),
    [textureLight, textureFooting]
  );

  const bayCount = 3; // 3 bays as shown in image
  const bayWidth = 2.4; // Plank length
  const plankHeight = 0.35; // 1ft height
  const plankThickness = 0.08;
  const flatPlankCount = 4; // 4 stacked flat planks + 1 top wave plank

  const totalWallWidth = bayCount * bayWidth;

  useFrame(() => {
    timer.update();
    const delta = timer.getDelta();
    if (modelRef.current) {
      modelRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <group ref={modelRef} scale={0.85}>
      {/* Dark Sub-ground Foundation Trench (matching dark bottom strip in image) */}
      <mesh position={[0, -0.6, 0]} material={materials.ground} receiveShadow>
        <boxGeometry args={[totalWallWidth + 1.2, 0.8, 0.8]} />
      </mesh>

      {/* Wall Bays (Horizontal Stacked Planks) */}
      {Array.from({ length: bayCount }).map((_, bIdx) => {
        const bayX = (bIdx - (bayCount - 1) / 2) * bayWidth;
        return (
          <group key={bIdx} position={[bayX, 0, 0]}>
            {/* 4 Stacked Flat Planks */}
            {Array.from({ length: flatPlankCount }).map((_, pIdx) => (
              <group key={pIdx} position={[0, pIdx * plankHeight + plankHeight / 2, 0]}>
                <mesh material={materials.plank} castShadow receiveShadow>
                  <boxGeometry args={[bayWidth - 0.06, plankHeight - 0.015, plankThickness]} />
                </mesh>
                {/* Horizontal Joint Line */}
                <mesh position={[0, -plankHeight / 2, 0]} material={materials.joint}>
                  <boxGeometry args={[bayWidth - 0.06, 0.008, plankThickness + 0.002]} />
                </mesh>
              </group>
            ))}

            {/* Scalloped Top Wave Plank */}
            <group position={[0, flatPlankCount * plankHeight + 0.11, -plankThickness / 2]}>
              <WavyTopPlank
                width={bayWidth - 0.06}
                height={plankHeight + 0.08}
                thickness={plankThickness}
                material={materials.plank}
              />
            </group>
          </group>
        );
      })}

      {/* Vertical Support Posts & Concrete Footings */}
      {Array.from({ length: bayCount + 1 }).map((_, i) => {
        const postX = (i - bayCount / 2) * bayWidth;
        const postHeight = (flatPlankCount + 1) * plankHeight + 0.3;

        return (
          <group key={i} position={[postX, 0, 0]}>
            {/* Dark Charcoal Structural H-Post */}
            <mesh position={[0, postHeight / 2 - 0.2, 0]} material={materials.post} castShadow receiveShadow>
              <boxGeometry args={[0.22, postHeight, 0.24]} />
            </mesh>

            {/* Concrete Footing Block (Around each post base at ground line) */}
            <mesh position={[0, -0.2, 0]} material={materials.footing} receiveShadow>
              <boxGeometry args={[0.5, 0.55, 0.45]} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// 4. Main Page Component with Heading
export default function ViewPrecastWall3D() {
  return (
    <div className="w-full max-w-5xl mx-auto p-4 space-y-4 font-sans">
      
      {/* Requested Heading */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
          View Your Precast wall in 3d
        </h2>
        <p className="text-sm text-slate-500">
          Interactive 3D Preview • Rotate to inspect structural posts, planks, and foundation footings
        </p>
      </div>

      {/* 3D Canvas Container */}
      <div className="w-full h-[450px] bg-[#f8fafc] rounded-2xl overflow-hidden shadow-sm border border-slate-200 relative">
        <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-md px-3 py-1 rounded-md text-xs text-slate-700 font-mono border border-slate-200 shadow-sm">
          Drag to rotate • Scroll to zoom
        </div>

        <Canvas shadows={{ type: THREE.PCFShadowMap }} camera={{ position: [0, 1.8, 7.5], fov: 42 }}>
          <color attach="background" args={['#f8fafc']} />

          {/* Natural Studio Lighting */}
          <ambientLight intensity={0.9} />
          <directionalLight
            position={[6, 10, 6]}
            intensity={1.6}
            color="#ffffff"
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <directionalLight position={[-6, 4, -4]} intensity={0.4} color="#e2e8f0" />

          <Center top>
            <PrecastWallAssembly />
          </Center>

          <OrbitControls
            enablePan={false}
            minDistance={4}
            maxDistance={14}
            maxPolarAngle={Math.PI / 2.02}
          />
        </Canvas>
      </div>

    </div>
  );
}