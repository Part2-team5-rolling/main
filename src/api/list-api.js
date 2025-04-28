const TEAM = '15-5'; // 팀 이름 설정
const BASE_URL = `https://rolling-api.vercel.app/${TEAM}/recipients`; // API URL
const HEADERS = {
  'Content-Type': 'application/json',
};

// 롤링 리스트 가져오기
export async function fetchRollingList(page = 1, limit = 10) {
  try {
    const offset = (page - 1) * limit;

    const response = await fetch(`${BASE_URL}/?limit=${limit}&offset=${offset}&team=${TEAM}`, {
      method: 'GET',
      headers: HEADERS,
    });

    if (!response.ok) {
      throw new Error('롤링 리스트를 불러오는 데 실패했습니다.');
    }

    // JSON 응답 처리
    const data = await response.json();

    return data; // 결과 데이터를 반환 (results, pagination 정보 포함)
  } catch (error) {
    console.error('API 요청 오류:', error);
    throw error;
  }
}
