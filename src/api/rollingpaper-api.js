const TEAM = '15-5';
const BASE_URL = `https://rolling-api.vercel.app/${TEAM}`;

export const createRecipient = async ({ name, backgroundColor }) => {
  const response = await fetch(`${BASE_URL}/recipients/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, backgroundColor }),
  });

  if (!response.ok) {
    throw new Error(`생성 실패! 상태 코드: ${response.status}`);
  }

  return await response.json();
};