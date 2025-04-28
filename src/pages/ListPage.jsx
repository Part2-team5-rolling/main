import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from '../styles/Pages/ListPage.module.css';
import { fetchRollingList } from '../api/list-api';
import Header from '../components/common/Header';
import Button from '../components/common/Button';

const colorMap = {
  beige: '#FFE2AD',
  purple: '#ECD9FF',
  blue: '#B1E4FF',
  green: '#D0F5C3',
};

const imageMap = {
  beige: '/public/images/yellow-backimg.png',
  purple: '/public/images/purple-backimg.png',
  blue: '/public/images/blue-backimg.png',
  green: '/public/images/green-backimg.png',
};

function ListPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0); // 인기 롤링 페이퍼 인덱스
  const [recentIndex, setRecentIndex] = useState(0); // 최근 롤링 페이퍼 인덱스
  const navigate = useNavigate();
  const location = useLocation();

  // API에서 데이터 가져오기
  useEffect(() => {
    const loadList = async () => {
      try {
        const data = await fetchRollingList(); // 모든 데이터를 가져옵니다.
        setList(data.results); // 가져온 데이터 저장
      } catch (error) {
        console.error('롤링 리스트 불러오기 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadList();
  }, [location.pathname]); // 페이지 이동 시마다 다시 불러오기

  // 인기 롤링 페이퍼 정렬 (메시지 많은 순, 최대 8개)
  const popularList = [...list]
    .sort((a, b) => b.recentMessages.length - a.recentMessages.length)
    .slice(0, 8); // 최대 8개만 추출

  // 최근에 만든 롤링 페이퍼 정렬 (생성 시간 기준, 최대 8개)
  const recentList = [...list]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // createdAt을 기준으로 정렬
    .slice(0, 8); // 최대 8개만 추출

  // 이모지 갯수를 계산하는 함수
  const getEmojiCount = (reactions) => {
    const emojiCount = reactions.reduce((acc, emoji) => {
      acc[emoji] = (acc[emoji] || 0) + 1;  // 이모지의 빈도수를 계산
      return acc;
    }, {});
    return emojiCount;
  };

  // 각 받은 사람 별로 이모지 갯수 계산
  const getReactionsByRecipient = () => {
    const reactionsByRecipient = {};

    list.forEach((item) => {
      item.recentMessages?.forEach((msg) => { // recentMessages가 없을 수 있으므로 안전하게 처리
        const recipient = item.recipient;

        // reactions가 존재하는지 확인
        if (msg.reactions) {
          if (!reactionsByRecipient[recipient]) {
            reactionsByRecipient[recipient] = [];
          }
          reactionsByRecipient[recipient].push(...msg.reactions);
        }
      });
    });

    Object.keys(reactionsByRecipient).forEach((recipient) => {
      reactionsByRecipient[recipient] = getEmojiCount(reactionsByRecipient[recipient]);
    });

    return reactionsByRecipient;
  };

  const reactionsByRecipient = getReactionsByRecipient();

  // 배경 색상 코드 가져오기
  const getColorCode = (backgroundColor) => {
    return colorMap[backgroundColor] || '';  // colorMap에서 색상 코드 가져오기
  };

  // 배경 이미지 URL을 설정하는 함수
  const getBackgroundImage = (backgroundImageURL, backgroundColor) => {
    if (backgroundImageURL) {
      return {
        backgroundImage: `url(${backgroundImageURL})`,
        backgroundSize: '100%',
        backgroundPosition: 'center',
        className: `${styles['imgOn']}`,  // backgroundImageURL이 있을 때 imgOn 클래스 추가
      };
    }

    // backgroundImageURL이 없으면 색상에 맞는 이미지를 사용
    return {
      backgroundColor: getColorCode(backgroundColor),  // 먼저 색상을 설정
      backgroundImage: `url(${imageMap[backgroundColor]})`, // 색상에 맞는 이미지 설정
      backgroundSize: '50%',
      backgroundPosition: 'bottom right',
    };
  };

  // 슬라이드를 왼쪽으로 이동하는 함수 (인기 롤링 페이퍼)
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => {
      return prevIndex === 0 ? prevIndex : prevIndex - 1;
    });
  };

  // 슬라이드를 오른쪽으로 이동하는 함수 (인기 롤링 페이퍼)
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => {
      return prevIndex === popularList.length - 1 ? prevIndex : prevIndex + 1;
    });
  };

  // 슬라이드를 왼쪽으로 이동하는 함수 (최근 롤링 페이퍼)
  const prevRecentSlide = () => {
    setRecentIndex((prevIndex) => {
      return prevIndex === 0 ? prevIndex : prevIndex - 1;
    });
  };

  // 슬라이드를 오른쪽으로 이동하는 함수 (최근 롤링 페이퍼)
  const nextRecentSlide = () => {
    setRecentIndex((prevIndex) => {
      return prevIndex === recentList.length - 1 ? prevIndex : prevIndex + 1;
    });
  };

  // 카드 클릭 시 상세페이지 이동
  const handleCardClick = (id) => {
    navigate(`/post/${id}`);
  };

  const goToPage = (path) => {
    navigate(path);
  };

  return (
    <div className={styles['list-page']}>
      <Header />

      {/* 인기 롤링 페이퍼 */}
      <div className={styles['list-page__popular']}>
        <h2>인기 롤링 페이퍼 🔥</h2>
        <div className={styles['list-page__card-container']}>
          {loading ? (
            <p>로딩 중...</p>
          ) : (
            <div
              className={styles['list-page__card-wrapper']}
              style={{
                width: `calc(295px * ${popularList.length})`,
                transform: `translateX(-${currentIndex * 295}px)`,
                transition: 'transform 0.5s ease',
                overflow: 'hidden',
              }}
            >
              {popularList.map((item) => (
                <div
                  key={item.id}
                  className={`${styles['list-page__card']} ${item.backgroundImageURL ? styles['imgOn'] : ''}`}  // imgOn 클래스를 조건부로 추가
                  style={getBackgroundImage(item.backgroundImageURL, item.backgroundColor)} // 배경 이미지 및 색상 설정
                  onClick={() => handleCardClick(item.id)}
                >
                  <p className={styles['list-page__recipient']}>To. {item.name}</p>

                  <div className={styles['list-page__profile-wrap']}>
                    {item.recentMessages.slice(0, 3).map((msg, index) => (
                      <img
                        key={msg.id}
                        src={msg.profileImageURL || '/public/icons/profile.png'}
                        className={styles['list-page__profile-image']}
                        style={{ left: `${index * 16}px` }}
                      />
                    ))}
                    {item.recentMessages.length > 3 && (
                      <span className={styles['list-page__profile-count']}>
                        +{item.recentMessages.length - 3}
                      </span>
                    )}
                  </div>

                  <p className={styles['list-page__count']}>
                    <span>{item.recentMessages.length}</span>명이 작성했어요!
                  </p>

                  <div className={styles['list-page__emoji-container']}>
                    {Object.entries(reactionsByRecipient[item.recipient] || {})
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 3)
                      .map(([emoji, count], index) => (
                        <span key={index} className={styles['list-page__box-emojicount']}>
                          {emoji} <span className={styles['list-page__num-emojicount']}>{count}</span>
                        </span>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 캐러셀 버튼 */}
        <div className={styles['carousel-buttons-container']}>
          <button onClick={prevSlide} className={styles['carousel-button']} disabled={currentIndex === 0}>
            ❮
          </button>
          <button onClick={nextSlide} className={styles['carousel-button']} disabled={currentIndex === popularList.length - 4}>
            ❯
          </button>
        </div>
      </div>

      {/* 최근에 만든 롤링 페이퍼 */}
      <div className={styles['list-page__recent']}>
        <h2>최근에 만든 롤링 페이퍼 ⭐️️</h2>
        <div className={styles['list-page__card-container']}>
          {loading ? (
            <p>로딩 중...</p>
          ) : (
            <div
              className={styles['list-page__card-wrapper']}
              style={{
                width: `calc(295px * ${recentList.length})`,
                transform: `translateX(-${recentIndex * 295}px)`,
                transition: 'transform 0.5s ease',
                overflow: 'hidden',
              }}
            >
              {recentList.map((item) => (
                <div
                  key={item.id}
                  className={`${styles['list-page__card']} ${item.backgroundImageURL ? styles['imgOn'] : ''}`}  // imgOn 클래스를 조건부로 추가
                  style={getBackgroundImage(item.backgroundImageURL, item.backgroundColor)} // 배경 이미지 및 색상 설정
                  onClick={() => handleCardClick(item.id)}
                >
                  <p className={styles['list-page__recipient']}>To. {item.name}</p>

                  <div className={styles['list-page__profile-wrap']}>
                    {item.recentMessages.slice(0, 3).map((msg, index) => (
                      <img
                        key={msg.id}
                        src={msg.profileImageURL || '/public/icons/profile.png'}
                        className={styles['list-page__profile-image']}
                        style={{ left: `${index * 16}px` }}
                      />
                    ))}
                    {item.recentMessages.length > 3 && (
                      <span className={styles['list-page__profile-count']}>
                        +{item.recentMessages.length - 3}
                      </span>
                    )}
                  </div>

                  <p className={styles['list-page__count']}>
                    <span>{item.recentMessages.length}</span>명이 작성했어요!
                  </p>

                  <div className={styles['list-page__emoji-container']}>
                    {Object.entries(reactionsByRecipient[item.recipient] || {})
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 3)
                      .map(([emoji, count], index) => (
                        <span key={index} className={styles['list-page__box-emojicount']}>
                          {emoji} <span className={styles['list-page__num-emojicount']}>{count}</span>
                        </span>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 최근 롤링 페이퍼 캐러셀 버튼 */}
        <div className={styles['carousel-buttons-container']}>
          <button onClick={prevRecentSlide} className={styles['carousel-button']} disabled={recentIndex === 0}>
            ❮
          </button>
          <button onClick={nextRecentSlide} className={styles['carousel-button']} disabled={recentIndex === recentList.length - 4}>
            ❯
          </button>
        </div>
      </div>

      <div className={styles['list-page__buttons']}>
        <Button onClick={() => goToPage('/post')} className="button--primary">
          나도 만들어보기
        </Button>
      </div>
    </div>
  );
}

export default ListPage;
