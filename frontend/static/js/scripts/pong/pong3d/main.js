import { setupScene } from './setupScene.js';
import { loadModels, loadFonts } from './setupAsset.js';
import { setupPaddleControls } from './paddleMove.js';
import { setupBallMovement } from './ballMove.js';
import { setupLighting } from './setupLight.js';

export async function pongThree() {
    const canvasRef = document.getElementById('canvas');
    const { scene, camera, renderer, controls } = setupScene(canvasRef);

    setupLighting(scene);

    const { ball, paddleLeft, paddleRight } = await loadModels(scene);
    await loadFonts(scene);

    const movePaddles = setupPaddleControls(paddleLeft, paddleRight);
    const moveBall = setupBallMovement(ball, paddleLeft, paddleRight);

    function animate() {
        requestAnimationFrame(animate);
        movePaddles();
        moveBall();
        controls.update();
        renderer.render(scene, camera);
    }

    animate();  // Start the animation loop
}