"use client";
import React, { useState, useEffect } from 'react';
import * as THREE from 'three';

let cachedGeometry = null;
let pendingWorkerPromise = null;

function getSharedGeometry(width, height, thickness) {
    if (cachedGeometry) {
        return Promise.resolve(cachedGeometry);
    }

    if (!pendingWorkerPromise) {
        pendingWorkerPromise = new Promise((resolve) => {
            const worker = new Worker(
                new URL('../workers/geometry.worker.js', import.meta.url),
                { type: 'module' }
            );

            worker.onmessage = (e) => {
                const { position, normal } = e.data;
                const bg = new THREE.BufferGeometry();
                bg.setAttribute('position', new THREE.BufferAttribute(position, 3));
                bg.setAttribute('normal', new THREE.BufferAttribute(normal, 3));
                cachedGeometry = bg;
                worker.terminate();
                resolve(bg);
            };

            worker.postMessage({ width, height, thickness });
        });
    }

    return pendingWorkerPromise;
}

export function WavePlankWorker({ width, height, thickness, material }) {
    const [geometry, setGeometry] = useState(cachedGeometry);

    useEffect(() => {
        let isMounted = true;
        if (!cachedGeometry) {
            getSharedGeometry(width, height, thickness).then((bg) => {
                if (isMounted) setGeometry(bg);
            });
        }
        return () => {
            isMounted = false;
        };
    }, [width, height, thickness]);

    if (!geometry) return null;

    return (
        <mesh
            geometry={geometry}
            material={material}
        />
    );
}