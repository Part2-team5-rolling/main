import { useParams } from 'react-router-dom';
import PostHeader from '../components/Layout/post-components/PostHeader';
import { getRecipientsData } from '../api/recipients-api';
import { useEffect, useState } from 'react';

const PostPage = () => {
	const [data, setData] = useState({});
	const [load, setLoad] = useState(true);
	const { id } = useParams();

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

	const { name, backgroundColor, backgroundImageURL, messageCount, recentMessages, topReactions } = data;
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

			<div>Post Page</div>
		</>
	);
};

export default PostPage;
