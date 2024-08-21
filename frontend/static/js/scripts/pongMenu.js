export let eventListeners = { }

export class PongMenu {
	constructor () {
		this.keysButton = document.getElementById('btnKeys');
		this.gamemodeButton = document.getElementById('btnGamemode');
		this.pointsRangeContainer = document.getElementById('pointsRangeContainer');
		this.settingsModal = new bootstrap.Modal(document.getElementById('settingsModal'));
		this.settingsModalContent = document.getElementById('settingsModalContent');

		this.playersContainer = document.getElementById('playersContainer');

		this.toastNotification = document.getElementById('liveToast');
		this.toastBootstrap = bootstrap.Toast.getOrCreateInstance(this.toastNotification);
		this.toastBody = document.getElementById('toastBody');

		this.boundKeyDownSettings = this.keyDownSettings.bind(this);
		this.updatePlayersContainer = this.updatePlayersContainer.bind(this);

		this.waitForKey = false;
		this.waitingKey = "";

		const usernamesString = localStorage.getItem('pongUsernames');
		this.usernames = usernamesString ? JSON.parse(usernamesString) : {
			p1: "player1", p2: "player2", p3: "player3", p4: "player4"
		};

		const colorsString = localStorage.getItem('pongColors');
		this.colors = colorsString ? JSON.parse(colorsString) : {
			1 : 'rgb(200, 0, 0)', 2 : 'rgb(0, 30, 200)', 3 : 'rgb(0, 200, 0)', 4 : 'rgb(200, 100, 0)'
		};

		const keybindsString = localStorage.getItem('pongKeybinds');
		this.keybinds = keybindsString ? JSON.parse(keybindsString) : {
			lUp : 'KeyW', lDown : 'KeyS', rUp : 'ArrowUp', rDown : 'ArrowDown'
		};

		const gamemodeString = localStorage.getItem('pongGamemode');
		this.gamemode = gamemodeString ? JSON.parse(gamemodeString) : "pvp";

		const objectiveString = localStorage.getItem('pongObjective');
		this.objective = objectiveString ? JSON.parse(objectiveString) : 3;
	}

	updatePlayersContainer = () => {
		switch (this.gamemode) {
			case "pvp":
				this.playersContainer.innerHTML = `
					<div class="col d-flex flex-column align-items-center glass mt-2 p-4">
						<div class="col-8 d-flex flex-column align-items-center mt-1 mb-2">
							<label class="h3 text-white text-center">left paddle</label>
							<label class="h5 text-white text-center" id="leftPaddleName">player 1</label>
							<input type="text" id="leftPaddleInput" class="form-control form-control-sm text-input text-center" placeholder="Enter username">
						</div>
					</div>
					<div class="col d-flex flex-column align-items-center glass mt-2 p-4">
						<div class="col-8 d-flex flex-column align-items-center mt-1 mb-2">
							<label class="h3 text-white text-center">right paddle</label>
							<label class="h5 text-white text-center" id="rightPaddleName">player 2</label>
							<input type="text" id="rightPaddleInput" class="form-control form-control-sm text-input text-center" placeholder="Enter username">
						</div>
					</div>
				`;

				const leftPaddleUsernameLabel = document.getElementById('leftPaddleName');
				const leftPaddleInput = document.getElementById('leftPaddleInput');
				const rightPaddleUsernameLabel = document.getElementById('rightPaddleName');
				const rightPaddleInput = document.getElementById('rightPaddleInput');

				leftPaddleUsernameLabel.innerHTML = this.usernames.p1;
				rightPaddleUsernameLabel.innerHTML = this.usernames.p2;

				leftPaddleInput.addEventListener('keypress', (event) => this.paddleInputHandle(event, leftPaddleInput, leftPaddleUsernameLabel, "left paddle",  "p1"));
				leftPaddleInput.addEventListener('blur', (event) => this.paddleInputHandle(event, leftPaddleInput, leftPaddleUsernameLabel, "left paddle",  "p1"));
				rightPaddleInput.addEventListener('keypress', (event) => this.paddleInputHandle(event, rightPaddleInput, rightPaddleUsernameLabel, "right paddle", "p2"));
				rightPaddleInput.addEventListener('blur', (event) => this.paddleInputHandle(event, rightPaddleInput, rightPaddleUsernameLabel, "right paddle", "p2"));
				break;
			case "AI":
				this.playersContainer.innerHTML = `
					<div class="col d-flex flex-column align-items-center glass mt-2 p-4">
						<div class="col-8 d-flex flex-column align-items-center mt-1 mb-2">
							<label class="h3 text-white text-center">left paddle</label>
							<label class="h5 text-white text-center" id="playerPaddleName">player 1</label>
							<input type="text" id="playerPaddleInput" class="form-control form-control-sm text-input text-center" placeholder="Enter username">
						</div>
					</div>
				`;

				const playerPaddleName = document.getElementById('playerPaddleName');
				const playerPaddleInput = document.getElementById('playerPaddleInput');

				playerPaddleName.innerHTML = this.usernames.p1;

				playerPaddleInput.addEventListener('keypress', (event) => this.paddleInputHandle(event, playerPaddleInput, playerPaddleName, "player", "p1"));
				playerPaddleInput.addEventListener('blur', (event) => this.paddleInputHandle(event, playerPaddleInput, playerPaddleName, "player", "p1"));
				break;
			case "Tournament":
				break;
			default:
				break;
		}
	}

