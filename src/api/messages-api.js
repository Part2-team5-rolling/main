const TEAM = '15-5';
const BASE_URL = `https://rolling-api.vercel.app/${TEAM}/recipients`;
const HEADERS = {
	'Content-Type': 'application/json',
};

export async function createMessage(recipientId, { from, profileImageURL, relationship, content, font }) {
	const response = await fetch(`${BASE_URL}/${recipientId}/messages/`, {
		method: 'POST',
		headers: HEADERS,
		body: JSON.stringify({
			team: TEAM,
			recipientId: recipientId,
			sender: from,
			profileImageURL,
			relationship,
			content,
			font,
		}),
	});
	const body = await response.json();
	return body;
}
