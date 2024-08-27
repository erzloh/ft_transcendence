import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

export async function loadModels(scene) {
    const loader = new GLTFLoader();
    
    return new Promise((resolve, reject) => {
        loader.load('/static/assets/pong/scene.gltf', (gltf) => {
            scene.add(gltf.scene);

            const ball = gltf.scene.getObjectByName('Ball');
            const paddleLeft = gltf.scene.getObjectByName('PaddleLeft');
            const paddleRight = gltf.scene.getObjectByName('PaddleRight');

            const plane = gltf.scene.getObjectByName('Plane');
            if (plane) {
                plane.material.transparent = true;
                plane.material.opacity = 0.1;
                plane.material.depthWrite = false;
            }

            resolve({ ball, paddleLeft, paddleRight });
        }, undefined, (error) => {
            reject(error);
        });
    });
}

export async function loadFonts(scene) {
    const fontLoader = new FontLoader();

    fontLoader.load('/static/assets/pong/Orbitron_Regular.json', (font) => {
        const textMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0xffffff,
            emissiveIntensity: 1.0
        });

        const createScoreText = (position) => {
            const textGeometry = new TextGeometry('1', {
                font: font,
                size: 2,
                height: 0.5,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.1,
                bevelSize: 0.1,
                bevelSegments: 5
            });

            const scoreMesh = new THREE.Mesh(textGeometry, textMaterial);
            scoreMesh.position.copy(position);
            scoreMesh.rotation.x = -Math.PI * 0.25;
            scene.add(scoreMesh);
            return scoreMesh;
        };

        const scoreLeft = createScoreText(new THREE.Vector3(-9.5, 2, -12.5));
        const scoreRight = createScoreText(new THREE.Vector3(7.5, 2, -12.5));
    });
}