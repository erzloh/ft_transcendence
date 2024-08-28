import { BASE_URL, navigateTo } from "../index.js"
import { updateTextForElem } from "../utils/languages.js";

// Function that will be called when the view is loaded
export async function friends () {
    // Make a call to the API to get all the users.
	// The response will be a JSON array where each element is a user.
	// Get the user-elements class element
	// Map through the response array and add a child to the user-elements for each element of the array.
	// If there are no users, display such a message.

	// Get the container that contains all the individual user containers
	const userElementsContainer = document.getElementById('user-elements');
	const friendElementsContainer = document.getElementById('friend-elements');

	// Get the current user's username
	const fillUsersContainter = async () => {
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

				// If the user list is empty
				if (users.length === 1) {
					userElementsContainer.innerHTML = `<div id="user-error" class="text-white" data-translate="no users"></div>`
					updateTextForElem(document.getElementById('user-error'), 'no users');
					return;
				}

				// Empty the container
				userElementsContainer.innerHTML = '';

				users.map(async user => {
					// Check that the user is not the current user
					if (user === current_username) {
						return;
					}

					// Check that the user is not already a friend
					const responseFriends = await fetch(`${BASE_URL}/api/friends_list`)
					const responseFriendsJSON = await responseFriends.json();
					const friends = responseFriendsJSON.friends;
					if (friends.find(friend => friend === user)) {
						return;
					}

					// Event Listener to add a friend
					const addFriend = async () => {
						console.log('calling addFriend');
						const response = await fetch(`${BASE_URL}/api/add_friend`, {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json'
							},
							body: JSON.stringify({
								username: user
							})
						});
						if (!response.ok) {
							console.log("couldn't send a friend request.");
						}
						await fillUsersContainter();
						await fillFriendsContainter();
					}

					// Request the user's profile picture
					// const responseImage = await fetch(`${BASE_URL}/api/user`)
					const url = 'static/assets/images/profile_pic_transparent.png';

					// Create the user element
					// Create the container that contains the profile pic and the username
					const userDiv = document.createElement('div');
					userDiv.className = 'd-flex align-items-center';

					// Create the profile picture img element
					const profilePic = document.createElement('img');
					profilePic.src = url;
					profilePic.alt = 'profile picture';
					profilePic.className = 'profile-pic-list';
					profilePic.id = 'avatar';

					// Create the user name paragraph element
					const userName = document.createElement('p');
					userName.className = 'm-0 ms-2';
					userName.textContent = user;

					// Append the profile picture and username
					userDiv.appendChild(profilePic);
					userDiv.appendChild(userName);

					// Create the plus icon img element
					const minusIcon = document.createElement('img');
					minusIcon.src = 'static/assets/UI/icons/plus.svg';
					minusIcon.alt = 'plus icon';
					minusIcon.className = 'plus-icon-list me-1';
					minusIcon.addEventListener('click', () => {
						addFriend();
					});

					// Append the plus icon to the main user element
					const userElement = document.createElement('div');
					userElement.className = 'd-flex justify-content-between align-items-center user-element';
					userElement.appendChild(userDiv);
					userElement.appendChild(minusIcon);

					// Append the whole user element to the user-elements container
					userElementsContainer.appendChild(userElement);

				});
			}
		}
	}
	

	// Same for the friend-elements
	// Get the list of all friends
	const fillFriendsContainter = async () => {
		const responseFriends = await fetch(`${BASE_URL}/api/friends_list`)
		if (responseFriends.status === 200) {
			const responseData = await responseFriends.json();
			const friends = responseData.friends;

			// If the friend list is empty
			if (friends.length === 0) {
				friendElementsContainer.innerHTML = `<div class="text-white friend-error" data-translate="no friends"></div>`
				updateTextForElem(document.querySelector('.friend-error'), 'no friends');

			}

			// Empty the container
			friendElementsContainer.innerHTML = '';

			friends.map(async friend => {

				// Event Listener to remove a friend
				const removeFriend = async () => {
					console.log('calling removeFriend');
					const response = await fetch(`${BASE_URL}/api/remove_friend`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({
							username: friend
						})
					});
					if (!response.ok) {
						console.log("couldn't send a friend removal request.");
					}
					await fillUsersContainter();
					await fillFriendsContainter();
				}

				// Request the friend's profile picture
				// const responseImage = await fetch(`${BASE_URL}/api/user`)
				const url = 'static/assets/images/profile_pic_transparent.png';

				// Create the friend element
				// Create the container that contains the profile pic and the friend name
				const friendDiv = document.createElement('div');
				friendDiv.className = 'd-flex align-items-center';

				// Create the profile picture img element
				const profilePic = document.createElement('img');
				profilePic.src = url;
				profilePic.alt = 'profile picture';
				profilePic.className = 'profile-pic-list';

				// Create the online status
				const onlineStatus = document.createElement('img');
				const onlineBool = true;
				onlineStatus.src = onlineBool ? 'static/assets/UI/icons/connected.svg' : 'static/assets/UI/icons/disconnected.svg';
				onlineStatus.alt = 'online status';
				onlineStatus.className = 'online-icon-list ms-2';

				// Create the friend name paragraph element
				const userName = document.createElement('p');
				userName.className = 'm-0 ms-2';
				userName.textContent = friend;

				// Append everything to the parent container
				friendDiv.appendChild(profilePic);
				friendDiv.appendChild(userName);
				friendDiv.appendChild(onlineStatus);

				// Create the plus icon img element
				const minusIcon = document.createElement('img');
				minusIcon.src = 'static/assets/UI/icons/minus.svg';
				minusIcon.alt = 'minus icon';
				minusIcon.className = 'minus-icon-list me-1';
				minusIcon.addEventListener('click', () => {
					removeFriend();
				});

				// Append the plus icon to the main user element
				const friendElement = document.createElement('div');
				friendElement.className = 'd-flex justify-content-between align-items-center friend-element';
				friendElement.appendChild(friendDiv);
				friendElement.appendChild(minusIcon);

				// Append the whole user element to the user-elements container
				friendElementsContainer.appendChild(friendElement);

			});
		}
	}

	await fillUsersContainter();
	await fillFriendsContainter();
}


