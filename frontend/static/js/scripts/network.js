// class Level {
//     constructor(inNb, outNb) {
//         this.inputs = new Array(inNb);
//         this.outputs = new Array(outNb);
//         this.biases = new Array(outNb);

//         this.weights = [];
//         for(let i = 0; i < inNb; i++) {
//             this.weights[i] = new Array(outNb);
//         }

//         Level.#randomize(this);
//     }

//     // Make random numbers for weights (values are between -1 and 1)
//     static #randomize(level) {
//         for(let i = 0; i < level.inputs.length; i++) {
//             for(let j = 0; j < level.outputs.length; j++) {
//                 level.weights[i][j] = Math.random() * 2 - 1;
//             }
//         }

//         for(let i = 0; i < level.biases.length; i++) {
//             level.biases[i] = Math.random() * 2 - 1;
//         }
//     }

//     static feedForward(givenInputs, level) {
//         for(let i = 0; i < level.inputs.length; i++) {
//             level.inputs[i] = givenInputs[i];
//         }

//         for(let i = 0; i < level.outputs.length; i++) {
//             let sum = 0;
//             for(let j = 0; j < level.inputs.length; j++) {
//                 sum += level.inputs[j] * level.weights[j][i];
//             }

//             if(sum > level.biases[i]) {
//                 level.outputs[i] = 1;
//             } else {
//                 level.outputs[i] = 0;
//             }
//         }

//         return level.outputs;  
//     }
// }

let lastAIUpdate = 0;
let targetY = 0;

function aiControlLeftPaddle(paddle, ball) {
    const currentTime = Date.now();
    
    // Update AI information once per second
    if (currentTime - lastAIUpdate >= 1000) {
        lastAIUpdate = currentTime;
        targetY = ball.pos.y;
    }

    // Move paddle towards the target
    if (paddle.pos.y + paddle.height / 2 < targetY - 10) {
        paddle.pos.y += paddle.velocity.y;
    } else if (paddle.pos.y + paddle.height / 2 > targetY + 10) {
        paddle.pos.y -= paddle.velocity.y;
    }

    paddleEdgeCollision(paddle);
}

