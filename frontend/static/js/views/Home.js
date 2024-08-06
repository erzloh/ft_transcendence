import AbstractView from "./AbstractView.js";
import { home, eventListeners } from "../scripts/home.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("home");
    }

    async getHtml() {
		return (await fetch("static/html/home.html")).text();
    }
	
	loadJS() {
		home();
	}

	cleanUpEventListeners() {
		for (const [event, listener] of Object.entries(eventListeners)) {
			document.removeEventListener(event, listener);
		}
	}
}