import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ListPage from './pages/ListPage';
import PostPage from './pages/PostPage';
import SendMessagePage from './pages/SendMessagePage';
import RollingPaperPage from './pages/RollingPaperPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/list" element={<ListPage />} />
        <Route path='/post/:id' element={<PostPage />} />
        <Route path='/post' element={<RollingPaperPage />} />
        <Route path='/post/:id/message' element={<SendMessagePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
