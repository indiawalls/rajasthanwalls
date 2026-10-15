import * as THREE from 'three';

export function createConcreteTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Base cement gray
    ctx.fillStyle = '#F2F2F2';
    ctx.fillRect(0, 0, 512, 512);

    const imgData = ctx.getImageData(0, 0, 512, 512);
    const data = imgData.data;

    // Add high-frequency noise for aggregate grit & pores
    for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * 45;
        data[i] = Math.min(255, Math.max(0, data[i] + noise));     // Red
        data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise)); // Green
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise)); // Blue
    }
    ctx.putImageData(imgData, 0, 0);

    // Overlay larger, subtle dark patches (concrete curing stains)
    for (let i = 0; i < 20; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const radius = 20 + Math.random() * 60;
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, 'rgba(40, 40, 40, 0.15)');
        gradient.addColorStop(1, 'rgba(128, 128, 128, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 1);
    return texture;
}