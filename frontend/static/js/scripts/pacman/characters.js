import { CooldownTimer } from "./objects.js";

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
		this.cooldownTimer = null;
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

//#region PACMAN CHARACTERS

export class PacmanBase extends Character {
	constructor(x, y, direction, pacmanGame) {
		super(x, y, direction, pacmanGame);
		this.speed = pacmanGame.pSpeed;
		this.points = 0;
		this.objective = -1;
		this.cooldownDisplay = document.getElementById('pCD');
		this.cooldownDisplay.innerHTML = "ready";
		this.pointFactor = 100/100;
	}

	useSpell() {}

	stopSpell() {}

	gainPoints(pointsGain) {
		this.points += Math.floor(pointsGain * this.pointFactor);
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
					this.gainPoints(15);
				}
				else {
					this.pcG.cells[this.y][this.x].value = 8;
					this.gainPoints(150);
				}
				this.pcG.pScore.textContent = this.points;
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
				(Math.round((this.px + this.speed) * 10000) / 10000 > this.x ? this.x : Math.round((this.px + this.speed) * 10000) / 10000):
				(Math.round((this.px - this.speed) * 10000) / 10000 < this.x ? this.x : Math.round((this.px - this.speed) * 10000) / 10000);
		else if (this.py != this.y)
			this.py = this.py < this.y ? 
				(Math.round((this.py + this.speed) * 10000) / 10000 > this.y ? this.y : Math.round((this.py + this.speed) * 10000) / 10000):
				(Math.round((this.py - this.speed) * 10000) / 10000 < this.y ? this.y : Math.round((this.py - this.speed) * 10000) / 10000);
	}

	eatFruit(fruit) {
		this.gainPoints(fruit.points);
		this.pcG.pScore.textContent = this.points;
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

export class Pacman extends PacmanBase {
	constructor(x, y, direction, pacmanGame) {
		super(x, y, direction, pacmanGame);
		this.spellName = "Frenzy";
		this.frenzyDuration = 5;
		this.frenzyCooldown = 25;
		this.frenzySpeedBoost = 120 / 100;
		this.disableGhostDuration = 5;
		this.inFrenzy = false;
		this.ateGhost = false;
		this.cooldownTimer = new CooldownTimer(this.cooldownDisplay, this, this.frenzyDuration, this.frenzyCooldown);
		this.eatenTimer = new CooldownTimer(null, this, this.disableGhostDuration,this.disableGhostDuration);
	}

	eatFruit(fruit) {
		this.points += fruit.points;
		this.pcG.pScore.textContent = this.points;
		this.startFrenzy();
	}

	eatGhost() {
		this.pcG.ghost.disabled = true;
		this.ateGhost = true;
		this.pcG.pacman.gainPoints(300);
		this.eatenTimer.startCD();
	}

	startFrenzy() {
		if (this.cooldownTimer.startCD()) {
			this.speed *= this.frenzySpeedBoost;
			this.inFrenzy = true;
		}
	}

	stopSpell() {
		if (this.inFrenzy) {
			this.speed /= this.frenzySpeedBoost;
			this.inFrenzy = false;
		}
		if (this.ateGhost) {
			this.ateGhost = false;
			this.pcG.ghost.disabled = false;
		}	
	}
}

export class PacWoman extends PacmanBase {
	constructor(x, y, direction, pacmanGame) {
		super(x, y, direction, pacmanGame);
		this.spellName = "Speed boost";
		this.speedDuration = 10;
		this.speedCooldown = 25;
		this.speedBoost = 140 / 100;
		this.cooldownTimer = new CooldownTimer(this.cooldownDisplay, this, this.speedDuration, this.speedCooldown);
	}

	useSpell() {
		if (this.cooldownTimer.startCD()) {
			this.speed *= this.speedBoost;
		}
	}

	stopSpell() {
		this.speed /= this.speedBoost;
	}
}

export class Coolman extends PacmanBase {
	constructor(x, y, direction, pacmanGame) {
		super(x, y, direction, pacmanGame);
		this.spellName = "Stun";
		this.stunDuration = 3;
		this.stunCooldown = 20;
		this.cooldownTimer = new CooldownTimer(this.cooldownDisplay, this, this.stunDuration, this.stunCooldown);
		this.ghostSpeed;
	}

	useSpell() {
		if (this.cooldownTimer.startCD()) {
			this.pcG.ghost.disabled = true;
		}
	}

	stopSpell() {
		this.pcG.ghost.disabled = false;
	}
}

export class Pacventurer extends PacmanBase {
	constructor(x, y, direction, pacmanGame) {
		super(x, y, direction, pacmanGame);
		this.spellName = "Exploration";
		this.cooldownDisplay.style.opcaity = 0;
		this.speed *= 120/100;
		this.pointFactor = 110/100;
	}
}

//#endregion

export class GhostBase extends Character {
	constructor(x, y, direction, pacmanGame) {
		super(x, y, direction, pacmanGame);
		this.speed = pacmanGame.gSpeed;
		this.cooldownDisplay = document.getElementById('gCD');
		this.cooldownDisplay.innerHTML = "ready";
		this.spawnX = this.x;
		this.spawnY = this.y;
		this.disabled = false;
	}

	useSpell() {}

	stopSpell() {}

	premove() {}

	// Makes the character move until it reaches its destination
	move() {
		if (this.y == this.py && this.x == this.px) {
			if (this.pcG.cells[this.y][this.x].value >= 2 &&
				this.pcG.cells[this.y][this.x].value <=  4) {
				this.teleport();
			}
			else {
				this.tpReady = true;
			}
			this.premove();
			if (!this.disabled) {
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
		if (!this.disabled) {
			if (Math.abs(this.pcG.pacman.py - this.py) < 0.5 &&
				Math.abs(this.pcG.pacman.px - this.px) < 0.5) {
				if (this.pcG.pacman.inFrenzy) {
					this.pcG.pacman.eatGhost();
				}
				else if (!this.disabled) {
					this.pcG.partyOver(this.pcG.usernames.ghost);
				}
			}
		}
		if (this.disabled) {
			img = this.pcG.images.imgGhostDisabled;
		}		
		else {
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
		}
		this.pcG.c.drawImage(img, this.px * this.ts, this.py * this.ts, this.ts, this.ts);
	}
}

export class BlueGhost extends GhostBase {
	constructor(x, y, direction, pacmanGame) {
		super(x, y, direction, pacmanGame);
		this.spellName = "ghost block";
		this.ghostBlockCooldown = 5;
		this.cooldownTimer = new CooldownTimer(this.cooldownDisplay, this, 0, this.ghostBlockCooldown);
		this.gBlockX;
		this.gBlockY;
		this.lastX = this.x;
		this.lastY = this.y;
		this.speed *= 110/100;
		this.cellValue = "Nothing";
	}

	premove() {
		this.lastX = this.x;
		this.lastY = this.y;	
	}
	
	useSpell() {
		if (this.cooldownTimer.startCD()) {
			if (this.cellValue != "Nothing")  {
				this.pcG.cells[this.gBlockX][this.gBlockY].value = this.cellValue;
			}
			this.gBlockX = this.lastY;
			this.gBlockY = this.lastX;
			this.cellValue = this.pcG.cells[this.gBlockX][this.gBlockY].value;
			this.pcG.cells[this.gBlockX][this.gBlockY].value = 9;
		}
	}
}

export class OrangeGhost extends GhostBase {
	constructor(x, y, direction, pacmanGame) {
		super(x, y, direction, pacmanGame);
		this.spellName = "excavate";
		this.wallBlockX = -1;
		this.wallBlockY = -1;
		this.isWall = false;
		this.intangibleCooldown = 20;
		this.cooldownTimer = new CooldownTimer(this.cooldownDisplay, this, 0, this.intangibleCooldown);
	}

	premove() {
		switch (this.direction) {
			case "right":
				if (this.x != this.pcG.cells.width) {
					this.wallBlockX = this.x + 1;
					this.wallBlockY = this.y;
				}
				else
					this.wallBlockX = -1;
				break;
			case "down":
				if (this.y != this.pcG.cells.height) {
					this.wallBlockX = this.x;
					this.wallBlockY = this.y + 1;
				}
				else
					this.wallBlockY = -1;
				break;
			case "up":
				if (this.y != 0) {
					this.wallBlockX = this.x;
					this.wallBlockY = this.y - 1;
				}
				else
					this.wallBlockY = -1;
				break;
			case "left":
				if (this.x != 0) {
					this.wallBlockX = this.x - 1;
					this.wallBlockY = this.y;
				}
				else
					this.wallBlockX = -1;
				break;
			default:
				this.wallBlockX = -1;
				this.wallBlockY = -1;
				break;
		}
		if (this.wallBlockX == -1 || this.wallBlockY == -1) {
			this.isWall = false;
		}
		else if (this.pcG.cells[this.wallBlockY][this.wallBlockX].value == 1) {
			this.isWall = true;
		}
		else
			this.isWall = false;
	}
			

	useSpell() {
		if (this.isWall) {
			if (this.cooldownTimer.startCD()) {
				this.pcG.cells[this.wallBlockY][this.wallBlockX].value = 9;
			}
		}		
	}
}

export class PinkGhost extends GhostBase {
	constructor(x, y, direction, pacmanGame) {
		super(x, y, direction, pacmanGame);
		this.spellName = "intangible";
		this.intangibleDuration = 3;
		this.intangibleCooldown = 20;
		this.cooldownTimer = new CooldownTimer(this.cooldownDisplay, this, this.intangibleDuration, this.intangibleCooldown);
		this.intangible = false;
		this.lastGroundX = this.x;
		this.lastGroundY = this.y;
	}

	premove() {
		if (this.pcG.cells[this.y][this.x].value != 1) {
			this.lastGroundX = this.x;
			this.lastGroundY = this.y;
		}
	}

	useSpell() {
		if (this.cooldownTimer.startCD()) {
			this.intangible = true;
		}		
	}

	stopSpell() {
		this.intangible = false;
		if (this.pcG.cells[this.y][this.x].value == 1) {
			this.x = this.lastGroundX;
			this.y = this.lastGroundY;
		}
	}

	move() {
		if (this.y == this.py && this.x == this.px) {
			if (this.pcG.cells[this.y][this.x].value >= 2 &&
				this.pcG.cells[this.y][this.x].value <=  4) {
				this.teleport();
			}
			else {
				this.tpReady = true;
			}
			this.premove();
			if (this.intangible) {
				switch (this.direction) {
					case "up":
						if (this.y - 1 >= 0)
							this.y -= 1;
						break;
					case "down":
						if (this.y + 1 < this.pcG.height)
							this.y += 1;
						break;
					case "left":
						if (this.x - 1 >= 0)
							this.x -= 1;
						break;
					case "right":
						if (this.x + 1 < this.pcG.width)
							this.x += 1;
						break;
					default:
						break;
				}
			}
			else {
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
}

export class GreenGhost extends GhostBase {
	constructor(x, y, direction, pacmanGame) {
		super(x, y, direction, pacmanGame);
		this.spellName = "blockade";
		this.blockadeCooldown = 30;
		this.cooldownTimer = new CooldownTimer(this.cooldownDisplay, this, 0, this.blockadeCooldown);
		this.lastX = this.x;
		this.lastY = this.y;
	}

	premove() {
		this.lastX = this.x;
		this.lastY = this.y;
	}

	useSpell() {
		if (this.cooldownTimer.startCD()) {
			this.pcG.cells[this.lastY][this.lastX].value = 9;
		}		
	}
}
