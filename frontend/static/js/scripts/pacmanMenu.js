// All close buttons were removed. The modal can be closed by clicking outside of it.
// Here is the button div just in case though:

// with an icon
{/* <div class="col-12 d-flex justify-content-center mt-4 mb-3">
	<button type="button" class="btn btn-lg text-white text-center d-flex align-items-center justify-content-center p-3" data-bs-dismiss="modal" aria-p="Close"><img src="static/assets/UI/icons/cross.svg" alt="close" id="close-button" width="16"></button>
</div> */}

// with text
{/* <div class="col-12 d-flex justify-content-center mt-1">
	<button type="button" class="btn btn-lg text-white" data-bs-dismiss="modal" aria-p="Close">Close</button>
</div> */}

import { updateTexts } from "../utils/languages.js";
import { updateTextForElem } from "../utils/languages.js";

export let eventListeners = { }

export class PacmanMenu {
	constructor () {
		this.keysButton = document.getElementById('btnKeys');
        this.pSkinButton = document.getElementById('btnPSkin');
        this.gSkinButton = document.getElementById('btnGSkin');
        this.gamemodeButton = document.getElementById('btnGamemode');
        this.mapButton = document.getElementById('btnMap');
        this.colorButton = document.getElementById('btnColor');
		this.settingsModal = new bootstrap.Modal(document.getElementById('settingsModal'));
		this.settingsModalContent = document.getElementById('settingsModalContent');
		this.pacmanUsernameLabel = document.getElementById('pacmanName');
		this.pacmanInput = document.getElementById('pacmanInput');
		this.ghostUsernameLabel = document.getElementById('ghostName');
		this.ghostInput = document.getElementById('ghostInput');

		this.imgCurrentPacSkin = document.getElementById('imgCurrentPacSkin');
		this.imgCurrentGhostSkin = document.getElementById('imgCurrentGhostSkin');

		this.toastNotification = document.getElementById('liveToast');
		this.toastBootstrap = bootstrap.Toast.getOrCreateInstance(this.toastNotification);
		this.toastBody = document.getElementById('toastBody');

		this.boundKeyDownSettings = this.keyDownSettings.bind(this);

		this.waitForKey = false;
		this.waitingKey = "";

		const usernamesString = localStorage.getItem('pacmanUsernames');
		this.usernames = usernamesString ? JSON.parse(usernamesString) : {
			pacman: "Player1", ghost: "Player2"
		};

		this.pacmanUsernameLabel.innerHTML = this.usernames.pacman;
		this.ghostUsernameLabel.innerHTML = this.usernames.ghost;

		const pacmanSkinString = localStorage.getItem('pacmanSkin');
		this.pacmanSkin = pacmanSkinString ? JSON.parse(pacmanSkinString) : "pacman";

		const ghostSkinString = localStorage.getItem('ghostSkin');
		this.ghostSkin = ghostSkinString ? JSON.parse(ghostSkinString) : "orangeGhost";

		const gamemodeString = localStorage.getItem('pacmanGamemode');
		this.gamemode = gamemodeString ? JSON.parse(gamemodeString) : "objective";

		const objectiveString = localStorage.getItem('objective');
		this.objective = objectiveString ? JSON.parse(objectiveString) : "10000";

		const mapNameString = localStorage.getItem('mapName');
		this.mapName = mapNameString ? JSON.parse(mapNameString) : "maze";

		const themeString = localStorage.getItem('pacmanTheme');
		this.theme = themeString ? JSON.parse(themeString) : { name: 'obsidian',
			backgroundColor : 'rgb(10, 0, 20)', ghostWallColor1 : 'rgb(110, 55, 225)', ghostWallColor2 : 'rgb(75, 20, 200)',
			wallColor : 'rgb(60, 0, 120)', dotColor : 'rgb(105,55,165)', glowColor : 'rgb(145,85,210)'
		};

		const keybindsString = localStorage.getItem('pacmanKeybinds');
		this.keybinds = keybindsString ? JSON.parse(keybindsString) : {
			pUp : 'KeyW', pLeft : 'KeyA', pDown : 'KeyS', pRight : 'KeyD', pSpell : 'KeyE',
			gUp : 'ArrowUp', gLeft : 'ArrowLeft', gDown : 'ArrowDown', gRight : 'ArrowRight', gSpell : 'Numpad0'
		};

		this.pacmanInput.addEventListener('keypress', (event) => this.pacmanPlayerInputHandle(event));
		this.pacmanInput.addEventListener('blur', (event) => this.pacmanPlayerInputHandle(event));
		this.ghostInput.addEventListener('keypress', (event) => this.ghostPlayerInputHandle(event));
		this.ghostInput.addEventListener('blur', (event) => this.ghostPlayerInputHandle(event));

		localStorage.setItem('pacmanSkin', JSON.stringify(this.pacmanSkin));
		localStorage.setItem('ghostSkin', JSON.stringify(this.ghostSkin));
		localStorage.setItem('pacmanGamemode', JSON.stringify(this.gamemode));
		localStorage.setItem('mapName', JSON.stringify(this.mapName));
		localStorage.setItem('pacmanKeybinds', JSON.stringify(this.keybinds));
		localStorage.setItem('pacmanTheme', JSON.stringify(this.theme));
		localStorage.setItem('themeName', this.theme.name);

		this.setPacmanSkinImage();
		this.setGhostSkinImage();
	}

