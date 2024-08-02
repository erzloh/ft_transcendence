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

// 1000 = 1sec 
let fps = 1000

/*-------------------------------------------BALL FOLLOW AI------------------------------------------------*/

// Simple AI (function) that follows the ball 
function AiFollowPaddle(paddle, ball) {
    const currentTime = Date.now();
    
    // Update AI information once per second
    if (currentTime - lastAIUpdate >= fps) {
        lastAIUpdate = currentTime;
        targetY = ball.pos.y;
    }

    // Move paddle towards the target
    if (paddle.pos.y + paddle.height / 2 < targetY - 10) {
        paddle.pos.y += paddle.velocity.y;
    } else if (paddle.pos.y + paddle.height / 2 > targetY + 10) {
        paddle.pos.y -= paddle.velocity.y;
    }
}




 /*-------------------------------------------BALL PREDICTION AI------------------------------------------------*/

// Medium AI that predicts the next ball position
let predictedPosition

function AiPredictPaddle(paddle, ball) {
    const currentTime = Date.now();
    
    if (currentTime - lastAIUpdate >= fps) {
        lastAIUpdate = currentTime;
        
        // Predict ball position
        predictedPosition = predictBallPosition(ball);
        // console.log(`Actual: (${ball.pos.x.toFixed(2)}, ${ball.pos.y.toFixed(2)}) | Predicted: (${predictedPosition.x.toFixed(2)}, ${predictedPosition.y.toFixed(2)})`);
        targetY = predictedPosition.y - paddle.height / 2;
    }
    
    // Move paddle towards target
    if (paddle.pos.y < targetY) {
        paddle.pos.y += paddle.velocity.y;
    } else if (paddle.pos.y > targetY) {
        paddle.pos.y -= paddle.velocity.y;
    }
    
    paddleEdgeCollision(paddle);
}

function predictBallPosition(ball) {
    let futureX = ball.pos.x;
    let futureY = ball.pos.y;
    let velocityX = ball.velocity.x;
    let velocityY = ball.velocity.y;

    for (let i = 0; i < 60; i++) {
        futureX += velocityX;
        futureY += velocityY;

        if (futureY + ball.radius >= canvas.height) {
            futureY = canvas.height - ball.radius;
            velocityY *= -1;
        } else if (futureY - ball.radius <= 0) {
            futureY = ball.radius;
            velocityY *= -1;
        }

        if (futureX + ball.radius >= canvas.width || futureX - ball.radius <= 0) {
            break;
        }
    }

    return { x: futureX, y: futureY };
}

// Aim Assit xD
function drawPredictionDot() {
    if (predictedPosition) {
        context.fillStyle = "red";
        context.beginPath();
        context.arc(predictedPosition.x, predictedPosition.y, 5, 0, Math.PI * 2);
        context.fill();
    }
}




/*--------------------------------------GAMEMODES-------------------------------------------------*/

let gameMode = 1; //Per default on 1 => 2 Players

document.getElementById('but1').addEventListener('click', () => gameMode = 1);
document.getElementById('but2').addEventListener('click', () => gameMode = 2);
document.getElementById('but3').addEventListener('click', () => gameMode = 3);


//! Pour Eric si tu veux un truc qui garde le bouton visuellement activé
// const buttons = document.querySelectorAll('.btn');

// buttons.forEach(button => {
//     button.addEventListener('click', () => {
//         // Deactivate all buttons
//         buttons.forEach(btn => btn.classList.remove('active'));
        
//         // Activate the clicked button
//         button.classList.add('active');
        
//         // Perform action based on the clicked button
//         if (button.id === 'but1') {
//             // Action for 2 Players
//         } else if (button.id === 'but2') {
//             // Action for Easy AI
//         } else if (button.id === 'but3') {
//             // Action for Medium AI
//         }
//     });
// });
