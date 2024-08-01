// Color constants
const backgroundColor = 'rgb(0, 0, 0)';
const wallColor = 'rgb(60, 0, 120)';
const dotColor = 'rgb(105,55,165)';
const glowColor = 'rgb(145,85,210)';

// Canvas
const canvas = document.getElementById('cvsPacman');
const c = canvas.getContext('2d');
const pScore = document.getElementById('pScore');
const startButton = document.getElementById('btnStart');
const timerElement = document.getElementById('timer');

// Map data
let cells; // The cells array
let fruitArray = [];
let	width;
let	height;
let tileSize;

let pacman, ghost;
let imgPacman1, imgPacman2, imgPacman3;
let imgGhost1, imgGhost2, imgGhost3, imgGhost4;
let imgCherry, imgBanana, imgStrawberry;

let timer;
let speed = 0.1;
let frame = 0; // The frame number
let gameStart = false;

//#region CHARACTERS

class Character {
    constructor(x, y, direction, speed) {
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.speed = speed;
        this.px = x;
        this.py = y;
    }
}

class Pacman extends Character {
    constructor(x, y, direction, speed) {
        super(x, y, direction, speed);
        this.points = 0;
    }

	checkWinCondition() {
		for (var y = 0; y < height; y++) {
			for (var x = 0; x < width; x++) {
				if (cells[y][x].value === 5)
					return false;
			}
		}
		return true;
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
			switch (this.direction) {
				case "up":
					if (cells[this.y - 1][this.x].value !== 1)
						this.y -= 1;
					break;
				case "down":
					if (cells[this.y + 1][this.x].value !== 1)
						this.y += 1;
					break;
				case "left":
					if (cells[this.y][this.x - 1].value !== 1)
						this.x -= 1;
					break;
				case "right":
					if (cells[this.y][this.x + 1].value !== 1)
						this.x += 1;
					break;
				default:
					break;
			}
		}
	}

	eatFruit(fruit) {
		this.points += fruit.points;
		pScore.textContent = "Pacman's score: " + this.points;
	}

    // Render the character's sprite
    render(img) {
        if (this.px != this.x)
            this.px = this.px < this.x ? Math.round((this.px + this.speed) * 10) / 10 : Math.round((this.px - this.speed) * 10) / 10;
        else if (this.py != this.y)
            this.py = this.py < this.y ? Math.round((this.py + this.speed) * 10) / 10 : Math.round((this.py - this.speed) * 10) / 10;
        
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
			switch (this.direction) {
				case "up":
					if (cells[this.y - 1][this.x].value !== 1)
						this.y -= 1;
					break;
				case "down":
					if (cells[this.y + 1][this.x].value !== 1)
						this.y += 1;
					break;
				case "left":
					if (cells[this.y][this.x - 1].value !== 1)
						this.x -= 1;
					break;
				case "right":
					if (cells[this.y][this.x + 1].value !== 1)
						this.x += 1;
					break;
				default:
					break;
			}
		}
	}

    // Render the character's sprite
    render() {
        if (this.px != this.x)
            this.px = this.px < this.x ? Math.round((this.px + this.speed) * 10) / 10 : Math.round((this.px - this.speed) * 10) / 10;
        else if (this.py != this.y)
            this.py = this.py < this.y ? Math.round((this.py + this.speed) * 10) / 10 : Math.round((this.py - this.speed) * 10) / 10;
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
        this.sec = 0;
        this.min = 0;
        this.interval = null;
    }

    start() {
        if (!this.interval) {
            this.interval = setInterval(() => {
                this.updateTime();
            }, 1000);
        }
    }

    stop() {
        clearInterval(this.interval);
        this.interval = null;
    }

    reset() {
        this.stop();
        this.sec = 0;
        this.min = 0;
        this.updateDisplay();
    }

    updateTime() {
        this.sec++;
		
		// Every 10 seconds create a fruit
		if (this.sec % 8 == 0) {
			var ypos = Math.floor(Math.random() * (height - 1));
			var xpos = Math.floor(Math.random() * (width - 1));
			if (cells[ypos][xpos].value !== 1) {

				var ran = Math.floor(Math.random() * 3);
				switch (ran){
					case 0:
						fruitArray.push(new Fruit("Cherry", 500, xpos, ypos, imgCherry));
						break;
					case 1:
						fruitArray.push(new Fruit("Banana", 300, xpos, ypos, imgBanana));
						break;
					case 2:
						fruitArray.push(new Fruit("Strawberry", 200, xpos, ypos, imgStrawberry));
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
            if (this.min % 2 == 0) {
                for (var y = 1; y < height - 1; y++) {
                    for (var x = 1; x < width - 1; x++) {
                        if (cells[y][x].value === 6)
                            cells[y][x].value = 5;
                        else if (cells[y][x].value === 8)
                            cells[y][x].value = 7;
                    }
                }
            }
        }

        this.updateDisplay();
    }

    updateDisplay() {
        this.timerElement.innerHTML = 
			"Time elapsed: " + this.min.toString().padStart(2, '0') + ":" + this.sec.toString().padStart(2, '0');
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
        else
            c.fillStyle = backgroundColor;

        c.fillRect(this.x * tileSize, this.y * tileSize, tileSize, tileSize);

        // Determine the dot's color in order to make it blink
        c.fillStyle = frame % 30 < 15 ? dotColor : glowColor;

        // Draw the dot
        if (this.value === 5 || this.value === 7) {
            c.beginPath();
            if (this.value === 5)
                c.arc(this.x * tileSize + tileSize / 2, this.y * tileSize + tileSize / 2, tileSize / 6, 0, Math.PI * 2);
            else
                c.arc(this.x * tileSize + tileSize / 2, this.y * tileSize + tileSize / 2, tileSize / 3, 0, Math.PI * 2);
            c.fill();
        }
    }
}

async function StartGame() {
    // Load needed images
    imgPacman1 = new Image();
    imgPacman1.src = 'static/assets/pacman/images/pacman1.png';
    imgPacman2 = new Image();
    imgPacman2.src = 'static/assets/pacman/images/pacman2.png';
    imgPacman3 = new Image();
    imgPacman3.src = 'static/assets/pacman/images/pacman3.png';
    imgGhost1 = new Image();
    imgGhost1.src = 'static/assets/pacman/images/blueGhost1.png';
	imgGhost2 = new Image();
    imgGhost2.src = 'static/assets/pacman/images/blueGhost2.png';
	imgGhost3 = new Image();
    imgGhost3.src = 'static/assets/pacman/images/blueGhost3.png';
	imgGhost4 = new Image();
    imgGhost4.src = 'static/assets/pacman/images/blueGhost4.png';
	imgCherry = new Image();
	imgCherry.src = 'static/assets/pacman/images/cherry.png';
	imgBanana = new Image();
	imgBanana.src = 'static/assets/pacman/images/banana.png';
	imgStrawberry = new Image();
	imgStrawberry.src = 'static/assets/pacman/images/strawberry.png';

	// Set score to 0
	pScore.textContent = "Pacman's score: 0";
	timer = new Timer(timerElement);

    // Get the map's JSON data
    const mapData = await LoadMap("static/assets/pacman/maps/map1.json");
    const { tileSize: tmpTileSize, width: tmpWidth, height: tmpHeight, data: tmpData } = mapData;
	tileSize = tmpTileSize;
	width = tmpWidth;
	height = tmpHeight;

    // Create the cells array
    cells = createCellArray(tmpData);

	if (pacman && ghost) {
        gameStart = true;
		startButton.disabled = true;
		timer.start();
        // Start animating the map
        gameloop();
    } else {
        console.error("Pacman or Ghost is not initialized.");
    }
}

// Animate the game 
function gameloop() {
    requestAnimationFrame(() => gameloop());
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            cells[y][x].render();
        }
    }

    var imgpac =    frame % 20 < 5 ? imgPacman1 : 
                    frame % 20 < 10 ? imgPacman2 :
                    frame % 20 < 15 ? imgPacman3 : imgPacman2;

    pacman.move();
    pacman.render(imgpac);
    ghost.move();
    ghost.render();

	// Remove eaten fruits from the fruitArray
	fruitArray = fruitArray.filter(food => food.render());
    frame++;
}

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

