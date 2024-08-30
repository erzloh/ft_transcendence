export let eventListeners = { }

export class PongMenu {
	constructor () {
		this.keysButton = document.getElementById('btnKeys');
		this.gamemodeButton = document.getElementById('btnGamemode');
		this.gamestyleButton = document.getElementById('btnGamestyle');
		this.pointsRangeContainer = document.getElementById('pointsRangeContainer');
		this.settingsModal = new bootstrap.Modal(document.getElementById('settingsModal'));
		this.settingsModalContent = document.getElementById('settingsModalContent');

		this.playersContainer = document.getElementById('playersContainer');
		this.currentGamemodeLabel = document.getElementById('currentGamemodeLabel');
		this.currentGamestyleLabel = document.getElementById('currentGamestyleLabel');

		this.toastNotification = document.getElementById('liveToast');
		this.toastBootstrap = bootstrap.Toast.getOrCreateInstance(this.toastNotification);
		this.toastBody = document.getElementById('toastBody');

		this.boundKeyDownSettings = this.keyDownSettings.bind(this);
		this.updatePlayersContainer = this.updatePlayersContainer.bind(this);

		this.waitForKey = false;
		this.waitingKey = "";

		const colorsString = localStorage.getItem('pongColors');
		this.colors = colorsString ? JSON.parse(colorsString) : {
			p1: "#ff0000", p2: "#00ff00", p3: "#0000ff", p4: "#ff00ff"
		};

		const usernamesString = localStorage.getItem('pongUsernames');
		this.usernames = usernamesString ? JSON.parse(usernamesString) : {
			p1: "player1", p2: "player2", p3: "player3", p4: "player4"
		};

		const keybindsString = localStorage.getItem('pongKeybinds');
		this.keybinds = keybindsString ? JSON.parse(keybindsString) : {
			lUp : 'KeyW', lDown : 'KeyS', rUp : 'ArrowUp', rDown : 'ArrowDown'
		};

		const gamemodeString = localStorage.getItem('pongGamemode');
		this.gamemode = gamemodeString ? JSON.parse(gamemodeString) : "pvp";
		this.lastGamemode = "pvp";

		const gamestyleString = localStorage.getItem('pongGamestyle');
		this.gamestyle = gamestyleString ? JSON.parse(gamestyleString) : "legacy";

		this.currentGamemodeLabel.innerHTML  = "current gamemode: " + this.gamemode;
		this.currentGamestyleLabel.innerHTML  = "current game style: " + this.gamestyle;

		const objectiveString = localStorage.getItem('pongObjective');
		this.objective = objectiveString ? JSON.parse(objectiveString) : 3;
	}

