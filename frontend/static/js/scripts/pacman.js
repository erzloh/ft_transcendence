import { updateTexts } from "../utils/languages.js";
import { Pacman, Ghost} from "./pacman/characters.js";
import { Cell, Timer} from "./pacman/objects.js";

let eventListeners = { }

class PacmanGame {
	constructor (){
		// Canvas
		this.pGamemode = document.getElementById('pGamemode');
		this.pScore = document.getElementById('pScore');
		this.startButton = document.getElementById('btnStart');

		this.pacmanUsername = document.getElementById('pacmanPlayerLabel');
		this.ghostUsername = document.getElementById('ghostPlayerLabel');
		this.imgPacmanSkin = document.getElementById('imgPacmanSkin');
		this.imgGhostSkin = document.getElementById('imgGhostSkin');

		this.endgameModalWinner = document.getElementById('endgameModalWinner');
    	this.endgameModalScore = document.getElementById('endgameModalScore');
    	this.endgameModalTime = document.getElementById('endgameModalTime');
		this.endgameModalPlayAgain = document.getElementById('playAgainButton');

		this.pauseModal = new bootstrap.Modal(document.getElementById('pauseModal'));
		this.endgameModal = new bootstrap.Modal(document.getElementById('endgameModal'));

		this.canvas = document.getElementById('cvsPacman');
		this.c = this.canvas.getContext('2d');

		// Map data
		this.cells; // The cells array
		this.fruitArray = [];
		this.starArray = [];
		this.width, this.height, this.tileSize;

		// Keys
		this.keybinds;

		// Characters objects
		this.pacman, this.ghost;

		// Image objects
		this.images = {
			imgPacman1 : new Image(), imgPacman2 : new Image(), imgPacman3 : new Image(),
			imgGhost1 : new Image(), imgGhost2 : new Image(), imgGhost3 : new Image(), imgGhost4 : new Image(),
			imgCherry : new Image(), imgBanana : new Image(), imgStrawberry : new Image(), imgStar : new Image(),
			imgPortal1 : new Image(), imgPortal2 : new Image(), imgPortal3 : new Image(), imgPortal4 : new Image(),
			imgBluePortal1 : new Image(), imgBluePortal2 : new Image(), imgBluePortal3 : new Image(), imgBluePortal4 : new Image()
		}

		// Utils
		this.timer;
		this.pSpeed = 1 / 20;
		this.gSpeed = 1 / 19;
		this.frame = 0; // The frame number
		this.gameOver = false;
		this.gamePaused = false;

		this.boundPacmanHandleKeyDown = this.pacmanHandleKeyDown.bind(this);
	}

