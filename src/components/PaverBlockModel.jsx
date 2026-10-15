'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Center } from '@react-three/drei';
import * as THREE from 'three';

// 1. Procedural Concrete & Interlocking Noise Texture Generator
function createConcreteTextures() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Base neutral noise background
  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 512, 512);

  // Add realistic concrete speckles / aggregate grain
  for (let i = 0; i < 50000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const opacity = Math.random() * 0.2;
    const isDark = Math.random() > 0.4;
    ctx.fillStyle = isDark
      ? `rgba(0,0,0,${opacity})`
      : `rgba(255,255,255,${opacity})`;
    ctx.fillRect(x, y, 1.5, 1.5);
  }

  // Create diffuse map & normal/bump map
  const bumpMap = new THREE.CanvasTexture(canvas);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;
  bumpMap.repeat.set(2, 2);

  return bumpMap;
}

// 2. Interlocking Tri-Hex Paver Profile
function createTriHexShape() {
  const shape = new THREE.Shape();
  const radius = 0.52;
  const lobeRadius = 0.26;
  const angles = [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3];

  angles.forEach((angle, index) => {
    const cx = radius * Math.cos(angle);
    const cy = radius * Math.sin(angle);

    const startAngle = angle - Math.PI / 3;
    const endAngle = angle + Math.PI / 3;
    const steps = 16;

    for (let i = 0; i <= steps; i++) {
      const a = startAngle + (i / steps) * (endAngle - startAngle);
      const x = cx + lobeRadius * Math.cos(a);
      const y = cy + lobeRadius * Math.sin(a);

      if (index === 0 && i === 0) {
        shape.moveTo(x, y);
      } else {
        shape.lineTo(x, y);
      }
    }
  });

  shape.closePath();
  return shape;
}

// 3. Extruded Single Paver Block Component
function PaverBlock({ position, rotation, material }) {
  const shape = useMemo(() => createTriHexShape(), []);

  const extrudeSettings = useMemo(
    () => ({
      depth: 0.2, // ~60mm thickness scale
      bevelEnabled: true,
      bevelSegments: 3,
      bevelSize: 0.025, // Prominent chamfered edge for joint visibility
      bevelThickness: 0.02,
    }),
    []
  );

  const geometry = useMemo(() => {
    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geom.center();
    return geom;
  }, [shape, extrudeSettings]);

  return (
    <mesh
      geometry={geometry}
      material={material}
      position={position}
      rotation={rotation}
      castShadow
      receiveShadow
    />
  );
}

// 4. Paver Grid Assembly with Realistic Materials & Color Pattern
function PaverGridAssembly() {
  const groupRef = useRef();
  const timer = useMemo(() => new THREE.Timer(), []);
  const bumpTexture = useMemo(() => createConcreteTextures(), []);

  // Concrete Materials with proper Red and Grey Tones + Surface Texture
  const materials = useMemo(
    () => ({
      greyConcrete: new THREE.MeshStandardMaterial({
        color: '#D4D4D8', // Light Charcoal / Natural Concrete Grey
        bumpMap: bumpTexture,
        bumpScale: 0.008,
        roughness: 0.82,
        metalness: 0.05,
      }),
      redConcrete: new THREE.MeshStandardMaterial({
        color: '#A8322D', // Deep Terracotta Red Concrete
        bumpMap: bumpTexture,
        bumpScale: 0.008,
        roughness: 0.8,
        metalness: 0.05,
      }),
      sandJoint: new THREE.MeshStandardMaterial({
        color: '#C2B280', // Polymeric Joint Sand
        bumpMap: bumpTexture,
        bumpScale: 0.015,
        roughness: 0.95,
      }),
    }),
    [bumpTexture]
  );

  // Generate Hexagonal Interlocking Grid Layout
  const gridPositions = useMemo(() => {
    const items = [];
    const rows = 5;
    const cols = 5;
    const spacingX = 1.32;
    const spacingZ = 1.14;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const xOffset = (r % 2) * (spacingX / 2);
        const x = (c - cols / 2) * spacingX + xOffset;
        const z = (r - rows / 2) * spacingZ;

        // Alternating color pattern for interlocking contrast
        const isRed = (r + c) % 2 === 0;

        items.push({
          pos: [x, 0.1, z],
          rot: [-Math.PI / 2, 0, (r % 2) * (Math.PI / 3)],
          mat: isRed ? materials.redConcrete : materials.greyConcrete,
        });
      }
    }
    return items;
  }, [materials]);

  // Gentle idle rotation
  useFrame(() => {
    timer.update();
    const delta = timer.getDelta();
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Polymeric Sand Sub-Base Layer */}
      <mesh position={[0, -0.02, 0]} material={materials.sandJoint} receiveShadow>
        <boxGeometry args={[7.2, 0.12, 6.2]} />
      </mesh>

      {/* Interlocked Blocks */}
      {gridPositions.map((item, idx) => (
        <PaverBlock
          key={idx}
          position={item.pos}
          rotation={item.rot}
          material={item.mat}
        />
      ))}
    </group>
  );
}

// 5. Main Component
export default function ViewPaverBlock3D() {
  return (
    <div className="w-full max-w-5xl mx-auto p-4 space-y-4 font-sans">
      {/* Title Header */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
          View Your Paver block in 3d
        </h2>
        <p className="text-sm text-slate-500">
          Interactive 3D Interlocking Preview • Drag to rotate, scroll to zoom
        </p>
      </div>

      {/* 3D Canvas Container */}
      <div className="w-full h-[480px] bg-[#f8fafc] rounded-2xl overflow-hidden shadow-sm border border-slate-200 relative">
        <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-md px-3 py-1 rounded-md text-xs text-slate-700 font-mono border border-slate-200 shadow-sm">
          Tri-Hex Interlocking System • 60mm Terracotta & Grey
        </div>

        <Canvas shadows={{ type: THREE.PCFShadowMap }} camera={{ position: [0, 5, 6], fov: 42 }}>
          <color attach="background" args={['#f8fafc']} />

          {/* Realistic Lighting Setup */}
          <ambientLight intensity={0.7} />
          <directionalLight
            position={[6, 12, 8]}
            intensity={1.8}
            color="#ffffff"
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <directionalLight position={[-6, 4, -5]} intensity={0.5} color="#cbd5e1" />

          <Center top position={[0, -0.2, 0]}>
            <PaverGridAssembly />
          </Center>

          <OrbitControls
            enablePan={false}
            minDistance={3}
            maxDistance={14}
            maxPolarAngle={Math.PI / 2.05}
          />
        </Canvas>
      </div>
    </div>
  );
}