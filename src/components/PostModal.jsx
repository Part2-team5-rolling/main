import { createPortal } from 'react-dom';
import style from '../styles/PostModal.module.css';

const PostModal = ({ children, onClick }) => {
	const el = document.getElementById('root');
	return createPortal(
		<div className={style.modal} onClick={onClick}>
			<div className={style.modal__content}>{children}</div>
		</div>,
		el
	);
};

export default PostModal;
