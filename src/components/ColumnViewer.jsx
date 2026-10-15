'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Center } from '@react-three/drei';
import * as THREE from 'three';

// 1. Procedural Concrete Texture Generator
function createConcreteTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#b0b0b0';
    ctx.fillRect(0, 0, 512, 512);

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
    texture.repeat.set(1, 4);
    return texture;
}

// 2. Custom Extruded H-Beam Column Geometry with Steel Wire Holes
function ColumnMesh() {
    const meshRef = useRef(null);
    const texture = useMemo(() => createConcreteTexture(), []);
    const timer = useMemo(() => new THREE.Timer(), []);

    // Dimensions in meters (6x6 inch cross-section, ~7ft height for display)
    const size = 0.15; // 6 inches = 150mm
    const height = 2.1; // ~7 feet
    const flangeThick = 0.035;
    const webThick = 0.035;

    const geometry = useMemo(() => {
        const shape = new THREE.Shape();
        const half = size / 2;
        const wHalf = webThick / 2;
        const fInner = half - flangeThick;

        // Outer H-Beam Profile Contour
        shape.moveTo(-half, -half);
        shape.lineTo(half, -half);
        shape.lineTo(half, -fInner);
        shape.lineTo(wHalf, -fInner);
        shape.lineTo(wHalf, fInner);
        shape.lineTo(half, fInner);
        shape.lineTo(half, half);
        shape.lineTo(-half, half);
        shape.lineTo(-half, fInner);
        shape.lineTo(-wHalf, fInner);
        shape.lineTo(-wHalf, -fInner);
        shape.lineTo(-half, -fInner);
        shape.closePath();

        // Add 6 PCC Steel Wire Holes (3 top flange, 3 bottom flange)
        const holeRadius = 0.006;
        const xOffsets = [-0.04, 0, 0.04];
        const yOffsets = [-0.055, 0.055];

        yOffsets.forEach((y) => {
            xOffsets.forEach((x) => {
                const hole = new THREE.Path();
                hole.absarc(x, y, holeRadius, 0, Math.PI * 2, true);
                shape.holes.push(hole);
            });
        });

        const extrudeSettings = {
            depth: height,
            bevelEnabled: true,
            bevelSegments: 2,
            steps: 1,
            bevelSize: 0.002,
            bevelThickness: 0.002,
        };

        const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        geom.center(); // Center geometry for rotation
        return geom;
    }, [size, height, flangeThick, webThick]);

    // Gentle Y-axis auto-rotation
    useFrame(() => {
        timer.update();
        const delta = timer.getDelta();
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.25;
        }
    });

    return (
        <mesh ref={meshRef} geometry={geometry} castShadow receiveShadow>
            <meshStandardMaterial
                map={texture}
                roughness={0.8}
                metalness={0.05}
                color="#F2F2F2"
            />
        </mesh>
    );
}

// 3. Main Viewer Component
export default function ColumnViewer() {
    return (
        <div className="w-full h-[400px] bg-[#f8fafc] rounded-xl overflow-hidden shadow-sm border border-slate-200 relative">
            <div className="absolute top-3 left-3 z-10 bg-white/80 backdrop-blur-md px-3 py-1 rounded-md text-xs text-slate-600 font-mono border border-slate-200 shadow-sm">
                Interactive 3D • Drag to rotate / Scroll to zoom
            </div>

            <Canvas shadows={{ type: THREE.PCFShadowMap }} camera={{ position: [1.2, 1.2, 1.8], fov: 45 }}>
                {/* Soft slate background fill */}
                <color attach="background" args={['#f8fafc']} />

                {/* Studio Lighting Setup */}
                <ambientLight intensity={0.8} />
                <directionalLight position={[4, 6, 4]} intensity={1.1} castShadow />
                <directionalLight position={[-4, 2, -4]} intensity={0.4} />

                <Center top>
                    <ColumnMesh />
                </Center>

                <OrbitControls
                    enablePan={false}
                    minDistance={1.0}
                    maxDistance={3.5}
                />
            </Canvas>
        </div>
    );
}