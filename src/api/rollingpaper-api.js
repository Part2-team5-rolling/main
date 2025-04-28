const TEAM = '15-5';
const BASE_URL = `https://rolling-api.vercel.app/${TEAM}`;

export const createRecipient = async ({ name, backgroundColor, backgroundImageURL }) => {
  if (!name || (!backgroundColor && !backgroundImageURL)) {
    throw new Error("name과 background(컬러 또는 이미지) 선택은 필수입니다.");
  }

  /*const colorMap = {
    'beige': '#FFE2AD',
    'purple': '#ECD9FF',
    'blue': '#B1E4FF',
    'green': '#D0F5C3',
  };

  if (colorMap[backgroundColor]) {
    backgroundColor = colorMap[backgroundColor];
  }

  if (!Object.values(colorMap).includes(backgroundColor)) {
    throw new Error(`${backgroundColor}는 유효한 색상 코드가 아닙니다.`);
  } */

  const body = {
    name,
    backgroundColor,
    backgroundImageURL
  };

  try {
    const response = await fetch(`${BASE_URL}/recipients/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`생성 실패! 상태 코드: ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.error("에러 발생:", err);
    throw err;
  }
};