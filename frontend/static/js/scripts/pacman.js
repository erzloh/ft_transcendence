// Color constants
const backgroundColor = 'rgb(0, 0, 0)';
const ghostWallColor1 = 'rgb(110, 55, 225)';
const ghostWallColor2 = 'rgb(75, 20, 200)';
const wallColor = 'rgb(60, 0, 120)';
const dotColor = 'rgb(105,55,165)';
const glowColor = 'rgb(145,85,210)';

// Canvas
const canvas = document.getElementById('cvsPacman');
const c = canvas.getContext('2d');
const pScore = document.getElementById('pScore');
const pCD = document.getElementById('pCD');
const gCD = document.getElementById('gCD');
const startButton = document.getElementById('btnStart');
const timerElement = document.getElementById('timer');

// Map data
let cells; // The cells array
let fruitArray = [];
let starArray = [];
let	width, height, tileSize;

// Keys
let pUp = 'KeyW', pLeft = 'KeyA', pDown = 'KeyS', pRight = 'KeyD', pSpell = 'ControlLeft';
let gUp = 'ArrowUp', gLeft = 'ArrowLeft', gDown = 'ArrowDown', gRight = 'ArrowRight', gSpell = 'Numpad0';

// Characters objects
let pacman, ghost;

// Image objects
let imgPacman1, imgPacman2, imgPacman3;
let imgGhost1, imgGhost2, imgGhost3, imgGhost4;
let imgCherry, imgBanana, imgStrawberry, imgStar;
let imgPortal1, imgPortal2, imgPortal3, imgPortal4;

// Utils
let timer;
let pSpeed = 1 / 20;
let gSpeed = 1 / 19;
let frame = 0; // The frame number
let gameStart = false;

function updateGame() {
	pacman.move();
	ghost.move();
}

function renderGame() {
	for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            cells[y][x].render();
        }
    }

    var imgpac =    frame % 40 < 10 ? imgPacman1 : 
                    frame % 40 < 20 ? imgPacman2 :
                    frame % 40 < 30 ? imgPacman3 : imgPacman2;

    pacman.render(imgpac);
    ghost.render();

	// Remove used objects from arrays
	fruitArray = fruitArray.filter(food => food.render());
    starArray = starArray.filter(star => star.render());

	frame++;
}

//#region CHARACTERS

class Character {
    constructor(x, y, direction, speed) {
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.speed = speed;
        this.px = x;
        this.py = y;
        this.tpReady = true;
    }

