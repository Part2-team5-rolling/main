import { useRef, useState, createContext } from 'react';
import ToastPortal from '../components/ToastPortal';
export const ToastContext = createContext(null);
export const ToastContextProvider = ({ children }) => {
	const [message, setMessage] = useState('');
	const [isOpenToast, setIsOpenToast] = useState(false);
	const timerRef = useRef(null);

	const showToast = (message) => {
		setIsOpenToast(true);
		setMessage(message);

		if (timerRef.current) {
			clearTimeout(timerRef.current);
		}

		const timer = setTimeout(() => {
			setIsOpenToast(false);
			setMessage('');
		}, 5000);

		timerRef.current = timer;
	};

	return (
		<ToastContext.Provider value={{ showToast, setIsOpenToast }}>
			{children}
			{isOpenToast && <ToastPortal message={message} />}
		</ToastContext.Provider>
	);
};
