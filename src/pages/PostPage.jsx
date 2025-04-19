import { useParams } from 'react-router-dom';
import PostHeader from '../components/Layout/post-components/PostHeader';
import { getRecipientsData, getRecipientsMessage } from '../api/recipients-api';
import { useEffect, useState } from 'react';
import style from '../styles/PostPage.module.css';
import Card from '../components/Card';

const PostPage = () => {
	const [data, setData] = useState({});
	const [load, setLoad] = useState(true);
	const { id } = useParams();
	const { name, backgroundColor, backgroundImageURL, messageCount, recentMessages, topReactions } = data;
	const background = backgroundColor ? { backgroundColor } : { backgroundImageURL };

	// 롤링 페이퍼 기본 데이터 불러오기
	useEffect(() => {
		const postDataCall = async () => {
			try {
				const dataCall = await getRecipientsData();
				const [filterUser] = dataCall.results.filter((user) => user.id === Number(id));
				setData(filterUser);
			} catch (error) {
				console.error('Post page 데이터 불러오기 실패!', error);
			} finally {
				setLoad(false);
			}
		};
		postDataCall();
	}, []);

	// 해당 롤링 페이퍼에 보내진 메세지 가져오기
	useEffect(() => {
		const postMessagesCall = async () => {
			try {
				const messagesCall = await getRecipientsMessage(id);
				console.log(messagesCall);
			} catch (error) {
				console.error('messages 불러오기 실패', error);
			}
		};

		postMessagesCall();
	}, []);

	return (
		<>
			{load ? (
				<h1>로딩중...</h1>
			) : (
				<PostHeader
					userName={name}
					messageCount={messageCount}
					recentMessage={recentMessages}
					topReactions={topReactions}
				/>
			)}

			<div className={style.post__content} style={background}>
				<div className={style.card__wrap}>
					<Card userId={id} />
				</div>
			</div>
		</>
	);
};

export default PostPage;
