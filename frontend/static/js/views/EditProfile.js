import AbstractView from "./AbstractView.js";
import { editProfile } from "../scripts/editProfile.js";
// import { eventListeners } from "../scripts/editProfile.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("satori - edit profile");
    }

    async getHtml() {
        return (await fetch("static/html/editProfile.html")).text();
    }

    loadJS() {
        editProfile();
    }

    // cleanUpEventListeners() {
    //  for (const [event, listener] of Object.entries(eventListeners)) {
    //      document.removeEventListener(event, listener);
    //  }
    // }
}