	paddleInputHandle(event, playerInput, playerLabel, playerName, playerUsername) {
		if (((event.type == 'keypress' && event.key === 'Enter') || event.type == 'blur') && playerInput.value != "") {
			this.usernames[playerUsername] = playerInput.value;
			playerInput.value = ""; // Clear the input box
			playerLabel.innerHTML =   this.usernames[playerUsername];

			this.toastBody.innerHTML = "Changed " + playerName + " paddle username to: " +   this.usernames[playerUsername];
			this.toastBootstrap.show();

			localStorage.setItem('pongUsernames', JSON.stringify(this.usernames));
			const usernamesString = localStorage.getItem('pongUsernames');
			this.usernames = usernamesString ? JSON.parse(usernamesString) : {
				p1: "player1", p2: "player2", p3: "player3", p4: "player4"
			};
		}
	}

	setScoreRange() {
		this.pointsRangeContainer.innerHTML = `
			<div class="col-6 flex-column align-items-center d-flex mb-2">
				<label class="text-white h5 text-center" id="rangeLabel">points to win: 3</label>
				<input type="range" style=" width: 70%; margin: 0 auto;" class="form-range" min="1" max="10" value="${this.objective}" step="1" id="pongRangeInput">
			</div>
		`;

		let rangeInput = document.getElementById('pongRangeInput');
		let rangeLabel = document.getElementById('rangeLabel');

		rangeLabel.innerHTML = "points to win: " + this.objective;
		localStorage.setItem('pongObjective', JSON.stringify(this.objective));

		rangeInput.addEventListener('input', (event) => {
			this.objective = event.target.value;
			rangeLabel.textContent = "points to win: " + this.objective;
			localStorage.setItem('pongObjective', JSON.stringify(this.objective));
		});
	}

	Initialize() {
		// Add Event Listener to the Start Button
		this.keysButton.addEventListener("click", () => this.showKeysConfig());
		this.gamemodeButton.addEventListener("click", () => this.showGamemodeConfig());

		document.addEventListener("keydown", this.boundKeyDownSettings);
		eventListeners["keydown"] = this.boundKeyDownSettings;

		this.updatePlayersContainer();
		this.setScoreRange();
	}

