import * as THREE from 'three';

export function setupBallMovement(ball, paddleLeft, paddleRight) {
    const originalSpeed = new THREE.Vector3(0.15, 0, 0.15);
    let ballSpeed = originalSpeed.clone();

    function collisionDetect(paddle, ball) {
        const paddleBox = new THREE.Box3().setFromObject(paddle);
        const ballBox = new THREE.Box3().setFromObject(ball);
        return paddleBox.intersectsBox(ballBox);
    }

    function moveBall() {
        ball.position.x += ballSpeed.x;
        ball.position.z += ballSpeed.z;

        if (ball.position.z >= 8.35 || ball.position.z <= -8.35) {
            ballSpeed.z = -ballSpeed.z;
        }

        if (collisionDetect(paddleLeft, ball) || collisionDetect(paddleRight, ball)) {
            ballSpeed.x = -ballSpeed.x;
            increaseBallSpeed();
        }

        if (ball.position.x > 17 || ball.position.x < -17) {
            resetBall();
        }
    }

    function increaseBallSpeed() {
        const speedMultiplier = 1.05;
        ballSpeed.multiplyScalar(speedMultiplier);
    }

    function resetBall() {
        ball.position.set(0, 0, 0);
        ballSpeed.copy(originalSpeed);
    }

    return moveBall;
}