import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("home");
    }

    async getHtml() {
        return `
			<nav class="nav">
				<a href="/" class="nav__link" data-link>Home</a>
				<a href="/pong" class="nav__link" data-link>Pong</a>
				<a href="/settings" class="nav__link" data-link>Settings</a>
			</nav>
            <h1>Welcome to the TranscenDingo gang</h1>
            <p>
                suuu
            </p>
        `;
    }
}