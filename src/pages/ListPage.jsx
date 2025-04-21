import { useEffect, useState } from 'react';
import styles from '../styles/Pages/ListPage.module.css';
import { fetchRollingList } from '../api/list-api';

function ListPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  // 이모지 갯수를 계산하는 함수
  const getEmojiCount = (reactions) => {
    const emojiCount = reactions.reduce((acc, emoji) => {
      acc[emoji] = (acc[emoji] || 0) + 1;  // 이모지의 빈도수를 계산
      return acc;
    }, {});
    return emojiCount;
  };

  useEffect(() => {
    const loadList = async () => {
      try {
        const data = await fetchRollingList(1); // 페이지 번호를 API 명세에 맞게 넘겨줍니다.
        setList(data.results); // API 응답의 results 사용
      } catch (error) {
        console.error('롤링 리스트 불러오기 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadList();
  }, []);

  // 각 받은 사람 별로 이모지 갯수 계산
  const getReactionsByRecipient = () => {
    const reactionsByRecipient = {};

    list.forEach((item) => {
      item.recentMessages.forEach((msg) => {
        const recipient = item.recipient;

        // 해당 받은 사람의 reactions 계산
        if (!reactionsByRecipient[recipient]) {
          reactionsByRecipient[recipient] = [];
        }
        reactionsByRecipient[recipient].push(...msg.reactions); // reactions 배열을 통합
      });
    });

    // 받은 사람 별로 이모지 갯수 계산
    Object.keys(reactionsByRecipient).forEach((recipient) => {
      reactionsByRecipient[recipient] = getEmojiCount(reactionsByRecipient[recipient]);
    });

    return reactionsByRecipient;
  };

  const reactionsByRecipient = getReactionsByRecipient(); // 받은 사람 별 이모지 갯수

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
                  {item.recentMessages.slice(0, 3).map((msg, index) => (
                    <img
                      key={msg.id}
                      src={msg.profileImageURL || '/public/icons/profile.png'}    // 프로필 이미지 URL
                      className={styles.profileImage}
                      style={{ left: `${index * 16}px` }} // 각 이미지를 겹치게 하면서 오른쪽으로 조금씩 밀어줍니다.
                    />
                  ))}
                  {item.recentMessages.length > 3 && (
                    <span className={styles.profileCount}>
                      +{item.recentMessages.length - 3}
                    </span>
                  )}
                </div>

                <p className={styles.count}>
                  <span>{item.recentMessages.length}</span>명이 작성했어요!
                </p>

                {/* 해당 받은 사람의 이모지 갯수 표시 */}
                <div className={styles.emojiContainer}>
                  {/* 이모지 갯수를 내림차순으로 정렬 후 최대 3개까지만 표시 */}
                  {Object.entries(reactionsByRecipient[item.recipient] || {})
                    .sort((a, b) => b[1] - a[1]) // 이모지 갯수 기준 내림차순 정렬
                    .slice(0, 3) // 최대 3개 이모지만 표시
                    .map(([emoji, count], index) => (
                      <span key={index} className={styles.emojiWithCount}>
                        {emoji} <span className={styles.emojiCount}>{count}</span>
                      </span>
                    ))}
                </div>
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
