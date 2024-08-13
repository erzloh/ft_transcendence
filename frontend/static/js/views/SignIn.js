import AbstractView from "./AbstractView.js";
import { signIn } from "../scripts/signIn.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("satori - sign in");
    }

    async getHtml() {
		return (await fetch("static/html/signIn.html")).text();
    }
	
	loadJS() {
		signIn();
	}
}