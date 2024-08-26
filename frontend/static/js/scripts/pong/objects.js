export class Tournament {
	constructor(pNumber, usernames) {
		this.playerNumber = pNumber;
		this.usernames = usernames;
		this.tournamentOver = false;
		this.tournamentModal = new bootstrap.Modal(document.getElementById('tournamentModal'));
		this.tournamentMatchEndModal = new bootstrap.Modal(document.getElementById('tournamentMatchEndModal'));
		this.playersTournament =  document.getElementById('playersTournament');
		this.matchTournament =  document.getElementById('matchTournament');
		this.winner =  document.getElementById('winner');
		this.matchIdModal =  document.getElementById('matchId');

		this.matchId = 0;
		this.maxMatchNb = this.playerNumber - 1;
		this.playerArray1 = this.playerNumber == 4 ? 
			["p1", "p2", "p3", "p4"] : ["p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8"] ;
		this.playerArray1 = this.shuffleArray(this.playerArray1);
		this.currentMatch;
		this.playerArray2 = [];
    }

	getCurrentPlayers() {
		if (this.playerNumber == 4) {
			switch (this.matchId) {
				case 0:
					this.currentMatch = {left: this.playerArray1[0], right: this.playerArray1[1]};
					break;
				case 1:
					this.currentMatch = {left: this.playerArray1[2], right: this.playerArray1[3]};
					break;
				case 2:
					this.currentMatch = {left: this.playerArray2.left, right: this.playerArray2.right};
					break;
				default:
					break;
			}
			this.matchTournament.innerHTML = this.matchId == this.maxMatchNb ? "final match" : "match " + (this.matchId + 1);
			this.playersTournament.innerHTML = this.usernames[this.currentMatch.left] + " VS " + this.usernames[this.currentMatch.right];
			this.tournamentModal.show();
			return this.currentMatch;
		}
	}

	setCurrentMatchWinner(side) {
		console.log(this.matchId);
		if (this.playerNumber == 4) {
			switch (this.matchId) {
				case 0:
					this.playerArray2.left = this.currentMatch[side];
					break;
				case 1:
					this.playerArray2.right = this.currentMatch[side];
					break;
				case 2:
					console.log(this.matchId);
					this.tournamentOver = true;
					break;
				default:
					break;
			}
		}
		if (!this.tournamentOver) {
			this.matchIdModal.innerHTML = this.matchId == this.maxMatchNb ? "final match" : "match " + (this.matchId + 1);
			this.winner.innerHTML = this.usernames[this.currentMatch[side]] + " won the match !";
			this.tournamentMatchEndModal.show();

			this.matchId++;
		}
	}

	shuffleArray(array) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	}
}

export class Ball {
    constructor(x, y, size, color, speed, dx, dy, maxY, maxX, leftPad, rightPad, scorePoint) {
        this.x = x;
		this.y = y;
		this.size = size;
		this.color = color;
		this.speed = speed;
		this.dx = dx;
		this.dy = dy;
		this.maxY = maxY;
		this.maxX = maxX;
		this.leftPad = leftPad;
		this.rightPad = rightPad;
		this.scorePoint = scorePoint;
    }

	collisionDetect(pad) {
		pad.top = pad.y;
		pad.bottom = pad.y + pad.height;
		pad.left = pad.x;
		pad.right = pad.x + pad.width;

		this.top = this.y;
		this.bottom = this.y + this.size;
		this.left = this.x;
		this.right = this.x + this.size;

		return pad.left < this.right && pad.top < this.bottom && pad.right > this.left && pad.bottom > this.top;
	}

	move() {
		this.x += this.dx;
		this.y += this.dy;

		if (this.y + this.size > this.maxY || this.y < 0) {
			this.dy *= -1;
		}

		let currentPad = (this.x < this.maxX / 2) ? this.leftPad : this.rightPad;

		if (this.collisionDetect(currentPad)) {
			this.dx *= -1;
			this.speed += 0.2;
			this.dx = this.dx > 0 ? this.speed : -this.speed;
			this.dy = this.dy > 0 ? this.speed : -this.speed;
		}

		if (this.x + this.size > this.maxX) {
			this.scorePoint("left");
		} 
		else if (this.x < 0) {
			this.scorePoint("right");
		}
	}

	resetPosition() {
		this.x = this.maxX / 2;
		this.y = this.maxY / 2;
		this.speed = 4;

		if (Math.random() > 0.5) {
			this.dx = this.speed;
		} 
		else {
			this.dx = -this.speed;
		}
		if (Math.random() > 0.5) {
			this.dy = this.speed;
		} 
		else {
			this.dy = -this.speed;
		}
	}
}

export class Pad {
	constructor(x, y, width, height, color, dy, maxY, isAI) {
        this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.color = color;
		this.dy = dy;
		this.maxY = maxY;
		this.isAI = isAI;
		this.ball;
		this.score = 0;
		this.direction = "";
    }

	move() {		
		if (!this.isAI) {
			if (this.direction == "up" && this.y > 0) {
				this.y -= this.dy;
			}
			else if (this.direction == "down" && this.y < this.maxY) {
				this.y += this.dy;
			}
		}
		else {
			if (this.y + this.height / 2 < this.ball.y) {
				this.y += this.dy;
			} 
			else {
				this.y -= this.dy;
			}
		}
	}
}