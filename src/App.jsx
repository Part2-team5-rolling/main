import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ListPage from './pages/ListPage';
import PostPage from './pages/PostPage';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/list' element={<ListPage />} />
				<Route path='/post/:id' element={<PostPage />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
