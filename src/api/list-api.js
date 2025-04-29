const TEAM = '15-5';
const BASE_URL = `https://rolling-api.vercel.app/${TEAM}/recipients`;
const HEADERS = { 'Content-Type': 'application/json' };

/**
 * 전체 페이지를 순회하며 모든 결과를 합쳐 반환합니다.
 */
export async function fetchAllRollingList() {
  try {
    const limit = 100;   // 한 번에 가져올 개수 (API 허용 범위 내에서 조정)
    let page = 1;
    let allResults = [];

    while (true) {
      const offset = (page - 1) * limit;
      const res = await fetch(
        `${BASE_URL}/?team=${TEAM}&limit=${limit}&offset=${offset}`,
        { method: 'GET', headers: HEADERS }
      );
      if (!res.ok) throw new Error('롤링 페이지 리스트를 불러오는 데 실패했습니다.');

      const data = await res.json();
      allResults = allResults.concat(data.results);

      // 마지막 페이지면 중단
      if (data.results.length < limit) break;
      page++;
    }

    return { results: allResults };
  } catch (error) {
    console.error('API 요청 오류:', error);
    throw error;
  }
}

export async function fetchRollingList(sort) {
  try {
    const limit = 8;
    const offset = 0;
    const sortQuery = sort ? `&sort=${sort}` : '';

    const res = await fetch(
      `${BASE_URL}/?team=${TEAM}&limit=${limit}&offset=${offset}${sortQuery}`,
      { method: 'GET', headers: HEADERS }
    );
    if (!res.ok) throw new Error('롤링 페이지 리스트를 불러오는 데 실패했습니다.');

    const data = await res.json();
    return data.results;
  } catch (error) {
    console.error('API 요청 오류:', error);
    throw error;
  }
}
