import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ListPage from './pages/ListPage';
import PostPage from './pages/PostPage';
import SendMessagePage from './pages/SendMessagePage';
import RollingPaperPage from './pages/RollingPaperPage';
import EditPage from './pages/EditPage';
import ErrorBoundary from './components/common/ErrorBoundary';
import ErrorPage from './pages/ErrorPage';

function App() {
  return (
    <ErrorBoundary fallback={<ErrorPage />}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/list" element={<ListPage />} />
          <Route path='/post/:id' element={<PostPage />} />
          <Route path='/post' element={<RollingPaperPage />} />
          <Route path='/post/:id/message' element={<SendMessagePage />} />
          <Route path='/post/:id/edit' element={<EditPage />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
