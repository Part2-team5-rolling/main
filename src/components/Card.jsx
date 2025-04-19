import { Link } from 'react-router-dom';
import style from '../styles/Card.module.css';
import plus from '/icons/plus.png';

const Card = ({ userId }) => {
	return (
		<div className={style.card}>
			{userId ? (
				<div className={style.card__link__button}>
					<Link to={`/post/${userId}/message`}>
						<img src={plus} alt='edit 페이지 이동 버튼' />
					</Link>
				</div>
			) : (
				<div></div>
			)}
		</div>
	);
};
export default Card;
