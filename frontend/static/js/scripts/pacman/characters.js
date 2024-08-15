class Character {
	constructor(x, y, direction, pacmanGame) {
		this.x = x;
		this.y = y;
		this.direction = direction;
		this.speed;
		this.px = x;
		this.py = y;
		this.tpReady = true;
		this.pcG = pacmanGame;
		this.ts = this.pcG.tileSize;
	}

	teleport() {
		if (this.tpReady == true) {
			var tmpVal = this.pcG.cells[this.y][this.x].value;
			for (var i = 0; i < this.pcG.height; i++) {
				for (var j = 0; j < this.pcG.width; j++) {
					if (this.pcG.cells[i][j].value == tmpVal && !(this.y == i && this.x == j)) {
						this.x = j;
						this.y = i;
						this.px = j;
						this.py = i;
						this.tpReady = false;
						return;
					}
				}
			}
		}
	}
}

export class Pacman extends Character {
	constructor(x, y, direction, pacmanGame) {
		super(x, y, direction, pacmanGame);
		this.speed = pacmanGame.pSpeed;
		this.points = 0;
		this.objective = -1;
	}

	useSpell() {
		if (this.pcG.timer.pacmanStartCD())
			this.pcG.ghost.speed = this.pcG.ghost.speed / 2;
	}

	stopSpell() {
		this.pcG.ghost.speed = this.pcG.ghost.speed * 2;
	}

	// Makes the character move until it reaches its destination
	move() {
		if (this.direction == "none")
			return;
		if (this.y == this.py && this.x == this.px) {
			if (this.pcG.cells[this.y][this.x].value === 5 ||
				this.pcG.cells[this.y][this.x].value === 7) {
				if (this.pcG.cells[this.y][this.x].value === 5){
					this.pcG.cells[this.y][this.x].value = 6;
					this.points += 15;
				}
				else {
					this.pcG.cells[this.y][this.x].value = 8;
					this.points += 150;
				}
				this.pcG.pScore.textContent = "Pacman's score: " + this.points;
			}
			else if (this.pcG.cells[this.y][this.x].value >= 2 &&
						this.pcG.cells[this.y][this.x].value <=  4) {
				this.teleport();
			}
			else
				this.tpReady = true;
			switch (this.direction) {
				case "up":
					if (this.y - 1 >= 0 && this.pcG.cells[this.y - 1][this.x].value !== 1 && this.pcG.cells[this.y - 1][this.x].value !== 9)
						this.y -= 1;
					break;
				case "down":
					if (this.y + 1 < this.pcG.height && this.pcG.cells[this.y + 1][this.x].value !== 1 && this.pcG.cells[this.y + 1][this.x].value !== 9)
						this.y += 1;
					break;
				case "left":
					if (this.x - 1 >= 0 && this.pcG.cells[this.y][this.x - 1].value !== 1 && this.pcG.cells[this.y][this.x - 1].value !== 9)
						this.x -= 1;
					break;
				case "right":
					if (this.x + 1 < this.pcG.width && this.pcG.cells[this.y][this.x + 1].value !== 1 && this.pcG.cells[this.y][this.x + 1].value !== 9)
						this.x += 1;
					break;
				default:
					break;
			}
		}

		if (this.px != this.x)
			this.px = this.px < this.x ? 
				(Math.round((this.px + this.speed) * 1000) / 1000 > this.x ? this.x : Math.round((this.px + this.speed) * 1000) / 1000):
				(Math.round((this.px - this.speed) * 1000) / 1000 < this.x ? this.x : Math.round((this.px - this.speed) * 1000) / 1000);
		else if (this.py != this.y)
			this.py = this.py < this.y ? 
				(Math.round((this.py + this.speed) * 1000) / 1000 > this.y ? this.y : Math.round((this.py + this.speed) * 1000) / 1000):
				(Math.round((this.py - this.speed) * 1000) / 1000 < this.y ? this.y : Math.round((this.py - this.speed) * 1000) / 1000);
	}

	eatFruit(fruit) {
		this.points += fruit.points;
		this.pcG.pScore.textContent = "Pacman's score: " + this.points;
	}

