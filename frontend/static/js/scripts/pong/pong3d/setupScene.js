import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export function setupScene(canvasRef) {
    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(90, canvasRef.width / canvasRef.height, 0.1, 10000);
    camera.position.set(0, 20, 15);

    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvasRef });
    renderer.setSize(canvasRef.width, canvasRef.height);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;

    return { scene, camera, renderer, controls };
}