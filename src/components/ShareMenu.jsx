import style from '../styles/ShareMenu.module.css';

const ShareMenu = ({ onClick }) => {
	return (
		<ul className={style.share__text__wrap}>
			<li className={style.share__text} onClick={onClick}>
				카카오톡 공유
			</li>
			<li className={style.share__text__desc} onClick={onClick}>
				URL 공유
			</li>
		</ul>
	);
};

export default ShareMenu;