	pacmanPlayerInputHandle(event) {
		if (((event.type == 'keypress' && event.key === 'Enter') || event.type == 'blur') && this.pacmanInput.value != "") {
			this.usernames.pacman = this.pacmanInput.value;
			this.pacmanInput.value = ""; // Clear the input box
			this.pacmanUsernameLabel.innerHTML = this.usernames.pacman;

			this.toastBody.innerHTML = "Changed Pacman username to: " + this.usernames.pacman;
			this.toastBootstrap.show();

			localStorage.setItem('pacmanUsernames', JSON.stringify(this.usernames))
		}
	}

	ghostPlayerInputHandle(event) {
		if (((event.type == 'keypress' && event.key === 'Enter') || event.type == 'blur') && this.ghostInput.value != "") {
			this.usernames.ghost = this.ghostInput.value;
			this.ghostInput.value = ""; // Clear the input box
			this.ghostUsernameLabel.innerHTML = this.usernames.ghost;

			this.toastBody.innerHTML = "Changed Ghost username to: " + this.usernames.ghost;
			this.toastBootstrap.show();

			localStorage.setItem('pacmanUsernames', JSON.stringify(this.usernames))
		}
	}

	Initialize() {
		// Add Event Listener to the Start Button
		this.keysButton.addEventListener("click", () => this.showKeysConfig());
		this.pSkinButton.addEventListener("click", () => this.showPacmanSkinConfig());
		this.gSkinButton.addEventListener("click", () => this.showGhostSkinConfig());
		this.gamemodeButton.addEventListener("click", () => this.showGamemodeConfig());
		this.mapButton.addEventListener("click", () => this.showMapConfig());
		this.colorButton.addEventListener("click", () => this.showColorSchemeConfig());

		document.addEventListener("keydown", this.boundKeyDownSettings);
		eventListeners["keydown"] = this.boundKeyDownSettings;
	}

