import * as THREE from 'three';
import { setupScene } from './setupScene.js';
import { loadModels, loadFonts } from './setupAsset.js';
import { setupPaddleControls } from './paddleMove.js';
import { setupBallMovement } from './ballMove.js';
import { setupLighting } from './setupLight.js';
import { createTextGeometry } from './textGeometry.js';

export class pongThree {
    constructor () {
        this.stopBtn = document.getElementById("stopBtn");
        this.canvasRef = document.getElementById('canvas');
        this.controller = setupScene(this.canvasRef);
        this.scoreLeftValue = 0;
        this.scoreRightValue = 0;
        this.objects;
        this.scores;
        this.gameStop = false;
    }

    initialize() {
        this.stopBtn.addEventListener("click", this.stopGameLoop.bind(this));
        this.loadThings();
        setupLighting(this.controller.scene);
    }

    async loadThings() {
        this.objects = await loadModels(this.controller.scene);
        this.scores = await loadFonts(this.controller.scene);

        this.movePaddles = setupPaddleControls(this.objects.paddleLeft, this.objects.paddleRight);
        this.moveBall = setupBallMovement(this.objects.ball, this.objects.paddleLeft, this.objects.paddleRight, this.updateScore.bind(this));

        this.startGameLoop();
    }

    updateScore(side) {
        if (side === 'left') {
            this.scoreLeftValue++;
            this.updateTextGeometry(this.scores.scoreLeft, this.scoreLeftValue);
        } else if (side === 'right') {
            this.scoreRightValue++;
            this.updateTextGeometry(this.scores.scoreRight, this.scoreRightValue);
        }
    }

    updateTextGeometry(scoreMesh, scoreValue) {
        if (scoreMesh.geometry) {
            scoreMesh.geometry.dispose(); // Dispose of old geometry
        }
        scoreMesh.geometry = createTextGeometry(scoreValue, this.scores.font);
    }

    startGameLoop() {
        if (!this.interval) {
            this.interval = setInterval(() => {
                this.update();
            }, 5);
        }
        this.animate();
    }

    update() {
        this.movePaddles();
        this.moveBall();
    }

    animate() {
        if (!this.gameStop)
            requestAnimationFrame(this.animate.bind(this));
       
        // controls.update();
        this.controller.renderer.render(this.controller.scene, this.controller.camera);
        this.controller.composer.render();
    }

    stopGameLoop() {
        this.gameStop = true;
        console.log("log");
    }
}