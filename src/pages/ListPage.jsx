import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from '../styles/Pages/ListPage.module.css';
import { fetchRollingList } from '../api/list-api';
import Header from '../components/common/Header';
import Button from '../components/common/Button';
import buttonStyles from '../styles/Button.module.css';

const CARD_WIDTH = 275;        // 카드 너비
const GAP = 20;                // 카드 사이 간격
const VISIBLE = 4;             // 한 화면에 보일 카드 수
const STEP = CARD_WIDTH + GAP; // 한 칸당 이동 거리

export default function ListPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [recentIndex, setRecentIndex] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  // 터치/드래그 제어
  const startX = useRef(0);
  const isDragging = useRef(false);

  // 태블릿 여부 판단
  const [isTablet, setIsTablet] = useState(window.innerWidth <= 1023);
  useEffect(() => {
    const onResize = () => setIsTablet(window.innerWidth <= 1023);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // 전체 데이터 한 번에 가져오기
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await fetchRollingList('like');
        setList(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [location.pathname]);

  // 인기순 & 최근순 목록
  const popularList = [...list]
  // 메시지를 가장 많이 받은 순으로 전체 정렬 후 상위 8개 추출
    .sort((a, b) => b.messageCount - a.messageCount)
    .slice(0, 8);
  const recentList = [...list]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 8);

  // 슬라이드 핸들러
  const prevSlide = useCallback(() => setCurrentIndex(i => Math.max(0, i - 1)), []);
  const nextSlide = useCallback(() => {
    setCurrentIndex(i => {
      const baseMax = popularList.length - VISIBLE;
      const maxIdx = isTablet ? baseMax + 1 : baseMax;
      return i < maxIdx ? i + 1 : i;
    });
  }, [popularList.length, isTablet]);

  const prevRecent = useCallback(() => setRecentIndex(i => Math.max(0, i - 1)), []);
  const nextRecent = useCallback(() => {
    setRecentIndex(i => {
      const baseMax = recentList.length - VISIBLE;
      const maxIdx = isTablet ? baseMax + 1 : baseMax;
      return i < maxIdx ? i + 1 : i;
    });
  }, [recentList.length, isTablet]);

  // 드래그 제어
  const onDragStart = e => {
    const x = e.touches?.[0].clientX ?? e.clientX;
    startX.current = x;
    isDragging.current = true;
  };
  const onDragEnd = (e, onNext, onPrev) => {
    if (!isDragging.current) return;
    const x = e.changedTouches?.[0].clientX ?? e.clientX;
    const diff = startX.current - x;
    if (diff > 50) onNext();
    else if (diff < -50) onPrev();
    isDragging.current = false;
  };

  // 배경 스타일 매핑
  const colorMap = { beige: '#FFE2AD', purple: '#ECD9FF', blue: '#B1E4FF', green: '#D0F5C3' };
  const imageMap = { beige: '/images/yellow-backimg.png', purple: '/images/purple-backimg.png', blue: '/images/blue-backimg.png', green: '/images/green-backimg.png' };
  const getBG = (url, color) =>
    url
      ? { backgroundImage: `url(${url})`, backgroundSize: 'cover', backgroundPosition: 'center' }
      : { backgroundColor: colorMap[color], backgroundImage: `url(${imageMap[color]})`, backgroundSize: '50%', backgroundPosition: 'bottom right' };

  // 공통 캐러셀 렌더링
  const renderCarousel = (data, idx, onPrev, onNext) => {
    const wrapperWidth = data.length * CARD_WIDTH + data.length * GAP;
    const containerWidth = VISIBLE * CARD_WIDTH + (VISIBLE - 1) * GAP;
    const maxTranslate = wrapperWidth - containerWidth;
    const move = Math.min(idx * STEP, maxTranslate);
    const baseMax = data.length - VISIBLE;
    const maxIdx = isTablet ? baseMax + 1 : baseMax;

    return (
      <>
        <div className={styles['list-page__card-container']}>
          {loading ? (
            <p>로딩 중...</p>
          ) : (
            <div
              className={styles['list-page__card-wrapper']}
              style={{ width: wrapperWidth, transform: `translateX(-${move}px)`, transition: 'transform 0.5s ease', cursor: isDragging.current ? 'grabbing' : 'grab' }}
              onTouchStart={onDragStart}
              onMouseDown={onDragStart}
              onTouchEnd={e => onDragEnd(e, onNext, onPrev)}
              onMouseUp={e => onDragEnd(e, onNext, onPrev)}
              onMouseLeave={() => (isDragging.current = false)}
            >
              {data.map(item => {
                // 상위 3개 프로필
                const profileImages = item.recentMessages.slice(0, 3);
                // 전체 메시지 수 또는 고유 작성자 수를 사용하려면 item.messageCount 또는 고유 set 사이즈로 교체
                const totalCount = item.messageCount; // API에서 제공하는 전체 작성자/메시지 수 사용
                const extraCount = totalCount - profileImages.length;

                return (
                  <div
                    key={item.id}
                    className={`${styles['list-page__card']} ${item.backgroundImageURL ? styles.imgOn : ''}`}
                    style={getBG(item.backgroundImageURL, item.backgroundColor)}
                    onClick={() => navigate(`/post/${item.id}`)}
                  >
                    <p className={styles['list-page__recipient']}>To. {item.name}</p>
                    <div className={styles['list-page__profile-wrap']}>                      
                      {profileImages.map((m, i) => (
                        <img
                          key={m.id}
                          src={m.profileImageURL || '/icons/profile.png'}
                          className={styles['list-page__profile-image']}
                          style={{ left: `${i * 16}px` }}
                        />
                      ))}
                      {extraCount > 0 && (
                        <span className={styles['list-page__profile-count']}>+{extraCount}</span>
                      )}
                    </div>
                    <p className={styles['list-page__count']}><span>{totalCount}</span>명이 작성했어요!</p>
                    <div className={styles['list-page__emoji-container']}>
                      {item.topReactions?.map((r, i) =>
                        r.count > 0 && (
                          <span key={i} className={styles['list-page__box-emoji']}>
                            <span className={styles['list-page__real-emoji']}>{r.emoji}</span>
                            <span className={styles['list-page__num-emoji']}>{r.count}</span>
                          </span>
                        )
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className={styles['carousel-buttons-container']}>
          <button onClick={onPrev} disabled={idx === 0} className={styles['carousel-button']}>❮</button>
          <button onClick={onNext} disabled={idx >= maxIdx} className={styles['carousel-button']}>❯</button>
        </div>
      </>
    );
  };

  return (
    <div className={styles['list-page']}>
      <Header />
      <div className={styles['list-page__popular']}>
        <h2>인기 롤링 페이퍼 🔥</h2>
        {renderCarousel(popularList, currentIndex, prevSlide, nextSlide)}
      </div>
      <div className={styles['list-page__recent']}>
        <h2>최근에 만든 롤링 페이퍼 ⭐️️</h2>
        {renderCarousel(recentList, recentIndex, prevRecent, nextRecent)}
      </div>
      <div className={styles['list-page__buttons']}>
        <Button onClick={() => navigate('/post')} className={buttonStyles.button__primary}>나도 만들어보기</Button>
      </div>
    </div>
  );
}
