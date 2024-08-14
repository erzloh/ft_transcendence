export let eventListeners = { }

export class PacmanMenu {
	constructor () {
		this.keysButton = document.getElementById('btnKeys');
        this.pSkinButton = document.getElementById('btnPSkin');
        this.gSkinButton = document.getElementById('btnGSkin');
        this.mapButton = document.getElementById('btnMap');
        this.colorButton = document.getElementById('btnColor');
        this.configContainer = document.getElementById('configContainer');
		this.pacmanUsernameLabel = document.getElementById('pacmanName');
		this.pacmanInput = document.getElementById('pacmanInput');
		this.ghostUsernameLabel = document.getElementById('ghostName');
		this.ghostInput = document.getElementById('ghostInput');

		this.toastNotification = document.getElementById('liveToast');
		this.toastBootstrap = bootstrap.Toast.getOrCreateInstance(this.toastNotification);
		this.toastBody = document.getElementById('toastBody');

		this.boundKeyDownSettings = this.keyDownSettings.bind(this);

		this.waitForKey = false;
		this.waitingKey = "";

		const usernamesString = localStorage.getItem('usernames');
		this.usernames = usernamesString ? JSON.parse(usernamesString) : {
			pacman: "Player1", ghost: "Player2"
		};

		this.pacmanUsernameLabel.innerHTML = this.usernames.pacman;
		this.ghostUsernameLabel.innerHTML = this.usernames.ghost;

		const pacmanSkinString = localStorage.getItem('pacmanSkin');
		this.pacmanSkin = pacmanSkinString ? JSON.parse(pacmanSkinString) : "pacman";

		const ghostSkinString = localStorage.getItem('ghostSkin');
		this.ghostSkin = ghostSkinString ? JSON.parse(ghostSkinString) : "orangeGhost";

		const mapNameString = localStorage.getItem('mapName');
		this.mapName = mapNameString ? JSON.parse(mapNameString) : "maze";

		const themeString = localStorage.getItem('theme');
		this.theme = themeString ? JSON.parse(themeString) : {
			backgroundColor : 'rgb(10, 0, 20)', ghostWallColor1 : 'rgb(110, 55, 225)', ghostWallColor2 : 'rgb(75, 20, 200)',
			wallColor : 'rgb(60, 0, 120)', dotColor : 'rgb(105,55,165)', glowColor : 'rgb(145,85,210)'
		};

		const keybindsString = localStorage.getItem('keybinds');
		this.keybinds = keybindsString ? JSON.parse(keybindsString) : {
			pUp : 'KeyW', pLeft : 'KeyA', pDown : 'KeyS', pRight : 'KeyD', pSpell : 'KeyE',
			gUp : 'ArrowUp', gLeft : 'ArrowLeft', gDown : 'ArrowDown', gRight : 'ArrowRight', gSpell : 'Numpad0'
		};

		this.pacmanInput.addEventListener('keypress', (event) => this.pacmanPlayerInputHandle(event));
		this.pacmanInput.addEventListener('blur', (event) => this.pacmanPlayerInputHandle(event));
		this.ghostInput.addEventListener('keypress', (event) => this.ghostPlayerInputHandle(event));
		this.ghostInput.addEventListener('blur', (event) => this.ghostPlayerInputHandle(event));
	}

	pacmanPlayerInputHandle(event) {
		if (((event.type == 'keypress' && event.key === 'Enter') || event.type == 'blur') && this.pacmanInput.value != "") {
			this.usernames.pacman = this.pacmanInput.value;
			this.pacmanInput.value = ""; // Clear the input box
			this.pacmanUsernameLabel.innerHTML = this.usernames.pacman;
		}
	}

	ghostPlayerInputHandle(event) {
		if (((event.type == 'keypress' && event.key === 'Enter') || event.type == 'blur') && this.ghostInput.value != "") {
			this.usernames.ghost = this.ghostInput.value;
			this.ghostInput.value = ""; // Clear the input box
			this.ghostUsernameLabel.innerHTML = this.usernames.ghost;
		}
	}

