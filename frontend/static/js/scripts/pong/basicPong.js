const canvas = document.getElementById('pongCanvas');
const context = canvas.getContext('2d');
const startButton = document.getElementById('startButton');

const paddleWidth = 10, paddleHeight = 100;
const ballSize = 10;
let upArrowPressed = false, downArrowPressed = false;
let paused = false;

let playerScore = 0;
let computerScore = 0;

const player = {
    x: 0,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: "#FFF",
    dy: 5
};

const computer = {
    x: canvas.width - paddleWidth,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: "#FFF",
    dy: 5
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: ballSize,
    speed: 4,
    dx: 4,
    dy: 4,
    color: "#FFF"
};

function drawRect(x, y, w, h, color) {
    context.fillStyle = color;
    context.fillRect(x, y, w, h);
}

function drawSquare(x, y, size, color) {
    context.fillStyle = color;
    context.fillRect(x, y, size, size);
}

function drawText(text, x, y, color) {
    context.fillStyle = color;
    context.font = "32px 'CustomFont'";
    context.fillText(text, x, y);
}

function drawNet() {
    for (let i = 0; i <= canvas.height; i += 20) {
        drawRect(canvas.width / 2 - 5, i, 10, 10, "#FFF");
    }
}

function collisionDetect(player, ball) {
    player.top = player.y;
    player.bottom = player.y + player.height;
    player.left = player.x;
    player.right = player.x + player.width;

    ball.top = ball.y;
    ball.bottom = ball.y + ball.size;
    ball.left = ball.x;
    ball.right = ball.x + ball.size;

    return player.left < ball.right && player.top < ball.bottom && player.right > ball.left && player.bottom > ball.top;
}

function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.y + ball.size > canvas.height || ball.y < 0) {
        ball.dy *= -1;
    }

    let currentPlayer = (ball.x < canvas.width / 2) ? player : computer;

    if (collisionDetect(currentPlayer, ball)) {
        ball.dx *= -1;

        ball.speed += 0.5;
        if (ball.dx > 0) {
            ball.dx = ball.speed;
        } else {
            ball.dx = -ball.speed;
        }
        if (ball.dy > 0) {
            ball.dy = ball.speed;
        } else {
            ball.dy = -ball.speed;
        }
    }

    if (ball.x + ball.size > canvas.width) {
        playerScore++;
        resetBall();
    } else if (ball.x < 0) {
        computerScore++;
        resetBall();
    }
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speed = 4;
    if (Math.random() > 0.5) {
        ball.dx = ball.speed;
    } else {
        ball.dx = -ball.speed;
    }
    if (Math.random() > 0.5) {
        ball.dy = ball.speed;
    } else {
        ball.dy = -ball.speed;
    }
}

function movePaddles() {
    if (upArrowPressed && player.y > 0) {
        player.y -= player.dy;
    } else if (downArrowPressed && player.y < canvas.height - player.height) {
        player.y += player.dy;
    }

    if (computer.y + computer.height / 2 < ball.y) {
        computer.y += computer.dy;
    } else {
        computer.y -= computer.dy;
    }
}

window.addEventListener("keydown", function(event) {
    switch (event.keyCode) {
        case 38:
            upArrowPressed = true;
            break;
        case 40:
            downArrowPressed = true;
            break;
        case 32:
            paused = !paused;
            break;
    }
});

window.addEventListener("keyup", function(event) {
    switch (event.keyCode) {
        case 38:
            upArrowPressed = false;
            break;
        case 40:
            downArrowPressed = false;
            break;
    }
});

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    drawNet();

    drawRect(player.x, player.y, player.width, player.height, player.color);
    drawRect(computer.x, computer.y, computer.width, computer.height, computer.color);

    drawSquare(ball.x, ball.y, ball.size, ball.color);

    drawText(playerScore, canvas.width / 4, canvas.height / 5, "#FFF");
    drawText(computerScore, 3 * canvas.width / 4, canvas.height / 5, "#FFF");

    if (paused) {
        context.fillStyle = "rgba(0, 0, 0, 0.5)";
        context.fillRect(0, 0, canvas.width, canvas.height);

       // drawText("Pause", canvas.width / 2 - 50, canvas.height / 2, "#FFF");
    }
}

function update() {
    if (!paused) {
        movePaddles();
        moveBall();
    }
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

startButton.addEventListener("click", function() {
    startButton.style.display = "none";
    canvas.style.display = "block";
    gameLoop();
});
