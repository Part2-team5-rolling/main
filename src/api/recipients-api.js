const BASE_URL = 'https://rolling-api.vercel.app/';
const TEAM = '15-5';

export async function getRecipientsData(id) {
	try {
		const response = await fetch(`${BASE_URL}${TEAM}/recipients/${id}/`);
		if (!response.ok) {
			throw new Error(`HTTP error: ${response.status}`);
		}
		const data = await response.json();

		return data;
	} catch (error) {
		console.error(error.message);
	}
}

export async function getRecipientsMessage(userId, offset, limit) {
	try {
		const response = await fetch(`${BASE_URL}${TEAM}/recipients/${userId}/messages/?offset=${offset}&limit=${limit}`);
		if (!response.ok) {
			throw new Error(`HTTP error: ${response.status}`);
		}
		const data = await response.json();
		console.log(data);

		return data;
	} catch (error) {
		console.error(error.message);
	}
}
