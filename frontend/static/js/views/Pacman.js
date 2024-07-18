import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("Pacman");
    }

    async getHtml() {
        return `
            <nav class="nav">
				<a href="/" class="nav__link" data-link>Home</a>
				<a href="/pong" class="nav__link" data-link>Pong</a>
                <a href="/pacman" class="nav__link" data-link>Pacman</a>
				<a href="/settings" class="nav__link" data-link>Settings</a>
			</nav>
            <h2>Pacman</h2>
            <button id="startBtn" onclick="StartGame()">Start game</button>
            <p></p>
            <canvas id="cvsPacman" width="300" height="300" style="border:2px solid #000000;"/>
            <script src="/static/js/scripts/Pacman.js"></script>
        `;
    }
}