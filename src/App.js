import './App.css';
import QuizPage from './pages/QuizPage';
import { Analytics } from '@vercel/analytics/react';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import Blogs from './pages/Blogs';
import CreateAndEditBlog from './pages/CreateAndEditBlog';
import BlogDetail from './pages/BlogDetail';
import Profile from './pages/Profile';
import GamesPage from './pages/GamesPage';


function App() {

  return (
    <Router>
      <Navbar />
      <div className="App">
        <Routes>
          <Route path="/auth/register" element={<RegisterPage />} />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/create" element={<CreateAndEditBlog />} />
          <Route path="/blogs/edit/:id" element={<CreateAndEditBlog />} />
          <Route path="/blogs/:id" element={<BlogDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/games/daily-quiz" element={<QuizPage />} />
          <Route path="*" element={<Navigate to="/games" replace />} />
        </Routes>
      </div>
      <Analytics />
    </Router>
  );
}

export default App;
