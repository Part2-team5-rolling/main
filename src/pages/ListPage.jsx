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

  // 태블릿(≤1023px) 여부
  const [isTablet, setIsTablet] = useState(window.innerWidth <= 1023);
  useEffect(() => {
    const onResize = () => setIsTablet(window.innerWidth <= 1023);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // 데이터 로딩
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchRollingList();
        setList(data.results);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [location.pathname]);

  // 정렬 & 슬라이스
  const popularList = [...list]
    .sort((a, b) => b.recentMessages.length - a.recentMessages.length)
    .slice(0, 8);
  const recentList = [...list]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 8);

  // 버튼 핸들러 (prev는 동일)
  const prevSlide = useCallback(() => {
    setCurrentIndex(i => Math.max(0, i - 1));
  }, []);
  const prevRecent = useCallback(() => {
    setRecentIndex(i => Math.max(0, i - 1));
  }, []);

  // next: 태블릿일 땐 +1 허용
  const nextSlide = useCallback(() => {
    setCurrentIndex(i => {
      const baseMax = popularList.length - VISIBLE;
      const maxIdx = isTablet ? baseMax + 1 : baseMax;
      return i < maxIdx ? i + 1 : i;
    });
  }, [popularList.length, isTablet]);

  const nextRecent = useCallback(() => {
    setRecentIndex(i => {
      const baseMax = recentList.length - VISIBLE;
      const maxIdx = isTablet ? baseMax + 1 : baseMax;
      return i < maxIdx ? i + 1 : i;
    });
  }, [recentList.length, isTablet]);

  // 드래그 시작/끝 핸들러
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

  // 배경용 맵
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
  const getBG = (url, color) =>
    url
      ? { backgroundImage: `url(${url})`, backgroundSize: 'cover', backgroundPosition: 'center' }
      : { backgroundColor: colorMap[color], backgroundImage: `url(${imageMap[color]})`, backgroundSize: '50%', backgroundPosition: 'bottom right' };

  // 렌더링 공통 캐러셀
  const renderCarousel = (data, idx, onPrev, onNext) => {
    // 실제 너비 계산
    const wrapperWidth = data.length * CARD_WIDTH + (data.length) * GAP;
    const containerWidth = VISIBLE * CARD_WIDTH + (VISIBLE - 1) * GAP;
    const maxTranslate = wrapperWidth - containerWidth;
    // idx*STEP 을 maxTranslate 이하로 캡핑
    const move = Math.min(idx * STEP, maxTranslate);

    // 버튼 disabled 기준
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
              style={{
                width: `${wrapperWidth}px`,
                transform: `translateX(-${move}px)`,
                transition: 'transform 0.5s ease',
                overflow: 'hidden',
                cursor: isDragging.current ? 'grabbing' : 'grab',
              }}
              onTouchStart={onDragStart}
              onMouseDown={onDragStart}
              onTouchEnd={e => onDragEnd(e, onNext, onPrev)}
              onMouseUp={e => onDragEnd(e, onNext, onPrev)}
              onMouseLeave={() => (isDragging.current = false)}
            >
              {data.map(item => (
                <div
                  key={item.id}
                  className={`${styles['list-page__card']} ${item.backgroundImageURL ? styles.imgOn : ''}`}
                  style={getBG(item.backgroundImageURL, item.backgroundColor)}
                  onClick={() => navigate(`/post/${item.id}`)}
                >
                  <p className={styles['list-page__recipient']}>To. {item.name}</p>
                  <div className={styles['list-page__profile-wrap']}>
                    {item.recentMessages.slice(0, 3).map((m, i) => (
                      <img
                        key={m.id}
                        src={m.profileImageURL || '/icons/profile.png'}
                        className={styles['list-page__profile-image']}
                        style={{ left: `${i * 16}px` }}
                      />
                    ))}
                    {item.recentMessages.length > 3 && (
                      <span className={styles['list-page__profile-count']}>+{item.recentMessages.length - 3}</span>
                    )}
                  </div>
                  <p className={styles['list-page__count']}>
                    <span>{item.recentMessages.length}</span>명이 작성했어요!
                  </p>
                  <div className={styles['list-page__emoji-container']}>
                    {item.topReactions?.map((r, i) => {
                      // count가 0이면 아무 것도 그리지 않음
                      if (r.count === 0) return null;
                      return (
                        <span key={i} className={styles['list-page__box-emoji']}>
                          <span className={styles['list-page__real-emoji']}>
                            {r.emoji}
                          </span>
                          <span className={styles['list-page__num-emoji']}>
                            {r.count}
                          </span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className={styles['carousel-buttons-container']}>
          <button onClick={onPrev} disabled={idx === 0} className={styles['carousel-button']}>
            ❮
          </button>
          <button onClick={onNext} disabled={idx >= maxIdx} className={styles['carousel-button']}>
            ❯
          </button>
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
        <Button onClick={() => navigate('/post')} className={buttonStyles.button__primary}>
          나도 만들어보기
        </Button>
      </div>
    </div>
  );
}
