'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Center } from '@react-three/drei';
import * as THREE from 'three';

// 1. Procedural Chain-Link Wire Mesh Texture
function createChainLinkTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, 256, 256);
    ctx.strokeStyle = '#222222';
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';

    // Draw diamond wire pattern
    const step = 64;
    for (let x = -256; x < 512; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, -256);
        ctx.lineTo(x + 512, 512);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x, 512);
        ctx.lineTo(x + 512, -256);
        ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(16, 6);
    return texture;
}

// 2. Y-Crank Security Post Component
function YCrankPost({ position, height = 2.4, armLength = 0.45, material }) {
    const postRadius = 0.035;

    return (
        <group position={position}>
            {/* Main Vertical Post */}
            <mesh position={[0, height / 2, 0]} material={material} castShadow>
                <cylinderGeometry args={[postRadius, postRadius, height, 16]} />
            </mesh>

            {/* Y-Extension Crank Top */}
            <group position={[0, height, 0]}>
                {/* Left Arm */}
                <mesh
                    position={[-armLength * 0.35, armLength * 0.35, 0]}
                    rotation={[0, 0, Math.PI / 4]}
                    material={material}
                    castShadow
                >
                    <cylinderGeometry args={[postRadius * 0.75, postRadius * 0.75, armLength, 16]} />
                </mesh>

                {/* Right Arm */}
                <mesh
                    position={[armLength * 0.35, armLength * 0.35, 0]}
                    rotation={[0, 0, -Math.PI / 4]}
                    material={material}
                    castShadow
                >
                    <cylinderGeometry args={[postRadius * 0.75, postRadius * 0.75, armLength, 16]} />
                </mesh>
            </group>
        </group>
    );
}

// 3. Complete Security Fence Assembly
function FenceAssembly() {
    const groupRef = useRef();
    const timer = useMemo(() => new THREE.Timer(), []);
    const chainLinkTex = useMemo(() => createChainLinkTexture(), []);

    const materials = useMemo(
        () => ({
            metalPost: new THREE.MeshStandardMaterial({
                color: '#F2F2F2',
                roughness: 0.4,
                metalness: 0.8,
            }),
            chainLink: new THREE.MeshStandardMaterial({
                map: chainLinkTex,
                transparent: true,
                alphaTest: 0.3,
                side: THREE.DoubleSide,
                roughness: 0.5,
                metalness: 0.7,
            }),
            barbedWire: new THREE.MeshStandardMaterial({
                color: '#F2F2F2',
                roughness: 0.3,
                metalness: 0.9,
            }),
            ground: new THREE.MeshStandardMaterial({
                color: '#F2F2F2',
                roughness: 0.9,
            }),
        }),
        [chainLinkTex]
    );

    const postCount = 4;
    const fenceLength = 6.0;
    const postSpacing = fenceLength / (postCount - 1);
    const fenceHeight = 2.4;
    const armLength = 0.45;

    // Continuous background rotation
    useFrame(() => {
        timer.update();
        const delta = timer.getDelta();
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.12;
        }
    });

    return (
        <group ref={groupRef}>
            {/* Ground Strip Base */}
            <mesh position={[0, -0.05, 0]} material={materials.ground} receiveShadow>
                <boxGeometry args={[fenceLength + 1.2, 0.1, 1.2]} />
            </mesh>

            {/* Chain-Link Mesh Panel */}
            <mesh position={[0, fenceHeight / 2, 0]} material={materials.chainLink} castShadow>
                <planeGeometry args={[fenceLength, fenceHeight - 0.1]} />
            </mesh>

            {/* Vertical Y-Crank Posts */}
            {Array.from({ length: postCount }).map((_, idx) => {
                const xPos = -fenceLength / 2 + idx * postSpacing;
                return (
                    <YCrankPost
                        key={idx}
                        position={[xPos, 0, 0]}
                        height={fenceHeight}
                        armLength={armLength}
                        material={materials.metalPost}
                    />
                );
            })}

            {/* Top Barbed Wire Strands Running Along Y-Arms */}
            {[-0.28, -0.14, 0, 0.14, 0.28].map((offsetY, strandIdx) => {
                const leftArmX = -armLength * 0.35 + offsetY / 2;
                const rightArmX = armLength * 0.35 - offsetY / 2;
                const wireY = fenceHeight + armLength * 0.35 + offsetY;

                return (
                    <group key={strandIdx}>
                        {/* Left Arm Wire Strand using Euler Rotation */}
                        <mesh
                            position={[0, wireY, leftArmX]}
                            rotation={[0, 0, Math.PI / 2]}
                            material={materials.barbedWire}
                        >
                            <cylinderGeometry args={[0.006, 0.006, fenceLength + 0.2, 8]} />
                        </mesh>

                        {/* Right Arm Wire Strand using Euler Rotation */}
                        <mesh
                            position={[0, wireY, rightArmX]}
                            rotation={[0, 0, Math.PI / 2]}
                            material={materials.barbedWire}
                        >
                            <cylinderGeometry args={[0.006, 0.006, fenceLength + 0.2, 8]} />
                        </mesh>
                    </group>
                );
            })}
        </group>
    );
}

// 4. Main Showcase Component with Requested Heading
export default function ViewFencingPole3D() {
    return (
        <div className="w-full max-w-5xl mx-auto p-4 space-y-4 font-sans">

            {/* Heading */}
            <div className="text-center space-y-1">
                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
                    View Your Fencing pole in 3d
                </h2>
                <p className="text-sm text-slate-500">
                    Interactive 3D Security Fence • Drag to rotate, scroll to inspect Y-crank posts & barbed wire
                </p>
            </div>

            {/* 3D Canvas Container */}
            <div className="w-full h-[450px] bg-[#f8fafc] rounded-2xl overflow-hidden shadow-sm border border-slate-200 relative">
                <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-md px-3 py-1 rounded-md text-xs text-slate-700 font-mono border border-slate-200 shadow-sm">
                    Y-Crank Post System • Chain-Link & Barbed Wire
                </div>

                <Canvas shadows={{ type: THREE.PCFShadowMap }} camera={{ position: [0, 2.2, 6.5], fov: 45 }}>
                    <color attach="background" args={['#f8fafc']} />

                    {/* Studio Lighting Setup */}
                    <ambientLight intensity={0.8} />
                    <directionalLight
                        position={[6, 10, 6]}
                        intensity={1.8}
                        color="#ffffff"
                        castShadow
                        shadow-mapSize-width={2048}
                        shadow-mapSize-height={2048}
                    />
                    <directionalLight position={[-6, 4, -4]} intensity={0.4} color="#cbd5e1" />

                    <Center top>
                        <FenceAssembly />
                    </Center>

                    <OrbitControls
                        enablePan={false}
                        minDistance={3}
                        maxDistance={12}
                        maxPolarAngle={Math.PI / 2.02}
                    />
                </Canvas>
            </div>

        </div>
    );
}