	showKeysConfig() {
		this.settingsModalContent.innerHTML = `
			<div class="row justify-content-center">
				<div class="modal-header">
					<h2 class="modal-title text-white w-100 text-center" data-translate="keybinds-settings">keybinds settings</h2>
				</div>
				<div class="modal-body">
					<div class="col-12 d-flex justify-content-center">
						<div class="col-6">
							<div class="row justify-content-center text-center mt-2">
								<p class="h2 text-white" data-translate="pacman-keys">left paddle</p>
							</div>
							<div class="row justify-content-center text-center mt-2">
								<div class="col-6 d-flex justify-content-end">
									<p class="text-white" style="padding: 3px 0px;" data-translate="move-up">move up</p>
								</div>
								<div class="col-6 d-flex justify-content-start">
									<p role="button" tabindex="0" class="text-white clickable" style="border: 1px solid white; padding: 1px 5px; border-radius: 5px;" id="pUp">${this.keybinds.pUp !== "" ? this.keybinds.pUp : "none"}</p>
								</div>
							</div>
							<div class="row justify-content-center text-center">
								<div class="col-6 d-flex justify-content-end">
									<p class="text-white" style="padding: 3px 0px;" data-translate="move-left">move left</p>
								</div>
								<div class="col-6 d-flex justify-content-start">
									<p role="button" tabindex="0" class="text-white clickable" style="border: 1px solid white; padding: 1px 5px; border-radius: 5px;" id="pLeft">${this.keybinds.pLeft !== "" ? this.keybinds.pLeft : "none"}</p>
								</div>
							</div>
							<div class="row justify-content-center text-center">
								<div class="col-6 d-flex justify-content-end">
									<p class="text-white" style="padding: 3px 0px;" data-translate="move-down">move down</p>
								</div>
								<div class="col-6 d-flex justify-content-start">
									<p role="button" tabindex="0" class="text-white clickable" style="border: 1px solid white; padding: 1px 5px; border-radius: 5px;" id="pDown">${this.keybinds.pDown !== "" ? this.keybinds.pDown : "none"}</p>
								</div>
							</div>
							<div class="row justify-content-center text-center">
								<div class="col-6 d-flex justify-content-end">
									<p class="text-white" style="padding: 3px 0px;" data-translate="move-right">move right</p>
								</div>
								<div class="col-6 d-flex justify-content-start">
									<p role="button" tabindex="0" class="text-white clickable" style="border: 1px solid white; padding: 1px 5px; border-radius: 5px;" id="pRight">${this.keybinds.pRight !== "" ? this.keybinds.pRight : "none"}</p>
								</div>
							</div>
							<div class="row justify-content-center text-center">
								<div class="col-6 d-flex justify-content-end">
									<p class="text-white" style="padding: 3px 0px;" data-translate="use-spell">use spell</p>
								</div>
								<div class="col-6 d-flex justify-content-start">
									<p role="button" tabindex="0" class="text-white clickable" style="border: 1px solid white; padding: 1px 5px; border-radius: 5px;" id="pSpell">${this.keybinds.pSpell !== "" ? this.keybinds.pSpell : "none"}</p>
								</div>
							</div>
						</div>
						<div class="col-6">
							<div class="row justify-content-center text-center mt-2">
								<p class="h2 text-white" data-translate="ghost-keys">ghost</p>
							</div>
							<div class="row justify-content-center text-center mt-2">
								<div class="col-6 d-flex justify-content-end">
									<p class="text-white" style="padding: 3px 0px;" data-translate="move-up">move up</p>
								</div>
								<div class="col-6 d-flex justify-content-start">
									<p role="button" tabindex="0" class="text-white clickable" style="border: 1px solid white; padding: 1px 5px; border-radius: 5px;" id="gUp">${this.keybinds.gUp !== "" ? this.keybinds.gUp : "none"}</p>
								</div>
							</div>
							<div class="row justify-content-center text-center">
								<div class="col-6 d-flex justify-content-end">
									<p class="text-white" style="padding: 3px 0px;" data-translate="move-left">move left</p>
								</div>
								<div class="col-6 d-flex justify-content-start">
									<p role="button" tabindex="0" class="text-white clickable" style="border: 1px solid white; padding: 1px 5px; border-radius: 5px;" id="gLeft">${this.keybinds.gLeft !== "" ? this.keybinds.gLeft : "none"}</p>
								</div>
							</div>
							<div class="row justify-content-center text-center">
								<div class="col-6 d-flex justify-content-end">
									<p class="text-white" style="padding: 3px 0px;" data-translate="move-down">move down</p>
								</div>
								<div class="col-6 d-flex justify-content-start">
									<p role="button" tabindex="0" class="text-white clickable" style="border: 1px solid white; padding: 1px 5px; border-radius: 5px;" id="gDown">${this.keybinds.gDown !== "" ? this.keybinds.gDown : "none"}</p>
								</div>
							</div>
							<div class="row justify-content-center text-center">
								<div class="col-6 d-flex justify-content-end">
									<p class="text-white" style="padding: 3px 0px;" data-translate="move-right">move right</p>
								</div>
								<div class="col-6 d-flex justify-content-start">
									<p role="button" tabindex="0" class="text-white clickable" style="border: 1px solid white; padding: 1px 5px; border-radius: 5px;" id="gRight">${this.keybinds.gRight !== "" ? this.keybinds.gRight : "none"}</p>
								</div>
							</div>
							<div class="row justify-content-center text-center">
								<div class="col-6 d-flex justify-content-end">
									<p class="text-white" style="padding: 3px 0px;" data-translate="use-spell">use spell</p>
								</div>
								<div class="col-6 d-flex justify-content-start">
									<p role="button" tabindex="0" class="text-white clickable" style="border: 1px solid white; padding: 1px 5px; border-radius: 5px;" id="gSpell">${this.keybinds.gSpell !== "" ? this.keybinds.gSpell : "none"}</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		`;

		let btnPUp = document.getElementById('pUp');
        let btnPLeft = document.getElementById('pLeft');
		let btnPDown = document.getElementById('pDown');
		let btnPRight = document.getElementById('pRight');
		let btnPSpell = document.getElementById('pSpell');
		let btnGUp = document.getElementById('gUp');
        let btnGLeft = document.getElementById('gLeft');
		let btnGDown = document.getElementById('gDown');
		let btnGRight = document.getElementById('gRight');
		let btnGSpell = document.getElementById('gSpell');

		const addEventListeners = (button, action) => {
			button.addEventListener("click", (event) => this.changeKeybind(event, action, button));
			button.addEventListener("keydown", (event) => {
				if (event.key === "Enter") {
					// wait for the next key press using settimeout
					setTimeout(() => {
						this.changeKeybind(event, action, button);
					}, 100);
				}
			});
		}
		
		addEventListeners(btnPUp, "pUp");
		addEventListeners(btnPLeft, "pLeft");
		addEventListeners(btnPDown, "pDown");
		addEventListeners(btnPRight, "pRight");
		addEventListeners(btnPSpell, "pSpell");
		addEventListeners(btnGUp, "gUp");
		addEventListeners(btnGLeft, "gLeft");
		addEventListeners(btnGDown, "gDown");
		addEventListeners(btnGRight, "gRight");
		addEventListeners(btnGSpell, "gSpell");

		this.settingsModal.show();
		updateTexts();
	}

