import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { ToastContextProvider } from './hooks/ToastContextProvider';

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<ToastContextProvider>
			<App />
		</ToastContextProvider>
	</StrictMode>
);
