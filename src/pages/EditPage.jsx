import { useParams, useNavigate } from 'react-router-dom';
import PostHeader from '../components/Layout/post-components/PostHeader';
import { getRecipientsData, getRecipientsMessage, postRecipientsReactions, deleteMessage, deleteRecipient  } from '../api/recipients-api';
import { useEffect, useRef, useState } from 'react';
import style from '../styles/EditPage.module.css';
import Card from '../components/Card';
import PostModal from '../components/PostModal';
import ModalItem from '../components/ModalItem';
import Header from '../components/common/Header';
import deleteButtonImage from '../assets/edit-delete--card.png'

const colorMap = {
	beige: '#FFE2AD',
	purple: '#ECD9FF',
	blue: '#B1E4FF',
	green: '#D0F5C3',
};

const EditPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [headerLoad, setHeaderLoad] = useState(true);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [nextLoad, setNextLoad] = useState('');
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(5);
  const [showModal, setShowModal] = useState(false);
  const [modalItem, setModalItem] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState({});
  const [reLoading, setReLoading] = useState(false);
  const [EmojiSend, setEmojiSend] = useState({});
  const { id } = useParams();
  const { name, backgroundColor, backgroundImageURL, messageCount, reactionCount, recentMessages, topReactions } = data;
  const background =
    backgroundColor && backgroundImageURL
      ? { backgroundImage: `url(${backgroundImageURL})` }
      : { backgroundColor: colorMap[backgroundColor] };
  const targetRef = useRef(null);
  const renderRef = useRef(true);

	console.log('reLoad' + reLoading);
	console.log(data);

	const loadMore = () => {
		setOffset((prev) => prev + 5);
		if (limit > 6) {
			setLimit(6);
		}
		setLimit((prev) => prev + 1);
	};

	const HandleModalClick = (e) => {
		if (e.target.id === 'modal') {
			setShowModal(false);
		}
	};

	useEffect(() => {
		window.addEventListener('click', HandleModalClick);
		return () => {
			window.removeEventListener('click', HandleModalClick);
		};
	}, [showModal]);

	// 롤링 페이퍼 기본 데이터 불러오기
	useEffect(() => {
		const postDataCall = async () => {
			try {
				const dataCall = await getRecipientsData(id);
				setData(dataCall);
			} catch (error) {
				console.error('Post page 데이터 불러오기 실패!', error);
			} finally {
				setHeaderLoad(false);
			}
		};
		postDataCall();
	}, [id, reLoading]);

	// 해당 롤링 페이퍼에 보내진 메세지 가져오기
	useEffect(() => {
		const fetchData = async () => {
			try {
				const { next, results } = await getRecipientsMessage(id, offset, limit);
				const addNewMessage = [...messages, ...results];
				const filterMessage = addNewMessage.filter((item, i, arr) => i === arr.findIndex((obj) => obj.id === item.id));
				setMessages(filterMessage);
				setNextLoad(next);
			} catch (error) {
				console.error('messages 불러오기 실패', error);
			} finally {
				setLoading(true);
			}
		};
		fetchData();
	}, [id, offset, limit]);

	// 무한 스크롤 IntersectionObserver
	useEffect(() => {
		if (loading && nextLoad) {
			const observer = new IntersectionObserver(
				(entries) => {
					if (entries[0].isIntersecting) {
						loadMore();
					}
				},
				{ threshold: 0.8 }
			);
			observer.observe(targetRef.current);

			return () => {
				observer.disconnect();
			};
		}
	}, [loading, nextLoad]);

	// 이모지 보내기
	useEffect(() => {
		if (renderRef.current) {
			renderRef.current = false;
			return;
		}
		const emojiDataSend = async () => {
			try {
				const dataSend = await postRecipientsReactions(id, selectedEmoji);
				setEmojiSend(dataSend);
			} catch (error) {
				console.error('Post page 데이터 불러오기 실패!', error);
			}
		};
		setReLoading((prev) => !prev);
		emojiDataSend();
	}, [selectedEmoji]);

// 메세지 삭제하기
const handleDeleteMessage = async (messageId) => {
  const confirmDelete = window.confirm('정말 이 메시지를 삭제할까요?');
  if (!confirmDelete) return;

  try {
    const success = await deleteMessage(messageId);

    if (success) {
      alert('삭제되었습니다.');
      
      // 삭제 후에 메시지 새로 불러오기
      setOffset(0);  // offset 리셋, 전체 목록을 처음부터 다시 불러오기
      const { next, results } = await getRecipientsMessage(id, 0, limit);
      setMessages(results); // 새로 덮어쓰기
      setNextLoad(next);
    } else {
      alert('삭제 실패!');
    }
  } catch (error) {
    console.error(error);
    alert('삭제 실패!');
  }
};

// 롤링페이지 지우기
const handleDeleteRollingPage = async (pageId) => {
  const confirmDelete = window.confirm('정말 이 롤링페이지를 삭제할까요?');
  if (!confirmDelete) return;

  try {
    const success = await deleteRecipient(pageId);

    if (success) {
      alert('롤링페이지가 삭제되었습니다.');

      // 삭제 후 목록 페이지로 이동
      navigate('/list');
    } else {
      alert('삭제 실패!');
    }
  } catch (error) {
    console.error(error);
    alert('삭제 실패!');
  }
};

return (
  <>
    <Header />
    {headerLoad ? (
      <h1>로딩중...</h1>
    ) : (
      <PostHeader
        userId={id}
        userName={name}
        messageCount={messageCount}
        reactionCount={reactionCount}
        recentMessage={recentMessages}
        topReactions={topReactions}
        setSelectedEmoji={setSelectedEmoji}
        setReLoading={setReLoading}
      />
    )}


    <section className={style.post__content} style={background}>
    <button
      className={style.button__delete_rolling_page}
      onClick={(e) => {
        e.stopPropagation();
        handleDeleteRollingPage(id);
      }}
    >
      삭제하기
    </button>
      <div className={style.card__wrap}>
        {/* 메시지가 있을 때만 메시지 카드 렌더링 */}
        {messageCount > 0 &&
          messages.map((message) => (
            <div key={message.id} className={style.card__wrapper_with_delete}>
              {/* 메시지 카드 */}
              <Card
                id={message.id}
                sender={message.sender}
                relationship={message.relationship}
                profileImg={message.profileImageURL}
                cardFont={message.font}
                content={message.content}
                createdAt={message.createdAt}
                onClick={() => {
                  setShowModal(true);
                  setModalItem(message);
                }}
              />
              {/* 딜리트 버튼 */}
              {!showModal && (
                <button
                  className={style.button__delete_card}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteMessage(message.id);
                  }}
                >
                  <img
                    src={deleteButtonImage}
                    alt="카드 삭제"
                  />
                </button>
              )}
            </div>
          ))}
      </div>

      {/* 모달 */}
      {showModal && (
        <PostModal>
          <ModalItem
            sender={modalItem.sender}
            relationship={modalItem.relationship}
            profileImg={modalItem.profileImageURL}
            cardFont={modalItem.font}
            content={modalItem.content}
            createdAt={modalItem.createdAt}
            onClose={() => {
              setShowModal(false);
            }}
          />
        </PostModal>
      )}

      {/* 인피니티 스크롤 타겟 */}
      <div className={style.observer__target} ref={targetRef}></div>
    </section>
  </>
)};

export default EditPage;
