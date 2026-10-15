'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Center, Line } from '@react-three/drei';
import * as THREE from 'three';

// 1. Procedural Concrete Texture Generator
function createConcreteTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Base grey
    ctx.fillStyle = '#a3a3a3';
    ctx.fillRect(0, 0, 512, 512);

    // Add subtle noise/grit for RCC finish
    for (let i = 0; i < 40000; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const opacity = Math.random() * 0.15;
        const color = Math.random() > 0.5 ? 255 : 0;
        ctx.fillStyle = `rgba(${color},${color},${color},${opacity})`;
        ctx.fillRect(x, y, 1.5, 1.5);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(3, 1);
    return texture;
}

// 2. The 3D Cement Plank Mesh with Wires on Both Sides
function CementPlank() {
    const groupRef = useRef(null);
    const texture = useMemo(() => createConcreteTexture(), []);
    const timer = useMemo(() => new THREE.Timer(), []);

    // Dimensions in meters (6ft x 1ft x 2inch)
    const length = 1.828;
    const height = 0.304;
    const thickness = 0.050;

    // Y-offsets for 3 horizontal wires (top, middle, bottom)
    const wireYOffsets = [height * 0.28, 0, -height * 0.28];

    // Z-offsets for front and back faces (+thickness/2 + offset, -thickness/2 - offset)
    const zFront = thickness / 2 + 0.001;
    const zBack = -(thickness / 2 + 0.001);

    // Slow auto-rotation
    useFrame(() => {
        timer.update();
        const delta = timer.getDelta();
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.2;
        }
    });

    return (
        <group ref={groupRef}>
            {/* Concrete Plank Mesh */}
            <mesh castShadow receiveShadow>
                <boxGeometry args={[length, height, thickness]} />
                <meshStandardMaterial
                    map={texture}
                    roughness={0.85}
                    metalness={0.05}
                    color="#F2F2F2"
                />
            </mesh>

            {/* Front Side Wires (3 Wires) */}
            {wireYOffsets.map((yPos, index) => (
                <Line
                    key={`front-${index}`}
                    points={[
                        [-length / 2, yPos, zFront],
                        [length / 2, yPos, zFront],
                    ]}
                    color="#1e40af"
                    lineWidth={2}
                    dashed
                    dashScale={25}
                    dashSize={0.6}
                    gapSize={0.4}
                />
            ))}

            {/* Back Side Wires (3 Wires) */}
            {wireYOffsets.map((yPos, index) => (
                <Line
                    key={`back-${index}`}
                    points={[
                        [-length / 2, yPos, zBack],
                        [length / 2, yPos, zBack],
                    ]}
                    color="#1e40af"
                    lineWidth={2}
                    dashed
                    dashScale={25}
                    dashSize={0.6}
                    gapSize={0.4}
                />
            ))}
        </group>
    );
}

// 3. Main 3D Viewer Component
export default function CementPlankViewer() {
    return (
        <div className="w-full h-[350px] bg-slate-100 rounded-xl overflow-hidden shadow-lg relative">
            <div className="absolute top-3 left-3 z-10 bg-black/60 backdrop-blur-md px-3 py-1 rounded-md text-xs text-slate-200 font-mono border border-slate-700">
                Interactive 3D • 3 Wires (Both Sides)
            </div>

            <Canvas shadows={{ type: THREE.PCFShadowMap }} camera={{ position: [0, 0, 2.5], fov: 45 }}>
                <color attach="background" args={['#f8fafc']} />

                {/* Lighting */}
                <ambientLight intensity={0.7} />
                <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
                <pointLight position={[-5, -2, -5]} intensity={0.3} />

                {/* Perfect Center Alignment */}
                <Center>
                    <CementPlank />
                </Center>

                {/* User Interaction Controls */}
                <OrbitControls
                    enablePan={false}
                    minDistance={1.2}
                    maxDistance={4}
                />
            </Canvas>
        </div>
    );
}