	Initialize() {
		// Add Event Listener to the Start Button
		this.keysButton.addEventListener("click", () => this.showKeysConfig());
		this.pSkinButton.addEventListener("click", () => this.showPacmanSkinConfig());
		this.gSkinButton.addEventListener("click", () => this.showGhostSkinConfig());
		this.mapButton.addEventListener("click", () => this.showMapConfig());
		this.colorButton.addEventListener("click", () => this.showColorSchemeConfig());

		document.addEventListener("keydown", this.boundKeyDownSettings);
		eventListeners["keydown"] = this.boundKeyDownSettings;

		document.getElementById('startGameButton').addEventListener('click', (event) => {
			event.preventDefault();
			localStorage.setItem('keybinds', JSON.stringify(this.keybinds));
			localStorage.setItem('pacmanSkin', JSON.stringify(this.pacmanSkin));
			localStorage.setItem('ghostSkin', JSON.stringify(this.ghostSkin));
			localStorage.setItem('mapName', JSON.stringify(this.mapName));
			localStorage.setItem('theme', JSON.stringify(this.theme));
			localStorage.setItem('usernames', JSON.stringify(this.usernames))
			window.location.href = "/pacman";
		});
	}

	showKeysConfig() {
		this.configContainer.innerHTML = `
			<div class="row justify-content-center glass" style="max-height: 350px; overflow-y: auto;">
				<div class="row mt-3"></div>
				<label class="h2 text-white">Keys settings</label>
				<div class="col-12 d-flex justify-content-center">
					<div class="col-5">
						<div class="row justify-content-center text-center mt-2">
							<label class="h3 text-white">Pacman keys</label>
						</div>
						<div class="row justify-content-center text-center mt-2">
							<div class="col-6 d-flex justify-content-end">
								<label class="text-white" style="padding: 3px 0px;">Move up</label>
							</div>
							<div class="col-6 d-flex justify-content-start">
								<label role="button" class="text-white" style="border: 2px solid #260045; padding: 1px 5px;" id="pUp">${this.keybinds.pUp !== "" ? this.keybinds.pUp : "none"}</label>
							</div>
						</div>
						<div class="row justify-content-center text-center mt-2">
							<div class="col-6 d-flex justify-content-end">
								<label class="text-white" style="padding: 3px 0px;">Move left</label>
							</div>
							<div class="col-6 d-flex justify-content-start">
								<label role="button" class="text-white" style="border: 2px solid #260045; padding: 1px 5px;" id="pLeft">${this.keybinds.pLeft !== "" ? this.keybinds.pLeft : "none"}</label>
							</div>
						</div>
						<div class="row justify-content-center text-center mt-2">
							<div class="col-6 d-flex justify-content-end">
								<label class="text-white" style="padding: 3px 0px;">Move down</label>
							</div>
							<div class="col-6 d-flex justify-content-start">
								<label role="button" class="text-white" style="border: 2px solid #260045; padding: 1px 5px;" id="pDown">${this.keybinds.pDown !== "" ? this.keybinds.pDown : "none"}</label>
							</div>
						</div>
						<div class="row justify-content-center text-center mt-2">
							<div class="col-6 d-flex justify-content-end">
								<label class="text-white" style="padding: 3px 0px;">Move right</label>
							</div>
							<div class="col-6 d-flex justify-content-start">
								<label role="button" class="text-white" style="border: 2px solid #260045; padding: 1px 5px;" id="pRight">${this.keybinds.pRight !== "" ? this.keybinds.pRight : "none"}</label>
							</div>
						</div>
						<div class="row justify-content-center text-center mt-2">
							<div class="col-6 d-flex justify-content-end">
								<label class="text-white" style="padding: 3px 0px;">Use spell</label>
							</div>
							<div class="col-6 d-flex justify-content-start">
								<label role="button" class="text-white" style="border: 2px solid #260045; padding: 1px 5px;" id="pSpell">${this.keybinds.pSpell !== "" ? this.keybinds.pSpell : "none"}</label>
							</div>
						</div>
					</div>
					<div class="col-5">
						<div class="row justify-content-center text-center mt-2">
							<h3 class="text-white">Ghost keys</h3>
						</div>
						<div class="row justify-content-center text-center mt-2">
							<div class="col-6 d-flex justify-content-end">
								<label class="text-white" style="padding: 3px 0px;">Move up</label>
							</div>
							<div class="col-6 d-flex justify-content-start">
								<label role="button" class="text-white" style="border: 2px solid #260045; padding: 1px 5px;" id="gUp">${this.keybinds.gUp !== "" ? this.keybinds.gUp : "none"}</label>
							</div>
						</div>
						<div class="row justify-content-center text-center mt-2">
							<div class="col-6 d-flex justify-content-end">
								<label class="text-white" style="padding: 3px 0px;">Move left</label>
							</div>
							<div class="col-6 d-flex justify-content-start">
								<label role="button" class="text-white" style="border: 2px solid #260045; padding: 1px 5px;" id="gLeft">${this.keybinds.gLeft !== "" ? this.keybinds.gLeft : "none"}</label>
							</div>
						</div>
						<div class="row justify-content-center text-center mt-2">
							<div class="col-6 d-flex justify-content-end">
								<label class="text-white" style="padding: 3px 0px;">Move down</label>
							</div>
							<div class="col-6 d-flex justify-content-start">
								<label role="button" class="text-white" style="border: 2px solid #260045; padding: 1px 5px;" id="gDown">${this.keybinds.gDown !== "" ? this.keybinds.gDown : "none"}</label>
							</div>
						</div>
						<div class="row justify-content-center text-center mt-2">
							<div class="col-6 d-flex justify-content-end">
								<label class="text-white" style="padding: 3px 0px;">Move right</label>
							</div>
							<div class="col-6 d-flex justify-content-start">
								<label role="button" class="text-white" style="border: 2px solid #260045; padding: 1px 5px;" id="gRight">${this.keybinds.gRight !== "" ? this.keybinds.gRight : "none"}</label>
							</div>
						</div>
						<div class="row justify-content-center text-center mt-2">
							<div class="col-6 d-flex justify-content-end">
								<label class="text-white" style="padding: 3px 0px;">Use spell</label>
							</div>
							<div class="col-6 d-flex justify-content-start">
								<label role="button" class="text-white" style="border: 2px solid #260045; padding: 1px 5px;" id="gSpell">${this.keybinds.gSpell !== "" ? this.keybinds.gSpell : "none"}</label>
							</div>
						</div>
					</div>
				</div>
				<div class="row mt-3"></div>
			</div>
		`;

		var btnPUp = document.getElementById('pUp');
        var btnPLeft = document.getElementById('pLeft');
		var btnPDown = document.getElementById('pDown');
		var btnPRight = document.getElementById('pRight');
		var btnPSpell = document.getElementById('pSpell');
		var btnGUp = document.getElementById('gUp');
        var btnGLeft = document.getElementById('gLeft');
		var btnGDown = document.getElementById('gDown');
		var btnGRight = document.getElementById('gRight');
		var btnGSpell = document.getElementById('gSpell');
		btnPUp.addEventListener("click", (event) => this.changeKeybind(event, "pUp", btnPUp));
		btnPLeft.addEventListener("click", (event) => this.changeKeybind(event, "pLeft", btnPLeft));
		btnPDown.addEventListener("click", (event) => this.changeKeybind(event, "pDown", btnPDown));
		btnPRight.addEventListener("click", (event) => this.changeKeybind(event, "pRight", btnPRight));
		btnPSpell.addEventListener("click", (event) => this.changeKeybind(event, "pSpell", btnPSpell));
		btnGUp.addEventListener("click", (event) => this.changeKeybind(event, "gUp", btnGUp));
		btnGLeft.addEventListener("click", (event) => this.changeKeybind(event, "gLeft", btnGLeft));
		btnGDown.addEventListener("click", (event) => this.changeKeybind(event, "gDown", btnGDown));
		btnGRight.addEventListener("click", (event) => this.changeKeybind(event, "gRight", btnGRight));
		btnGSpell.addEventListener("click", (event) => this.changeKeybind(event, "gSpell", btnGSpell));
	}

