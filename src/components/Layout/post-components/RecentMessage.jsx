import style from '../../../styles/Layout/RecentMessage.module.css';

const RecentMessage = ({ recentMessage, messageCount }) => {
	return (
		<>
			<div className={style.recent__message__wrap}>
				{recentMessage?.map((item) => {
					return <img key={item.id} src={item.profileImageURL} className={style.recent__message__img} />;
				})}

				{messageCount < 3 ? '' : <div className={style.message__count}>{`+${messageCount - 3}`}</div>}
			</div>
			<div className={style.count__comment}>
				{messageCount}
				<span>명이 작성했어요!</span>
			</div>
		</>
	);
};

export default RecentMessage;
