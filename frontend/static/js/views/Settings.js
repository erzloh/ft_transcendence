import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("Settings");
    }

    async getHtml() {
        return (await fetch("static/html/settings.html")).text();
    }

	async getJS() {
		return (await fetch("static/js/scripts/settings.js")).text();
	}
}