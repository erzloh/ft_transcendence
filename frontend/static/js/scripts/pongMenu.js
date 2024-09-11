import { BASE_URL } from "../index.js";

export let eventListeners = { }

export class PongMenu {
	constructor () {
		this.keysButton = document.getElementById('btnKeys');
		this.gamemodeButton = document.getElementById('btnGamemode');
		this.gamestyleButton = document.getElementById('btnGamestyle');
		this.btnStartGame = document.getElementById('btnStartGame');
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
		this.displayName = "";

		const colorsString = localStorage.getItem('pongColors');
		this.colors = colorsString ? JSON.parse(colorsString) : {
			p1: "#ff0000", p2: "#00ff00", p3: "#266fff", p4: "#ff00ff"
		};
		localStorage.setItem('pongColors', JSON.stringify(this.colors));

		const usernamesString = localStorage.getItem('pongUsernames');
		this.usernames = usernamesString ? JSON.parse(usernamesString) : {
			p1: "player1", p2: "player2", p3: "player3", p4: "player4"
		};
		localStorage.setItem('pongUsernames', JSON.stringify(this.usernames));

		const keybindsString = localStorage.getItem('pongKeybinds');
		this.keybinds = keybindsString ? JSON.parse(keybindsString) : {
			lUp : 'KeyW', lDown : 'KeyS', lMini: 'KeyE',
			rUp : 'ArrowUp', rDown : 'ArrowDown', rMini: 'ArrowRight'
		};
		localStorage.setItem('pongKeybinds', JSON.stringify(this.keybinds));

		const aiDifficultyString = localStorage.getItem('pongAIDifficulty');
		this.aiDifficulty = aiDifficultyString ? JSON.parse(aiDifficultyString) : "easy";
		localStorage.setItem('pongAIDifficulty', JSON.stringify(this.aiDifficulty));

		const gamemodeString = localStorage.getItem('pongGamemode');
		this.gamemode = gamemodeString ? JSON.parse(gamemodeString) : "pvp";
		this.lastGamemode = "pvp";
		localStorage.setItem('gamemode', JSON.stringify(this.gamemode));

		const gamestyleString = localStorage.getItem('pongGamestyle');
		this.gamestyle = gamestyleString ? JSON.parse(gamestyleString) : "enhanced";
		localStorage.setItem('pongGamestyle', JSON.stringify(this.gamestyle));
		// TODO: change this to /pong3d
		this.btnStartGame.href = this.gamestyle == "3D" ? "/pong" : "/pong";

		this.currentGamemodeLabel.innerHTML  = this.gamemode;
		this.currentGamestyleLabel.innerHTML  = this.gamestyle;

		const objectiveString = localStorage.getItem('pongObjective');
		this.objective = objectiveString ? JSON.parse(objectiveString) : 3;
	}

	async Initialize() {
		// Add Event Listener to the Start Button
		this.keysButton.addEventListener("click", () => this.showKeysConfig());
		this.gamemodeButton.addEventListener("click", () => this.showGamemodeConfig());
		this.gamestyleButton.addEventListener("click", () => this.showGamestyleConfig());

		document.addEventListener("keydown", this.boundKeyDownSettings);
		eventListeners["keydown"] = this.boundKeyDownSettings;

		await this.getLoggedUsername();

		this.updatePlayersContainer();
		this.setScoreRange();
	}

	async getLoggedUsername() {
		// Check if the user is logged in or not
		const response = await fetch(`${BASE_URL}/api/profile`);

		// If the user is logged in, show the profile page
		if (response.status === 200) {
			const responseData = await response.json();
			const user = responseData.user;
			this.displayName = user.username;
		}
	}

