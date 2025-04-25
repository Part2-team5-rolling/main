import { useContext } from 'react';
import style from '../../../styles/ShareMenu.module.css';
import { ToastContext } from '../../../hooks/ToastContextProvider';

const ShareMenu = ({ onClick }) => {
	const currentUrl = window.location.href;
	const { showToast } = useContext(ToastContext);

	const handleCopyUrl = () => {
		navigator.clipboard
			.writeText(currentUrl)
			.then(() => {
				showToast('URL이 복사되었습니다.');
			})
			.catch((err) => {
				console.error('Failed to copy: ', err);
			});
	};

	return (
		<>
			<ul className={style.share__text__wrap}>
				<li className={style.share__text} onClick={onClick}>
					카카오톡 공유
				</li>
				<li
					className={style.share__text__desc}
					onClick={() => {
						onClick();
						handleCopyUrl();
					}}>
					URL 공유
				</li>
			</ul>
		</>
	);
};

export default ShareMenu;
