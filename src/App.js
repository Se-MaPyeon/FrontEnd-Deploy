import React, { useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './assets/css/App.css';
import Footer from './component/Footer';
import LoginPage from './component/LoginPage';
import MainPage from './component/MainPage';
import Header from './component/Header';
import MyPage from './component/MyPage';
import { AuthProvider, AuthContext } from './context/AuthContext';

function App() {
  // 스크롤
  useEffect(() => {
    const handleScroll = () => {
      const appElement = document.querySelector('.app');
      if (appElement) {
        if (window.scrollY > 100) {
          appElement.classList.add('scrolled');
        } else {
          appElement.classList.remove('scrolled');
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Header />
          <main className="content" style={{ minHeight: '940px' }}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/main" element={<PrivateRoute><MainPage /></PrivateRoute>} />
              <Route path="/mypage" element={<PrivateRoute><MyPage /></PrivateRoute>} />
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

const PrivateRoute = ({ children }) => {
  const { isLogin } = useContext(AuthContext);
  return isLogin ? children : <Navigate to="/login" />;
};

export default App;