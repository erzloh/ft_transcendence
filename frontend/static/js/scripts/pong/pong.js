import { Ball, Pad }  from "./objects.js";

export let eventListeners = { }

export class PongGame {
	constructor() {
		this.cvs = document.getElementById('canvas');
		this.ctx = this.cvs.getContext('2d');
		this.startButton= document.getElementById('startButton');
		this.objectiveLabel = document.getElementById('objectiveLabel');

		this.endgameModalWinner = document.getElementById('endgameModalWinner');
		this.endgameModalScore = document.getElementById('endgameModalScore');
		// let endgameModalTime = document.getElementById('endgameModalTime');
		this.endgameModalPlayAgain = document.getElementById('playAgainButton');
		this.pauseModal = new bootstrap.Modal(document.getElementById('pauseModal'));
		this.endgameModal = new bootstrap.Modal(document.getElementById('endgameModal'));

		this.leftScore = document.getElementById("leftScore");
		this.rightScore = document.getElementById("rightScore");

		this.pWidth = 10, this.pHeight = 100, this.bSize = 10;
		this.paused = false;
		this.gameOver = false;

		const usernamesString = localStorage.getItem('pongUsernames');
		this.usernames = usernamesString ? JSON.parse(usernamesString) : {
			p1: "player1", p2: "player2", p3: "player3", p4: "player4"
		};

		const leftPaddleName = document.getElementById('leftPaddleName');
		const rightPaddleName = document.getElementById('rightPaddleName');
		leftPaddleName.innerHTML = this.usernames.p1;
		rightPaddleName.innerHTML = this.usernames.p2;

		const keybindsString = localStorage.getItem('pongKeybinds');
		this.keybinds = keybindsString ? JSON.parse(keybindsString) : {
			lUp : 'KeyW', lDown : 'KeyS', rUp : 'ArrowUp', rDown : 'ArrowDown'
		};

		const gamemodeString = localStorage.getItem('pongGamemode');
		this.gamemode = gamemodeString ? JSON.parse(gamemodeString) : "pvp";

		const objectiveString = localStorage.getItem('pongObjective');
		this.objective = objectiveString ? JSON.parse(objectiveString) : 3;
		this.objectiveLabel.innerHTML = "points to win: " + this.objective;

		this.boundPongHandleKeyDown = this.handleKeyDown.bind(this);
		this.boundPongHandleKeyUp = this.handleKeyUp.bind(this);
		this.boundScorePoint = this.scorePoint.bind(this);

		this.leftPad = new Pad(0, this.cvs.height / 2 - this.pHeight / 2, 
			this.pWidth, this.pHeight, "#FFF", 5, this.cvs.height -  this.pHeight, 
			false);

		this.rightPad = new Pad(this.cvs.width - this.pWidth, this.cvs.height / 2 - this.pHeight / 2, 
			this.pWidth, this.pHeight, "#FFF", 5, this.cvs.height -  this.pHeight,
			this.gamemode == "AI" ? true : false);

		this.ball = new Ball(this.cvs.width / 2, this.cvs.height / 2,
			this.bSize, "#FFF", 4, 4, 4, this.cvs.height, this.cvs.width, this.leftPad, this.rightPad, this.boundScorePoint);

		this.rightPad.ball = this.ball;

		this.gameLoop = this.gameLoop.bind(this);
	}

	initialize() {
		this.startButton.addEventListener("click", () => this.startGame());
		this.endgameModalPlayAgain.addEventListener("click", () => this.resetGame());

		document.addEventListener("keydown", this.boundPongHandleKeyDown);
		eventListeners["keydown"] = this.boundPongHandleKeyDown;

		document.addEventListener("keyup", this.boundPongHandleKeyUp);
		eventListeners["keyup"] = this.boundPongHandleKeyUp;
	}

	resetGame() {
		this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height);
		
		this.leftPad = new Pad(0, this.cvs.height / 2 - this.pHeight / 2, 
			this.pWidth, this.pHeight, "#FFF", 5, this.cvs.height -  this.pHeight, 
			false);

		this.rightPad = new Pad(this.cvs.width - this.pWidth, this.cvs.height / 2 - this.pHeight / 2, 
			this.pWidth, this.pHeight, "#FFF", 5, this.cvs.height -  this.pHeight,
			this.gamemode == "AI" ? true : false);	
		
		this.ball = new Ball(this.cvs.width / 2, this.cvs.height / 2,
			this.bSize, "#FFF", 4, 4, 4, this.cvs.height, this.cvs.width, this.leftPad, this.rightPad, this.boundScorePoint);
		
		this.rightPad.ball = this.ball;

		this.leftScore.innerHTML = "0";
		this.rightScore.innerHTML = "0";
		
		this.startButton.disabled = false;
		this.gameOver = false;
	}

	startGame() {
		this.startButton.disabled = true;
		this.gameLoop();
	}

	endGame(winner) {
		this.gameOver = true;
		// this.timer.stop();

		this.endgameModalWinner.textContent = winner + " won the game !";
		this.endgameModalScore.textContent = "Final score: " + this.leftPad.score + "-" + this.rightPad.score;
		// endgameModalTime.textContent = "Time elapsed: " + this.timer.min.toString().padStart(2, '0') + ":" + this.timer.sec.toString().padStart(2, '0');

		// Show the modal
		this.endgameModal.show();
	}

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

	scorePoint = (pad) => {
		if (pad == "left") {
			this.leftPad.score++;
			this.leftScore.innerHTML = this.leftPad.score;
			if (this.leftPad.score >= this.objective) {
				this.endGame(this.usernames.p1);
			}
		}
		else if (pad == "right") {
			this.rightPad.score++;
			this.rightScore.innerHTML = this.rightPad.score;
            if (this.rightPad.score >= this.objective) {
                this.endGame(this.usernames.p2);
            }
		}
		this.ball.resetPosition();
	}	

	drawObjects() {
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

	update() {
		if (!this.paused) {
			this.leftPad.move();
			this.rightPad.move();
			this.ball.move();
		}
	}

	gameLoop() {
		if (this.gameOver) {			
			return ;
		}

		this.update();
		this.drawObjects();
		requestAnimationFrame(this.gameLoop);
	}

	handleKeyDown = (event) => {
		// Prevent buttons from moving the page
		if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(event.code) > -1) {
			event.preventDefault();
		}
		switch (event.code) {
			case this.keybinds.lUp:
				this.leftPad.direction = "up";
				break;
			case this.keybinds.lDown:
				this.leftPad.direction = "down";
				break;
			case this.keybinds.rUp:
				this.rightPad.direction = "up";
				break;
			case this.keybinds.rDown:
				this.rightPad.direction = "down";
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
				if (this.leftPad.direction == "up")
					this.leftPad.direction = "";
				break;
			case this.keybinds.lDown:
				if (this.leftPad.direction == "down")
					this.leftPad.direction = "";
				break;
			case this.keybinds.rUp:
				if (this.rightPad.direction == "up")
					this.rightPad.direction = "";
				break;
			case this.keybinds.rDown:
				if (this.rightPad.direction == "down")	
					this.rightPad.direction = "";
				break;
			default:
				break;
		}
	};
}