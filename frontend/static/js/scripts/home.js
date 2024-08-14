// Function that will be called when the view is loaded
export function home () {
}

// --------------------------- Event Listener Functions ---------------------------
// (Only Event Listener that are attached to the document.
// Those attached to elements in the view are gonna be removed
// when the view changes anyway)

function printKey (event) {
	console.log(event.key);
	
}

// --------------------------- Export Event Listeners Object ---------------------------
export const eventListeners = {
	"keydown": printKey
}