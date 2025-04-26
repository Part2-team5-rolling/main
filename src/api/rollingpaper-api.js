const TEAM = '15-5';
const BASE_URL = `https://rolling-api.vercel.app/${TEAM}`;

export const createRecipient = async ({ name, backgroundColor }) => {

  if (!name || !backgroundColor) {
    throw new Error("name과 background 선택은 필수입니다.");
  }

  const body = { name, backgroundColor };

  const response = await fetch(`${BASE_URL}/recipients/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`생성 실패! 상태 코드: ${response.status}`);
  }

  return await response.json();
};