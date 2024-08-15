export function basePong() {
	const canvas = document.getElementById('canvas');
	const context = canvas.getContext('2d');
	const startButton= document.getElementById('startButton');
	const twoButton = document.getElementById('but1');
	const easyButton = document.getElementById('but2');
	const tournamentButton = document.getElementById('but3');

	const paddleWidth = 10, paddleHeight = 100;
	const ballSize = 10;
	let upLeftPressed = false, downLeftPressed = false;
	let upRightPressed = false, downRightPressed = false;
	let paused = false;
	let selectedMode = 0;

	let scoreLeft = 0;
	let	scoreRight = 0;

	//let playerScore = 0;
	//let computerScore = 0;

	const leftPad = {
		x: 0,
		y: canvas.height / 2 - paddleHeight / 2,
		width: paddleWidth,
		height: paddleHeight,
		color: "#FFF",
		dy: 5
	};

	const rightPad = {
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

	/*function drawText(text, x, y, color) {
		context.fillStyle = color;
		context.font = "32px 'CustomFont'";
		context.fillText(text, x, y);
	}
		*/

	function drawNet() {
		for (let i = 5; i <= canvas.height; i += 20) {
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

		let currentPlayer = (ball.x < canvas.width / 2) ? leftPad : rightPad;

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
			scoreLeft++;
			document.getElementById("leftScore").innerHTML = scoreLeft;
			//playerSc
            if (scoreLeft === 3) {
                callback('Player 1');
            }
			resetBall();
		} else if (ball.x < 0) {
			scoreRight++;
			document.getElementById("rightScore").innerHTML = scoreRight;
		
            if (scoreRight === 3) {
                callback('Player 1');
            }	
			//computerScore++;
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

	function movePaddles(selectedMode) {
		//console.log(selectedMode);
		if (selectedMode == 1) {
			if (upLeftPressed && leftPad.y > 0) {
				leftPad.y -= leftPad.dy;
			} else if (downLeftPressed && leftPad.y < canvas.height - leftPad.height) {
				leftPad.y += leftPad.dy;
			}

			if (rightPad.y + rightPad.height / 2 < ball.y) {
				rightPad.y += rightPad.dy;
			} else {
				rightPad.y -= rightPad.dy;
			}
		}
		else if (selectedMode == 2) {
			if (upLeftPressed && leftPad.y > 0) {
				leftPad.y -= leftPad.dy;
			} else if (downLeftPressed && leftPad.y < canvas.height - leftPad.height) {
				leftPad.y += leftPad.dy;
			}
			
			if (upRightPressed && rightPad.y > 0) {
				rightPad.y -= rightPad.dy;
			} else if (downRightPressed && rightPad.y < canvas.height - rightPad.height) {
				rightPad.y += rightPad.dy;
			}
		}
	}

	document.addEventListener("keydown", function(event) {
		switch (event.code) {
			case 'KeyW':
				upLeftPressed = true;
				break;
			case 'KeyS':
				downLeftPressed = true;
				break;
			case 'ArrowUp':
				upRightPressed = true;
				break;
			case 'ArrowDown':
				downRightPressed = true;
				break;
			case 'Space':
				paused = !paused;
				break;
		}
	});

	document.addEventListener("keyup", function(event) {
		switch (event.code) {
			case 'KeyW':
				upLeftPressed = false;
				break;
			case 'KeyS':
				downLeftPressed = false;
				break;
			case 'ArrowUp':
				upRightPressed = false;
				break;
			case 'ArrowDown':
				downRightPressed = false;
				break;
		}
	});

	function draw() {
		context.clearRect(0, 0, canvas.width, canvas.height);

		drawNet();

		drawRect(leftPad.x, leftPad.y, leftPad.width, leftPad.height, leftPad.color);
		drawRect(rightPad.x, rightPad.y, rightPad.width, rightPad.height, rightPad.color);

		drawSquare(ball.x, ball.y, ball.size, ball.color);

		//drawText(playerScore, canvas.width / 4, canvas.height / 5, "#FFF");
		//drawText(computerScore, 3 * canvas.width / 4, canvas.height / 5, "#FFF");

		if (paused) {
			context.fillStyle = "rgba(0, 0, 0, 0.5)";
			context.fillRect(0, 0, canvas.width, canvas.height);

		// drawText("Pause", canvas.width / 2 - 50, canvas.height / 2, "#FFF");
		}
	}

	/*function initGame(mode, context, canvas) {
	
		if (mode === 'cpu') {
			console.log("test-its cpu this time");
		} else {
			console.log("its 1v1 this time");
		}
	
		// Commencez la boucle du jeu
		gameLoop(context, canvas, player1, player2);
	}
		*/

	function update() {
		if (!paused) {
			movePaddles(selectedMode);
			moveBall();
			//draw();
		}
	}

	function gameLoop() {
		update();
		draw();
		requestAnimationFrame(gameLoop);
	}

	startButton.addEventListener("click", function() {
		if (selectedMode == 1) {
			startButton.style.display = "none";
			gameLoop();
		}
		else if (selectedMode == 2) {
			startButton.style.display = "none";
			gameLoop();
		}
		else if (selectedMode == 3) {
			startButton.style.display = "none";
			console.log("tournament mode")
//			startTournament();
		}
		else
			alert("no game mode selected");
		//canvas.style.display = "block";
	});

	twoButton.addEventListener("click", function() {
		selectedMode = 2;
		console.log("game mode is 1v1");
		//canvas.style.display = "block";
	});

	easyButton.addEventListener("click", function() {
		selectedMode = 1;
		console.log("game mode is single player and easy");
	});
	tournamentButton.addEventListener("click", function() {
		selectedMode = 3;
		console.log("tournament mode")
	});
}