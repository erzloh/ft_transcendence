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

	async getJS() {
		return "";
	}
}