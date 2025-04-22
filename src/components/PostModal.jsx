import { createPortal } from 'react-dom';
import style from '../styles/PostModal.module.css';

const PostModal = ({ children }) => {
	const el = document.getElementById('modal');
	return createPortal(
		<div className={style.modal}>
			<div className={style.modal__content}>{children}</div>
		</div>,
		el
	);
};

export default PostModal;