	Initialize() {
		// Add Event Listener to the Start Button
		this.keysButton.addEventListener("click", () => this.showKeysConfig());
		this.gamemodeButton.addEventListener("click", () => this.showGamemodeConfig());
		this.gamestyleButton.addEventListener("click", () => this.showGamestyleConfig());

		document.addEventListener("keydown", this.boundKeyDownSettings);
		eventListeners["keydown"] = this.boundKeyDownSettings;

		this.updatePlayersContainer();
		this.setScoreRange();
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
						<div class="col-5 d-flex flex-column align-items-center mt-1 mb-2">
							<input type="color" id="leftPaddleColor" class="form-control form-control-sm mt-3 glass" value="#ff0000">
						</div>
					</div>
					<div class="col d-flex flex-column align-items-center glass mt-2 p-4">
						<div class="col-8 d-flex flex-column align-items-center mt-1 mb-2">
							<label class="h3 text-white text-center">right paddle</label>
							<label class="h5 text-white text-center" id="rightPaddleName">player 2</label>
							<input type="text" id="rightPaddleInput" class="form-control form-control-sm text-input text-center" placeholder="Enter username">
						</div>
						<div class="col-5 d-flex flex-column align-items-center mt-1 mb-2">
							<input type="color" id="rightPaddleColor" class="form-control form-control-sm mt-3 glass" value="#00ff00">
						</div>
					</div>
				`;

				const leftPaddleUsernameLabel = document.getElementById('leftPaddleName');
				const leftPaddleInput = document.getElementById('leftPaddleInput');
				const leftPaddleColor = document.getElementById('leftPaddleColor');
				const rightPaddleUsernameLabel = document.getElementById('rightPaddleName');
				const rightPaddleInput = document.getElementById('rightPaddleInput');
				const rightPaddleColor = document.getElementById('rightPaddleColor');

				leftPaddleUsernameLabel.innerHTML = this.usernames.p1;
				rightPaddleUsernameLabel.innerHTML = this.usernames.p2;
				leftPaddleColor.value = this.colors.p1;
				rightPaddleColor.value = this.colors.p2;

				leftPaddleInput.addEventListener('keypress', (event) => this.paddleInputHandle(event, leftPaddleInput, leftPaddleUsernameLabel, "left paddle",  "p1"));
				leftPaddleInput.addEventListener('blur', (event) => this.paddleInputHandle(event, leftPaddleInput, leftPaddleUsernameLabel, "left paddle",  "p1"));
				rightPaddleInput.addEventListener('keypress', (event) => this.paddleInputHandle(event, rightPaddleInput, rightPaddleUsernameLabel, "right paddle", "p2"));
				rightPaddleInput.addEventListener('blur', (event) => this.paddleInputHandle(event, rightPaddleInput, rightPaddleUsernameLabel, "right paddle", "p2"));

				leftPaddleColor.addEventListener('input', (event) => this.colorInputHandle(event, "left paddle", "p1"));
				rightPaddleColor.addEventListener('input', (event) => this.colorInputHandle(event, "right paddle", "p2"));
				break;
			case "AI":
				this.playersContainer.innerHTML = `
					<div class="col d-flex flex-column align-items-center glass mt-2 p-4">
						<div class="col-8 d-flex flex-column align-items-center mt-1 mb-2">
							<label class="h3 text-white text-center">left paddle</label>
							<label class="h5 text-white text-center" id="playerPaddleName">player 1</label>
							<input type="text" id="playerPaddleInput" class="form-control form-control-sm text-input text-center" placeholder="Enter username">	
						</div>
						<div class="col-5 d-flex flex-column align-items-center mt-1 mb-2">
							<input type="color" id="playerPaddleColor" class="form-control form-control-sm mt-3 glass" value="#ff0000">
						</div>
					</div>
				`;

				const playerPaddleName = document.getElementById('playerPaddleName');
				const playerPaddleInput = document.getElementById('playerPaddleInput');
				const playerPaddleColor = document.getElementById('playerPaddleColor');

				playerPaddleName.innerHTML = this.usernames.p1;
				playerPaddleColor.value = this.colors.p1;

				playerPaddleInput.addEventListener('keypress', (event) => this.paddleInputHandle(event, playerPaddleInput, playerPaddleName, "player", "p1"));
				playerPaddleInput.addEventListener('blur', (event) => this.paddleInputHandle(event, playerPaddleInput, playerPaddleName, "player", "p1"));
				playerPaddleColor.addEventListener('input', (event) => this.colorInputHandle(event, "player", "p1"));
				break;
			case "tournament":
				this.playersContainer.innerHTML = `
					<div class="col d-flex flex-column align-items-center glass mt-2 p-4">
						<div class="col-8 d-flex flex-column align-items-center mt-1 mb-2">
							<label class="h4 text-white text-center mb-3" id="player1Name">player 1</label>
							<input type="text" id="player1Input" class="form-control form-control-sm text-input text-center" placeholder="Enter username">
						</div>
						<div class="col-5 d-flex flex-column align-items-center mt-1 mb-2">
							<input type="color" id="player1Color" class="form-control form-control-sm mt-3 glass" value="#ff0000">
						</div>
					</div>
					<div class="col d-flex flex-column align-items-center glass mt-2 p-4">
						<div class="col-8 d-flex flex-column align-items-center mt-1 mb-2">
							<label class="h4 text-white text-center mb-3" id="player2Name">player 2</label>
							<input type="text" id="player2Input" class="form-control form-control-sm text-input text-center" placeholder="Enter username">
						</div>
						<div class="col-5 d-flex flex-column align-items-center mt-1 mb-2">
							<input type="color" id="player2Color" class="form-control form-control-sm mt-3 glass" value="#00ff00">
						</div>
					</div>
					<div class="col d-flex flex-column align-items-center glass mt-2 p-4">
						<div class="col-8 d-flex flex-column align-items-center mt-1 mb-2">
							<label class="h4 text-white text-center mb-3" id="player3Name">player 3</label>
							<input type="text" id="player3Input" class="form-control form-control-sm text-input text-center" placeholder="Enter username">
						</div>
						<div class="col-5 d-flex flex-column align-items-center mt-1 mb-2">
							<input type="color" id="player3Color" class="form-control form-control-sm mt-3 glass" value="#0000ff">
						</div>
					</div>
					<div class="col d-flex flex-column align-items-center glass mt-2 p-4">
						<div class="col-8 d-flex flex-column align-items-center mt-1 mb-2">
							<label class="h4 text-white text-center mb-3" id="player4Name">...</label>
							<input type="text" id="player4Input" class="form-control form-control-sm text-input text-center" placeholder="Enter username">
						</div>
						<div class="col-5 d-flex flex-column align-items-center mt-1 mb-2">
							<input type="color" id="player4Color" class="form-control form-control-sm mt-3 glass" value="#ff00ff">
						</div>
					</div>
				`;


				const player1Name = document.getElementById('player1Name');
				const player1Input = document.getElementById('player1Input');
				const player1Color = document.getElementById('player1Color');
				const player2Name = document.getElementById('player2Name');
				const player2Input = document.getElementById('player2Input');
				const player2Color = document.getElementById('player2Color');
				const player3Name = document.getElementById('player3Name');
				const player3Input = document.getElementById('player3Input');
				const player3Color = document.getElementById('player3Color');
				const player4Name = document.getElementById('player4Name');
				const player4Input = document.getElementById('player4Input');
				const player4Color = document.getElementById('player4Color');

				player1Name.innerHTML = this.usernames.p1;
				player2Name.innerHTML = this.usernames.p2;
				player3Name.innerHTML = this.usernames.p3;
				player4Name.innerHTML = this.usernames.p4;
				player1Color.value = this.colors.p1;
				player2Color.value = this.colors.p2;
				player3Color.value = this.colors.p3;
				player4Color.value = this.colors.p4;


				player1Input.addEventListener('keypress', (event) => this.paddleInputHandle(event, player1Input, player1Name, "player 1", "p1"));
				player1Input.addEventListener('blur', (event) => this.paddleInputHandle(event, player1Input, player1Name, "player 1", "p1"));
				player2Input.addEventListener('keypress', (event) => this.paddleInputHandle(event, player2Input, player2Name, "player 2", "p2"));
				player2Input.addEventListener('blur', (event) => this.paddleInputHandle(event, player2Input, player2Name, "player 2", "p2"));
				player3Input.addEventListener('keypress', (event) => this.paddleInputHandle(event, player3Input, player3Name, "player 3", "p3"));
				player3Input.addEventListener('blur', (event) => this.paddleInputHandle(event, player3Input, player3Name, "player 3", "p3"));
				player4Input.addEventListener('keypress', (event) => this.paddleInputHandle(event, player4Input, player4Name, "player 4", "p4"));
				player4Input.addEventListener('blur', (event) => this.paddleInputHandle(event, player4Input, player4Name, "player 4", "p4"));

				player1Color.addEventListener('input', (event) => this.colorInputHandle(event, "player 1", "p1"));
				player2Color.addEventListener('input', (event) => this.colorInputHandle(event, "player 2", "p2"));
				player3Color.addEventListener('input', (event) => this.colorInputHandle(event, "player 3", "p3"));
				player4Color.addEventListener('input', (event) => this.colorInputHandle(event, "player 4", "p4"));
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

	colorInputHandle(event, name, player) {
		this.colors[player] = event.target.value;

		this.toastBody.innerHTML = "Changed " + name + " color.";
		this.toastBootstrap.show();

		localStorage.setItem('pongColors', JSON.stringify(this.colors));
		const colorsString = localStorage.getItem('pongColors');
		this.colors = colorsString ? JSON.parse(colorsString) : {
			p1: "#ff0000", p2: "#00ff00", p3: "#0000ff", p4: "#ff00ff"
		};
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

	showKeysConfig() {
		this.settingsModalContent.innerHTML = `
			<div class="row justify-content-center glass">
				<div class="modal-header">
					<h2 class="modal-title text-white w-100 text-center">keybinds settings</h2>
				</div>
				<div class="modal-body">
					<div class="col-12 d-flex justify-content-center">
						<div class="col-6">
							<div class="row justify-content-center text-center mt-2">
								<label class="h3 text-white">left paddle</label>
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
								<h3 class="text-white">right paddle</h3>
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
					<h2 class="modal-title text-white w-100 text-center">gamemodes</h2>
				</div>
				<div class="modal-body">
					<div class="row justify-content-center">
						<div class="col-4 d-flex justify-content-center">
							<button role="button" class="btn btn-lg text-white btn-filled" id="btnPvp">pvp</button>
						</div>
						<div class="col-4 d-flex justify-content-center">
							<button role="button" class="btn btn-lg text-white btn-filled" id="btnAI">vs ai</button>
						</div>
						<div class="col-4 d-flex justify-content-center">
							<button role="button" class="btn btn-lg text-white btn-filled" id="btnTournament">tournament</button>
						</div>
						<div class="col-12 d-flex justify-content-center mb-2 mt-4">
							<div class="col-10 justify-content-center d-flex flex-column" id="AIDifficulties">
								<label class="text-white text-center" id="gamemodeDescription"></label>
								<label class="h5 mt-4 text-white text-center" id="disclaimer"></label>
							</div>
						</div>
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
		btnTournament.addEventListener("click", (event) => this.selectGamemode(event, "tournament"));
		
		switch (this.gamemode) {
			case "pvp":
				btnPvp.disabled = true;
				labelDescription.innerHTML = "Two players play against each other, one playing the left paddle, the other playing the right paddle.";
				break;
			case "AI":
				btnAI.disabled = true;
				labelDescription.innerHTML = "The player controls the left paddle and competes against an AI opponent.";
				break;
			case "tournament":
				btnTournament.disabled = true;
				labelDescription.innerHTML = "Multiple players compete against each other in a tournament.";
				break;
			default:
				break; 
		}

		if (this.gamestyle == "3D") {
			btnAI.disabled = true;
			btnTournament.disabled = true;
			btnPvp.disabled = true;
			let disclaimer = document.getElementById('disclaimer');
			disclaimer.innerHTML = "The only available gamemode for 3D game style is PvP.";
		}

		localStorage.setItem('pongGamemode', JSON.stringify(this.gamemode));

		this.settingsModal.show();
	}