	Initialize() {
		this.startButton.addEventListener("click", () => this.StartGame());
		this.endgameModalPlayAgain.addEventListener("click", () => this.resetGame());

		const usernamesString = localStorage.getItem('pacmanUsernames');
		this.usernames = usernamesString ? JSON.parse(usernamesString) : {
			pacman: "Player1", ghost: "Player2"
		};

		this.pacmanUsername.innerHTML = this.usernames.pacman;
		this.ghostUsername.innerHTML = this.usernames.ghost;

		const keybindsString = localStorage.getItem('pacmanKeybinds');
		this.keybinds = keybindsString ? JSON.parse(keybindsString) : {
			pUp : 'KeyW', pLeft : 'KeyA', pDown : 'KeyS', pRight : 'KeyD', pSpell : 'KeyE',
			gUp : 'ArrowUp', gLeft : 'ArrowLeft', gDown : 'ArrowDown', gRight : 'ArrowRight', gSpell : 'Numpad0'
		};

		const pacmanSkinString = localStorage.getItem('pacmanSkin');
		this.pacmanSkin = pacmanSkinString ? JSON.parse(pacmanSkinString) : "pacman";

		const ghostSkinString = localStorage.getItem('ghostSkin');
		this.ghostSkin = ghostSkinString ? JSON.parse(ghostSkinString) : "orangeGhost";

		const objectiveString = localStorage.getItem('objective');
		this.objective = objectiveString ? JSON.parse(objectiveString) : "10000";

		const gamemodeString = localStorage.getItem('gamemode');
		this.gamemode = gamemodeString ? JSON.parse(gamemodeString) : "objective";
		switch (this.gamemode) {
			case "objective":
				this.pGamemode.innerHTML = this.objective;
				break;
			case "infinite":
				document.querySelectorAll('.total-score').forEach(elem => {
					elem.style.display = 'none';
				});
				break;
			default:
				break;
		}

		this.imgPacmanSkin.src = 'static/assets/pacman/images/' + this.pacmanSkin + '2.png';
		this.imgGhostSkin.src = this.images.imgGhost1.src = 'static/assets/pacman/images/' + this.ghostSkin + '1.png';

		const mapNameString = localStorage.getItem('mapName');
		this.mapName = mapNameString ? JSON.parse(mapNameString) : "maze";

		const themeString = localStorage.getItem('pacmanTheme');
		this.theme = themeString ? JSON.parse(themeString) : {
			backgroundColor : 'rgb(10, 0, 20)', ghostWallColor1 : 'rgb(110, 55, 225)', ghostWallColor2 : 'rgb(75, 20, 200)',
			wallColor : 'rgb(60, 0, 120)', dotColor : 'rgb(105,55,165)', glowColor : 'rgb(145,85,210)'
		};

		this.images.imgPacman1.src = 'static/assets/pacman/images/' + this.pacmanSkin + '1.png';
		this.images.imgPacman2.src = 'static/assets/pacman/images/' + this.pacmanSkin + '2.png';
		this.images.imgPacman3.src = 'static/assets/pacman/images/' + this.pacmanSkin + '3.png';
		this.images.imgGhost1.src = 'static/assets/pacman/images/' + this.ghostSkin + '1.png';
		this.images.imgGhost2.src = 'static/assets/pacman/images/' + this.ghostSkin + '2.png';
		this.images.imgGhost3.src = 'static/assets/pacman/images/' + this.ghostSkin + '3.png';
		this.images.imgGhost4.src = 'static/assets/pacman/images/' + this.ghostSkin + '4.png';
		this.images.imgCherry.src = 'static/assets/pacman/images/cherry.png';
		this.images.imgBanana.src = 'static/assets/pacman/images/banana.png';
		this.images.imgStrawberry.src = 'static/assets/pacman/images/strawberry.png';
		this.images.imgPortal1.src = 'static/assets/pacman/images/portal1.png';
		this.images.imgPortal2.src = 'static/assets/pacman/images/portal2.png';
		this.images.imgPortal3.src = 'static/assets/pacman/images/portal3.png';
		this.images.imgPortal4.src = 'static/assets/pacman/images/portal4.png';
		this.images.imgBluePortal1.src = 'static/assets/pacman/images/portalBlue1.png';
		this.images.imgBluePortal2.src = 'static/assets/pacman/images/portalBlue2.png';
		this.images.imgBluePortal3.src = 'static/assets/pacman/images/portalBlue3.png';
		this.images.imgBluePortal4.src = 'static/assets/pacman/images/portalBlue4.png';
		this.images.imgStar.src = 'static/assets/pacman/images/star.png';
	}

	pauseGame() {
		if (!this.gameOver) {
			if (!this.gamePaused) {
				this.timer.stop();
				this.c.fillStyle = "rgba(0, 0, 0, 0.5)";
				this.c.fillRect(0, 0, this.canvas.width, this.canvas.height);
				this.pauseModal.show();
				updateTexts();
			}
			else
				this.timer.start();
			this.gamePaused = !this.gamePaused;

		}
	}

	resetGame() {
		this.gameOver = false;
		this.gamePaused = false;

		this.fruitArray = [];
		this.starArray = [];

		this.timer.reset();

		this.c.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.startButton.disabled = false;
	}

	partyOver(winner) {
		this.gameOver = true;
		this.timer.stop();

		this.endgameModalWinner.textContent = winner + " won the game !";
		this.endgameModalScore.textContent = "Pacman's score: " + this.pacman.points;
		this.endgameModalTime.textContent = "Time elapsed: " + this.timer.min.toString().padStart(2, '0') + ":" + this.timer.sec.toString().padStart(2, '0');

		// Show the modal
		this.endgameModal.show();
	}

