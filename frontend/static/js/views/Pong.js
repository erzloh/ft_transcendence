import AbstractView from "./AbstractView.js";

export default class Pong extends AbstractView {
    constructor() {
        super();
        this.setTitle("Pong");
    }

    async getHtml() {
        return (await fetch("/static/html/pong.html")).text();
    }

    async getJS() {
        return (await fetch("/static/js/scripts/pong/basicPong.js")).text();
    }
}