	showGamestyleConfig() {
		this.settingsModalContent.innerHTML = `
			<div class="row justify-content-center glass">
				<div class="modal-header">
					<h2 class="modal-title text-white w-100 text-center">game styles</h2>
				</div>
				<div class="modal-body">
					<div class="row justify-content-center">
						<div class="col-4 d-flex justify-content-center">
							<button role="button" class="btn btn-lg text-white btn-filled" id="btnLegacy">legacy</button>
						</div>
						<div class="col-4 d-flex justify-content-center">
							<button role="button" class="btn btn-lg text-white btn-filled" id="btnEnhanced">enhanced</button>
						</div>
						<div class="col-4 d-flex justify-content-center">
							<button role="button" class="btn btn-lg text-white btn-filled" id="btn3D">3D</button>
						</div>
						<div class="col-12 d-flex justify-content-center mb-2 mt-4">
							<div class="col-10 justify-content-center d-flex flex-column" id="AIDifficulties">
								<label class="text-white text-center" id="gamestyleDescription"></label>
								<label class="text-white text-center" id="availableGamemodes"></label>
							</div>
						</div>
					</div>
				</div>
			</div>
		`;

		let btnLegacy = document.getElementById('btnLegacy');
		let btnEnhanced = document.getElementById('btnEnhanced');
		let btn3D = document.getElementById('btn3D');
		let gamestyleDescription = document.getElementById('gamestyleDescription');
		let availableGamemodes = document.getElementById('availableGamemodes');

		btnLegacy.addEventListener("click", (event) => this.selectGamestyle(event, "legacy"));
		btnEnhanced.addEventListener("click", (event) => this.selectGamestyle(event, "enhanced"));
		btn3D.addEventListener("click", (event) => this.selectGamestyle(event, "3D"));

		switch (this.gamestyle) {
			case "legacy":
				btnLegacy.disabled = true;
				gamestyleDescription.innerHTML = "classic pong game.";
				availableGamemodes.innerHTML = "available gamemodes: all";
				break;
			case "enhanced":
				btnEnhanced.disabled = true;
				gamestyleDescription.innerHTML = "pong game with power ups.";
				availableGamemodes.innerHTML = "available gamemodes: all";
				break;
			case "3D":
				btn3D.disabled = true;
				gamestyleDescription.innerHTML = "3D classic pong game.";
				availableGamemodes.innerHTML = "available gamemodes: PvP";
				break;
			default:
				break; 
		}

		localStorage.setItem('pongGamestyle', JSON.stringify(this.gamestyle));

		this.playersContainer
		this.settingsModal.show();
	}

