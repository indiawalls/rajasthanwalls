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
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';

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
    texture.repeat.set(12, 5);
    return texture;
}

// 2. Procedural Concertina Razor Wire Coil Component
function ConcertinaCoil({ length = 5.0, radius = 0.45, loops = 12, material }) {
    const geometry = useMemo(() => {
        const points = [];
        const totalPoints = loops * 40;

        for (let i = 0; i <= totalPoints; i++) {
            const progress = i / totalPoints;
            const angle = progress * loops * Math.PI * 2;
            const x = (progress - 0.5) * length;
            const y = Math.sin(angle) * radius;
            const z = Math.cos(angle) * radius;
            points.push(new THREE.Vector3(x, y, z));
        }

        const curve = new THREE.CatmullRomCurve3(points);
        return new THREE.TubeGeometry(curve, loops * 30, 0.012, 8, false);
    }, [length, radius, loops]);

    // Generate little razor barb spikes along the coil path
    const barbs = useMemo(() => {
        const barbList = [];
        const barbCount = loops * 6;
        for (let i = 0; i < barbCount; i++) {
            const progress = i / barbCount;
            const angle = progress * loops * Math.PI * 2;
            const x = (progress - 0.5) * length;
            const y = Math.sin(angle) * radius;
            const z = Math.cos(angle) * radius;
            barbList.push({ pos: [x, y, z], rot: [angle, 0, Math.PI / 4] });
        }
        return barbList;
    }, [length, radius, loops]);

    return (
        <group>
            {/* Main Spiral Coil Wire */}
            <mesh geometry={geometry} material={material} castShadow />

            {/* Razor Barbs */}
            {barbs.map((b, idx) => (
                <mesh key={idx} position={b.pos} rotation={b.rot} material={material}>
                    <boxGeometry args={[0.04, 0.005, 0.02]} />
                </mesh>
            ))}
        </group>
    );
}

// 3. Complete Fence Assembly
function ConcertinaFenceAssembly() {
    const groupRef = useRef();
    const chainLinkTex = useMemo(() => createChainLinkTexture(), []);
    const timer = useMemo(() => new THREE.Timer(), []);

    const materials = useMemo(
        () => ({
            metalPost: new THREE.MeshStandardMaterial({
                color: '#F2F2F2',
                roughness: 0.35,
                metalness: 0.85,
            }),
            chainLink: new THREE.MeshStandardMaterial({
                map: chainLinkTex,
                transparent: true,
                alphaTest: 0.3,
                side: THREE.DoubleSide,
                roughness: 0.5,
                metalness: 0.7,
            }),
            razorWire: new THREE.MeshStandardMaterial({
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

    const width = 5.2;
    const height = 2.2;
    const postRadius = 0.045;
    const topRailRadius = 0.035;

    // Continuous gentle rotation
    useFrame(() => {
        timer.update();
        const delta = timer.getDelta();
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.12;
        }
    });

    return (
        <group ref={groupRef}>
            {/* Ground Support Base */}
            <mesh position={[0, -0.05, 0]} material={materials.ground} receiveShadow>
                <boxGeometry args={[width + 1.0, 0.1, 1.0]} />
            </mesh>

            {/* Vertical End Posts */}
            <mesh position={[-width / 2, height / 2, 0]} material={materials.metalPost} castShadow>
                <cylinderGeometry args={[postRadius, postRadius, height + 0.3, 16]} />
            </mesh>
            <mesh position={[width / 2, height / 2, 0]} material={materials.metalPost} castShadow>
                <cylinderGeometry args={[postRadius, postRadius, height + 0.3, 16]} />
            </mesh>

            {/* Horizontal Top Frame Rail */}
            <mesh
                position={[0, height, 0]}
                rotation={[0, 0, Math.PI / 2]}
                material={materials.metalPost}
                castShadow
            >
                <cylinderGeometry args={[topRailRadius, topRailRadius, width + 0.1, 16]} />
            </mesh>

            {/* Main Chain-Link Mesh Panel */}
            <mesh position={[0, height / 2, 0]} material={materials.chainLink} castShadow>
                <planeGeometry args={[width, height]} />
            </mesh>

            {/* Concertina Razor Wire Mounted Directly Above Top Rail */}
            <group position={[0, height + 0.4, 0]}>
                <ConcertinaCoil
                    length={width - 0.2}
                    radius={0.42}
                    loops={11}
                    material={materials.razorWire}
                />
            </group>
        </group>
    );
}

// 4. Main Showcase Component with Heading
export default function ViewConcertinaFence3D() {
    return (
        <div className="w-full max-w-5xl mx-auto p-4 space-y-4 font-sans">

            {/* Heading */}
            <div className="text-center space-y-1">
                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
                    View Your Concertina Chain-Link Fence in 3d
                </h2>
                <p className="text-sm text-slate-500">
                    Interactive 3D Preview • Drag to rotate, scroll to inspect razor wire coils and chain-link mesh
                </p>
            </div>

            {/* 3D Canvas Container */}
            <div className="w-full h-[450px] bg-[#f8fafc] rounded-2xl overflow-hidden shadow-sm border border-slate-200 relative">
                <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-md px-3 py-1 rounded-md text-xs text-slate-700 font-mono border border-slate-200 shadow-sm">
                    Framed Chain-Link • Top Concertina Razor Coils
                </div>

                <Canvas shadows={{ type: THREE.PCFShadowMap }} camera={{ position: [0, 1.8, 6.2], fov: 45 }}>
                    <color attach="background" args={['#f8fafc']} />

                    {/* Lighting */}
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
                        <ConcertinaFenceAssembly />
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