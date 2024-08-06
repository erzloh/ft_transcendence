import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("games");
    }

    async getHtml() {
		return (await fetch("static/html/games.html")).text();
    }
}