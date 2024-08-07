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
							<a class="text-white">` + this.keybinds.pUp + `</a>
						</div>
					</div>
					<div class="row justify-content-center text-center mt-1">
						<div class="col-3 d-flex justify-content-end">
							<p class="text-white">Move left</p>
						</div>
						<div class="col-3 d-flex justify-content-start">
							<a class="text-white">` + this.keybinds.pLeft + `</a>
						</div>
					</div>
					<div class="row justify-content-center text-center mt-1">
						<div class="col-3 d-flex justify-content-end">
							<p class="text-white">Move down</p>
						</div>
						<div class="col-3 d-flex justify-content-start">
							<a class="text-white">` + this.keybinds.pDown + `</a>
						</div>
					</div>
					<div class="row justify-content-center text-center mt-1">
						<div class="col-3 d-flex justify-content-end">
							<p class="text-white">Move right</p>
						</div>
						<div class="col-3 d-flex justify-content-start">
							<a class="text-white">` + this.keybinds.pRight + `</a>
						</div>
					</div>
					<div class="row justify-content-center text-center mt-1">
						<div class="col-3 d-flex justify-content-end">
							<p class="text-white">Use spell</p>
						</div>
						<div class="col-3 d-flex justify-content-start">
							<a class="text-white">` + this.keybinds.pSpell + `</a>
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
							<a class="text-white">` + this.keybinds.gUp + `</a>
						</div>
					</div>
					<div class="row justify-content-center text-center mt-1">
						<div class="col-3 d-flex justify-content-end">
							<p class="text-white">Move left</p>
						</div>
						<div class="col-3 d-flex justify-content-start">
							<a class="text-white">` + this.keybinds.gLeft + `</a>
						</div>
					</div>
					<div class="row justify-content-center text-center mt-1">
						<div class="col-3 d-flex justify-content-end">
							<p class="text-white">Move down</p>
						</div>
						<div class="col-3 d-flex justify-content-start">
							<a class="text-white">` + this.keybinds.gDown + `</a>
						</div>
					</div>
					<div class="row justify-content-center text-center mt-1">
						<div class="col-3 d-flex justify-content-end">
							<p class="text-white">Move right</p>
						</div>
						<div class="col-3 d-flex justify-content-start">
							<a class="text-white">` + this.keybinds.gRight + `</a>
						</div>
					</div>
					<div class="row justify-content-center text-center mt-1">
						<div class="col-3 d-flex justify-content-end">
							<p class="text-white">Use spell</p>
						</div>
						<div class="col-3 d-flex justify-content-start">
							<a class="text-white">` + this.keybinds.gSpell + `</a>
						</div>
					</div>
				</div>
			</div>
		`;

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
		console.log(event.code);
	}
}