import AbstractView from "./AbstractView.js";
import { home, eventListeners } from "../scripts/home.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("satori - home");
    }

    async getHtml() {
		return (await fetch("static/html/home.html")).text();
    }
	
	loadJS() {
		home();
	}

	stopJS(){
		// No loop in this view
	}


	cleanUpEventListeners() {
		for (const [event, listener] of Object.entries(eventListeners)) {
			document.removeEventListener(event, listener);
		}
	}
}