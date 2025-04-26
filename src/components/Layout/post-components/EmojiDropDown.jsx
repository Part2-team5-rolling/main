import { useEffect, useState } from 'react';
import { getRecipientsReactions } from '../../../api/recipients-api';
import style from '../../../styles/Layout/EmojiDropDown.module.css';

const EmojiDropDown = ({ id }) => {
	const [reactions, setReactions] = useState([]);
	const sliceReaction = reactions.results?.slice(0, 8);

	useEffect(() => {
		const getReactionCall = async () => {
			try {
				const dataCall = await getRecipientsReactions(id);
				setReactions(dataCall);
			} catch (error) {
				console.error('Post page 데이터 불러오기 실패!', error);
			}
		};
		getReactionCall();
	}, []);

	return (
		<div className={style.emoji__dropdown}>
			{sliceReaction?.map((item) => {
				return (
					<div key={item.id} className={style.emoji__wrap}>
						<span>{item.emoji}</span>
						<span className={style.emoji__count}>{item.count}</span>
					</div>
				);
			})}
		</div>
	);
};

export default EmojiDropDown;
