import { BASE_URL } from "../index.js"

// Function that will be called when the view is loaded
export async function friends () {
    // Make a call to the API to get all the users.
	// The response will be a JSON array where each element is a user.
	// Get the user-elements class element
	// Map through the response array and add a child to the user-elements for each element of the array.
	// If there are no users, display such a message.

	// Get the container that contains all the individual user containers
	const userElementsContainer = document.getElementById('user-elements');

	// Get the current user's username
	const responseProfile = await fetch(`${BASE_URL}/api/profile`);
	if (responseProfile.status === 200) {
		const responseData = await responseProfile.json();
		const user = responseData.user;
		const current_username = user.username;

		// Get the list of all users
		const responseUsers = await fetch(`${BASE_URL}/api/users_list`)
		if (responseUsers.status === 200) {
			const responseData = await responseUsers.json();
			const users = responseData.users;

			users.map(async user => {
				// Check that the user is not the current user
				if (user === current_username) {
					return;
				}

				// Request the user's profile picture
				// const responseImage = await fetch(`${BASE_URL}/api/user`)
				const url = 'static/assets/images/profile_pic_transparent.png';

				const userElement = document.createElement('div');
				userElement.className = 'd-flex justify-content-between align-items-center user-element';

				const userElementHTML = `
					<div class="d-flex align-items-center">
						<img src="${url}" alt="profile picture" class="profile-pic-list" id="avatar"/>
						<p class="m-0 ms-2">${user}</p>
					</div>
					<img src="static/assets/UI/icons/plus.svg" alt="plus icon" class="plus-icon-list me-1"/>
				`;

				userElement.innerHTML = userElementHTML;

				userElementsContainer.appendChild(userElement);
			});
		}
	}

	

	



	// Same for the friend-elements
}

