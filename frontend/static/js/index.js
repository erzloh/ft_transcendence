// ------------------------------- IMPORT THE VIEWS -------------------------------
// A view is a class containing the HTML and JS of a page
import Home from "./views/Home.js";
import Pong from "./views/Pong.js";
import Settings from "./views/Settings.js";
import Pacman from "./views/Pacman.js";
import NotFound from "./views/NotFound.js";
import Games from "./views/Games.js";
import Profile from "./views/Profile.js";

// ------------------------------- THE APP STARTS HERE -------------------------------
// When the DOM is loaded, call the router function
document.addEventListener("DOMContentLoaded", () => {
	router();
});

// ------------------------------- ROUTING -------------------------------
// Array that contains all routes where each route has a path and a view
const routes = [
	{ path: "/", view: Home },
	{ path: "/pong", view: Pong },
	{ path: "/pacman", view: Pacman },
	{ path: "/settings", view: Settings },
	{ path: "/games", view: Games },
	{ path: "/profile", view: Profile }
];

// Loads the view (HTML and JS) in the div with id "app" according to the current path
const router = async () => {
	// Test if the current path is in the routes array
	let match = routes.find(route => route.path === location.pathname);

	// If the current path is not in the routes array, set the match to the NotFound view
    if (!match) {
		match = { path: "", view: NotFound };
    }

	// Create a new instance of the view
    const view = new match.view();

	// Load the HTML of the view in the app div
    document.querySelector("#app").innerHTML = await view.getHtml();

	// Load the JS of the view
	await loadScript(view);

	// Overwrite the default behavior of the links to not reload the page
	attachEventListenersToLinks();

	// Animate letters
	animateLetters();
};

// Function to attach event listeners to the links
// Overwrite the default behavior of the links (<a> tags)
// When a link is clicked, the navigateTo function is called
// The navigateTo function changes the URL and calls the router function 
// to load the new view without reloading the page.
const attachEventListenersToLinks = () => {
	// Select all links with the attribute data-link
	const links = document.querySelectorAll('[data-link]');

	// Attach event listener to each link
	links.forEach(link => {
		link.addEventListener("click", e => {
			e.preventDefault();
			navigateTo(link.href);
		});
	});
};

// This is a workaround to execute the JS content of the view
// The JS has to be adaded to the DOM as a script element to be executed
// Just adding JS in the script tag like with HTML and innerText doesn't work
const loadScript = async (view) => {
	// Remove the old script element
	const oldScript = document.getElementById('dynamic-script');
	if (oldScript) {
		oldScript.remove();
	}

	// Create a new script element
	const newScript = document.createElement('script');
	newScript.id = 'dynamic-script';

	// Create a function that contains the JS content
	// This is a workaround to remove comments from the JS content
	const scriptFunction = new Function(await view.getJS());
	const scriptContent = scriptFunction.toString();

	// Wrap the JS content in an Immediately Invoked Function Expression
	// This is a workaround to avoid polluting the global scope
	newScript.textContent = `(${scriptContent})()`;

	// Append the new script element to the body
	// This is needed to execute the new JS content
	document.body.appendChild(newScript);
};

// ------------------------------- NAVIGATION -------------------------------
// Navigate to a new view
const navigateTo = url => {
	// Change the URL to the new URL and add a state to the history stack
    history.pushState(null, null, url);

	// Update the view
    router();
};

// Listen for the popstate event (back and forward buttons) and call the router function
window.addEventListener("popstate", router);

// ------------------------------- APPLY SETTINGS -------------------------------
// Apply the settings from the local storage
if (localStorage.getItem('prettyBgSetting') === 'true') {
	document.querySelector('.gradients-container').style.display = 'block';
}

// ------------------------------- FRONTEND EYE CANDIES -------------------------------
// Changing letter animation
const animateLetters = () => {
    const text = document.querySelector("[animated-letters]");
    if (!text) return;
	const letters = "abcdefghijklmnopqrstuvwxyz";
	const initialText = text.innerText;
    let interval = null;
    let iteration = 0;

	interval = setInterval(() => {
		text.innerText = text.innerText
			.split("")
			.map((letter, index) => {
				if (index < iteration) {
					return initialText[index];
				}
				return letters[Math.floor(Math.random() * 26)];
			})
			.join("");

		if (iteration >= initialText.length) { 
			clearInterval(interval);
		}

		iteration += 1 / 3;
	}, 30);
};

// Interactive bubble
document.addEventListener('DOMContentLoaded', () => {
	const interBubble = document.querySelector('.interactive');
	if (!interBubble) return;

    let curX = window.innerWidth / 2;
    let curY = window.innerHeight / 2;
    let tgX = 0;
    let tgY = 0;

    function move() {
        curX += (tgX - curX) / 20;
        curY += (tgY - curY) / 20;
        interBubble.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
        requestAnimationFrame(() => {
            move();
        });
    }

    window.addEventListener('mousemove', (event) => {
        tgX = event.clientX;
        tgY = event.clientY;
    });

    move();
});