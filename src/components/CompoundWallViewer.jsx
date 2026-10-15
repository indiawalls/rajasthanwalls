'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Center, Html } from '@react-three/drei';
import * as THREE from 'three';

// 1. Procedural Concrete Texture
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

// 2. Extruded H-Beam Column Geometry
function ColumnMesh({ material }) {
    const size = 0.15;
    const height = 2.4; // Total post height (~8ft including footing depth)
    const flangeThick = 0.035;
    const webThick = 0.035;

    const geometry = useMemo(() => {
        const shape = new THREE.Shape();
        const half = size / 2;
        const wHalf = webThick / 2;
        const fInner = half - flangeThick;

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

        // Steel wire holes
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
        geom.center();
        return geom;
    }, [size, height, flangeThick, webThick]);

    return (
        <mesh geometry={geometry} material={material} castShadow receiveShadow rotation={[-Math.PI / 2, 0, 0]} />
    );
}

// 3. Precast Assembly (2 Pillars, 2 Isolated Grout Footings, No Earth Plank)
function WallAssembly() {
    const assemblyRef = useRef();
    const timer = useMemo(() => new THREE.Timer(), []);
    const texture = useMemo(() => createConcreteTexture(), []);

    const materials = useMemo(
        () => ({
            concrete: new THREE.MeshStandardMaterial({
                map: texture,
                roughness: 0.8,
                metalness: 0.05,
                color: '#E2E2E2',
            }),
            groutFooting: new THREE.MeshStandardMaterial({
                color: '#858A7E',
                roughness: 0.9,
            }),
            jointLine: new THREE.MeshStandardMaterial({
                color: '#666666',
                roughness: 0.9,
            }),
            dimensionLine: new THREE.MeshBasicMaterial({
                color: '#ef4444',
            }),
        }),
        [texture]
    );

    const pillarsCount = 2; // Fixed to 2 columns
    const bayCount = pillarsCount - 1; // 1 bay
    const bayWidth = 1.8;
    const panelHeight = 0.3; // 6 panels * 0.3m = 1.8m (~6 feet above ground)
    const panelCount = 6;
    const panelThickness = 0.07;
    const groutDepth = 0.6; // ~2 feet below ground

    const totalLength = bayCount * bayWidth;

    // Gentle continuous rotation
    useFrame(() => {
        timer.update();
        const delta = timer.getDelta();
        if (assemblyRef.current) {
            assemblyRef.current.rotation.y += delta * 0.15;
        }
    });

    return (
        <group ref={assemblyRef}>
            {/* 2 Vertical Concrete H-Beam Columns + 2 Isolated Grout Footings ONLY */}
            {Array.from({ length: pillarsCount }).map((_, i) => {
                const xPos = (i - (pillarsCount - 1) / 2) * bayWidth;
                return (
                    <group key={i} position={[xPos, 0, 0]}>
                        {/* Column Post */}
                        <group position={[0, (panelCount * panelHeight) / 2 - 0.1, 0]}>
                            <ColumnMesh material={materials.concrete} />
                        </group>

                        {/* Isolated Grout Footing (1 per column) */}
                        <mesh position={[0, -groutDepth / 2, 0]} material={materials.groutFooting} receiveShadow castShadow>
                            <boxGeometry args={[0.35, groutDepth, 0.35]} />
                        </mesh>
                    </group>
                );
            })}

            {/* Horizontal Precast Wall Panels for 1 Bay */}
            {Array.from({ length: bayCount }).map((_, bIdx) => {
                const bayX = (bIdx - (bayCount - 1) / 2) * bayWidth;
                return (
                    <group key={bIdx} position={[bayX, 0, 0]}>
                        {Array.from({ length: panelCount }).map((_, pIdx) => (
                            <group key={pIdx} position={[0, pIdx * panelHeight + panelHeight / 2, 0]}>
                                {/* Horizontal Plank */}
                                <mesh material={materials.concrete} castShadow receiveShadow>
                                    <boxGeometry args={[bayWidth - 0.08, panelHeight - 0.01, panelThickness]} />
                                </mesh>
                                {/* Joint Groove */}
                                <mesh position={[0, -panelHeight / 2, 0]} material={materials.jointLine}>
                                    <boxGeometry args={[bayWidth - 0.08, 0.008, panelThickness + 0.002]} />
                                </mesh>
                            </group>
                        ))}
                    </group>
                );
            })}

            {/* --- Dimension Indicators & Text Labels --- */}

            {/* 2 Feet Grout Footings Label */}
            <group position={[totalLength / 2 + 0.4, -groutDepth / 2, 0]}>
                <Html center position={[0.2, 0, 0]}>
                    <div className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow whitespace-nowrap">
                        2 SEPARATE GROUT FOOTINGS (2 FT DEPTH)
                    </div>
                </Html>
                <mesh position={[0, 0, 0]} material={materials.dimensionLine}>
                    <boxGeometry args={[0.015, groutDepth, 0.015]} />
                </mesh>
            </group>

            {/* 6 Feet Panel Wall Label */}
            <group position={[totalLength / 2 + 0.4, (panelCount * panelHeight) / 2, 0]}>
                <Html center position={[0.2, 0, 0]}>
                    <div className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow whitespace-nowrap">
                        6 FT WALL (6 PANELS)
                    </div>
                </Html>
                <mesh position={[0, 0, 0]} material={materials.dimensionLine}>
                    <boxGeometry args={[0.015, panelCount * panelHeight, 0.015]} />
                </mesh>
            </group>

            {/* Panel Width Label */}
            <group position={[0, panelCount * panelHeight + 0.12, 0.05]}>
                <Html center position={[0, -0.08, 0]}>
                    <div className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow whitespace-nowrap">
                        6 FT BAY WIDTH
                    </div>
                </Html>
                <mesh position={[0, 0, 0]} material={materials.dimensionLine}>
                    <boxGeometry args={[bayWidth, 0.015, 0.015]} />
                </mesh>
            </group>
        </group>
    );
}

// 4. Main Viewer Component
export default function ColumnViewer() {
    return (
        <div className="w-full max-w-5xl mx-auto p-2 space-y-2 font-sans">
            <div className="w-full h-[450px] bg-[#f8fafc] rounded-xl overflow-hidden shadow-sm border border-slate-200 relative">
                <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-md px-3 py-1 rounded-md text-xs text-slate-700 font-mono border border-slate-200 shadow-sm">
                    2 Pillars • 2 Isolated Grout Footings • Drag to rotate
                </div>

                <Canvas shadows={{ type: THREE.PCFShadowMap }} camera={{ position: [0, -0.5, 8], fov: 42 }}>
                    <color attach="background" args={['#f8fafc']} />

                    <ambientLight intensity={0.85} />
                    <directionalLight
                        position={[6, 10, 6]}
                        intensity={1.6}
                        color="#ffffff"
                        castShadow
                        shadow-mapSize-width={1024}
                        shadow-mapSize-height={1024}
                    />
                    <directionalLight position={[-6, 4, -4]} intensity={0.4} color="#cbd5e1" />

                    <Center fit>
                        <WallAssembly />
                    </Center>

                    <OrbitControls
                        enablePan={false}
                        minDistance={3}
                        maxDistance={10}
                    />
                </Canvas>
            </div>
        </div>
    );
}