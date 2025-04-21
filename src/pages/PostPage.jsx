import { useParams } from 'react-router-dom';
import PostHeader from '../components/Layout/post-components/PostHeader';
import { getRecipientsData, getRecipientsMessage } from '../api/recipients-api';
import { useEffect, useRef, useState } from 'react';
import style from '../styles/PostPage.module.css';
import Card from '../components/Card';

const PostPage = () => {
	const [data, setData] = useState({});
	const [headerLoad, setHeaderLoad] = useState(true);
	const [loading, setLoading] = useState(false);
	const [messages, setMessages] = useState([]);
	const [nextLoad, setNextLoad] = useState('');
	const [offset, setOffset] = useState(0);
	const [limit, setLimit] = useState(5);
	const { id } = useParams();
	const { name, backgroundColor, backgroundImageURL, messageCount, recentMessages, topReactions } = data;
	const background = backgroundColor ? { backgroundColor } : { backgroundImageURL };
	const targetRef = useRef(null);

	const loadMore = () => {
		setOffset((prev) => prev + 5);
		setLimit((prev) => prev + 6);
	};

	// 롤링 페이퍼 기본 데이터 불러오기
	useEffect(() => {
		const postDataCall = async () => {
			try {
				const dataCall = await getRecipientsData(id);
				setData(dataCall);
				console.log('mounting');
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
				{ threshold: 1 }
			);
			observer.observe(targetRef.current);

			return () => {
				observer.disconnect();
			};
		}
	}, [loading, nextLoad]);

	return (
		<>
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

			<section className={style.post__content} style={background}>
				<div className={style.card__wrap}>
					<Card userId={id} />
					{messageCount === 0 ? (
						<h3>불러올 메세지가 없습니다.</h3>
					) : (
						messages.map((message) => {
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
								/>
							);
						})
					)}
				</div>
				<div className={style.ovserver__target} ref={targetRef}>
					...로딩중
				</div>
			</section>
		</>
	);
};

export default PostPage;
