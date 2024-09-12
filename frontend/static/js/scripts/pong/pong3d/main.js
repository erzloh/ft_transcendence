import * as THREE from 'three';
import { setupScene } from './setupScene.js';
import { loadModels, loadFonts } from './setupAsset.js';
import { setupPaddleControls } from './paddleMove.js';
import { setupBallMovement } from './ballMove.js';
import { setupLighting } from './setupLight.js';
import { createTextGeometry } from './textGeometry.js';

export async function pongThree() {
    const canvasRef = document.getElementById('canvas');
    const { scene, camera, renderer, controls, composer } = setupScene(canvasRef);

    setupLighting(scene);

    const { ball, paddleLeft, paddleRight } = await loadModels(scene);
    const { scoreLeft, scoreRight, font } = await loadFonts(scene);


    let scoreLeftValue = 0;
    let scoreRightValue = 0;

    function updateScore(side) {
        if (side === 'left') {
            scoreLeftValue++;
            updateTextGeometry(scoreLeft, scoreLeftValue);
        } else if (side === 'right') {
            scoreRightValue++;
            updateTextGeometry(scoreRight, scoreRightValue);
        }
    }

    function updateTextGeometry(scoreMesh, scoreValue) {
        if (scoreMesh.geometry) {
            scoreMesh.geometry.dispose(); // Dispose of old geometry
        }
        scoreMesh.geometry = createTextGeometry(scoreValue, font);
    }

    const movePaddles = setupPaddleControls(paddleLeft, paddleRight);
    const moveBall = setupBallMovement(ball, paddleLeft, paddleRight, updateScore);

    function animate() {
        requestAnimationFrame(animate);
        movePaddles();
        moveBall();
        controls.update();
		renderer.render(scene, camera);
		composer.render();
    }

    animate();
}
