import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from '../styles/Pages/ListPage.module.css';
import { fetchRollingList } from '../api/list-api';
import Header from '../components/common/Header';
import Button from '../components/common/Button';
import buttonStyles from '../styles/Button.module.css';

const colorMap = {
  beige: '#FFE2AD',
  purple: '#ECD9FF',
  blue: '#B1E4FF',
  green: '#D0F5C3',
};

const imageMap = {
  beige: '/images/yellow-backimg.png',
  purple: '/images/purple-backimg.png',
  blue: '/images/blue-backimg.png',
  green: '/images/green-backimg.png',
};

function ListPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [recentIndex, setRecentIndex] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

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
  }, [location.pathname]);

  const popularList = [...list]
    .sort((a, b) => b.recentMessages.length - a.recentMessages.length)
    .slice(0, 8);

  const recentList = [...list]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 8);

  const getColorCode = (backgroundColor) => {
    return colorMap[backgroundColor] || '';
  };

  const getBackgroundImage = (backgroundImageURL, backgroundColor) => {
    if (backgroundImageURL) {
      return {
        backgroundImage: `url(${backgroundImageURL})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        className: `${styles['imgOn']}`,
      };
    }

    return {
      backgroundColor: getColorCode(backgroundColor),
      backgroundImage: `url(${imageMap[backgroundColor]})`,
      backgroundSize: '50%',
      backgroundPosition: 'bottom right',
    };
  };

  const prevSlide = () => setCurrentIndex((prevIndex) => (prevIndex === 0 ? prevIndex : prevIndex - 1));
  const nextSlide = () => setCurrentIndex((prevIndex) => (prevIndex === popularList.length - 1 ? prevIndex : prevIndex + 1));
  const prevRecentSlide = () => setRecentIndex((prevIndex) => (prevIndex === 0 ? prevIndex : prevIndex - 1));
  const nextRecentSlide = () => setRecentIndex((prevIndex) => (prevIndex === recentList.length - 1 ? prevIndex : prevIndex + 1));

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
                  className={`${styles['list-page__card']} ${item.backgroundImageURL ? styles['imgOn'] : ''}`}
                  style={getBackgroundImage(item.backgroundImageURL, item.backgroundColor)}
                  onClick={() => handleCardClick(item.id)}
                >
                  <p className={styles['list-page__recipient']}>To. {item.name}</p>

                  <div className={styles['list-page__profile-wrap']}>
                    {item.recentMessages.slice(0, 3).map((msg, index) => (
                      <img
                        key={msg.id}
                        src={msg.profileImageURL || '/icons/profile.png'}
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
                    {/* topReactions의 이모지와 카운트 출력 */}
                    {item.topReactions && item.topReactions.map((reaction, index) => (
                      <span key={index} className={styles['list-page__box-emoji']}>
                        <span className={styles['list-page__real-emoji']}>{reaction.emoji}</span>
                        <span className={styles['list-page__num-emoji']}>{reaction.count}</span>
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
                  className={`${styles['list-page__card']} ${item.backgroundImageURL ? styles['imgOn'] : ''}`}
                  style={getBackgroundImage(item.backgroundImageURL, item.backgroundColor)}
                  onClick={() => handleCardClick(item.id)}
                >
                  <p className={styles['list-page__recipient']}>To. {item.name}</p>

                  <div className={styles['list-page__profile-wrap']}>
                    {item.recentMessages.slice(0, 3).map((msg, index) => (
                      <img
                        key={msg.id}
                        src={msg.profileImageURL || '/icons/profile.png'}
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
                    {/* topReactions의 이모지와 카운트 출력 */}
                    {item.topReactions && item.topReactions.map((reaction, index) => (
                      <span key={index} className={styles['list-page__box-emoji']}>
                        <span className={styles['list-page__real-emoji']}>{reaction.emoji}</span>
                        <span className={styles['list-page__num-emoji']}>{reaction.count}</span>
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