	showPacmanSkinConfig() {
		this.settingsModalContent.innerHTML = `
			<div class="modal-header">
				<h2 class="modal-title text-white w-100 text-center" data-translate="pacman-skin">pacman skins</h2>
			</div>
			<div class="modal-body">
				<div class="modal-body">
				 <div class="row justify-content-center mt-2 mb-1">
					<div class="col-10 d-flex justify-content-center">
						<div class="d-flex justify-content-between w-100">
							<img class="clickable" role="button" tabindex="0" width="64px" id="pPacmanSkin" style="border: 1px solid white; padding: 5px; border-radius: 5px;" src="/static/assets/pacman/images/pacman_high_res.png" alt="An image of pac-man.">
							<img class="clickable" role="button" tabindex="0" width="64px" id="pPacWomanSkin" style="border: 1px solid white; padding: 5px; border-radius: 5px;" src="/static/assets/pacman/images/pacgirl_high_res.png" alt="An image of pac-girl.">
							<img class="clickable" role="button" tabindex="0" width="64px" id="pPacMIBSkin" style="border: 1px solid white; padding: 5px; border-radius: 5px;" src="/static/assets/pacman/images/pacMIB_high_res.png" alt="An image of Pac-Man-In-Black.">
							<img class="clickable" role="button" tabindex="0" width="64px" id="pPacventurerSkin" style="border: 1px solid white; padding: 5px; border-radius: 5px;" src="/static/assets/pacman/images/pacventurer_high_res.png" alt="An image of pac-venturer.">
						</div>
					</div>
				</div>
				<div class="row justify-content-center"> 
					<div class="col-10 mt-3">
						<div class="col-12 mb-1">
							<p class="h5 text-left text-white fw-bold" id="pacmanTitle1" style="display: inline; vertical-align: middle;">Title</p>
							<img src="/static/assets/UI/icons/time.svg" style="width: 22px; margin-left:5px;  margin-right: -8px; vertical-align: middle;" alt="Clock Icon"/>
							<p id="cooldown" class="h5 text-white" style="display: inline; vertical-align: middle;">00:00</p>
						</div>
						<p class="text-white text-left lh-sm" id="pacmanDesc1" style="min-height: 3em; line-height: 1;">Description 1</p>
						<p class="h5 text-white text-left fw-bold mb-1 mt-1" id="pacmanTitle2">Title 2</p>
						<p class="text-white text-left lh-sm" style="min-height: 3em; line-height: 1;" id="pacmanDesc2">Description 2</p>
					</div>
				</div>
			</div>
		`;

		let btnPacmanSkin = document.getElementById('pPacmanSkin');
        let btnPacWomanSkin = document.getElementById('pPacWomanSkin');
		let btnPacMIBSkin = document.getElementById('pPacMIBSkin');
        let btnPacventurerSkin = document.getElementById('pPacventurerSkin');
		let cooldown = document.getElementById('cooldown');
		let pacmanTitle1 = document.getElementById('pacmanTitle1');
		let pacmanDesc1 = document.getElementById('pacmanDesc1');
		let pacmanTitle2 = document.getElementById('pacmanTitle2');
		let pacmanDesc2 = document.getElementById('pacmanDesc2');

		this.addEventListeners(btnPacmanSkin, (event) => this.selectPacmanSkin(event, "pacman"));
		this.addEventListeners(btnPacWomanSkin, (event) => this.selectPacmanSkin(event, "pacgirl"));
		this.addEventListeners(btnPacMIBSkin, (event) => this.selectPacmanSkin(event, "pacMIB"));
		this.addEventListeners(btnPacventurerSkin, (event) => this.selectPacmanSkin(event, "pacventurer"));

		switch (this.pacmanSkin) {
			case "pacman":
				pacmanTitle1.innerHTML = "passive: gluttony";
				cooldown.innerHTML = "20";
				pacmanDesc1.innerHTML = "When eating a fruit, Pac-Man goes into a frenzy for 5 seconds.";
				pacmanTitle2.innerHTML = "effect: frenzy";
				pacmanDesc2.innerHTML = "Pac-Man moves 20% faster and can eat the Ghost. Eating the Ghost disables it for 5 seconds and grants 300 points.";
				break;
			case "pacgirl":
				pacmanTitle1.innerHTML = "active: speed boost";
				cooldown.innerHTML = "25";
				pacmanDesc1.innerHTML = "Pac-Woman can boost her speed by 20% for 10 seconds.";
				pacmanTitle2.innerHTML = "passive: fruit lover";
				pacmanDesc2.innerHTML = "Pac-Woman loves fruits and gains 5% stacking movespeed after eating one.";
				break;
			case "pacMIB":
				pacmanTitle1.innerHTML = "active: flash";
				cooldown.innerHTML = "20";
				pacmanDesc1.innerHTML = "Pac-Man-In-Black flashes the Ghost, disabling it for 3 seconds.";
				pacmanTitle2.innerHTML = "passive: warp master";
				pacmanDesc2.innerHTML = "Pac-Man-In-Black is used to teleporting, he gains 20% move speed for 5 seconds after warping.";
				break;
			case "pacventurer":
				pacmanTitle1.innerHTML = "active: grappling hook";
				cooldown.innerHTML = "20";
				pacmanDesc1.innerHTML = "Using his favorite grappling hook, Pacventurer propels himself in a straight line until he hits a wall.";
				pacmanTitle2.innerHTML = "passive: exploration";
				pacmanDesc2.innerHTML = "Pacventurer moves 10% faster and gains 10% more points.";
				break;
		}

		const pacmanSkins = {
			pacman: btnPacmanSkin,
			pacgirl: btnPacWomanSkin,
			pacMIB: btnPacMIBSkin,
			pacventurer: btnPacventurerSkin
		}
		this.applySelectedSetting("pacmanSkin", pacmanSkins);

		this.settingsModal.show();

		updateTexts();
	}