	showPacmanSkinConfig() {
		this.configContainer.innerHTML = `
			<div class="row justify-content-center glass">
				<div class="col-12 justify-content-center">
					<div class="row justify-content-center text-center mt-2 mb-3">
						<div class="row mb-2">
							<label class="h2 text-white">Pacman skins</label>
						</div>
						<div class="col-3 d-flex justify-content-center">
							<img role="button" id="pPacmanSkin" src="/static/assets/pacman/images/pacman1.png">
						</div>
						<div class="col-3 d-flex justify-content-center">
							<img role="button" id="pPacgirlSkin" src="/static/assets/pacman/images/pacgirl1.png">
						</div>
					</div>
				</div>
			</div>
		`;

		var btnPacmanSkin = document.getElementById('pPacmanSkin');
        var btnPacgirlSkin = document.getElementById('pPacgirlSkin');
		btnPacmanSkin.addEventListener("click", (event) => this.selectPacmanSkin(event, "pacman"));
		btnPacgirlSkin.addEventListener("click", (event) => this.selectPacmanSkin(event, "pacgirl"));
	}

	showGhostSkinConfig() {
		this.configContainer.innerHTML = `
			<div class="row justify-content-center glass">
				<div class="col-12 justify-content-center">
					<div class="row justify-content-center text-center mt-2 mb-3">
						<div class="row mb-2">
							<label class="h2 text-white">Ghost skins</label>
						</div>
						<div class="col-3 d-flex justify-content-center">
							<img role="button" id="pBlueGhostSkin" src="/static/assets/pacman/images/blueGhost1.png">
						</div>
						<div class="col-3 d-flex justify-content-center">
							<img role="button" id="pOrangeGhostSkin" src="/static/assets/pacman/images/orangeGhost1.png">
						</div>
						<div class="col-3 d-flex justify-content-center">
							<img role="button" id="pPinkGhostSkin" src="/static/assets/pacman/images/pinkGhost1.png">
						</div>
						<div class="col-3 d-flex justify-content-center">
							<img role="button" id="pGreenGhostSkin" src="/static/assets/pacman/images/greenGhost1.png">
						</div>
					</div>
				</div>
			</div>
		`;

		var btnBlueSkin = document.getElementById('pBlueGhostSkin');
        var btnOrangeSkin = document.getElementById('pOrangeGhostSkin');
		var btnPinkSkin = document.getElementById('pPinkGhostSkin');
        var btnGreenSkin = document.getElementById('pGreenGhostSkin');

		btnBlueSkin.addEventListener("click", (event) => this.selectGhostSkin(event, "blueGhost"));
		btnOrangeSkin.addEventListener("click", (event) => this.selectGhostSkin(event, "orangeGhost"));
		btnPinkSkin.addEventListener("click", (event) => this.selectGhostSkin(event, "pinkGhost"));
		btnGreenSkin.addEventListener("click", (event) => this.selectGhostSkin(event, "greenGhost"));
	}

