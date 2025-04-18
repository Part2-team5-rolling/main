const BASE_URL = 'https://rolling-api.vercel.app';

/**
 * 더미 롤링페이퍼 목록 데이터
 */
const dummyData = {
  count: 3,
  next: null,
  previous: null,
  results: [
    {
      id: 1,
      title: '졸업 축하해요 🎓',
      recipient: '홍길동',
      backgroundColor: '#FFDFDF',
      recentMessages: [
        {
          id: 101,
          sender: '김철수',
          profileImageURL: null,
          relationship: '친구',
        },
      ],
    },
    {
      id: 2,
      title: '생일 축하합니다 🎉',
      recipient: '김보경',
      backgroundColor: '#DFFFD7',
      recentMessages: [
        {
          id: 102,
          sender: '이영희',
          profileImageURL: null,
          relationship: '동료',
        },
        {
          id: 103,
          sender: '박민수',
          profileImageURL: null,
          relationship: '지인',
        },
      ],
    },
    {
      id: 3,
      title: '감사했어요!',
      recipient: '최은지',
      backgroundColor: '#D7E7FF',
      recentMessages: [],
    },
  ],
};

// ✅ 개발 중에는 true, 실제 API 연동 시 false 로 전환
const useMock = true;

/**
 * 롤링페이퍼 리스트 가져오기
 * @param {number} page - 페이지 번호
 * @returns {Promise<object>} - 롤링 리스트 데이터
 */
export const fetchRollingList = async (page = 1) => {
  if (useMock) {
    // ✨ 더미 데이터 반환
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(dummyData);
      }, 500);
    });
  }

  try {
    const response = await fetch(`${BASE_URL}/list/?page=${page}`);
    if (!response.ok) {
      throw new Error('롤링 리스트를 불러오는 데 실패했습니다.');
    }
    return await response.json();
  } catch (error) {
    console.error('fetchRollingList 오류:', error);
    throw error;
  }
};
