const BASE_URL = 'https://rolling-api.vercel.app/15-5';

export async function getRecipientsData() {
	try {
		const response = await fetch(`${BASE_URL}/recipients/`);
		if (!response.ok) {
			throw new Error(`HTTP error: ${response.status}`);
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error(error.message);
	}
}

export async function getRecipientsMessage(userId) {
	try {
		const response = await fetch(`${BASE_URL}/recipients/${userId}/messages`);
		if (!response.ok) {
			throw new Error(`HTTP error: ${response.status}`);
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error(error.message);
	}
}
