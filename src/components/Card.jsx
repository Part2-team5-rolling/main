import { Link } from 'react-router-dom';
import style from '../styles/Card.module.css';
import plus from '/icons/plus.png';

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

const Card = ({ userId, id, sender, relationship, profileImg, cardFont, content, createdAt, onClick }) => {
	const date = String(createdAt).replaceAll('-', '.');
	const textIndex = date.indexOf('T', 0);
	const createdDate = date.slice(0, textIndex);
	const relationshipColor = RELATIONSHIP_COLORS[relationship];

	return (
		<>
			{!sender ? (
				<div className={style.card}>
					<div className={style.card__link__button}>
						<Link to={`/post/${userId}/message`}>
							<img src={plus} alt='edit 페이지 이동 버튼' />
						</Link>
					</div>
				</div>
			) : (
				<div className={style.message__card} onClick={onClick}>
					<div className={style.message__wrap} key={id} style={{ fontFamily: cardFont }}>
						<div className={style.message__user}>
							<img src={profileImg} alt='메세지 보낸 유저 이미지' />
							<div>
								<h3 className={style.user__name}>
									From. <span>{sender}</span>
								</h3>
								<div
									className={style.user__relationship}
									style={{ backgroundColor: relationshipColor.bg, color: relationshipColor.color }}>
									{relationship}
								</div>
							</div>
						</div>
						<p className={style.content}>{content}</p>
						<p className={style.createdAt}>{createdDate}</p>
					</div>
				</div>
			)}
		</>
	);
};
export default Card;
