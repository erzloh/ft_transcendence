import { Ball, Pad }  from "./objects.js";

export let eventListeners = { }

export class PongGame {
	constructor() {
		this.cvs = document.getElementById('canvas');
		this.ctx = this.cvs.getContext('2d');
		this.startButton= document.getElementById('startButton');

		this.objectiveLabel = document.getElementById('objectiveLabel');
		this.leftPaddleName = document.getElementById('leftPaddleName');
		this.rightPaddleName = document.getElementById('rightPaddleName');

		this.endgameModalWinner = document.getElementById('endgameModalWinner');
		this.endgameModalScore = document.getElementById('endgameModalScore');
		// let endgameModalTime = document.getElementById('endgameModalTime');
		// let endgameModalPlayAgain = document.getElementById('playAgainButton');
		this.pauseModal = new bootstrap.Modal(document.getElementById('pauseModal'));
		this.endgameModal = new bootstrap.Modal(document.getElementById('endgameModal'));

		this.pWidth = 10, this.pHeight = 100, this.bSize = 10;
		this.upLeftPressed = false, this.downLeftPressed = false;
		this.upRightPressed = false, this.downRightPressed = false;
		this.paused = false;

		const usernamesString = localStorage.getItem('pongUsernames');
		this.usernames = usernamesString ? JSON.parse(usernamesString) : {
			left: "player1", right: "player2"
		};

		this.leftPaddleName.innerHTML = this.usernames.left;
		this.rightPaddleName.innerHTML = this.usernames.right;

		const keybindsString = localStorage.getItem('pongKeybinds');
		this.keybinds = keybindsString ? JSON.parse(keybindsString) : {
			lUp : 'KeyW', lDown : 'KeyS', rUp : 'ArrowUp', rDown : 'ArrowDown'
		};

		const gamemodeString = localStorage.getItem('pongGamemode');
		this.gamemode = gamemodeString ? JSON.parse(gamemodeString) : "pvp";

		const objectiveString = localStorage.getItem('pongObjective');
		this.objective = objectiveString ? JSON.parse(objectiveString) : 3;
		this.objectiveLabel.innerHTML = "points to win: " + this.objective;

		this.leftPad = new Pad(0, this.cvs.height / 2 - this.pHeight / 2, 
			this.pWidth, this.pHeight, "#FFF", 5);
		this.rightPad = new Pad(this.cvs.width - this.pWidth, this.cvs.height / 2 - this.pHeight / 2, 
			this.pWidth, this.pHeight, "#FFF", 5);
		this.ball = new Ball(this.cvs.width / 2, this.cvs.height / 2,
			this.bSize, "#FFF", 4, 4, 4 );

		this.boundPongHandleKeyDown = this.handleKeyDown.bind(this);
		this.boundPongHandleKeyUp = this.handleKeyUp.bind(this);
		this.gameLoop = this.gameLoop.bind(this);
	}

	initialize() {
		this.startButton.addEventListener("click", () => this.startGame());

		document.addEventListener("keydown", this.boundPongHandleKeyDown);
		eventListeners["keydown"] = this.boundPongHandleKeyDown;

		document.addEventListener("keyup", this.boundPongHandleKeyUp);
		eventListeners["keyup"] = this.boundPongHandleKeyUp;
	}

	startGame() {
		this.gameLoop();
	}

	endGame(winner) {
		// this.gameOver = true;
		// this.timer.stop();

		this.endgameModalWinner.textContent = winner + " won the game !";
		this.endgameModalScore.textContent = "Final score: " + this.leftPad.score + "-" + this.rightPad.score;
		// endgameModalTime.textContent = "Time elapsed: " + this.timer.min.toString().padStart(2, '0') + ":" + this.timer.sec.toString().padStart(2, '0');

		// Show the modal
		this.endgameModal.show();
	}

	// TODO: Move those to pads and Ball
	drawRect(x, y, w, h, color) {
		this.ctx.fillStyle = color;
		this.ctx.fillRect(x, y, w, h);
	}

	drawSquare(x, y, size, color) {
		this.ctx.fillStyle = color;
		this.ctx.fillRect(x, y, size, size);
	}

	drawNet() {
		for (let i = 5; i <= this.cvs.height; i += 20) {
			this.drawRect(this.cvs.width / 2 - 5, i, 10, 10, "#FFF");
		}
	}