	showKeysConfig() {
		this.settingsModalContent.innerHTML = `
			<div class="row justify-content-center glass">
				<div class="modal-header">
					<h2 class="modal-title text-white w-100 text-center">Keybinds settings</h2>
				</div>
				<div class="modal-body">
					<div class="col-12 d-flex justify-content-center">
						<div class="col-6">
							<div class="row justify-content-center text-center mt-2">
								<label class="h3 text-white">Left paddle</label>
							</div>
							<div class="row justify-content-center text-center mt-2">
								<div class="col-6 d-flex justify-content-end">
									<label class="text-white" style="padding: 3px 0px;">Move up</label>
								</div>
								<div class="col-6 d-flex justify-content-start">
									<label role="button" class="text-white clickable" style="max-height: 275px; border: 1px solid white; padding: 5px; border-radius: 5px;" id="lUp">${this.keybinds.lUp !== "" ? this.keybinds.lUp : "none"}</label>
								</div>
							</div>
							<div class="row justify-content-center text-center mt-2">
								<div class="col-6 d-flex justify-content-end">
									<label class="text-white" style="padding: 3px 0px;">Move down</label>
								</div>
								<div class="col-6 d-flex justify-content-start">
									<label role="button" class="text-white clickable" style="max-height: 275px; border: 1px solid white; padding: 5px; border-radius: 5px;" id="lDown">${this.keybinds.lDown !== "" ? this.keybinds.lDown : "none"}</label>
								</div>
							</div>
						</div>
						<div class="col-6">
							<div class="row justify-content-center text-center mt-2">
								<h3 class="text-white">Right paddle</h3>
							</div>
							<div class="row justify-content-center text-center mt-2">
								<div class="col-6 d-flex justify-content-end">
									<label class="text-white" style="padding: 3px 0px;">Move up</label>
								</div>
								<div class="col-6 d-flex justify-content-start">
									<label role="button" class="text-white clickable" style="max-height: 275px; border: 1px solid white; padding: 5px; border-radius: 5px;" id="rUp">${this.keybinds.rUp !== "" ? this.keybinds.rUp : "none"}</label>
								</div>
							</div>
							<div class="row justify-content-center text-center mt-2">
								<div class="col-6 d-flex justify-content-end">
									<label class="text-white" style="padding: 3px 0px;">Move down</label>
								</div>
								<div class="col-6 d-flex justify-content-start">
									<label role="button" class="text-white clickable" style="max-height: 275px; border: 1px solid white; padding: 5px; border-radius: 5px;" id="rDown">${this.keybinds.rDown !== "" ? this.keybinds.rDown : "none"}</label>
								</div>
							</div>
						</div>
					</div>
					<div class="col-12 d-flex justify-content-center mt-4">
						<button type="button" class="btn btn-lg text-white" data-bs-dismiss="modal" aria-label="Close">Close</button>
					</div>
				</div>
			</div>
		`;

		let btnLUp = document.getElementById('lUp');
		let btnLDown = document.getElementById('lDown');
		let btnRUp = document.getElementById('rUp');
		let btnRDown = document.getElementById('rDown');

		btnLUp.addEventListener("click", (event) => this.changeKeybind(event, "lUp", btnLUp));
		btnLDown.addEventListener("click", (event) => this.changeKeybind(event, "lDown", btnLDown))
		btnRUp.addEventListener("click", (event) => this.changeKeybind(event, "rUp", btnRUp));
		btnRDown.addEventListener("click", (event) => this.changeKeybind(event, "rDown", btnRDown));

		this.settingsModal.show();
	}

