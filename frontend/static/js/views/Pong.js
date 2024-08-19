import AbstractView from "./AbstractView.js";
import { PongGame }  from "../scripts/pong/pong.js";

export default class Pong extends AbstractView {
    constructor() {
        super();
        this.setTitle("satori - pong");
    }

    async getHtml() {
        return (await fetch("/static/html/pong.html")).text();
    }

	// async getJS() {
    //     const pongLogic = await (await fetch("static/js/scripts/pongLogic.js")).text();
    //     const AI = await (await fetch("static/js/scripts/network.js")).text();
    //     return pongLogic + AI;
	// 	// return (await fetch("static/js/scripts/pongLogic.js")).text();
	// }

	loadJS() {
		let pongGame = new PongGame();
		pongGame.initialize();
	}

	cleanUpEventListeners() {
		// for (const [event, listener] of Object.entries(eventListeners)) {
		// 	document.removeEventListener(event, listener);
		// }
	}

}