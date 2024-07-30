import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("Pacman");
    }

    async getHtml() {
        return (await fetch("static/html/pacman.html")).text();
    }

	async getJS() {
		return (await fetch("static/js/scripts/pacman.js")).text();
	}
}