	showGhostSkinConfig() {
		this.settingsModalContent.innerHTML = `
			<div class="modal-header">
				<h2 class="modal-title text-white w-100 text-center" data-translate="ghost-skin">ghost skins</h2>
			</div>
			<div class="modal-body">
				 <div class="row justify-content-center mt-2 mb-1">
					<div class="col-10 d-flex justify-content-center">
							<div class="d-flex justify-content-between w-100">
							<img class="clickable" role="button" tabindex="0" width="64px" id="pBlueGhostSkin" style="border: 1px solid white; padding: 5px; border-radius: 5px;" src="/static/assets/pacman/images/blueGhost_high_res.png" alt="An image of a blue ghost.">
							<img class="clickable" role="button" tabindex="0" width="64px" id="pOrangeGhostSkin" style="border: 1px solid white; padding: 5px; border-radius: 5px;" src="/static/assets/pacman/images/orangeGhost_high_res.png" alt="An image of an orange ghost.">
							<img class="clickable" role="button" tabindex="0" width="64px" id="pPinkGhostSkin" style="border: 1px solid white; padding: 5px; border-radius: 5px;" src="/static/assets/pacman/images/pinkGhost_high_res.png" alt="An image of a pink ghost.">
							<img class="clickable" role="button" tabindex="0" width="64px" id="pGreenGhostSkin" style="border: 1px solid white; padding: 5px; border-radius: 5px;" src="/static/assets/pacman/images/greenGhost_high_res.png" alt="An image of a green ghost.">
						</div>
					</div>
				</div>
				<div class="row justify-content-center"> 
					<div class="col-10 mt-3">
						<div class="col-12 mb-1">
							<p class="h5 text-left text-white fw-bold" id="ghostTitle1" style="display: inline; vertical-align: middle;">Title</p>
							<img src="/static/assets/UI/icons/time.svg" style="width: 22px; margin-left:5px;  margin-right: -8px; vertical-align: middle;" alt="Clock Icon"/>
							<p id="cooldown" class="h5 text-white" style="display: inline; vertical-align: middle;">00:00</p>
						</div>
						<p class="text-white text-left lh-sm" id="ghostDesc1" style="min-height: 3em; line-height: auto;">Description 1</p>
						<p class="h5 text-white text-left fw-bold mb-1" id="ghostTitle2">Title 2</p>
						<p class="text-white text-left lh-sm" style="min-height: 3em; line-height: auto;" id="ghostDesc2">Description 2</p>
					</div>
				</div>
			</div>
		`;

		let btnBlueSkin = document.getElementById('pBlueGhostSkin');
        let btnOrangeSkin = document.getElementById('pOrangeGhostSkin');
		let btnPinkSkin = document.getElementById('pPinkGhostSkin');
        let btnGreenSkin = document.getElementById('pGreenGhostSkin');
		let cooldown = document.getElementById('cooldown');
		let ghostTitle1 = document.getElementById('ghostTitle1');
		let ghostDesc1 = document.getElementById('ghostDesc1');
		let ghostTitle2 = document.getElementById('ghostTitle2');
		let ghostDesc2 = document.getElementById('ghostDesc2');

		this.addEventListeners(btnBlueSkin, (event) => this.selectGhostSkin(event, "blueGhost"));
		this.addEventListeners(btnOrangeSkin, (event) => this.selectGhostSkin(event, "orangeGhost"));
		this.addEventListeners(btnPinkSkin, (event) => this.selectGhostSkin(event, "pinkGhost"));
		this.addEventListeners(btnGreenSkin, (event) => this.selectGhostSkin(event, "greenGhost"));

		switch (this.ghostSkin) {
			case "blueGhost":
				ghostTitle1.innerHTML = "active: ghost block";
				cooldown.innerHTML = "5";
				ghostDesc1.innerHTML = "The blue ghost places the ghost block which pacman can't go through but the ghost can.";
				ghostTitle2.innerHTML = "passive: speedy"
				ghostDesc2.innerHTML = "The blue ghost has 10% bonus movespeed.";
				break;
			case "orangeGhost":
				ghostTitle1.innerHTML = "active: excavate";
				cooldown.innerHTML = "20";
				ghostDesc1.innerHTML = "The orange ghost turns the wall in front of him into a ghost block, creating paths that pacman can't use.";
				ghostTitle2.innerHTML = "passive: ghostly"
				ghostDesc2.innerHTML = "The orange ghost has double movespeed while on ghost block.";
				break;
			case "pinkGhost":
				ghostTitle1.innerHTML = "active: intangible";
				cooldown.innerHTML = "25";
				ghostDesc1.innerHTML = "The pink ghost becomes intangible for 3 seconds. He gets brought back on the last ground tile it crossed when the spell ends.";
				ghostTitle2.innerHTML = "effect: intangible"
				ghostDesc2.innerHTML = "The pink ghost gains 10% movespeed and can go through walls.";
				break;
			case "greenGhost":
				ghostTitle1.innerHTML = "active: blockade";
				cooldown.innerHTML = "25";
				ghostDesc1.innerHTML = "The green ghost creates a wall behind him.";
				ghostTitle2.innerHTML = "passive: destructor";
				ghostDesc2.innerHTML = "When facing a wall for 5 seconds, the green ghost will break it. Useful when blocked.";
				break;
		}

		// Get element that is selected from the local storage and apply the border
		const ghostSkins = {
			blueGhost: btnBlueSkin,
			orangeGhost: btnOrangeSkin,
			pinkGhost: btnPinkSkin,
			greenGhost: btnGreenSkin
		}
		this.applySelectedSetting("ghostSkin", ghostSkins);

		this.settingsModal.show();

		updateTexts();
	}

