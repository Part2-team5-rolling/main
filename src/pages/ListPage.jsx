import { useEffect, useState } from 'react';
import styles from '../styles/Pages/ListPage.module.css';
import { fetchRollingList } from '../api/list-api';

function ListPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadList = async () => {
      try {
        const data = await fetchRollingList(1); // 페이지 번호를 API 명세에 맞게 넘겨줌
        setList(data.results); // API 응답의 results 사용
      } catch (error) {
        console.error('롤링 리스트 불러오기 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadList();
  }, []);

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

        // 받은 사람의 reactions 계산
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
    <div className={styles['list-page']}>
      <div className={styles['list-page__popular']}>
        <h2>인기 롤링 페이퍼 🔥</h2>
        {loading ? (
          <p>로딩 중...</p>
        ) : (
          <div className={styles['list-page__card-container']}>
            {/* list.map을 사용하여 각 롤링 페이퍼 항목을 렌더링 */}
            {list.map((item) => (
              <div
                key={item.id}
                className={styles['list-page__card']}
                style={{
                  backgroundColor: item.backgroundColor || 'white', // 배경 색상
                  backgroundImage: item.backgroundImageURL
                    ? `url(${item.backgroundImageURL})`
                    : 'none', // 배경 이미지
                  backgroundSize: 'cover', // 배경 이미지 크기 조정
                }}
              >
                <p className={styles['list-page__recipient']}>To. {item.recipient}</p> {/* 수신자 이름 표시 */}

                <div className={styles['list-page__profile-wrap']}>
                  {/* 최근 메시지에서 "보낸 사람 이름"을 제외하고 프로필 이미지만 표시 */}
                  {item.recentMessages.slice(0, 3).map((msg, index) => (
                    <img
                      key={msg.id}
                      src={msg.profileImageURL || '/public/icons/profile.png'}    // 프로필 이미지 URL
                      className={styles['list-page__profile-image']}
                      style={{ left: `${index * 16}px` }} // 각 이미지를 겹치게 하면서 오른쪽으로 조금씩 밀어줌
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

                {/* 해당 받은 사람의 이모지 갯수 표시 */}
                <div className={styles['list-page__emoji-container']}>
                  {/* 이모지 갯수를 내림차순으로 정렬 후 최대 3개까지만 표시 */}
                  {Object.entries(reactionsByRecipient[item.recipient] || {})
                    .sort((a, b) => b[1] - a[1]) // 이모지 갯수 기준 내림차순 정렬
                    .slice(0, 3) // 최대 3개 이모지만 표시
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
      <div className={styles['list-page__recent']}>
        <h2>최근에 만든 롤링 페이퍼 ⭐️️</h2>
      </div>
    </div>
  );
}

export default ListPage;
