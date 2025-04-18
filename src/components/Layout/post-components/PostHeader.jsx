import style from '../../../styles/Layout/PostHeader.module.css';
import RecentMessage from './RecentMessage';
import TopReactions from './TopReactions';
import arrow from '/icons/arrow_down.png';
import addEmoji from '/icons/add.png';
import share from '/icons/share.png';

const PostHeader = ({ userName, messageCount, recentMessage, topReactions }) => {
	return (
		<div className={style.wrap}>
			<h2 className={style.user__name}>To. {userName}</h2>

			<div className={style.section__divider}></div>

			<div className={style.post__business_section}>
				<div className={style.recent__message__section}>
					{!messageCount ? '' : <RecentMessage recentMessage={recentMessage} messageCount={messageCount} />}
				</div>

				<div className={`${style.divider} ${style.first__divider}`}></div>

				<TopReactions topReactions={topReactions} />

				{!messageCount ? (
					''
				) : (
					<button className={style.emoji__total} type='button'>
						<img src={arrow} alt='이모지 더 보기' />
					</button>
				)}

				<button className={style.emoji__add} type='button'>
					<img src={addEmoji} alt='이모지 추가' />
					<span>추가</span>
				</button>

				<div className={style.divider}></div>

				<button className={style.share} type='button'>
					<img src={share} alt='공유하기' />
				</button>
			</div>
		</div>
	);
};

export default PostHeader;
