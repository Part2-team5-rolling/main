import { useContext } from 'react';
import { createPortal } from 'react-dom';
import { ToastContext } from '../hooks/ToastContextProvider';
import style from '../styles/ToastPortal.module.css';
import completed from '/icons/completed.png';
import close from '/icons/close.png';

const ToastPortal = ({ message }) => {
	const { setIsOpenToast } = useContext(ToastContext);
	return createPortal(
		<div className={style.toast__wrap}>
			<div className={style.toast}>
				<div className={style.toast__message}>
					<img src={completed} className={style.toast__icon} />
					<span>{message}</span>
				</div>
				<button className={style.toast__close} onClick={() => setIsOpenToast(false)}>
					<img src={close} alt='토스트 메시지 닫기' />
				</button>
			</div>
		</div>,
		document.getElementById('root')
	);
};

export default ToastPortal;
