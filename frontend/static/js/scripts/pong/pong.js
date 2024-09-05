import { Ball, Pad, Tournament, Timer }  from "./objects.js";
import { BASE_URL } from '../../index.js';

export let eventListeners = { }

export class PongGame {
	constructor() {
		this.cvs = document.getElementById('canvas');
		this.ctx = this.cvs.getContext('2d');
		this.startButton= document.getElementById('btnStart');
		this.objectiveLabel = document.getElementById('objectiveLabel');

		this.endgameModalWinner = document.getElementById('endgameModalWinner');
		this.endgameModalScore = document.getElementById('endgameModalScore');
		this.endgameModalTime = document.getElementById('endgameModalTime');
		this.endgameModalPlayAgain = document.getElementById('playAgainButton');
		this.tournamentModalNextMatch = document.getElementById('nextMatchButton');
		this.pauseModal = new bootstrap.Modal(document.getElementById('pauseModal'));
		this.endgameModal = new bootstrap.Modal(document.getElementById('endgameModal'));
		this.matchScore =  document.getElementById('matchScore');
		this.modalColorBox1 = document.getElementById('colorBox1');
		this.modalColorBox2 = document.getElementById('colorBox2');
		this.colorBoxLeft = document.getElementById('colorBoxLeft');
		this.colorBoxRight = document.getElementById('colorBoxRight');

		this.leftScore = document.getElementById("leftScore");
		this.rightScore = document.getElementById("rightScore");

		this.pWidth = 12, this.pHeight = 80, this.bSize = 12, this.pSpeed = 1.6, this.bSpeed = 1;
		this.gameStarted = false, this.gameOver = false;
		this.paused = false;

		const gamemodeString = localStorage.getItem('pongGamemode');
		this.gamemode = gamemodeString ? JSON.parse(gamemodeString) : "pvp";

		const gamestyleString = localStorage.getItem('pongGamestyle');
		this.gamestyle = gamestyleString ? JSON.parse(gamestyleString) : "enhanced";

		if (this.gamestyle != "enhanced") {
			document.getElementById("pMinimize1").style.display = "none";
			document.getElementById("pMinimize2").style.display = "none";
		}

		const usernamesString = localStorage.getItem('pongUsernames');
		this.usernames = usernamesString ? JSON.parse(usernamesString) : {
			p1: "player1", p2: "player2", p3: "player3", p4: "player4"
		};

		const colorsString = localStorage.getItem('pongColors');
		this.colors = colorsString ? JSON.parse(colorsString) : {
			p1: "#ff0000", p2: "#00ff00", p3: "#266fff", p4: "#ff00ff"
		};

		const leftPaddleName = document.getElementById('leftPaddleName');
		const rightPaddleName = document.getElementById('rightPaddleName');
		leftPaddleName.innerHTML = this.usernames.p1;
		if (this.gamemode != "AI")
			rightPaddleName.innerHTML = this.usernames.p2;
		else
			rightPaddleName.innerHTML = "AI";

		const keybindsString = localStorage.getItem('pongKeybinds');
		this.keybinds = keybindsString ? JSON.parse(keybindsString) : {
			lUp : 'KeyW', lDown : 'KeyS', lMini: 'KeyE',
			rUp : 'ArrowUp', rDown : 'ArrowDown', rMini: 'ArrowRight'
		};

		const objectiveString = localStorage.getItem('pongObjective');
		this.objective = objectiveString ? JSON.parse(objectiveString) : 3;
		this.objectiveLabel.innerHTML = "points to win: " + this.objective;

		this.boundPongHandleKeyDown = this.handleKeyDown.bind(this);
		this.boundPongHandleKeyUp = this.handleKeyUp.bind(this);
		
		this.tournament;
		this.currentMatch;

		this.drawObjects = this.drawObjects.bind(this);
	}

	initialize() {
		this.startButton.addEventListener("click", () => this.startGame());
		this.endgameModalPlayAgain.addEventListener("click", () => this.resetGame());
		this.tournamentModalNextMatch.addEventListener("click", () => this.nextMatch());
		this.gameOver = false;

		document.addEventListener("keydown", this.boundPongHandleKeyDown);
		eventListeners["keydown"] = this.boundPongHandleKeyDown;

		document.addEventListener("keyup", this.boundPongHandleKeyUp);
		eventListeners["keyup"] = this.boundPongHandleKeyUp;

		this.timer = new Timer(this);
		this.leftPad = new Pad(0, this.cvs.height / 2 - this.pHeight / 2, 
			this.pWidth, this.pHeight, "left", this.colors.p1, this.pSpeed, this.cvs.height, 
			false, this);

		this.rightPad = new Pad(this.cvs.width - this.pWidth, this.cvs.height / 2 - this.pHeight / 2, 
			this.pWidth, this.pHeight,  "right", this.gamemode == "AI" ? "#FFF" : this.colors.p2, this.pSpeed, this.cvs.height,
			this.gamemode == "AI" ? true : false, this);

		this.ball = new Ball(this.bSize, "#FFF", this.bSpeed, this.cvs.height, this.cvs.width, this);

		this.colorBoxLeft.style.backgroundColor = this.colors.p1;
		this.colorBoxRight.style.backgroundColor = this.colors.p2;

		if (this.gamemode == "AI") {
			this.colorBoxRight.style.backgroundColor = "#FFF";
			this.rightPad.ball = this.ball;
		}
		else if (this.gamemode == "tournament") {
			this.tournament = new Tournament(4, this.usernames, this);
			this.currentMatch = this.tournament.getCurrentPlayers();
			leftPaddleName.innerHTML = this.usernames[this.currentMatch.left];
			rightPaddleName.innerHTML = this.usernames[this.currentMatch.right];
			this.leftPad.color = this.colors[this.currentMatch.left];
			this.rightPad.color = this.colors[this.currentMatch.right];
			this.modalColorBox1.style.backgroundColor = this.colors[this.currentMatch.left];
			this.colorBoxLeft.style.backgroundColor = this.colors[this.currentMatch.left];
			this.modalColorBox2.style.backgroundColor = this.colors[this.currentMatch.right];
			this.colorBoxRight.style.backgroundColor = this.colors[this.currentMatch.right];
		}
	}

