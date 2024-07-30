import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("home");
    }

    async getHtml() {
		return (await fetch("static/html/home.html")).text();
    }

	async getJS() {
		return (await fetch("static/js/scripts/home.js")).text();
	}
}