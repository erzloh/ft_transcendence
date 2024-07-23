import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("home");
    }

    async getHtml() {
        // return `
			
		// 	<div class="container">
		// 		<div class="row justify-content-center">
		// 		<div class="col-12 text-center mb-4">
		// 			<h1>Title Here</h1>
		// 		</div>
		// 		<div class="col-12 text-center mb-2">
		// 			<a role="button" class="btn btn-primary" href="/pong" data-link>Play</button>
		// 		</div>
		// 		<div class="col-12 text-center">
		// 			<a role="button" class="btn btn-primary" href="/settings data-link>Settings</button>
		// 		</div>
		// 		</div>
		// 	</div>
        // `;
		return (await fetch("static/html/home.html")).text();
    }
}

{/* <nav class="nav">
	<a href="/" class="nav__link" data-link>Home</a>
	<a href="/pong" class="nav__link" data-link>Pong</a>
	<a href="/settings" class="nav__link" data-link>Settings</a>
</nav> */}