	restartTournament() {
		this.tournament = new Tournament(4, this.usernames, this);
		this.currentMatch = this.tournament.getCurrentPlayers();
		leftPaddleName.innerHTML = this.usernames[this.currentMatch.left];
		rightPaddleName.innerHTML = this.usernames[this.currentMatch.right];
		this.leftPad.color = this.colors[this.currentMatch.left];
		this.rightPad.color = this.colors[this.currentMatch.right];
		this.modalColorBox1.style.backgroundColor = this.colors[this.currentMatch.left];
		this.colorBoxLeft.style.backgroundColor = this.colors[this.currentMatch.left];
		this.modalColorBox2.style.backgroundColor = this.colors[this.currentMatch.right];
		this.colorBoxRight.style.backgroundColor = this.colors[this.currentMatch.right];

		this.resetTournamentMatch();
	}

	winMatch(side) {
		this.stopGameLoop();
		this.gameOver = true;
		this.matchScore.innerHTML = "score: " + this.leftPad.score + "-" + this.rightPad.score;
		this.tournament.setCurrentMatchWinner(side);
		if (this.tournament.tournamentOver) {
			this.endTournament(side);
		}
	}
	
	nextMatch() {
		this.currentMatch = this.tournament.getCurrentPlayers();
		leftPaddleName.innerHTML = this.usernames[this.currentMatch.left];
		rightPaddleName.innerHTML = this.usernames[this.currentMatch.right];
		this.leftPad.color = this.colors[this.currentMatch.left];
		this.rightPad.color = this.colors[this.currentMatch.right];
		this.modalColorBox1.style.backgroundColor = this.colors[this.currentMatch.left];
		this.colorBoxLeft.style.backgroundColor = this.colors[this.currentMatch.left];
		this.modalColorBox2.style.backgroundColor = this.colors[this.currentMatch.right];
		this.colorBoxRight.style.backgroundColor = this.colors[this.currentMatch.right];

		this.resetTournamentMatch();
	}

	resetTournamentMatch() {
		this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height);
		
		this.leftPad = new Pad(0, this.cvs.height / 2 - this.pHeight / 2, 
			this.pWidth, this.pHeight, "left", this.colors[this.currentMatch.left], this.pSpeed, this.cvs.height, 
			false, this);

		this.rightPad = new Pad(this.cvs.width - this.pWidth, this.cvs.height / 2 - this.pHeight / 2, 
			this.pWidth, this.pHeight, "right", this.colors[this.currentMatch.right], this.pSpeed, this.cvs.height,
			false, this);	
		
		this.ball = new Ball(this.bSize, "#FFF", this.bSpeed, this.cvs.height, this.cvs.width, this);

		this.leftScore.innerHTML = "0";
		this.rightScore.innerHTML = "0";
		
