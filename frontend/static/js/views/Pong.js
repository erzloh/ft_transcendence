import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("Pong");
    }

/*    async getHtml() {
        return `
			<nav class="nav">
				<a href="/" class="nav__link" data-link>Home</a>
				<a href="/pong" class="nav__link" data-link>Pong</a>
                <a href="/pacman" class="nav__link" data-link>Pacman</a>
				<a href="/settings" class="nav__link" data-link>Settings</a>
			</nav>
            <h1>Pong</h1>
            <p>so sick</p>
        `;
    }
	*/

	async getHtml() {
		return (await fetch("static/html/pong.html")).text();
    }

	async getJS() {
		return (await fetch("static/js/viewsJS/pongLogic.js")).text();
	}

}