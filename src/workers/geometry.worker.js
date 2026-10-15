// src/workers/geometry.worker.js
import * as THREE from 'three';

self.onmessage = (event) => {
    const { width, height, thickness } = event.data;

    // 1. Build the 2D Wave Shape
    const shape = new THREE.Shape();
    const halfW = width / 2;
    const baseH = height - 0.15;

    shape.moveTo(-halfW, 0);
    shape.lineTo(halfW, 0);
    shape.lineTo(halfW, baseH);

    const segments = 60;
    for (let i = 0; i <= segments; i++) {
        const x = halfW - (i / segments) * width;
        const progress = (i / segments) * Math.PI * 6;
        const y = baseH + Math.abs(Math.sin(progress)) * 0.15;
        shape.lineTo(x, y);
    }
    shape.lineTo(-halfW, 0);

    // 2. Extrude Geometry
    const extrudeSettings = {
        depth: thickness,
        bevelEnabled: true,
        bevelSegments: 2,
        bevelSize: 0.005,
        bevelThickness: 0.005,
    };

    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geom.center();

    // 3. Extract Raw Typed Buffers (Positions and Normals)
    const positionBuffer = geom.attributes.position.array;
    const normalBuffer = geom.attributes.normal.array;

    // 4. Send ArrayBuffers back via zero-copy Transferable Objects
    self.postMessage(
        {
            position: positionBuffer,
            normal: normalBuffer,
        },
        [positionBuffer.buffer, normalBuffer.buffer] // Transfer ownership without copying
    );

    geom.dispose(); // Free memory in worker
};