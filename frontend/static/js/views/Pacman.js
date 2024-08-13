import AbstractView from "./AbstractView.js";
import { pacman, eventListeners } from "../scripts/pacman.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("satori - pacman");
    }

    async getHtml() {
        return (await fetch("static/html/pacman.html")).text();
    }

	loadJS() {
		pacman();
	}

	cleanUpEventListeners() {
		for (const [event, listener] of Object.entries(eventListeners)) {
			document.removeEventListener(event, listener);
		}
	}
}