	updateGame() {
		this.pacman.move();
		this.ghost.move();
	}

	renderGame() {
		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				this.cells[y][x].render();
			}
		}

		let imgpac =    this.frame % 40 < 10 ? this.images.imgPacman1 : 
						this.frame % 40 < 20 ? this.images.imgPacman2 :
						this.frame % 40 < 30 ? this.images.imgPacman3 : this.images.imgPacman2;

		this.pacman.render(imgpac);
		this.ghost.render();

		// Remove used objects from arrays
		this.fruitArray = this.fruitArray.filter(food => food.render());
		this.starArray = this.starArray.filter(star => star.render());

		this.frame++;
	}

	// Load the map from the JSON file specified as parameter
	async loadMap(mapPath) {
		try {
			const response = await fetch(mapPath);
			const mapData = await response.json();
			return mapData;
		} 
		catch (error) {
			console.error("Error loading map:", error);
		}
	}

	// Initialize everything needed for the game
	async StartGame() {
		// Get the map's JSON data
		const mapData = await this.loadMap("static/assets/pacman/maps/" + this.mapName + ".json");
		const { tileSize: tmpTileSize, width: tmpWidth, height: tmpHeight, data: tmpData } = mapData;
		this.tileSize = tmpTileSize;
		this.width = tmpWidth;
		this.height = tmpHeight;

		// Set score to 0
		this.pScore.textContent = "00";

		document.addEventListener("keydown", this.boundPacmanHandleKeyDown);
		eventListeners["keydown"] = this.boundPacmanHandleKeyDown;

		// Create the timer object
		this.timer = new Timer(this);

		// Create the cells array
		this.cells = this.createCellArray(tmpData);

		if (this.gamemode == "objective")
			this.pacman.objective = this.objective;

		if (this.pacman && this.ghost) {
			this.gameStart = true;
			this.startButton.disabled = true;
			// Start the timer, which starts the game
			this.timer.start();
		} 
		else {
			console.error("Pacman or Ghost is not initialized.");
		}
	}

	// Create the cells array
	createCellArray(data) {
		let tmp = [];
		for (let y = 0; y < this.height; y++) {
			let row = [];
			for (let x = 0; x < this.width; x++) {
				if (data[y][x] === "p") {
					this.pacman = new Pacman(x, y, "none", this);
					data[y][x] = 0;
				}
				else if (data[y][x] === "g") {
					this.ghost = new Ghost(x, y, "none", this);
					data[y][x] = 0;
				}
				row.push(new Cell(x, y, data[y][x], this, this.tileSize));
			}
			tmp.push(row);
		}
		return tmp;
	}

	pacmanHandleKeyDown = (event) => {
		// Prevent buttons from moving the page
		if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(event.code) > -1) {
			event.preventDefault();
		}
		console.log(event.code);
		if (event.code == "Escape")
			this.pauseGame();
		if (!this.gamePaused) {
			switch (event.code) {
				case this.keybinds.pUp:
					this.pacman.direction = "up";
					break;
				case this.keybinds.pDown:
					this.pacman.direction = "down";
					break;
				case this.keybinds.pLeft:
					this.pacman.direction = "left";
					break;
				case this.keybinds.pRight:
					this.pacman.direction = "right";
					break;
				case this.keybinds.pSpell:
					this.pacman.useSpell();
					break;
				case this.keybinds.gUp:
					this.ghost.direction = "up";
					break;
				case this.keybinds.gDown:
					this.ghost.direction = "down";
					break;
				case this.keybinds.gLeft:
					this.ghost.direction = "left";
					break;
				case this.keybinds.gRight:
					this.ghost.direction = "right";
					break;
				case this.keybinds.gSpell:
					this.ghost.useSpell();
					break;
				default:
					break;
			}
		}
	}
}

// --------------------------- Event Listener Functions ---------------------------
// (Only Event Listener that are attached to the document.
// Those attached to elements in the view are gonna be removed
// when the view changes anyway)

// Example:
// function printKey (event) {
// 	console.log(event.key);
// }

// --------------------------- Export Event Listeners Object ---------------------------

export { PacmanGame, eventListeners };