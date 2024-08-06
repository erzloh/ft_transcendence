// This is the abstract class for all the views
export default class {
    constructor() {}

	// Sets the title of the page
    setTitle(title) {
        document.title = title;
    }

	// This is a method that will be overridden by the child classes
	// Returns the HTML content of the view
	// This method is asynchronous because it may need to fetch data from an API
    async getHtml() {
        return "";
    }

	// This is a method that will be overridden by the child classes
	// Calls a function that contains the JavaScript code for the view
	loadJS() {}

	// This is a method that will be overridden by the child classes
	// Removes all the event listeners attached to the document that were added by the view 
	cleanUpEventListeners() {}
}