import { useEffect } from 'react';
import style from '../styles/ModalItem.module.css';

const RELATIONSHIP_COLORS = {
	가족: {
		bg: 'rgba(228, 251, 220, 1)',
		color: 'rgba(43, 166, 0, 1)',
	},
	친구: {
		bg: 'rgba(226, 245, 255, 1)',
		color: 'rgba(0, 162, 254, 1)',
	},
	지인: {
		bg: 'rgba(255, 240, 214, 1))',
		color: 'rgba(255, 136, 50, 1)',
	},
	동료: {
		bg: 'rgba(248, 240, 255, 1)',
		color: 'rgba(153, 53, 255, 1)',
	},
};

const ModalItem = ({ sender, relationship, profileImg, cardFont, content, createdAt, onClose }) => {
	const date = String(createdAt).replaceAll('-', '.');
	const textIndex = date.indexOf('T', 0);
	const createdDate = date.slice(0, textIndex);
	const relationshipColor = RELATIONSHIP_COLORS[relationship];

	useEffect(() => {
		// 모달이 열릴 때 스크롤을 고정하는 코드
		document.body.style.cssText = `
    position: fixed; 
    top: -${window.scrollY}px;
    overflow-y: scroll;
    width: 100%;`;
		return () => {
			const scrollY = document.body.style.top;
			document.body.style.cssText = '';
			window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
		};
	}, []);
	return (
		<div className={style.modal__item} style={{ fontFamily: cardFont }}>
			<div className={style.modal__info}>
				<div className={style.sender}>
					<img className={style.sender__img} src={profileImg} alt='메세지 보낸 유저 이미지' />
					<div className={style.sender__name}>
						<h3>
							From. <span>{sender}</span>
						</h3>
						<div
							className={style.relationship}
							style={{ backgroundColor: relationshipColor.bg, color: relationshipColor.color }}>
							{relationship}
						</div>
					</div>
				</div>
				<p className={style.send__date}>{createdDate}</p>
			</div>
			<p className={style.content}>{content}</p>
			<button className={style.closeBtn} type='button' onClick={onClose}>
				확인
			</button>
		</div>
	);
};

export default ModalItem;
