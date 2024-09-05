export class Star {
	constructor(x, y, imgStar, pcG) {
		this.x = x;
		this.y = y;
		this.imgStar = imgStar;
		this.pcG = pcG;
	}

	// This function will return false if the fruit gets eaten by pacman
	render() {
		if (Math.abs(this.pcG.pacman.py - this.y) < 0.5 &&
			Math.abs(this.pcG.pacman.px - this.x) < 0.5) {
			for (var y = 1; y < this.pcG.height - 1; y++) {
				for (var x = 1; x < this.pcG.width - 1; x++) {
					if (this.pcG.cells[y][x].value === 6)
						this.pcG.cells[y][x].value = 5;
					else if (this.pcG.cells[y][x].value === 8)
						this.pcG.cells[y][x].value = 7;
				}
			}
			return false;
		}
		else {
			this.pcG.c.drawImage(this.imgStar, this.x * this.pcG.tileSize, this.y * this.pcG.tileSize, this.pcG.tileSize, this.pcG.tileSize);
			return true;
		}
	}
}

export class Fruit {
	constructor(name, points, x, y, image, pacmanGame){
		this.name = name;
		this.points = points;
		this.eaten = false;
		this.x = x;
		this.y = y;
		this.image = image;
		this.ts = pacmanGame.tileSize;
		this.ctx = pacmanGame.c;
		this.pacman = pacmanGame.pacman;
	}

	// This function will return false if the fruit gets eaten by pacman
	render() {
		if (Math.abs(this.pacman.py - this.y) < 0.5 &&
			Math.abs(this.pacman.px - this.x) < 0.5) {
			this.pacman.eatFruit(this);
			return false;
		}
		else {
			this.ctx.drawImage(this.image, this.x * this.ts, this.y * this.ts, this.ts, this.ts);
			return true;
		}
	}
}

export class Timer {
	constructor(pacmanGame) {
		this.pcG = pacmanGame;
		this.dsec = 0;
		this.sec = 0;
		this.min = 0;
		this.interval = null;

		this.images = pacmanGame.images;

		this.timer = document.getElementById('timer');
		this.pCD = document.getElementById('pCD');
		this.gCD = document.getElementById('gCD');

		// Spells
		this.pSpellDuration = 0;
		this.pSpellCD = 0;
		this.gSpellCD = 0;
	}

	start() {
		if (!this.interval) {
			this.interval = setInterval(() => {
				this.updateTime();
			}, 10);
		}
	}

	stop() {
		clearInterval(this.interval);
		this.interval = null;
	}

	reset() {
		this.stop();
		this.dsec = 0;
		this.sec = 0;
		this.min = 0;
		this.updateDisplay();
	}

	updateTime() {
		this.dsec++;
		
		this.pcG.updateGame();
		this.pcG.renderGame();

		console.log("pacman loop");

		if (this.dsec == 100) {
			this.dsec = 0;
			this.sec++;
		
			if (this.pSpellDuration > 0) {
				this.pSpellDuration--;
				if (this.pSpellDuration == 0)
					this.pcG.pacman.stopSpell();
			}
				
			if (this.pSpellCD > 0) {
				this.pSpellCD--;
				this.pCD.innerHTML = this.pSpellCD.toString().padStart(2, '0');
			}
			else
				this.pCD.innerHTML = "Ready";
	
			// if (this.gSpellDuration > 0) {
			// 	this.gSpellDuration--;
			// 	if (this.gSpellDuration == 0)
			// 		this.pcG.ghost.stopSpell();
			// }
	
			if (this.gSpellCD > 0) {
				this.gSpellCD--;
				this.gCD.innerHTML = this.gSpellCD.toString().padStart(2, '0');
			} 
			else
				this.gCD.innerHTML = "Ready";
	
			// Every 8 seconds create a fruit
			if (this.sec % 8 == 0) {
				var ypos = Math.floor(Math.random() * (this.pcG.height - 1));
				var xpos = Math.floor(Math.random() * (this.pcG.width - 1));
				if (this.pcG.cells[ypos][xpos].value !== 1) {
					var ran = Math.floor(Math.random() * 3);
					switch (ran) {
						case 0:
							this.pcG.fruitArray.push(new Fruit("Cherry", 750, xpos, ypos, this.images.imgCherry, this.pcG));
							break;
						case 1:
							this.pcG.fruitArray.push(new Fruit("Banana", 500, xpos, ypos, this.images.imgBanana, this.pcG));
							break;
						case 2:
							this.pcG.fruitArray.push(new Fruit("Strawberry", 400, xpos, ypos, this.images.imgStrawberry, this.pcG));
							break;
						default:
							break;
					}
				}
			}
	
			// Update minutes if 60 seconds is reached
			if (this.sec == 60) {
				this.min++;
				this.sec = 0;
				var starSpawned = false;
				while (!starSpawned) {
					var ypos = Math.floor(Math.random() * (this.pcG.height - 1));
					var xpos = Math.floor(Math.random() * (this.pcG.width - 1));
					if (this.pcG.cells[ypos][xpos].value !== 1) {
						this.pcG.starArray.push(new Star(xpos, ypos, this.images.imgStar, this.pcG));
						starSpawned = true;
					}
				}
			}

			this.updateDisplay();		
		}
	}
	updateDisplay() {
		this.timer.innerHTML = this.getTime();
	}