    teleport() {
        if (this.tpReady == true) {
            var tmpVal = cells[this.y][this.x].value;
            for (var i = 0; i < height; i++) {
                for (var j = 0; j < width; j++) {
                    if (cells[i][j].value == tmpVal && !(this.y == i && this.x == j)) {
                        console.log(j + " " + i + ": " + cells[i][j].value);
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

class Pacman extends Character {
    constructor(x, y, direction, speed) {
        super(x, y, direction, speed);
        this.points = 0;
    }

    useSpell() {
        if (timer.pacmanStartCD())
            ghost.speed = ghost.speed / 2;
    }

    stopSpell() {
        ghost.speed = ghost.speed * 2;
    }

	// Makes the character move until it reaches its destination
	move() {
		if (this.direction == "none")
			return;
		if (this.y == this.py && this.x == this.px) {
			if (cells[this.y][this.x].value === 5 ||
                cells[this.y][this.x].value === 7) {
                if (cells[this.y][this.x].value === 5){
                    cells[this.y][this.x].value = 6;
                    this.points += 10;
                }
				else {
                    cells[this.y][this.x].value = 8;
                    this.points += 100;
                }
				pScore.textContent = "Pacman's score: " + this.points;
			}
            else if (cells[this.y][this.x].value >= 2 &&
                    cells[this.y][this.x].value <=  4) {
               this.teleport();
            }
            else
                this.tpReady = true;
            switch (this.direction) {
                case "up":
                    if (cells[this.y - 1][this.x].value !== 1 && cells[this.y - 1][this.x].value !== 9)
                        this.y -= 1;
                    break;
                case "down":
                    if (cells[this.y + 1][this.x].value !== 1 && cells[this.y + 1][this.x].value !== 9)
                        this.y += 1;
                    break;
                case "left":
                    if (cells[this.y][this.x - 1].value !== 1 && cells[this.y][this.x - 1].value !== 9)
                        this.x -= 1;
                    break;
                case "right":
                    if (cells[this.y][this.x + 1].value !== 1 && cells[this.y][this.x + 1].value !== 9)
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
		pScore.textContent = "Pacman's score: " + this.points;
	}

    // Render the character's sprite
    render(img) {
        // Convert degrees to radians
        var angle = this.direction == "right" ? 0 :
                    this.direction == "up" ? -90 :
                    this.direction == "left" ? 180 : 90;

        var radians = angle * Math.PI / 180;

        c.save();
        c.translate(this.px * tileSize + tileSize / 2, this.py * tileSize + tileSize / 2);
        c.rotate(radians);

        c.drawImage(img, -tileSize / 2, -tileSize / 2, tileSize, tileSize);
        c.restore();
    }
}

class Ghost extends Character {
    constructor(x, y, direction, speed) {
        super(x, y, direction, speed);
        this.lastX;
        this.lastY;
        this.cellValue;
    }

    useSpell() {
        if (timer.ghostStartCD()) {
            this.cellValue = cells[this.lastY][this.lastX].value;
            cells[this.lastY][this.lastX].value = 9;
        }   
    }

    stopSpell() {
        cells[this.lastY][this.lastX].value = this.cellValue;
    }

	// Makes the character move until it reaches its destination
	move() {
		if (this.direction == "none")
			return;
		if (Math.abs(pacman.py - this.py) < 0.5 &&
			Math.abs(pacman.px - this.px) < 0.5) {
			console.log("Ghost wins");
		}
		if (this.y == this.py && this.x == this.px) {
            if (cells[this.y][this.x].value >= 2 &&
                cells[this.y][this.x].value <=  4) {
                this.teleport();
            }
            else
                this.tpReady = true;
            if (timer.gSpellCD == 0) {
                this.lastX = this.x;
                this.lastY = this.y;
            }
			switch (this.direction) {
				case "up":
					if (this.y - 1 >= 0 && cells[this.y - 1][this.x].value !== 1)
						this.y -= 1;
					break;
				case "down":
					if (this.y + 1 < height && cells[this.y + 1][this.x].value !== 1)
						this.y += 1;
					break;
				case "left":
					if (this.x - 1 >= 0 && cells[this.y][this.x - 1].value !== 1)
						this.x -= 1;
					break;
				case "right":
					if (this.x + 1 < width && cells[this.y][this.x + 1].value !== 1)
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
				img = imgGhost1;
				break;
			case "down":
				img = imgGhost2;
				break;
			case "up":
				img = imgGhost3;
				break;
			case "left":
				img = imgGhost4;
				break;
			default:
				img = imgGhost1;
				break;
		}
        c.drawImage(img, this.px * tileSize, this.py * tileSize, tileSize, tileSize);
    }
}

//#endregion

class Star {
    constructor(x, y) {
        this.x = x;
		this.y = y;
    }

    // This function will return false if the fruit gets eaten by pacman
	render() {
		if (Math.abs(pacman.py - this.y) < 0.5 &&
			Math.abs(pacman.px - this.x) < 0.5) {
            for (var y = 1; y < height - 1; y++) {
                for (var x = 1; x < width - 1; x++) {
                    if (cells[y][x].value === 6)
                        cells[y][x].value = 5;
                    else if (cells[y][x].value === 8)
                        cells[y][x].value = 7;
                }
            }
			return false;
		}
		else {
			c.drawImage(imgStar, this.x * tileSize, this.y * tileSize, tileSize, tileSize);
			return true;
		}
	}
}

class Fruit {
	constructor(name, points, x, y, image){
		this.name = name;
		this.points = points;
		this.eaten = false;
		this.x = x;
		this.y = y;
		this.image = image;
	}

	// This function will return false if the fruit gets eaten by pacman
	render() {
		if (Math.abs(pacman.py - this.y) < 0.5 &&
			Math.abs(pacman.px - this.x) < 0.5) {
			pacman.eatFruit(this);
			return false;
		}
		else {
			c.drawImage(this.image, this.x * tileSize, this.y * tileSize, tileSize, tileSize);
			return true;
		}
	}
}

class Timer {
    constructor(timerElement) {
        this.timerElement = timerElement;
		this.dsec = 0;
        this.sec = 0;
        this.min = 0;
        this.interval = null;

		// Spells
        this.pSpellDuration = 0;
        this.pSpellCD = 0;
        this.gSpellDuration = 0;
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
		
		updateGame();
		renderGame();

		if (this.dsec == 100) {
			this.dsec = 0;
			this.sec++;
		
			if (this.pSpellDuration > 0) {
				this.pSpellDuration--;
				if (this.pSpellDuration == 0) {
					pCD.innerHTML = "Pacman's ability: Ready";
					pacman.stopSpell();
				}
			}
				
			if (this.pSpellCD > 0) {
				this.pSpellCD--;
				pCD.innerHTML = "Pacman's ability: " + this.pSpellCD.toString().padStart(2, '0');
			}
	
			if (this.gSpellDuration > 0) {
				this.gSpellDuration--;
				if (this.gSpellDuration == 0) {
					gCD.innerHTML = "Ghost's ability: Ready";
					ghost.stopSpell();
				}
			}
	
			if (this.gSpellCD > 0) {
				this.gSpellCD--;
				gCD.innerHTML = "Ghost's ability: " + this.gSpellCD.toString().padStart(2, '0');
			}
	
			// Every 10 seconds create a fruit
			if (this.sec % 6 == 0) {
				var ypos = Math.floor(Math.random() * (height - 1));
				var xpos = Math.floor(Math.random() * (width - 1));
				if (cells[ypos][xpos].value !== 1) {
					var ran = Math.floor(Math.random() * 3);
					switch (ran){
						case 0:
							fruitArray.push(new Fruit("Cherry", 1000, xpos, ypos, imgCherry));
							break;
						case 1:
							fruitArray.push(new Fruit("Banana", 750, xpos, ypos, imgBanana));
							break;
						case 2:
							fruitArray.push(new Fruit("Strawberry", 500, xpos, ypos, imgStrawberry));
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
					var ypos = Math.floor(Math.random() * (height - 1));
					var xpos = Math.floor(Math.random() * (width - 1));
					if (cells[ypos][xpos].value !== 1) {
						starArray.push(new Star(xpos, ypos));
						starSpawned = true;
					}
				}
			}

			this.timerElement.innerHTML = 
				"Time elapsed: " + this.min.toString().padStart(2, '0') + ":" + this.sec.toString().padStart(2, '0');
		}
    }

	pacmanStartCD() {
        if (this.pSpellCD > 0)
            return false;
        this.pSpellDuration = 5;
        this.pSpellCD = 20;
        pCD.innerHTML = "Pacman's ability: " + this.pSpellCD.toString().padStart(2, '0');
        return true;
    }

    ghostStartCD() {
        if (this.gSpellCD > 0)
            return false;
        this.gSpellDuration = 30;
        this.gSpellCD = 30;
        gCD.innerHTML = "Ghost's ability: " + this.gSpellCD.toString().padStart(2, '0');
        return true;
    }
}

class Cell {
    constructor(x, y, value) {
        this.x = x;
        this.y = y;
        this.value = value;
    }

    // render the cell
    render() {
        // Draw the map's ground and walls
        if (this.value === 1)
            c.fillStyle = wallColor;
        else if (this.value === 9)
            c.fillStyle = frame % 40 < 20 ? ghostWallColor1 : ghostWallColor2;
        else
            c.fillStyle = backgroundColor;
        c.fillRect(this.x * tileSize, this.y * tileSize, tileSize, tileSize);

        // Determine the dot's color in order to make it blink
        c.fillStyle = frame % 40 < 20 ? dotColor : glowColor;

        // Draw the dot
        if (this.value === 5 || this.value === 7) {
            c.beginPath();
            if (this.value === 5)
                c.arc(this.x * tileSize + tileSize / 2, this.y * tileSize + tileSize / 2, tileSize / 6, 0, Math.PI * 2);
            else
                c.arc(this.x * tileSize + tileSize / 2, this.y * tileSize + tileSize / 2, tileSize / 3, 0, Math.PI * 2);
            c.fill();
        }

        if (this.value >= 2 && this.value <= 4) {
            var tmpImg =    frame % 40 < 10 ? imgPortal1 : 
                            frame % 40 < 20 ? imgPortal2 : 
                            frame % 40 < 30 ? imgPortal3 : imgPortal4;
            c.drawImage(tmpImg, this.x * tileSize, this.y * tileSize, tileSize, tileSize);
        }
    }
}

//#region INITIALIZATION

// Initialize everything needed for the game
async function StartGame() {
    // Load needed images
    imgPacman1 = new Image();
    imgPacman2 = new Image();
    imgPacman3 = new Image();
    imgGhost1 = new Image();
	imgGhost2 = new Image();
	imgGhost3 = new Image();
	imgGhost4 = new Image();
	imgCherry = new Image();
	imgBanana = new Image();
	imgStrawberry = new Image();
    imgPortal1 = new Image();
    imgPortal2 = new Image();
    imgPortal3 = new Image();
    imgPortal4 = new Image();
    imgStar = new Image();
	imgPacman1.src = 'static/assets/pacman/images/pacman1.png';
	imgPacman2.src = 'static/assets/pacman/images/pacman2.png';
	imgPacman3.src = 'static/assets/pacman/images/pacman3.png';
	imgGhost1.src = 'static/assets/pacman/images/blueGhost1.png';
	imgGhost2.src = 'static/assets/pacman/images/blueGhost2.png';
	imgGhost3.src = 'static/assets/pacman/images/blueGhost3.png';
	imgGhost4.src = 'static/assets/pacman/images/blueGhost4.png';
	imgCherry.src = 'static/assets/pacman/images/cherry.png';
	imgBanana.src = 'static/assets/pacman/images/banana.png';
	imgStrawberry.src = 'static/assets/pacman/images/strawberry.png';
    imgPortal1.src = 'static/assets/pacman/images/portal1.png';
    imgPortal2.src = 'static/assets/pacman/images/portal2.png';
    imgPortal3.src = 'static/assets/pacman/images/portal3.png';
    imgPortal4.src = 'static/assets/pacman/images/portal4.png';
    imgStar.src = 'static/assets/pacman/images/star.png';

    // Get the map's JSON data
    const mapData = await LoadMap("static/assets/pacman/maps/map1.json");
    const { tileSize: tmpTileSize, width: tmpWidth, height: tmpHeight, data: tmpData } = mapData;
	tileSize = tmpTileSize;
	width = tmpWidth;
	height = tmpHeight;

	// Set score to 0
	pScore.textContent = "Pacman's score: 0";

	// Create the timer object
	timer = new Timer(timerElement);

    // Create the cells array
    cells = createCellArray(tmpData);

	if (pacman && ghost) {
        gameStart = true;
		startButton.disabled = true;
		// Start the timer, which starts the game
		timer.start();
    } 
	else {
        console.error("Pacman or Ghost is not initialized.");
    }
}

// Create the cells array
function createCellArray(data) {
    var tmp = [];
    for (let y = 0; y < height; y++) {
        var row = [];
        for (let x = 0; x < width; x++) {
            if (data[y][x] === "p") {
                pacman = new Pacman(x, y, "none", pSpeed);
                data[y][x] = 0;
            }
            else if (data[y][x] === "g") {
                ghost = new Ghost(x, y, "none", gSpeed);
                data[y][x] = 0;
            }
            row.push(new Cell(x, y, data[y][x]));
        }
        tmp.push(row);
    }
    return tmp;
}

//#endregion

//#region UTILS

// Load the map from the JSON file specified as parameter
async function LoadMap(mapPath) {
    try {
        const response = await fetch(mapPath);
        const mapData = await response.json();
        return mapData;
    } 
    catch (error) {
        console.error("Error loading map:", error);
    }
}

//#endregion

//#region EVENT LISTENERS

window.addEventListener("keydown", (event) => {
    // Prevent buttons from moving the page
    if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(event.code) > -1) {
        event.preventDefault();
    }
	console.log(event.code);
    if (gameStart) {
        switch (event.code) {
            case pUp:
                pacman.direction = "up";
                break;
            case pDown:
                pacman.direction = "down";
                break;
            case pLeft:
                pacman.direction = "left";
                break;
            case pRight:
                pacman.direction = "right";
                break;
            case pSpell:
                pacman.useSpell();
                break;
            case gUp:
                ghost.direction = "up";
                break;
            case gDown:
                ghost.direction = "down";
                break;
            case gLeft:
                ghost.direction = "left";
                break;
            case gRight:
                ghost.direction = "right";
                break;
            case gSpell:
                ghost.useSpell();
                break;
            default:
                break;
        }
    }
});

// To make the players stop when releasing the movement buttons
// window.addEventListener("keyup", (event) => {
//     if (event.code == "KeyW" && pacman.orientation == "up" || 
//         event.code == "KeyA" && pacman.orientation == "left" || 
//         event.code == "KeyS" && pacman.orientation == "down" || 
//         event.code == "KeyD" && pacman.orientation == "right" ) {
//         pacman.orientation = "none";
//     }
//     if (event.code == "ArrowUp" && ghost.orientation == "up" || 
//         event.code == "ArrowLeft" && ghost.orientation == "left" || 
//         event.code == "ArrowDown" && ghost.orientation == "down" || 
//         event.code == "ArrowRight" && ghost.orientation == "right" ) {
//         ghost.orientation = "none";
//     }
// });

// Add Event Listener to the Start Button
startButton.addEventListener("click", StartGame);

//#endregion