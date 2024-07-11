import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("Not Found");
    }

    async getHtml() {
        return `
            <h1>404 Not Found</h1>
			<p>Sorry, the page you're looking for doesn't exist.</p>
        `;
    }
}