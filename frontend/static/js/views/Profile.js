import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("profile");
    }

    async getHtml() {
		return (await fetch("static/html/profile.html")).text();
    }

	async getJS() {
		return (await fetch("static/js/scripts/profile.js")).text();
	}
}