		this.gameStarted = false;
		this.startButton.style.display = "block";
		this.startButton.disabled = false;
		this.timer.reset();
	}

	resetGame() {
		if (this.gamemode == "tournament") {
			this.restartTournament();
		}
		else {
			this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height);
		
			this.leftPad = new Pad(0, this.cvs.height / 2 - this.pHeight / 2, 
				this.pWidth, this.pHeight, "left", this.colors.p1, this.pSpeed, this.cvs.height, 
				false, this);
	
			this.rightPad = new Pad(this.cvs.width - this.pWidth, this.cvs.height / 2 - this.pHeight / 2, 
				this.pWidth, this.pHeight, "right", this.gamemode == "AI" ? "#FFF" : this.colors.p2, this.pSpeed, this.cvs.height,
				this.gamemode == "AI" ? true : false, this);	
			
			this.ball = new Ball(this.bSize, "#FFF", this.bSpeed, this.cvs.height, this.cvs.width, this);
			
			this.rightPad.ball = this.ball;
	
			this.leftScore.innerHTML = "0";
			this.rightScore.innerHTML = "0";
			
			this.gameStarted = false;
			this.startButton.style.display = "block";
			this.startButton.disabled = false;
			this.timer.reset();
		}
	}

	startGame() {
		this.startButton.disabled = true;
		this.startButton.style.display = "none";
		this.gameStarted = true;
		this.gameOver = false;
		this.timer.start();
		this.startGameLoop();
	}

	endTournament(side) {
		this.endgameModalWinner.textContent = this.usernames[this.currentMatch[side]] + " won the tournament";
		this.endgameModalScore.textContent = "score: " + this.leftPad.score + "-" + this.rightPad.score;
		this.endgameModalTime.innerHTML = this.timer.getTime();

		this.endgameModal.show();
	}

	endGame(winner) {
		this.stopGameLoop();
		this.gameOver = true;

		this.sendMatchData(winner);

		this.endgameModalWinner.textContent = winner + " won the game";
		this.endgameModalScore.textContent = "score: " + this.leftPad.score + "-" + this.rightPad.score;
		this.endgameModalTime.innerHTML = this.timer.getTime();

		this.endgameModal.show();
	}

	async sendMatchData(winner) {
		const date = new Date();
		let matchData;
		let response;
		switch (this.gamemode) {
			case "pvp":
				matchData = {
					"player_one": this.usernames.p1,
					"player_two": this.usernames.p2,
					"winner": winner,
					"match_score": this.leftPad.score + "-" + this.rightPad.score,
					"match_duration": this.timer.getTime(),
					"match_date": date.getFullYear() + "-" + date.getMonth() + "-" + date.getDay()
				};
				console.log(matchData[player_two]);
				response = await fetch(`${BASE_URL}/api/record_PvPong_match/`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(matchData)
				})
				break;
			case "AI":
				console.log("log");
				matchData = {
					"player_one": this.usernames.p1,
					"winner": winner,
					"match_score": this.leftPad.score + "-" + this.rightPad.score,
					"match_duration": this.timer.getTime(),
					"match_date": date.getFullYear() + "-" + date.getMonth() + "-" + date.getDay()
				};
				response = await fetch(`${BASE_URL}/api/record_AIpong_match/`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(matchData)
				})
				break;
			default:
				break;
		}
		if (response.status === 400) {
			console.log("User isn't logged. Game history has not been saved.")
		} else if (response.status === 200) {
			console.log("Game saved.")
		}
	}
	
	pauseGame() {
		if (this.gameStarted && !this.gameOver) {
			if (!this.paused) {
				this.stopInterval();
				this.pauseModal.show();
			} 
			else {
				this.startGameLoop();
			}
			this.paused = !this.paused;

		}	
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
			this.drawRect(this.cvs.width / 2 - 5, i, 10, 10, "#bfbfbf");
		}
	}

	scorePoint = (pad) => {
		if (pad == "left") {
			this.leftPad.score++;
			this.leftScore.innerHTML = this.leftPad.score;
			if (this.leftPad.score >= this.objective) {
				if (this.gamemode == "tournament")
					this.winMatch(pad);
				else
					this.endGame(this.usernames.p1);
			}
		}
		else if (pad == "right") {
			this.rightPad.score++;
			this.rightScore.innerHTML = this.rightPad.score;
            if (this.rightPad.score >= this.objective) {
				if (this.gamemode == "tournament")
					this.winMatch(pad);
				else if (this.gamemode == "AI")
                	this.endGame("AI");
				else
					this.endGame(this.usernames.p2);
            }
		}
		this.ball.resetPosition();
	}	

	drawObjects() {
		this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height);

		// Make the canvas background more opaque
		this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
		this.ctx.fillRect(0, 0, this.cvs.width, this.cvs.height);

		this.drawNet();

		this.drawRect(this.leftPad.x, this.leftPad.y, this.leftPad.width, this.leftPad.height, this.leftPad.color);
		this.drawRect(this.rightPad.x, this.rightPad.y, this.rightPad.width, this.rightPad.height, this.rightPad.color);

		this.drawSquare(this.ball.x, this.ball.y, this.ball.size, this.ball.color);
		if (!this.gameOver)
			requestAnimationFrame(this.drawObjects);
	}

	update() {
		this.leftPad.move();
		this.rightPad.move();
		this.ball.move();
	}

	startGameLoop() {
		if (!this.interval) {
			this.interval = setInterval(() => {
				this.update();
			}, 5);
		}
		requestAnimationFrame(this.drawObjects);
	}

	stopInterval() {
		clearInterval(this.interval);
		this.interval = null;
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
			case this.keybinds.lMini:
				if (this.gamestyle == "enhanced")
					this.leftPad.useMinimize();
				break;
			case this.keybinds.rUp:
				this.rightPad.direction = "up";
				break;
			case this.keybinds.rDown:
				this.rightPad.direction = "down";
				break;
			case this.keybinds.rMini:
				if (this.gamestyle == "enhanced" && this.gamemode != "AI")
					this.rightPad.useMinimize();
				break;
			case 'Escape':
				this.pauseGame();			
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

	stopGameLoop() {
		this.timer.stop();
		this.stopInterval();
		this.gameOver = true;
	}
}