import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("home");
    }

    async getHtml() {
        return `
            <h1>Welcome to the TranscenDingo gang</h1>
            <p>
                suuu
            </p>
        `;
    }
}