	showGamemodeConfig() {
		this.settingsModalContent.innerHTML = `
			<div class="row justify-content-center glass">
				<div class="modal-header">
					<h2 class="modal-title text-white w-100 text-center">Gamemodes</h2>
				</div>
				<div class="modal-body">
					<div class="row justify-content-center">
						<div class="col-4 d-flex justify-content-center">
							<button role="button" class="btn btn-lg text-white btn-filled" id="btnPvp">PvP</button>
						</div>
						<div class="col-4 d-flex justify-content-center">
							<button role="button" class="btn btn-lg text-white btn-filled" id="btnAI">vs AI</button>
						</div>
						<div class="col-4 d-flex justify-content-center">
							<button role="button" class="btn btn-lg text-white btn-filled" id="btnTournament">Tournament</button>
						</div>
						<div class="col-12 d-flex justify-content-center mb-2 mt-4">
							<div class="col-10" id="AIDifficulties">
								<label class="text-white text-center" id="gamemodeDescription"></label>
							</div>
						</div>
					</div>
					<div class="col-12 d-flex justify-content-center mt-4">
						<button type="button" class="btn btn-lg text-white btn-filled" data-bs-dismiss="modal" aria-label="Close">Close</button>
					</div>
				</div>
			</div>
		`;


        let btnPvp = document.getElementById('btnPvp');
		let btnAI = document.getElementById('btnAI');
		let btnTournament = document.getElementById('btnTournament');
		let labelDescription = document.getElementById('gamemodeDescription');
		let AiDifficulties = document.getElementById('AiDifficulties');

		btnPvp.addEventListener("click", (event) => this.selectGamemode(event, "pvp"));
		btnAI.addEventListener("click", (event) => this.selectGamemode(event, "AI"));
		btnTournament.addEventListener("click", (event) => this.selectGamemode(event, "Tournament"));
		
		switch (this.gamemode) {
			case "pvp":
				btnPvp.disabled = true;
				labelDescription.innerHTML = "Two players play against each other, one playing the left paddle, the other playing the right paddle.";
				break;
			case "AI":
				btnAI.disabled = true;
				labelDescription.innerHTML = "The player controls the left paddle and competes against an AI opponent.";
				break;
			case "Tournament":
				btnTournament.disabled = true;
				labelDescription.innerHTML = "Multiple players compete against each other in a tournament.";
				break;
			default:
				break; 
		}

		localStorage.setItem('pongGamemode', JSON.stringify(this.gamemode));

		this.settingsModal.show();
	}

	showColorsConfig() {
		this.settingsModalContent.innerHTML = `
			<div class="row justify-content-center glass">
				<div class="modal-header">
					<h2 class="modal-title text-white w-100 text-center">Themes</h2>
				</div>
				<div class="modal-body">
					<div class="col-12 justify-content-center">
						<div class="row justify-content-center text-center mt-2 mb-3">
							<div class="row justify-content-center text-center">
								<div class="col-3 d-flex flex-column align-items-center">
									<label class="h4 text-white">Obsidian</label>
									<img class="img-fluid"style="max-height: 275px; border: 3px solid #260045;" role="button" src="/static/assets/pacman/images/obsidian.png" id="pObsidian"/>
								</div>
								<div class="col-3 d-flex flex-column align-items-center">
									<label class="h4 text-white">Autumn</label>
									<img class="img-fluid" style="max-height: 275px; border: 3px solid #260045;" role="button" src="/static/assets/pacman/images/autumn.png" id="pAutumn"/>
								</div>
								<div class="col-3 d-flex flex-column align-items-center">
									<label class="h4 text-white">Garden</label>
									<img class="img-fluid" style="max-height: 275px; border: 3px solid #260045;" role="button" src="/static/assets/pacman/images/garden.png" id="pGarden"/>
								</div>
								<div class="col-3 d-flex flex-column align-items-center">
									<label class="h4 text-white">Retro</label>
									<img class="img-fluid" style="max-height: 275px; border: 3px solid #260045;" role="button" src="/static/assets/pacman/images/spacial.png" id="pSpacial"/>
								</div>
							</div>
						</div>
					</div>
					<div class="col-12 d-flex justify-content-center mt-2">
							<button type="button" class="btn btn-lg text-white" data-bs-dismiss="modal" aria-label="Close">Close</button>
					</div>
				</div>
			</div>
		`;

		let btnObsidian = document.getElementById('pObsidian');
        let btnAutumn = document.getElementById('pAutumn');
		let btnGarden = document.getElementById('pGarden');
        let btnSpacial = document.getElementById('pSpacial');

		btnObsidian.addEventListener("click", (event) => this.selectTheme(event, "obsidian"));
		btnAutumn.addEventListener("click", (event) => this.selectTheme(event, "autumn"));
		btnGarden.addEventListener("click", (event) => this.selectTheme(event, "garden"));
		btnSpacial.addEventListener("click", (event) => this.selectTheme(event, "spacial"));

		this.settingsModal.show();
	}

