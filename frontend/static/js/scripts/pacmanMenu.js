export let eventListeners = { }

export class PacmanMenu {
	constructor () {
		this.keysButton = document.getElementById('btnKeys');
        this.pSkinButton = document.getElementById('btnPSkin');
        this.gSkinButton = document.getElementById('btnGSkin');
        this.mapButton = document.getElementById('btnMap');
        this.colorButton = document.getElementById('btnColor');
        this.configContainer = document.getElementById('configContainer');

		this.boundKeyDownSettings = this.keyDownSettings.bind(this);

		this.waitForKey = false;
		this.waitingKey = "";

		this.keybinds = {
			pUp : 'KeyW', pLeft : 'KeyA', pDown : 'KeyS', pRight : 'KeyD', pSpell : 'KeyE',
			gUp : 'ArrowUp', gLeft : 'ArrowLeft', gDown : 'ArrowDown', gRight : 'ArrowRight', gSpell : 'Numpad0'
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
			window.location.href = "/pacman";
		});
	}

	showKeysConfig() {
		this.configContainer.innerHTML = `
			<div class="row justify-content-center">
				<div class="col-12 justify-content-center glass mt-3">
					<h2 class="text-white" id="keysTitle">Keys settings</h2>
					<div class="row justify-content-center text-center mt-3">
						<h3 class="text-white">Pacman keys</h3>
					</div>
					<div class="row justify-content-center text-center mt-1">
						<div class="col-3 d-flex justify-content-end">
							<p class="text-white">Move up</p>
						</div>
						<div class="col-3 d-flex justify-content-start">
							<a class="text-white" id="pUp">${this.keybinds.pUp !== "" ? this.keybinds.pUp : "none"}</a>
						</div>
					</div>
					<div class="row justify-content-center text-center mt-1">
						<div class="col-3 d-flex justify-content-end">
							<p class="text-white">Move left</p>
						</div>
						<div class="col-3 d-flex justify-content-start">
							<a class="text-white" id="pLeft">${this.keybinds.pLeft !== "" ? this.keybinds.pLeft : "none"}</a>
						</div>
					</div>
					<div class="row justify-content-center text-center mt-1">
						<div class="col-3 d-flex justify-content-end">
							<p class="text-white">Move down</p>
						</div>
						<div class="col-3 d-flex justify-content-start">
							<a class="text-white" id="pDown">${this.keybinds.pDown !== "" ? this.keybinds.pDown : "none"}</a>
						</div>
					</div>
					<div class="row justify-content-center text-center mt-1">
						<div class="col-3 d-flex justify-content-end">
							<p class="text-white">Move right</p>
						</div>
						<div class="col-3 d-flex justify-content-start">
							<a class="text-white" id="pRight">${this.keybinds.pRight !== "" ? this.keybinds.pRight : "none"}</a>
						</div>
					</div>
					<div class="row justify-content-center text-center mt-1">
						<div class="col-3 d-flex justify-content-end">
							<p class="text-white">Use spell</p>
						</div>
						<div class="col-3 d-flex justify-content-start">
							<a class="text-white" id="pSpell">${this.keybinds.pSpell !== "" ? this.keybinds.pSpell : "none"}</a>
						</div>
					</div>

					<div class="row justify-content-center text-center mt-3">
						<h3 class="text-white">Ghost keys</h3>
					</div>
					<div class="row justify-content-center text-center mt-1">
						<div class="col-3 d-flex justify-content-end">
							<p class="text-white">Move up</p>
						</div>
						<div class="col-3 d-flex justify-content-start">
							<a class="text-white" id="gUp">${this.keybinds.gUp !== "" ? this.keybinds.gUp : "none"}</a>
						</div>
					</div>
					<div class="row justify-content-center text-center mt-1">
						<div class="col-3 d-flex justify-content-end">
							<p class="text-white">Move left</p>
						</div>
						<div class="col-3 d-flex justify-content-start">
							<a class="text-white" id="gLeft">${this.keybinds.gLeft !== "" ? this.keybinds.gLeft : "none"}</a>
						</div>
					</div>
					<div class="row justify-content-center text-center mt-1">
						<div class="col-3 d-flex justify-content-end">
							<p class="text-white">Move down</p>
						</div>
						<div class="col-3 d-flex justify-content-start">
							<a class="text-white" id="gDown">${this.keybinds.gDown !== "" ? this.keybinds.gDown : "none"}</a>
						</div>
					</div>
					<div class="row justify-content-center text-center mt-1">
						<div class="col-3 d-flex justify-content-end">
							<p class="text-white">Move right</p>
						</div>
						<div class="col-3 d-flex justify-content-start">
							<a class="text-white" id="gRight">${this.keybinds.gRight !== "" ? this.keybinds.gRight : "none"}</a>
						</div>
					</div>
					<div class="row justify-content-center text-center mt-1">
						<div class="col-3 d-flex justify-content-end">
							<p class="text-white">Use spell</p>
						</div>
						<div class="col-3 d-flex justify-content-start">
							<a class="text-white" id="gSpell">${this.keybinds.gSpell !== "" ? this.keybinds.gSpell : "none"}</a>
						</div>
					</div>
				</div>
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
		btnPUp.addEventListener("click", (event) => this.changeKeybind(event, "pUp"));
		btnPLeft.addEventListener("click", (event) => this.changeKeybind(event, "pLeft"));
		btnPDown.addEventListener("click", (event) => this.changeKeybind(event, "pDown"));
		btnPRight.addEventListener("click", (event) => this.changeKeybind(event, "pRight"));
		btnPSpell.addEventListener("click", (event) => this.changeKeybind(event, "pSpell"));
		btnGUp.addEventListener("click", (event) => this.changeKeybind(event, "gUp"));
		btnGLeft.addEventListener("click", (event) => this.changeKeybind(event, "gLeft"));
		btnGDown.addEventListener("click", (event) => this.changeKeybind(event, "gDown"));
		btnGRight.addEventListener("click", (event) => this.changeKeybind(event, "gRight"));
		btnGSpell.addEventListener("click", (event) => this.changeKeybind(event, "gSpell"));
	}

	changeKeybind(event, key) {
		console.log(key);
		this.waitForKey = true;
		this.waitingKey = key;
	}

	showPacmanSkinConfig() {
		this.configContainer.innerHTML = `
			<h2 class="text-white" id="pacmanSkinTitle">Pacman skins</h2>
		`;
	}

	showGhostSkinConfig() {
		this.configContainer.innerHTML = `
			<h2 class="text-white" id="ghostSkinTitle">Ghost skins</h2>
		`;
	}

	showMapConfig() {
		this.configContainer.innerHTML = `
			<h2 class="text-white" id="mapsTitle">Maps</h2>
		`;
	}

	showColorSchemeConfig() {
		this.configContainer.innerHTML = `
			<h2 class="text-white" id="colorSchemeTitle">Color schemes</h2>
		`;
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
}