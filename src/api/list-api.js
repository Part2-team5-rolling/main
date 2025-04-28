const BASE_URL = 'https://rolling-api.vercel.app';

/**
 * 더미 롤링페이퍼 목록 데이터
 */
const dummyData = {
  count: 6,  // 더미 데이터 갯수를 6으로 변경
  next: null,
  previous: null,
  results: [
    {
      id: 1,
      title: '졸업 축하해요 🎓',
      recipient: '오사랑',
      backgroundColor: '#FFE2AD', // 배경색
      backgroundImageURL: '/images/graduation-bg.jpg', // 배경 이미지 URL
      recentMessages: [
        {
          id: 101,
          sender: '김철수',
          profileImageURL: '/public/images/profile3.png',
          relationship: '친구',
          reactions: ['👍', '😄', '🎉'], // 이모지 추가
        },
      ],
    },
    {
      id: 2,
      title: '생일 축하합니다 🎉',
      recipient: '김보경',
      backgroundColor: '#BCE6FF',
      backgroundImageURL: '/images/birthday-bg.jpg',
      recentMessages: [
        {
          id: 102,
          sender: '오사랑',
          profileImageURL: '/public/images/profile2.png',
          relationship: '동료',
          reactions: ['😍', '🥳'], // 이모지 추가
        },
        {
          id: 103,
          sender: '김준우',
          profileImageURL: null,
          relationship: '지인',
          reactions: ['😊', '💖'], // 이모지 추가
        },
      ],
    },
    {
      id: 3,
      title: '감사했어요!',
      recipient: 'Team5',
      backgroundColor: '#E5D4F4',
      backgroundImageURL: null, // 배경 이미지가 없을 경우 null
      recentMessages: [
        {
          id: 104,
          sender: '김동한',
          profileImageURL: null,
          relationship: '친구',
          reactions: ['😇', '💖'], // 이모지 추가
        },
        {
          id: 105,
          sender: '김준우',
          profileImageURL: null,
          relationship: '지인',
          reactions: ['😇', '😍', '🥳'], // 이모지 추가
        },
        {
          id: 106,
          sender: '오사랑',
          profileImageURL: null,
          relationship: '지인',
          reactions: ['👍', '😄', '😇'], // 이모지 추가
        },
        {
          id: 107,
          sender: '이한빈',
          profileImageURL: null,
          relationship: '지인',
          reactions: ['👍', '😄'], // 이모지 추가
        },
      ],
    },
    {
      id: 4,
      title: '결혼 축하해요 💍',
      recipient: '정현수',
      backgroundColor: '#D4F4DD',
      backgroundImageURL: '/images/wedding-bg.jpg',
      recentMessages: [
        {
          id: 108,
          sender: '박정우',
          profileImageURL: '/public/images/profile2.png',
          relationship: '친구',
          reactions: ['🎉', '💍', '👰'], // 이모지 추가
        },
        {
          id: 109,
          sender: '김지혜',
          profileImageURL: null,
          relationship: '가족',
          reactions: ['🥰', '😍'], // 이모지 추가
        },
      ],
    },
    {
      id: 5,
      title: '새해 복 많이 받으세요 🎊',
      recipient: '김윤아',
      backgroundColor: '#D4F4DD',
      backgroundImageURL: '/images/newyear-bg.jpg',
      recentMessages: [
        {
          id: 110,
          sender: '이준호',
          profileImageURL: '/public/images/profile2.png',
          relationship: '친구',
          reactions: ['🎉', '🍾', '🥂'], // 이모지 추가
        },
        {
          id: 111,
          sender: '송민재',
          profileImageURL: null,
          relationship: '동료',
          reactions: ['😊', '🥳'], // 이모지 추가
        },
      ],
    },
    {
      id: 6,
      title: '축하합니다 🎉',
      recipient: '최지훈',
      backgroundColor: '#BCE6FF',
      backgroundImageURL: '/images/celebration-bg.jpg',
      recentMessages: [
        {
          id: 112,
          sender: '한상욱',
          profileImageURL: '/public/images/profile1.png',
          relationship: '동료',
          reactions: ['👏', '😄', '🥳'], // 이모지 추가
        },
        {
          id: 113,
          sender: '박현지',
          profileImageURL: '/public/images/profile3.png',
          relationship: '친구',
          reactions: ['💖', '🥰'], // 이모지 추가
        },
      ],
    },
  ],
};

// 개발 중에는 true, 실제 API 연동 시 false 로 전환
const useMock = true;

/**
 * 롤링페이퍼 리스트 가져오기
 * @param {number} page - 페이지 번호
 * @returns {Promise<object>} - 롤링 리스트 데이터
 */
export const fetchRollingList = async (page = 1) => {
  if (useMock) {
    console.log('!CHECK! Dummy data fetch 시작');
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('!CHECK! Dummy data fetch 완료');
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