	showMapConfig() {
		this.configContainer.innerHTML = `
			<div class="row justify-content-center glass">
				<div class="col-auto mr-2 ml-3">
					<div class="row justify-content-center text-center mt-2 mb-3">
						<div class="col-12 mb-2">
							<label class="h2 text-white">Maps</label>
						</div>
						<div class="col-4 d-flex justify-content-center mb-3">
							<img class="img-fluid" style="max-height: 275px; border: 3px solid #260045;" role="button" src="/static/assets/pacman/images/maze.png" id="pMaze"/>
						</div>
						<div class="col-4 d-flex justify-content-center mb-3">
							<img class="img-fluid" style="max-height: 275px; border: 3px solid #260045;" role="button" src="/static/assets/pacman/images/spiral.png" id="pSpiral"/>
						</div>
						<div class="col-4 d-flex justify-content-center mb-3">
							<img class="img-fluid" style="max-height: 275px; border: 3px solid #260045;" role="button" src="/static/assets/pacman/images/butterfly.png" id="pButterfly"/>
						</div>
					</div>
				</div>
			</div>
		`;

		var btnMaze = document.getElementById('pMaze');
        var btnSpiral = document.getElementById('pSpiral');
		var btnButterfly = document.getElementById('pButterfly');

		btnMaze.addEventListener("click", (event) => this.selectMap(event, "maze"));
		btnSpiral.addEventListener("click", (event) => this.selectMap(event, "spiral"));
		btnButterfly.addEventListener("click", (event) => this.selectMap(event, "butterfly"));
	}

	showColorSchemeConfig() {
		this.configContainer.innerHTML = `
			<div class="row justify-content-center glass">
				<div class="col-12 justify-content-center">
					<div class="row justify-content-center text-center mt-2 mb-3">
						<div class="col-12 mb-2">
							<label class="h2 text-white">Themes</label>
						</div>
						<div class="row justify-content-center text-center">
							<div class="col-3 d-flex justify-content-center mb-3">
								<img class="img-fluid"style="max-height: 275px; border: 3px solid #260045;" role="button" src="/static/assets/pacman/images/obsidian.png" id="pObsidian"/>
							</div>
							<div class="col-3 d-flex justify-content-center mb-3">
								<img class="img-fluid" style="max-height: 275px; border: 3px solid #260045;" role="button" src="/static/assets/pacman/images/autumn.png" id="pAutumn"/>
							</div>
							<div class="col-3 d-flex justify-content-center mb-3">
								<img class="img-fluid" style="max-height: 275px; border: 3px solid #260045;" role="button" src="/static/assets/pacman/images/garden.png" id="pGarden"/>
							</div>
							<div class="col-3 d-flex justify-content-center mb-3">
								<img class="img-fluid" style="max-height: 275px; border: 3px solid #260045;" role="button" src="/static/assets/pacman/images/spacial.png" id="pSpacial"/>
							</div>
						</div>
					</div>
				</div>
			</div>
		`;

		var btnObsidian = document.getElementById('pObsidian');
        var btnAutumn = document.getElementById('pAutumn');
		var btnGarden = document.getElementById('pGarden');
        var btnSpacial = document.getElementById('pSpacial');

		btnObsidian.addEventListener("click", (event) => this.selectTheme(event, "obsidian"));
		btnAutumn.addEventListener("click", (event) => this.selectTheme(event, "autumn"));
		btnGarden.addEventListener("click", (event) => this.selectTheme(event, "garden"));
		btnSpacial.addEventListener("click", (event) => this.selectTheme(event, "spacial"));
	}

