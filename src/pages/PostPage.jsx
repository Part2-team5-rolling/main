import { Link, useParams } from 'react-router-dom';
import PostHeader from '../components/Layout/post-components/PostHeader';
import { getRecipientsData, getRecipientsMessage, postRecipientsReactions } from '../api/recipients-api';
import { useEffect, useRef, useState } from 'react';
import style from '../styles/PostPage.module.css';
import Card from '../components/Card';
import PostModal from '../components/PostModal';
import ModalItem from '../components/ModalItem';
import Header from '../components/common/Header';

const colorMap = {
	beige: '#FFE2AD',
	purple: '#ECD9FF',
	blue: '#B1E4FF',
	green: '#D0F5C3',
};

const PostPage = () => {
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
	const [EmojiSend, setEmojiSend] = useState({});
	const { id } = useParams();
	const { name, backgroundColor, backgroundImageURL, messageCount, reactionCount, recentMessages, topReactions } = data;
	const background =
		backgroundColor && backgroundImageURL
			? { backgroundImage: `url(${backgroundImageURL})` }
			: { backgroundColor: colorMap[backgroundColor] };
	const targetRef = useRef(null);
	const renderRef = useRef(true);

	console.log(background);
	console.log(backgroundImageURL);

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
	}, [id, selectedEmoji]);

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
		emojiDataSend();
	}, [selectedEmoji]);

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
				/>
			)}

			<section className={style.post__content} style={background}>
				<div className={style.card__wrap}>
					<Card userId={id} />
					{messageCount === 0
						? ''
						: messages.map((message) => {
								return (
									<Card
										key={message.id}
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
								);
						  })}
				</div>

				<Link to={`/post/${id}/edit`} className={style.edit__Link}>
					수정하기
				</Link>

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
				<div className={style.observer__target} ref={targetRef}></div>
			</section>
		</>
	);
};

export default PostPage;
