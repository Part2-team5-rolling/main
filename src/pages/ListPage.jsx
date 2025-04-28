import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // 추가
import styles from '../styles/Pages/ListPage.module.css';
import { fetchRollingList } from '../api/list-api';
import Header from '../components/common/Header';
import Button from '../components/common/Button';
import buttonStyles from '../styles/Button.module.css';

function ListPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0); // 인기 롤링 페이퍼 인덱스
  const [recentIndex, setRecentIndex] = useState(0); // 최근 롤링 페이퍼 인덱스
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const loadList = async () => {
      try {
        const data = await fetchRollingList(1); // 페이지 번호를 API 명세에 맞게 넘겨줌
        setList(data.results); // 원본만 저장
      } catch (error) {
        console.error('롤링 리스트 불러오기 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadList();
  }, [location.pathname]); // 페이지 이동 시마다 다시 불러오기

  // 인기 롤링 페이퍼 정렬 (메시지 많은 순)
  const popularList = [...list].sort((a, b) => b.recentMessages.length - a.recentMessages.length);

  // 최근에 만든 롤링 페이퍼 정렬 (id 내림차순)
  const recentList = [...list].sort((a, b) => b.id - a.id);

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
      item.recentMessages.forEach((msg) => {
        const recipient = item.recipient;

        if (!reactionsByRecipient[recipient]) {
          reactionsByRecipient[recipient] = [];
        }
        reactionsByRecipient[recipient].push(...msg.reactions);
      });
    });

    Object.keys(reactionsByRecipient).forEach((recipient) => {
      reactionsByRecipient[recipient] = getEmojiCount(reactionsByRecipient[recipient]);
    });

    return reactionsByRecipient;
  };

  const reactionsByRecipient = getReactionsByRecipient();

  // 배경색에 맞는 이미지 반환 함수
  const getBackgroundImage = (backgroundColor) => {
    const colorImageMap = {
      '#FFE2AD': '/public/images/yellow-backimg.png',
      '#E5D4F4': '/public/images/purple-backimg.png',
      '#BCE6FF': '/public/images/blue-backimg.png',
      '#D4F4DD': '/public/images/green-backimg.png',
    };
    return colorImageMap[backgroundColor] || '';
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
                  className={styles['list-page__card']}
                  style={{
                    backgroundColor: item.backgroundColor || 'white',
                    backgroundImage: getBackgroundImage(item.backgroundColor)
                      ? `url(${getBackgroundImage(item.backgroundColor)})`
                      : 'none',
                    backgroundSize: '50%',
                    backgroundPosition: 'bottom right',
                  }}
                  onClick={() => handleCardClick(item.id)}
                >
                  <p className={styles['list-page__recipient']}>To. {item.recipient}</p>

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
              onClick={() => navigate(`/post/${item.id}`)}
            >
              {recentList.map((item) => (
                <div
                  key={item.id}
                  className={styles['list-page__card']}
                  style={{
                    backgroundColor: item.backgroundColor || 'white',
                    backgroundImage: getBackgroundImage(item.backgroundColor)
                      ? `url(${getBackgroundImage(item.backgroundColor)})`
                      : 'none',
                    backgroundSize: '50%',
                    backgroundPosition: 'bottom right',
                  }}
                  onClick={() => handleCardClick(item.id)}
                >
                  <p className={styles['list-page__recipient']}>To. {item.recipient}</p>

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
        <Button onClick={() => goToPage('/post')} className={buttonStyles.button__primary}>
          나도 만들어보기
        </Button>
      </div>

    </div>
  );
}

export default ListPage;
