import AbstractView from "./AbstractView.js";
import { pongStatistics } from "../scripts/pongStatistics.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("satori - pong statistics");
    }

    async getHtml() {
        return (await fetch("static/html/pongStatistics.html")).text();
    }

    async loadJS() {
        pongStatistics();
    }
}
