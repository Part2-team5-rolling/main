import { Link } from 'react-router-dom';
import style from '../styles/Card.module.css';
import plus from '/icons/plus.png';

const Card = ({ userId, id, sender, relationship, profileImg, cardFont, content, createdAt }) => {
	const date = String(createdAt).replaceAll('-', '.');
	const textIndex = date.indexOf('T', 0);
	const createdDate = date.slice(0, textIndex);

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
				<div className={style.message__card}>
					<div className={style.message__wrap} key={id} style={{ fontFamily: cardFont }}>
						<div className={style.message__user}>
							<img src={profileImg} alt='메세지 보낸 유저 이미지' />
							<div>
								<h3 className={style.user__name}>
									From. <span>{sender}</span>
								</h3>
								<div className={style.user__relationship}>{relationship}</div>
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
