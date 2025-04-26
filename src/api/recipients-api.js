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
		return data;
	} catch (error) {
		console.error(error.message);
	}
}

export async function deleteMessage(messageId) {
	try {
		const response = await fetch(`${BASE_URL}${TEAM}/messages/${messageId}/`, {
			method: 'DELETE',
		});

		if (response.status === 204) {
			console.log('메시지 삭제 성공');
			return true;
		} else {
			console.warn('메시지 삭제 실패: ', response.status);
		}
	} catch (error) {
		console.error('삭제 요청 에러: ', error);
	}
	return false;
}

export async function deleteRecipient(recipientId) {
	try {
		const response = await fetch(`${BASE_URL}${TEAM}/recipients/${recipientId}/`, {
			method: 'DELETE',
		});

		if (response.status === 204) {
			console.log('Recipient 삭제 성공');
			return true;
		} else {
			console.warn('Recipient 삭제 실패: ', response.status);
		}
	} catch (error) {
		console.error('삭제 요청 에러: ', error);
	}
	return false;
}

export async function getRecipientsReactions(id) {
	try {
		const response = await fetch(`${BASE_URL}${TEAM}/recipients/${id}/reactions/`);
		if (!response.ok) {
			throw new Error(`HTTP error: ${response.status}`);
		}
		const data = await response.json();

		return data;
	} catch (error) {
		console.error(error);
	}
}

export async function postRecipientsReactions(id, { emoji, type }) {
	if (!emoji || !type) {
		return;
	}
	try {
		const response = await fetch(`${BASE_URL}${TEAM}/recipients/${id}/reactions/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				emoji,
				type,
			}),
		});
		if (!response.ok) {
			throw new Error(`HTTP error: ${response.status}`);
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error(error);
	}
}