	showGamemodeConfig() {
		this.settingsModalContent.innerHTML = `
			<div class="modal-header">
				<h2 class="modal-title text-white w-100 text-center" data-translate="gamemode">gamemodes</h2>
			</div>
			<div class="modal-body">
				<div class="col-auto mr-2 ml-3">
					<div class="row justify-content-center text-center mt-2 mb-1">
						<div class="col-4 d-flex justify-content-center">
							<button role="button" class="btn btn-lg text-light" id="btnObjective" data-translate="objective">objective</button>
						</div>
						<div class="col-4 d-flex justify-content-center">
							<button role="button" class="btn btn-lg text-white" id="btnInfinite" data-translate="endless">endless</button>
						</div>
						<div class="col-10 mt-4 mb-3">
							<p class="text-white" id="gamemodeDescription"></p>
						</div>
						<div id="rangeContainer">
						</div>
					</div>
				</div>
			</div>
		`;


        let btnObjective = document.getElementById('btnObjective');
		let btnInfinite = document.getElementById('btnInfinite');
		let pDescription = document.getElementById('gamemodeDescription');
		let rangeContainer = document.getElementById('rangeContainer');

		btnObjective.addEventListener("click", (event) => this.selectGamemode(event, "objective"));
		btnInfinite.addEventListener("click", (event) => this.selectGamemode(event, "infinite"));

		switch (this.gamemode) {
			case "objective":
				btnObjective.disabled = true;
				btnInfinite.disabled = false;
				pDescription.innerHTML = "the game ends once Pacman's score reaches the objective or the Ghost catches Pacman.";
				updateTextForElem(pDescription, "objective-description");
				rangeContainer.innerHTML = `
					<div class="col-12 d-flex justify-content-center align-items-center mb-2">
						<p for="rangeInput" class="text-white h5 mb-0" id="rangeLabel" style="margin-right: 10px;">Label</p>
						<input type="range" class="form-range clickable" style="width: 70%;" min="1000" max="30000" step="1000" id="rangeInput">
					</div>
				`;
				let rangeInput = document.getElementById('rangeInput');
				let rangeLabel = document.getElementById('rangeLabel');

				rangeLabel.innerHTML = this.objective;
				rangeInput.value = this.objective;
				localStorage.setItem('objective', JSON.stringify(this.objective));

				rangeInput.addEventListener('input', (event) => {
					rangeLabel.textContent = event.target.value;
					this.objective = event.target.value;
					localStorage.setItem('objective', JSON.stringify(this.objective));
				});

				break;
			case "infinite":
				btnObjective.disabled = false;
				btnInfinite.disabled = true;
				pDescription.innerHTML = "the game ends once the Ghost catches Pacman.";
				updateTextForElem(pDescription, "endless-description");
				break;
			default:
				break;
		}

		this.settingsModal.show();

		updateTexts();
	}

	showMapConfig() {
		this.settingsModalContent.innerHTML = `
			<div class="modal-header">
				<h2 class="modal-title text-white w-100 text-center" data-translate="map">maps</h2>
			</div>
			<div class="modal-body p-5 pt-4 pb-5">
				<div class="col-auto mr-2 ml-2">
					<div class="row justify-content-center text-center">
						<div class="col-4 d-flex flex-column align-items-center">
							<p class="h4 text-white mb-2">maze</p>
							<img class="img-fluid clickable" style="max-height: 275px; border: 1px solid white; padding: 5px; border-radius: 5px;" role="button" src="/static/assets/pacman/images/maze.png" id="pMaze" alt="A map that has the form of a maze." tabindex="0"/>
						</div>
						<div class="col-4 d-flex flex-column align-items-center">
							<p class="h4 text-white mb-2">spiral</p>
							<img class="img-fluid clickable" style="max-height: 275px; border: 1px solid white; padding: 5px; border-radius: 5px;" role="button" src="/static/assets/pacman/images/spiral.png" id="pSpiral" alt="A map that has the form of a spiral." tabindex="0"/>
						</div>
						<div class="col-4 d-flex flex-column align-items-center">
								<p class="h4 text-white mb-2">butterfly</p>
							<img class="img-fluid clickable" style="max-height: 275px; border: 1px solid white; padding: 5px; border-radius: 5px;" role="button" src="/static/assets/pacman/images/butterfly.png" id="pButterfly" alt="A map that has the form of a butterfly." tabindex="0"/>
						</div>
					</div>
				</div>
			</div>
		`;

		let btnMaze = document.getElementById('pMaze');
        let btnSpiral = document.getElementById('pSpiral');
		let btnButterfly = document.getElementById('pButterfly');

		this.addEventListeners(btnMaze, (event) => this.selectMap(event, "maze"));
		this.addEventListeners(btnSpiral, (event) => this.selectMap(event, "spiral"));
		this.addEventListeners(btnButterfly, (event) => this.selectMap(event, "butterfly"));

		const maps = {
			maze: btnMaze,
			spiral: btnSpiral,
			butterfly: btnButterfly
		}
		this.applySelectedSetting("mapName", maps);

		this.settingsModal.show();

		updateTexts();
	}