	pacmanStartCD() {
		if (this.pSpellCD > 0)
			return false;
		this.pSpellDuration = 3;
		this.pSpellCD = 20;
		this.pCD.innerHTML = this.pSpellCD.toString().padStart(2, '0');
		return true;
	}

	ghostStartCD() {
		if (this.gSpellCD > 0)
			return false;
		this.gSpellCD = 5;
		this.gCD.innerHTML = this.gSpellCD.toString().padStart(2, '0');
		return true;
	}

	getTime() {
		return (this.min.toString().padStart(2, '0') + ":" + this.sec.toString().padStart(2, '0'));
	}
}

export class Cell {
	constructor(x, y, value, pacmanGame) {
		this.x = x;
		this.y = y;
		this.value = value;
		this.pcG = pacmanGame;
		this.ts = pacmanGame.tileSize;
		this.images = pacmanGame.images;

		// Color constants
		this.theme = pacmanGame.theme;
	}

	// render the cell
	render() {
		// Draw the map's ground and walls
		if (this.value === 1)
			this.pcG.c.fillStyle = this.theme.wallColor;
		else if (this.value === 9)
			this.pcG.c.fillStyle = this.pcG.frame % 40 < 20 ? this.theme.ghostWallColor1 : this.theme.ghostWallColor2;
		else
			this.pcG.c.fillStyle = this.theme.backgroundColor;
		this.pcG.c.fillRect(this.x * this.ts, this.y * this.ts, this.ts, this.ts);

		// Determine the dot's color in order to make it blink
		if (this.x % 2 == 0)
			this.pcG.c.fillStyle = this.pcG.frame % 60 < 30 ? (this.y % 2 == 0 ? this.theme.dotColor : this.theme.glowColor) : (this.y % 2 == 0 ? this.theme.glowColor : this.theme.dotColor);
		else
			this.pcG.c.fillStyle = this.pcG.frame % 60 < 30 ? (this.y % 2 == 0 ? this.theme.glowColor : this.theme.dotColor) : (this.y % 2 == 0 ? this.theme.dotColor : this.theme.glowColor);

		// Draw the dot
		if (this.value === 5 || this.value === 7) {
			this.pcG.c.beginPath();
			if (this.value === 5)
				this.pcG.c.arc(this.x * this.ts + this.ts / 2, this.y * this.ts + this.ts / 2, this.ts / 6, 0, Math.PI * 2);
			else
				this.pcG.c.arc(this.x * this.ts + this.ts / 2, this.y * this.ts + this.ts / 2, this.ts / 3, 0, Math.PI * 2);
			this.pcG.c.fill();
		}

		if (this.value == 2 || this.value == 3) {
			if (this.value == 2) {
				var tmpImg = this.pcG.frame % 40 < 10 ? this.images.imgPortal1 : 
					this.pcG.frame % 40 < 20 ? this.images.imgPortal2 : 
					this.pcG.frame % 40 < 30 ? this.images.imgPortal3 : this.images.imgPortal4;
			}				
			else {
				var tmpImg = this.pcG.frame % 40 < 10 ? this.images.imgBluePortal1 : 
					this.pcG.frame % 40 < 20 ? this.images.imgBluePortal2 : 
					this.pcG.frame % 40 < 30 ? this.images.imgBluePortal3 : this.images.imgBluePortal4;
			}
			this.pcG.c.drawImage(tmpImg, this.x * this.ts, this.y * this.ts, this.ts, this.ts);
		}
	}
}