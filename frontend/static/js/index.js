import Home from "./views/Home.js";
import Pong from "./views/Pong.js";
import Settings from "./views/Settings.js";

// Array that contains all routes where each route has a path and a view
// A view is a class containing the HTML of a page
const routes = [
	{ path: "/", view: Home },
	{ path: "/pong", view: Pong },
	{ path: "/settings", view: Settings }
];

// When the DOM is loaded, add an event listener to all links
// When the DOM is loaded, call the router function
document.addEventListener("DOMContentLoaded", () => {
	// Overwrite the default behavior of the links (<a> tags)
	// When a link is clicked, the navigateTo function is called
	// The navigateTo function changes the URL and calls the router function 
	// to load the new view without reloading the page
	const links = document.querySelectorAll('[data-link]');
	links.forEach(link => {
		link.addEventListener("click", e => {
			e.preventDefault();
			navigateTo(link.href);
		});
	});

    router();
});

// Navigate to a new view
const navigateTo = url => {
	// Change the URL to the new URL and add a state to the history stack
    history.pushState(null, null, url);

	// Update the view
    router();
};


// Load the HTML of the view in the app div
const router = async () => {

	// Test if the current path is in the routes array
	let match = routes.find(route => route.path === location.pathname);

	// If the current path is not in the routes array, set the match to the first route
    if (!match) {
		match = routes[0];
    }

	// Create a new instance of the view
    const view = new match.view();

	// Load the HTML of the view in the app div
    document.querySelector("#app").innerHTML = await view.getHtml();
};

// Listen for the popstate event (back and forward buttons) and call the router function
window.addEventListener("popstate", router);