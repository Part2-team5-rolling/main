import { useEffect, useState } from 'react';
import styles from '../styles/Pages/ListPage.module.css';
import { fetchRollingList } from '../api/list-api';


function ListPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadList = async () => {
      try {
        const data = await fetchRollingList(1);
        setList(data.results);
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
              <div key={item.id} className={styles.cardInfo}>
                <p className={styles.recipient}>To. {item.recipient}</p>
                <div className={styles.profileWrap}>
                  {/* 최근 메시지에서 "보낸 사람 이름"을 제외하고 프로필 이미지만 표시 */}
                  {item.recentMessages.slice(0, 3).map((msg) => (
                    <img
                      key={msg.id}
                      src={msg.profileImageURL || '/default-profile.png'}
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
