import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("Not Found");
    }

    async getHtml() {
        return (await fetch("static/html/notFound.html")).text();
    }
}