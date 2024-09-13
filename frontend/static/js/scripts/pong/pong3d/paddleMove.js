export function setupPaddleControls(paddleLeft, paddleRight) {
    const keys = { ArrowUp: false, ArrowDown: false, KeyW: false, KeyS: false };

    document.addEventListener('keydown', (event) => {
        if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(event.code) > -1) {
			event.preventDefault();
		}
        keys[event.code] = true;
    });

    document.addEventListener('keyup', (event) => {
        keys[event.code] = false;
    });

    return function movePaddles() {
        const paddleSpeed = 0.1;
        const zBound = 8.5 - 2.5;

        if (keys.ArrowUp) paddleRight.position.z -= paddleSpeed;
        if (keys.ArrowDown) paddleRight.position.z += paddleSpeed;
        if (keys.KeyW) paddleLeft.position.z -= paddleSpeed;
        if (keys.KeyS) paddleLeft.position.z += paddleSpeed;

        paddleLeft.position.z = Math.max(-zBound, Math.min(zBound, paddleLeft.position.z));
        paddleRight.position.z = Math.max(-zBound, Math.min(zBound, paddleRight.position.z));
    };
}