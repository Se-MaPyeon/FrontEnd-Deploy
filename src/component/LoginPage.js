import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../assets/css/LoginBox.css';

function LoginPage() {
  const { isLogin, handleLogin } = useContext(AuthContext); 
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await handleLogin(id, pw);
    } catch (error) {
      alert('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLogin) {
      navigate('/main');
    }
  }, [isLogin, navigate]);

  return (
    <div className="login_container">
      <h2 className="welcome-text">Se-MaPyeon에 오신 것을 환영합니다</h2>
      <div className="login-form">
        <h2>로그인</h2>
        <p>(세종대학교 포털 <strong>ID/PW</strong>와 동일)</p>
        <form onSubmit={onSubmit}>
          <div className="input-container">
            <input 
              type="text" 
              id="id" 
              name="id" 
              placeholder="ID" 
              value={id}
              onChange={(e) => setId(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="input-container">
            <input 
              type="password" 
              id="pw" 
              name="pw" 
              placeholder="PW" 
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              disabled={loading}
            />
          </div>
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
