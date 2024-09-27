import { BASE_URL } from '../index.js';

export const isUserConnected = async () => {
	const response = await fetch(`${BASE_URL}/api/profile`);

	if (response.status === 401 || response.status === 400) {
		return (false);
	}
	return (true);
}
	