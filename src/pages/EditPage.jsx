import { useParams, useNavigate } from 'react-router-dom';
import PostHeader from '../components/Layout/post-components/PostHeader';
import { getRecipientsData, getRecipientsMessage, deleteMessage, deleteRecipient  } from '../api/recipients-api';
import { useEffect, useRef, useState } from 'react';
import style from '../styles/PostPage.module.css';
import Card from '../components/Card';
import PostModal from '../components/PostModal';
import ModalItem from '../components/ModalItem';
import Header from '../components/common/Header';
import '../styles/EditPage.css'
import deleteButtonImage from '../assets/edit-delete--card.png'

const EditPage = () => {
  const [data, setData] = useState({});
  const [headerLoad, setHeaderLoad] = useState(true);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [nextLoad, setNextLoad] = useState('');
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(5);
  const [showModal, setShowModal] = useState(false);
  const [modalItem, setModalItem] = useState(false);
  const { id } = useParams();
  const { name, backgroundColor, backgroundImageURL, messageCount, recentMessages, topReactions } = data;
  const background = backgroundColor ? { backgroundColor } : { backgroundImageURL };
  const targetRef = useRef(null);
  const navigate = useNavigate();


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
        navigate('/list'); // 목록 페이지로 리디렉션
      } else {
        alert('삭제 실패!');
      }
    } catch (error) {
      console.error(error);
      alert('삭제 실패!');
    }
  };


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
      console.log('removeEventListener');
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
  }, [id]);

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

  return (
    <>
      <Header />
      {headerLoad ? (
        <h1>로딩중...</h1>
      ) : (
        <PostHeader
          userName={name}
          messageCount={messageCount}
          recentMessage={recentMessages}
          topReactions={topReactions}
        />
      )}
          <button
            className='button--delete-rolling-page'
            onClick={(e) => {
              e.stopPropagation(); // 카드 클릭 막기
              handleDeleteRollingPage(id); // 해당 롤링페이지 삭제
            }}
          >
            삭제하기
          </button>
      <section className={style.post__content} style={background}>
        <div className={style.card__wrap}>
          {messageCount === 0 ? (
            <h3>불러올 메세지가 없습니다.</h3>
          ) : (
            messages.map((message) => (
              <div key={message.id} style={{ position: 'relative', display: 'inline-block' }}>
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
                <button className='button--delete-card'
                  onClick={(e) => {
                    e.stopPropagation(); // 카드 클릭 막기
                    handleDeleteMessage(message.id);
                  }}
                >
                  <img
                    src={deleteButtonImage}
                    alt="카드 삭제"
                  />
                </button>
              </div>
            ))
          )}
        </div>
  
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
  
        <div className={style.ovserver__target} ref={targetRef}>
          ...로딩중
        </div>
      </section>
    </>
  )};

export default EditPage;
