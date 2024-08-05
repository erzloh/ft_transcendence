import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("sign in");
    }

    async getHtml() {
		return (await fetch("static/html/signIn.html")).text();
    }

	async getJS() {
		return (await fetch("static/js/scripts/signIn.js")).text();
	}
}