	//#region EVENT LISTENERS HANDLERS

	selectGamemode(event, gamemode) {
		this.toastBody.innerHTML = "chosen gamemode: " + gamemode;
		this.toastBootstrap.show();
		this.gamemode = gamemode;
		localStorage.setItem('gamemode', JSON.stringify(this.gamemode));
		this.currentGamemodeLabel.innerHTML = "current gamemode: " + this.gamemode;

		this.showGamemodeConfig();
		this.updatePlayersContainer();
	}

	selectGamestyle(event, gamestyle) {
		this.toastBody.innerHTML = "chosen game style: " + gamestyle;
		this.toastBootstrap.show();
		if (gamestyle == "3D") {
			this.lastGamemode = this.gamemode;
			this.gamemode = "pvp";
			this.currentGamemodeLabel = "current gamemode: " + this.gamemode;
		} 
		else if (this.gamestyle == "3D" && gamestyle != this.gamestyle) {
			this.gamemode = this.lastGamemode;
			this.currentGamemodeLabel = "current gamemode: " + this.gamemode;
		}
		
		this.gamestyle = gamestyle;
		localStorage.setItem('gamestyle', JSON.stringify(this.gamestyle));
		this.currentGamestyleLabel.innerHTML = "current game style: " + this.gamestyle;

		this.showGamestyleConfig();
		this.updatePlayersContainer();
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

