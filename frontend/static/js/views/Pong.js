import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("Pong");
    }

    async getHtml() {
        return `
            <h1>Pong</h1>
            <p>so sick</p>
        `;
    }
}