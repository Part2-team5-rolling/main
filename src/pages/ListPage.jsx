import { useEffect, useState } from 'react';
import styles from '../styles/Pages/ListPage.module.css';
import { fetchRollingList } from '../api/list-api';


function ListPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadList = async () => {
      try {
        const data = await fetchRollingList(1); // 팀명과 페이지 파라미터를 API 명세에 맞게 사용해야 합니다.
        setList(data.results); // API 응답의 results 사용
      } catch (error) {
        console.error('롤링 리스트 불러오기 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadList();
  }, []);

  return (
    <div className={styles.listContainer}>
      <div className={styles.listPopular}>
        <h2>인기 롤링 페이퍼 🔥</h2>
        {loading ? (
          <p>로딩 중...</p>
        ) : (
          <div className={styles.cardContainer}>
            {/* list.map을 사용하여 각 롤링 페이퍼 항목을 렌더링 */}
            {list.map((item) => (
              <div
                key={item.id}
                className={styles.cardList}
                style={{
                  backgroundColor: item.backgroundColor || 'white', // 배경 색상
                  backgroundImage: item.backgroundImageURL
                    ? `url(${item.backgroundImageURL})`
                    : 'none', // 배경 이미지
                  backgroundSize: 'cover', // 배경 이미지 크기 조정
                }}
              >
                <p className={styles.recipient}>To. {item.recipient}</p> {/* 수신자 이름 표시 */}
                <div className={styles.profileWrap}>
                  {/* 최근 메시지에서 "보낸 사람 이름"을 제외하고 프로필 이미지만 표시 */}
                  {item.recentMessages.slice(0, 3).map((msg) => (
                    <img
                      key={msg.id}
                      src={msg.profileImageURL || '/public/icons/profile.png'}
                      className={styles.profileImage}
                    />
                  ))}
                </div>
                <p className={styles.count}>
                  {item.recentMessages.length}명이 작성했어요!
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className={styles.recent}>
        <h2>최근에 만든 롤링 페이퍼 ⭐️️</h2>
      </div>
    </div>
    
  );
}

export default ListPage;