// Create the cells array
function createCellArray(data) {
    var tmp = [];
    for (let y = 0; y < height; y++) {
        var row = [];
        for (let x = 0; x < width; x++) {
            if (data[y][x] === "p") {
                pacman = new Pacman(x, y, "none", speed);
                data[y][x] = 0;
            }
            else if (data[y][x] === "g") {
                ghost = new Ghost(x, y, "none", speed);
                data[y][x] = 0;
            }
            row.push(new Cell(x, y, data[y][x]));
        }
        tmp.push(row);
    }
    return tmp;
}

//#region EVENT LISTENERS

window.addEventListener("keydown", (event) => {
    switch (event.code) {
        case 'KeyW':
            pacman.direction = "up";
            break;
        case 'KeyS':
            pacman.direction = "down";
            break;
        case 'KeyA':
            pacman.direction = "left";
            break;
        case 'KeyD':
            pacman.direction = "right";
            break;
        case 'ArrowUp':
            ghost.direction = "up";
            break;
        case 'ArrowDown':
            ghost.direction = "down";
            break;
        case 'ArrowLeft':
            ghost.direction = "left";
            break;
        case 'ArrowRight':
            ghost.direction = "right";
            break;
        default:
            break;
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


//#endregion

// Add Event Listener to the Start Button
startButton.addEventListener("click", StartGame);