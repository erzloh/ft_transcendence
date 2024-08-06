// ------------------------------- IMPORT THE VIEWS -------------------------------
// A view is a class containing the HTML and JS of a page
import Home from "./views/Home.js";
import Pong from "./views/Pong.js";
import Settings from "./views/Settings.js";
import Pacman from "./views/Pacman.js";
import NotFound from "./views/NotFound.js";
import Games from "./views/Games.js";
import Profile from "./views/Profile.js";
import SignIn from "./views/SignIn.js";

// ------------------------------- IMPORT VISUALS -------------------------------
import './visual/interactiveBg.js'
import { animateLetters } from './visual/effects.js'

// ------------------------------- CONFIGURE CONSTANTS -------------------------------
// Set the base URL of the website
export const BASE_URL = "https://localhost";

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
	{ path: "/profile", view: Profile },
	{ path: "/signin", view: SignIn }
];

// Store the current view
let view = null;

// Loads the view (HTML and JS) in the div with id "app" according to the current path
const router = async () => {
	// Test if the current path is in the routes array
	let match = routes.find(route => route.path === location.pathname);
	
	// If the current path is not in the routes array, set the match to the NotFound view
    if (!match) {
		match = { path: "", view: NotFound };
    }
	
	// Create a new instance of the view
    view = new match.view();
	
	// Load the HTML of the view in the app div
    document.querySelector("#app").innerHTML = await view.getHtml();

	// Load the JS of the view
	view.loadJS();

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

// ------------------------------- NAVIGATION -------------------------------
// Navigate to a new view
export const navigateTo = url => {
	// Clean up event listeners (that are attached to the document)
	view.cleanUpEventListeners();

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

