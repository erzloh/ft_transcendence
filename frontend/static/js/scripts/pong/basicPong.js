let eventListeners = { }

function basePong() {
	const canvas = document.getElementById('canvas');
	const context = canvas.getContext('2d');
	const startButton= document.getElementById('startButton');

	const leftPaddleName = document.getElementById('leftPaddleName');
	const rightPaddleName = document.getElementById('rightPaddleName');

	let endgameModalWinner = document.getElementById('endgameModalWinner');
	let endgameModalScore = document.getElementById('endgameModalScore');
	// let endgameModalTime = document.getElementById('endgameModalTime');
	// let endgameModalPlayAgain = document.getElementById('playAgainButton');
	let pauseModal = new bootstrap.Modal(document.getElementById('pauseModal'));
	let endgameModal = new bootstrap.Modal(document.getElementById('endgameModal'));

	const paddleWidth = 10, paddleHeight = 100, ballSize = 10;
	let upLeftPressed = false, downLeftPressed = false;
	let upRightPressed = false, downRightPressed = false;
	let paused = false;

	let scoreLeft = 0, scoreRight = 0;

	const usernamesString = localStorage.getItem('pongUsernames');
	let usernames = usernamesString ? JSON.parse(usernamesString) : {
		left: "Player1", right: "Player2"
	};

	leftPaddleName.innerHTML = usernames.left;
	rightPaddleName.innerHTML = usernames.right;

	const keybindsString = localStorage.getItem('pongKeybinds');
	let keybinds = keybindsString ? JSON.parse(keybindsString) : {
		lUp : 'KeyW', lDown : 'KeyS', rUp : 'ArrowUp', rDown : 'ArrowDown'
	};

	const gamemodeString = localStorage.getItem('pongGamemode');
	let gamemode = gamemodeString ? JSON.parse(gamemodeString) : "pvp";

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

	function endGame(winner) {
		// this.gameOver = true;
		// this.timer.stop();

		endgameModalWinner.textContent = winner + " won the game !";
		endgameModalScore.textContent = "Final score: " + scoreLeft + "-" + scoreRight;
		// endgameModalTime.textContent = "Time elapsed: " + this.timer.min.toString().padStart(2, '0') + ":" + this.timer.sec.toString().padStart(2, '0');

		// Show the modal
		endgameModal.show();
	}

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
                endGame(usernames.left);
            }
			resetBall();
		} else if (ball.x < 0) {
			scoreRight++;
			document.getElementById("rightScore").innerHTML = scoreRight;
		
            if (scoreRight === 3) {
                endGame(usernames.right);
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

	function movePaddles() {
		
		if (upLeftPressed && leftPad.y > 0) {
			leftPad.y -= leftPad.dy;
		} else if (downLeftPressed && leftPad.y < canvas.height - leftPad.height) {
			leftPad.y += leftPad.dy;
		}
		
		if (gamemode == "AI") {
			if (rightPad.y + rightPad.height / 2 < ball.y) {
				rightPad.y += rightPad.dy;
			} else {
				rightPad.y -= rightPad.dy;
			}
		}
		else {
			if (upRightPressed && rightPad.y > 0) {
				rightPad.y -= rightPad.dy;
			} else if (downRightPressed && rightPad.y < canvas.height - rightPad.height) {
				rightPad.y += rightPad.dy;
			}
		}
	}

	function draw() {
		context.clearRect(0, 0, canvas.width, canvas.height);

		drawNet();

		drawRect(leftPad.x, leftPad.y, leftPad.width, leftPad.height, leftPad.color);
		drawRect(rightPad.x, rightPad.y, rightPad.width, rightPad.height, rightPad.color);

		drawSquare(ball.x, ball.y, ball.size, ball.color);

		if (paused) {
			context.fillStyle = "rgba(0, 0, 0, 0.5)";
			context.fillRect(0, 0, canvas.width, canvas.height);
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
			movePaddles();
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
		gameLoop();
	});

	document.addEventListener("keydown", function(event) {
		switch (event.code) {
			case keybinds.lUp:
				upLeftPressed = true;
				break;
			case keybinds.lDown:
				downLeftPressed = true;
				break;
			case keybinds.rUp:
				upRightPressed = true;
				break;
			case keybinds.rDown:
				downRightPressed = true;
				break;
			case 'Escape':
				if (!paused)
					pauseModal.show();
				paused = !paused;
				break;
			default:
				break;
		}
	});

	document.addEventListener("keyup", function(event) {
		switch (event.code) {
			case keybinds.lUp:
				upLeftPressed = false;
				break;
			case keybinds.lDown:
				downLeftPressed = false;
				break;
			case keybinds.rUp:
				upRightPressed = false;
				break;
			case keybinds.rDown:
				downRightPressed = false;
				break;
			default:
				break;
		}
	});
}

export { basePong, eventListeners };