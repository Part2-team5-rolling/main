async function getRollingData() {
	try {
		const response = await fetch('https://rolling-api.vercel.app/15-5/recipients/');
		if (!response.ok) {
			throw new Error(`HTTP error: ${response.status}`);
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error(error.message);
	}
}

export default getRollingData;
