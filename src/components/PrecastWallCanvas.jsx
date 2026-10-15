'use client';

import React, { useRef, useLayoutEffect, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { WavePlankWorker } from './WavePlankWorker';

// 1. Move materials OUTSIDE component scope so they are never recreated
const CONCRETE_PLANK_MAT = new THREE.MeshStandardMaterial({
    color: '#F2F2F2',
    roughness: 0.85,
});
const CONCRETE_POST_MAT = new THREE.MeshStandardMaterial({
    color: '#F2F2F2',
    roughness: 0.8,
});
const JOINT_LINE_MAT = new THREE.MeshStandardMaterial({
    color: '#686868',
    roughness: 0.95,
});

function ProceduralWallModel({ isVisible }) {
    const modelRef = useRef();
    const planksRef = useRef();
    const jointsRef = useRef();
    const postsRef = useRef();
    const timer = useMemo(() => new THREE.Timer(), []);

    useFrame(() => {
        timer.update();
        const delta = timer.getDelta();
        if (isVisible && modelRef.current) {
            modelRef.current.rotation.y += delta * 0.22;
        }
    })
    // Specs
    const bayCount = 4;
    const bayWidth = 2.2;
    const plankHeight = 0.35;
    const plankThickness = 0.08;
    const plankCount = 5;

    const bayPositions = useMemo(
        () =>
            Array.from(
                { length: bayCount },
                (_, i) => (i - (bayCount - 1) / 2) * bayWidth
            ),
        [bayCount, bayWidth]
    );

    // 2. Batched InstancedMesh transformations (Reduces 50+ draw calls to 3)
    useLayoutEffect(() => {
        const dummy = new THREE.Object3D();
        let plankIdx = 0;
        let jointIdx = 0;

        // Set matrices for flat planks & joint lines
        bayPositions.forEach((bayX) => {
            for (let pIdx = 0; pIdx < plankCount; pIdx++) {
                // Plank
                dummy.position.set(bayX, pIdx * plankHeight + plankHeight / 2, 0);
                dummy.updateMatrix();
                planksRef.current?.setMatrixAt(plankIdx++, dummy.matrix);

                // Joint
                dummy.position.set(bayX, pIdx * plankHeight, 0);
                dummy.updateMatrix();
                jointsRef.current?.setMatrixAt(jointIdx++, dummy.matrix);
            }
        });

        // Set matrices for posts
        const totalHeight = (plankCount + 1) * plankHeight + 0.15;
        for (let i = 0; i <= bayCount; i++) {
            const postX = (i - bayCount / 2) * bayWidth;
            dummy.position.set(postX, totalHeight / 2, 0);
            dummy.updateMatrix();
            postsRef.current?.setMatrixAt(i, dummy.matrix);
        }

        if (planksRef.current) planksRef.current.instanceMatrix.needsUpdate = true;
        if (jointsRef.current) jointsRef.current.instanceMatrix.needsUpdate = true;
        if (postsRef.current) postsRef.current.instanceMatrix.needsUpdate = true;
    }, [bayPositions, bayCount, bayWidth, plankCount, plankHeight]);

    // // 3. Toned down rotation speed (0.04 instead of 0.12)
    // useFrame((_, delta) => {
    //     if (modelRef.current) {
    //         modelRef.current.rotation.y += delta * 0.22;
    //     }
    // });

    const totalPlanks = bayCount * plankCount;
    const totalPosts = bayCount + 1;

    return (
        <group ref={modelRef} scale={0.85} position={[0, -1.0, 0]}>
            {/* Batched Flat Planks */}
            <instancedMesh
                ref={planksRef}
                args={[null, null, totalPlanks]}
                material={CONCRETE_PLANK_MAT}
            >
                <boxGeometry args={[bayWidth - 0.08, plankHeight - 0.015, plankThickness]} />
            </instancedMesh>

            {/* Batched Joint Lines */}
            <instancedMesh
                ref={jointsRef}
                args={[null, null, totalPlanks]}
                material={JOINT_LINE_MAT}
            >
                <boxGeometry args={[bayWidth - 0.08, 0.01, plankThickness + 0.002]} />
            </instancedMesh>

            {/* Batched Support Posts */}
            <instancedMesh
                ref={postsRef}
                args={[null, null, totalPosts]}
                material={CONCRETE_POST_MAT}
            >
                <boxGeometry
                    args={[0.2, (plankCount + 1) * plankHeight + 0.15, 0.22]}
                />
            </instancedMesh>

            {/* Top Wave Planks calculated via Off-Thread Worker */}
            {bayPositions.map((bayX) => (
                <group
                    key={bayX}
                    position={[bayX, plankCount * plankHeight + 0.12, -plankThickness / 2]}
                >
                    <WavePlankWorker
                        width={bayWidth - 0.08}
                        height={plankHeight + 0.08}
                        thickness={plankThickness}
                        material={CONCRETE_PLANK_MAT}
                    />
                </group>
            ))}
        </group>
    );
}

export default function PreCastWallCanvas() {
    const [isCanvasReady, setIsCanvasReady] = useState(false);

    useEffect(() => {
        setIsCanvasReady(true);
    }, []);
    const canvasRef = useRef();
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            { threshold: 0.1 } // Triggers when 10% of canvas is visible
        );

        if (canvasRef.current) {
            observer.observe(canvasRef.current);
        }

        return () => observer.disconnect();
    }, []);

    if (!isCanvasReady) {
        return <div></div>
    }
    return (
        <div className="precast-wall-pattern absolute inset-0 z-0 w-full h-full pointer-events-none" ref={canvasRef}>
            <Canvas camera={{ position: [0, 2, 7], fov: 42 }} dpr={[1, 1.5]} frameloop={isVisible ? 'always' : 'demand'} gl={{ antialias: false, powerPreference: 'low-power' }}>
                <color attach="background" args={['#f8fafc']} />

                <ambientLight intensity={0.85} />
                <directionalLight
                    position={[8, 12, 6]}
                    intensity={1.8}
                    color="#fffbeb"
                />
                <directionalLight position={[-6, 4, -5]} intensity={0.4} color="#e2e8f0" />

                <ProceduralWallModel isVisible={isVisible} />
            </Canvas>
        </div>
    );
}