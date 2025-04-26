import style from '../../../styles/Layout/PostHeader.module.css';
import RecentMessage from './RecentMessage';
import TopReactions from './TopReactions';
import arrow from '/icons/arrow_down.png';
import addEmoji from '/icons/add.png';
import share from '/icons/share.png';
import ShareMenu from './ShareMenu';
import { useRef, useState } from 'react';
import { useEffect } from 'react';
import EmojiPicker from 'emoji-picker-react';
import EmojiDropDown from './EmojiDropDown';

const PostHeader = ({
	userId,
	userName,
	messageCount,
	recentMessage,
	reactionCount,
	topReactions,
	setSelectedEmoji,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [isEmojiOpen, setIsEmojiOpen] = useState(false);
	const [isMoreEmoji, setIsMoreEmoji] = useState(false);

	const emojiMoreRef = useRef(null);
	const emojiPickerRef = useRef(null);
	const shareButtonRef = useRef(null);

	const handleClick = () => {
		setIsOpen(!isOpen);
	};

	const handleEmojiOpen = () => {
		setIsEmojiOpen(!isEmojiOpen);
	};

	const handleEmojiClick = (emojiData) => {
		const newReaction = {
			emoji: emojiData.emoji,
			type: 'increase',
		};
		setSelectedEmoji(newReaction);
	};

	const handleMoreEmoji = () => {
		setIsMoreEmoji(!isMoreEmoji);
	};

	const handleOutsideClick = (event) => {
		if (shareButtonRef.current && !shareButtonRef.current.contains(event.target)) {
			setIsOpen(false);
		}

		if (emojiMoreRef.current && !emojiMoreRef.current.contains(event.target)) {
			setIsMoreEmoji(false);
		}

		if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
			setIsEmojiOpen(false);
		}
	};

	useEffect(() => {
		document.addEventListener('click', handleOutsideClick);
		return () => {
			document.removeEventListener('click', handleOutsideClick);
		};
	}, [isOpen, isEmojiOpen, isMoreEmoji]);

	return (
		<div className={style.wrap}>
			<h2 className={style.user__name}>To. {userName}</h2>

			<div className={style.section__divider}></div>

			<div className={style.post__business_section}>
				<div className={style.recent__message__section}>
					{!messageCount ? '' : <RecentMessage recentMessage={recentMessage} messageCount={messageCount} />}
				</div>

				<div className={`${style.divider} ${style.first__divider}`}></div>

				<TopReactions id={userId} topReactions={topReactions} />

				{!reactionCount ? (
					''
				) : (
					<div className={style.reaction__wrap}>
						<button className={style.emoji__total} type='button' onClick={handleMoreEmoji} ref={emojiMoreRef}>
							<img src={arrow} alt='이모지 더 보기' />
						</button>
						{isMoreEmoji && <EmojiDropDown id={userId} />}
					</div>
				)}

				<ul className={style.button__list}>
					<li className={style.emoji__add__list}>
						<button className={style.emoji__add} type='button' onClick={handleEmojiOpen} ref={emojiPickerRef}>
							<img src={addEmoji} alt='이모지 추가' />
							<span>추가</span>
						</button>
						{isEmojiOpen && (
							<div className={style.emoji__picker}>
								<EmojiPicker
									width={307}
									height={393}
									onEmojiClick={(emojiData, event) => handleEmojiClick(emojiData, event)}
								/>
							</div>
						)}
					</li>
					<li className={style.divider}></li>
					<li className={style.share__list}>
						<button className={style.share} type='button' ref={shareButtonRef} onClick={handleClick}>
							<img src={share} alt='공유하기' />
						</button>
						{isOpen && <ShareMenu onClick={handleClick} />}
					</li>
				</ul>
			</div>
		</div>
	);
};

export default PostHeader;