	// Render the character's sprite
	render(img) {
		if (this.objective > 0) {
			if (this.points >= this.objective) {
				this.pcG.partyOver(this.pcG.usernames.pacman);
			}
		}

		// Convert degrees to radians
		var angle = this.direction == "right" ? 0 :
			this.direction == "up" ? -90 :
			this.direction == "left" ? 0 : 90;

		var radians = angle * Math.PI / 180;

		this.pcG.c.save();
		this.pcG.c.translate(this.px * this.ts + this.ts / 2, this.py * this.ts + this.ts / 2);

		if (this.direction == "left")
            this.pcG.c.scale(-1, 1); // Flip horizontally
		else
			this.pcG.c.rotate(radians);

		this.pcG.c.drawImage(img, -this.ts / 2, -this.ts / 2, this.ts, this.ts);
		this.pcG.c.restore();
	}
}

export class Ghost extends Character {
	constructor(x, y, direction, pacmanGame) {
		super(x, y, direction, pacmanGame);
		this.lastX;
		this.lastY;
		this.gBlockX;
		this.gBlockY;
		this.cellValue = "";
		this.speed = pacmanGame.gSpeed;
	}

	useSpell() {
		if (this.pcG.timer.ghostStartCD()) {
			if (this.cellValue != "") {
				this.pcG.cells[this.gBlockX][this.gBlockY].value = this.cellValue;
			}
			this.gBlockX = this.lastY;
			this.gBlockY = this.lastX;
			this.cellValue = this.pcG.cells[this.gBlockX][this.gBlockY].value;
			this.pcG.cells[this.gBlockX][this.gBlockY].value = 9;
		}   
	}

	// stopSpell() {
	// 	this.pcG.cells[this.lastY][this.lastX].value = this.cellValue;
	// }

	// Makes the character move until it reaches its destination
	move() {
		if (this.direction == "none")
			return;
		if (Math.abs(this.pcG.pacman.py - this.py) < 0.5 &&
			Math.abs(this.pcG.pacman.px - this.px) < 0.5) {
			this.pcG.partyOver(this.pcG.usernames.ghost);
		}
		if (this.y == this.py && this.x == this.px) {
			if (this.pcG.cells[this.y][this.x].value >= 2 &&
				this.pcG.cells[this.y][this.x].value <=  4) {
				this.teleport();
			}
			else {
				this.tpReady = true;
			}
			this.lastX = this.x;
			this.lastY = this.y;
			switch (this.direction) {
				case "up":
					if (this.y - 1 >= 0 && this.pcG.cells[this.y - 1][this.x].value !== 1)
						this.y -= 1;
					break;
				case "down":
					if (this.y + 1 < this.pcG.height && this.pcG.cells[this.y + 1][this.x].value !== 1)
						this.y += 1;
					break;
				case "left":
					if (this.x - 1 >= 0 && this.pcG.cells[this.y][this.x - 1].value !== 1)
						this.x -= 1;
					break;
				case "right":
					if (this.x + 1 < this.pcG.width && this.pcG.cells[this.y][this.x + 1].value !== 1)
						this.x += 1;
					break;
				default:
					break;
			}
		}

		if (this.px != this.x)
			this.px = this.px < this.x ? 
				(Math.round((this.px + this.speed) * 1000) / 1000 > this.x ? this.x : Math.round((this.px + this.speed) * 1000) / 1000):
				(Math.round((this.px - this.speed) * 1000) / 1000 < this.x ? this.x : Math.round((this.px - this.speed) * 1000) / 1000);
		else if (this.py != this.y)
			this.py = this.py < this.y ? 
			(Math.round((this.py + this.speed) * 1000) / 1000 > this.y ? this.y : Math.round((this.py + this.speed) * 1000) / 1000):
			(Math.round((this.py - this.speed) * 1000) / 1000 < this.y ? this.y : Math.round((this.py - this.speed) * 1000) / 1000);
	}

	// Render the character's sprite
	render() {
		var img;
		switch (this.direction){
			case "right":
				img = this.pcG.images.imgGhost1;
				break;
			case "down":
				img = this.pcG.images.imgGhost2;
				break;
			case "up":
				img = this.pcG.images.imgGhost3;
				break;
			case "left":
				img = this.pcG.images.imgGhost4;
				break;
			default:
				img = this.pcG.images.imgGhost1;
				break;
		}
		this.pcG.c.drawImage(img, this.px * this.ts, this.py * this.ts, this.ts, this.ts);
	}
}