	collisionDetect(player, ball) {
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

	// TODO: move this to ball
	moveBall() {
		this.ball.x += this.ball.dx;
		this.ball.y += this.ball.dy;

		if (this.ball.y + this.ball.size > this.cvs.height || this.ball.y < 0) {
			this.ball.dy *= -1;
		}

		let currentPlayer = (this.ball.x < this.cvs.width / 2) ? this.leftPad : this.rightPad;

		if (this.collisionDetect(currentPlayer, this.ball)) {
			this.ball.dx *= -1;

			this.ball.speed += 0.5;
			if (this.ball.dx > 0) {
				this.ball.dx = this.ball.speed;
			} else {
				this.ball.dx = -this.ball.speed;
			}
			if (this.ball.dy > 0) {
				this.ball.dy = this.ball.speed;
			} else {
				this.ball.dy = -this.ball.speed;
			}
		}

		if (this.ball.x + this.ball.size > this.cvs.width) {
			this.leftPad.score++;
			document.getElementById("leftScore").innerHTML = this.leftPad.score;
			//playerSc
            if (this.leftPad.score >= this.objective) {
                this.endGame(this.usernames.left);
            }
			this.resetBall();
		} else if (this.ball.x < 0) {
			this.rightPad.score++;
			document.getElementById("rightScore").innerHTML = this.rightPad.score;
		
            if (this.rightPad.score >= this.objective) {
                this.endGame(this.usernames.right);
            }	
			//computerScore++;
			this.resetBall();
		}
	}

	// TODO: Move this to ball
	resetBall() {
		this.ball.x = this.cvs.width / 2;
		this.ball.y = this.cvs.height / 2;
		this.ball.speed = 4;
		if (Math.random() > 0.5) {
			this.ball.dx = this.ball.speed;
		} else {
			this.ball.dx = -this.ball.speed;
		}
		if (Math.random() > 0.5) {
			this.ball.dy = this.ball.speed;
		} else {
			this.ball.dy = -this.ball.speed;
		}
	}

	//TODO: Move this to paddle
	movePaddles() {
		
		if (this.upLeftPressed && this.leftPad.y > 0) {
			this.leftPad.y -= this.leftPad.dy;
		} else if (this.downLeftPressed && this.leftPad.y < this.cvs.height - this.leftPad.height) {
			this.leftPad.y += this.leftPad.dy;
		}
		
		if (this.gamemode == "AI") {
			if (this.rightPad.y + this.rightPad.height / 2 < this.ball.y) {
				this.rightPad.y += this.rightPad.dy;
			} else {
				this.rightPad.y -= this.rightPad.dy;
			}
		}
		else {
			if (this.upRightPressed && this.rightPad.y > 0) {
				this.rightPad.y -= this.rightPad.dy;
			} else if (this.downRightPressed && this.rightPad.y < this.cvs.height - this.rightPad.height) {
				this.rightPad.y += this.rightPad.dy;
			}
		}
	}

	draw() {
		this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height);

		this.drawNet();

		this.drawRect(this.leftPad.x, this.leftPad.y, this.leftPad.width, this.leftPad.height, this.leftPad.color);
		this.drawRect(this.rightPad.x, this.rightPad.y, this.rightPad.width, this.rightPad.height, this.rightPad.color);

		this.drawSquare(this.ball.x, this.ball.y, this.ball.size, this.ball.color);

		if (this.paused) {
			this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
			this.ctx.fillRect(0, 0, this.cvs.width, this.cvs.height);
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

	update() {
		if (!this.paused) {
			this.movePaddles();
			this.moveBall();
			//draw();
		}
	}

	gameLoop() {
		this.update();
		this.draw();
		requestAnimationFrame(this.gameLoop);
	}

	handleKeyDown = (event) => {
		switch (event.code) {
			case this.keybinds.lUp:
				this.upLeftPressed = true;
				break;
			case this.keybinds.lDown:
				this.downLeftPressed = true;
				break;
			case this.keybinds.rUp:
				this.upRightPressed = true;
				break;
			case this.keybinds.rDown:
				this.downRightPressed = true;
				break;
			case 'Escape':
				if (!this.paused)
					this.pauseModal.show();
				this.paused = !this.paused;
				break;
			default:
				break;
		}
	};

	handleKeyUp = (event) => {
		switch (event.code) {
			case this.keybinds.lUp:
				this.upLeftPressed = false;
				break;
			case this.keybinds.lDown:
				this.downLeftPressed = false;
				break;
			case this.keybinds.rUp:
				this.upRightPressed = false;
				break;
			case this.keybinds.rDown:
				this.downRightPressed = false;
				break;
			default:
				break;
		}
	};
}