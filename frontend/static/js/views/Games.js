import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("satori - games");
    }

    async getHtml() {
		return (await fetch("static/html/games.html")).text();
    }
}