	//#region EVENT LISTENERS HANDLERS

	selectPacmanSkin(event, skin) {
		this.toastBody.innerHTML = "Chosen pacman skin: " + skin;
		this.toastBootstrap.show();
		this.pacmanSkin = skin;
	}

	selectGhostSkin(event, skin) {
		this.toastBody.innerHTML = "Chosen ghost skin: " + skin;
		this.toastBootstrap.show();
		this.ghostSkin = skin;
	}

	selectMap(event, map) {
		this.toastBody.innerHTML = "Chosen map: " + map;
		this.toastBootstrap.show();
		this.mapName = map;
	}

	selectTheme(event, theme) {
		this.toastBody.innerHTML = "Chosen theme: " + theme;
		this.toastBootstrap.show();
		switch (theme) {
			case "obsidian":
				this.theme = {
					backgroundColor : 'rgb(10, 0, 20)', ghostWallColor1 : 'rgb(110, 55, 225)', ghostWallColor2 : 'rgb(75, 20, 200)',
					wallColor : 'rgb(60, 0, 120)', dotColor : 'rgb(105,55,165)', glowColor : 'rgb(145,85,210)'
				};
				break;
			case "autumn":
				this.theme = {
					backgroundColor : 'rgb(15, 0, 0)', ghostWallColor1 : 'rgb(138, 22, 1)', ghostWallColor2 : 'rgb(181, 32, 2)',
					wallColor : 'rgb(143, 34, 1)', dotColor : 'rgb(145, 67, 3)', glowColor : 'rgb(194, 90, 6)'
				};
				break;
			case "garden":
				this.theme = {
					backgroundColor : 'rgb(0, 8, 2)', ghostWallColor1 : 'rgb(38, 82, 0)', ghostWallColor2 : 'rgb(58, 125, 0)',
					wallColor : 'rgb(0, 54, 12)', dotColor : 'rgb(2, 56, 173)', glowColor : 'rgb(0, 66, 209)'
				};
				break;
			case "spacial":
				this.theme = {
					backgroundColor : 'rgb(1, 1, 26)', ghostWallColor1 : 'rgb(14, 58, 179)', ghostWallColor2 : 'rgb(18, 71, 219)',
					wallColor : 'rgb(0, 0, 176)', dotColor : 'rgb(145, 135, 19)', glowColor : 'rgb(186, 173, 20)'
				};
				break;
			default:
				break;
		}
	}

	changeKeybind(event, key, btn) {
		btn.innerHTML = "...";
		this.waitForKey = true;
		this.waitingKey = key;
	}

	keyDownSettings = (event) => {
		if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(event.code) > -1) {
			event.preventDefault();
		}
		if (this.waitForKey) {
			for (const key in this.keybinds) {
				if (this.keybinds[key] == event.code)
					this.keybinds[key] = "";
			}
			switch (this.waitingKey) {
				case "pUp":
					this.keybinds.pUp = event.code;
					break;
				case "pLeft":
					this.keybinds.pLeft = event.code;
					break;
				case "pDown":
					this.keybinds.pDown = event.code;
					break;
				case "pRight":
					this.keybinds.pRight = event.code;
					break;
				case "pSpell":
					this.keybinds.pSpell = event.code;
					break;
				case "gUp":
					this.keybinds.gUp = event.code;
					break;
				case "gLeft":
					this.keybinds.gLeft = event.code;
					break;
				case "gDown":
					this.keybinds.gDown = event.code;
					break;
				case "gRight":
					this.keybinds.gRight = event.code;
					break;
				case "gSpell":
					this.keybinds.gSpell = event.code;
					break;
				default:
					break;
			}
			this.showKeysConfig();
		}
	}

	//#endregion

}