	//#region EVENT LISTENERS HANDLERS

	selectGamemode(event, gamemode) {
		this.toastBody.innerHTML = "Chosen gamemode: " + gamemode;
		this.toastBootstrap.show();
		this.gamemode = gamemode;
		localStorage.setItem('gamemode', JSON.stringify(this.gamemode));

		this.showGamemodeConfig();
		this.updatePlayersContainer();
	}

	// selectTheme(event, theme) {
	// 	this.toastBody.innerHTML = "Chosen theme: " + theme;
	// 	this.toastBootstrap.show();
	// 	switch (theme) {
	// 		case "obsidian":
	// 			this.theme = {
	// 				backgroundColor : 'rgb(10, 0, 20)', ghostWallColor1 : 'rgb(110, 55, 225)', ghostWallColor2 : 'rgb(75, 20, 200)',
	// 				wallColor : 'rgb(60, 0, 120)', dotColor : 'rgb(105,55,165)', glowColor : 'rgb(145,85,210)'
	// 			};
	// 			break;
	// 		case "autumn":
	// 			this.theme = {
	// 				backgroundColor : 'rgb(15, 0, 0)', ghostWallColor1 : 'rgb(138, 22, 1)', ghostWallColor2 : 'rgb(181, 32, 2)',
	// 				wallColor : 'rgb(143, 34, 1)', dotColor : 'rgb(145, 67, 3)', glowColor : 'rgb(194, 90, 6)'
	// 			};
	// 			break;
	// 		case "garden":
	// 			this.theme = {
	// 				backgroundColor : 'rgb(0, 8, 2)', ghostWallColor1 : 'rgb(38, 82, 0)', ghostWallColor2 : 'rgb(58, 125, 0)',
	// 				wallColor : 'rgb(0, 54, 12)', dotColor : 'rgb(2, 56, 173)', glowColor : 'rgb(0, 66, 209)'
	// 			};
	// 			break;
	// 		case "spacial":
	// 			this.theme = {
	// 				backgroundColor : 'rgb(1, 1, 26)', ghostWallColor1 : 'rgb(14, 58, 179)', ghostWallColor2 : 'rgb(18, 71, 219)',
	// 				wallColor : 'rgb(0, 0, 176)', dotColor : 'rgb(145, 135, 19)', glowColor : 'rgb(186, 173, 20)'
	// 			};
	// 			break;
	// 		default:
	// 			break;
	// 	}
	//localStorage.setItem('pongTheme', JSON.stringify(this.theme));
	//
	// }

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
				case "lUp":
					this.toastBody.innerHTML = "Changed Left Paddle Move Up keybind to: " + event.code;
					this.keybinds.lUp = event.code;
					break;
				case "lDown":
					this.toastBody.innerHTML = "Changed Left Paddle Move Down keybind to: " + event.code;
					this.keybinds.lDown = event.code;
					break;
				case "rUp":
					this.toastBody.innerHTML = "Changed Right Paddle Move Up keybind to: " + event.code;
					this.keybinds.rUp = event.code;
					break;
				case "rDown":
					this.toastBody.innerHTML = "Changed Right Paddle Move Down keybind to: " + event.code;
					this.keybinds.rDown = event.code;
					break;
				default:
					return ;
			}
			this.waitForKey = false;
			this.toastBootstrap.show();
			localStorage.setItem('pongKeybinds', JSON.stringify(this.keybinds));
			this.showKeysConfig();
		}
	}

	//#endregion

}