	showColorSchemeConfig() {
		this.settingsModalContent.innerHTML = `
			<div class="modal-header">
				<h2 class="modal-title text-white w-100 text-center" data-translate="theme">themes</h2>
			</div>
			<div class="modal-body">
				<div class="col-12 justify-content-center">
					<div class="row justify-content-center text-center mt-2 mb-3">
						<div class="row justify-content-center text-center">
							<div class="col-3 d-flex flex-column align-items-center">
								<p class="h4 text-white">obsidian</p>
								<img class="img-fluid clickable" style="max-height: 275px; border: 1px solid white; padding: 5px; border-radius: 5px;" role="button" src="/static/assets/pacman/images/obsidian.png" id="pObsidian" alt="A map that has the color of obsidian." tabindex="0"/>
							</div>
							<div class="col-3 d-flex flex-column align-items-center">
								<p class="h4 text-white">autumn</p>
								<img class="img-fluid clickable" style="max-height: 275px; border: 1px solid white; padding: 5px; border-radius: 5px;" role="button" src="/static/assets/pacman/images/autumn.png" id="pAutumn" alt="A map that has the color of autumn." tabindex="0"/>
							</div>
							<div class="col-3 d-flex flex-column align-items-center">
								<p class="h4 text-white">garden</p>
								<img class="img-fluid clickable" style="max-height: 275px; border: 1px solid white; padding: 5px; border-radius: 5px;" role="button" src="/static/assets/pacman/images/garden.png" id="pGarden" alt="A map that has the color of a garden." tabindex="0"/>
							</div>
							<div class="col-3 d-flex flex-column align-items-center">
								<p class="h4 text-white">retro</p>
								<img class="img-fluid clickable" style="max-height: 275px; border: 1px solid white; padding: 5px; border-radius: 5px;" role="button" src="/static/assets/pacman/images/spacial.png" id="pSpacial" alt="A map that has the color of the retro pac-man." tabindex="0"/>
							</div>
						</div>
					</div>
				</div>
			</div>
		`;

		let btnObsidian = document.getElementById('pObsidian');
        let btnAutumn = document.getElementById('pAutumn');
		let btnGarden = document.getElementById('pGarden');
        let btnSpacial = document.getElementById('pSpacial');

		this.addEventListeners(btnObsidian, (event) => this.selectTheme(event, "obsidian"));
		this.addEventListeners(btnAutumn, (event) => this.selectTheme(event, "autumn"));
		this.addEventListeners(btnGarden, (event) => this.selectTheme(event, "garden"));
		this.addEventListeners(btnSpacial, (event) => this.selectTheme(event, "spacial"));

		const themes = {
			obsidian: btnObsidian,
			autumn: btnAutumn,
			garden: btnGarden,
			spacial: btnSpacial
		}
		this.applySelectedSetting("themeName", themes);

		this.settingsModal.show();

		updateTexts();
	}

	//#region EVENT LISTENERS HANDLERS

	selectPacmanSkin(event, skin) {
		this.toastBody.innerHTML = "chosen pacman character: " + skin;
		this.toastBootstrap.show();
		this.pacmanSkin = skin;
		localStorage.setItem('pacmanSkin', JSON.stringify(this.pacmanSkin));

		const pacmanSkins = {
			pacman: document.getElementById('pPacmanSkin'),
			pacgirl: document.getElementById('pPacWomanSkin'),
			pacMIB: document.getElementById('pPacMIBSkin'),
			pacventurer: document.getElementById('pPacventurerSkin')
		}
		this.applySelectedSetting("pacmanSkin", pacmanSkins);
		this.setPacmanSkinImage();
		this.showPacmanSkinConfig();
	}

	selectGhostSkin(event, skin) {
		this.toastBody.innerHTML = "chosen ghost character: " + skin;
		this.toastBootstrap.show();
		this.ghostSkin = skin;
		localStorage.setItem('ghostSkin', JSON.stringify(this.ghostSkin));

		// Get element that is selected from the local storage and apply the border
		const ghostSkins = {
			blueGhost: document.getElementById('pBlueGhostSkin'),
			orangeGhost: document.getElementById('pOrangeGhostSkin'),
			pinkGhost: document.getElementById('pPinkGhostSkin'),
			greenGhost: document.getElementById('pGreenGhostSkin')
		}
		this.applySelectedSetting("ghostSkin", ghostSkins);
		this.setGhostSkinImage();
		this.showGhostSkinConfig();
	}

	setPacmanSkinImage() {
		this.imgCurrentPacSkin.src = "/static/assets/pacman/images/" + this.pacmanSkin + "_high_res.png";
	}

	setGhostSkinImage() {
		this.imgCurrentGhostSkin.src = "/static/assets/pacman/images/" + this.ghostSkin + "_high_res.png";
	}

	selectGamemode(event, gamemode) {
		this.toastBody.innerHTML = "chosen gamemode: " + gamemode;
		this.toastBootstrap.show();
		this.gamemode = gamemode;
		localStorage.setItem('pacmanGamemode', JSON.stringify(this.gamemode));

		this.showGamemodeConfig();
	}

	selectMap(event, map) {
		this.toastBody.innerHTML = "chosen map: " + map;
		this.toastBootstrap.show();
		this.mapName = map;

		localStorage.setItem('mapName', JSON.stringify(this.mapName));

		const maps = {
			maze: document.getElementById('pMaze'),
			spiral: document.getElementById('pSpiral'),
			butterfly: document.getElementById('pButterfly')
		}
		this.applySelectedSetting("mapName", maps);
	}

