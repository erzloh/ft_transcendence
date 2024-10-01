import AbstractView from "./AbstractView.js";
// import { home } from "../scripts/home.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("satori - home");
    }

    async getHtml() {
		return (await fetch("static/html/home.html")).text();
    }
}