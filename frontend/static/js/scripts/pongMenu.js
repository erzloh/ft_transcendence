export let eventListeners = { }

export class PongMenu {
	constructor () {
		this.keysButton = document.getElementById('btnKeys');
		this.settingsModal = new bootstrap.Modal(document.getElementById('settingsModal'));
		this.settingsModalContent = document.getElementById('settingsModalContent');
		this.leftPaddleUsernameLabel = document.getElementById('leftPaddleName');
		this.leftPaddleInput = document.getElementById('leftPaddleInput');
		this.rightPaddleUsernameLabel = document.getElementById('rightPaddleName');
		this.rightPaddleInput = document.getElementById('rightPaddleInput');

		this.toastNotification = document.getElementById('liveToast');
		this.toastBootstrap = bootstrap.Toast.getOrCreateInstance(this.toastNotification);
		this.toastBody = document.getElementById('toastBody');

		this.boundKeyDownSettings = this.keyDownSettings.bind(this);

		this.waitForKey = false;
		this.waitingKey = "";

		const usernamesString = localStorage.getItem('pongUsernames');
		this.usernames = usernamesString ? JSON.parse(usernamesString) : {
			left: "Player1", right: "Player2"
		};

		this.leftPaddleUsernameLabel.innerHTML = this.usernames.left;
		this.rightPaddleUsernameLabel.innerHTML = this.usernames.right;

		// const themeString = localStorage.getItem('pongTheme');
		// this.theme = themeString ? JSON.parse(themeString) : {
		// 	backgroundColor : 'rgb(10, 0, 20)', ghostWallColor1 : 'rgb(110, 55, 225)', ghostWallColor2 : 'rgb(75, 20, 200)',
		// 	wallColor : 'rgb(60, 0, 120)', dotColor : 'rgb(105,55,165)', glowColor : 'rgb(145,85,210)'
		// };

		const keybindsString = localStorage.getItem('pongKeybinds');
		this.keybinds = keybindsString ? JSON.parse(keybindsString) : {
			lUp : 'KeyW', lDown : 'KeyS', rUp : 'ArrowUp', rDown : 'ArrowDown'
		};

		this.leftPaddleInput.addEventListener('keypress', (event) => this.leftPaddleInputHandle(event));
		this.leftPaddleInput.addEventListener('blur', (event) => this.leftPaddleInputHandle(event));
		this.rightPaddleInput.addEventListener('keypress', (event) => this.rightPaddleInputHandle(event));
		this.rightPaddleInput.addEventListener('blur', (event) => this.rightPaddleInputHandle(event));
	}

	leftPaddleInputHandle(event) {
		if (((event.type == 'keypress' && event.key === 'Enter') || event.type == 'blur') && this.leftPaddleInput.value != "") {
			this.usernames.left = this.leftPaddleInput.value;
			this.leftPaddleInput.value = ""; // Clear the input box
			this.leftPaddleUsernameLabel.innerHTML = this.usernames.left;

			this.toastBody.innerHTML = "Changed Left paddle username to: " + this.usernames.left;
			this.toastBootstrap.show();
		}
	}

	rightPaddleInputHandle(event) {
		if (((event.type == 'keypress' && event.key === 'Enter') || event.type == 'blur') && this.rightPaddleInput.value != "") {
			this.usernames.right = this.rightPaddleInput.value;
			this.rightPaddleInput.value = ""; // Clear the input box
			this.rightPaddleUsernameLabel.innerHTML = this.usernames.right;

			this.toastBody.innerHTML = "Changed Right paddle username to: " + this.usernames.right;
			this.toastBootstrap.show();
		}
	}

	Initialize() {
		// Add Event Listener to the Start Button
		this.keysButton.addEventListener("click", () => this.showKeysConfig());

		document.addEventListener("keydown", this.boundKeyDownSettings);
		eventListeners["keydown"] = this.boundKeyDownSettings;

		document.getElementById('startGameButton').addEventListener('click', (event) => {
			event.preventDefault();
			localStorage.setItem('pongKeybinds', JSON.stringify(this.keybinds));
			localStorage.setItem('pongTheme', JSON.stringify(this.theme));
			localStorage.setItem('pongUsernames', JSON.stringify(this.usernames))
			window.location.href = "/pong";
		});
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
									<label role="button" class="text-white" style="border: 2px solid #260045; padding: 1px 5px;" id="lUp">${this.keybinds.lUp !== "" ? this.keybinds.lUp : "none"}</label>
								</div>
							</div>
							<div class="row justify-content-center text-center mt-2">
								<div class="col-6 d-flex justify-content-end">
									<label class="text-white" style="padding: 3px 0px;">Move down</label>
								</div>
								<div class="col-6 d-flex justify-content-start">
									<label role="button" class="text-white" style="border: 2px solid #260045; padding: 1px 5px;" id="lDown">${this.keybinds.lDown !== "" ? this.keybinds.lDown : "none"}</label>
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
									<label role="button" class="text-white" style="border: 2px solid #260045; padding: 1px 5px;" id="rUp">${this.keybinds.rUp !== "" ? this.keybinds.rUp : "none"}</label>
								</div>
							</div>
							<div class="row justify-content-center text-center mt-2">
								<div class="col-6 d-flex justify-content-end">
									<label class="text-white" style="padding: 3px 0px;">Move down</label>
								</div>
								<div class="col-6 d-flex justify-content-start">
									<label role="button" class="text-white" style="border: 2px solid #260045; padding: 1px 5px;" id="rDown">${this.keybinds.rDown !== "" ? this.keybinds.rDown : "none"}</label>
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

		var btnLUp = document.getElementById('lUp');
		var btnLDown = document.getElementById('lDown');
		var btnRUp = document.getElementById('rUp');
		var btnRDown = document.getElementById('rDown');

		btnLUp.addEventListener("click", (event) => this.changeKeybind(event, "lUp", btnLUp));
		btnLDown.addEventListener("click", (event) => this.changeKeybind(event, "lDown", btnLDown))
		btnRUp.addEventListener("click", (event) => this.changeKeybind(event, "rUp", btnRUp));
		btnRDown.addEventListener("click", (event) => this.changeKeybind(event, "rDown", btnRDown));

		this.settingsModal.show();
	}

	showColorSchemeConfig() {
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

		var btnObsidian = document.getElementById('pObsidian');
        var btnAutumn = document.getElementById('pAutumn');
		var btnGarden = document.getElementById('pGarden');
        var btnSpacial = document.getElementById('pSpacial');

		btnObsidian.addEventListener("click", (event) => this.selectTheme(event, "obsidian"));
		btnAutumn.addEventListener("click", (event) => this.selectTheme(event, "autumn"));
		btnGarden.addEventListener("click", (event) => this.selectTheme(event, "garden"));
		btnSpacial.addEventListener("click", (event) => this.selectTheme(event, "spacial"));

		this.settingsModal.show();
	}

	//#region EVENT LISTENERS HANDLERS

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
			this.showKeysConfig();
		}
	}

	//#endregion

}