	selectTheme(event, theme) {
		this.toastBody.innerHTML = "chosen theme: " + theme;
		this.toastBootstrap.show();
		switch (theme) {
			case "obsidian":
				this.theme = { name: 'obsidian',
					backgroundColor : 'rgb(10, 0, 20)', ghostWallColor1 : 'rgb(110, 55, 225)', ghostWallColor2 : 'rgb(75, 20, 200)',
					wallColor : 'rgb(60, 0, 120)', dotColor : 'rgb(105,55,165)', glowColor : 'rgb(145,85,210)'
				};
				break;
			case "autumn":
				this.theme = { name: 'autumn',
					backgroundColor : 'rgb(15, 0, 0)', ghostWallColor1 : 'rgb(138, 22, 1)', ghostWallColor2 : 'rgb(181, 32, 2)',
					wallColor : 'rgb(143, 34, 1)', dotColor : 'rgb(145, 67, 3)', glowColor : 'rgb(194, 90, 6)'
				};
				break;
			case "garden":
				this.theme = { name: 'garden',
					backgroundColor : 'rgb(0, 8, 2)', ghostWallColor1 : 'rgb(38, 82, 0)', ghostWallColor2 : 'rgb(58, 125, 0)',
					wallColor : 'rgb(0, 54, 12)', dotColor : 'rgb(2, 56, 173)', glowColor : 'rgb(0, 66, 209)'
				};
				break;
			case "spacial":
				this.theme = { name: 'spacial',
					backgroundColor : 'rgb(1, 1, 26)', ghostWallColor1 : 'rgb(14, 58, 179)', ghostWallColor2 : 'rgb(18, 71, 219)',
					wallColor : 'rgb(0, 0, 176)', dotColor : 'rgb(145, 135, 19)', glowColor : 'rgb(186, 173, 20)'
				};
				break;
			default:
				break;
		}

		localStorage.setItem('pacmanTheme', JSON.stringify(this.theme));
		localStorage.setItem('themeName', theme);

		const themes = {
			obsidian: document.getElementById('pObsidian'),
			autumn: document.getElementById('pAutumn'),
			garden: document.getElementById('pGarden'),
			spacial: document.getElementById('pSpacial')
		}
		this.applySelectedSetting("themeName", themes);
	}

	changeKeybind(event, key, btn) {
		btn.innerHTML = "...";
		this.waitForKey = true;
		this.waitingKey = key;
	}

	keyDownSettings = (event) => {
		if(["Space","ArrowUp","ArrowDown"].indexOf(event.code) > -1) {
			event.preventDefault();
		}
		if (this.waitForKey) {
			for (const key in this.keybinds) {
				if (this.keybinds[key] == event.code)
					this.keybinds[key] = "";
			}
			switch (this.waitingKey) {
				case "pUp":
					this.toastBody.innerHTML = "changed pacman move up keybind to: " + event.code;
					this.keybinds.pUp = event.code;
					break;
				case "pLeft":
					this.toastBody.innerHTML = "changed pacman move left keybind to: " + event.code;
					this.keybinds.pLeft = event.code;
					break;
				case "pDown":
					this.toastBody.innerHTML = "changed pacman move down keybind to: " + event.code;
					this.keybinds.pDown = event.code;
					break;
				case "pRight":
					this.toastBody.innerHTML = "changed pacman move right keybind to: " + event.code;
					this.keybinds.pRight = event.code;
					break;
				case "pSpell":
					this.toastBody.innerHTML = "changed pacman spell keybind to: " + event.code;
					this.keybinds.pSpell = event.code;
					break;
				case "gUp":
					this.toastBody.innerHTML = "changed ghost move up keybind to: " + event.code;
					this.keybinds.gUp = event.code;
					break;
				case "gLeft":
					this.toastBody.innerHTML = "changed ghost move left keybind to: " + event.code;
					this.keybinds.gLeft = event.code;
					break;
				case "gDown":
					this.toastBody.innerHTML = "changed ghost move down keybind to: " + event.code;
					this.keybinds.gDown = event.code;
					break;
				case "gRight":
					this.toastBody.innerHTML = "changed ghost move right keybind to: " + event.code;
					this.keybinds.gRight = event.code;
					break;
				case "gSpell":
					this.toastBody.innerHTML = "changed ghost spell keybind to: " + event.code;
					this.keybinds.gSpell = event.code;
					break;
				default:
					return ;
			}
			this.waitForKey = false;
			this.toastBootstrap.show();
			localStorage.setItem('pacmanKeybinds', JSON.stringify(this.keybinds));
			this.showKeysConfig();
		}
	}

	// Add the "selected" class to to correct element based on the setting in the local storage
	// settingType is for example "pacmanSkin", "ghostSkin", "pacmanGamemode", "mapName", "pacmanTheme"
	// elementMapping is an object with the settings as keys and the elements as values
	// for example { "pacman": btnPacmanSkin, "pacgirl": btnPacWomanSkin }
	applySelectedSetting(settingType, elementMapping) {
		const selectedSetting = localStorage.getItem(settingType)?.replace(/"/g, '');
	
		Object.keys(elementMapping).forEach(setting => {
			if (setting === selectedSetting) {
				elementMapping[setting].classList.add("selected");
			} else {
				elementMapping[setting].classList.remove("selected");
			}
		});
	}

	// Function to add event listeners to the selections (click add enter key)
	// button is the element to add the event listener to
	// action is the function to call when the event listener is triggered
	addEventListeners(button, action) {
		button.addEventListener("click", (event) => action(event));
		button.addEventListener("keydown", (event) => {
			if (event.key === "Enter") {
				action(event);
			}
		});
	}

	//#endregion

}