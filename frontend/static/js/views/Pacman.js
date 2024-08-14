import AbstractView from "./AbstractView.js";
import { PacmanGame, eventListeners } from "../scripts/pacman.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("satori - pacman");
    }

    async getHtml() {
        return (await fetch("static/html/pacman.html")).text();
    }

	loadJS() {
		const game = new PacmanGame();
		game.Initialize();
	}

	cleanUpEventListeners() {
		for (const [event, listener] of Object.entries(eventListeners)) {
			document.removeEventListener(event, listener);
		}
	}
}