	updatePlayersContainer = () => {
		switch (this.gamemode) {
			case "pvp":
				this.playersContainer.innerHTML = `
					<div class="col d-flex flex-column align-items-center glass mt-2 p-4">
						<div class="col-10 d-flex flex-column align-items-center mt-1 mb-2">
							<p class="h3 text-white text-center">left paddle</p>
							<p class="h5 text-white text-center" id="leftPaddleName">player 1</p>
							<input type="text" id="leftPaddleInput" maxlength="10" class="form-control form-control-sm text-input text-center" placeholder="Enter username">
						</div>
						<div class="col-6 d-flex flex-column align-items-center mt-1 mb-2">
							<input type="color" id="leftPaddleColor" class="form-control form-control-sm mt-3 glass" value="#ff0000">
						</div>
					</div>
					<div class="col d-flex flex-column align-items-center glass mt-2 p-4">
						<div class="col-10 d-flex flex-column align-items-center mt-1 mb-2">
							<p class="h3 text-white text-center">right paddle</p>
							<p class="h5 text-white text-center" id="rightPaddleName">player 2</p>
							<input type="text" id="rightPaddleInput" maxlength="10" class="form-control form-control-sm text-input text-center" placeholder="Enter username">
						</div>
						<div class="col-6  d-flex flex-column align-items-center mt-1 mb-2">
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
						<div class="col-10  d-flex flex-column align-items-center mt-1 mb-2">
							<p class="h3 text-white text-center">left paddle</p>
							<p class="h5 text-white text-center" id="playerPaddleName">player 1</p>
							<input type="text" id="playerPaddleInput" maxlength="10" class="form-control form-control-sm text-input text-center" placeholder="Enter username">	
						</div>
						<div class="col-6  d-flex flex-column align-items-center mt-1 mb-2">
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
						<div class="col-10 d-flex flex-column align-items-center mt-1 mb-1">
							<p class="h4 text-white text-center mb-3" id="player1Name">player 1</p>
							<input type="text" id="player1Input" maxlength="10" class="form-control form-control-sm text-input text-center" placeholder="Enter username">
						</div>
						<div class="col-8 d-flex flex-column align-items-center mt-1 mb-1">
							<input type="color" id="player1Color" class="form-control form-control-sm mt-3 glass" value="#ff0000">
						</div>
					</div>
					<div class="col d-flex flex-column align-items-center glass mt-2 p-4">
						<div class="col-10 d-flex flex-column align-items-center mt-1 mb-1">
							<p class="h4 text-white text-center mb-3" id="player2Name">player 2</p>
							<input type="text" id="player2Input" maxlength="10" class="form-control form-control-sm text-input text-center" placeholder="Enter username">
						</div>
						<div class="col-8  d-flex flex-column align-items-center mt-1 mb-1">
							<input type="color" id="player2Color" class="form-control form-control-sm mt-3 glass" value="#00ff00">
						</div>
					</div>
					<div class="col d-flex flex-column align-items-center glass mt-2 p-4">
						<div class="col-10  d-flex flex-column align-items-center mt-1 mb-1">
							<p class="h4 text-white text-center mb-3" id="player3Name">player 3</p>
							<input type="text" id="player3Input" maxlength="10" class="form-control form-control-sm text-input text-center" placeholder="Enter username">
						</div>
						<div class="col-8  d-flex flex-column align-items-center mt-1 mb-1">
							<input type="color" id="player3Color" class="form-control form-control-sm mt-3 glass" value="#0000ff">
						</div>
					</div>
					<div class="col d-flex flex-column align-items-center glass mt-2 p-4">
						<div class="col-10  d-flex flex-column align-items-center mt-1 mb-1">
							<p class="h4 text-white text-center mb-3" id="player4Name">...</p>
							<input type="text" id="player4Input" maxlength="10" class="form-control form-control-sm text-input text-center" placeholder="Enter username">
						</div>
						<div class="col-8 d-flex flex-column align-items-center mt-1 mb-1">
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

				if (this.displayName != "") {
					this.usernames.p1 = this.displayName;
					player1Name.innerHTML = this.usernames.p1;
					localStorage.setItem('pongUsernames', JSON.stringify(this.usernames));
					player1Input.style.opacity = 0;
				}
				else {
					player1Input.addEventListener('keypress', (event) => this.paddleInputHandle(event, player1Input, player1Name, "player 1", "p1"));
					player1Input.addEventListener('blur', (event) => this.paddleInputHandle(event, player1Input, player1Name, "player 1", "p1"));
				}				
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
				<p for="pongRangeInput" class="text-white h5 text-center" id="rangeLabel">points to win: 3</p>
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
			<div class="modal-header">
				<h2 class="modal-title text-white w-100 text-center">keybinds settings</h2>
			</div>
			<div class="modal-body">
				<div class="col-12 d-flex justify-content-center">
					<div class="col-6">
						<div class="row justify-content-center text-center mt-2">
							<p class="h2 text-white">left paddle</p>
						</div>
						<div class="row justify-content-center text-center mt-1">
							<div class="col-6 d-flex justify-content-end align-content-center">
								<p class="text-white" style="display: inline; margin-top: 5px;">move up</p>
							</div>
							<div class="col-6 d-flex justify-content-start align-content-center">
								<p role="button" tabindex="0" class="text-white clickable" style="display: inline; max-height: 275px; border: 1px solid white; padding: 5px; border-radius: 5px;" id="lUp">${this.keybinds.lUp !== "" ? this.keybinds.lUp : "none"}</p>
							</div>
						</div>
						<div class="row justify-content-center text-center">
							<div class="col-6 d-flex justify-content-end">
								<p class="text-white" style="display: inline; margin-top: 5px;">move down</p>
							</div>
							<div class="col-6 d-flex justify-content-start">
								<p role="button" tabindex="0" class="text-white clickable" style="display: inline; max-height: 275px; border: 1px solid white; padding: 5px; border-radius: 5px;" id="lDown">${this.keybinds.lDown !== "" ? this.keybinds.lDown : "none"}</p>
							</div>
						</div>
						<div class="row justify-content-center text-center">
							<div class="col-6 d-flex justify-content-end">
								<p class="text-white" style="display: inline; margin-top: 5px;">minimize</p>
							</div>
							<div class="col-6 d-flex justify-content-start">
								<p role="button" tabindex="0" class="text-white clickable" style="display: inline; max-height: 275px; border: 1px solid white; padding: 5px; border-radius: 5px;" id="lMini">${this.keybinds.lMini !== "" ? this.keybinds.lMini : "none"}</p>
							</div>
						</div>
					</div>
					<div class="col-6">
						<div class="row justify-content-center text-center mt-2">
							<p class="h2 text-white">right paddle</p>
						</div>
						<div class="row justify-content-center text-center mt-1">
							<div class="col-6 d-flex justify-content-end">
								<p class="text-white" style="display: inline; margin-top: 5px;">move up</p>
							</div>
							<div class="col-6 d-flex justify-content-start">
								<p role="button" tabindex="0" class="text-white clickable" style="display: inline; max-height: 275px; border: 1px solid white; padding: 5px; border-radius: 5px;" id="rUp">${this.keybinds.rUp !== "" ? this.keybinds.rUp : "none"}</p>
							</div>
						</div>
						<div class="row justify-content-center text-center">
							<div class="col-6 d-flex justify-content-end">
								<p class="text-white" style="display: inline; margin-top: 5px;">move down</p>
							</div>
							<div class="col-6 d-flex justify-content-start">
								<p role="button" tabindex="0" class="text-white clickable" style="display: inline; max-height: 275px; border: 1px solid white; padding: 5px; border-radius: 5px;" id="rDown">${this.keybinds.rDown !== "" ? this.keybinds.rDown : "none"}</p>
							</div>
						</div>
						<div class="row justify-content-center text-center">
							<div class="col-6 d-flex justify-content-end">
								<p class="text-white" style="display: inline; margin-top: 5px;">minimize</p>
							</div>
							<div class="col-6 d-flex justify-content-start">
								<p role="button" tabindex="0" class="text-white clickable" style="display: inline; max-height: 275px; border: 1px solid white; padding: 5px; border-radius: 5px;" id="rMini">${this.keybinds.rMini !== "" ? this.keybinds.rMini : "none"}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		`;

		let btnLUp = document.getElementById('lUp');
		let btnLDown = document.getElementById('lDown');
		let btnLMini = document.getElementById('lMini');
		let btnRUp = document.getElementById('rUp');
		let btnRDown = document.getElementById('rDown');
		let btnRMini = document.getElementById('rMini');

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
		
		addEventListeners(btnLUp, "lUp");
		addEventListeners(btnLDown, "lDown");
		addEventListeners(btnLMini, "lMini");
		addEventListeners(btnRUp, "rUp");
		addEventListeners(btnRDown, "rDown");
		addEventListeners(btnRMini, "rMini");

		this.settingsModal.show();
	}

	showGamemodeConfig() {
		this.settingsModalContent.innerHTML = `
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
					<div class="col-12 d-flex justify-content-center mt-3">
						<div class="col-8 justify-content-center d-flex flex-column">
							<p class="text-white text-center lh-sm mt-3" style="min-height: 3em; line-height: 1;" id="gamemodeDescription"></p>
							<p class="h5 fw-boldtext-white text-center " id="disclaimer"></p>
							<div id="aiLevelsContainer"></div>
						</div>
					</div>
				</div>
			</div>
		`;


        let btnPvp = document.getElementById('btnPvp');
		let btnAI = document.getElementById('btnAI');
		let btnTournament = document.getElementById('btnTournament');
		let pDescription = document.getElementById('gamemodeDescription');
		let aiLevelsContainer = document.getElementById('aiLevelsContainer');

		btnPvp.addEventListener("click", (event) => this.selectGamemode(event, "pvp"));
		btnAI.addEventListener("click", (event) => this.selectGamemode(event, "AI"));
		btnTournament.addEventListener("click", (event) => this.selectGamemode(event, "tournament"));
		
		switch (this.gamemode) {
			case "pvp":
				pDescription.innerHTML = "Two players play against each other, one playing the left paddle, the other playing the right paddle.";
				break;
			case "AI":
				pDescription.innerHTML = "The player controls the left paddle and competes against an AI opponent.";
				aiLevelsContainer.innerHTML = `
					<div class="row justify-content-center">
						<div class="col-6 d-flex justify-content-end">
							<button role="button" class="btn btn-lg text-white btn-filled" id="btnEasy">easy</button>
						</div>
						<div class="col-6 d-flex justify-content-start">
							<button role="button" class="btn btn-lg text-white btn-filled" id="btnHard">hard</button>
						</div>
					</div>
				`;

				let btnEasy = document.getElementById('btnEasy');
				let btnHard = document.getElementById('btnHard');
				btnEasy.addEventListener("click", (event) => this.selectAIDifficulty(event, "easy"));
				btnHard.addEventListener("click", (event) => this.selectAIDifficulty(event, "hard"));

				const difficulties = {
					"easy": document.getElementById('btnEasy'),
					"hard": document.getElementById('btnHard'),
				}

				this.applySelectedSetting("pongAIDifficulty", difficulties);

				break;
			case "tournament":
				pDescription.innerHTML = "Multiple players compete against each other in a tournament.";
				break;
			default:
				break; 
		}

		if (this.gamestyle == "3D") {
			btnAI.disabled = true;
			btnTournament.disabled = true;
			let disclaimer = document.getElementById('disclaimer');
			disclaimer.innerHTML = "The only available gamemode for 3D game style is PvP.";
		}

		localStorage.setItem('pongGamemode', JSON.stringify(this.gamemode));

		this.settingsModal.show();

		const gamemodes = {
			"pvp": document.getElementById('btnPvp'),
			"AI": document.getElementById('btnAI'),
			"tournament": document.getElementById('btnTournament')
		}
		this.applySelectedSetting("pongGamemode", gamemodes);
	}

	showGamestyleConfig() {
		this.settingsModalContent.innerHTML = `
			<div class="modal-header">
				<h2 class="modal-title text-white w-100 text-center">game styles</h2>
			</div>
			<div class="modal-body">
				<div class="row justify-content-cfenter">
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
							<p class="text-white text-center" id="gamestyleDescription"></p>
							<p class="text-white text-center" id="availableGamemodes"></p>
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
				gamestyleDescription.innerHTML = "classic pong game.";
				availableGamemodes.innerHTML = "available gamemodes: all";
				break;
			case "enhanced":
				gamestyleDescription.innerHTML = "enhanced pong game with new physics and skills.";
				availableGamemodes.innerHTML = "available gamemodes: all";
				break;
			case "3D":
				gamestyleDescription.innerHTML = "3D pong game with classic rules.";
				availableGamemodes.innerHTML = "available gamemodes: PvP";
				break;
			default:
				break; 
		}

		localStorage.setItem('pongGamestyle', JSON.stringify(this.gamestyle));

		this.playersContainer
		this.settingsModal.show();

		const gamestyles = {
			"legacy": document.getElementById('btnLegacy'),
			"enhanced": document.getElementById('btnEnhanced'),
			"3D": document.getElementById('btn3D')
		}
		this.applySelectedSetting("pongGamestyle", gamestyles);
	}

	//#region EVENT LISTENERS HANDLERS

	selectGamemode(event, gamemode) {
		this.toastBody.innerHTML = "chosen gamemode: " + gamemode;
		this.toastBootstrap.show();
		this.gamemode = gamemode;
		localStorage.setItem('gamemode', JSON.stringify(this.gamemode));
		this.currentGamemodeLabel.innerHTML = this.gamemode;

		this.showGamemodeConfig();
		this.updatePlayersContainer();
	}

	selectGamestyle(event, gamestyle) {
		this.toastBody.innerHTML = "chosen game style: " + gamestyle;
		this.toastBootstrap.show();
		if (gamestyle == "3D") {
			this.lastGamemode = this.gamemode;
			this.gamemode = "pvp";
			this.currentGamemodeLabel.innerHTML = "current gamemode: " + this.gamemode;
		} 
		else if (this.gamestyle == "3D" && gamestyle != this.gamestyle) {
			this.gamemode = this.lastGamemode;
			this.currentGamemodeLabel.innerHTML = this.gamemode;
		}
		
		this.gamestyle = gamestyle;
		// TODO: change this to /pong3d
		this.btnStartGame.href = this.gamestyle == "3D" ? "/pong" : "/pong";
		localStorage.setItem('gamestyle', JSON.stringify(this.gamestyle));
		this.currentGamestyleLabel.innerHTML = this.gamestyle;

		this.showGamestyleConfig();
		this.updatePlayersContainer();
	}

	selectAIDifficulty(event, difficulty) {
		this.toastBody.innerHTML = "chosen AI difficulty: " + difficulty;
		this.toastBootstrap.show();
		this.aiDifficulty = difficulty;
		localStorage.setItem('pongAIDifficulty', JSON.stringify(this.aiDifficulty));
		this.showGamemodeConfig();
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
				case "lUp":
					this.toastBody.innerHTML = "Changed Left Paddle Move Up keybind to: " + event.code;
					this.keybinds.lUp = event.code;
					break;
				case "lDown":
					this.toastBody.innerHTML = "Changed Left Paddle Move Down keybind to: " + event.code;
					this.keybinds.lDown = event.code;
					break;
				case "lMini":
					this.toastBody.innerHTML = "Changed Left Paddle Minimize keybind to: " + event.code;
					this.keybinds.lMini = event.code;
					break;
				case "rUp":
					this.toastBody.innerHTML = "Changed Right Paddle Move Up keybind to: " + event.code;
					this.keybinds.rUp = event.code;
					break;
				case "rDown":
					this.toastBody.innerHTML = "Changed Right Paddle Move Down keybind to: " + event.code;
					this.keybinds.rDown = event.code;
					break;
				case "rMini":
					this.toastBody.innerHTML = "Changed Right Paddle Minimize keybind to: " + event.code;
					this.keybinds.rMini = event.code;
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

	// Add the "selected" class to to correct element based on the setting in the local storage
	// settingType is for example "pacmanSkin", "ghostSkin", "gamemode", "mapName", "pacmanTheme"
	// elementMapping is an object with the settings as keys and the elements as values
	// for example { "pacman": btnPacmanSkin, "pac-woman": btnPacWomanSkin }
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


}

